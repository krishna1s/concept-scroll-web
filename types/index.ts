// Core Type Definitions matching backend schema

// ==================== User & Auth ====================
export interface User {
  id: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  is_superuser?: boolean;
  is_super_admin?: boolean; // Added based on API response
  is_staff?: boolean;
  bio?: string;
  followers_count: number;
  following_count: number;
  is_following?: boolean;
  
  // Educational Info
  board?: string;
  board_id?: string;
  class?: string;
  class_id?: string;
  class_grade?: string; // Mapped from API
  grade?: string;
  medium?: string;
  medium_id?: string;
  school?: string;
  subjects?: string[];
  
  // Alternative names from specific social endpoints
  name?: string;
  board_name?: string;
  class_name?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: User;
}

// ==================== Onboarding ====================
export interface OnboardingPreferences {
  id: string;
  user_id: string;
  role: 'student' | 'teacher' | 'parent';
  board_id?: string;
  class_id?: string;
  medium_id?: string;
  subject_ids: string[];
  goals?: string[];
  completed: boolean;
  is_profile_complete?: boolean;
  created_at: string;
  updated_at: string;
  data?: any;
}

// ==================== Educational Structure ====================
export interface Board {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  is_active: boolean;
}

export interface Class {
  id: string;
  name: string;
  grade_number: number;
  board_id: string;
  is_active: boolean;
}

export interface Medium {
  id: string;
  name: string;
  code: string; // e.g., 'en', 'hi', 'ta'
  is_active: boolean;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  class_id: string;
  board_id: string;
  is_active: boolean;
}

export interface Book {
  id: string;
  name: string;
  title?: string;
  description?: string;
  cover_image?: string;
  subject_id: string;
  class_id: string;
  medium_id: string;
  author?: string;
  publisher?: string;
  is_active: boolean;
}

export interface Chapter {
  id: string;
  name: string;
  display_name?: string;
  title?: string;
  chapter_number: number;
  description?: string;
  book_id: string;
  is_active: boolean;
  notes_count?: number;
  quizzes_count?: number;
  pdf_file?: string;
  logo_url?: string;
}

// ==================== Content Types ====================
export type ContentType = 'note' | 'quiz' | 'poll' | 'media';

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  chapter_id: string;
  subject_id: string;
  created_by: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  media_urls?: string[];
  audio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  chapter_id: string;
  subject_id: string;
  questions: QuizQuestion[];
  duration_minutes?: number;
  passing_score?: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number; // index of correct option
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  chapter_id?: string;
  subject_id?: string;
  created_by: string;
  expires_at?: string;
  created_at: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage?: number;
}

export interface PollResponse {
  id: string;
  poll_id: string;
  user_id: string;
  option_id: string;
  created_at: string;
}

// ==================== Feed & Content Items ====================
export interface ContentItem {
  id: string;
  type: ContentType;
  content: Note | Quiz | Poll;
  author: UserProfile;
  chapter?: Chapter;
  subject?: Subject;
  
  // Engagement metrics
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  shares_count: number;
  
  // User interactions
  is_liked: boolean;
  is_bookmarked: boolean;
  user_poll_response?: string; // option_id if user voted
  
  created_at: string;
  updated_at: string;
}

