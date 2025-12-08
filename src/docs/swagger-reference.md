# Django Backend API Reference

Source: https://github.com/krishna1s/concepts-scroll/blob/8c6600b40b9e2648ead9b975e7a0641cc38011d3/backend/swagger.json

## ⚠️ CRITICAL ENDPOINT CORRECTIONS

### Authentication Endpoints
- **Request OTP:** `POST /api/users/auth/request_otp/` ✅
- **Verify OTP:** `POST /api/users/auth/verify_otp/` ✅
- **Refresh Token:** `POST /api/users/auth/refresh/` ⚠️ (NOT `/refresh_token/`)
- **Login:** `POST /api/users/auth/login/` ✅
- **Google OAuth:** `POST /api/users/auth/google/` ✅

### User Profile Endpoints
- **Get Profile:** `GET /api/users/profile/` ✅
- **Update Profile:** `PATCH /api/users/profile/` ✅

### Onboarding Endpoints
- **Get Preferences:** `GET /api/onboarding/preferences/` ⚠️ (NOT `/api/users/onboarding-preferences/`)
- **Create Preferences:** `POST /api/onboarding/preferences/` ⚠️
- **Update Preferences:** `PATCH /api/onboarding/preferences/{id}/` ⚠️
- **Get My Preferences:** `GET /api/onboarding/preferences/me/` ✅

---

## Authentication Endpoints

### 1. Request OTP
**Endpoint:** `POST /api/users/auth/request_otp/`

**Request Body:**
```json
{
  "phone_number": "9876543210"
}
```

**Schema (PhoneOTPRequest):**
- `phone_number`: string, required
  - Pattern: `^\d{10}$`
  - Min length: 1
  - Max length: 10

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone_number": "9876543210"
  }
}
```

---

### 2. Verify OTP
**Endpoint:** `POST /api/users/auth/verify_otp/`

**Description:**
Verify OTP code and authenticate user. Upon successful verification, returns JWT tokens and user information. If the phone number is not registered, a new user account is created.

**Request Body (PhoneOTPVerify):**
```json
{
  "phone_number": "9876543210",
  "otp_code": "123456",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

**Schema:**
- `phone_number`: string, required (pattern: `^\d{10}$`)
- `otp_code`: string, required (pattern: `^\d{6}$`) ⚠️ NOTE: Field name is `otp_code`, NOT `otp`
- `first_name`: string, optional (for new user signup)
- `last_name`: string, optional (for new user signup)
- `email`: string, optional

**Response (200):**
```json
{
  "success": true,
  "data": {
    "is_new_user": false,
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "phone_number": "9876543210",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    }
  },
  "message": "OTP verified."
}
```

**Response (400):**
Invalid or expired OTP

---

### 3. Refresh Token
**Endpoint:** `POST /api/users/auth/refresh/`

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## Important Notes

### Token Field Names
- Backend uses: `access` and `refresh` (NOT `access_token` and `refresh_token`)
- Store as: `access` and `refresh` in localStorage

### Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "data": {},
  "message": string
}
```

### Phone Number Format
- Always send 10 digits only (no country code prefix)
- Pattern: `^\d{10}$`
- Example: `"9876543210"` (NOT `"+919876543210"`)

### OTP Format
- 6 digits
- Pattern: `^\d{6}$`
- Example: `"123456"`

---

## User Profile Endpoints

### Get User Profile
**Endpoint:** `GET /api/users/profile/`

**Headers:**
```
Authorization: Bearer {access_token}
```

### Update User Profile
**Endpoint:** `PATCH /api/users/profile/`

---

## Educational Hierarchy

- `GET /api/boards/`
- `GET /api/classes/`
- `GET /api/mediums/`
- `GET /api/subjects/`
- `GET /api/books/`
- `GET /api/chapters/`

---

## Content Endpoints

- `GET /api/content/feed/`
- `GET /api/content/{id}/`
- `POST /api/content/{id}/like/`
- `POST /api/content/{id}/bookmark/`
- `POST /api/content/{id}/share/`
- `GET /api/content/{id}/comments/`
- `POST /api/content/{id}/comments/`

---

## Quiz Endpoints

- `GET /api/quizzes/`
- `GET /api/quizzes/{id}/`
- `POST /api/quizzes/{id}/submit/`
- `GET /api/quizzes/history/`

---

## Poll Endpoints

- `GET /api/polls/`
- `POST /api/polls/{id}/vote/`

---

## Social Endpoints

- `POST /api/users/{userId}/follow/`
- `POST /api/users/{userId}/unfollow/`
- `GET /api/users/followers/`
- `GET /api/users/following/`

---

## Gamification Endpoints

- `GET /api/users/points/`
- `GET /api/users/badges/`
- `GET /api/leaderboard/`

---

## Focus Session Endpoints

- `GET /api/focus-sessions/`
- `POST /api/focus-sessions/start/`
- `POST /api/focus-sessions/{id}/end/`

---

## Daily Goals

- `GET /api/users/daily-goals/`

---

## Search

- `GET /api/search/`