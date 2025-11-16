# Complete Guide: Setting Up Google OAuth 2.0 in Google Cloud Platform

## Step 1: Create or Select a Google Cloud Project

1. **Go to Google Cloud Console**
   - Navigate to https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click the project dropdown at the top of the page (next to "Google Cloud")
   - Click "NEW PROJECT" button
   - **Project Name:** `RoomPilot` (or your preferred name)
   - **Organization:** Leave as "No organization" (unless you have one)
   - Click **CREATE**
   - Wait for the project to be created (takes ~30 seconds)
   - Select the new project from the dropdown

## Step 2: Enable Required APIs

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" > "Library"
   - Or use the search bar at the top: type "API Library"

2. **Enable Google+ API** (Required for OAuth user info)
   - In the API Library search box, type: `Google+ API`
   - Click on "Google+ API" from the results
   - Click the blue **ENABLE** button
   - Wait for it to enable (~10 seconds)

3. **Enable People API** (Optional but recommended)
   - Go back to API Library
   - Search for: `People API`
   - Click on "Google People API"
   - Click **ENABLE**

## Step 3: Configure OAuth Consent Screen

This is what users see when they authorize your app.

1. **Go to OAuth Consent Screen**
   - Left sidebar: "APIs & Services" > "OAuth consent screen"
   - Or search: "OAuth consent screen"

2. **Select User Type**
   - Choose **External** (for testing with any Google account)
   - Click **CREATE**

3. **Fill Out App Information** (Page 1 of 4)

   **App Information:**
   - **App name:** `RoomPilot` (what users see during login)
   - **User support email:** Your email address (dropdown)
   - **App logo:** (Optional - skip for now)

   **App Domain:**
   - **Application home page:** `http://localhost:5173` (for development)
   - **Application privacy policy link:** (Optional - leave blank for dev)
   - **Application terms of service link:** (Optional - leave blank for dev)

   **Authorized Domains:**
   - Leave blank for now (only needed for production domains)

   **Developer Contact Information:**
   - **Email addresses:** Your email address

   Click **SAVE AND CONTINUE**

4. **Scopes** (Page 2 of 4)
   - Click **ADD OR REMOVE SCOPES**
   - In the filter box, search for these scopes and check them:
     - `openid`
     - `email`
     - `profile`
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Click **UPDATE**
   - Click **SAVE AND CONTINUE**

5. **Test Users** (Page 3 of 4)
   - Click **ADD USERS**
   - Add your Gmail addresses (for testing):
     - Your personal Gmail
     - Any other test accounts
     - Admin emails you want to test
   - Click **ADD**
   - Click **SAVE AND CONTINUE**

6. **Summary** (Page 4 of 4)
   - Review your settings
   - Click **BACK TO DASHBOARD**

## Step 4: Create OAuth 2.0 Credentials

1. **Go to Credentials Page**
   - Left sidebar: "APIs & Services" > "Credentials"
   - Or search: "Credentials"

2. **Create OAuth Client ID**
   - Click **+ CREATE CREDENTIALS** (top of page)
   - Select **OAuth client ID**

3. **Configure OAuth Client**

   **Application type:**
   - Select **Web application**

   **Name:**
   - Enter: `RoomPilot Web Client` (or any name you prefer)

   **Authorized JavaScript origins:**
   - Click **+ ADD URI**
   - Add: `http://localhost:5173` (your frontend URL)
   - Click **+ ADD URI** again
   - Add: `http://localhost:8080` (your backend URL)

   **Authorized redirect URIs:** (CRITICAL - must be exact)
   - Click **+ ADD URI**
   - Add: `http://localhost:8080/api/auth/google/callback` (backend callback)
   - Click **+ ADD URI** again
   - Add: `http://localhost:5173/auth/callback` (frontend callback)

   **Important Notes:**
   - URLs must be **exact** - no trailing slashes
   - Must include `http://` prefix
   - Port numbers matter
   - Case sensitive

   Click **CREATE**

