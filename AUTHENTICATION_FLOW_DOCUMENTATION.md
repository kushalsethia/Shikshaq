# Authentication Flow Documentation

## Overview

This document explains the complete authentication flow implemented in ShikshAq, including email/password login, Google OAuth, password reset, and OTP verification.

---

## Authentication Methods

### 1. Google OAuth (Social Login)
- **Status**: ✅ Fully configured and working
- **Flow**: Direct sign-in via Google account
- **No additional configuration needed** (already set up)

### 2. Email/Password Authentication
- **Status**: ✅ Implemented with multi-step flow
- **Flow**: Multi-step process with OTP verification when needed
- **Requires**: Supabase email configuration (see Configuration section)

---

## Complete Authentication Flow

### **Sign-In Flow**

#### **Scenario A: User with Email + Password (Normal Login)**

```
Step 1: Email Entry
  └─> User enters email
  └─> System checks if email exists in Supabase

Step 2: Password Entry (if email exists + password exists)
  └─> User enters password
  └─> System attempts login with email + password
  └─> ✅ Success → Check role → Navigate to home
  └─> ❌ Invalid credentials → Show error
  └─> Option: "Forgot password?" → Go to password reset flow

Step 3: Role Selection (if role not set)
  └─> User selects "Student" or "Guardian"
  └─> Profile updated → Navigate to home
```

#### **Scenario B: User with Email but No Password (OTP + Password Setup)**

```
Step 1: Email Entry
  └─> User enters email
  └─> System checks if email exists in Supabase

Step 2: Password Detection
  └─> System checks if password is set
  └─> If NO password → Automatically send OTP

Step 3: OTP Verification
  └─> Supabase sends OTP to user's email
  └─> User enters 6-digit OTP
  └─> System verifies OTP via verifyOTP()
  └─> ✅ Verified → User is now authenticated → Proceed to password setup

Step 4: Set Password (Direct in App)
  └─> User enters "New Password"
  └─> User enters "Confirm Password"
  └─> User clicks "Set Password & Continue"
  └─> System calls updatePassword() directly (user is authenticated after OTP)
  └─> ✅ Password set successfully in database
  └─> Check role → Navigate to home

Step 5: Role Selection (if role not set)
  └─> User selects "Student" or "Guardian"
  └─> Profile updated → Navigate to home
```

#### **Scenario C: User Doesn't Exist**

```
Step 1: Email Entry
  └─> User enters email
  └─> System checks if email exists
  └─> ❌ Email not found
  └─> Error: "No account found with this email. Please sign up instead."
```

---

### **Sign-Up Flow**

```
Step 1: User Information
  └─> User enters Full Name
  └─> User enters Email
  └─> User enters Password
  └─> User selects Role (Student/Guardian)

Step 2: Email Existence Check
  └─> System checks if email already exists
  └─> If exists → Error: "An account already exists with this email. 
       Please use a different email or use forgot password."
  └─> If not exists → Proceed

Step 3: Account Creation
  └─> Supabase creates auth user
  └─> Profile record created with role
  └─> Navigate to sign-up success page
```

---

### **Forgot Password Flow**

```
Step 1: Email Entry
  └─> User enters email
  └─> System sends password reset email

Step 2: Email Link
  └─> User clicks link in email
  └─> Redirected to password reset page

Step 3: Set New Password
  └─> User enters new password
  └─> User confirms new password
  └─> Password updated
  └─> User can now sign in with new password
```

---

## OTP Generation and Sending

### **Who Generates the OTP?**

**Supabase generates and sends the OTP automatically.**

- **OTP Generation**: Handled by Supabase Auth service
- **OTP Delivery**: Sent via email through Supabase's email service
- **OTP Format**: 6-digit numeric code
- **OTP Expiry**: Default 60 minutes (configurable in Supabase)

### **How It Works**

1. **Code Implementation**:
   ```typescript
   // In auth-context.tsx
   const sendOTP = async (email: string) => {
     const { error } = await supabase.auth.signInWithOtp({
       email,
       options: {
         shouldCreateUser: false, // Don't create user if they don't exist
       },
     });
     return { error: error as Error | null };
   };
   ```

2. **Supabase Process**:
   - Receives request via `signInWithOtp()`
   - Generates secure 6-digit OTP
   - Stores OTP in database (temporary)
   - Sends OTP to user's email
   - OTP expires after configured time

