// AUTH_LOGOUT_STATUS_CODES intentionally not used here — all checks are explicit status === 401
// to ensure 502/503 server errors during deployments never trigger a logout.
import authService from '@/services/authService';
import { profileService } from '@/services/profileService';
import { isLoginRoute, isPublicRoute } from '@/utils/routeUtils';
import { ROUTES } from '@/constants/routes';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { reportError } from '@/services/errorTelemetry';
import { tokenStorage } from '@/services/tokenStorage';
import { Analytics } from '@/services/analytics';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Profile } from '@/models/profileModel';

// Define types for our auth context
interface User {
  id: string;
  phone_number?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  auth_provider?: 'google' | 'facebook' | 'phone';
  profile_picture?: string;
  is_profile_complete: boolean;
  is_admin?: boolean;
  is_super_admin?: boolean;
  education_track?: 'K12' | 'UG' | 'EXAM_PREP';
  feature_flags?: Record<string, boolean>;
}

// Define types for API responses
interface ApiResponse {
  data?: {
    access?: string;
    refresh?: string;
    user?: User;
    [key: string]: unknown;
  };
  access?: string;
  refresh?: string;
  user?: User;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestOtp: (phoneNumber: string) => Promise<ApiResponse>;
  verifyOtp: (phoneNumber: string, otpCode: string) => Promise<ApiResponse>;
  googleLogin: (idToken: string) => Promise<ApiResponse>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  requestOtp: async () => ({}),
  verifyOtp: async () => ({}),
  googleLogin: async () => ({}),
  logout: () => {},
  checkAuth: async () => false,
});