4. **Save Your Credentials**
   - A popup appears with your credentials
   - **Client ID:** Copy this (looks like: `123456789-abcdef.apps.googleusercontent.com`)
   - **Client Secret:** Copy this (looks like: `GOCSPX-abc123xyz`)
   - Click **DOWNLOAD JSON** (optional - saves credentials file)
   - Click **OK**

## Step 5: Configure Your Application

### Backend Configuration (`.env.local` in project root)

Create or update this file in your **project root** (not in backend folder):

```bash
# JWT Configuration
JWT_SECRET=<generate-this-below>

# Google OAuth Configuration
GOOGLE_CLIENT_ID=<paste-your-client-id-here>
GOOGLE_CLIENT_SECRET=<paste-your-client-secret-here>

# Admin Email Whitelist (comma-separated, no spaces)
ADMIN_EMAILS=your-email@gmail.com,admin@example.com

# Development Configuration
ENVIRONMENT=development
ENABLE_DEV_AUTH=true

# Database (keep existing)
DATABASE_URL=jdbc:postgresql://ep-autumn-tree-a4hqcdbz-pooler.us-east-1.aws.neon.tech/roompilot-dev?user=neondb_owner&password=npg_S7jDwyCFUn6i&sslmode=require&channel_binding=require
```

**Generate JWT_SECRET:**
```bash
# Run this command in terminal to generate a secure secret:
openssl rand -base64 64

# Copy the output and paste it as JWT_SECRET value
```

### Frontend Configuration (`frontend/.env.local`)

Create this file in the `frontend` folder:

```bash
# API Configuration
VITE_API_URL=http://localhost:8080

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=<paste-your-client-id-here>

# OAuth Redirect URI
VITE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
```

**Note:** Use the **same Client ID** for both backend and frontend.

## Step 6: Verify Configuration

Run these commands to check your setup:

```bash
# Check backend config
cd /path/to/roompilot
grep "GOOGLE_CLIENT_ID" .env.local

# Check frontend config
grep "VITE_GOOGLE_CLIENT_ID" frontend/.env.local
```

Both should show your Client ID (not the placeholder text).

## Step 7: Test the OAuth Flow

### Start Backend
```bash
cd /path/to/roompilot
./start-backend.sh
```

### Start Frontend (in another terminal)
```bash
cd /path/to/roompilot
./start-frontend.sh
```

### Test Login Flow

1. **Open browser:** http://localhost:5173/login
2. **Click "Sign in with Google"**
3. **You should see Google's consent screen with:**
   - App name: "RoomPilot" (or whatever you named it)
   - Scopes: Email, Profile
   - Your Google accounts listed
4. **Select an account and click "Allow"**
5. **You should be redirected to:**
   - If first-time user → `/onboarding/role-selection` (select Host or Resident)
   - If admin email → `/admin/dashboard`
   - If returning user → Your dashboard based on role

## Common Issues & Troubleshooting

### Issue 1: "Error 400: redirect_uri_mismatch"

**Problem:** The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution:**
- Go back to Google Cloud Console > Credentials
- Edit your OAuth client
- Verify these exact URIs are listed:
  - `http://localhost:8080/api/auth/google/callback`
  - `http://localhost:5173/auth/callback`
- **No trailing slashes!**
- Save and try again

### Issue 2: "Access blocked: This app's request is invalid"

**Problem:** OAuth consent screen not properly configured.

**Solution:**
- Go to OAuth consent screen
- Make sure you added your email to "Test users"
- Verify app status is not "Needs verification"

### Issue 3: "Error 401: invalid_client"

**Problem:** Client ID or Secret is incorrect.

**Solution:**
- Go to Credentials > OAuth 2.0 Client IDs
- Click your client name
- Copy the Client ID and Secret again
- Update both `.env.local` files
- Restart backend

### Issue 4: Frontend gets "CORS error"

**Problem:** Backend CORS not allowing frontend origin.

**Solution:**
- Check backend logs for CORS errors
- Verify frontend URL is `http://localhost:5173` (check port)
- Backend should already have CORS configured for this

### Issue 5: "Redirect loop" or stuck on callback page

**Problem:** Token not being stored or parsed correctly.

**Solution:**
- Open browser DevTools > Console
- Look for JavaScript errors
- Check Application > Local Storage > `http://localhost:5173`
- Should see a `token` key with JWT value

