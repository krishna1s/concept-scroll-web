# 🚀 ConceptScroll API Endpoints Reference

## Overview

Your app has a complete API client that works with Supabase. All endpoints are defined in `/services/api/supabaseClient.ts`.

---

## 🔐 **Authentication APIs**

### **1. Request OTP**
```typescript
apiClient.requestOTP(phoneNumber: string)
// Returns: { success: boolean; message: string }
// Table: phone_otp
// Generates 6-digit OTP and logs to console
```

### **2. Verify OTP**
```typescript
apiClient.verifyOTP(
  phoneNumber: string,
  otpCode: string,
  profile?: { first_name, last_name, email }
)
// Returns: AuthTokens (access_token, refresh_token, user)
// Table: phone_otp (marks as verified)
// Creates user in auth.users if doesn't exist
```

### **3. Login (Password)**
```typescript
apiClient.login(phoneNumber: string, password: string)
// Returns: AuthTokens
```

### **4. Sign Up**
```typescript
apiClient.signUp(phoneNumber, password, profile)
// Returns: AuthTokens
// Creates: auth.users + user_profiles entry
```

### **5. Sign Out**
```typescript
apiClient.signOut()
// Returns: void
```

### **6. Get Session**
```typescript
apiClient.getSession()
// Returns: { user: User | null, accessToken: string | null }
```

---

## 👤 **User Profile APIs**

### **1. Get Own Profile**
```typescript
apiClient.getProfile()
// Returns: UserProfile
// Table: user_profiles
```

### **2. Update Profile**
```typescript
apiClient.updateProfile(updates: Partial<UserProfile>)
// Returns: UserProfile
// Table: user_profiles
```

### **3. Get Another User's Profile**
```typescript
apiClient.getUserProfile(userId: string)
// Returns: UserProfile (with is_following flag)
```

---

## 🎓 **Onboarding APIs**

### **1. Get Onboarding Preferences**
```typescript
apiClient.getOnboardingPreferences()
// Returns: OnboardingPreferences | null
// Table: user_onboarding_preferences
```

### **2. Save Onboarding Preferences**
```typescript
apiClient.saveOnboardingPreferences(preferences)
// Returns: OnboardingPreferences
// Table: user_onboarding_preferences
```

### **3. Update Onboarding Step**
```typescript
apiClient.updateOnboardingStep(step)
// Returns: OnboardingPreferences
```

---

## 📚 **Educational Structure APIs**

### **1. Get Boards**
```typescript
apiClient.getBoards()
// Returns: Board[]
// Table: boards
// Example: [{ id, name, code, description, logo_url }]
```

### **2. Get Classes**
```typescript
apiClient.getClasses(boardId?: string)
// Returns: Class[]
// Table: classes
// Filters by board_id if provided
```

### **3. Get Mediums**
```typescript
apiClient.getMediums()
// Returns: Medium[]
// Table: mediums
// Example: [{ id, name, code (en, hi, ta, etc.) }]
```

### **4. Get Subjects**
```typescript
apiClient.getSubjects(classId: string, boardId?: string)
// Returns: Subject[]
// Table: subjects
```

### **5. Get Books**
```typescript
apiClient.getBooks({ 
  subjectId?: string,
  classId?: string,
  mediumId?: string
})
// Returns: Book[]
// Table: books
```

### **6. Get Chapters**
```typescript
apiClient.getChapters(bookId: string)
// Returns: Chapter[] (with notes_count, quizzes_count)
// Table: chapters
```

### **7. Get Single Chapter**
```typescript
apiClient.getChapter(chapterId: string)
// Returns: Chapter
```

---

## 📝 **Content APIs**

### **1. Get Chapter Notes**
```typescript
apiClient.getChapterNotes(chapterId: string)
// Returns: Note[]
// Table: notes
```

### **2. Get Chapter Quizzes**
```typescript
apiClient.getChapterQuizzes(chapterId: string)
// Returns: Quiz[]
// Table: quizzes (if exists) or qa_items (new schema)
```

### **3. Get Chapter Q&A**
```typescript
apiClient.getChapterQA(chapterId: string)
// Returns: QAItem[]
// Table: qa_items
```

---

## 🏠 **Feed APIs**

### **1. Get Home Feed**
```typescript
apiClient.getHomeFeed(page: number, size: number)
// Returns: PaginatedResponse<ContentItem>
// Personalized based on user's subjects
```

### **2. Get Explore Feed**
```typescript
apiClient.getExploreFeed(
  page: number,
  size: number,
  filters?: FeedFilters
)
// Returns: PaginatedResponse<ContentItem>
// Supports filtering by subjects, types, chapters
// Supports sorting: 'recent', 'popular', 'trending'
```

### **3. Get Bookmarked Feed**
```typescript
apiClient.getBookmarkedFeed(page: number, size: number)
// Returns: PaginatedResponse<ContentItem>
```

### **4. Get Content Item**
```typescript
apiClient.getContentItem(id: string)
// Returns: ContentItem
```

### **5. Get Feed Filter Options**
```typescript
apiClient.getFeedFilterOptions()
// Returns: { subjects: [], chapters: [], types: [] }
```

---

## 💬 **Interactions APIs**

### **1. Like Content**
```typescript
apiClient.likeContent(contentItemId: string)
// Returns: Like
// Table: likes
```

### **2. Unlike Content**
```typescript
apiClient.unlikeContent(contentItemId: string)
// Returns: void
```

