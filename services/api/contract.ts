/**
 * API Contract - Abstract interface for backend communication
 * 
 * This contract defines all API methods that the frontend needs.
 * It can be implemented by different backends (Supabase, Django REST, etc.)
 * 
 * Benefits:
 * - Frontend code is decoupled from backend implementation
 * - Easy to swap between Supabase and your Django backend
 * - Type-safe API calls
 * - Centralized API documentation
 */

import {
  User,
  UserProfile,
  AuthTokens,
  OnboardingPreferences,
  Board,
  Class,
  Medium,
  Subject,
  Book,
  Chapter,
  ContentItem,
  Note,
  Quiz,
  Poll,
  PollResponse,
  Comment,
  Like,
  Bookmark,
  Follow,
  UserGoal,
  QuizHistory,
  FocusSession,
  UserChallengeProgress,
  FeedFilters,
  FeedFilterOptions,
  PaginatedResponse,
  QuizAnswer,
} from '../../types';

export interface IApiClient {
  // ==================== Authentication ====================
  
  /**
   * Request OTP for phone number authentication
   * POST /api/users/auth/request_otp/
   */
  requestOTP(phoneNumber: string): Promise<{ success: boolean; message: string }>;
  
  /**
   * Verify OTP and get JWT tokens
   * POST /api/users/auth/verify_otp/
   */
  verifyOTP(
    phoneNumber: string, 
    otpCode: string, 
    profile?: { first_name: string; last_name: string; email?: string }
  ): Promise<AuthTokens>;
  
  /**
   * Sign out current user
   */
  signOut(): Promise<void>;
  
  /**
   * Get current session
   */
  getSession(): Promise<{ user: User | null; accessToken: string | null }>;
  
  // ==================== User Profile ====================
  
  /**
   * Get user profile
   * GET /api/users/profile/
   */
  getProfile(): Promise<UserProfile>;
  
  /**
   * Update user profile
   * PATCH /api/users/profile/
   */
  updateProfile(updates: Partial<UserProfile>): Promise<UserProfile>;
  
  /**
   * Get another user's profile
   */
  getUserProfile(userId: string): Promise<UserProfile>;
  
  // ==================== Onboarding ====================
  
  /**
   * Get current user's onboarding preferences
   * GET /api/onboarding/preferences/me/
   */
  getOnboardingPreferences(): Promise<OnboardingPreferences | null>;
  
  /**
   * Create or update onboarding preferences
   * POST /api/onboarding/preferences/
   */
  saveOnboardingPreferences(preferences: Partial<OnboardingPreferences>): Promise<OnboardingPreferences>;
  
  /**
   * Partial update for stepwise onboarding
   * PATCH /api/onboarding/preferences/{id}/
   */
  updateOnboardingStep(step: Partial<OnboardingPreferences>): Promise<OnboardingPreferences>;
  
  // ==================== Educational Structure ====================
  
  /**
   * Get all boards
   * GET /api/boards/
   */
  getBoards(): Promise<Board[]>;
  
  /**
   * Get all classes
   * GET /api/classes/
   */
  getClasses(boardId?: string): Promise<Class[]>;
  
  /**
   * Get all mediums
   * GET /api/mediums/
   */
  getMediums(): Promise<Medium[]>;
  
  /**
   * Get subjects for a class
   * GET /api/classes/{id}/subjects/
   */
  getSubjects(classId: string, boardId?: string): Promise<Subject[]>;
  
  /**
   * Get books for subject
   * GET /api/books/?subject_id=X&class_id=Y&medium_id=Z
   */
  getBooks(filters: { subjectId?: string; classId?: string; mediumId?: string }): Promise<Book[]>;
  
  /**
   * Get chapters for a book
   * GET /api/books/{id}/chapters/
   */
  getChapters(bookId: string): Promise<Chapter[]>;
  
  /**
   * Get chapter by ID
   */
  getChapter(chapterId: string): Promise<Chapter>;
  
  // ==================== Feed System ====================
  
