# Django Backend Integration Guide

## ✅ Integration Complete!

Your ConceptScroll app is now fully integrated with your Django backend APIs!

## 📡 Configuration

### Backend URL
The backend URL is configured in `/config/api.ts`:

```typescript
export const BACKEND_BASE_URL = 'https://b18244a7bf71.ngrok-free.app';
```

**To change the URL (for production):**
1. Open `/config/api.ts`
2. Update `BACKEND_BASE_URL` to your production URL
3. That's it! All API calls will automatically use the new URL

## 🔐 Authentication Flow

### 1. Request OTP
```typescript
POST /api/auth/request-otp/
Body: { "phone_number": "+919876543210" }
```

### 2. Verify OTP (Login)
```typescript
POST /api/auth/verify-otp/
Body: { 
  "phone_number": "+919876543210",
  "otp": "123456"
}
Response: {
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": { ... },
  "is_new_user": false
}
```

### 3. Verify OTP (Signup)
```typescript
POST /api/auth/verify-otp/
Body: { 
  "phone_number": "+919876543210",
  "otp": "123456",
  "first_name": "John",
  "last_name": "Doe"
}
Response: {
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": { ... },
  "is_new_user": true
}
```

### 4. Refresh Token
```typescript
POST /api/auth/refresh-token/
Body: { "refresh_token": "eyJ..." }
Response: { "access_token": "eyJ..." }
```

## 🎯 How It Works

### Token Management
- Access tokens are stored in `localStorage` as `auth_access_token`
- Refresh tokens are stored in `localStorage` as `auth_refresh_token`
- Tokens are automatically added to all API requests via `Authorization: Bearer <token>` header
- When a request returns 401, the client automatically tries to refresh the token
- If refresh fails, user is logged out

### Phone Number Formatting
The app handles both Indian and US phone numbers:
- **Indian numbers**: `9876543210` → `+919876543210`
- **US test number**: `8777804236` → `+18777804236` (for Twilio testing)

### Error Handling
All API errors are logged to console with detailed context:
```
API Error [/api/auth/verify-otp/]: Error message here
```

## 📋 API Endpoints Used

### Authentication
- ✅ `POST /api/auth/request-otp/` - Request OTP
- ✅ `POST /api/auth/verify-otp/` - Verify OTP (login/signup)
- ✅ `POST /api/auth/refresh-token/` - Refresh access token

### User Profile
- ✅ `GET /api/users/profile/` - Get user profile
- ✅ `PATCH /api/users/update-profile/` - Update profile

### Onboarding
- ✅ `GET /api/users/onboarding-preferences/` - Get onboarding preferences
- ✅ `POST /api/users/onboarding-preferences/` - Save onboarding preferences
- ✅ `PATCH /api/users/onboarding-preferences/` - Update onboarding step

### Educational Hierarchy
- ✅ `GET /api/boards/` - List all boards
- ✅ `GET /api/classes/?board_id=<id>` - List classes for a board
- ✅ `GET /api/mediums/` - List all mediums
- ✅ `GET /api/subjects/?class_id=<id>` - List subjects for a class
- ✅ `GET /api/books/?subject_id=<id>&class_id=<id>&medium_id=<id>` - List books
- ✅ `GET /api/chapters/?book_id=<id>` - List chapters for a book

### Content Feed
- ✅ `GET /api/content/feed/` - Get content feed (with filters)
- ✅ `GET /api/content/<id>/` - Get content details

### Quizzes
- ✅ `GET /api/quizzes/` - List quizzes
- ✅ `GET /api/quizzes/<id>/` - Get quiz details
- ✅ `POST /api/quizzes/<id>/submit/` - Submit quiz answers
- ✅ `GET /api/quizzes/history/` - Get quiz history

### Polls
- ✅ `GET /api/polls/` - List polls
- ✅ `POST /api/polls/<id>/vote/` - Vote on a poll

### Social
- ✅ `POST /api/users/<id>/follow/` - Follow user
- ✅ `POST /api/users/<id>/unfollow/` - Unfollow user
- ✅ `GET /api/users/followers/` - Get followers
- ✅ `GET /api/users/following/` - Get following

### Engagement
- ✅ `POST /api/content/<id>/like/` - Like content
- ✅ `POST /api/content/<id>/bookmark/` - Bookmark content
- ✅ `POST /api/content/<id>/share/` - Share content

### Comments
- ✅ `GET /api/content/<id>/comments/` - Get comments
- ✅ `POST /api/content/<id>/comments/` - Create comment

### Gamification
- ✅ `GET /api/users/points/` - Get user points
- ✅ `GET /api/users/badges/` - Get user badges
- ✅ `GET /api/leaderboard/` - Get leaderboard

### Focus Sessions
- ✅ `GET /api/focus-sessions/` - List focus sessions
- ✅ `POST /api/focus-sessions/start/` - Start focus session
- ✅ `POST /api/focus-sessions/<id>/end/` - End focus session

### Daily Goals
- ✅ `GET /api/users/daily-goals/` - Get daily goals
- ✅ `POST /api/users/daily-goals/` - Create daily goal

### Search
- ✅ `GET /api/search/?q=<query>` - Search content

## 🧪 Testing

### Test the Authentication Flow
1. Open the app
2. Enter phone number: `9876543210` (or your verified number)
3. Click "Send OTP"
4. Check console for: `📱 Requesting OTP for: +919876543210`
5. Enter the OTP you received
6. Click "Verify"
7. Check console for: `✅ OTP Verified Successfully`

### Console Logs to Watch For
```
📱 Requesting OTP for: +919876543210
✅ OTP sent successfully
🔐 Verifying OTP for: +919876543210
✅ OTP Verified Successfully
👤 User: { id: '...', phone_number: '...', ... }
🆕 Is New User: false
```

## 🔧 Troubleshooting

### CORS Issues
The Django client automatically sends `ngrok-skip-browser-warning: true` header to bypass ngrok's browser warning page.

### 401 Errors
- Check if access token exists in localStorage
- Check if token is expired
- Client will automatically try to refresh token
- If refresh fails, user will be logged out

### Network Errors
- Check if Django backend is running
- Check if ngrok tunnel is active
- Check network tab in browser DevTools

## 🚀 Production Deployment

When deploying to production:

1. **Update Backend URL**
   ```typescript
   // /config/api.ts
   export const BACKEND_BASE_URL = 'https://api.conceptscroll.com';
   ```

2. **Remove ngrok header** (optional)
   If not using ngrok, you can remove the `ngrok-skip-browser-warning` header from `/services/api/djangoClient.ts`

3. **Enable CORS** on your Django backend
   Make sure your Django backend has proper CORS headers configured.

## 📝 Notes

- **Admin APIs**: Admin endpoints are not integrated yet (will be added when building admin view)
- **Password Auth**: Password-based login is not implemented (app uses OTP-only authentication)
- **Google OAuth**: Not implemented yet (can be added later if needed)

## 🎉 Summary

Your ConceptScroll app is now:
- ✅ Using Django backend for all API calls
- ✅ OTP authentication fully functional
- ✅ Token management automated
- ✅ Ready for testing with your backend
- ✅ Easy to switch to production URL

Test the login flow and let me know if you encounter any issues!
