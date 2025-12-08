# API Endpoint Mapping - ConceptScroll

**Source:** https://github.com/krishna1s/concepts-scroll/blob/8c6600b40b9e2648ead9b975e7a0641cc38011d3/backend/swagger.json

**Last Updated:** December 7, 2024

---

## ⚠️ CRITICAL FIXES

### 1. Refresh Token Endpoint
- ❌ **WRONG:** `/api/users/auth/refresh_token/`
- ✅ **CORRECT:** `/api/users/auth/refresh/`

### 2. Onboarding Preferences Endpoint
- ❌ **WRONG:** `/api/users/onboarding-preferences/`
- ✅ **CORRECT:** `/api/onboarding/preferences/`

### 3. Field Names in Requests
- **OTP Verification:** Use `otp_code` (NOT `otp`)
- **Token Refresh:** Use `refresh` (NOT `refresh_token`)

### 4. Field Names in Responses
- **Tokens:** Backend returns `access` and `refresh` (NOT `access_token` and `refresh_token`)

---

## 📌 Complete Endpoint Mapping

### Authentication (`/api/users/auth/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/auth/request_otp/` | POST | Request OTP for phone number |
| `/api/users/auth/verify_otp/` | POST | Verify OTP and authenticate |
| `/api/users/auth/refresh/` | POST | Refresh access token |
| `/api/users/auth/login/` | POST | Email/password login |
| `/api/users/auth/google/` | POST | Google OAuth login |

### User Profile (`/api/users/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/profile/` | GET | Get user profile |
| `/api/users/profile/` | PATCH | Update user profile |
| `/api/users/profile/` | POST | Update user profile (alternative) |

### Onboarding (`/api/onboarding/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/onboarding/preferences/` | GET | List all preferences |
| `/api/onboarding/preferences/` | POST | Create/update preferences |
| `/api/onboarding/preferences/{id}/` | GET | Get specific preference |
| `/api/onboarding/preferences/{id}/` | PATCH | Update specific preference |
| `/api/onboarding/preferences/{id}/` | DELETE | Delete preference |
| `/api/onboarding/preferences/me/` | GET | Get current user's preferences |
| `/api/onboarding/user/goals/` | GET/POST | Daily goals |
| `/api/onboarding/user/goals/current/` | GET | Current day's goal |
| `/api/onboarding/user/focus-sessions/` | GET/POST | Focus sessions |
| `/api/onboarding/user/quiz-history/` | GET/POST | Quiz history |
| `/api/onboarding/challenges/` | GET/POST | User challenges |
| `/api/onboarding/feed/seen/` | GET/POST | Mark feed items as seen |

### Educational Hierarchy (`/api/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/boards/` | GET | List all boards |
| `/api/boards/{id}/` | GET | Get board details |
| `/api/classes/` | GET | List all classes |
| `/api/classes/{id}/` | GET | Get class details |
| `/api/classes/{id}/subjects/` | GET | Get subjects for a class |
| `/api/mediums/` | GET | List all mediums |
| `/api/mediums/{id}/` | GET | Get medium details |
| `/api/subjects/` | GET | List all subjects |
| `/api/subjects/{id}/` | GET | Get subject details |
| `/api/subjects/class/{class_id}/` | GET | Get subjects by class |
| `/api/books/` | GET | List all books |
| `/api/books/{id}/` | GET | Get book details |
| `/api/books/{id}/chapters/` | GET | Get chapters for a book |

### Feed System (`/api/feed/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/feed/` | GET | Legacy feed endpoint |
| `/api/feed/content-items/` | GET/POST | Content items CRUD |
| `/api/feed/content-items/{id}/` | GET/PUT/PATCH/DELETE | Specific content item |
| `/api/feed/content-items/feed/home/` | GET | Personalized home feed |
| `/api/feed/content-items/feed/explore/` | GET | Explore feed with filters |
| `/api/feed/content-items/feed/bookmarks/` | GET | User's bookmarked items |
| `/api/feed/content-items/feed/filters/` | GET | Available filter options |
| `/api/feed/content-items/{id}/like/` | POST | Like content item |
| `/api/feed/content-items/{id}/bookmark/` | POST/DELETE | Bookmark/unbookmark |
| `/api/feed/content-items/{id}/comment/` | POST | Add comment |
| `/api/feed/content-items/{id}/poll-response/` | POST | Vote on poll |
| `/api/feed/follows/` | GET/POST | Follow/unfollow users |
| `/api/feed/interactions/` | GET | User interactions |
| `/api/feed/leaderboard/` | GET | Leaderboard data |
| `/api/feed/search/` | GET | Search feed |
| `/api/feed/autocomplete/` | GET | Autocomplete suggestions |