  /**
   * Get personalized home feed
   * GET /api/feed/content-items/feed/home/
   */
  getHomeFeed(page: number, size: number): Promise<PaginatedResponse<ContentItem>>;
  
  /**
   * Get explore feed with filters
   * GET /api/feed/content-items/feed/explore/
   */
  getExploreFeed(
    page: number,
    size: number,
    filters?: FeedFilters
  ): Promise<PaginatedResponse<ContentItem>>;
  
  /**
   * Get bookmarked content
   * GET /api/feed/content-items/feed/bookmarks/
   */
  getBookmarkedFeed(page: number, size: number): Promise<PaginatedResponse<ContentItem>>;
  
  /**
   * Get available filter options
   * GET /api/feed/content-items/feed/filters/
   */
  getFeedFilterOptions(): Promise<FeedFilterOptions>;
  
  /**
   * Get single content item
   */
  getContentItem(id: string): Promise<ContentItem>;
  
  // ==================== Interactions ====================
  
  /**
   * Like a content item
   * POST /api/feed/content-items/{id}/like/
   */
  likeContent(contentItemId: string): Promise<Like>;
  
  /**
   * Unlike a content item
   * DELETE /api/feed/content-items/{id}/like/
   */
  unlikeContent(contentItemId: string): Promise<void>;
  
  /**
   * Bookmark a content item
   * POST /api/feed/content-items/{id}/bookmark/
   */
  bookmarkContent(contentItemId: string): Promise<Bookmark>;
  
  /**
   * Remove bookmark
   * DELETE /api/feed/content-items/{id}/bookmark/
   */
  unbookmarkContent(contentItemId: string): Promise<void>;
  
  /**
   * Add a comment
   * POST /api/feed/content-items/{id}/comment/
   */
  addComment(contentItemId: string, text: string, parentCommentId?: string): Promise<Comment>;
  
  /**
   * Get comments for content item
   */
  getComments(contentItemId: string, page: number, size: number): Promise<PaginatedResponse<Comment>>;
  
  /**
   * Delete a comment
   */
  deleteComment(commentId: string): Promise<void>;
  
  /**
   * Share content (increment share count)
   */
  shareContent(contentItemId: string): Promise<void>;
  
  /**
   * Vote on a poll
   * POST /api/feed/content-items/{id}/poll-response/
   */
  votePoll(pollId: string, optionId: string): Promise<PollResponse>;
  
  // ==================== Social ====================
  
  /**
   * Follow a user
   * POST /api/feed/follows/
   */
  followUser(userId: string): Promise<Follow>;
  
  /**
   * Unfollow a user
   * DELETE /api/feed/follows/{id}/
   */
  unfollowUser(userId: string): Promise<void>;
  
  /**
   * Get user's followers
   */
  getFollowers(userId: string, page: number, size: number): Promise<PaginatedResponse<UserProfile>>;
  
  /**
   * Get user's following
   */
  getFollowing(userId: string, page: number, size: number): Promise<PaginatedResponse<UserProfile>>;
  
  // ==================== Library (Chapter Content) ====================
  
  /**
   * Get notes for a chapter
   * GET /api/notes/chapter/{chapter_id}/
   */
  getChapterNotes(chapterId: string): Promise<Note[]>;
  
  /**
   * Get quizzes for a chapter
   */
  getChapterQuizzes(chapterId: string): Promise<Quiz[]>;
  
  /**
   * Get QA items for a chapter
   * GET /api/qa/chapter/{chapter_id}/
   */
  getChapterQA(chapterId: string): Promise<any[]>;
  
  // ==================== Gamification ====================
  
  /**
   * Get today's daily goal
   * GET /api/onboarding/user/goals/current/
   */
  getCurrentDailyGoal(): Promise<import('../../types').DailyGoal | null>;

  /**
   * Create a daily goal
   * POST /api/onboarding/user/goals/
   */
  createDailyGoal(data: import('../../types').GoalCreationRequest): Promise<import('../../types').DailyGoal>;

  /**
   * Update daily goal progress
   * PATCH /api/onboarding/user/goals/{id}/
   */
  updateDailyGoalProgress(goalId: string, completedMinutes: number): Promise<import('../../types').DailyGoal>;

