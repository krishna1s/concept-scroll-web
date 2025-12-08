# Django Backend vs Supabase Schema Comparison

## 📋 Overview

This document compares your Django backend models with the current Supabase schema to ensure compatibility for future Django migration.

---

## ✅ **Core Educational Hierarchy** 

### **1. Board**
| Field | Django | Current Supabase | Status |
|-------|--------|------------------|--------|
| id | UUID (auto) | UUID | ✅ Match |
| name | CharField(100, unique) | VARCHAR(100) | ✅ Match |
| **code** | **CharField(20, unique)** | **MISSING** | ❌ **Need to add** |
| description | TextField (nullable) | TEXT | ✅ Match |
| logo_url | URLField (nullable) | VARCHAR(500) | ✅ Match |
| is_active | BooleanField(default=True) | BOOLEAN | ✅ Match |
| created_at | auto_now_add | TIMESTAMP | ✅ Match |
| updated_at | auto_now | TIMESTAMP | ✅ Match |

**Action**: Add `code` column to boards table.

---

### **2. Medium**
| Field | Django | Current Supabase | Status |
|-------|--------|------------------|--------|
| id | UUID | UUID | ✅ Match |
| name | CharField(100, unique) | VARCHAR(100) | ✅ Match |
| code | CharField(20, unique) | VARCHAR(20, unique) | ✅ Match |
| logo_url | URLField (nullable) | VARCHAR(500) | ✅ Match |
| is_active | BooleanField | BOOLEAN | ✅ Match |

**Status**: ✅ **Perfect match!**

---

### **3. Class**
| Field | Django | Current Supabase | Status |
|-------|--------|------------------|--------|
| id | UUID | UUID | ✅ Match |
| name | CharField(50) | VARCHAR(100) | ✅ Match |
| **grade_number** | **PositiveSmallIntegerField** | **grade_level (INTEGER)** | ⚠️ **Rename** |
| description | TextField (nullable) | TEXT | ✅ Match |
| is_active | BooleanField | BOOLEAN | ✅ Match |
| board (FK) | ForeignKey(Board) | board_id UUID | ✅ Match |
| logo_url | URLField (nullable) | VARCHAR(500) | ✅ Match |

**Action**: Rename `grade_level` to `grade_number` in classes table.

---

### **4. Subject**
| Field | Django | Current Supabase | Status |
|-------|--------|------------------|--------|
| id | UUID | UUID | ✅ Match |
| name | CharField(100) | VARCHAR(255) | ✅ Match |
| description | TextField (nullable) | TEXT | ✅ Match |
| icon_url | URLField (nullable) | **MISSING** | ❌ **Add** |
| logo_url | URLField (nullable) | **MISSING** | ❌ **Add** |
| **color_code** | **CharField(10, nullable)** | **MISSING** | ❌ **Add** |
| class_fk (FK) | ForeignKey(Class) | class_id UUID | ✅ Match |
| **board_id** | **NOT IN DJANGO** | **UUID (FK)** | ❌ **REMOVE** |
| is_active | BooleanField | BOOLEAN | ✅ Match |