// Access token lifetime on backend is 2 hours. Refresh token is 90 days.
// We consider access token stale after 1.5 hours to trigger proactive refresh.
const ACCESS_TOKEN_MAX_AGE_MS = 1.5 * 60 * 60 * 1000; // 1.5 hours
// Refresh token considered expired after 89 days (1-day safety margin from 90-day backend lifetime)
const REFRESH_TOKEN_MAX_AGE_MS = 89 * 24 * 60 * 60 * 1000; // 89 days

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to store auth tokens persistently (native + localStorage)
  const storeTokens = async (access: string, refresh: string) => {
    await tokenStorage.storeTokens(access, refresh);
    console.log('[AuthContext] Tokens stored persistently.');
  };

  // Helper to set user data in persistent storage and context state
  const setUserDataAndState = async (userObj: User) => {
    await tokenStorage.storeUser(userObj);
    setUser(userObj);
    setIsAuthenticated(true);
    console.log('[AuthContext] User data stored and context state updated.');
  };

  // Helper to check if access token is stale (sync check using localStorage)
  const isAccessTokenStale = useCallback(() => {
    const timestamp = localStorage.getItem('tokenTimestamp');
    if (!timestamp) return true;
    const age = Date.now() - parseInt(timestamp, 10);
    return age > ACCESS_TOKEN_MAX_AGE_MS;
  }, []);

  // Logout
  const logout = useCallback(() => {
    Analytics.logout();

    // Fire-and-forget: deactivate push tokens on backend before clearing auth
    import('@/services/apiClient').then(({ api: a }) => {
      import('@/constants/apiEndpoints').then(({ API_ENDPOINTS }) => {
        a.delete(API_ENDPOINTS.PUSH_TOKEN, { suppressErrorToast: true }).catch(() => {});
      }).catch(() => {});
    }).catch(() => {});

    // Clear persistent storage (async but fire-and-forget for logout)
    tokenStorage.clearAll().catch(() => {});
    
    if (typeof window !== 'undefined') {
      // Only redirect if not on a public route
      const path = window.location.pathname;
      const isPublicPath = isPublicRoute(path);
      console.log(`[AuthContext] Logout called on path: ${path}, isPublic: ${isPublicPath}`);
      
      if (!isPublicPath && !isLoginRoute(path)) {
        console.log('[AuthContext] Redirecting to login page after logout');
        window.location.href = ROUTES.LOGIN;
      } else {
        console.log('[AuthContext] No redirect needed for public route after logout');
      }
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Helper to convert Profile to User shape for AuthContext
  function profileToUser(profile: Profile): User {
    // Use type assertion for optional fields that may not exist on Profile
    const p = profile as unknown as Record<string, unknown>;
    return {
      id: profile.id,
      phone_number: (p.phone_number as string) || '',
      email: profile.email || '',
      first_name: (p.first_name as string) || '',
      last_name: (p.last_name as string) || '',
      auth_provider: (p.auth_provider as 'google' | 'facebook' | 'phone') || undefined,
      profile_picture: (p.profile_picture as string) || undefined,
      is_profile_complete: (p.is_profile_complete as boolean) ?? false,
      is_admin: (p.is_admin as boolean) ?? false,
      is_super_admin: (p.is_super_admin as boolean) ?? false,
      feature_flags: (p.feature_flags as Record<string, boolean>) || {},
    };
  }

  // Check if user is authenticated by validating stored tokens
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      // Hydrate localStorage from native storage first
      await tokenStorage.hydrate();
      
      const token = await tokenStorage.getAccessToken();
      const userData = await tokenStorage.getUser();
      if (!token || !userData) {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
      let parsedUserData;
      try {
        parsedUserData = JSON.parse(userData);
      } catch {
        await tokenStorage.clearAll();
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
      // If access token is stale, try refresh before giving up
      if (isAccessTokenStale()) {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            const { default: axios } = await import('axios');
            const { getApiBaseUrl } = await import('@/utils/api');
            const resp = await axios.post(`${getApiBaseUrl()}${API_ENDPOINTS.REFRESH_TOKEN}`, { refresh: refreshToken });
            if (resp.data?.data?.access || resp.data?.access) {
              const newAccess = resp.data?.data?.access || resp.data?.access;
              const newRefresh = resp.data?.data?.refresh || resp.data?.refresh;
              if (newRefresh) {
                await tokenStorage.storeTokens(newAccess, newRefresh);
              } else {
                await tokenStorage.updateAccessToken(newAccess);
              }
              console.log('[AuthContext] checkAuth: Token refreshed successfully.');
            } else {
              throw new Error('Invalid refresh response');
            }
          } catch (refreshErr) {
            const refreshStatus = (refreshErr as { response?: { status?: number } })?.response?.status;
            if (refreshStatus === 401) {
              // Refresh token is genuinely expired/invalid → must re-login
              console.log('[AuthContext] checkAuth: Refresh token rejected (401). Clearing auth.');
              logout();
              return false;
            }
            // 5xx / network error during refresh → backend may be restarting. Keep user logged in.
            console.warn('[AuthContext] checkAuth: Token refresh failed (transient). Keeping auth state.', refreshErr);
          }
        } else {
          logout();
          return false;
        }
      }
      // Try to verify token with backend (getProfile)
      try {
        const profileResponse = await profileService.getProfile();
        if (profileResponse) {
          const freshUser = profileToUser(profileResponse);
          await setUserDataAndState(freshUser);
          return true;
        }
      } catch (err) {
        // Only logout on confirmed 401 (token genuinely invalid).
        // 403, 5xx, network errors, 502/503 during deployments → keep user authenticated.
        const error = err as { response?: { status?: number } };
        const status = error?.response?.status;
        if (status === 401) {
          setUser(null);
          setIsAuthenticated(false);
          return false;
        }
        // For all other errors (network, 404, 400, 5xx), keep user authenticated with cached data
        setUser(parsedUserData);
        setIsAuthenticated(true);
        return true;
      }
      setUser(parsedUserData);
      setIsAuthenticated(true);
      return true;
    } catch (outerErr) {
      // Only clear auth if we can confirm the error is a true auth failure.
      // A generic exception here could be a parsing error, network blip, etc.
      const outerStatus = (outerErr as { response?: { status?: number } })?.response?.status;
      if (outerStatus === 401) {
        await tokenStorage.clearAll();
        setUser(null);
        setIsAuthenticated(false);
      }
      // For any other unexpected error, don't clear auth — fail safe to staying logged in
      return false;
    }
  }, [isAccessTokenStale, logout]);

  // Request OTP for phone verification
  const requestOtp = async (phoneNumber: string): Promise<ApiResponse> => {
    try {
      const response = await authService.requestOtp(phoneNumber);
      return response as ApiResponse;
    } catch (error) {
      throw error;
    }
  };

  // Verify OTP and login
  const verifyOtp = async (phoneNumber: string, otpCode: string): Promise<ApiResponse> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await authService.verifyOtp(phoneNumber, otpCode) as any;
      console.log('[AuthContext] verifyOtp raw response:', JSON.stringify(response)?.substring(0, 500));
      // authService.verifyOtp returns apiClient response.data which is the inner { access, refresh, is_new_user }
      // But apiClient wraps in APIResponse, so response could be { success, data: {...}, message } OR just { access, refresh }
      const responseData = response?.data || response || {};
      const access = responseData?.access || response?.access;
      const refresh = responseData?.refresh || response?.refresh;
      let userObj = responseData?.user || response?.user;

      if (!access || !refresh) {
        console.error('[AuthContext] verifyOtp: Invalid structure. Keys:', Object.keys(response || {}), 'responseData keys:', Object.keys(responseData || {}));
        throw new Error('Something went wrong. Please try again.');
      }

      // Store tokens IMMEDIATELY
      await storeTokens(access, refresh);

      if (!userObj) {
        console.log('[AuthContext] verifyOtp: User data not in OTP response, fetching profile...');
        try {
          const profileResponse = await profileService.getProfile();
          userObj = profileResponse ? profileToUser(profileResponse) : undefined;
          if (userObj) {
            console.log('[AuthContext] verifyOtp: Profile fetched successfully after OTP.');
          } else {
            console.warn('[AuthContext] verifyOtp: Profile fetch after OTP did not return user data.');
            await tokenStorage.clearAll();
            setIsAuthenticated(false);
            setUser(null);
            throw new Error('Something went wrong. Please try again.');
          }
        } catch (profileError) {
          console.error('[AuthContext] verifyOtp: Failed to fetch user profile after OTP verification:', profileError);
          await tokenStorage.clearAll();
          setIsAuthenticated(false);
          setUser(null);
          throw profileError;
        }
      }

      if (userObj) {
        await setUserDataAndState(userObj);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      // Track OTP auth event
      const isNewUser = responseData?.is_new_user;
      if (isNewUser) {
        Analytics.signUp('phone_otp');
      } else {
        Analytics.login('phone_otp');
      }
      return response as ApiResponse;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  // Google login
  const googleLogin = async (idToken: string): Promise<ApiResponse> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await authService.googleAuth(idToken) as any;
      // API returns { success, data: { access, refresh, ... }, message }
      const responseData = response?.data || response || {};
      const access = responseData?.access || response?.access;
      const refresh = responseData?.refresh || response?.refresh;
      let userObj = responseData?.user || response?.user;

      if (!access || !refresh) {
        console.error('[AuthContext] googleLogin: Invalid token response structure from API.');
        throw new Error('Something went wrong. Please try again.');
      }

      // Store tokens IMMEDIATELY
      await storeTokens(access, refresh);

      if (!userObj) {
        console.log('[AuthContext] googleLogin: User data not in Google Auth response, fetching profile...');
        try {
          const profileResponse = await profileService.getProfile();
          userObj = profileResponse ? profileToUser(profileResponse) : undefined;
          if (userObj) {
            console.log('[AuthContext] googleLogin: Profile fetched successfully after Google login.');
          } else {
            console.warn('[AuthContext] googleLogin: Profile fetch after Google login did not return user data.');
            await tokenStorage.clearAll();
            setIsAuthenticated(false);
            setUser(null);
            throw new Error('Something went wrong. Please try again.');
          }
        } catch (profileError) {
          console.error('[AuthContext] googleLogin: Failed to fetch user profile after Google login:', profileError);
          await tokenStorage.clearAll();
          setIsAuthenticated(false);
          setUser(null);
          throw profileError;
        }
      }

      if (userObj) {
        await setUserDataAndState(userObj);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      Analytics.login('google');
      return response as ApiResponse;
    } catch (error) {
      reportError('google_login_backend', error instanceof Error ? error.message : 'Google login backend call failed', {
        stack: error instanceof Error ? error.stack : undefined,
        component: 'AuthContext.googleLogin',
      });
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  // Provide auth context values
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    requestOtp,
    verifyOtp,
    googleLogin,
    logout,
    checkAuth,
  };

  // useEffect to check auth on mount
  useEffect(() => {
    setIsLoading(true);
    const checkAuthOnMount = async () => {
      // Hydrate localStorage from native persistent storage (critical for Capacitor)
      await tokenStorage.hydrate();
      
      const path = window.location.pathname;
      const token = tokenStorage.getAccessTokenSync();
      const userData = localStorage.getItem('user');
      
      // If no token or user data, clear state and finish loading
      if (!token || !userData) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Parse user data
      let parsedUserData;
      try {
        parsedUserData = JSON.parse(userData);
      } catch {
        // Invalid JSON, clear everything
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // For public routes, just use local data without backend verification
      if (isPublicRoute(path)) {
        setUser(parsedUserData);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // For protected routes: immediately mark as authenticated using cached data
      // so ProtectedRoute never sees isAuthenticated=false while the network call
      // is in flight. We then verify in the background and update if needed.
      // This prevents the 8/15s timeout firing while isAuthenticated is still false.
      setUser(parsedUserData);
      setIsAuthenticated(true);
      setIsLoading(false);

      // Background verification: silently re-check token validity with backend.
      // User is already marked authenticated above, so this never causes a flash.
      // Only act if the backend confirms the token is genuinely invalid (401).

      // First, try to refresh if access token is stale (older than 1.5 hours)
      const tokenAge = Date.now() - parseInt(localStorage.getItem('tokenTimestamp') || '0', 10);
      if (tokenAge > ACCESS_TOKEN_MAX_AGE_MS) {
        // Access token is stale, try to refresh it first
        const refreshToken = await tokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            const { default: axios } = await import('axios');
            const { getApiBaseUrl } = await import('@/utils/api');
            const resp = await axios.post(`${getApiBaseUrl()}${API_ENDPOINTS.REFRESH_TOKEN}`, { refresh: refreshToken });
            const newAccess = resp.data?.data?.access || resp.data?.access;
            if (newAccess) {
              const newRefresh = resp.data?.data?.refresh || resp.data?.refresh;
              if (newRefresh) {
                await tokenStorage.storeTokens(newAccess, newRefresh);
              } else {
                await tokenStorage.updateAccessToken(newAccess);
              }
              console.log('[AuthContext] checkAuthOnMount: Refreshed stale token on restart.');
            }
          } catch (mountRefreshErr) {
            const mountRefreshStatus = (mountRefreshErr as { response?: { status?: number } })?.response?.status;
            if (mountRefreshStatus === 401) {
              // Refresh token is genuinely expired — force re-login
              console.log('[AuthContext] checkAuthOnMount: Refresh token expired (401). Clearing auth.');
              await tokenStorage.clearAll();
              setUser(null);
              setIsAuthenticated(false);
              if (typeof window !== 'undefined' && !isLoginRoute(window.location.pathname) && !isPublicRoute(window.location.pathname)) {
                window.location.href = '/login';
              }
              return;
            }
            // 5xx / network error during refresh → backend may be restarting.
            // User already authenticated with cached data above — continue silently.
            console.log('[AuthContext] checkAuthOnMount: Refresh failed (transient). Continuing with existing token.');
          }
        }
      }

      try {
        const profileResponse = await profileService.getProfile();
        if (profileResponse) {
          const freshUser = profileToUser(profileResponse);
          await setUserDataAndState(freshUser);
        }
        // If profileResponse is falsy — user already authenticated above, no-op
      } catch (err) {
        const error = err as { response?: { status?: number } };
        const status = error?.response?.status;
        
        // 401 = token genuinely invalid (expired or bad signature) → must logout
        if (status === 401) {
          await tokenStorage.clearAll();
          setUser(null);
          setIsAuthenticated(false);
          console.log('[AuthContext] checkAuthOnMount: getProfile returned 401 — token invalid. Clearing auth.');
          if (typeof window !== 'undefined' && !isLoginRoute(window.location.pathname) && !isPublicRoute(window.location.pathname)) {
            window.location.href = '/login';
          }
        } else {
          // 404, 5xx, network errors — user already authenticated with cached data above.
          // Log for debugging but don't change auth state.
          console.warn(
            `[AuthContext] checkAuthOnMount: background profile check failed (status ${status ?? 'network error'}) — ` +
            'user stays authenticated with cached data.',
            err
          );
        }
      }
    };
    
    checkAuthOnMount();
  }, []); // Empty dependency array is correct as checkAuthOnMount is defined inside the effect and doesn't depend on external component scope variables that change.

  // Proactive token refresh: refresh access token every 45 minutes to keep session alive
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    const REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes (more aggressive to prevent stale tokens)

    const refreshAccessToken = async () => {
      if (!isAuthenticated) return;
      const refreshToken = tokenStorage.getRefreshTokenSync();
      if (!refreshToken) {
        console.warn('[AuthContext] Proactive token refresh: no refresh token found, skipping.');
        return;
      }
      try {
        const { default: axios } = await import('axios');
        const { getApiBaseUrl } = await import('@/utils/api');
        const resp = await axios.post(`${getApiBaseUrl()}${API_ENDPOINTS.REFRESH_TOKEN}`, { refresh: refreshToken });
        const newAccess = resp.data?.data?.access || resp.data?.access;
        const newRefresh = resp.data?.data?.refresh || resp.data?.refresh;
        if (newAccess) {
          await tokenStorage.updateAccessToken(newAccess);
          // Store rotated refresh token if provided
          if (newRefresh) {
            await tokenStorage.storeTokens(newAccess, newRefresh);
          }
          console.log('[AuthContext] Proactive token refresh successful.');
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (err) {
        const proactiveRefreshStatus = (err as { response?: { status?: number } })?.response?.status;
        if (proactiveRefreshStatus === 401) {
          // Refresh token is genuinely expired — log user out gracefully on next interval
          console.warn('[AuthContext] Proactive refresh: refresh token expired (401). Logging out.');
          logout();
        } else {
          // Network error, 502/503 during deployment, etc. — silent skip, retry next interval.
          console.warn('[AuthContext] Proactive token refresh failed (transient) — will retry next interval:', err);
        }
      }
    };

    if (isAuthenticated) {
      refreshIntervalRef.current = setInterval(refreshAccessToken, REFRESH_INTERVAL_MS);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Custom hook to check if the user is really authenticated (both context state and token)
export const useRealAuth = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isReallyAuthenticated, setIsReallyAuthenticated] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasToken = tokenStorage.hasTokensSync();
      setIsReallyAuthenticated(isAuthenticated && hasToken);
    }
  }, [isAuthenticated]);
  
  return {
    isReallyAuthenticated,
    user,
    isLoading
  };
};
