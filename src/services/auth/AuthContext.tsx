import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, OnboardingPreferences } from '../../types';
import { apiClient, DjangoApiClient } from '../api';

interface AuthContextValue {
  user: User | null;
  preferences: OnboardingPreferences | null;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  signUp: (phoneNumber: string, password: string, profile: { first_name: string; last_name: string; email?: string }) => Promise<void>;
  loginWithOTP: {
    requestOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
    verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
  };
  signUpWithOTP: {
    requestOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
    verifyOTP: (phoneNumber: string, otp: string, profile: { first_name: string; last_name: string; email?: string }) => Promise<void>;
  };
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updatePreferences: (prefs: OnboardingPreferences) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<OnboardingPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Register unauthorized callback
    if (apiClient instanceof DjangoApiClient) {
      apiClient.setUnauthorizedCallback(() => {
        setUser(null);
        setPreferences(null);
        setIsAuthenticated(false);
      });
    }

    // Check for existing session on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      console.log('[Auth] Checking session...');
      setIsLoading(true);
      const session = await apiClient.getSession();
      
      if (session.user) {
        console.log('[Auth] Session valid for user:', session.user.id);
        setUser(session.user);
        setIsAuthenticated(true);
        
        // Check if onboarding is complete
        try {
          const prefs = await apiClient.getOnboardingPreferences();
          setPreferences(prefs);
        } catch (prefError) {
          console.warn('[Auth] Failed to fetch preferences:', prefError);
        }
      } else {
        console.log('[Auth] No active session');
        setUser(null);
        setPreferences(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('[Auth] Failed to check session:', error);
      setUser(null);
      setPreferences(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber: string, password: string) => {
    try {
      const authTokens = await apiClient.login(phoneNumber, password);
      setUser(authTokens.user);
      setIsAuthenticated(true);
      
      // Check onboarding status
      const prefs = await apiClient.getOnboardingPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signUp = async (phoneNumber: string, password: string, profile: { first_name: string; last_name: string; email?: string }) => {
    try {
      const authTokens = await apiClient.signUp(phoneNumber, password, profile);
      setUser(authTokens.user);
      setIsAuthenticated(true);
      
      // New users won't have preferences yet
      setPreferences(null);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  const loginWithOTP = {
    requestOTP: async (phoneNumber: string) => {
      try {
        console.log('📱 Requesting OTP for:', phoneNumber);
        const result = await apiClient.requestOTP(phoneNumber);
        console.log('✅ OTP Request Result:', result);
        return result;
      } catch (error: any) {
        console.error('❌ OTP Request Error:', error);
        throw error;
      }
    },
    verifyOTP: async (phoneNumber: string, otp: string) => {
      try {
        console.log('🔐 Verifying OTP for:', phoneNumber);
        const response = await apiClient.verifyOTP(phoneNumber, otp);
        console.log('✅ OTP Verified:', response);
        setUser(response.user);
        setIsAuthenticated(true);
        // Fetch preferences
        const prefs = await apiClient.getOnboardingPreferences();
        console.log('📋 User preferences:', prefs);
        setPreferences(prefs);
      } catch (error: any) {
        console.error('❌ OTP Verification Error:', error);
        throw error;
      }
    },
  };

  const signUpWithOTP = {
    requestOTP: async (phoneNumber: string) => {
      try {
        console.log('📱 Requesting OTP for signup:', phoneNumber);
        const result = await apiClient.requestOTP(phoneNumber);
        console.log('✅ Signup OTP Request Result:', result);
        return result;
      } catch (error: any) {
        console.error('❌ Signup OTP Request Error:', error);
        throw error;
      }
    },
    verifyOTP: async (phoneNumber: string, otp: string, profile: { first_name: string; last_name: string; email?: string }) => {
      try {
        console.log('🔐 Verifying OTP for signup:', phoneNumber, profile);
        const response = await apiClient.verifyOTP(phoneNumber, otp, profile);
        console.log('✅ Signup OTP Verified:', response);
        setUser(response.user);
        setIsAuthenticated(true);
        // New users won't have preferences yet
        setPreferences(null);
      } catch (error: any) {
        console.error('❌ Signup OTP Verification Error:', error);
        throw error;
      }
    },
  };

  const signOut = async () => {
    try {
      await apiClient.signOut();
      setUser(null);
      setPreferences(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      // Refresh both User Profile and Preferences
      const [userProfile, prefs] = await Promise.all([
        apiClient.getUserProfile(),
        apiClient.getOnboardingPreferences()
      ]);
      
      setUser(userProfile);
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const updatePreferences = (prefs: OnboardingPreferences) => {
    setPreferences(prefs);
  };

  const isOnboardingComplete = preferences?.is_profile_complete === true || preferences?.completed === true || 
    (!!preferences?.role && !!preferences?.board_id && !!preferences?.class_id && !!preferences?.medium_id);

  return (
    <AuthContext.Provider
      value={{
        user,
        preferences,
        isAuthenticated,
        isOnboardingComplete,
        isLoading,
        login,
        signUp,
        loginWithOTP,
        signUpWithOTP,
        signOut,
        refreshProfile,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}