### Issue 6: "Unauthorized" errors when accessing API

**Problem:** JWT token not being sent or validated correctly.

**Solution:**
- Check browser DevTools > Network tab
- Click on an API request
- Look for `Authorization` header with `Bearer <token>`
- If missing, token not being stored/retrieved correctly
- Check backend logs for JWT validation errors

## Quick Test: Development Auth (Bypass Google)

While setting up OAuth, you can test the app using development authentication:

```bash
# Test backend dev auth endpoint
curl -X POST http://localhost:8080/api/auth/dev/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "role": "HOST"
  }'

# You should get a response with a JWT token
```

This creates a test user without needing Google OAuth. The response will look like:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "role": "HOST",
    ...
  },
  "hasSelectedRole": true
}
```

## Production Setup (Later)

When deploying to production, you'll need to:

1. **Update OAuth Client:**
   - Go to Google Cloud Console > Credentials
   - Edit your OAuth client
   - Add production domain to Authorized JavaScript origins:
     - `https://yourdomain.com`
   - Add production redirect URI:
     - `https://yourdomain.com/auth/callback`
     - `https://api.yourdomain.com/api/auth/google/callback`
   - Keep localhost URIs for local testing

2. **Update Environment Variables:**
   - Production backend `.env`:
     ```bash
     JWT_SECRET=<new-production-secret>
     GOOGLE_CLIENT_ID=<same-client-id>
     GOOGLE_CLIENT_SECRET=<same-client-secret>
     ADMIN_EMAILS=<production-admin-emails>
     ENVIRONMENT=production
     ENABLE_DEV_AUTH=false
     ```
   - Production frontend `.env`:
     ```bash
     VITE_API_URL=https://api.yourdomain.com
     VITE_GOOGLE_CLIENT_ID=<same-client-id>
     VITE_OAUTH_REDIRECT_URI=https://yourdomain.com/auth/callback
     ```

3. **Publish OAuth App:**
   - If using "External" user type, submit for Google verification
   - Or keep as "Testing" with limited test users (max 100 users)
   - To publish:
     - Go to OAuth consent screen
     - Click "PUBLISH APP"
     - Fill out verification questionnaire
     - Wait for Google approval (can take days/weeks)

4. **Security Checklist:**
   - [ ] Use HTTPS everywhere in production
   - [ ] Generate new JWT_SECRET for production (never reuse dev secret)
   - [ ] Set `ENABLE_DEV_AUTH=false` in production
   - [ ] Use environment-specific admin emails
   - [ ] Enable CORS only for production domain
   - [ ] Set up proper logging and monitoring
   - [ ] Enable rate limiting on auth endpoints
   - [ ] Set up alerts for auth failures

## Summary Checklist

Use this checklist to track your OAuth setup progress:

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Enabled People API (optional)
- [ ] Configured OAuth Consent Screen
- [ ] Added test users to consent screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Saved Client ID and Client Secret
- [ ] Updated backend `.env.local` with credentials
- [ ] Updated frontend `.env.local` with Client ID
- [ ] Generated JWT_SECRET with `openssl rand -base64 64`
- [ ] Added your email to ADMIN_EMAILS (if you want admin access)
- [ ] Started backend server
- [ ] Started frontend server
- [ ] Tested login flow in browser
- [ ] Successfully authenticated and selected role
- [ ] Verified token stored in localStorage
- [ ] Verified API calls include Authorization header
- [ ] Tested logout flow
- [ ] Tested role-based access control

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [JWT.io - Decode JWT tokens](https://jwt.io/)
- [RoomPilot Authentication Spec](../specs/2_auth-login.md)

## Getting Help

If you encounter issues not covered in this guide:

1. Check backend logs: `./start-backend.sh` output
2. Check frontend console: Browser DevTools > Console
3. Check network requests: Browser DevTools > Network tab
4. Verify environment variables are loaded correctly
5. Try development auth to isolate OAuth vs app issues
6. Review Google Cloud Console for API errors

---

**Last Updated:** 2025-11-16
**Version:** 1.0
