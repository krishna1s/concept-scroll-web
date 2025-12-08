-- ====================================================================
-- ConceptScroll - Supabase Schema (DJANGO-MATCHED)
-- ====================================================================
-- This schema EXACTLY matches the Django backend models
-- Run this to create a schema compatible with Django migration
-- ====================================================================

-- Drop existing tables if recreating
DROP TABLE IF EXISTS user_challenge_progress CASCADE;
DROP TABLE IF EXISTS user_focus_sessions CASCADE;
DROP TABLE IF EXISTS user_quiz_history CASCADE;
DROP TABLE IF EXISTS user_daily_goals CASCADE;
DROP TABLE IF EXISTS user_feed_seen CASCADE;
DROP TABLE IF EXISTS user_onboarding_preferences CASCADE;
DROP TABLE IF EXISTS following CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS phone_otp CASCADE;
DROP TABLE IF EXISTS media_items CASCADE;
DROP TABLE IF EXISTS feed_posts CASCADE;
DROP TABLE IF EXISTS qa_items CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS mediums CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS otp_requests CASCADE;

-- ====================================================================
-- 1. EDUCATIONAL HIERARCHY
-- ====================================================================

-- Boards (CBSE, ICSE, State Boards)
CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_boards_code ON boards(code);
CREATE INDEX IF NOT EXISTS idx_boards_is_active ON boards(is_active);

-- Mediums (Languages)
CREATE TABLE IF NOT EXISTS mediums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  logo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mediums_code ON mediums(code);

-- Classes (Grades)
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  grade_number SMALLINT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  logo_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classes_board ON classes(board_id);
CREATE INDEX IF NOT EXISTS idx_classes_grade_number ON classes(grade_number);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(500),
  logo_url VARCHAR(500),
  color_code VARCHAR(10),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, class_id)
);

CREATE INDEX IF NOT EXISTS idx_subjects_class ON subjects(class_id);

-- Books
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image VARCHAR(500),
  logo_url VARCHAR(500),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  medium_id UUID NOT NULL REFERENCES mediums(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, subject_id, medium_id)
);

CREATE INDEX IF NOT EXISTS idx_books_subject ON books(subject_id);
CREATE INDEX IF NOT EXISTS idx_books_medium ON books(medium_id);

-- Chapters
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  number SMALLINT NOT NULL,
  description TEXT,
  pdf_file VARCHAR(500),
  azure_blob_url TEXT,
  chapter_identifier VARCHAR(255),
  logo_url VARCHAR(500),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  display_name VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, book_id)
);

CREATE INDEX IF NOT EXISTS idx_chapters_book ON chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_number ON chapters(book_id, number);

-- ====================================================================
-- 2. CONTENT TYPES
-- ====================================================================

-- Notes
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  note_type VARCHAR(50) DEFAULT 'explanation' CHECK (note_type IN ('definition', 'explanation', 'example', 'concept', 'formula', 'activity')),
  bullet_points JSONB DEFAULT '[]'::jsonb,
  examples JSONB DEFAULT '[]'::jsonb,
  hashtags VARCHAR(255),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  quality_score REAL DEFAULT 0.0,
  review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_chapter ON notes(chapter_id);
CREATE INDEX IF NOT EXISTS idx_notes_order ON notes(chapter_id, "order");
CREATE INDEX IF NOT EXISTS idx_notes_published ON notes(is_published);
CREATE INDEX IF NOT EXISTS idx_notes_review_status ON notes(review_status);

-- Polls
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  description TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer VARCHAR(255),
  explanation TEXT,
  poll_type VARCHAR(50) DEFAULT 'opinion' CHECK (poll_type IN ('opinion', 'knowledge', 'survey', 'quiz')),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  quality_score REAL DEFAULT 0.0,
  review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_polls_chapter ON polls(chapter_id);
CREATE INDEX IF NOT EXISTS idx_polls_type ON polls(poll_type);
CREATE INDEX IF NOT EXISTS idx_polls_published ON polls(is_published);
CREATE INDEX IF NOT EXISTS idx_polls_review_status ON polls(review_status);

-- QA Items (Questions & Answers)
CREATE TABLE IF NOT EXISTS qa_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  question_type VARCHAR(50) DEFAULT 'MCQ' CHECK (question_type IN ('MCQ', 'TrueFalse', 'FillInTheBlanks', 'ShortAnswer', 'LongAnswer')),
  options JSONB DEFAULT '[]'::jsonb,
  difficulty VARCHAR(20) DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  explanation TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  quality_score REAL DEFAULT 0.0,
  review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  attempt_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qa_items_chapter ON qa_items(chapter_id);
CREATE INDEX IF NOT EXISTS idx_qa_items_type ON qa_items(question_type);
CREATE INDEX IF NOT EXISTS idx_qa_items_difficulty ON qa_items(difficulty);
CREATE INDEX IF NOT EXISTS idx_qa_items_published ON qa_items(is_published);
CREATE INDEX IF NOT EXISTS idx_qa_items_review_status ON qa_items(review_status);

-- Media Items
CREATE TABLE IF NOT EXISTS media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('audio', 'video', 'image', 'document')),
  url VARCHAR(2048) NOT NULL,
  local_file VARCHAR(500),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  description TEXT,
  transcript TEXT,
  file_size BIGINT,
  duration INTEGER,
  mime_type VARCHAR(100),
  width INTEGER,
  height INTEGER,
  bitrate INTEGER,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  quality_score REAL DEFAULT 0.0,
  review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_items_chapter ON media_items(chapter_id);