### **3. Bookmark Content**
```typescript
apiClient.bookmarkContent(contentItemId: string)
// Returns: Bookmark
// Table: bookmarks
```

### **4. Unbookmark Content**
```typescript
apiClient.unbookmarkContent(contentItemId: string)
// Returns: void
```

### **5. Add Comment**
```typescript
apiClient.addComment(
  contentItemId: string,
  text: string,
  parentCommentId?: string
)
// Returns: Comment
// Table: comments
```

### **6. Get Comments**
```typescript
apiClient.getComments(
  contentItemId: string,
  page: number,
  size: number
)
// Returns: PaginatedResponse<Comment>
```

### **7. Delete Comment**
```typescript
apiClient.deleteComment(commentId: string)
// Returns: void
```

### **8. Share Content**
```typescript
apiClient.shareContent(contentItemId: string)
// Returns: void
// Increments share count
```

### **9. Vote on Poll**
```typescript
apiClient.votePoll(pollId: string, optionId: string)
// Returns: PollResponse
// Table: poll_responses
```

---

## 👥 **Social APIs**

### **1. Follow User**
```typescript
apiClient.followUser(userId: string)
// Returns: Follow
// Table: following
```

### **2. Unfollow User**
```typescript
apiClient.unfollowUser(userId: string)
// Returns: void
```

### **3. Get Followers**
```typescript
apiClient.getFollowers(userId: string, page: number, size: number)
// Returns: PaginatedResponse<UserProfile>
```

### **4. Get Following**
```typescript
apiClient.getFollowing(userId: string, page: number, size: number)
// Returns: PaginatedResponse<UserProfile>
```

---

## 🎮 **Gamification APIs**

### **1. Get User Goals**
```typescript
apiClient.getUserGoals(date?: string)
// Returns: UserGoal[]
// Table: user_daily_goals
```

### **2. Get Today's Goal**
```typescript
apiClient.getTodayGoal()
// Returns: UserGoal | null
```

### **3. Create Goal**
```typescript
apiClient.createGoal(goal: Partial<UserGoal>)
// Returns: UserGoal
```

### **4. Update Goal Progress**
```typescript
apiClient.updateGoalProgress(goalId: string, currentValue: number)
// Returns: UserGoal
```

### **5. Get Quiz History**
```typescript
apiClient.getQuizHistory(page: number, size: number)
// Returns: PaginatedResponse<QuizHistory>
// Table: user_quiz_history
```

### **6. Submit Quiz**
```typescript
apiClient.submitQuiz(
  quizId: string,
  answers: QuizAnswer[],
  timeTaken: number
)
// Returns: QuizHistory
```

### **7. Get Focus Sessions**
```typescript
apiClient.getFocusSessions(page: number, size: number)
// Returns: PaginatedResponse<FocusSession>
// Table: user_focus_sessions
```

### **8. Create Focus Session**
```typescript
apiClient.createFocusSession(
  chapterId: string,
  durationMinutes: number
)
// Returns: FocusSession
```

### **9. Get User Challenges**
```typescript
apiClient.getUserChallenges()
// Returns: UserChallengeProgress[]
// Table: user_challenge_progress
```

### **10. Get Latest Challenge**
```typescript
apiClient.getLatestChallenge()
// Returns: UserChallengeProgress | null
```

---

## 📊 **Tracking APIs**

### **1. Mark Content as Seen**
```typescript
apiClient.markContentSeen(contentItemId: string)
// Returns: void
// Table: user_feed_seen
```

### **2. Get Seen Content**
```typescript
apiClient.getSeenContent(page: number, size: number)
// Returns: PaginatedResponse<string>
```

---

## 🔧 **Current Issues Fixed**

### **✅ OTP Authentication**
- ✅ Changed table from `otp_requests` → `phone_otp`
- ✅ Changed field from `otp` → `otp_code`
- ✅ Removed `expires_at` (using `is_verified` instead)
- ✅ Added OTP verification marking

### **✅ Django Schema Compatibility**
- ✅ Changed `grade_level` → `grade_number`
- ✅ All table names match Django models
- ✅ All field names match Django models

---

## 🎯 **Usage Example**

```typescript
// In your component
import { apiClient } from '../services/api';

// Request OTP
const result = await apiClient.requestOTP('+919876543210');
console.log('OTP sent! Check console for code');

// Verify OTP (look in console for the OTP code)
const authTokens = await apiClient.verifyOTP('+919876543210', '123456');
console.log('Logged in!', authTokens.user);

// Get boards
const boards = await apiClient.getBoards();
console.log('Boards:', boards);

// Get classes for a board
const classes = await apiClient.getClasses(boards[0].id);
console.log('Classes:', classes);
```

---

## 📝 **Notes**

1. **OTP in Console**: For development, OTP codes are logged to browser console
2. **Authentication**: Phone number is converted to email format internally (`{phone}@conceptscroll.app`)
3. **Pagination**: Most list endpoints support pagination with `page` and `size` parameters
4. **Error Handling**: All methods throw errors that should be caught with try/catch

---

## 🚀 **Next Steps**

To see what API calls are made:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in - you'll see:
   - `📱 Requesting OTP for: +919876543210`
   - `[DEV] OTP for +919876543210: 123456` ← **Your OTP code!**
   - `✅ OTP saved to database`
   - `🔐 Verifying OTP for: +919876543210`
   - `✅ OTP Verified`

---

**All APIs are ready to use! Try the OTP login flow now! 🎉**
