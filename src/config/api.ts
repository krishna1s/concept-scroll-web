// API Configuration
// Change this URL when deploying to production
export const BACKEND_BASE_URL = 'https://b18244a7bf71.ngrok-free.app';

// API endpoints based on swagger.json from GitHub
// Source: https://github.com/krishna1s/concepts-scroll/blob/8c6600b40b9e2648ead9b975e7a0641cc38011d3/backend/swagger.json
export const API_ENDPOINTS = {
  // Authentication (under /api/users/auth/)
  AUTH_REQUEST_OTP: '/api/users/auth/request_otp/',
  AUTH_VERIFY_OTP: '/api/users/auth/verify_otp/',
  AUTH_REFRESH_TOKEN: '/api/users/auth/refresh/', // ⚠️ FIXED: Was /refresh_token/, now /refresh/
  AUTH_LOGIN: '/api/users/auth/login/',
  AUTH_GOOGLE: '/api/users/auth/google/',
  
  // User Profile
  USER_PROFILE: '/api/users/profile/',
  USER_UPDATE_PROFILE: '/api/users/profile/',
  
  // Onboarding
  ONBOARDING_PREFERENCES: '/api/onboarding/preferences/',
  ONBOARDING_PREFERENCES_ME: '/api/onboarding/preferences/me/',

  // Dashboard
  DASHBOARD_OVERVIEW: '/api/feed/dashboard/overview/',

  // Gamification
  USER_POINTS_ME: '/api/feed/user-points/me/',
  USER_XP_TRANSACTIONS: '/api/feed/xp-transactions/',
  USER_XP_SUMMARY: '/api/feed/xp-transactions/summary/',
  BADGES: '/api/feed/badges/',
  MY_BADGES: '/api/feed/user-badges/my-badges/',
  BADGES_PROGRESS: '/api/feed/user-badges/progress/',

  // Feed & Content
  FEED_HOME: '/api/feed/content-items/home/',
  FEED_EXPLORE: '/api/feed/content-items/feed/explore/',
  FEED_BOOKMARKS: '/api/feed/content-items/feed/bookmarks/',
  FEED_FILTERS: '/api/feed/content-items/feed/filters/',
  CONTENT_FEED: '/api/feed/content-items/',
  CONTENT_DETAIL: (id: string) => `/api/feed/content-items/${id}/`,
  CONTENT_LIKE: (id: string) => `/api/feed/content-items/${id}/like/`,
  CONTENT_BOOKMARK: (id: string) => `/api/feed/content-items/${id}/bookmark/`,
  CONTENT_COMMENT: (id: string) => `/api/feed/content-items/${id}/comment/`,
  
  // Comments
  COMMENTS: '/api/feed/comments/',
  COMMENT_ACTION: (id: string) => `/api/feed/comments/${id}/`, // For like/delete if needed

  // Educational Structure
  BOARDS: '/api/content/boards/',
  CLASSES: '/api/content/classes/',
  MEDIUMS: '/api/content/mediums/',
  SUBJECTS: '/api/content/subjects/',
  BOOKS: '/api/books/',     // Keep old if not specified in update
  CHAPTERS: '/api/chapters/', // Keep old if not specified in update

  
  // Gamification
  USER_POINTS: '/api/users/points/',
  USER_BADGES: '/api/users/badges/',
  LEADERBOARD: '/api/leaderboard/',
  
  // Focus Sessions
  FOCUS_SESSIONS: '/api/focus-sessions/',
  FOCUS_SESSION_START: '/api/focus-sessions/start/',
  FOCUS_SESSION_END: (id: string) => `/api/focus-sessions/${id}/end/`,
  
  // Daily Goals
  DAILY_GOALS: '/api/users/daily-goals/',
  
  // Search
  SEARCH: '/api/search/',
};