### Notes (`/api/notes/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notes/` | GET/POST | List/create notes |
| `/api/notes/{id}/` | GET/PUT/PATCH/DELETE | Note CRUD |
| `/api/notes/chapter/{chapter_id}/` | GET | Get notes by chapter |
| `/api/notes/bulk-verify/` | POST | Bulk update review status |

### Media (`/api/media/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/media/` | GET/POST | List/create media items |
| `/api/media/{id}/` | GET/PUT/PATCH/DELETE | Media item CRUD |
| `/api/media/chapter/{chapter_id}/` | GET | Get media by chapter |
| `/api/media/bulk-verify/` | POST | Bulk update review status |

### Q&A (`/api/qa/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/qa/` | GET/POST | List/create Q&A items |
| `/api/qa/{id}/` | GET/PUT/PATCH/DELETE | Q&A item CRUD |
| `/api/qa/chapter/{chapter_id}/` | GET | Get Q&A by chapter |
| `/api/qa/bulk-verify/` | POST | Bulk update review status |

### Admin (`/api/admin/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/dashboard-stats/` | GET | Dashboard statistics |
| `/api/admin/jobs/` | GET/POST | Processing jobs |
| `/api/admin/jobs/{id}/` | GET/PUT/PATCH/DELETE | Job details |
| `/api/admin/jobs/upload-pdf/` | POST | Upload PDF for processing |
| `/api/admin/jobs/create-for-chapter/` | POST | Create job for chapter |
| `/api/admin/notes/` | GET/POST | Admin notes management |
| `/api/admin/notes/approve/` | POST | Bulk approve notes |
| `/api/admin/notes/reject/` | POST | Bulk reject notes |
| `/api/admin/media/` | GET/POST | Admin media management |

### Voice Agent (`/api/voice/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/voice/process/` | POST | Process voice input |
| `/api/voice/sessions/` | GET/POST | Voice sessions |
| `/api/voice/sessions/{session_id}/` | GET | Session details |
| `/api/voice/interactions/{session_id}/` | GET | Session interactions |
| `/api/voice/feedback/` | POST | Submit feedback |
| `/api/voice/analytics/` | GET | Voice analytics |
| `/api/voice/health/` | GET | Health check |

### Public/SEO (`/api/public/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/public/articles/` | GET | List SEO pages |
| `/api/public/articles/{slug}/` | GET | Get SEO page by slug |
| `/api/public/subjects/` | GET | Public subjects list |
| `/api/public/chapters/` | GET | Public chapters list |

---

## 🔑 Request/Response Formats

### Phone Number
- **Format:** 10 digits only (no country code)
- **Pattern:** `^\d{10}$`
- **Example:** `"9876543210"`

### OTP Code
- **Format:** 6 digits
- **Pattern:** `^\d{6}$`
- **Example:** `"123456"`

### Authentication Tokens
- **Request Field:** `refresh`
- **Response Fields:** `access`, `refresh`

### Standard Response Wrapper
```json
{
  "success": boolean,
  "data": {},
  "message": string
}
```

---

## 📝 Common Query Parameters

### Pagination
- `page`: Page number (integer)
- `page_size`: Items per page (integer)

### Filtering
- Educational: `board_id`, `class_id`, `medium_id`, `subject_id`, `chapter_id`
- Content: `content_type`, `review_status`, `is_published`
- Search: `search`, `q`

### Sorting
- `ordering`: Field to sort by

---

## ⚡ Quick Reference

### Get User Data After Login
```
POST /api/users/auth/verify_otp/
→ Returns: { access, refresh, user }

GET /api/users/profile/
→ Returns: User profile

GET /api/onboarding/preferences/me/
→ Returns: Onboarding preferences
```

### Complete Onboarding Flow
```
1. POST /api/onboarding/preferences/
   Body: { role, data: { board, grade, subjects, ... } }

2. GET /api/onboarding/preferences/me/
   Returns: { is_profile_complete: true }
```

### Refresh Expired Token
```
POST /api/users/auth/refresh/
Body: { refresh: "..." }
Returns: { access: "..." }
```

---

## 🚨 Common Mistakes to Avoid

1. ❌ Using `/api/users/auth/refresh_token/` instead of `/api/users/auth/refresh/`
2. ❌ Using `/api/users/onboarding-preferences/` instead of `/api/onboarding/preferences/`
3. ❌ Sending `otp` instead of `otp_code` in verify OTP request
4. ❌ Expecting `access_token` instead of `access` in responses
5. ❌ Sending phone numbers with country codes (+91)
6. ❌ Not sending `ngrok-skip-browser-warning: true` header for ngrok URLs

---

**✅ All endpoints verified against official swagger.json**