// ==================== Interactions ====================
export interface Like {
  id: string;
  content_item_id: string;
  user_id: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  content_item_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  content_item_id: string;
  user_id: string;
  user: UserProfile;
  text: string;
  parent_comment_id?: string;
  replies_count: number;
  likes_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

// ==================== Gamification ====================
export interface UserGoal {
  id: string;
  user_id: string;
  goal_type: 'daily_study' | 'weekly_quiz' | 'reading_streak';
  target_value: number;
  current_value: number;
  date: string; // YYYY-MM-DD
  completed: boolean;
  created_at: string;
}

export interface QuizHistory {
  id: string;
  user_id: string;
  quiz_id: string;
  quiz: Quiz;
  score: number;
  total_questions: number;
  time_taken_seconds: number;
  answers: QuizAnswer[];
  completed_at: string;
}

export interface QuizAnswer {
  question_id: string;
  selected_answer: number;
  is_correct: boolean;
  time_taken_seconds: number;
}

export interface FocusSession {
  id: string;
  user_id: string;
  chapter_id: string;
  chapter?: Chapter;
  duration_minutes: number;
  started_at: string;
  ended_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: 'streak' | 'quiz_master' | 'knowledge_seeker';
  target_value: number;
  reward_points: number;
  badge_icon?: string;
  start_date: string;
  end_date: string;
}

export interface UserChallengeProgress {
  id: string;
  user_id: string;
  challenge_id: string;
  challenge: Challenge;
  current_value: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

// ==================== Feed Filters ====================
export interface FeedFilters {
  subjects?: string[];
  types?: ContentType[];
  difficulty?: ('easy' | 'medium' | 'hard')[];
  chapters?: string[];
  sort_by?: 'recent' | 'popular' | 'trending';
}

export interface FeedFilterOptions {
  subjects: Subject[];
  chapters: Chapter[];
  types: ContentType[];
}

// ==================== API Response Wrappers ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
  code: number;
}

export interface ApiError {
  field?: string;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  has_more: boolean;
}

// ==================== Theme ====================
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
}

// ==================== Locale ====================
export type Locale = 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'bn';

// ==================== User Models from GitHub ====================

export interface Profile {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  grade: string;
  bio: string;
  isVerified: boolean;
  followers: number;
  following: number;
  mutualFollowers?: number; // Premium only
  joinDate: string;
  isPremium: boolean;
  timezone: string;
  language: string;
  reelsCount: number;
  postsCount: number;
  achievementsCount: number;
  savedCount: number;
  streakDays: number;
}

export interface Post {
  id: string;
  userId: string;
  type: 'note' | 'text' | 'pdf' | 'image' | 'example' | 'quiz' | 'poll' | 'challenge';
  title: string;
  content: string;
  subject: string;
  subjectId: string;
  attachments?: string[];
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPro: boolean;
}

export interface Reel {
  id: string;
  userId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  subject: string;
  subjectId: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  createdAt: string;
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  category: 'streak' | 'quiz' | 'post' | 'learning' | 'social' | 'premium';
  unlockedAt: string;
  isExclusive: boolean; // Premium only achievements
}

export interface Activity {
  date: string;
  studyTimeMinutes: number;
  subjects: {
    id: string;
    name: string;
    timeSpentMinutes: number;
    progress: number; // 0-100
  }[];
  quizzesTaken: number;
  quizAvgScore: number;
  notesCreated: number;
  streakDay: boolean;
}

// ==================== Dashboard Data ====================

export interface DashboardStats {
  days_streak: number;
  xp_points: number;
  level: number;
  library_items: number;
}

export interface DailyGoal {
  id?: string;
  subject_id?: string; // Needed for session filters
  title: string; // "Subject - Chapter" or just subject
  subject_name?: string;
  chapter_name?: string;
  current: number; // completed_minutes
  target: number; // target_minutes
  completed_minutes?: number; // alias for current
  target_minutes?: number; // alias for target
  progress_percentage: number;
  is_completed?: boolean;
  streak?: number;
  date?: string;
  is_active?: boolean;
  session_start_time?: string;
  elapsed_session_minutes?: number;
}

export interface GoalCreationRequest {
  subject_id: string;
  subject_name: string;
  target_minutes: number;
  date: string;
  // chapter_id/name are optional now or removed
  chapter_id?: string;
  chapter_name?: string;
}

export interface GoalCompletionResponse {
  is_completed: boolean;
  streak: number;
  xp_earned: number;
  badge_earned: Badge | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked_at?: string;
  progress?: number;
}

export interface LeaderboardInfo {
  rank: number | null;
  total_users: number;
}

export interface SubscriptionInfo {
  tier: string;
  status: 'active' | 'inactive' | 'expired';
  expires_at: string | null;
  features: Record<string, boolean>;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
}

