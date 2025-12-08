# API Testing Guide - ConceptScroll Django Backend

## 🎯 Quick Start

Your app is now connected to your Django backend at:
```
https://b18244a7bf71.ngrok-free.app
```

## 📱 Test the Complete Flow

### Step 1: Start the App
1. Your app should already be running
2. You'll see the Login/SignUp screen

### Step 2: Test SignUp Flow
1. Click **"Sign Up"** tab
2. Enter your phone number (e.g., `9876543210`)
3. Enter First Name: `Test`
4. Enter Last Name: `User`
5. Click **"Send OTP"**

**Expected Console Output:**
```
📱 Requesting OTP for signup: +919876543210
✅ OTP sent successfully
```

**Expected Backend Call:**
```http
POST https://b18244a7bf71.ngrok-free.app/api/auth/request-otp/
Content-Type: application/json
ngrok-skip-browser-warning: true

{
  "phone_number": "+919876543210"
}
```

6. Enter the OTP you received
7. Click **"Verify & Sign Up"**

**Expected Console Output:**
```
🔐 Verifying OTP for: +919876543210
✅ OTP Verified Successfully
👤 User: { id: '...', phone_number: '+919876543210', first_name: 'Test', last_name: 'User' }
🆕 Is New User: true
📋 User preferences: null
```

**Expected Backend Call:**
```http
POST https://b18244a7bf71.ngrok-free.app/api/auth/verify-otp/
Content-Type: application/json
ngrok-skip-browser-warning: true

{
  "phone_number": "+919876543210",
  "otp": "123456",
  "first_name": "Test",
  "last_name": "User"
}
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "phone_number": "+919876543210",
    "first_name": "Test",
    "last_name": "User",
    "email": null,
    "profile_picture": null
  },
  "is_new_user": true
}
```

### Step 3: Test Onboarding Flow

After successful signup, you should be redirected to the Onboarding screen.

**Backend Call - Get Onboarding Preferences:**
```http
GET https://b18244a7bf71.ngrok-free.app/api/users/onboarding-preferences/
Authorization: Bearer <access_token>
ngrok-skip-browser-warning: true
```

**Expected Response (for new users):**
```json
{
  "detail": "Not found"
}
```
(App will handle this gracefully and show onboarding)

**Step 3a: Select Board**
1. Choose a board (e.g., CBSE)

**Backend Call:**
```http
GET https://b18244a7bf71.ngrok-free.app/api/boards/
Authorization: Bearer <access_token>
ngrok-skip-browser-warning: true
```

**Expected Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "CBSE",
      "code": "CBSE",
      "description": "Central Board of Secondary Education",
      "logo_url": "...",
      "is_active": true
    },
    ...
  ]
}
```

**Step 3b: Select Class**

**Backend Call:**
```http
GET https://b18244a7bf71.ngrok-free.app/api/classes/?board_id=<board_uuid>
Authorization: Bearer <access_token>
ngrok-skip-browser-warning: true
```

**Step 3c: Select Medium**

**Backend Call:**
```http
GET https://b18244a7bf71.ngrok-free.app/api/mediums/
Authorization: Bearer <access_token>
ngrok-skip-browser-warning: true
```

**Step 3d: Select Subjects**

**Backend Call:**
```http
GET https://b18244a7bf71.ngrok-free.app/api/subjects/?class_id=<class_uuid>
Authorization: Bearer <access_token>
ngrok-skip-browser-warning: true
```

**Step 3e: Save Preferences**

**Backend Call:**
```http
POST https://b18244a7bf71.ngrok-free.app/api/users/onboarding-preferences/
Authorization: Bearer <access_token>
Content-Type: application/json
ngrok-skip-browser-warning: true