CREATE INDEX IF NOT EXISTS idx_media_items_note ON media_items(note_id);
CREATE INDEX IF NOT EXISTS idx_media_items_type ON media_items(media_type);
CREATE INDEX IF NOT EXISTS idx_media_items_published ON media_items(is_published);
CREATE INDEX IF NOT EXISTS idx_media_items_review_status ON media_items(review_status);

-- Feed Posts
CREATE TABLE IF NOT EXISTS feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content_text TEXT NOT NULL,
  content_summary TEXT,
  content_type VARCHAR(20) DEFAULT 'CONCEPT' CHECK (content_type IN ('NOTE', 'QUESTION', 'CONCEPT', 'FORMULA', 'EXAMPLE')),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  medium_id UUID NOT NULL REFERENCES mediums(id) ON DELETE CASCADE,
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  is_ai_generated BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags JSONB DEFAULT '[]'::jsonb,
  difficulty_level SMALLINT DEFAULT 1 CHECK (difficulty_level IN (1, 2, 3)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feed_posts_subject ON feed_posts(subject_id);
CREATE INDEX IF NOT EXISTS idx_feed_posts_board ON feed_posts(board_id);
CREATE INDEX IF NOT EXISTS idx_feed_posts_class ON feed_posts(class_id);
CREATE INDEX IF NOT EXISTS idx_feed_posts_medium ON feed_posts(medium_id);
CREATE INDEX IF NOT EXISTS idx_feed_posts_type ON feed_posts(content_type);
CREATE INDEX IF NOT EXISTS idx_feed_posts_published ON feed_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_feed_posts_published_at ON feed_posts(published_at DESC);

-- ====================================================================
-- 3. USER & AUTHENTICATION
-- ====================================================================

-- User Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(150) UNIQUE,
  role VARCHAR(20) DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'TUTOR', 'ADMIN')),
  profile_picture VARCHAR(500),
  bio TEXT,
  phone_number VARCHAR(15) UNIQUE,
  is_phone_verified BOOLEAN DEFAULT false,
  google_id VARCHAR(255) UNIQUE,
  auth_provider VARCHAR(50) DEFAULT 'email',
  board_id UUID REFERENCES boards(id) ON DELETE SET NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  medium_id UUID REFERENCES mediums(id) ON DELETE SET NULL,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  preferred_language VARCHAR(10) DEFAULT 'en',
  dark_theme_enabled BOOLEAN DEFAULT false,
  push_notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone_number);
CREATE INDEX IF NOT EXISTS idx_user_profiles_google_id ON user_profiles(google_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_board ON user_profiles(board_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_class ON user_profiles(class_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_medium ON user_profiles(medium_id);

-- Following Relationships
CREATE TABLE IF NOT EXISTS following (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_following_follower ON following(follower_id);
CREATE INDEX IF NOT EXISTS idx_following_following ON following(following_id);

-- Phone OTP
CREATE TABLE IF NOT EXISTS phone_otp (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(15) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_phone_otp_phone_otp ON phone_otp(phone_number, otp_code);

-- ====================================================================
-- 4. ONBOARDING & USER PROGRESS
-- ====================================================================

-- User Onboarding Preferences
CREATE TABLE IF NOT EXISTS user_onboarding_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_onboarding_user ON user_onboarding_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_role ON user_onboarding_preferences(role);

-- User Feed Seen (Track what user has seen)
CREATE TABLE IF NOT EXISTS user_feed_seen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id VARCHAR(255) NOT NULL,
  seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

CREATE INDEX IF NOT EXISTS idx_user_feed_seen_user ON user_feed_seen(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feed_seen_content ON user_feed_seen(user_id, content_id);
CREATE INDEX IF NOT EXISTS idx_user_feed_seen_at ON user_feed_seen(seen_at);

-- User Daily Goals
CREATE TABLE IF NOT EXISTS user_daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  subject_id VARCHAR(64) NOT NULL,
  subject_name VARCHAR(128) NOT NULL,
  chapter_id VARCHAR(64) NOT NULL,
  chapter_name VARCHAR(128) NOT NULL,
  target_minutes INTEGER NOT NULL,
  completed_minutes INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_goals_user ON user_daily_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_goals_date ON user_daily_goals(date DESC);

-- User Quiz History
CREATE TABLE IF NOT EXISTS user_quiz_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id VARCHAR(64) NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_quiz_history_user ON user_quiz_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_history_date ON user_quiz_history(date DESC);

-- User Focus Sessions
CREATE TABLE IF NOT EXISTS user_focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id VARCHAR(64) NOT NULL,
  subject_name VARCHAR(128) NOT NULL,
  chapter_id VARCHAR(64) NOT NULL,
  chapter_name VARCHAR(128) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_focus_sessions_user ON user_focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_focus_sessions_start ON user_focus_sessions(start_time DESC);

-- User Challenge Progress
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id VARCHAR(64) NOT NULL,
  title VARCHAR(128) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_challenge_progress_user ON user_challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenge_progress_start ON user_challenge_progress(start_date DESC);

-- ====================================================================
-- TRIGGERS FOR updated_at
-- ====================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND column_name = 'updated_at'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$;

-- ====================================================================
-- DONE! Schema created to match Django backend
-- ====================================================================

SELECT 'Django-matched schema created successfully!' as status;