  /**
   * Start a daily goal session
   * POST /api/onboarding/user/goals/{id}/start-session/
   */
  startDailyGoalSession(goalId: string): Promise<import('../../types').DailyGoal>;

  /**
   * Stop a daily goal session
   * POST /api/onboarding/user/goals/{id}/stop-session/
   */
  stopDailyGoalSession(goalId: string, secondsStudied: number): Promise<import('../../types').DailyGoal>;

  /**
   * Complete daily goal
   * POST /api/onboarding/user/goals/{id}/complete/
   */
  completeDailyGoal(goalId: string): Promise<import('../../types').GoalCompletionResponse>;
  
  /**
   * Get current user's daily goals (Legacy/General)
   * GET /api/onboarding/user/goals/
   */
  getUserGoals(date?: string): Promise<UserGoal[]>;
  
  /**
   * Get today's goal
   * GET /api/onboarding/user/goals/current/
   */
  getTodayGoal(): Promise<UserGoal | null>;
  
  /**
   * Create a new goal
   */
  createGoal(goal: Partial<UserGoal>): Promise<UserGoal>;
  
  /**
   * Update goal progress
   */
  updateGoalProgress(goalId: string, currentValue: number): Promise<UserGoal>;
  
  /**
   * Get quiz history
   * GET /api/onboarding/user/quiz-history/
   */
  getQuizHistory(page: number, size: number): Promise<PaginatedResponse<QuizHistory>>;
  
  /**
   * Submit quiz answers
   */
  submitQuiz(quizId: string, answers: QuizAnswer[], timeTaken: number): Promise<QuizHistory>;
  
  /**
   * Get focus sessions
   * GET /api/onboarding/user/focus-sessions/
   */
  getFocusSessions(page: number, size: number): Promise<PaginatedResponse<FocusSession>>;
  
  /**
   * Create focus session
   */
  createFocusSession(chapterId: string, durationMinutes: number): Promise<FocusSession>;
  
  /**
   * Get user challenges
   * GET /api/onboarding/challenges/
   */
  getUserChallenges(): Promise<UserChallengeProgress[]>;
  
  /**
   * Get latest challenge
   * GET /api/onboarding/challenges/latest/
   */
  getLatestChallenge(): Promise<UserChallengeProgress | null>;
  
  // ==================== Tracking ====================
  
  /**
   * Mark content as seen
   * POST /api/onboarding/feed/seen/
   */
  markContentSeen(contentItemId: string): Promise<void>;
  
  /**
   * Get seen content items
   * GET /api/onboarding/feed/seen/
   */
  getSeenContent(page: number, size: number): Promise<PaginatedResponse<string>>;

  // ==================== Dashboard & New Gamification ====================

  /**
   * Get main dashboard overview
   * GET /api/feed/dashboard/overview/
   */
  getDashboardOverview(): Promise<import('../../types').DashboardData>;

  /**
   * Get user points and streak
   * GET /api/feed/user-points/me/
   */
  getUserPoints(): Promise<import('../../types').UserPoints>;

  /**
   * Get all available badges
   * GET /api/feed/badges/
   */
  getBadges(): Promise<import('../../types').Badge[]>;

  /**
   * Get my earned badges
   * GET /api/feed/user-badges/my-badges/
   */
  getMyBadges(): Promise<import('../../types').Badge[]>;

  /**
   * Get badge progress
   * GET /api/feed/user-badges/progress/
   */
  getBadgeProgress(): Promise<any>; // Define strict type if available

  /**
   * Get XP transactions
   * GET /api/feed/xp-transactions/
   */
  getXPTransactions(page: number, size: number): Promise<PaginatedResponse<import('../../types').XPTransaction>>;

  /**
   * Get XP summary
   * GET /api/feed/xp-transactions/summary/
   */
  getXPSummary(): Promise<any>;

  // ==================== Payments & Subscriptions ====================

