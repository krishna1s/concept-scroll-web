# Phone Number Authentication

ConceptScroll uses Indian phone numbers as the primary authentication method, following the pattern used by popular Indian apps like WhatsApp, Paytm, and others.

## Overview

- **Phone Number**: Primary identifier (username)
- **Email**: Optional during signup
- **Format**: +91 XXXXXXXXXX (Indian numbers only)
- **Password**: Required for account security

## Authentication Flow

### Sign Up Flow

1. User enters:
   - **First Name** (required)
   - **Last Name** (required)
   - **Phone Number** (required) - 10 digits
   - **Email** (optional)
   - **Password** (required, min 6 characters)

2. Phone number is formatted as `+91XXXXXXXXXX`
3. Account is created with phone as username
4. User proceeds to onboarding

### Login Flow

1. User enters:
   - **Phone Number** (10 digits)
   - **Password**

2. Phone number is formatted as `+91XXXXXXXXXX`
3. If credentials are valid, user is logged in
4. If onboarding is complete, user goes to home feed
5. If onboarding is incomplete, user goes to onboarding screen

### Returning User Flow

1. Session is checked automatically on app load
2. If session exists and onboarding is complete → Home Feed
3. If session exists but onboarding incomplete → Onboarding Screen
4. If no session → Login Screen

## Implementation Details

### Frontend Components

#### SignUpScreen
- Phone input with +91 prefix
- Auto-formats to 10 digits
- Email is optional
- Validates phone number length

#### LoginScreen
- Phone input with +91 prefix
- Auto-formats to 10 digits
- Password input

#### AuthContext
```typescript
login(phoneNumber: string, password: string)
signUp(phoneNumber: string, password: string, profile: {
  first_name: string;
  last_name: string;
  email?: string;
})
```

### API Contract

```typescript
interface IApiClient {
  // Phone-based authentication
  login(phoneNumber: string, password: string): Promise<AuthTokens>;
  
  signUp(
    phoneNumber: string, 
    password: string, 
    profile: { 
      first_name: string; 
      last_name: string; 
      email?: string;
    }
  ): Promise<AuthTokens>;
  
  // OTP-based authentication (alternative)
  requestOTP(phoneNumber: string): Promise<{ success: boolean; message: string }>;
  verifyOTP(phoneNumber: string, otpCode: string): Promise<AuthTokens>;
}
```

### Supabase Adapter (Temporary Backend)

**Current Implementation:**
- For Supabase compatibility, phone numbers are stored as: `{phone}@conceptscroll.app`
- This is a workaround since Supabase uses email-based auth
- Phone number is stored in `user_metadata.phone_number`

**Example:**
```typescript
// Phone: +919876543210
// Supabase email: +919876543210@conceptscroll.app
// User metadata: { phone_number: '+919876543210' }
```

### Django Backend Migration

When migrating to your Django backend, the adapter will use native phone authentication:

```typescript
// djangoClient.ts
async login(phoneNumber: string, password: string): Promise<AuthTokens> {
  const response = await fetch(`${this.baseUrl}/api/users/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: phoneNumber, // Django uses phone as username
      password
    })
  });
  
  const data = await response.json();
  return {
    access_token: data.access,
    refresh_token: data.refresh,
    user: data.user
  };
}
```

## Phone Number Validation

### Frontend Validation
- Only digits allowed
- Maximum 10 digits
- Automatically adds +91 prefix
- Validates before submission

### Backend Validation (Django)
```python
# In your Django backend
from django.core.validators import RegexValidator

phone_regex = RegexValidator(
    regex=r'^\+91[6-9]\d{9}$',
    message="Phone number must be in format: +91XXXXXXXXXX"
)
```

## User Experience

### Benefits
1. **Familiar**: Matches popular Indian apps
2. **Simple**: No email required
3. **Fast**: Quick signup process
4. **Secure**: Password-based authentication

### Error Handling
- Invalid phone number format → "Please enter a valid 10-digit phone number"
- Wrong credentials → "Login failed. Please check your credentials."
- Network errors → Proper error messages displayed

## Future Enhancements

### OTP Verification (Optional)
You can add OTP-based login as an alternative:

1. User enters phone number
2. Receives SMS with 6-digit OTP
3. Verifies OTP to login
4. No password required

This is already supported in the API contract via `requestOTP()` and `verifyOTP()` methods.

### Social Login
Google OAuth is also supported as an alternative login method.

## Testing

### Test Accounts (Development)

Create test users with:
```
Phone: +919876543210
Password: test123
```

### Supabase Setup

The phone numbers are stored in Supabase as email format during development. When you migrate to Django, they'll be native phone numbers.

## Security Considerations

1. **Phone Number Privacy**: Phone numbers are treated as sensitive data
2. **Password Requirements**: Minimum 6 characters (can be increased)
3. **Rate Limiting**: Should be implemented on backend
4. **OTP Expiry**: 10 minutes for OTP codes
5. **Session Management**: JWT tokens with refresh mechanism

## Migration Checklist

When migrating from Supabase to Django:

- [ ] Update API base URL in frontend
- [ ] Create Django adapter implementing IApiClient
- [ ] Update phone authentication endpoints
- [ ] Migrate user data from Supabase to Django
- [ ] Convert email-based phone format to native phone field
- [ ] Test authentication flow end-to-end
- [ ] Update environment variables
- [ ] Deploy backend changes
- [ ] Deploy frontend changes

The architecture ensures this migration will be seamless since the frontend code doesn't need to change!
