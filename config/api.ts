// API Configuration
// Change this URL when deploying to production
export const BACKEND_BASE_URL = 'https://pansy-thymelaeaceous-nasally.ngrok-free.dev';

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
  BOOKS: '/api/content/books/',
  CHAPTERS: '/api/content/chapters/',

  
  // Gamification
  USER_POINTS: '/api/users/points/',
  USER_BADGES: '/api/users/badges/',
  LEADERBOARD: '/api/leaderboard/',
  
  // Focus Sessions
  FOCUS_SESSIONS: '/api/focus-sessions/',
  FOCUS_SESSION_START: '/api/focus-sessions/start/',
  FOCUS_SESSION_END: (id: string) => `/api/focus-sessions/${id}/end/`,
  
  // Daily Goals
  DAILY_GOALS: '/api/onboarding/user/goals/',
  DAILY_GOAL_CURRENT: '/api/onboarding/user/goals/current/',
  DAILY_GOAL_UPDATE: (id: string) => `/api/onboarding/user/goals/${id}/`,
  DAILY_GOAL_COMPLETE: (id: string) => `/api/onboarding/user/goals/${id}/complete/`,
  
  // Search
  SEARCH: '/api/search/',

  // Payments & Subscriptions
  PAYMENTS_PLANS: '/api/payments/plans/',
  PAYMENTS_MY_SUBSCRIPTION: '/api/payments/subscriptions/my-subscription/',
  PAYMENTS_QUOTAS: '/api/payments/subscriptions/quotas/',
  PAYMENTS_CREATE_ORDER: '/api/payments/payments/create-order/',
  PAYMENTS_VERIFY: '/api/payments/payments/verify-payment/',
  PAYMENTS_HISTORY: '/api/payments/payments/history/',
  SUBSCRIPTION_HISTORY: '/api/payments/subscriptions/history/',
  SUBSCRIPTION_CANCEL: '/api/payments/subscriptions/cancel/',

  // Social Learning & Notifications
  NOTIFICATIONS: '/api/notifications/',
  NOTIFICATIONS_UNREAD: '/api/notifications/unread/',
  NOTIFICATIONS_COUNT: '/api/notifications/count/',
  NOTIFICATIONS_MARK_READ: (id: string) => `/api/notifications/${id}/mark_read/`,
  NOTIFICATIONS_MARK_ALL_READ: '/api/notifications/mark_all_read/',
  NOTIFICATIONS_PREFERENCES: '/api/notifications/preferences/',
  
  SOCIAL_INVITE: '/api/social/invite/',
  SOCIAL_INVITE_REFRESH: '/api/social/invite/refresh/',
  
  SOCIAL_REQUESTS: '/api/social/connections/requests/',
  SOCIAL_REQUESTS_SENT: '/api/social/connections/requests/sent/',
  SOCIAL_REQUEST_ACCEPT: (id: string) => `/api/social/connections/requests/${id}/accept/`,
  SOCIAL_REQUEST_REJECT: (id: string) => `/api/social/connections/requests/${id}/reject/`,
  SOCIAL_REQUEST_CANCEL: (id: string) => `/api/social/connections/requests/${id}/cancel/`,
  
  SOCIAL_BUDDIES: '/api/social/buddies/',
  SOCIAL_BUDDY_DETAIL: (id: string) => `/api/social/buddies/${id}/`,
  SOCIAL_BUDDY_PREFERENCES: (id: string) => `/api/social/buddies/${id}/preferences/`,
  
  SOCIAL_ACTIVITY: '/api/social/activity/',
  SOCIAL_ACTIVITY_MY: '/api/social/activity/my/',

  // Admin Scraper
  SCRAPER_TRIGGER: '/api/admin/scraper/trigger/',
  SCRAPER_STATUS: (taskId: string) => `/api/admin/scraper/status/${taskId}/`,
  SCRAPER_SESSIONS: '/api/admin/scraper/sessions/',
  SCRAPER_SESSION_DETAILS: (sessionId: string) => `/api/admin/scraper/sessions/${sessionId}/details/`,
  SCRAPER_SESSION_VERIFY: (sessionId: string) => `/api/admin/scraper/sessions/${sessionId}/verify/`,
  SCRAPER_SESSION_IMPORT: (sessionId: string) => `/api/admin/scraper/sessions/${sessionId}/import/`,
  SCRAPER_SESSION_DELETE: (sessionId: string) => `/api/admin/scraper/sessions/${sessionId}/delete/`,
  
  // Scraper Actions
  SCRAPER_EXTRACT_NAMES: (sessionId: string, bookId: string) => `/api/admin/scraper/sessions/${sessionId}/books/${bookId}/extract-names/`,
  SCRAPER_CHAPTER_UPDATE: (sessionId: string, chapterId: string) => `/api/admin/scraper/sessions/${sessionId}/chapters/${chapterId}/update/`,

  // Public/SEO
  PUBLIC_CLASSES: '/api/public/classes/',
  PUBLIC_SUBJECTS: '/api/public/subjects/',
  PUBLIC_BOOKS: '/api/public/books/',
  PUBLIC_CHAPTERS: '/api/public/chapters/',
  PUBLIC_ARTICLES: '/api/public/articles/',
};