  /**
   * Get all subscription plans
   * GET /api/payments/plans/
   */
  getSubscriptionPlans(language?: string): Promise<import('../../types').SubscriptionPlan[]>;

  /**
   * Get current subscription
   * GET /api/payments/subscriptions/my-subscription/
   */
  getCurrentSubscription(): Promise<import('../../types').Subscription>;

  /**
   * Get quota status
   * GET /api/payments/subscriptions/quotas/
   */
  getQuotaStatus(): Promise<import('../../types').QuotaStatus>;

  /**
   * Create payment order
   * POST /api/payments/payments/create-order/
   */
  createPaymentOrder(planId: string): Promise<import('../../types').PaymentOrder>;

  /**
   * Verify payment
   * POST /api/payments/payments/verify-payment/
   */
  verifyPayment(
    razorpayOrderId: string, 
    razorpayPaymentId: string, 
    razorpaySignature: string
  ): Promise<import('../../types').PaymentVerificationResponse>;

  /**
   * Get payment history
   * GET /api/payments/payments/history/
   */
  getPaymentHistory(): Promise<import('../../types').PaymentHistory[]>;

  /**
   * Get subscription history
   * GET /api/payments/subscriptions/history/
   */
  getSubscriptionHistory(): Promise<import('../../types').Subscription[]>;

  /**
   * Cancel subscription
   * POST /api/payments/subscriptions/cancel/
   */
  cancelSubscription(reason?: string, feedback?: string): Promise<any>;

  // ==================== Scraper (Admin) ====================

  /**
   * Trigger a new scraping task
   * POST /api/admin/scraper/trigger/
   */
  triggerScraper(data: { class_name: string; subject_name: string; medium?: string }): Promise<{ success: boolean; task_id: string; error?: string }>;

  /**
   * Get status of a background task
   * GET /api/admin/scraper/status/{task_id}/
   */
  getScraperTaskStatus(taskId: string): Promise<import('../../types').ScrapingTask>;

  /**
   * Get all scraper sessions
   * GET /api/admin/scraper/sessions/
   */
  getScraperSessions(): Promise<{ success: boolean; sessions: import('../../types').ScrapeSession[] }>;

  /**
   * Get details of a specific session
   * GET /api/admin/scraper/sessions/{session_id}/details/
   */
  getScraperSessionDetails(sessionId: string): Promise<{ success: boolean; session: import('../../types').ScrapeSession; data: import('../../types').ScraperPreviewData }>;

  /**
   * Verify a session
   * POST /api/admin/scraper/sessions/{session_id}/verify/
   */
  verifyScraperSession(sessionId: string): Promise<{ success: boolean }>;

  /**
   * Import a session
   * POST /api/admin/scraper/sessions/{session_id}/import/
   */
  importScraperSession(sessionId: string, options?: any): Promise<{ success: boolean }>;

  /**
   * Delete a session
   * DELETE /api/admin/scraper/sessions/{session_id}/delete/
   */
  deleteScraperSession(sessionId: string): Promise<{ success: boolean }>;

  /**
   * Extract chapter names (Action)
   */
  extractChapterNames(sessionId: string, bookId: string, medium: string): Promise<void>;

  /**
   * Update chapter details (Action)
   */
  updateScrapedChapter(sessionId: string, chapterId: string, data: { name?: string; number?: number }): Promise<void>;
  
  // ==================== Public/SEO ====================
  
  getPublicClasses(): Promise<Class[]>;
  getPublicSubjects(classId: string): Promise<Subject[]>;
  getPublicBooks(classId: string, subjectId: string): Promise<Book[]>;
  getPublicChapters(bookId: string): Promise<Chapter[]>;

  // Legacy / Deprecated methods
  getScraperJobs(): Promise<import('../../types').ScraperJob[]>;
  scheduleScraperJob(config: any): Promise<any>;
  getScraperJob(jobId: string): Promise<any>;
  getScraperJobPreview(jobId: string): Promise<any>;
  importScrapedContent(jobId: string, books: any[]): Promise<void>;
  deleteScraperJob(jobId: string): Promise<void>;
}