{
  "board_id": "uuid",
  "class_id": "uuid",
  "medium_id": "uuid",
  "subject_ids": ["uuid1", "uuid2", "uuid3"],
  "completed": true
}
```

### Step 4: Test Login Flow (Existing User)

1. Go back to Login screen
2. Enter phone number: `9876543210`
3. Click **"Send OTP"**
4. Enter OTP
5. Click **"Verify & Login"**

**Expected Backend Calls:**
```http
POST /api/auth/request-otp/
POST /api/auth/verify-otp/ (without first_name/last_name)
GET /api/users/onboarding-preferences/
```

**Expected Flow:**
- If preferences exist and completed = true → Navigate to Home
- If preferences not complete → Navigate to Onboarding

## 🔍 Debugging Tips

### 1. Check Browser Console
Open DevTools (F12) and look for:
- ✅ Green checkmarks for successful API calls
- ❌ Red error messages for failures
- 📱 Phone number formatting logs
- 🔐 Authentication logs

### 2. Check Network Tab
- Filter by "api" to see all API calls
- Check request headers (should include Authorization token)
- Check request payload
- Check response status and body

### 3. Check LocalStorage
Open DevTools → Application → Local Storage → Check for:
- `auth_access_token`
- `auth_refresh_token`

### 4. Common Issues

**Issue: OTP not being sent**
- ✅ Check if Django backend is running
- ✅ Check if ngrok tunnel is active
- ✅ Check Django backend logs
- ✅ Check phone number formatting (+91 prefix)

**Issue: 401 Unauthorized**
- ✅ Check if access_token exists in localStorage
- ✅ Check if token is expired
- ✅ Client will auto-refresh token

**Issue: CORS Error**
- ✅ Make sure Django backend has CORS enabled
- ✅ Check if ngrok-skip-browser-warning header is being sent

**Issue: Network Error**
- ✅ Check if backend URL is correct in `/config/api.ts`
- ✅ Check if ngrok tunnel is running
- ✅ Try accessing backend URL directly in browser

## 📊 Expected API Call Sequence

### New User Signup:
```
1. POST /api/auth/request-otp/
2. POST /api/auth/verify-otp/ (with first_name, last_name)
3. GET /api/users/onboarding-preferences/ (returns 404)
4. GET /api/boards/
5. GET /api/classes/?board_id=...
6. GET /api/mediums/
7. GET /api/subjects/?class_id=...
8. POST /api/users/onboarding-preferences/
9. Navigate to Home
```

### Existing User Login:
```
1. POST /api/auth/request-otp/
2. POST /api/auth/verify-otp/ (without profile data)
3. GET /api/users/onboarding-preferences/
   - If completed: Navigate to Home
   - If not: Navigate to Onboarding
```

## 🧪 Test Different Scenarios

### Scenario 1: New User Full Flow
✅ Signup → Onboarding → Home

### Scenario 2: Existing User with Complete Profile
✅ Login → Home (skip onboarding)

### Scenario 3: Existing User with Incomplete Profile
✅ Login → Onboarding → Home

### Scenario 4: Token Expiration
1. Login successfully
2. Wait for token to expire (or manually delete from localStorage)
3. Try to fetch data
4. ✅ Should auto-refresh token
5. ✅ Should retry the failed request
6. ✅ If refresh fails, should redirect to login

## 📝 Backend Response Format

All paginated endpoints return:
```json
{
  "count": 100,
  "next": "https://.../api/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

All authenticated requests require:
```
Authorization: Bearer <access_token>
```

All error responses:
```json
{
  "detail": "Error message here",
  "message": "Error message here",
  "errors": { ... }
}
```

## ✅ Success Checklist

- [ ] OTP sent successfully
- [ ] OTP verified successfully
- [ ] Tokens stored in localStorage
- [ ] User profile fetched
- [ ] Onboarding preferences checked
- [ ] Boards loaded
- [ ] Classes loaded
- [ ] Mediums loaded
- [ ] Subjects loaded
- [ ] Preferences saved
- [ ] Navigated to Home screen

## 🎉 You're All Set!

Your ConceptScroll app is now fully integrated with your Django backend. Test the flow and check the console for detailed logs. If you encounter any issues, check the troubleshooting section above.

Happy testing! 🚀