**Action**: 
1. Remove `board_id` from subjects (Django doesn't have it - gets board through class)
2. Add `icon_url`, `logo_url`, `color_code`

---

### **5. Book**
| Field | Django | Current Supabase | Status |
|-------|--------|------------------|--------|
| id | UUID | UUID | ✅ Match |
| name | CharField(200) | title VARCHAR(255) | ⚠️ **Rename to 'name'** |
| description | TextField (nullable) | TEXT | ✅ Match |
| cover_image | ImageField (nullable) | **MISSING** | ❌ **Add** |
| logo_url | URLField (nullable) | **MISSING** | ❌ **Add** |
| subject (FK) | ForeignKey(Subject) | subject_id UUID | ✅ Match |
| medium (FK) | ForeignKey(Medium) | medium_id UUID | ✅ Match |
| **class_id** | **NOT IN DJANGO** | **UUID (FK)** | ❌ **REMOVE** |
| **author, publisher** | **NOT IN DJANGO** | **VARCHAR(255)** | ❌ **REMOVE** |
| is_active | BooleanField | BOOLEAN | ✅ Match |

**Action**:
1. Rename `title` to `name`
2. Remove `class_id`, `author`, `publisher`
3. Add `cover_image`, `logo_url`

---

### **6. Chapter**
| Field | Django | Current Supabase | Status |
|-------|--------|------------------|--------|
| id | UUID | UUID | ✅ Match |
| name | CharField(200) | title VARCHAR(255) | ⚠️ **Rename to 'name'** |
| number | PositiveSmallIntegerField | chapter_number INTEGER | ⚠️ **Rename** |
| description | TextField (nullable) | TEXT | ✅ Match |
| **pdf_file** | **URLField (nullable)** | **MISSING** | ❌ **Add** |
| **azure_blob_url** | **TextField (nullable)** | **MISSING** | ❌ **Add** |
| **chapter_identifier** | **CharField(255, nullable)** | **MISSING** | ❌ **Add** |
| logo_url | URLField (nullable) | **MISSING** | ❌ **Add** |
| book (FK) | ForeignKey(Book) | book_id UUID | ✅ Match |
| is_active | BooleanField | BOOLEAN | ✅ Match |
| **display_name** | **CharField(200, nullable)** | **MISSING** | ❌ **Add** |

**Action**:
1. Rename `title` to `name`, `chapter_number` to `number`
2. Add `pdf_file`, `azure_blob_url`, `chapter_identifier`, `logo_url`, `display_name`

---

## 📝 **Content Types**

### **7. Note**
| Field | Django | Current Supabase | Status |
|-------|--------|------------------|--------|
| id | UUID | UUID | ✅ Match |
| title | CharField(255) | VARCHAR(255) | ✅ Match |
| content | TextField | TEXT | ✅ Match |
| **order** | **IntegerField(default=0)** | **MISSING** | ❌ **Add** |
| chapter (FK) | ForeignKey(Chapter) | chapter_id UUID | ✅ Match |
| **subject_id** | **NOT IN DJANGO** | **UUID (FK)** | ❌ **REMOVE** |
| **note_type** | **CharField(50, choices)** | **MISSING** | ❌ **Add** |
| **bullet_points** | **JSONField(default=list)** | **MISSING** | ❌ **Add** |
| **examples** | **JSONField(default=list)** | **MISSING** | ❌ **Add** |
| **hashtags** | **CharField(255)** | **MISSING** | ❌ **Add** |
| is_published | BooleanField | **MISSING** | ❌ **Add** |
| published_at | DateTimeField (nullable) | **MISSING** | ❌ **Add** |
| **quality_score** | **FloatField(default=0.0)** | **MISSING** | ❌ **Add** |
| **review_status** | **CharField(20, choices)** | status VARCHAR(20) | ⚠️ **Rename** |
| **summary** | **NOT IN DJANGO** | **TEXT** | ❌ **REMOVE** |
| **media_urls, audio_url** | **NOT IN DJANGO** | **TEXT[]** | ❌ **REMOVE** |
| **created_by** | **NOT IN DJANGO** | **UUID (FK)** | ❌ **REMOVE** |

**Action**: Major restructure needed to match Django model.

---

### **8. Poll**
| Field | Django | Current Supabase | Status |
|-------|--------|------------------|--------|
| id | UUID | UUID | ✅ Match |
| chapter (FK) | ForeignKey(Chapter) | chapter_id UUID | ✅ Match |
| question | TextField | TEXT | ✅ Match |
| description | TextField | **MISSING** | ❌ **Add** |
| **options** | **JSONField(default=list)** | **Separate poll_options table** | ❌ **CHANGE** |
| **correct_answer** | **CharField(255, nullable)** | **MISSING** | ❌ **Add** |
| **explanation** | **TextField (nullable)** | **MISSING** | ❌ **Add** |
| **poll_type** | **CharField(50, choices)** | **MISSING** | ❌ **Add** |
| is_published | BooleanField | **MISSING** | ❌ **Add** |
| published_at | DateTimeField (nullable) | **MISSING** | ❌ **Add** |
| **quality_score** | **FloatField** | **MISSING** | ❌ **Add** |
| **review_status** | **CharField(20, choices)** | **MISSING** | ❌ **Add** |
| **total_votes** | **IntegerField(default=0)** | **MISSING** | ❌ **Add** |
| **subject_id, created_by** | **NOT IN DJANGO** | **UUID (FK)** | ❌ **REMOVE** |
| **expires_at** | **NOT IN DJANGO** | **TIMESTAMP** | ❌ **REMOVE** |

**Action**: 
1. **IMPORTANT**: Remove `poll_options` table, store options as JSON in polls table
2. Add missing Django fields

---

### **9. QAItem (Quiz Questions)**
| Field | Django | Current Supabase | Status |
|-------|--------|------------------|--------|
| id | UUID | **quizzes + quiz_questions tables** | ❌ **RESTRUCTURE** |
| question | TextField | quiz_questions.question TEXT | ✅ Partial |
| answer | TextField | **MISSING** | ❌ **Add** |
| chapter (FK) | ForeignKey(Chapter) | quiz.chapter_id | ✅ Partial |
| **question_type** | **CharField(50, choices)** | **MISSING** | ❌ **Add** |
| options | JSONField | quiz_questions.options JSONB | ✅ Match |
| difficulty | CharField(20, choices) | quiz_questions.difficulty | ✅ Match |
| explanation | TextField | quiz_questions.explanation | ✅ Match |
| is_published | BooleanField | **MISSING** | ❌ **Add** |
| published_at | DateTimeField | **MISSING** | ❌ **Add** |
| **quality_score** | **FloatField** | **MISSING** | ❌ **Add** |
| **review_status** | **CharField(20, choices)** | **MISSING** | ❌ **Add** |
| **attempt_count** | **IntegerField(default=0)** | **MISSING** | ❌ **Add** |
| **correct_count** | **IntegerField(default=0)** | **MISSING** | ❌ **Add** |

**Action**:
1. **IMPORTANT**: Remove `quizzes` table
2. Rename `quiz_questions` to `qa_items`
3. Add missing fields

---

### **10. MediaItem**
| Field | Django | Current Supabase | Status |
|-------|--------|------------------|--------|
| id | UUID | **NOT EXISTS** | ❌ **CREATE TABLE** |
| title | CharField(255) | - | ❌ |
| media_type | CharField(20, choices) | - | ❌ |
| url | URLField(max_length=2048) | - | ❌ |
| local_file | FileField (nullable) | - | ❌ |
| chapter (FK) | ForeignKey(Chapter) | - | ❌ |
| note (FK) | ForeignKey(Note, nullable) | - | ❌ |
| description | TextField (nullable) | - | ❌ |
| transcript | TextField (nullable) | - | ❌ |
| file_size | BigIntegerField (nullable) | - | ❌ |
| duration | IntegerField (nullable) | - | ❌ |
| mime_type | CharField(100, nullable) | - | ❌ |
| width, height, bitrate | IntegerField (nullable) | - | ❌ |
| is_published | BooleanField | - | ❌ |
| published_at | DateTimeField (nullable) | - | ❌ |
| quality_score | FloatField | - | ❌ |
| review_status | CharField(20, choices) | - | ❌ |
| view_count, download_count | IntegerField | - | ❌ |
| metadata | JSONField | - | ❌ |

**Action**: **CREATE media_items table** matching Django model.

---

### **11. Feed**
| Field | Django | Current Supabase | Status |
|-------|--------|------------------|--------|
| id | UUID | **NOT EXISTS** | ❌ **CREATE TABLE** |
| All fields | Multiple fields | - | ❌ |

**Action**: **CREATE feed table** matching Django model.

---

## 👤 **User & Authentication**

### **12. User (auth.users + user_profiles)**
| Field | Django User | Supabase | Status |
|-------|-------------|----------|--------|
| id | UUID | auth.users.id | ✅ Match |
| username | CharField | **NOT IN auth.users** | ❌ **Add to profile** |
| email | EmailField | auth.users.email | ✅ Match |
| role | CharField(20, choices) | **MISSING** | ❌ **Add** |
| profile_picture | URLField | **MISSING** | ❌ **Add** |
| bio | TextField | **MISSING** | ❌ **Add** |
| phone_number | CharField(15, unique) | **MISSING** | ❌ **Add** |
| is_phone_verified | BooleanField | **MISSING** | ❌ **Add** |
| google_id | CharField(255, unique) | **MISSING** | ❌ **Add** |
| auth_provider | CharField(50) | **MISSING** | ❌ **Add** |
| board (FK) | ForeignKey(Board) | **MISSING** | ❌ **Add** |
| class_grade (FK) | ForeignKey(Class) | **MISSING** | ❌ **Add** |
| medium (FK) | ForeignKey(Medium) | **MISSING** | ❌ **Add** |
| follower_count | PositiveIntegerField | **MISSING** | ❌ **Add** |
| following_count | PositiveIntegerField | **MISSING** | ❌ **Add** |
| preferred_language | CharField(10) | **MISSING** | ❌ **Add** |
| dark_theme_enabled | BooleanField | **MISSING** | ❌ **Add** |
| push_notifications_enabled | BooleanField | **MISSING** | ❌ **Add** |

**Action**: **CREATE user_profiles table** linked to auth.users.

---

### **13. Following**
| Field | Django | Supabase | Status |
|-------|--------|----------|--------|
| id | UUID | follows.id | ✅ Match |
| follower (FK) | ForeignKey(User) | follower_id UUID | ⚠️ Different name |
| following (FK) | ForeignKey(User) | followed_id UUID | ⚠️ Different name |

**Action**: Rename columns to match Django.

---

### **14. PhoneOTP**
| Field | Django | Supabase | Status |
|-------|--------|----------|--------|
| phone_number | CharField(15) | otp_requests.phone_number | ✅ Match |
| otp_code | CharField(6) | otp_requests.otp | ✅ Match |
| created_at | DateTimeField | otp_requests.created_at | ✅ Match |
| is_verified | BooleanField | otp_requests.verified | ⚠️ Rename |

**Action**: Rename `verified` to `is_verified`.

---

## 🎯 **Onboarding & User Progress**

### **15. UserOnboardingPreference**
| Field | Django | Supabase | Status |
|-------|--------|----------|--------|
| id | UUID | onboarding_preferences.id | ✅ Match |
| user (FK) | OneToOneField(User) | user_id UUID | ✅ Match |
| role | CharField(20) | **MISSING** | ❌ **Add** |
| data | JSONField(default=dict) | JSON | ⚠️ **Different structure** |

**Action**: Update structure to match Django's flexible JSON approach.

---

### **16. UserFeedSeen**
| Field | Django | Supabase | Status |
|-------|--------|----------|--------|
| All fields | Multiple | **NOT EXISTS** | ❌ **CREATE TABLE** |

**Action**: **CREATE user_feed_seen table**.

---

### **17. UserDailyGoal**
| Field | Django | Supabase | Status |
|-------|--------|----------|--------|
| All fields | Multiple | user_goals (partial match) | ⚠️ **UPDATE** |

**Action**: Update user_goals table to match Django model.

---

### **18. UserQuizHistory**
| Field | Django | Supabase | Status |
|-------|--------|----------|--------|
| All fields | Multiple | quiz_history (partial match) | ⚠️ **UPDATE** |

**Action**: Update quiz_history to match Django.

---

### **19. UserFocusSession**
| Field | Django | Supabase | Status |
|-------|--------|----------|--------|
| All fields | Multiple | focus_sessions (partial match) | ⚠️ **UPDATE** |

**Action**: Update focus_sessions.

---

### **20. UserChallengeProgress**
| Field | Django | Supabase | Status |
|-------|--------|----------|--------|
| All fields | Multiple | user_challenge_progress | ✅ **Check structure** |

---

## 📊 **Summary**

### **Tables to CREATE:**
- ✅ `media_items`
- ✅ `feed`
- ✅ `user_profiles` (links to auth.users)
- ✅ `user_feed_seen`

### **Tables to REMOVE:**
- ❌ `poll_options` (merge into polls as JSON)
- ❌ `quizzes` (use qa_items instead)
- ❌ `quiz_questions` (rename to qa_items)

### **Tables to RESTRUCTURE:**
- ⚠️ `boards` - add code
- ⚠️ `classes` - rename grade_level to grade_number
- ⚠️ `subjects` - remove board_id, add icon_url, logo_url, color_code
- ⚠️ `books` - rename title to name, remove class_id/author/publisher, add cover_image/logo_url
- ⚠️ `chapters` - rename title to name, chapter_number to number, add pdf_file/azure_blob_url/chapter_identifier/logo_url/display_name
- ⚠️ `notes` - major restructure to match Django
- ⚠️ `polls` - merge poll_options into options JSON field
- ⚠️ `qa_items` - merge quizzes and quiz_questions
- ⚠️ `follows` - rename columns
- ⚠️ `otp_requests` - rename verified to is_verified
- ⚠️ `onboarding_preferences` - update structure
- ⚠️ `user_goals` - update to match UserDailyGoal
- ⚠️ `quiz_history` - update
- ⚠️ `focus_sessions` - update

---

## 🚀 **Next Steps**

I'll now create a new SQL script that matches your Django backend schema **exactly**, ensuring seamless migration when you move to Django!
