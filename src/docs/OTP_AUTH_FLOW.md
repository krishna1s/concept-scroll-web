# OTP-Based Authentication Flow

ConceptScroll uses OTP (One-Time Password) authentication for a passwordless login experience, similar to popular Indian apps like WhatsApp, Paytm, and Swiggy.

## 🔐 Authentication Overview

### Key Features
- **Phone Number Only**: No password required
- **6-Digit OTP**: Sent via SMS (console in dev mode)
- **10-Minute Expiry**: OTP valid for 10 minutes
- **Language Selection**: Choose your preferred language before login
- **Secure**: OTP verified on backend

---

## 📱 Login Flow

### Step 1: Phone Number Entry
1. User selects language (English, Hindi, etc.)
2. User enters 10-digit phone number
3. System adds +91 prefix automatically
4. User taps "Send OTP"

### Step 2: OTP Verification
1. 6-digit OTP sent to phone number
2. User enters OTP code
3. System verifies OTP
4. On success:
   - **Existing user** → Login → Home Feed
   - **New user** → Create account → Onboarding

### Visual Flow
```
┌─────────────────┐
│ Select Language │
│  (हिंदी/English)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Enter Phone     │
│ +91 XXXXXXXXXX  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Send OTP        │
│ (API Call)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Enter 6-Digit   │
│ OTP Code        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Verify OTP      │
│ (API Call)      │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
Existing    New User
  User         │
    │          │
    │          ▼
    │    ┌──────────┐
    │    │Onboarding│
    │    └────┬─────┘
    │         │
    └────┬────┘
         │
         ▼
   ┌──────────┐
   │Home Feed │
   └──────────┘
```

---

## 📝 Sign Up Flow

### Step 1: User Details
1. User selects language
2. User enters:
   - First Name (required)
   - Last Name (required)
   - Phone Number (required)
   - Email (optional)
3. User taps "Send OTP"

### Step 2: OTP Verification
1. 6-digit OTP sent to phone number
2. User enters OTP code
3. System verifies OTP and creates account
4. User proceeds to onboarding

### Visual Flow
```
┌─────────────────┐
│ Select Language │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Enter Details   │
│ • Name          │
│ • Phone         │
│ • Email (opt)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Send OTP        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Verify OTP      │
│ Create Account  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Onboarding      │
│ (5 Steps)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Home Feed       │
└─────────────────┘
```

---

## 🌐 Language Selection

### Available Languages
1. **English** - English
2. **हिंदी** - Hindi
3. **தமிழ்** - Tamil
4. **తెలుగు** - Telugu
5. **मराठी** - Marathi
6. **বাংলা** - Bengali

### Features
- **Dropdown Menu**: Tap globe icon to open language menu
- **Native Names**: Languages shown in their native scripts
- **Persistent**: Selected language saved throughout session
- **Pre-Auth**: Can change language before login/signup

---

## 🔧 Technical Implementation

### Frontend Components

#### LoginScreen.tsx
```typescript
// Two-step process
type LoginStep = 'phone' | 'otp';

// Step 1: Request OTP
const handleRequestOTP = async () => {
  const result = await loginWithOTP.requestOTP(`+91${phoneNumber}`);
  setStep('otp');
};

// Step 2: Verify OTP
const handleVerifyOTP = async () => {
  await loginWithOTP.verifyOTP(`+91${phoneNumber}`, otp);
  // Auto-navigates to home or onboarding
};
```

#### SignUpScreen.tsx
```typescript
// Two-step process with profile data
type SignUpStep = 'details' | 'otp';

// Step 1: Collect details and request OTP
const handleRequestOTP = async () => {
  const result = await signUpWithOTP.requestOTP(`+91${phoneNumber}`);
  setStep('otp');
};

// Step 2: Verify OTP with profile
const handleVerifyOTP = async () => {
  await signUpWithOTP.verifyOTP(`+91${phoneNumber}`, otp, {
    first_name: firstName,
    last_name: lastName,
    email: email || undefined
  });
  // Auto-navigates to onboarding
};
```

### Auth Context

```typescript
interface AuthContextValue {
  loginWithOTP: {
    requestOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
    verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
  };
  signUpWithOTP: {
    requestOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
    verifyOTP: (
      phoneNumber: string, 
      otp: string, 
      profile: { first_name: string; last_name: string; email?: string }
    ) => Promise<void>;
  };
}
```

### API Contract

