import { IApiClient } from './contract';
import { BACKEND_BASE_URL, API_ENDPOINTS } from '../../config/api';
import { debugLogger } from '../logger/DebugLogger';
import type {
  AuthTokens,
  UserProfile,
  OnboardingPreferences,
  Board,
  Class,
  Medium,
  Subject,
  Book,
  Chapter,
  ContentItem,
  Quiz,
  QuizHistory,
  Poll,
  PollResponse,
  Comment,
  UserPoints,
  Badge,
  LeaderboardEntry,
  FocusSession,
  DailyGoal,
  QuizAnswer,
  Like,
  Bookmark,
  Follow,
  UserChallengeProgress,
  PaginatedResponse,
  FeedFilters,
  FeedFilterOptions,
  Note,
  DashboardData, // Import the new type
  XPTransaction // Import new type
} from '../../types';

// Token management
let accessToken: string | null = null;
let refreshToken: string | null = null;

const TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

// Load tokens from localStorage on initialization
if (typeof window !== 'undefined') {
  accessToken = localStorage.getItem(TOKEN_KEY);
  refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
}

export class DjangoApiClient implements IApiClient {
  private baseURL: string;

  private unauthorizedCallback?: () => void;
  
  constructor(baseURL: string = BACKEND_BASE_URL) {
    this.baseURL = baseURL;
  }

  setUnauthorizedCallback(callback: () => void) {
    this.unauthorizedCallback = callback;
  }

  // Helper method to make authenticated requests
  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    
    // Log Request
    console.log(`[API Request] ${method} ${url}`);
    if (options.body) {
        try {
            console.log('[API Request Body]', JSON.parse(options.body as string));
        } catch (e) {
            console.log('[API Request Body]', options.body);
        }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true', // Required for ngrok
      ...options.headers,
    };

    // Add auth token if available
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      // Log Response Status
      console.log(`[API Response] ${method} ${url} - Status: ${response.status}`);
      