export interface DashboardData {
  stats: DashboardStats;
  daily_goal: DailyGoal;
  badges: Badge[];
  badges_total: number;
  learning_progress: any[]; // Define structure if available
  leaderboard: LeaderboardInfo;
  subscription: SubscriptionInfo;
  quick_actions: QuickAction[];
  user: {
    username: string;
    phone_number: string;
    profile_picture: string;
    first_name?: string;
    last_name?: string;
  };
}

// ==================== Gamification Models ====================

export interface UserPoints {
  user_id: string;
  total_points: number;
  current_streak: number;
  level: number;
}

export interface XPTransaction {
  id: string;
  amount: number;
  reason: string;
  source: string;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string;
  points: number;
  rank: number;
}

// ==================== Payments & Subscriptions ====================

export interface SubscriptionPlan {
  id: string;
  name: string;
  plan_type: 'free' | 'pro' | 'premium';
  billing_period: 'monthly' | 'yearly';
  price: string;
  currency: string;
  description: string;
  features: string[];
  localized_description?: string;
  localized_features?: string[];
  displayFeatures?: string[]; // Frontend helper
  displayDescription?: string; // Frontend helper
  quotas: {
    max_daily_goals: number;
    daily_quiz_attempts: number;
    ai_grader_usage: number;
    pdf_downloads: number;
    video_access: number;
  };
  is_popular: boolean;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  user: string;
  plan: string | {
    id: string;
    name: string;
    plan_type: string;
    price: string;
    quotas: any;
  };
  plan_details?: {
    id: string;
    name: string;
    plan_type: string;
    price: string;
    currency: string;
    description: string;
    features: string[];
    localized_description?: string;
    localized_features?: string[];
    quotas: any;
    is_popular: boolean;
    is_active: boolean;
  };
  status: 'free' | 'active' | 'expired' | 'cancelled' | 'payment_pending';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  days_remaining: number;
}

export interface QuotaStatus {
  plan: {
    id: string;
    name: string;
    plan_type: string;
    quotas: any;
  };
  quotas: {
    max_daily_goals: QuotaItem;
    daily_quiz_attempts: QuotaItem;
    video_access: QuotaItem;
    ai_grader_usage?: QuotaItem;
    pdf_downloads?: QuotaItem;
  };
}

export interface QuotaItem {
  limit: number;
  used: number;
  remaining: number;
  unlimited: boolean;
}

export interface PaymentOrder {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key: string;
  plan_name: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

export interface PaymentVerificationResponse {
  payment_verified?: boolean;
  subscription: Subscription;
  payment_order?: any;
}

export interface PaymentHistory {
  id: string;
  plan?: {
    name: string;
    price: string;
  };
  plan_name?: string;
  amount: string;
  currency: string;
  status: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  created_at: string;
  paid_at: string;
}

// ==================== Scraper ====================

export interface ScrapeSession {
  id: string;
  session_id: string;
  class_filter: string;
  subject_filter: string;
  medium_filter?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'verified' | 'imported' | 'failed';
  created_at: string;
  updated_at: string;
  error_message?: string;
  books_found?: number;
  chapters_found?: number;
  total_chapters?: number;
}

export interface ScrapingTask {
  task_id: string;
  status: 'pending' | 'started' | 'retry' | 'failure' | 'success';
  result?: any;
  error?: string;
  done: boolean;
}

export interface ScraperJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  class_id: string;
  subject_id: string;
  medium_id: string;
  progress: number;
  message: string;
  books_found: number;
  chapters_found: number;
  created_at: string;
  updated_at: string;
}

export interface ScraperPreviewData {
  books?: ScrapedBook[];
  classes?: { books: ScrapedBook[] }[];
  statistics?: any;
}

export interface ScrapedBook {
  id: string;
  title?: string;
  name?: string;
  medium?: string;
  subject?: string;
  chapters: ScrapedChapter[];
  extraction_status?: string;
}

export interface ScrapedChapter {
  id: string;
  title?: string;
  name?: string;
  pdf_url?: string;
  chapter_number: number;
  extraction_status?: string;
}