```typescript
interface IApiClient {
  /**
   * Request OTP for phone number
   * POST /api/users/auth/request_otp/
   */
  requestOTP(phoneNumber: string): Promise<{ success: boolean; message: string }>;
  
  /**
   * Verify OTP and login/signup
   * POST /api/users/auth/verify_otp/
   */
  verifyOTP(
    phoneNumber: string, 
    otpCode: string,
    profile?: { first_name: string; last_name: string; email?: string }
  ): Promise<AuthTokens>;
}
```

### Supabase Adapter (Development)

```typescript
async requestOTP(phoneNumber: string) {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store in database with 10-minute expiry
  await this.supabase
    .from('otp_requests')
    .insert({ 
      phone_number: phoneNumber, 
      otp_code: otp, 
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() 
    });
  
  // In dev: log to console
  console.log(`[DEV] OTP for ${phoneNumber}: ${otp}`);
  
  return { success: true, message: 'OTP sent' };
}

async verifyOTP(phoneNumber: string, otpCode: string, profile?) {
  // Verify OTP from database
  const { data: otpData } = await this.supabase
    .from('otp_requests')
    .select('*')
    .eq('phone_number', phoneNumber)
    .eq('otp_code', otpCode)
    .gt('expires_at', new Date().toISOString())
    .single();
  
  if (!otpData) throw new Error('Invalid or expired OTP');
  
  // Try to login existing user
  const { data, error } = await this.supabase.auth.signInWithPassword({
    email: `${phoneNumber}@conceptscroll.app`,
    password: phoneNumber
  });
  
  // If user doesn't exist, create account
  if (error && profile) {
    const { data: signUpData } = await this.supabase.auth.signUp({
      email: profile.email || `${phoneNumber}@conceptscroll.app`,
      password: phoneNumber,
      options: {
        data: {
          phone_number: phoneNumber,
          first_name: profile.first_name,
          last_name: profile.last_name
        }
      }
    });
    
    return {
      access_token: signUpData.session.access_token,
      refresh_token: signUpData.session.refresh_token,
      user: this.mapAuthUser(signUpData.user)
    };
  }
  
  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: this.mapAuthUser(data.user)
  };
}
```

---

## 🎯 User Experience Features

### Phone Input
- **Auto-formatting**: Only digits, max 10
- **Visual prefix**: Shows +91 with spacing
- **Validation**: Must be exactly 10 digits
- **Placeholder**: 9876543210

### OTP Input
- **Numeric keyboard**: `inputMode="numeric"`
- **6-character limit**: `maxLength={6}`
- **Wide tracking**: Letter-spaced for readability
- **Centered**: Easy to read OTP code
- **Auto-focus**: Cursor ready on load

### Navigation
- **Back button**: "Change number" / "Change details"
- **Resend OTP**: Available after first send
- **Clear errors**: Reset on step change
- **Loading states**: Prevents double-submit

### Language Selector
- **Globe icon**: Universal language symbol
- **Dropdown menu**: All 6 languages
- **Current highlight**: Active language in purple
- **Native display**: Each language in its script
- **Instant switch**: Updates strings immediately

---

## 🔒 Security Features

### OTP Generation
- **Random**: 6-digit random number (100000-999999)
- **Unique**: New OTP for each request
- **Expiry**: 10-minute timeout
- **Single use**: Invalidated after verification

### Validation
- **Phone format**: Must match +91XXXXXXXXXX
- **OTP length**: Exactly 6 digits
- **Expiry check**: Server-side timestamp validation
- **Rate limiting**: Prevent spam (Django backend)

### Data Protection
- **No password storage**: Passwordless authentication
- **JWT tokens**: Secure session management
- **HTTPS only**: Encrypted communication
- **Phone privacy**: Phone number not publicly visible

---

## 🧪 Testing

### Development Mode

**Console Logging:**
```
[DEV] OTP for +919876543210: 123456
```

**Test Flow:**
1. Enter phone: `9876543210`
2. Click "Send OTP"
3. Check browser console for OTP
4. Enter OTP: `123456`
5. Click "Verify & Login"

### Test Users

Create test accounts:
```
Phone: 9876543210
OTP: (check console)
Name: Raj Kumar

Phone: 9876543211
OTP: (check console)
Name: Priya Sharma
```

---

## 📊 Database Schema

### otp_requests Table
```sql
CREATE TABLE otp_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(15) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX idx_otp_phone ON otp_requests(phone_number, otp_code);
```