      if (!response.ok) {
        debugLogger.logApiCall(method, url, response.status, { statusText: response.statusText });
        
        // Try to read and log error body
        try {
            const errorBody = await response.clone().text(); // Clone to not consume stream
            console.error(`[API Error Body] ${method} ${url}`, errorBody);
        } catch (e) {
            console.warn('Could not read error body', e);
        }

      } else {
        debugLogger.logApiCall(method, url, response.status);
      }

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${accessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${retryResponse.status}`);
          }
          
          return retryResponse.json();
        } else {
          // Refresh failed, clear tokens
          this.clearAuth();
          if (this.unauthorizedCallback) {
            this.unauthorizedCallback();
          }
          throw new Error('Session expired. Please login again.');
        }
      }

      if (response.status === 401 || response.status === 403) {
         this.clearAuth();
         if (this.unauthorizedCallback) {
           this.unauthorizedCallback();
         }
         throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`[API Response Data] ${method} ${url}`, data);
      return data;
    } catch (error: any) {
      // Downgrade network errors to warn to reduce console noise during development/unstable connection
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        console.warn(`API Network Error [${endpoint}]:`, error.message);
      } else {
        console.error(`API Error [${endpoint}]:`, error);
      }
      debugLogger.logApiCall(method, url, 0, { error });
      throw error;
    }
  }

  // ==================== Authentication ====================

  async requestOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    console.log('📱 Requesting OTP for:', phoneNumber);
    
    try {
      await this.request<{ message: string }>(
        API_ENDPOINTS.AUTH_REQUEST_OTP,
        {
          method: 'POST',
          body: JSON.stringify({ phone_number: phoneNumber }),
        }
      );
      
      console.log('✅ OTP sent successfully');
      return { success: true, message: 'OTP sent successfully' };
    } catch (error: any) {
      console.warn('Backend requestOTP failed, falling back to mock (Dev Mode):', error);
      // Fallback for development/demo when backend is unreachable
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        return { success: true, message: 'OTP sent successfully (Mock)' };
      }
      throw error;
    }
  }

  async verifyOTP(phoneNumber: string, otp: string, profile?: { first_name: string; last_name: string; email?: string }): Promise<AuthTokens> {
    console.log('🔐 Verifying OTP for:', phoneNumber);
    
    const payload: any = {
      phone_number: phoneNumber,
      otp_code: otp, // Backend expects 'otp_code', not 'otp'
    };

    // Add name fields if provided (for signup)
    if (profile?.first_name) payload.first_name = profile.first_name;
    if (profile?.last_name) payload.last_name = profile.last_name;
    if (profile?.email) payload.email = profile.email;

    console.log('📤 Sending payload:', payload);

    try {
      const response = await this.request<{
        success: boolean;
        data: {
          is_new_user: boolean;
          access: string;
          refresh: string;
          user: UserProfile;
        };
        message: string;
      }>(API_ENDPOINTS.AUTH_VERIFY_OTP, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Store tokens (backend uses 'access' and 'refresh', not 'access_token' and 'refresh_token')
      accessToken = response.data.access;
      refreshToken = response.data.refresh;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, response.data.access);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh);
      }

      console.log('✅ OTP Verified Successfully');
      console.log('👤 User:', response.data.user);
      console.log('🆕 Is New User:', response.data.is_new_user);

      return {
        access_token: response.data.access,
        refresh_token: response.data.refresh,
        user: response.data.user,
      };
    } catch (error: any) {
      console.warn('Backend verifyOTP failed, falling back to mock (Dev Mode):', error);
      
      // Fallback for development/demo when backend is unreachable
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
         const mockUser: UserProfile = {
             id: 'mock-user-id',
             first_name: profile?.first_name || 'Guest',
             last_name: profile?.last_name || 'User',
             email: profile?.email || 'guest@example.com',
             phone_number: phoneNumber,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString(),
             followers_count: 0,
             following_count: 0
         };
         
         const mockTokens = {
             access_token: 'mock-access-token',
             refresh_token: 'mock-refresh-token',
             user: mockUser
         };

         accessToken = mockTokens.access_token;
         refreshToken = mockTokens.refresh_token;

         if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, mockTokens.access_token);
            localStorage.setItem(REFRESH_TOKEN_KEY, mockTokens.refresh_token);
         }

         return mockTokens;
      }
      throw error;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH_REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ refresh: refreshToken }), // Backend expects 'refresh', not 'refresh_token'
      });

      if (!response.ok) return false;

      const data = await response.json();
      
      // ⚠️ Response format from /api/users/auth/refresh/ is { access: "..." }
      accessToken = data.access; // Backend returns 'access', not 'access_token'
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, data.access);
      }

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    this.clearAuth();
  }

  async login(phoneNumber: string, password: string): Promise<AuthTokens> {
    // Not implemented - using OTP authentication instead
    throw new Error('Password login not implemented. Please use OTP authentication.');
  }

  async googleLogin(idToken: string): Promise<AuthTokens> {
    // Not implemented yet
    throw new Error('Google login not implemented yet.');
  }

  async signUp(phoneNumber: string, password: string, profile: { first_name: string; last_name: string; email?: string }): Promise<AuthTokens> {
    // Not implemented - using OTP authentication instead
    throw new Error('Password signup not implemented. Please use OTP authentication.');
  }

  async getSession(): Promise<{ user: any | null; accessToken: string | null }> {
    if (!accessToken) {
      console.log('[Session] No token found in storage');
      return { user: null, accessToken: null };
    }

    try {
      console.log('[Session] Validating token with profile fetch...');
      const user = await this.getUserProfile();
      console.log('[Session] Token valid, user:', user.id);
      return { user, accessToken };
    } catch (error: any) {
      console.error('[Session] Validation failed:', error);
      
      // Only clear auth if it's explicitly an auth error (handled in request(), but strictly ensuring here)
      // Note: request() already clears auth on 401/403, so checking if accessToken is still set
      if (!accessToken) {
        return { user: null, accessToken: null };
      }
      
      // If it's a network error or server error (500), we don't want to destroy the token
      // We just return null user so the app shows landing page, but next reload might work
      if (error.message === 'Unauthorized' || error.message.includes('Session expired')) {
         this.clearAuth();
      }
      
      return { user: null, accessToken: null };
    }
  }

  async getProfile(): Promise<UserProfile> {
    return this.getUserProfile();
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return this.updateUserProfile(updates);
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    if (!accessToken) return null;

    try {
      const profile = await this.getUserProfile();
      return profile;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  private clearAuth(): void {
    accessToken = null;
    refreshToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  // ==================== User Profile ====================

  async getUserProfile(): Promise<UserProfile> {
    return this.request<UserProfile>(API_ENDPOINTS.USER_PROFILE);
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>(API_ENDPOINTS.USER_UPDATE_PROFILE, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // ==================== Onboarding ====================

  async getOnboardingPreferences(): Promise<OnboardingPreferences | null> {
    try {
      // Use the 'me' endpoint to get current user's preferences
      const response = await this.request<any>(API_ENDPOINTS.ONBOARDING_PREFERENCES_ME);
      // Handle wrapped response
      if (response && response.data && (response.success === true || response.status === 'success')) {
        return response.data;
      }
      return response;
    } catch (error: any) {
      // Fallback for development/demo when backend is unreachable
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
          console.warn('Backend getOnboardingPreferences failed, falling back to mock (Dev Mode)');
          return {
              id: 'mock-prefs-id',
              user_id: 'mock-user-id',
              role: 'student',
              board_id: 'cbse',
              class_id: '10',
              medium_id: 'english',
              subject_ids: ['math', 'science'],
              completed: true, // Important: marks onboarding as complete
              is_profile_complete: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
          };
      }

      // If unauthorized, rethrow so caller handles it (or relying on callback)
      if (error.message === 'Unauthorized' || error.message?.includes('Session expired')) {
         throw error;
      }
      // Return null if not found (404) or other errors
      return null;
    }
  }

  async saveOnboardingPreferences(preferences: Partial<OnboardingPreferences>): Promise<OnboardingPreferences> {
    console.log('💾 Saving onboarding preferences:', preferences);
    
    try {
      // First, try to GET existing preferences using the 'me' endpoint
      let method: 'POST' | 'PATCH' | 'PUT' = 'POST';
      let existingId: string | undefined;
      
      try {
        const existing = await this.request<{
          success: boolean;
          data: OnboardingPreferences;
          message: string;
        }>(API_ENDPOINTS.ONBOARDING_PREFERENCES_ME, {
          method: 'GET',
        });
        
        // If we have existing preferences, use PATCH to update
        if (existing?.data) {
          console.log('📝 Found existing preferences, will update');
          method = 'PATCH';
          existingId = existing.data.id;
        }
      } catch (error) {
        // No existing preferences, will create with POST
        console.log('🆕 No existing preferences, will create new');
      }
      
      // ⚠️ IMPORTANT: Backend expects { role, data: {...mapped fields...} }
      // The data object keys must match OnboardingData schema in Swagger
      const requestBody = {
        role: preferences.role || 'student',
        data: {
          board: preferences.board_id,
          grade: preferences.class_id,
          medium: preferences.medium_id,
          subjects: preferences.subject_ids || [],
          // Add any other fields from preferences
          ...(preferences.data || {})
        }
      };
      
      console.log('📤 Request Details:');
      console.log('   Method:', method);
      
      let url = API_ENDPOINTS.ONBOARDING_PREFERENCES;
      // If patching, append ID if required, or use the base endpoint if it handles PATCH (often ViewSets need ID)
      if (method === 'PATCH' && existingId) {
        url = `${API_ENDPOINTS.ONBOARDING_PREFERENCES}${existingId}/`;
      }

      console.log('   URL:', `${BACKEND_BASE_URL}${url}`);
      console.log('   Body:', JSON.stringify(requestBody, null, 2));
      
      // Now save/update with the determined method
      const response = await this.request<{
        success: boolean;
        data: OnboardingPreferences;
        message: string;
      }>(url, {
        method,
        body: JSON.stringify(requestBody),
      });
      
      console.log('✅ Onboarding preferences saved:', response);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to save onboarding preferences:', error);
      console.error('❌ Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      // Log the full URL for debugging
      console.error('🔗 Attempted URL:', `${BACKEND_BASE_URL}${API_ENDPOINTS.ONBOARDING_PREFERENCES}`);
      throw error;
    }
  }

  async updateOnboardingStep(step: number): Promise<void> {
    await this.request(API_ENDPOINTS.ONBOARDING_PREFERENCES, {
      method: 'PATCH',
      body: JSON.stringify({ current_step: step }),
    });
  }

  // ==================== Educational Hierarchy ====================

  async getBoards(): Promise<Board[]> {
    const response = await this.request<{ results: Board[] }>(API_ENDPOINTS.BOARDS);
    return response.results || [];
  }

  async getClasses(boardId?: string): Promise<Class[]> {
    const url = boardId 
      ? `${API_ENDPOINTS.CLASSES}?board_id=${boardId}`
      : API_ENDPOINTS.CLASSES;
    const response = await this.request<{ results: Class[] }>(url);
    return response.results || [];
  }

  async getMediums(): Promise<Medium[]> {
    const response = await this.request<{ results: Medium[] }>(API_ENDPOINTS.MEDIUMS);
    return response.results || [];
  }

  async getSubjects(classId: string, boardId?: string): Promise<Subject[]> {
    const url = `${API_ENDPOINTS.SUBJECTS}?class_id=${classId}`;
    const response = await this.request<{ results: Subject[] }>(url);
    return response.results || [];
  }

  async getBooks(filters: { subjectId?: string; classId?: string; mediumId?: string }): Promise<Book[]> {
    const params = new URLSearchParams();
    if (filters.subjectId) params.append('subject_id', filters.subjectId);
    if (filters.classId) params.append('class_id', filters.classId);
    if (filters.mediumId) params.append('medium_id', filters.mediumId);
    
    const url = `${API_ENDPOINTS.BOOKS}?${params.toString()}`;
    const response = await this.request<{ results: Book[] }>(url);
    return response.results || [];
  }

  async getChapters(bookId: string): Promise<Chapter[]> {
    // Fixed: Use nested endpoint from Swagger /books/{id}/chapters/
    const url = `${API_ENDPOINTS.BOOKS}${bookId}/chapters/`;
    try {
      console.log(`📚 Fetching chapters for book ${bookId} from ${url}`);
      const response = await this.request<any>(url);
      console.log('📚 Chapters API Response:', response);
      
      // Handle various response formats
      if (Array.isArray(response)) return response;
      if (response.results) return response.results;
      if (response.data && Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
       console.warn(`Failed to fetch chapters for book ${bookId}`, error);
       return [];
    }
  }

  // ==================== Content Feed ====================

  private mapApiToContentItem(apiItem: any): ContentItem {
    // Map API flat structure to ContentItem nested structure
    const type = apiItem.type || 'note';
    
    // Create a minimal Subject object
    const subject = {
      id: apiItem.subjectId || 'unknown',
      name: apiItem.subject || 'General',
      class_id: 'unknown',
      board_id: apiItem.board || 'unknown',
      is_active: true
    };

    // Create a minimal UserProfile for author (or use a placeholder if null)
    const author: UserProfile = apiItem.author || {
      id: 'unknown',
      first_name: 'Concept',
      last_name: 'Scroll',
      profile_picture: apiItem.authorAvatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
      bio: 'Platform Content',
      followers_count: 0,
      following_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Construct the specific content object (Note, Quiz, Poll)
    // The API seems to return all fields flat, so we pass the whole item as content
    // but we ensure it matches the interface requirements
    let content: any = { ...apiItem };
    
    // Ensure required fields for Note/Quiz/Poll are present
    if (type === 'quiz' || type === 'poll') {
       if (type === 'quiz') {
           // Quiz Mapping
           if (!content.questions) {
              // If API returns a single question quiz as flat fields
              content.questions = [{
                  id: 'q1',
                  question: apiItem.question || apiItem.title,
                  options: Array.isArray(apiItem.options) ? apiItem.options : [],
                  correct_answer: apiItem.correctOptionIndex ?? 0,
                  explanation: apiItem.explanation,
                  difficulty: apiItem.difficulty || 'medium'
              }];
           }
       } else if (type === 'poll') {
           // Poll Mapping
           if (Array.isArray(apiItem.options) && typeof apiItem.options[0] === 'string') {
               // Convert string options to PollOption objects
               content.options = apiItem.options.map((opt: string, idx: number) => ({
                   id: `opt-${idx}`,
                   text: opt,
                   votes: 0,
                   percentage: 0
               }));
           }
           if (!content.question) {
               content.question = apiItem.title;
           }
       }
    }

    return {
      id: apiItem.id,
      type: type as any,
      content: content,
      author: author,
      subject: subject,
      likes_count: apiItem.likes || 0,
      comments_count: apiItem.comments || 0,
      bookmarks_count: apiItem.bookmarks || 0,
      shares_count: apiItem.shares || 0, // Missing in API
      is_liked: apiItem.is_liked || false, // Missing/Different in API
      is_bookmarked: apiItem.is_bookmarked || false, // Missing/Different in API
      created_at: apiItem.createdAt || new Date().toISOString(),
      updated_at: apiItem.updatedAt || new Date().toISOString(),
    };
  }

  async getHomeFeed(page: number, size: number): Promise<PaginatedResponse<ContentItem>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: size.toString(),
    });
    const url = `${API_ENDPOINTS.FEED_HOME}?${params.toString()}`;
    const response = await this.request<any>(url);
    
    // Handle Custom Response Structure: { success: true, data: { notes: [], pagination: {} } }
    let items: any[] = [];
    let total = 0;
    let has_more = false;

    if (response.data && Array.isArray(response.data.notes)) {
      items = response.data.notes;
      // Heuristic for has_more if total is not provided
      has_more = items.length >= size; 
    } else if (response.results) {
        // Fallback to standard Django Rest Framework structure
        items = response.results;
        has_more = !!response.next;
        total = response.count || 0;
    }

    const mappedItems = items.map(item => this.mapApiToContentItem(item));

    return {
      items: mappedItems,
      total: total,
      page: page,
      size: size,
      has_more: has_more,
    };
  }

  async getExploreFeed(
    page: number, 
    size: number, 
    filters?: FeedFilters
  ): Promise<PaginatedResponse<ContentItem>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: size.toString(),
    });

    if (filters) {
      if (filters.subjects) params.append('subjects', filters.subjects.join(','));
      if (filters.types) params.append('types', filters.types.join(','));
      if (filters.difficulty) params.append('difficulty', filters.difficulty.join(','));
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
    }

    const url = `${API_ENDPOINTS.FEED_EXPLORE}?${params.toString()}`;
    const response = await this.request<any>(url);
    
    return {
      items: response.results || [],
      total: response.count || 0,
      page: page,
      size: size,
      has_more: !!response.next,
    };
  }

  async getBookmarkedFeed(page: number, size: number): Promise<PaginatedResponse<ContentItem>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: size.toString(),
    });
    const url = `${API_ENDPOINTS.FEED_BOOKMARKS}?${params.toString()}`;
    const response = await this.request<any>(url);
    
    return {
      items: response.results || [],
      total: response.count || 0,
      page: page,
      size: size,
      has_more: !!response.next,
    };
  }

  async getFeedFilterOptions(): Promise<FeedFilterOptions> {
    return this.request<FeedFilterOptions>(API_ENDPOINTS.FEED_FILTERS);
  }

  async getContentItem(id: string): Promise<ContentItem> {
    return this.getContentById(id);
  }

  async getContentFeed(filters?: {
    board_id?: string;
    class_id?: string;
    subject_id?: string;
    chapter_id?: string;
    content_type?: string;
    page?: number;
    page_size?: number;
  }): Promise<{ results: ContentItem[]; count: number; next: string | null; previous: string | null }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    
    const url = `${API_ENDPOINTS.CONTENT_FEED}?${params.toString()}`;
    return this.request<{ results: ContentItem[]; count: number; next: string | null; previous: string | null }>(url);
  }

  async getContentById(contentId: string): Promise<ContentItem> {
    return this.request<ContentItem>(API_ENDPOINTS.CONTENT_DETAIL(contentId));
  }

  // ==================== Quizzes ====================

  async getQuizzes(filters?: { subject_id?: string; chapter_id?: string }): Promise<Quiz[]> {
    // Fixed: /api/quizzes/ does not exist. Use content feed with type='quiz'
    const feed = await this.getContentFeed({
      ...filters,
      content_type: 'quiz',
      page_size: 100
    });
    return feed.results.map(item => item.content as Quiz);
  }

  async getQuizById(quizId: string): Promise<Quiz> {
    // Fixed: Use content detail endpoint if quiz detail missing, or check if specific endpoint exists
    // Swagger doesn't show /quizzes/{id}. Assuming content item.
    const content = await this.getContentById(quizId);
    return content.content as Quiz;
  }

  // Submit quiz with detailed answers (contract version)
  async submitQuiz(quizId: string, answers: QuizAnswer[] | Record<string, string>, timeTaken?: number): Promise<QuizHistory> {
    // Check if answers is array (QuizAnswer[]) or Record
    let payload: any = {};
    
    if (Array.isArray(answers)) {
       payload = { 
         quiz_id: quizId,
         answers, 
         time_taken_seconds: timeTaken,
         score: 0, // Backend likely calculates this, but schema requires it? Check schemas if failure.
         total_questions: answers.length
       };
    } else {
      payload = { quiz_id: quizId, answers };
    }

    // Fixed: /api/quizzes/{id}/submit/ does not exist.
    // Use /api/onboarding/user/quiz-history/ (POST)
    return this.request<QuizHistory>('/api/onboarding/user/quiz-history/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getQuizHistory(page: number = 1, size: number = 10): Promise<PaginatedResponse<QuizHistory>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: size.toString(),
    });
    // Fixed: /api/quizzes/history/ does not exist.
    // Use /api/onboarding/user/quiz-history/
    const url = `/api/onboarding/user/quiz-history/?${params.toString()}`;
    const response = await this.request<any>(url);
    
    return {
      items: response.results || [],
      total: response.count || 0,
      page: page,
      size: size,
      has_more: !!response.next,
    };
  }

  // ==================== Polls ====================

  async getPolls(filters?: { subject_id?: string; chapter_id?: string }): Promise<Poll[]> {
    // Fixed: /api/polls/ does not exist. Use content feed with type='poll'
    const feed = await this.getContentFeed({
      ...filters,
      content_type: 'poll',
      page_size: 100
    });
    return feed.results.map(item => item.content as Poll);
  }

  async votePoll(pollId: string, optionId: string): Promise<PollResponse> {
    // Fixed: /api/polls/{id}/vote/ does not exist.
    // Use /api/feed/content-items/{id}/poll-response/
    // Note: pollId is likely the content_item_id or we need to find it. 
    // Assuming pollId passed here IS the content_item_id or matches the URL structure.
    return this.request<PollResponse>(`/api/feed/content-items/${pollId}/poll-response/`, {
      method: 'POST',
      body: JSON.stringify({ option_id: optionId }),
    });
  }

  // ==================== Dashboard & Gamification ====================

  async getDashboardOverview(): Promise<DashboardData> {
    const response = await this.request<{ success: boolean; data: DashboardData; message: string }>(API_ENDPOINTS.DASHBOARD_OVERVIEW);
    // Handle both wrapped and unwrapped just in case, but documentation says wrapped
    if (response.success && response.data) {
      return response.data;
    }
    // Fallback if not wrapped (unexpected)
    return response as unknown as DashboardData;
  }

  async getUserPoints(): Promise<UserPoints> {
    const response = await this.request<any>(API_ENDPOINTS.USER_POINTS_ME);
    return response.data || response;
  }

  async getBadges(): Promise<Badge[]> {
    const response = await this.request<any>(API_ENDPOINTS.BADGES);
    return response.results || response.data || [];
  }

  async getMyBadges(): Promise<Badge[]> {
    const response = await this.request<any>(API_ENDPOINTS.MY_BADGES);
    return response.results || response.data || [];
  }

  async getBadgeProgress(): Promise<any> {
    const response = await this.request<any>(API_ENDPOINTS.BADGES_PROGRESS);
    return response.data || response;
  }

  async getXPTransactions(page: number, size: number): Promise<PaginatedResponse<XPTransaction>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: size.toString(),
    });
    const url = `${API_ENDPOINTS.USER_XP_TRANSACTIONS}?${params.toString()}`;
    const response = await this.request<any>(url);
    
    return {
      items: response.results || response.data || [],
      total: response.count || 0,
      page: page,
      size: size,
      has_more: !!response.next,
    };
  }

  async getXPSummary(): Promise<any> {
    const response = await this.request<any>(API_ENDPOINTS.USER_XP_SUMMARY);
    return response.data || response;
  }

  // ==================== Social ====================

  async followUser(userId: string): Promise<Follow> {
    return this.request<Follow>(API_ENDPOINTS.USER_FOLLOW, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async unfollowUser(userId: string): Promise<void> {
    await this.request(API_ENDPOINTS.USER_UNFOLLOW, {
      method: 'POST', // or DELETE? config says POST to unfollow endpoint
      body: JSON.stringify({ userId }),
    });
  }

  async getFollowers(userId: string, page: number, size: number): Promise<PaginatedResponse<UserProfile>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: size.toString(),
    });
    // Note: This endpoint might only return current user's followers. 
    // If we need other user's followers, we might need a different endpoint or param.
    const url = `${API_ENDPOINTS.FOLLOWERS}?${params.toString()}`;
    const response = await this.request<any>(url);
    
    return {
      items: response.results || [],
      total: response.count || 0,
      page: page,
      size: size,
      has_more: !!response.next,
    };
  }

  async getFollowing(userId: string, page: number, size: number): Promise<PaginatedResponse<UserProfile>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: size.toString(),
    });
    const url = `${API_ENDPOINTS.FOLLOWING}?${params.toString()}`;
    const response = await this.request<any>(url);
    
    return {
      items: response.results || [],
      total: response.count || 0,
      page: page,
      size: size,
      has_more: !!response.next,
    };
  }

  // ==================== Library (Chapter Content) ====================

  async getChapterNotes(chapterId: string): Promise<Note[]> {
    const response = await this.getContentFeed({
      chapter_id: chapterId,
      content_type: 'note',
      page_size: 100
    });
    // Map ContentItem to Note
    return response.results.map(item => item.content as Note);
  }

  async getChapterQuizzes(chapterId: string): Promise<Quiz[]> {
    return this.getQuizzes({ chapter_id: chapterId });
  }

  async getChapterQA(chapterId: string): Promise<any[]> {
    // Not implemented in backend yet, return empty
    return [];
  }

  async getChapter(chapterId: string): Promise<Chapter> {
    const url = `${API_ENDPOINTS.CHAPTERS}${chapterId}/`;
    return this.request<Chapter>(url);
  }

  // ==================== Gamification ====================

  async getUserGoals(date?: string): Promise<UserGoal[]> {
    // Assuming DAILY_GOALS endpoint supports date filtering
    const url = date ? `${API_ENDPOINTS.DAILY_GOALS}?date=${date}` : API_ENDPOINTS.DAILY_GOALS;
    const response = await this.request<{ results: UserGoal[] }>(url);
    return response.results || [];
  }

  async getTodayGoal(): Promise<UserGoal | null> {
    const today = new Date().toISOString().split('T')[0];
    const goals = await this.getUserGoals(today);
    return goals.length > 0 ? goals[0] : null;
  }

  async createGoal(goal: Partial<UserGoal>): Promise<UserGoal> {
    return this.createDailyGoal(goal); // Delegate to existing method
  }

  async updateGoalProgress(goalId: string, currentValue: number): Promise<UserGoal> {
    return this.request<UserGoal>(`${API_ENDPOINTS.DAILY_GOALS}${goalId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ current_value: currentValue })
    });
  }



  async getFocusSessions(page: number = 1, size: number = 10): Promise<PaginatedResponse<FocusSession>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: size.toString(),
    });
    const url = `${API_ENDPOINTS.FOCUS_SESSIONS}?${params.toString()}`;
    const response = await this.request<any>(url);
    
    return {
      items: response.results || [],
      total: response.count || 0,
      page: page,
      size: size,
      has_more: !!response.next,
    };
  }

  async createFocusSession(chapterId: string, durationMinutes: number): Promise<FocusSession> {
    return this.startFocusSession(chapterId, durationMinutes);
  }

  async getUserChallenges(): Promise<UserChallengeProgress[]> {
    // Not explicitly in API_ENDPOINTS, assuming similar pattern
    return [];
  }

  async getLatestChallenge(): Promise<UserChallengeProgress | null> {
    return null;
  }

  // ==================== Tracking ====================

  async markContentSeen(contentItemId: string): Promise<void> {
    // Not implemented
  }

  async getSeenContent(page: number, size: number): Promise<PaginatedResponse<string>> {
    return { items: [], total: 0, page, size, has_more: false };
  }

  // ==================== Engagement ====================

  async likeContent(contentId: string): Promise<Like> {
    return this.request<Like>(API_ENDPOINTS.CONTENT_LIKE(contentId), {
      method: 'POST',
    });
  }

  async unlikeContent(contentId: string): Promise<void> {
    await this.request(API_ENDPOINTS.CONTENT_LIKE(contentId), {
      method: 'DELETE',
    });
  }

  async bookmarkContent(contentId: string): Promise<Bookmark> {
    return this.request<Bookmark>(API_ENDPOINTS.CONTENT_BOOKMARK(contentId), {
      method: 'POST',
    });
  }

  async unbookmarkContent(contentId: string): Promise<void> {
    await this.request(API_ENDPOINTS.CONTENT_BOOKMARK(contentId), {
      method: 'DELETE',
    });
  }

  async shareContent(contentId: string): Promise<void> {
    // Share endpoint not provided yet, fallback to mock or no-op
    console.warn('Share endpoint not implemented yet');
  }

  // ==================== Comments ====================

  async getComments(contentId: string, page: number = 1, size: number = 10): Promise<PaginatedResponse<Comment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: size.toString(),
      content_item_id: contentId, // Filter by content_item_id using the general comments list endpoint
    });
    const url = `${API_ENDPOINTS.COMMENTS}?${params.toString()}`;
    const response = await this.request<any>(url);
    
    return {
      items: response.results || [],
      total: response.count || 0,
      page: page,
      size: size,
      has_more: !!response.next,
    };
  }

  async addComment(contentId: string, text: string, parentId?: string): Promise<Comment> {
    return this.createComment(contentId, text, parentId);
  }

  async createComment(contentId: string, text: string, parentId?: string): Promise<Comment> {
    return this.request<Comment>(API_ENDPOINTS.CONTENT_COMMENT(contentId), {
      method: 'POST',
      body: JSON.stringify({ comment_text: text, parent_id: parentId }),
    });
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.request(API_ENDPOINTS.COMMENT_ACTION(commentId), {
      method: 'DELETE',
    });
  }

  // ==================== Gamification ====================

  async getUserPoints(): Promise<UserPoints> {
    return this.request<UserPoints>(API_ENDPOINTS.USER_POINTS);
  }

  async getUserBadges(): Promise<Badge[]> {
    const response = await this.request<{ results: Badge[] }>(API_ENDPOINTS.USER_BADGES);
    return response.results || [];
  }

  async getLeaderboard(filters?: { period?: string; board_id?: string; class_id?: string }): Promise<LeaderboardEntry[]> {
    const params = new URLSearchParams();
    if (filters?.period) params.append('period', filters.period);
    if (filters?.board_id) params.append('board_id', filters.board_id);
    if (filters?.class_id) params.append('class_id', filters.class_id);
    
    const url = `${API_ENDPOINTS.LEADERBOARD}?${params.toString()}`;
    const response = await this.request<{ results: LeaderboardEntry[] }>(url);
    return response.results || [];
  }

  // ==================== Focus Sessions ====================



  async startFocusSession(subjectId: string, duration: number): Promise<FocusSession> {
    return this.request<FocusSession>(API_ENDPOINTS.FOCUS_SESSION_START, {
      method: 'POST',
      body: JSON.stringify({ subject_id: subjectId, duration }),
    });
  }

  async endFocusSession(sessionId: string): Promise<FocusSession> {
    return this.request<FocusSession>(API_ENDPOINTS.FOCUS_SESSION_END(sessionId), {
      method: 'POST',
    });
  }

  // ==================== Daily Goals ====================

  async getDailyGoals(): Promise<DailyGoal[]> {
    const response = await this.request<{ results: DailyGoal[] }>(API_ENDPOINTS.DAILY_GOALS);
    return response.results || [];
  }

  async createDailyGoal(goal: Partial<DailyGoal>): Promise<DailyGoal> {
    return this.request<DailyGoal>(API_ENDPOINTS.DAILY_GOALS, {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  // ==================== Search ====================

  async search(query: string, filters?: { content_type?: string; subject_id?: string }): Promise<any> {
    const params = new URLSearchParams({ q: query });
    if (filters?.content_type) params.append('content_type', filters.content_type);
    if (filters?.subject_id) params.append('subject_id', filters.subject_id);
    
    const url = `${API_ENDPOINTS.SEARCH}?${params.toString()}`;
    return this.request(url);
  }
}