3. **OTP Verification**:
   ```typescript
   const verifyOTP = async (email: string, token: string) => {
     const { error } = await supabase.auth.verifyOtp({
       email,
       token,
       type: 'email',
     });
     return { error: error as Error | null };
   };
   ```

---

## Supabase Configuration Required

### **✅ Already Configured (No Action Needed)**

1. **Google OAuth**: Already set up and working
2. **Email Authentication**: Basic setup exists
3. **OTP Functionality**: Built into Supabase Auth (no extra setup needed)

### **⚠️ Recommended Configuration (Optional but Recommended)**

#### **1. Email Templates (Supabase Dashboard)**

**Location**: Supabase Dashboard → Authentication → Email Templates

**Templates to Configure**:
- **Magic Link / OTP Email**: Customize the OTP email template
- **Password Reset Email**: Customize password reset email
- **Email Confirmation**: Customize email confirmation template

**Steps**:
1. Go to Supabase Dashboard
2. Navigate to Authentication → Email Templates
3. Customize templates with your branding
4. Save changes

**Default Template Variables Available**:
- `{{ .Token }}` - The OTP code
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email
- `{{ .RedirectTo }}` - Redirect URL

#### **2. SMTP Configuration (For Production)**

**Location**: Supabase Dashboard → Project Settings → Auth → SMTP Settings

**Why Configure**:
- Use your own email service (Gmail, SendGrid, etc.)
- Better email deliverability
- Custom sender address
- Higher email sending limits

**Default (Development)**:
- Uses Supabase's default email service
- Limited to development/testing
- May have rate limits

**Production Setup**:
1. Go to Supabase Dashboard
2. Navigate to Project Settings → Auth
3. Enable "Custom SMTP"
4. Enter your SMTP credentials:
   - **Host**: smtp.gmail.com (for Gmail)
   - **Port**: 587
   - **Username**: Your email
   - **Password**: App-specific password
   - **Sender email**: Your verified email
   - **Sender name**: ShikshAq

**Gmail SMTP Example**:
```
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: [App-specific password]
Sender email: your-email@gmail.com
Sender name: ShikshAq
```

**Note**: For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an "App-specific password"
3. Use that password in SMTP settings

#### **3. Email Rate Limiting**

**Location**: Supabase Dashboard → Project Settings → Auth

**Default Limits**:
- OTP emails: Limited per hour per email
- Password reset: Limited per hour per email

**Recommendation**: 
- Monitor email sending in Supabase Dashboard
- Adjust limits if needed for your use case

---

## Code Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                        │
└─────────────────────────────────────────────────────────────┘

User Action: "Sign In"
    │
    ├─> Enter Email
    │   └─> checkEmailExists()
    │       └─> Supabase: Check if email exists
    │
    ├─> [Email Exists?]
    │   │
    │   ├─> YES → Check Password
    │   │   │
    │   │   ├─> [Password Exists?]
    │   │   │   │
    │   │   │   ├─> YES → Show Password Field
    │   │   │   │   └─> signInWithEmail()
    │   │   │   │       └─> ✅ Login Success
    │   │   │   │
    │   │   │   └─> NO → Send OTP
    │   │   │       └─> signInWithOtp()
    │   │   │           └─> Supabase generates OTP
    │   │   │               └─> Supabase sends email
    │   │   │                   └─> User enters OTP
    │   │   │                       └─> verifyOTP()
    │   │   │                           └─> Show Set Password
    │   │   │                               └─> resetPasswordForEmail()
    │   │   │                                   └─> User sets password via email
    │   │   │
    │   │   └─> Check Role
    │   │       └─> [Role Set?]
    │   │           │
    │   │           ├─> YES → Navigate to Home
    │   │           └─> NO → Show Role Selection
    │   │
    │   └─> NO → Error: "Email not found"
    │
    └─> [Forgot Password?]
        └─> resetPasswordForEmail()
            └─> Supabase sends reset link
                └─> User clicks link
                    └─> Set new password
