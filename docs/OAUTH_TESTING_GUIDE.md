# OAuth Testing Guide

This guide will help you test the Google OAuth 2.0 flow for RoomPilot in a production-like environment.

## Prerequisites

1. **Google Cloud Console Setup**
2. **Backend Running** on http://localhost:8080
3. **Modern Web Browser**

---

## Step 1: Configure Google Cloud Console

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 1.2 Create or Select a Project
- Create a new project or select your existing RoomPilot project

### 1.3 Enable Google+ API
1. Navigate to **APIs & Services > Library**
2. Search for "Google+ API"
3. Click **Enable**

### 1.4 Create OAuth 2.0 Credentials
1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Select **Web application**
4. Name it "RoomPilot Test Client"

### 1.5 Configure Authorized Redirect URIs
Add these two redirect URIs:
```
http://localhost:8080/oauth-callback.html
http://localhost:8080/api/auth/google/callback
```

### 1.6 Get Your Credentials
- Copy your **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
- Copy your **Client Secret** (you'll need this for your backend)

---

## Step 2: Configure Backend Environment

Set these environment variables before starting your backend:

```bash
# Windows (Command Prompt)
set GOOGLE_CLIENT_ID=your-client-id-here
set GOOGLE_CLIENT_SECRET=your-client-secret-here
set DATABASE_URL=your-database-url
set JWT_SECRET=your-secret-key-here

# Windows (PowerShell)
$env:GOOGLE_CLIENT_ID="your-client-id-here"
$env:GOOGLE_CLIENT_SECRET="your-client-secret-here"
$env:DATABASE_URL="your-database-url"
$env:JWT_SECRET="your-secret-key-here"

# Optional: Set admin emails
set ADMIN_EMAILS=admin@example.com,admin2@example.com
```

---

## Step 3: Start Your Backend

```bash
cd backend
mvn spring-boot:run
```

Verify it's running:
```bash
curl http://localhost:8080/actuator/health
```

Should return:
```json
{"status":"UP"}
```

---

## Step 4: Test OAuth Flow

### Option A: Using the Test Client (Recommended)

1. **Open the test client:**
   - Navigate to: `C:\Users\chris\IdeaProjects\roompilot\oauth-test-client.html`
   - Open it directly in your browser (double-click or right-click > Open with > Browser)

2. **Configure the client:**
   - Paste your Google Client ID
   - Verify API Base URL is `http://localhost:8080`

3. **Click "Login with Google"**
   - You'll be redirected to Google's login page
   - Sign in with your Google account
   - Grant permissions

4. **You'll be redirected back** and see:
   - ✅ Authentication successful
   - Your JWT token
   - User information
   - Test action buttons

5. **Test the protected endpoints:**
   - Click **"Test /me Endpoint"** - verifies your token works
   - Click **"Test Role Selection"** - select HOST or RESIDENT
   - Click **"Copy Token"** - copies JWT for use in Postman/curl

### Option B: Using curl (Manual Testing)

After getting your token from the test client, test endpoints manually:

```bash
# Test the /me endpoint
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Test role selection
curl -X POST http://localhost:8080/api/auth/role \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{\"role\": \"HOST\"}"

# Test logout
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Step 5: What to Verify

### ✅ Successful OAuth Flow Checklist

- [ ] Redirected to Google login successfully
- [ ] Able to sign in with Google account
- [ ] Redirected back to callback page
- [ ] Received JWT token from `/api/auth/google/callback`
- [ ] Token format is valid JWT (3 parts separated by dots)
- [ ] User object contains correct email and Google ID
- [ ] `/api/auth/me` returns user data when authenticated
- [ ] Can select role (HOST or RESIDENT)
- [ ] Role is persisted in database
- [ ] Token remains valid for authenticated requests
- [ ] Logout clears authentication state

### 🔍 Database Verification

Check your database to verify user was created:

```sql
SELECT id, email, full_name, role, google_id, created_at
FROM users
ORDER BY created_at DESC
LIMIT 5;
```

---

## Troubleshooting

### "redirect_uri_mismatch" Error
**Problem:** The redirect URI doesn't match what's configured in Google Cloud Console

**Solution:**
1. Go to Google Cloud Console > Credentials
2. Ensure `http://localhost:8080/oauth-callback.html` is in Authorized Redirect URIs
3. Wait 5 minutes for changes to propagate
4. Try again

### "Invalid token" or 401 Unauthorized
**Problem:** JWT token is invalid or expired

**Solution:**
- Verify `JWT_SECRET` is set in your backend environment
- Check token hasn't expired (7 days by default)
- Try logging in again to get a fresh token

### "GOOGLE_CLIENT_ID is not set" Error
**Problem:** Backend can't find Google OAuth credentials

**Solution:**
- Verify environment variables are set before starting backend
- Restart your backend application
- Check `application.yml` has correct property names

### CORS Errors
**Problem:** Browser blocking requests due to CORS policy

**Solution:**
- Ensure your backend CORS configuration allows `http://localhost:8080`
- Check `CorsConfig.java` includes your test client origin

### Token Exchange Failed
**Problem:** Backend can't exchange authorization code for token

**Solution:**
1. Verify `GOOGLE_CLIENT_SECRET` is set correctly
2. Check backend logs for specific error
3. Ensure authorization code hasn't expired (use it immediately)
4. Verify Google+ API is enabled in Google Cloud Console

---

## Advanced Testing

### Test with Different Users
1. Logout from test client
2. Login with a different Google account
3. Verify new user is created in database

### Test Admin Auto-Assignment
1. Add your email to `ADMIN_EMAILS` environment variable:
   ```bash
   set ADMIN_EMAILS=your-email@gmail.com
   ```
2. Restart backend
3. Login via OAuth
4. Verify you receive ADMIN role automatically

### Test Role Selection Flow
1. Login with a new Google account (not in admin list)
2. Verify `hasSelectedRole: false` in response
3. Call `/api/auth/role` to select HOST or RESIDENT
4. Verify role is updated
5. Try changing role again (should fail)

### Test JWT Token Expiration
1. Get a token from login
2. Decode it at https://jwt.io
3. Check `exp` claim (expiration timestamp)
4. Verify it's 7 days from `iat` (issued at)

---

## Next Steps

Once OAuth is working:

1. **Deploy to production** with real domain redirect URIs
2. **Set up frontend integration** using the same OAuth flow
3. **Implement refresh token logic** for long-lived sessions
4. **Add token blacklist** for logout functionality
5. **Monitor OAuth failures** in production logs

---

## Files Created

- `oauth-test-client.html` - Main test client UI
- `oauth-callback.html` - OAuth callback handler
- `OAUTH_TESTING_GUIDE.md` - This guide

## Support

If you encounter issues:
1. Check backend logs for detailed error messages
2. Verify all environment variables are set
3. Ensure Google Cloud Console is configured correctly
4. Check database connectivity
