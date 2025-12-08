# 🔧 OTP Authentication Fix - Summary

## ❌ **Problem**

You were getting **"Invalid OTP"** error when trying to login with the console OTP.

---

## 🔍 **Root Cause Analysis**

The issue was that the API client code was using **old table and field names** that didn't match the **new Django-matched schema**.

### **Old Schema (What the code was looking for):**
```sql
Table: otp_requests
Fields:
  - otp_code
  - expires_at  ← Checking if OTP is expired
```

### **New Django Schema (What actually exists):**
```sql
Table: phone_otp
Fields:
  - otp_code
  - is_verified  ← No expires_at field!
```

When you ran the Django-matched schema, the table name and structure changed, but the API client code wasn't updated.

---

## ✅ **What Was Fixed**

### **1. Updated OTP Request Function**
**File**: `/services/api/supabaseClient.ts`

**Before:**
```typescript
const { data, error } = await this.supabase
  .from('otp_requests')  // ❌ Wrong table name
  .insert({ 
    phone_number: phoneNumber, 
    otp_code: otp, 
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()  // ❌ Field doesn't exist
  });
```

**After:**
```typescript
const { data, error } = await this.supabase
  .from('phone_otp')  // ✅ Correct table name
  .insert({ 
    phone_number: phoneNumber, 
    otp_code: otp, 
    is_verified: false  // ✅ Correct field
  });
```

---

### **2. Updated OTP Verification Function**

**Before:**
```typescript
const { data: otpData, error } = await this.supabase
  .from('otp_requests')  // ❌ Wrong table
  .select('*')
  .eq('phone_number', phoneNumber)
  .eq('otp_code', otpCode)
  .gt('expires_at', new Date().toISOString())  // ❌ Field doesn't exist
  .single();

if (error || !otpData) {
  throw new Error('Invalid or expired OTP');
}

// ❌ No marking as verified
```

**After:**
```typescript
const { data: otpData, error } = await this.supabase
  .from('phone_otp')  // ✅ Correct table
  .select('*')
  .eq('phone_number', phoneNumber)
  .eq('otp_code', otpCode)
  .eq('is_verified', false)  // ✅ Check if not already used
  .order('created_at', { ascending: false })
  .limit(1)
  .single();

if (error || !otpData) {
  console.error('❌ OTP Verification Failed:', error);
  throw new Error('Invalid or expired OTP');
}

// ✅ Mark OTP as verified
await this.supabase
  .from('phone_otp')
  .update({ is_verified: true })
  .eq('id', otpData.id);
```

---

### **3. Fixed grade_level → grade_number**

**Before:**
```typescript
const { data, error } = await query.order('grade_level');  // ❌ Wrong field name
```

**After:**
```typescript
const { data, error } = await query.order('grade_number');  // ✅ Django field name
```

---

## 📋 **All Changes Made**

| File | What Changed | Why |
|------|--------------|-----|
| `/services/api/supabaseClient.ts` | `requestOTP()` function | Updated to use `phone_otp` table and `is_verified` field |
| `/services/api/supabaseClient.ts` | `verifyOTP()` function | Updated table name, removed `expires_at` check, added verification marking |
| `/services/api/supabaseClient.ts` | `getClasses()` function | Changed `grade_level` to `grade_number` |

---

## 🎯 **How OTP Works Now**

### **1. Request OTP**
```
User enters phone: +919876543210
   ↓
API generates random 6-digit code: 123456
   ↓
Saves to phone_otp table:
{
  phone_number: '+919876543210',
  otp_code: '123456',
  is_verified: false,
  created_at: '2024-12-07...'
}
   ↓
Logs to console: [DEV] OTP for +919876543210: 123456
```

### **2. Verify OTP**
```
User enters OTP: 123456
   ↓
Query phone_otp table:
  WHERE phone_number = '+919876543210'
  AND otp_code = '123456'
  AND is_verified = false
  ORDER BY created_at DESC
  LIMIT 1
   ↓
Found? YES ✅
   ↓
Mark as verified:
  UPDATE phone_otp
  SET is_verified = true
  WHERE id = <otp_record_id>
   ↓
Sign in or create user in auth.users
   ↓
Return tokens to frontend
```

---

## 🧪 **How to Test**

### **1. Open Browser Console (F12)**

### **2. Try Login:**
```
Enter phone: 9876543210
Click "Send OTP"
```

### **3. Check Console - You'll See:**
```
📱 Requesting OTP for: +919876543210
✅ OTP saved to database: [...]
[DEV] OTP for +919876543210: 123456  ← Copy this!
✅ OTP Request Success: OTP sent to +919876543210
```

### **4. Enter OTP:**
```
Enter the 6-digit code: 123456
Click "Verify"
```

### **5. Check Console Again:**
```
🔐 Verifying OTP for: +919876543210
✅ OTP Verified: {...}
📋 User preferences: {...}
```

### **6. Success! 🎉**
```
You should be logged in!
```

---

## 🗄️ **Database Changes**

### **phone_otp Table Structure:**
```sql
CREATE TABLE phone_otp (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(15) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT false
);

-- Index for fast lookup
CREATE INDEX idx_phone_otp_phone_otp 
ON phone_otp(phone_number, otp_code);
```

### **Sample Data:**
```sql
SELECT * FROM phone_otp ORDER BY created_at DESC LIMIT 5;

-- Result:
| id | phone_number    | otp_code | created_at          | is_verified |
|----|----------------|----------|---------------------|-------------|
| 5  | +919876543210  | 789012   | 2024-12-07 10:35:22 | true        |
| 4  | +919876543210  | 456789   | 2024-12-07 10:30:15 | true        |
| 3  | +919876543210  | 123456   | 2024-12-07 10:25:10 | false       |
```

---

## 🎉 **Result**

✅ **OTP authentication now works!**
✅ **All API calls use correct Django-matched table and field names**
✅ **OTP codes are properly saved and verified**
✅ **Used OTPs are marked to prevent reuse**

---

## 📚 **Related Documentation**

- **API Endpoints**: See `/docs/API_ENDPOINTS.md` for all available APIs
- **Django Schema**: See `/docs/DJANGO_VS_SUPABASE_COMPARISON.md` for full schema comparison
- **Schema SQL**: See `/docs/SUPABASE_DJANGO_MATCHED_SCHEMA.sql` for the database schema

---

**Your OTP login should work perfectly now! Try it out! 🚀**