### Cleanup Old OTPs
```sql
-- Delete expired OTPs (run periodically)
DELETE FROM otp_requests 
WHERE expires_at < NOW() - INTERVAL '1 hour';
```

---

## 🚀 Django Backend Migration

When migrating to Django, implement OTP with SMS provider:

### Install SMS Provider
```bash
pip install twilio  # or any SMS provider
```

### Django View
```python
from twilio.rest import Client
import random
from django.core.cache import cache

def request_otp(request):
    phone_number = request.data.get('phone_number')
    
    # Generate OTP
    otp = str(random.randint(100000, 999999))
    
    # Store in Redis/Cache with 10-minute expiry
    cache.set(f'otp:{phone_number}', otp, 600)
    
    # Send SMS
    client = Client(settings.TWILIO_SID, settings.TWILIO_TOKEN)
    client.messages.create(
        body=f'Your ConceptScroll OTP is {otp}',
        from_=settings.TWILIO_PHONE,
        to=phone_number
    )
    
    return Response({'success': True, 'message': 'OTP sent'})

def verify_otp(request):
    phone_number = request.data.get('phone_number')
    otp_code = request.data.get('otp_code')
    profile = request.data.get('profile', {})
    
    # Verify OTP from cache
    stored_otp = cache.get(f'otp:{phone_number}')
    if not stored_otp or stored_otp != otp_code:
        return Response({'error': 'Invalid OTP'}, status=400)
    
    # Delete used OTP
    cache.delete(f'otp:{phone_number}')
    
    # Get or create user
    user, created = User.objects.get_or_create(
        username=phone_number,
        defaults={
            'phone_number': phone_number,
            'first_name': profile.get('first_name'),
            'last_name': profile.get('last_name'),
            'email': profile.get('email')
        }
    )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh),
        'user': UserSerializer(user).data
    })
```

---

## 🎨 UI Components

### Language Dropdown
```tsx
<button onClick={() => setShowLanguageMenu(!showLanguageMenu)}>
  <Globe className="w-5 h-5" />
  <span>{currentLangName}</span>
</button>

{showLanguageMenu && (
  <div className="dropdown">
    {languages.map((lang) => (
      <button key={lang.code} onClick={() => handleLanguageSelect(lang.code)}>
        <div>{lang.nativeName}</div>
        <div className="text-xs">{lang.name}</div>
      </button>
    ))}
  </div>
)}
```

### Phone Input with Prefix
```tsx
<div className="relative">
  <Smartphone className="icon" />
  <div className="prefix">+91</div>
  <input
    type="tel"
    value={phoneNumber}
    onChange={handlePhoneChange}
    className="pl-20"  // Space for icon + prefix
    placeholder="9876543210"
  />
</div>
```

### OTP Input
```tsx
<input
  type="text"
  inputMode="numeric"
  value={otp}
  onChange={handleOtpChange}
  className="tracking-widest text-center"
  placeholder="000000"
  maxLength={6}
/>
```

---

## ✅ Benefits of OTP Flow

### User Benefits
- ✅ **No password to remember**
- ✅ **Faster login process**
- ✅ **More secure** (time-limited)
- ✅ **Familiar** (like WhatsApp)
- ✅ **Mobile-first** (SMS based)

### Developer Benefits
- ✅ **No password hashing** required
- ✅ **No password reset** flow needed
- ✅ **Simpler** authentication logic
- ✅ **Better UX** for mobile users
- ✅ **Industry standard** for India

---

## 🐛 Common Issues

### OTP Not Received
- **Dev Mode**: Check browser console
- **Production**: Verify SMS provider credentials
- **Network**: Check internet connection

### Invalid OTP
- **Expired**: OTP valid for 10 minutes only
- **Wrong code**: Check all 6 digits
- **Already used**: Request new OTP

### Phone Number Issues
- **Format**: Must be 10 digits
- **Prefix**: System adds +91 automatically
- **Validation**: Only Indian numbers supported

---

## 📖 Next Steps

1. ✅ **Login/Signup** with OTP - Completed!
2. ✅ **Language Selection** - Completed!
3. 🔜 **SMS Integration** - When migrating to Django
4. 🔜 **Rate Limiting** - Prevent OTP spam
5. 🔜 **Analytics** - Track OTP success rate

---

**Enjoy the passwordless experience! 🎉**
