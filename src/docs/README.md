# 📚 ConceptScroll Documentation

Welcome to ConceptScroll's technical documentation! This folder contains all essential guides for working with the project.

---

## 🗄️ **Database Schema (Django-Matched)**

### **Active Schema Files**
- **`SUPABASE_DJANGO_MATCHED_SCHEMA.sql`** - Production schema matching Django backend
- **`SUPABASE_DJANGO_MATCHED_SEED.sql`** - Sample CBSE Class 10 Mathematics data

### **Documentation**
- **`DJANGO_VS_SUPABASE_COMPARISON.md`** - Field-by-field comparison with Django models
- **`DJANGO_MIGRATION_GUIDE.md`** - Migration guide for switching to Django
- **`SCHEMA_MIGRATION_SUMMARY.md`** - Quick overview of schema changes

---

## 🔐 **Authentication**

### **Phone OTP Authentication**
- **`PHONE_AUTH.md`** - Complete phone authentication implementation
- **`OTP_AUTH_FLOW.md`** - OTP authentication flow details

The app uses phone number + OTP authentication as the primary login method, with support for:
- ✅ Two-step OTP verification
- ✅ Language selection at login/signup
- ✅ Onboarding flow for new users
- ✅ Direct home screen for returning users

---

## 🏗️ **Architecture**

- **`ARCHITECTURE.md`** - App architecture overview
- **`MIGRATION_GUIDE.md`** - General migration guidelines
- **`NEXT_STEPS.md`** - Roadmap and next implementation steps
- **`QUICK_START.md`** - Quick start guide

---

## 📊 **Current Status**

### ✅ **Completed**
1. **Database Schema** - 100% Django-compatible with 21 tables
2. **Sample Data** - CBSE Class 10 Math curriculum loaded
3. **Authentication** - Phone OTP system designed
4. **Django Alignment** - All models match Django backend exactly

### 🚧 **In Progress**
1. Frontend components for auth flow
2. API integration with Supabase
3. Onboarding UI implementation

---

## 🎯 **Quick Links**

| What You Need | Go To |
|---------------|-------|
| Set up database | `DJANGO_MIGRATION_GUIDE.md` → Quick Start |
| Understand schema | `DJANGO_VS_SUPABASE_COMPARISON.md` |
| Implement phone auth | `PHONE_AUTH.md` |
| See what's next | `NEXT_STEPS.md` |
| Understand architecture | `ARCHITECTURE.md` |

---

## 📦 **Database Schema Overview**

**21 Tables Organized in 4 Categories:**

### **1. Educational Hierarchy (6 tables)**
- `boards` - Educational boards (CBSE, ICSE, etc.)
- `mediums` - Languages (English, Hindi, Tamil, etc.)
- `classes` - Grade levels (9, 10, 11, 12)
- `subjects` - Subjects (Math, Science, etc.)
- `books` - Textbooks (NCERT books)
- `chapters` - Book chapters

### **2. Content Types (5 tables)**
- `notes` - Educational notes with rich structure
- `polls` - Interactive polls with JSON options
- `qa_items` - Questions & answers for practice
- `media_items` - Audio, video, images
- `feed_posts` - Social feed content

### **3. User & Auth (3 tables)**
- `user_profiles` - Extended user data (links to auth.users)
- `following` - User follow relationships
- `phone_otp` - OTP verification records

### **4. User Progress (7 tables)**
- `user_onboarding_preferences` - Onboarding data
- `user_feed_seen` - Tracking viewed content
- `user_daily_goals` - Daily study goals
- `user_quiz_history` - Quiz attempt history
- `user_focus_sessions` - Study session tracking
- `user_challenge_progress` - Challenge participation

---

## 🎉 **Key Features**

### **Django Compatibility**
- ✅ Exact field name matching
- ✅ Same data types and constraints
- ✅ Direct database migration possible
- ✅ API responses match Django serializers

### **Rich Content Structure**
- ✅ Notes with bullet points and examples (JSON)
- ✅ Polls with embedded options (no separate table)
- ✅ QA Items with attempt tracking
- ✅ Quality scores and review status

### **Indian Education Focus**
- ✅ CBSE, ICSE, State Boards
- ✅ 6 Indian languages supported
- ✅ NCERT curriculum structure
- ✅ Board → Class → Subject → Book → Chapter hierarchy

---

## 🚀 **Getting Started**

1. **Read the architecture**: `ARCHITECTURE.md`
2. **Set up database**: Follow `DJANGO_MIGRATION_GUIDE.md`
3. **Implement auth**: Use `PHONE_AUTH.md` as reference
4. **Check next steps**: See `NEXT_STEPS.md`

---

## 📞 **Need Help?**

Refer to the specific guide for your task:
- Database issues? → `DJANGO_MIGRATION_GUIDE.md`
- Auth questions? → `PHONE_AUTH.md`
- Schema questions? → `DJANGO_VS_SUPABASE_COMPARISON.md`
- General direction? → `NEXT_STEPS.md`

---

**Happy coding! 🎉**
