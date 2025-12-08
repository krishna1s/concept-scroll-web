# ConceptScroll - Quick Start Guide

## 🚀 Getting Started

### 1. Sign Up (First Time Users)

1. Open the app - you'll see the **Login Screen**
2. **Select your language** from the dropdown (🌐 icon):
   - English
   - हिंदी (Hindi)
   - தமிழ் (Tamil)
   - తెలుగు (Telugu)
   - मराठी (Marathi)
   - বাংলা (Bengali)
3. Click on **"Sign up"** at the bottom
4. Fill in your details:
   - **First Name**: e.g., "Raj"
   - **Last Name**: e.g., "Kumar"
   - **Phone Number**: Enter 10 digits (e.g., `9876543210`)
     - System automatically adds `+91` prefix
   - **Email**: Optional - you can skip this
5. Click **"Send OTP"**
6. **Enter OTP** (6 digits)
   - In dev mode: Check browser console for OTP code
   - Example: `[DEV] OTP for +919876543210: 123456`
7. Click **"Verify & Sign Up"**
8. You'll be redirected to **Onboarding**

### 2. Onboarding (5 Steps)

Complete these steps to personalize your experience:

**Step 1: Select Role**
- Choose: Student / Teacher / Parent

**Step 2: Select Board**
- CBSE
- ICSE
- State Board

**Step 3: Select Class**
- Class 1 through 12

**Step 4: Select Medium**
- English
- Hindi
- Tamil
- Telugu
- Marathi
- Bengali

**Step 5: Select Subjects**
- Choose your subjects (multiple selection allowed)
- Physics, Chemistry, Math, Biology, English, etc.

Click **"Finish"** and you're done!

### 3. Home Feed

After onboarding, you'll land on the **Home Feed** with:

#### Content Types

**📝 Notes**
- Educational content with text and images
- Read full content or collapse
- Like, Comment, Bookmark, Share

**🧠 Quizzes**
- Interactive quizzes to test knowledge
- Shows duration and number of questions
- Click "Take Quiz" to start

**📊 Polls**
- Community polls on various topics
- Vote and see results instantly
- Percentage breakdown of votes

#### Interactions

- **❤️ Like**: Tap to like content
- **💬 Comment**: Add comments (coming soon)
- **🔖 Bookmark**: Save for later
- **↗️ Share**: Copy link to clipboard

#### Infinite Scroll
- Scroll down to load more content
- Personalized based on your subjects
- End message when you're caught up

### 4. Navigation

Bottom navigation bar with 3 tabs:

- **🏠 Feed**: Home feed with personalized content
- **📚 Library**: Browse subjects and chapters (coming soon)
- **👤 Profile**: Your profile and settings (coming soon)

## 🔄 Returning Users

### Login Flow

1. **Select your language** (🌐 icon)
2. Enter your **phone number** (10 digits)
3. Click **"Send OTP"**
4. **Enter OTP** (6 digits)
   - In dev mode: Check browser console
   - Example: `[DEV] OTP for +919876543210: 654321`
5. Click **"Verify & Login"**
6. Direct to Home Feed ✅

**No onboarding shown again!** The system remembers your preferences.

## 🗄️ Database Setup (For Developers)

### Initialize Sample Data

The app includes sample educational content. To populate the database:

1. Call the initialization endpoint (one-time):
```bash
curl -X POST https://[your-project].supabase.co/functions/v1/make-server-b1809f3a/init-db \
  -H "Authorization: Bearer [your-anon-key]"
```

This creates:
- 3 Boards (CBSE, ICSE, State)
- 12 Classes (Class 1-12)
- 6 Mediums (languages)
- 5 Subjects for Class 10
- Sample chapters, notes, quizzes, and polls
- Ready-to-scroll feed content

### Sample Data Included

- **3 Notes** about Physics and Math concepts
- **1 Quiz** on Reflection of Light
- **1 Poll** about favorite Physics topics
- **5 Feed Items** ready to scroll

## 📱 App Features Completed

### ✅ Authentication
- Phone-based signup/login
- Session persistence
- Secure password authentication

### ✅ Onboarding
- 5-step wizard
- Saves preferences to backend
- Only shows once per user

### ✅ Home Feed
- Instagram-style scrolling
- Infinite scroll with pagination
- Three content types: Notes, Quizzes, Polls
- Social interactions: Like, Bookmark, Share
- Personalized based on your subjects

### ✅ Architecture
- TypeScript types matching Django backend
- API contract with Supabase adapter
- Theme management (Light/Dark)
- Localization support (6 languages)
- Ready for Django migration

## 🎯 User Flow Example

### New User Journey

1. **Sign Up** with phone: `9876543210`
2. **Onboarding**:
   - Role: Student
   - Board: CBSE
   - Class: 10
   - Medium: English
   - Subjects: Physics, Math
3. **Home Feed** shows content for Physics & Math
4. **Scroll** through notes, quizzes, polls
5. **Interact**: Like, bookmark interesting content

### Returning User Journey

1. **Auto-login** from saved session
2. **Direct to Home Feed**
3. **Continue** where you left off

## 🐛 Common Issues

### "Invalid OTP"
- OTP expires after 10 minutes
- Check browser console for correct OTP code
- Try requesting a new OTP with "Resend OTP"

### "Phone Number Already Registered"
- Use login instead of signup
- Enter the same phone number in login screen

### "No Content in Feed"
- Initialize the database using the endpoint above
- Make sure you selected subjects in onboarding
- Check console for any errors

### "Onboarding Shows Again"
- This happens if you didn't complete all 5 steps
- Complete the onboarding flow fully
- Click "Finish" on the last step

## 🔧 Testing Tips

### Test User Creation

**Sign Up Flow:**
1. Phone: `9876543210`
2. Check console for OTP
3. Enter OTP code
4. Complete onboarding

**Login Flow:**
1. Phone: `9876543210`
2. Check console for new OTP
3. Enter OTP code
4. Auto-login to feed

### Test Different Scenarios

1. **First-time user**: Sign up → OTP → Onboarding → Feed
2. **Returning user**: Login → OTP → Direct to Feed
3. **Incomplete onboarding**: Sign up → OTP → Exit → Login → OTP → Back to Onboarding
4. **Feed interactions**: Like, Bookmark, Share
5. **Language switching**: Try different languages before login

## 🚀 Next Steps

Features coming next:

1. **Library Screen**: Browse all subjects, books, chapters
2. **Profile Screen**: User stats, settings, logout
3. **Comments**: Full comment system with replies
4. **Quiz Taking**: Interactive quiz engine with AI grading
5. **Gamification**: Points, streaks, challenges, leaderboard

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase connection
3. Ensure database is initialized
4. Review the authentication flow in `/docs/PHONE_AUTH.md`

---

**Enjoy using ConceptScroll! 🎓📱**