```

---

## API Functions Used

### **From `auth-context.tsx`**

1. **`checkEmailExists(email: string)`**
   - Checks if email exists in Supabase
   - Returns: `{ exists: boolean, error: Error | null }`

2. **`sendOTP(email: string)`**
   - Sends OTP to email via Supabase
   - Uses: `supabase.auth.signInWithOtp()`
   - Returns: `{ error: Error | null }`

3. **`verifyOTP(email: string, token: string)`**
   - Verifies OTP code
   - Uses: `supabase.auth.verifyOtp()`
   - Returns: `{ error: Error | null }`

4. **`signInWithEmail(email: string, password: string)`**
   - Normal email/password login
   - Uses: `supabase.auth.signInWithPassword()`
   - Returns: `{ error: Error | null }`

5. **`resetPasswordForEmail(email: string)`**
   - Sends password reset email
   - Uses: `supabase.auth.resetPasswordForEmail()`
   - Returns: `{ error: Error | null }`

6. **`updatePassword(newPassword: string)`**
   - Updates user's password
   - Uses: `supabase.auth.updateUser()`
   - Returns: `{ error: Error | null }`

---

## Security Features

### **OTP Security**
- ✅ 6-digit numeric code
- ✅ Time-limited (expires after 60 minutes by default)
- ✅ Single-use (can't be reused)
- ✅ Rate-limited (prevents spam)
- ✅ Generated securely by Supabase

### **Password Security**
- ✅ Minimum 6 characters required
- ✅ Stored as hashed values (never plain text)
- ✅ Password reset requires email verification
- ✅ Password updates require authentication

### **Email Verification**
- ✅ OTP sent to registered email only
- ✅ OTP verification required before password setup
- ✅ Prevents unauthorized password changes

---

## Testing the Flow

### **Test Scenario 1: Normal Login**
1. Enter email that exists with password
2. Enter correct password
3. Should log in successfully

### **Test Scenario 2: OTP + Password Setup**
1. Enter email that exists but has no password
2. Should automatically receive OTP email
3. Enter OTP
4. Should see password setup form
5. Set password via email link
6. Should be able to log in normally

### **Test Scenario 3: Sign Up**
1. Enter new email
2. Fill in all fields
3. Should create account successfully
4. Try signing up again with same email
5. Should show error about existing account

### **Test Scenario 4: Forgot Password**
1. Click "Forgot password"
2. Enter email
3. Should receive password reset email
4. Click link and set new password
5. Should be able to log in with new password

---

## Troubleshooting

### **OTP Not Received**

**Possible Causes**:
1. Email in spam folder
2. Email address typo
3. Rate limiting (too many requests)
4. SMTP not configured (using default service)

**Solutions**:
1. Check spam/junk folder
2. Verify email address is correct
3. Wait a few minutes before requesting again
4. Configure custom SMTP for better deliverability

### **OTP Verification Fails**

**Possible Causes**:
1. OTP expired (default 60 minutes)
2. Wrong OTP entered
3. OTP already used

**Solutions**:
1. Request new OTP
2. Double-check the code
3. Use "Resend OTP" button

### **Password Reset Not Working**

**Possible Causes**:
1. Email not received
2. Reset link expired
3. User not authenticated

**Solutions**:
1. Check email spam folder
2. Request new reset link
3. Ensure user is on the reset page with valid token

---

## Configuration Checklist

### **Required (Already Done)**
- ✅ Supabase project created
- ✅ Authentication enabled
- ✅ Google OAuth configured
- ✅ Email authentication enabled
- ✅ OTP functionality available (built-in)

### **Optional (Recommended for Production)**
- ⚠️ Custom email templates configured
- ⚠️ Custom SMTP configured (for production)
- ⚠️ Email rate limits reviewed
- ⚠️ Email deliverability tested

---

## Summary

### **OTP Generation**
- **Who**: Supabase Auth service (automatic)
- **How**: Via `signInWithOtp()` API call
- **Delivery**: Email (Supabase's email service or custom SMTP)
- **Configuration**: No additional setup needed for basic functionality

### **Email Sending**
- **Default**: Uses Supabase's built-in email service
- **Production**: Recommended to configure custom SMTP
- **Templates**: Can be customized in Supabase Dashboard

### **Key Points**
1. ✅ OTP is automatically generated by Supabase
2. ✅ No additional OTP service needed
3. ✅ Email sending works out of the box
4. ⚠️ Custom SMTP recommended for production
5. ⚠️ Email templates can be customized

---

## Next Steps

1. **Test the flow** with different scenarios
2. **Customize email templates** in Supabase Dashboard
3. **Configure custom SMTP** for production (optional but recommended)
4. **Monitor email delivery** in Supabase Dashboard
5. **Test OTP delivery** to ensure emails are received

---

## Support

If you encounter issues:
1. Check Supabase Dashboard → Authentication → Logs
2. Verify email templates are configured
3. Check SMTP settings if using custom SMTP
4. Review rate limits if OTPs not sending
5. Check browser console for errors

