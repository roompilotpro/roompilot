# Authentication & User Management Specification

**Version:** 1.1
**Status:** Draft
**Priority:** P0 (Critical - MVP Blocker)
**Estimated Effort:** 1-2 weeks
**Last Updated:** 2024-11-15

---

## Table of Contents
1. [Overview](#overview)
2. [User Flows](#user-flows)
3. [Technical Architecture](#technical-architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Development Authentication (Testing Only)](#development-authentication-testing-only)
7. [Frontend Implementation](#frontend-implementation)
8. [Security Considerations](#security-considerations)
9. [Edge Cases & Error Handling](#edge-cases--error-handling)
10. [Testing Requirements](#testing-requirements)
11. [Future Enhancements](#future-enhancements)

---

## Overview

### Goals
- Implement Google OAuth 2.0 as the **only** authentication method
- No password storage, no custom auth - just Google sign-in
- Support three user roles: **Host**, **Resident**, and **Admin**
- Role selection happens after first successful login (except for admins)
- **Admin auto-assignment:** Admins are automatically identified by hardcoded email addresses
- Secure session management with JWT tokens
- Seamless user experience with automatic profile data population

### Important: Landing Page vs Login Page

**Architecture:**
```
Public Landing Page (/)          Login Page (/login)
┌─────────────────────┐          ┌─────────────────────┐
│                     │          │                     │
│  RoomPilot Landing  │   NO     │  Google OAuth       │
│  Marketing Content  │  LINK    │  Sign In            │
│                     │  ───X──> │                     │
│  • Features         │          │  "Authorized users  │
│  • Benefits         │          │   only"             │
│  • Contact          │          │                     │
└─────────────────────┘          └─────────────────────┘
        ↑                                 ↑
        │                                 │
    Public access                  Direct URL access only
                                   (bookmark/shared link)
```

**Key Points:**
- **Landing page (`/`)**: Public marketing page - remains unchanged, NO link to login (product not launched yet)
- **Login page (`/login`)**: Separate authentication page - accessed directly via URL only
- Users must navigate to `/login` directly (bookmark, direct link, shared internally, etc.)
- Login page is for internal testing and authorized users only during pre-launch
- After product launch, you can add a "Sign In" link to the landing page

**Why This Architecture?**
- Allows public to see marketing page before launch
- Enables team/investors to test authentication internally
- Prevents unauthorized early access attempts
- Clean separation of concerns

### Why Google OAuth Only?
1. **Security:** No password storage = no password breaches
2. **UX:** One-click sign-in, no registration forms
3. **Trust:** Users trust Google authentication
4. **Simplicity:** No "forgot password" flows, no email verification
5. **Privacy:** We only store what we need (email, name, Google ID)

### iOS Safari Compatibility

**Critical Requirement:** Our authentication system MUST work on iOS Safari, which blocks third-party cookies due to Intelligent Tracking Prevention (ITP).

**Solution:** Authorization header-only approach with URL token extraction
- ✅ Tokens passed via URL on OAuth callback redirect
- ✅ Frontend extracts tokens from URL → stores in localStorage
- ✅ All requests use `Authorization: Bearer {token}` header
- ✅ Works on iOS, Android, and Desktop browsers
- ✅ No cookies needed (avoids Safari ITP issues)

**Security Trade-offs:**
- ⚠️ localStorage is XSS-vulnerable (unlike httpOnly cookies)
- ✅ Mitigated by: Content Security Policy + Input sanitization
- ✅ Tokens cleaned from URL immediately (no browser history leaks)

### Non-Goals (Explicitly Out of Scope)
- Email/password authentication
- Social auth with Facebook, Apple, etc. (maybe later)
- Two-factor authentication (Google handles this)
- Password reset flows
- Email verification flows

---

## User Flows

### Flow 1: First-Time User (New Account)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant G as Google OAuth
    participant DB as Database

    U->>FE: Navigate directly to /login
    FE->>U: Show login page with "Sign in with Google"
    U->>FE: Click "Sign in with Google"
    FE->>G: Redirect to Google OAuth consent screen
    G->>U: Show Google account selection
    U->>G: Select account & grant permissions
    G->>FE: Redirect with authorization code
    FE->>BE: POST /api/auth/google/callback (code)
    BE->>G: Exchange code for tokens
    G->>BE: Return access_token, id_token, user info
    BE->>DB: Check if user exists (by google_id)
    DB->>BE: User not found
    BE->>DB: Create new user (google_id, email, name, picture)
    BE->>BE: Generate JWT token
    BE->>FE: Return JWT + user data (has_selected_role: false)
    FE->>FE: Store JWT in localStorage
    FE->>U: Redirect to /onboarding/role-selection
    U->>FE: Select role (Host or Resident)
    FE->>BE: POST /api/users/me/role (role: "HOST" or "RESIDENT")
    BE->>DB: Update user.role
    BE->>FE: Return updated user
    FE->>U: Redirect to appropriate dashboard

    Note over U,DB: First-time login with role selection
```

### Flow 2: Returning User (Existing Account)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant G as Google OAuth
    participant DB as Database

    U->>FE: Navigate directly to /login
    U->>FE: Click "Sign in with Google"
    FE->>G: Redirect to Google OAuth
    G->>U: Show account selection
    U->>G: Select account (already authenticated)
    G->>FE: Redirect with authorization code
    FE->>BE: POST /api/auth/google/callback (code)
    BE->>G: Exchange code for tokens
    G->>BE: Return user info
    BE->>DB: Find user by google_id
    DB->>BE: User found (role already set)
    BE->>BE: Generate JWT token
    BE->>FE: Return JWT + user data
    FE->>FE: Store JWT in localStorage
    FE->>U: Redirect based on role

    alt User is HOST
        FE->>U: Redirect to /host/dashboard
    else User is RESIDENT
        FE->>U: Redirect to /resident/dashboard
    end

    Note over U,DB: Existing user - automatic redirect to dashboard
```

### Flow 3: Session Validation (Page Load)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    U->>FE: Visit any protected route
    FE->>FE: Check for JWT in localStorage

    alt JWT exists
        FE->>BE: GET /api/auth/me (with JWT in header)
        BE->>BE: Validate JWT signature & expiration

        alt JWT valid
            BE->>DB: Get user by ID from JWT
            DB->>BE: Return user data
            BE->>FE: Return user data
            FE->>U: Show requested page
        else JWT invalid/expired
            BE->>FE: 401 Unauthorized
            FE->>FE: Clear localStorage
            FE->>U: Redirect to /login
        end
    else No JWT
        FE->>U: Redirect to /login
    end
```

### Flow 4: Logout

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend

    U->>FE: Click "Logout"
    FE->>BE: POST /api/auth/logout (with JWT)
    BE->>BE: Add JWT to blacklist (optional)
    BE->>FE: 200 OK
    FE->>FE: Clear localStorage (JWT, user data)
    FE->>U: Redirect to /login
```

### Flow 5: Admin First-Time Login (Auto-Assignment)

```mermaid
sequenceDiagram
    participant A as Admin User
    participant FE as Frontend
    participant BE as Backend
    participant G as Google OAuth
    participant DB as Database
    participant ENV as Environment Config

    A->>FE: Navigate directly to /login
    A->>FE: Click "Sign in with Google"
    FE->>G: Redirect to Google OAuth
    G->>A: Show Google account selection
    A->>G: Select admin account & grant permissions
    G->>FE: Redirect with authorization code
    FE->>BE: POST /api/auth/google/callback (code)
    BE->>G: Exchange code for tokens
    G->>BE: Return user info (email: admin@company.com)
    BE->>ENV: Check if email in ADMIN_EMAILS list
    ENV->>BE: Email found in admin list
    BE->>DB: Check if user exists (by google_id)

    alt User Not Found
        DB->>BE: User not found
        BE->>DB: Create new user with role='ADMIN'
        BE->>BE: Log admin account creation
    else User Exists
        DB->>BE: User found
        BE->>BE: Verify role is 'ADMIN'
    end

    BE->>BE: Generate JWT with role='ADMIN'
    BE->>FE: Return JWT + user data (role: "ADMIN", hasSelectedRole: true)
    FE->>FE: Store JWT in localStorage
    FE->>A: Redirect to /admin/dashboard (skip role selection)

    Note over A,ENV: Admin auto-assigned based on email whitelist
```

**Key Differences for Admin Flow:**
1. **No role selection:** Admin role is auto-assigned on first login
2. **Email whitelist:** Email must be in `ADMIN_EMAILS` environment variable
3. **Automatic redirect:** Goes directly to `/admin/dashboard`
4. **Audit logging:** Admin account creation is logged for security
5. **Immutable role:** Admin role cannot be changed once set

---

## Technical Architecture

### Google OAuth 2.0 Configuration

**OAuth Flow:** Authorization Code Flow (most secure for web apps)

**Google Cloud Console Setup:**
1. Create project: `roompilot-production`
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Configure authorized redirect URIs:
   - Development: `http://localhost:5173/auth/google/callback`
   - Production: `https://roompilot.pro/auth/google/callback`

**Scopes Required:**
- `openid` - Basic OpenID Connect
- `profile` - User's name and profile picture
- `email` - User's email address

**Environment Variables:**
```bash
# Backend (.env)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/api/auth/google/callback
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRATION=7d

# Admin email whitelist (comma-separated, use Gmail addresses)
ADMIN_EMAILS=your.email@gmail.com,team.member@gmail.com

# Development Authentication (NEVER in production)
ENVIRONMENT=development              # Set to 'production' in prod
ENABLE_DEV_AUTH=true                 # NEVER set in production

# Frontend (.env.local)
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_API_URL=http://localhost:8080
```

**Admin Email Configuration:**
- Emails are hardcoded in the `ADMIN_EMAILS` environment variable
- **Use Gmail addresses** (e.g., `yourname@gmail.com,teammate@gmail.com`)
- Multiple emails separated by commas
- No spaces between emails recommended
- Case-insensitive matching (emails normalized to lowercase)
- Changes require backend restart
- **Security:** Never expose this list publicly or commit to public repos

### JWT Token Structure

**Token Payload:**
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",  // User UUID
  "email": "john@example.com",
  "role": "HOST",  // Can be "HOST", "RESIDENT", or "ADMIN"
  "iat": 1699564800,  // Issued at (Unix timestamp)
  "exp": 1700169600   // Expires at (Unix timestamp)
}
```

**Token Lifespan:** 7 days (configurable)

**Storage:**
- Frontend: `localStorage.setItem('authToken', jwt)`
- Backend: Stateless (no session storage needed)

**Transmission:**
- Header: `Authorization: Bearer <token>`

### Session Management Strategy

**Approach:** Stateless JWT-based authentication

**Advantages:**
- No server-side session storage
- Horizontally scalable
- Works across multiple backend instances
- Simple to implement

**Security Measures:**
1. **HTTPS only** in production (tokens never sent over HTTP)
2. **JWT signature verification** on every request
3. **Expiration validation** (7-day max lifespan)
4. **Token refresh** - user must re-authenticate after 7 days
5. **Logout blacklist** (optional) - store invalidated tokens in Redis

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Google OAuth data
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    profile_picture_url TEXT,

    -- User data
    phone VARCHAR(20),
    role VARCHAR(20),  -- NULL, 'HOST', 'RESIDENT', or 'ADMIN'
    is_dev_user BOOLEAN NOT NULL DEFAULT FALSE,  -- Flag for dev-created test users

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Soft delete
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT users_role_check CHECK (role IN ('HOST', 'RESIDENT', 'ADMIN'))
);

COMMENT ON COLUMN users.is_dev_user IS 'Flags users created via dev auth system (for testing only - should be FALSE in production)';

-- Indexes
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_dev_user ON users(is_dev_user);  -- For filtering test users
CREATE INDEX idx_users_created_at ON users(created_at);
```

### Token Blacklist Table (Optional - for logout)

```sql
CREATE TABLE token_blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(64) NOT NULL,  -- SHA-256 hash of JWT
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    blacklisted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT token_blacklist_unique UNIQUE (token_hash)
);

-- Index for fast lookup
CREATE INDEX idx_token_blacklist_hash ON token_blacklist(token_hash);

-- Auto-cleanup old tokens (run daily)
-- DELETE FROM token_blacklist WHERE expires_at < NOW();
```

### Flyway Migration

**File:** `V1__create_users_table.sql`

```sql
-- V1__create_users_table.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    profile_picture_url TEXT,
    phone VARCHAR(20),
    role VARCHAR(20),
    is_dev_user BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT users_role_check CHECK (role IN ('HOST', 'RESIDENT', 'ADMIN'))
);

COMMENT ON COLUMN users.is_dev_user IS 'Flags users created via dev auth system (for testing only)';

CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_dev_user ON users(is_dev_user);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Token blacklist (optional)
CREATE TABLE token_blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    blacklisted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT token_blacklist_unique UNIQUE (token_hash)
);

CREATE INDEX idx_token_blacklist_hash ON token_blacklist(token_hash);
```

---

## API Endpoints

### Authentication Endpoints

#### 1. Initiate Google OAuth Flow

**Endpoint:** `GET /api/auth/google`

**Description:** Redirects user to Google OAuth consent screen

**Request:**
```http
GET /api/auth/google HTTP/1.1
Host: api.roompilot.com
```

**Response:** HTTP 302 Redirect to Google
```
Location: https://accounts.google.com/o/oauth2/v2/auth?
  client_id=xxx&
  redirect_uri=http://localhost:8080/api/auth/google/callback&
  response_type=code&
  scope=openid%20profile%20email&
  state=random-csrf-token
```

**Implementation Notes:**
- Generate random `state` parameter for CSRF protection
- Store `state` in session or temporary cache
- Include all required scopes

---

#### 2. Google OAuth Callback

**Endpoint:** `GET /api/auth/google/callback`

**Description:** Handles Google OAuth redirect, exchanges code for tokens, creates/updates user, **redirects back to frontend with tokens in URL**

**Request:**
```http
GET /api/auth/google/callback?code=4/0AX4XfWh...&state=random-csrf-token HTTP/1.1
Host: api.roompilot.com
```

**Response:** HTTP 302 Redirect to Frontend with Tokens
```
Location: https://roompilot.pro/dashboard?auth_success=true&access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Why Tokens in URL?**
- **iOS Safari compatibility:** iOS blocks third-party cookies, so we can't rely on Set-Cookie headers
- **Universal approach:** Works on all platforms (iOS, Android, Desktop)
- **Frontend extraction:** JavaScript can read URL params and store in localStorage
- **Security:** Tokens are immediately cleaned from URL after extraction (no history leak)

**Error Responses:**
```json
// 400 Bad Request - Invalid code
{
  "error": "INVALID_AUTH_CODE",
  "message": "The authorization code is invalid or expired"
}

// 400 Bad Request - CSRF mismatch
{
  "error": "INVALID_STATE",
  "message": "State parameter does not match. Possible CSRF attack."
}

// 500 Internal Server Error - Google API failure
{
  "error": "OAUTH_ERROR",
  "message": "Failed to authenticate with Google"
}
```

**Backend Logic:**
```java
@GetMapping("/auth/google/callback")
public ResponseEntity<?> handleGoogleCallback(
    @RequestParam String code,
    @RequestParam String state,
    HttpServletResponse response
) {
    // 1. Validate state parameter (CSRF protection)
    if (!validateState(state)) {
        throw new InvalidStateException("CSRF validation failed");
    }

    // 2. Exchange code for Google tokens
    GoogleTokenResponse tokenResponse = exchangeCodeForTokens(code);

    // 3. Get user info from Google
    GoogleUserInfo googleUser = getUserInfoFromGoogle(tokenResponse.getAccessToken());

    // 4. Check if email is in admin whitelist
    boolean isAdminEmail = isEmailInAdminList(googleUser.getEmail());

    // 5. Find or create user
    User user = userRepository.findByGoogleId(googleUser.getId())
        .orElseGet(() -> createNewUser(googleUser, isAdminEmail));

    // 6. If existing user and is admin email, ensure role is ADMIN
    if (isAdminEmail && user.getRole() != "ADMIN") {
        user.setRole("ADMIN");
        log.warn("Updated existing user {} to ADMIN role", user.getEmail());
    }

    // 7. Update last login
    user.setLastLogin(Instant.now());
    userRepository.save(user);

    // 8. Generate JWT tokens
    String accessToken = jwtService.generateAccessToken(user);
    String refreshToken = jwtService.generateRefreshToken(user);

    // 9. Build redirect URL with tokens (iOS Safari compatibility)
    String redirectUrl = String.format(
        "%s/dashboard?auth_success=true&access_token=%s&refresh_token=%s",
        frontendUrl,
        accessToken,
        refreshToken
    );

    // 10. Redirect to frontend with tokens in URL
    HttpHeaders headers = new HttpHeaders();
    headers.setLocation(URI.create(redirectUrl));

    log.info("OAuth callback successful for user: {}, redirecting to: {}",
        user.getEmail(), frontendUrl + "/dashboard");

    return new ResponseEntity<>(headers, HttpStatus.FOUND);
}

// Helper method to check admin emails
private boolean isEmailInAdminList(String email) {
    String adminEmailsEnv = environment.getProperty("ADMIN_EMAILS", "");
    List<String> adminEmails = Arrays.stream(adminEmailsEnv.split(","))
        .map(String::trim)
        .map(String::toLowerCase)
        .collect(Collectors.toList());

    return adminEmails.contains(email.toLowerCase());
}

// Updated createNewUser to handle admin role
private User createNewUser(GoogleUserInfo googleUser, boolean isAdmin) {
    User user = User.builder()
        .googleId(googleUser.getId())
        .email(googleUser.getEmail())
        .fullName(googleUser.getName())
        .profilePictureUrl(googleUser.getPicture())
        .role(isAdmin ? "ADMIN" : null)  // Auto-assign ADMIN role
        .build();

    if (isAdmin) {
        log.info("Created new ADMIN user: {}", user.getEmail());
        auditService.logAdminAccountCreation(user);
    }

    return userRepository.save(user);
}
```

---

#### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Description:** Returns current authenticated user's data

**Request:**
```http
GET /api/auth/me HTTP/1.1
Host: api.roompilot.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** 200 OK
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "fullName": "John Doe",
  "profilePictureUrl": "https://lh3.googleusercontent.com/a/...",
  "phone": null,
  "role": "HOST",
  "hasSelectedRole": true,
  "createdAt": "2024-11-01T08:15:00Z",
  "lastLogin": "2024-11-15T10:30:00Z"
}
```

**Error Responses:**
```json
// 401 Unauthorized - Missing token
{
  "error": "MISSING_TOKEN",
  "message": "Authorization header is required"
}

// 401 Unauthorized - Invalid token
{
  "error": "INVALID_TOKEN",
  "message": "Token is invalid or expired"
}

// 404 Not Found - User deleted
{
  "error": "USER_NOT_FOUND",
  "message": "User account not found"
}
```

---

#### 4. Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Invalidates the current JWT token

**Request:**
```http
POST /api/auth/logout HTTP/1.1
Host: api.roompilot.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** 200 OK
```json
{
  "message": "Successfully logged out"
}
```

**Implementation (Optional Blacklist):**
```java
public void logout(String token) {
    // Hash the token
    String tokenHash = hashToken(token);

    // Get token expiration from JWT
    Date expiresAt = jwtService.getExpirationDate(token);

    // Add to blacklist
    TokenBlacklist blacklistedToken = TokenBlacklist.builder()
        .tokenHash(tokenHash)
        .expiresAt(expiresAt.toInstant())
        .build();

    tokenBlacklistRepository.save(blacklistedToken);
}

// In JWT validation filter
public boolean isTokenBlacklisted(String token) {
    String tokenHash = hashToken(token);
    return tokenBlacklistRepository.existsByTokenHash(tokenHash);
}
```

---

### User Management Endpoints

#### 5. Set User Role (First-Time Onboarding)

**Endpoint:** `POST /api/users/me/role`

**Description:** Sets the user's role (HOST or RESIDENT) - can only be done once

**Request:**
```http
POST /api/users/me/role HTTP/1.1
Host: api.roompilot.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "role": "HOST"
}
```

**Response:** 200 OK
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "HOST",
  "hasSelectedRole": true
}
```

**Error Responses:**
```json
// 400 Bad Request - Invalid role
{
  "error": "INVALID_ROLE",
  "message": "Role must be either HOST or RESIDENT"
}

// 409 Conflict - Role already set
{
  "error": "ROLE_ALREADY_SET",
  "message": "User role has already been set and cannot be changed"
}
```

**Validation:**
```java
public User setUserRole(UUID userId, String role) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException());

    // Check if role already set
    if (user.getRole() != null) {
        throw new RoleAlreadySetException();
    }

    // Validate role - ADMIN cannot be set via this endpoint
    if (!role.equals("HOST") && !role.equals("RESIDENT")) {
        throw new InvalidRoleException("Role must be either HOST or RESIDENT. ADMIN role is auto-assigned.");
    }

    // Additional security: verify user email is NOT in admin list
    // (admins should already have role assigned automatically)
    if (isEmailInAdminList(user.getEmail())) {
        throw new UnauthorizedOperationException("Admin users cannot manually select roles");
    }

    user.setRole(role);
    return userRepository.save(user);
}
```

---

#### 6. Update User Profile

**Endpoint:** `PATCH /api/users/me`

**Description:** Update user's profile information

**Request:**
```http
PATCH /api/users/me HTTP/1.1
Host: api.roompilot.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "fullName": "John Smith",
  "phone": "+1-555-123-4567"
}
```

**Response:** 200 OK
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "fullName": "John Smith",
  "phone": "+1-555-123-4567",
  "role": "HOST",
  "updatedAt": "2024-11-15T11:00:00Z"
}
```

**Validation:**
- `fullName`: 2-255 characters
- `phone`: Valid phone format (E.164 recommended)
- Cannot update: `email`, `googleId`, `role`, `id`

---

## Development Authentication (Testing Only)

### Overview

**Purpose:** Bypass OAuth flow for rapid local development and automated testing

**What This Provides:**
- Instant authentication as any user (no OAuth flow)
- Create test users on-demand
- Switch between roles seamlessly
- Enable automated testing in CI/CD
- 10x faster development iteration

**What This Is NOT:**
- ❌ Not a replacement for production authentication
- ❌ Not accessible in production (by design)
- ❌ Not a security vulnerability (when properly configured)
- ❌ Not enabled by default

### Security Architecture

**Multi-Layer Defense:**
```
┌──────────────────────────────────────────┐
│ Layer 1: Environment Check               │
│ • ENVIRONMENT != "production"            │
│ • Default: "production" (fail-safe)      │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ Layer 2: Explicit Enable Flag            │
│ • ENABLE_DEV_AUTH == "true"              │
│ • Default: "false" (fail-safe)           │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ Layer 3: 404 Response (Not 403)          │
│ • Returns 404 to hide endpoint existence │
│ • No information disclosure              │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ Layer 4: Audit Logging                   │
│ • Log ALL dev auth access                │
│ • Alert on production attempts           │
└──────────────────────────────────────────┘
```

### Security Guard Function

**Critical Component:** This function MUST be called at the start of every dev auth endpoint

**Java Implementation:**
```java
@Component
public class DevAuthGuard {

    @Value("${ENVIRONMENT:production}")
    private String environment;

    @Value("${ENABLE_DEV_AUTH:false}")
    private String enableDevAuth;

    private static final Logger log = LoggerFactory.getLogger(DevAuthGuard.class);

    /**
     * CRITICAL SECURITY FUNCTION
     * Prevents dev auth in production environments
     *
     * @throws ResponseStatusException with 404 status if blocked
     */
    public void checkDevAuthEnabled() {
        // Normalize to lowercase
        String env = environment.toLowerCase();
        String flag = enableDevAuth.toLowerCase();

        // Block if production OR flag not explicitly enabled
        if ("production".equals(env) || !"true".equals(flag)) {
            // Return 404 to avoid information disclosure
            // (don't reveal that endpoint exists)
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Not found"
            );
        }

        // Log warning in development
        log.warn("⚠️  DEV AUTHENTICATION ACCESS - Should never occur in production!");
    }

    /**
     * Check if dev auth is enabled (without throwing exception)
     */
    public boolean isDevAuthEnabled() {
        String env = environment.toLowerCase();
        String flag = enableDevAuth.toLowerCase();
        return !"production".equals(env) && "true".equals(flag);
    }
}
```

### Dev Auth Endpoints

#### 1. GET /api/auth/dev-users

**Purpose:** Return all users for dropdown selection

**Security:** Requires dev auth enabled

**Request:**
```http
GET /api/auth/dev-users HTTP/1.1
Host: api.roompilot.com
```

**Response:** 200 OK
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@test.com",
    "fullName": "Test Admin",
    "role": "ADMIN",
    "isActive": true,
    "isDevUser": true,
    "createdAt": "2024-11-15T10:00:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "email": "host@test.com",
    "fullName": "Test Host",
    "role": "HOST",
    "isActive": true,
    "isDevUser": true,
    "createdAt": "2024-11-15T10:00:00Z"
  }
]
```

**Response:** 404 Not Found (if dev auth disabled or production)
```json
{
  "error": "NOT_FOUND",
  "message": "Not found"
}
```

**Implementation:**
```java
@RestController
@RequestMapping("/api/auth")
public class DevAuthController {

    @Autowired
    private DevAuthGuard devAuthGuard;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dev-users")
    public ResponseEntity<List<DevUserResponse>> getDevUsers() {
        // Security check FIRST
        devAuthGuard.checkDevAuthEnabled();

        // Query all users, ordered by role then email
        List<User> users = userRepository.findAllByOrderByRoleAscEmailAsc();

        // Transform to response format
        List<DevUserResponse> response = users.stream()
            .map(this::toDevUserResponse)
            .collect(Collectors.toList());

        log.info("[DEV-AUTH] Returned {} users for dropdown", response.size());

        return ResponseEntity.ok(response);
    }

    private DevUserResponse toDevUserResponse(User user) {
        return DevUserResponse.builder()
            .id(user.getId().toString())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole())
            .isActive(user.getDeletedAt() == null)
            .isDevUser(user.getIsDevUser())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
```

#### 2. POST /api/auth/dev-create-user

**Purpose:** Create new test user on-demand

**Security:** Requires dev auth enabled

**Request:**
```http
POST /api/auth/dev-create-user HTTP/1.1
Host: api.roompilot.com
Content-Type: application/json

{
  "email": "newtest@example.com",
  "fullName": "New Test User",
  "role": "HOST"
}
```

**Response:** 201 Created
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "email": "newtest@example.com",
  "fullName": "New Test User",
  "role": "HOST",
  "isActive": true,
  "isDevUser": true,
  "createdAt": "2024-11-15T11:00:00Z"
}
```

**Response:** 404 Not Found (if dev auth disabled)

**Implementation:**
```java
@PostMapping("/dev-create-user")
public ResponseEntity<DevUserResponse> createDevUser(
    @RequestBody @Valid CreateDevUserRequest request
) {
    // Security check FIRST
    devAuthGuard.checkDevAuthEnabled();

    // Idempotency: check if user exists
    Optional<User> existing = userRepository.findByEmail(request.getEmail());
    if (existing.isPresent()) {
        log.info("[DEV-AUTH] User already exists: {}", request.getEmail());
        return ResponseEntity.ok(toDevUserResponse(existing.get()));
    }

    // Create user with is_dev_user flag
    User user = User.builder()
        .googleId("dev-" + UUID.randomUUID())  // Fake Google ID for dev users
        .email(request.getEmail())
        .fullName(request.getFullName())
        .role(request.getRole())
        .isDevUser(true)  // IMPORTANT: flag as test user
        .build();

    user = userRepository.save(user);

    log.info("[DEV-AUTH] Created test user: {} ({})", request.getEmail(), request.getRole());

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(toDevUserResponse(user));
}
```

**Request DTO:**
```java
@Data
public class CreateDevUserRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 2, max = 255)
    private String fullName;

    @NotNull
    @Pattern(regexp = "HOST|RESIDENT|ADMIN")
    private String role;
}
```

#### 3. POST /api/auth/dev-login

**Purpose:** Authenticate as any user without OAuth

**Security:** Requires dev auth enabled

**Request:**
```http
POST /api/auth/dev-login HTTP/1.1
Host: api.roompilot.com
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Alternative (by email):**
```json
{
  "email": "admin@test.com"
}
```

**Response:** 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@test.com",
    "fullName": "Test Admin",
    "profilePictureUrl": null,
    "role": "ADMIN",
    "hasSelectedRole": true,
    "createdAt": "2024-11-15T10:00:00Z",
    "lastLogin": "2024-11-15T12:00:00Z"
  },
  "isNewUser": false
}
```

**Response:** 404 Not Found (if dev auth disabled)
**Response:** 404 Not Found (if user not found)

**Implementation:**
```java
@PostMapping("/dev-login")
public ResponseEntity<AuthResponse> devLogin(
    @RequestBody @Valid DevLoginRequest request,
    HttpServletRequest httpRequest
) {
    // Security check FIRST
    devAuthGuard.checkDevAuthEnabled();

    // Find user by ID or email
    User user;
    if (request.getUserId() != null) {
        user = userRepository.findById(UUID.fromString(request.getUserId()))
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found"
            ));
    } else if (request.getEmail() != null) {
        user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found"
            ));
    } else {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "userId or email required"
        );
    }

    // Log authentication attempt
    log.warn(
        "[DEV-AUTH] Login as user_id={}, email={}, role={}",
        user.getId(),
        user.getEmail(),
        user.getRole()
    );

    // Generate JWT token (same format as OAuth)
    String jwt = jwtService.generateToken(user);

    // Update last login
    user.setLastLogin(Instant.now());
    userRepository.save(user);

    // Log authentication event (same as OAuth)
    authAuditService.logAuthEvent(
        user.getId(),
        "dev_login",
        httpRequest.getRemoteAddr(),
        httpRequest.getHeader("User-Agent")
    );

    log.info("[DEV-AUTH] Successfully authenticated {} as {}", user.getEmail(), user.getRole());

    // Return same structure as OAuth flow
    return ResponseEntity.ok(AuthResponse.builder()
        .token(jwt)
        .user(toUserResponse(user))
        .isNewUser(user.getRole() == null)
        .build());
}
```

**Request DTO:**
```java
@Data
public class DevLoginRequest {
    private String userId;  // UUID string
    private String email;

    @AssertTrue(message = "userId or email must be provided")
    public boolean isValid() {
        return userId != null || email != null;
    }
}
```

### Seed Script

**Purpose:** Create standard test users for consistent testing

**File:** `backend/scripts/seed_dev_users.sh`

```bash
#!/bin/bash

# Safety check
if [ "$ENVIRONMENT" = "production" ]; then
    echo "ERROR: Cannot seed dev users in production!"
    exit 1
fi

echo "Seeding development test users..."

# Admin user
curl -X POST http://localhost:8080/api/auth/dev-create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "fullName": "Test Admin",
    "role": "ADMIN"
  }'

# Host user
curl -X POST http://localhost:8080/api/auth/dev-create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "host@test.com",
    "fullName": "Test Host",
    "role": "HOST"
  }'

# Resident user
curl -X POST http://localhost:8080/api/auth/dev-create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "resident@test.com",
    "fullName": "Test Resident",
    "role": "RESIDENT"
  }'

echo ""
echo "✅ Test users seeded successfully"
echo ""
echo "Test Accounts:"
echo "  • admin@test.com     - ADMIN"
echo "  • host@test.com      - HOST"
echo "  • resident@test.com  - RESIDENT"
echo ""
echo "Navigate to http://localhost:5173/login to use dev login panel"
```

**Make executable:**
```bash
chmod +x backend/scripts/seed_dev_users.sh
```

### Environment Configuration

**Development (.env):**
```bash
ENVIRONMENT=development
ENABLE_DEV_AUTH=true
```

**Production (.env):**
```bash
ENVIRONMENT=production
# ENABLE_DEV_AUTH is NOT set (default: false)
```

**Deployment Checklist:**
- [ ] Verify `ENVIRONMENT=production` in production
- [ ] Verify `ENABLE_DEV_AUTH` is NOT set in production
- [ ] Test `/api/auth/dev-users` returns 404 in production
- [ ] Query for `is_dev_user=true` users in production (should be 0)
- [ ] Review audit logs for any dev auth attempts

---

## Frontend Implementation

### Technology Stack
- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** React Context API (for auth state)
- **Google OAuth:** `@react-oauth/google` package

### Project Structure

```
frontend/src/
├── auth/
│   ├── GoogleAuthProvider.jsx      # Google OAuth setup
│   ├── AuthContext.jsx             # Auth state management
│   ├── ProtectedRoute.jsx          # Route guard component
│   └── RoleRoute.jsx               # Role-based route guard
├── pages/
│   ├── LandingPage.jsx             # / (public marketing page, no login link)
│   ├── Login.jsx                   # /login (separate auth page)
│   ├── RoleSelection.jsx           # /onboarding/role-selection
│   ├── HostDashboard.jsx           # /host/dashboard
│   ├── ResidentDashboard.jsx       # /resident/dashboard
│   └── AdminDashboard.jsx          # /admin/dashboard
├── services/
│   ├── authService.js              # Auth API calls
│   └── tokenService.js             # Token storage & URL extraction (CRITICAL for iOS)
├── hooks/
│   └── useAuth.js                  # Custom auth hook
└── App.jsx                         # Main app with routes
```

### Token Service (CRITICAL for iOS Compatibility)

**File:** `services/tokenService.js`

This service handles token storage and URL extraction for iOS Safari compatibility.

```javascript
/**
 * Token Service for iOS Safari Compatibility
 *
 * CRITICAL: iOS Safari blocks third-party cookies, so we use:
 * 1. Tokens passed in URL on OAuth callback
 * 2. Extract tokens from URL
 * 3. Store in localStorage
 * 4. Clean URL immediately (security)
 */

const ACCESS_TOKEN_KEY = 'roompilot_access_token';
const REFRESH_TOKEN_KEY = 'roompilot_refresh_token';

export const tokenService = {
  /**
   * CRITICAL: Extract tokens from URL after OAuth redirect
   * This is THE KEY function for iOS compatibility
   *
   * OAuth callback redirects to:
   * /dashboard?auth_success=true&access_token=xxx&refresh_token=yyy
   *
   * This function:
   * 1. Checks for tokens in URL
   * 2. Stores them in localStorage
   * 3. Cleans URL to prevent token leaks in browser history
   */
  extractTokensFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const authSuccess = params.get('auth_success');

    // Only proceed if we have valid OAuth callback
    if (accessToken && refreshToken && authSuccess === 'true') {
      console.log('[TokenService] OAuth callback detected, extracting tokens');

      // Store tokens in localStorage
      this.setTokens(accessToken, refreshToken);

      // CRITICAL: Clean URL to remove sensitive tokens
      // Prevents tokens from appearing in browser history
      const url = new URL(window.location.href);
      url.searchParams.delete('access_token');
      url.searchParams.delete('refresh_token');
      url.searchParams.delete('auth_success');

      // Use replaceState (not pushState) to avoid history entry
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search + url.hash
      );

      console.log('[TokenService] ✓ Tokens extracted and URL cleaned');
      return { accessToken, refreshToken };
    }

    return { accessToken: null, refreshToken: null };
  },

  /**
   * Save tokens to localStorage
   */
  setTokens(accessToken, refreshToken) {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  /**
   * Get access token from localStorage
   */
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if we have valid tokens
   */
  hasTokens() {
    return !!this.getAccessToken();
  },

  /**
   * Clear all tokens (call on logout)
   */
  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    console.log('[TokenService] Tokens cleared');
  },

  /**
   * Detect iOS device (useful for debugging)
   */
  isIOSDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) &&
           !('MSStream' in window);
  }
};
```

### Setup Google OAuth Provider

**Installation:**
```bash
npm install @react-oauth/google
```

**App.jsx:**
```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          {/* Routes */}
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
```

### Auth Context (Global State)

**AuthContext.jsx:**
```jsx
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { tokenService } from '../services/tokenService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  const checkAuth = async () => {
    try {
      setLoading(true);

      // CRITICAL: Extract tokens from URL FIRST (OAuth callback)
      // This MUST happen before any API calls
      tokenService.extractTokensFromUrl();

      // Check if we have tokens
      if (!tokenService.hasTokens()) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Try to get current user
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      if (error?.response?.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
        tokenService.clearTokens();
      }
    } finally {
      setLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (googleCredential) => {
    const response = await authService.loginWithGoogle(googleCredential);

    localStorage.setItem('authToken', response.token);
    setUser(response.user);
    setIsAuthenticated(true);

    return response;
  };

  const setRole = async (role) => {
    const updatedUser = await authService.setUserRole(role);
    setUser(updatedUser);
  };

  const logout = async () => {
    try {
      // Call backend logout (optional for stateless JWT)
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens from localStorage
      tokenService.clearTokens();

      // Reset user state
      setUser(null);
      setIsAuthenticated(false);

      // Redirect to login
      window.location.replace('/login');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      setRole,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Custom Hook

**useAuth.js:**
```jsx
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
```

### Login Page

**IMPORTANT:** This page is accessed directly via `/login` URL only. It is NOT linked from the landing page during pre-launch.

**pages/Login.jsx:**
```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await login(credentialResponse.credential);

      if (response.isNewUser || !response.user.hasSelectedRole) {
        // New user - go to role selection
        // Note: Admins will have hasSelectedRole=true automatically
        navigate('/onboarding/role-selection');
      } else {
        // Existing user - redirect to appropriate dashboard
        const dashboardPath =
          response.user.role === 'ADMIN' ? '/admin/dashboard' :
          response.user.role === 'HOST' ? '/host/dashboard' :
          '/resident/dashboard';
        navigate(dashboardPath);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    alert('Google sign-in failed. Please try again.');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src="/logo.svg" alt="RoomPilot" className="logo" />
          <h1>Welcome to RoomPilot</h1>
          <p>The automation-first co-living marketplace</p>
        </div>

        <div className="login-content">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            size="large"
            text="continue_with"
            shape="rectangular"
            theme="outline"
            width="300"
          />

          <div className="login-benefits">
            <h3>Why RoomPilot?</h3>
            <ul>
              <li>✓ Low fees (2% vs. 8%)</li>
              <li>✓ Fast payouts</li>
              <li>✓ Automated billing</li>
              <li>✓ No interference</li>
            </ul>
          </div>
        </div>

        <div className="login-footer">
          <p className="login-notice">
            🔒 Pre-Launch Access Only - Authorized users only
          </p>
          <p>
            By signing in, you agree to our{' '}
            <a href="/terms">Terms of Service</a> and{' '}
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};
```

**pages/Login.css:**
```css
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.login-header p {
  font-size: 16px;
  color: #666;
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.login-benefits {
  width: 100%;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.login-benefits h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.login-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.login-benefits li {
  padding: 8px 0;
  font-size: 15px;
  color: #444;
}

.login-footer {
  margin-top: 32px;
  text-align: center;
  font-size: 13px;
  color: #888;
}

.login-notice {
  background: #fff4e1;
  border: 1px solid #ffd700;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #856404;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
```

### Dev Login Panel Component

**IMPORTANT:** Only rendered in development mode (`NODE_ENV === 'development'`)

**components/auth/DevLoginPanel.jsx:**
```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DevLoginPanel.css';

export const DevLoginPanel = ({ onLoginSuccess }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: '',
    fullName: '',
    role: 'HOST'
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/auth/dev-users');
      setUsers(response.data);
      if (response.data.length > 0) {
        setSelectedUserId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch dev users:', error);
      // Silently fail if dev auth not enabled
    }
  };

  const handleLogin = async () => {
    if (!selectedUserId) {
      alert('Please select a user');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/dev-login', {
        userId: selectedUserId
      });

      // Store token
      localStorage.setItem('authToken', response.data.token);

      // Call success callback
      onLoginSuccess(response.data);
    } catch (error) {
      console.error('Dev login failed:', error);
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/dev-create-user', createForm);

      // Refresh users list
      await fetchUsers();

      // Select newly created user
      setSelectedUserId(response.data.id);

      // Reset form
      setCreateForm({ email: '', fullName: '', role: 'HOST' });
      setShowCreateForm(false);

      alert(`Created user: ${response.data.email}`);
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user: ' + (error.response?.data?.message || error.message));
    }
  };

  // Group users by role
  const groupedUsers = users.reduce((acc, user) => {
    if (!acc[user.role]) {
      acc[user.role] = [];
    }
    acc[user.role].push(user);
    return acc;
  }, {});

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="dev-login-panel">
      {/* Warning Banner */}
      <div className="dev-warning-banner">
        <div className="warning-header">
          <span className="warning-icon">⚠️</span>
          <h3>Development Test Login</h3>
        </div>
        <p>
          Bypass OAuth - login as any user for testing.
          <br />
          <strong>Not available in production.</strong>
        </p>
      </div>

      {/* User Selection */}
      <div className="dev-form-group">
        <label>Select User:</label>
        <select
          value={selectedUserId || ''}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="dev-select"
        >
          {Object.entries(groupedUsers).map(([role, roleUsers]) => (
            <optgroup key={role} label={role}>
              {roleUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.email} - {user.fullName}
                  {user.isDevUser ? ' 🧪' : ''}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Selected User Preview */}
      {selectedUser && (
        <div className="dev-user-preview">
          <div className="user-info">
            <div>
              <p className="user-name">{selectedUser.fullName}</p>
              <p className="user-email">{selectedUser.email}</p>
            </div>
            <span className={`role-badge role-${selectedUser.role.toLowerCase()}`}>
              {selectedUser.role}
            </span>
          </div>
        </div>
      )}

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={loading || !selectedUserId}
        className="dev-login-button"
      >
        {loading ? 'Logging in...' : '🧪 Test Login'}
      </button>

      {/* Create User Toggle */}
      <div className="dev-create-toggle">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="toggle-button"
        >
          {showCreateForm ? '▼' : '▶'} Create new test user
        </button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateUser} className="dev-create-form">
          <div className="dev-form-group">
            <label>Email *</label>
            <input
              type="email"
              required
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              placeholder="test@example.com"
              className="dev-input"
            />
          </div>

          <div className="dev-form-group">
            <label>Full Name *</label>
            <input
              type="text"
              required
              value={createForm.fullName}
              onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
              placeholder="Test User"
              className="dev-input"
            />
          </div>

          <div className="dev-form-group">
            <label>Role *</label>
            <select
              value={createForm.role}
              onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
              className="dev-select"
            >
              <option value="HOST">Host</option>
              <option value="RESIDENT">Resident</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" className="dev-create-button">
            Create User
          </button>
        </form>
      )}
    </div>
  );
};
```

**DevLoginPanel.css:**
```css
.dev-login-panel {
  background: #fff4e1;
  border: 2px solid #ffd700;
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
}

.dev-warning-banner {
  background: #fff;
  border-left: 4px solid #ff9800;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 4px;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.warning-icon {
  font-size: 24px;
}

.warning-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #856404;
}

.dev-warning-banner p {
  margin: 0;
  font-size: 14px;
  color: #856404;
}

.dev-form-group {
  margin-bottom: 16px;
}

.dev-form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.dev-select,
.dev-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.dev-select:focus,
.dev-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

.dev-user-preview {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.user-email {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-admin {
  background: #e3f2fd;
  color: #1976d2;
}

.role-host {
  background: #f3e5f5;
  color: #7b1fa2;
}

.role-resident {
  background: #e8f5e9;
  color: #388e3c;
}

.dev-login-button {
  width: 100%;
  background: #ff9800;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.dev-login-button:hover:not(:disabled) {
  background: #f57c00;
}

.dev-login-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dev-create-toggle {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
}

.toggle-button {
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 0;
  width: 100%;
  text-align: left;
}

.toggle-button:hover {
  color: #333;
}

.dev-create-form {
  margin-top: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.dev-create-button {
  width: 100%;
  background: #4caf50;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.dev-create-button:hover {
  background: #45a049;
}
```

### Updated Login Page (with Dev Panel)

**pages/Login.jsx:**
```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { DevLoginPanel } from '../components/auth/DevLoginPanel';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await login(credentialResponse.credential);

      if (response.isNewUser || !response.user.hasSelectedRole) {
        // New user - go to role selection
        // Note: Admins will have hasSelectedRole=true automatically
        navigate('/onboarding/role-selection');
      } else {
        // Existing user - redirect to appropriate dashboard
        const dashboardPath =
          response.user.role === 'ADMIN' ? '/admin/dashboard' :
          response.user.role === 'HOST' ? '/host/dashboard' :
          '/resident/dashboard';
        navigate(dashboardPath);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    alert('Google sign-in failed. Please try again.');
  };

  const handleDevLoginSuccess = async (authData) => {
    // Re-check auth to load user data via context
    // Dev auth returns same structure as OAuth
    if (authData.user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (authData.user.role === 'HOST') {
      navigate('/host/dashboard');
    } else if (authData.user.role === 'RESIDENT') {
      navigate('/resident/dashboard');
    } else {
      // No role set - go to role selection
      navigate('/onboarding/role-selection');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src="/logo.svg" alt="RoomPilot" className="logo" />
          <h1>Welcome to RoomPilot</h1>
          <p>The automation-first co-living marketplace</p>
        </div>

        <div className="login-content">
          {/* Primary OAuth Login */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            size="large"
            text="continue_with"
            shape="rectangular"
            theme="outline"
            width="300"
          />

          <div className="login-benefits">
            <h3>Why RoomPilot?</h3>
            <ul>
              <li>✓ Low fees (2% vs. 8%)</li>
              <li>✓ Fast payouts</li>
              <li>✓ Automated billing</li>
              <li>✓ No interference</li>
            </ul>
          </div>
        </div>

        {/* Dev Login Panel - Conditional Rendering */}
        {process.env.NODE_ENV === 'development' && (
          <DevLoginPanel onLoginSuccess={handleDevLoginSuccess} />
        )}

        <div className="login-footer">
          <p className="login-notice">
            🔒 Pre-Launch Access Only - Authorized users only
          </p>
          <p>
            By signing in, you agree to our{' '}
            <a href="/terms">Terms of Service</a> and{' '}
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};
```

**Key Points:**
- Dev panel only renders when `process.env.NODE_ENV === 'development'`
- Placed below primary OAuth (keeps OAuth as primary method)
- Clear visual separation with yellow/amber warning colors
- Callback triggers same navigation flow as OAuth
- Production builds automatically exclude this component

### Role Selection Page

**pages/RoleSelection.jsx:**
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './RoleSelection.css';

export const RoleSelection = () => {
  const navigate = useNavigate();
  const { setRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    setLoading(true);

    try {
      await setRole(selectedRole);

      const dashboardPath = selectedRole === 'HOST'
        ? '/host/dashboard'
        : '/resident/dashboard';

      navigate(dashboardPath);
    } catch (error) {
      console.error('Failed to set role:', error);
      alert('Failed to set role. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="role-selection-page">
      <div className="role-selection-container">
        <h1>Choose Your Role</h1>
        <p>Are you listing rooms or looking for a room?</p>

        <div className="role-options">
          <div
            className={`role-card ${selectedRole === 'HOST' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('HOST')}
          >
            <div className="role-icon">🏠</div>
            <h3>I'm a Host</h3>
            <p>I have rooms to rent</p>
            <ul>
              <li>List properties</li>
              <li>Manage residents</li>
              <li>Receive automated payments</li>
              <li>2% platform fee</li>
            </ul>
          </div>

          <div
            className={`role-card ${selectedRole === 'RESIDENT' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('RESIDENT')}
          >
            <div className="role-icon">🔍</div>
            <h3>I'm a Resident</h3>
            <p>I'm looking for a room</p>
            <ul>
              <li>Search available rooms</li>
              <li>Easy wallet-based payments</li>
              <li>Automated billing</li>
              <li>No hidden fees</li>
            </ul>
          </div>
        </div>

        <button
          className="continue-button"
          onClick={handleSubmit}
          disabled={!selectedRole || loading}
        >
          {loading ? 'Setting up...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};
```

### Protected Route Component

**auth/ProtectedRoute.jsx:**
```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

### Role-Based Route Component

**auth/RoleRoute.jsx:**
```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const RoleRoute = ({ children, allowedRole, allowAdmin = false }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.hasSelectedRole) {
    return <Navigate to="/onboarding/role-selection" replace />;
  }

  // Admins can access all pages if allowAdmin is true
  if (allowAdmin && user.role === 'ADMIN') {
    return children;
  }

  if (user.role !== allowedRole) {
    // Redirect to correct dashboard
    const redirectPath =
      user.role === 'ADMIN' ? '/admin/dashboard' :
      user.role === 'HOST' ? '/host/dashboard' :
      '/resident/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
```

**Usage Notes:**
- `allowAdmin={true}` - Allows admins to access the route (useful for viewing host/resident pages)
- `allowAdmin={false}` - Admins are redirected to their own dashboard (default)
- Admin-only routes should use `allowedRole="ADMIN"`

### Auth Service (API Calls)

**services/authService.js:**
```javascript
import axios from 'axios';
import { tokenService } from './tokenService';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // NOTE: withCredentials NOT needed for header-only approach
  // (no cookies used)
});

// Request interceptor - Add Authorization header to ALL requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from tokenService (iOS-compatible)
    const token = tokenService.getAccessToken();

    if (token) {
      // Add Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenService.clearTokens();

      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  loginWithGoogle: async (credential) => {
    const response = await apiClient.post('/api/auth/google/callback', {
      credential,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  setUserRole: async (role) => {
    const response = await apiClient.post('/api/users/me/role', { role });
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.patch('/api/users/me', data);
    return response.data;
  },

  logout: async () => {
    await apiClient.post('/api/auth/logout');
  },
};

export default authService;
```

### Main App Routes

**App.jsx:**
```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { RoleRoute } from './auth/RoleRoute';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { RoleSelection } from './pages/RoleSelection';
import { HostDashboard } from './pages/HostDashboard';
import { ResidentDashboard } from './pages/ResidentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/onboarding/role-selection"
              element={
                <ProtectedRoute>
                  <RoleSelection />
                </ProtectedRoute>
              }
            />

            {/* Role-based routes */}
            <Route
              path="/host/dashboard"
              element={
                <RoleRoute allowedRole="HOST" allowAdmin={true}>
                  <HostDashboard />
                </RoleRoute>
              }
            />

            <Route
              path="/resident/dashboard"
              element={
                <RoleRoute allowedRole="RESIDENT" allowAdmin={true}>
                  <ResidentDashboard />
                </RoleRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <RoleRoute allowedRole="ADMIN">
                  <AdminDashboard />
                </RoleRoute>
              }
            />

            {/* 404 - redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
```

**Routing Strategy:**
- **Landing page (`/`)**: Public marketing page - NO authentication required, NO link to login
- **Login page (`/login`)**: Separate page accessed directly via URL for authorized users
- Host and Resident dashboards use `allowAdmin={true}` - allows admins to view these pages
- Admin dashboard uses `allowedRole="ADMIN"` only - exclusive to admins
- 404s redirect to landing page (not login)
- This gives admins full visibility into the platform while maintaining security

**Pre-Launch Access:**
- During pre-launch, only users who know the `/login` URL can authenticate
- Landing page remains public but doesn't expose authentication
- Perfect for internal testing and early authorized users

### Dashboard Pages (Minimal Placeholders for Auth Flow)

**IMPORTANT:** These are simple placeholder pages to complete the authentication flow. Full dashboard features (property management, booking management, revenue tracking, etc.) will be built in **P2 (Enhanced MVP - Week 10-11)** per the feature list.

**Purpose of placeholders:**
- ✅ Complete the OAuth callback → role selection → dashboard redirect flow
- ✅ Test role-based routing works correctly
- ✅ Verify iOS Safari authentication flow end-to-end
- ✅ Provide landing page after login
- ⏰ Full features come later (property management, bookings, payments, etc.)

#### Host Dashboard (Placeholder)

**pages/HostDashboard.jsx:**
```jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

export const HostDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Host Dashboard</h1>
          <div className="user-info">
            <span className="user-name">{user?.fullName}</span>
            <span className="user-role-badge host">HOST</span>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Welcome, {user?.fullName}! 🏠</h2>
          <p>Your host dashboard is ready.</p>
        </div>

        <div className="placeholder-sections">
          <div className="placeholder-card">
            <h3>📋 Properties</h3>
            <p className="coming-soon">Property management coming soon</p>
            <ul className="feature-list">
              <li>Add properties</li>
              <li>Manage rooms</li>
              <li>Upload photos</li>
            </ul>
          </div>

          <div className="placeholder-card">
            <h3>👥 Bookings</h3>
            <p className="coming-soon">Booking management coming soon</p>
            <ul className="feature-list">
              <li>View applications</li>
              <li>Approve residents</li>
              <li>Track bookings</li>
            </ul>
          </div>

          <div className="placeholder-card">
            <h3>💰 Revenue</h3>
            <p className="coming-soon">Revenue tracking coming soon</p>
            <ul className="feature-list">
              <li>Payment history</li>
              <li>Payout schedule</li>
              <li>Revenue reports</li>
            </ul>
          </div>
        </div>

        <div className="info-banner">
          <p>
            <strong>Authentication Successful!</strong> You're logged in as a Host.
            Full dashboard features will be available in the next development phase.
          </p>
        </div>
      </main>
    </div>
  );
};
```

#### Resident Dashboard (Placeholder)

**pages/ResidentDashboard.jsx:**
```jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

export const ResidentDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Resident Dashboard</h1>
          <div className="user-info">
            <span className="user-name">{user?.fullName}</span>
            <span className="user-role-badge resident">RESIDENT</span>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Welcome, {user?.fullName}! 🏡</h2>
          <p>Your resident dashboard is ready.</p>
        </div>

        <div className="placeholder-sections">
          <div className="placeholder-card">
            <h3>🔍 Browse Rooms</h3>
            <p className="coming-soon">Room search coming soon</p>
            <ul className="feature-list">
              <li>Search by location</li>
              <li>Filter by price</li>
              <li>View room details</li>
            </ul>
          </div>

          <div className="placeholder-card">
            <h3>📝 My Booking</h3>
            <p className="coming-soon">Booking details coming soon</p>
            <ul className="feature-list">
              <li>Current room</li>
              <li>Lease details</li>
              <li>House rules</li>
            </ul>
          </div>

          <div className="placeholder-card">
            <h3>💳 Wallet</h3>
            <p className="coming-soon">Wallet management coming soon</p>
            <ul className="feature-list">
              <li>Add funds</li>
              <li>Payment history</li>
              <li>Auto-billing setup</li>
            </ul>
          </div>
        </div>

        <div className="info-banner">
          <p>
            <strong>Authentication Successful!</strong> You're logged in as a Resident.
            Full dashboard features will be available in the next development phase.
          </p>
        </div>
      </main>
    </div>
  );
};
```

#### Admin Dashboard (Placeholder)

**pages/AdminDashboard.jsx:**
```jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span className="user-name">{user?.fullName}</span>
            <span className="user-role-badge admin">ADMIN</span>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Welcome, {user?.fullName}! 👑</h2>
          <p>Admin access granted. Full system oversight.</p>
        </div>

        <div className="placeholder-sections">
          <div className="placeholder-card">
            <h3>👥 Users</h3>
            <p className="coming-soon">User management coming soon</p>
            <ul className="feature-list">
              <li>View all users</li>
              <li>Manage accounts</li>
              <li>Audit logs</li>
            </ul>
          </div>

          <div className="placeholder-card">
            <h3>🏘️ Properties</h3>
            <p className="coming-soon">Property oversight coming soon</p>
            <ul className="feature-list">
              <li>All properties</li>
              <li>Verification status</li>
              <li>Compliance checks</li>
            </ul>
          </div>

          <div className="placeholder-card">
            <h3>📊 Analytics</h3>
            <p className="coming-soon">Analytics dashboard coming soon</p>
            <ul className="feature-list">
              <li>Platform metrics</li>
              <li>Revenue analytics</li>
              <li>User growth</li>
            </ul>
          </div>
        </div>

        <div className="info-banner admin-banner">
          <p>
            <strong>Admin Access Confirmed!</strong> You have full system access.
            You can also view Host and Resident dashboards.
          </p>
        </div>

        <div className="admin-quick-links">
          <h3>Quick Access</h3>
          <div className="link-buttons">
            <a href="/host/dashboard" className="btn-link">
              View Host Dashboard →
            </a>
            <a href="/resident/dashboard" className="btn-link">
              View Resident Dashboard →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
```

#### Dashboard Styles (Shared)

**pages/Dashboard.css:**
```css
.dashboard-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e1e4e8;
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-size: 15px;
  font-weight: 500;
  color: #444;
}

.user-role-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-role-badge.host {
  background: #f3e5f5;
  color: #7b1fa2;
}

.user-role-badge.resident {
  background: #e8f5e9;
  color: #388e3c;
}

.user-role-badge.admin {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-logout {
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: #d32f2f;
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.welcome-card h2 {
  font-size: 28px;
  margin: 0 0 8px 0;
}

.welcome-card p {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.placeholder-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.placeholder-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.placeholder-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.placeholder-card h3 {
  font-size: 20px;
  margin: 0 0 12px 0;
  color: #1a1a1a;
}

.coming-soon {
  background: #fff3e0;
  color: #e65100;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 16px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 8px 0;
  color: #666;
  font-size: 14px;
  position: relative;
  padding-left: 24px;
}

.feature-list li::before {
  content: "•";
  position: absolute;
  left: 8px;
  color: #667eea;
  font-weight: bold;
}

.info-banner {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 16px 20px;
  border-radius: 6px;
  margin-bottom: 24px;
}

.info-banner p {
  margin: 0;
  color: #0d47a1;
  font-size: 14px;
  line-height: 1.6;
}

.info-banner strong {
  font-weight: 600;
}

.admin-banner {
  background: #f3e5f5;
  border-left-color: #9c27b0;
}

.admin-banner p {
  color: #4a148c;
}

.admin-quick-links {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.admin-quick-links h3 {
  font-size: 18px;
  margin: 0 0 16px 0;
  color: #1a1a1a;
}

.link-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-block;
}

.btn-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .user-info {
    flex-wrap: wrap;
  }

  .placeholder-sections {
    grid-template-columns: 1fr;
  }

  .link-buttons {
    flex-direction: column;
  }

  .btn-link {
    width: 100%;
    text-align: center;
  }
}
```

**Implementation Notes:**

1. **These are MINIMAL placeholders** - just enough to complete the auth flow
2. Each dashboard shows:
   - User info and role badge
   - Logout button
   - Welcome message
   - "Coming soon" sections for future features
   - Confirmation that auth worked

3. **Full features (P2)** will be added later:
   - Property management (Host)
   - Room search and booking (Resident)
   - Wallet and payments (Resident)
   - Analytics and oversight (Admin)

4. **Testing the auth flow:**
   - Login works → Redirects to correct dashboard
   - Role-based routing works
   - Logout clears tokens and redirects
   - iOS Safari compatibility verified end-to-end

---

## Security Considerations

### 1. HTTPS Only in Production
- All traffic must use HTTPS
- Redirect all HTTP to HTTPS
- Use HSTS headers to enforce HTTPS
- **Required for Authorization header approach**

### 2. JWT Security
- **Strong secret:** Minimum 32 characters, randomly generated
- **Short expiration:** 7 days maximum (30 days acceptable for low-risk apps)
- **Signature verification:** Verify on every request
- **No sensitive data:** Don't store passwords or payment info in JWT
- **Refresh tokens:** Use separate refresh tokens for extended sessions

### 3. XSS Protection (CRITICAL for localStorage approach)

**Since we use localStorage (accessible to JavaScript), we MUST protect against XSS attacks:**

#### 3.1 Content Security Policy (CSP)

**Add CSP headers to all responses:**

```java
// Spring Boot - Security Headers
@Configuration
public class SecurityHeadersConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest request,
                                   HttpServletResponse response,
                                   Object handler) {
                // Content Security Policy
                response.setHeader("Content-Security-Policy",
                    "default-src 'self'; " +
                    "script-src 'self' https://accounts.google.com; " +
                    "style-src 'self' 'unsafe-inline'; " +
                    "img-src 'self' data: https:; " +
                    "connect-src 'self' " + API_URL + " https://accounts.google.com; " +
                    "frame-src https://accounts.google.com; " +
                    "object-src 'none'; " +
                    "base-uri 'self'; " +
                    "form-action 'self';"
                );

                // Additional security headers
                response.setHeader("X-Content-Type-Options", "nosniff");
                response.setHeader("X-Frame-Options", "DENY");
                response.setHeader("X-XSS-Protection", "1; mode=block");
                response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

                return true;
            }
        });
    }
}
```

**Or add to frontend `index.html`:**

```html
<meta http-equiv="Content-Security-Policy"
      content="
        default-src 'self';
        script-src 'self' https://accounts.google.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://api.roompilot.pro https://accounts.google.com;
        frame-src https://accounts.google.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
      ">
```

#### 3.2 Input Sanitization

**ALWAYS sanitize user inputs:**

```jsx
// Install DOMPurify
npm install dompurify

// Use in React components
import DOMPurify from 'dompurify';

const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};

// In forms
const handleSubmit = (formData) => {
  const sanitizedData = {
    ...formData,
    fullName: sanitizeInput(formData.fullName),
    bio: sanitizeInput(formData.bio)
  };
  // Submit sanitized data
};
```

#### 3.3 React XSS Protections

**NEVER use dangerouslySetInnerHTML with user input:**

```jsx
// ❌ WRONG - XSS vulnerable
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ CORRECT - React auto-escapes
<div>{userInput}</div>

// If you MUST render HTML, sanitize first
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />
```

### 4. URL Token Security

**Tokens are briefly visible in URL during OAuth callback. Mitigations:**

- ✅ **Immediately cleaned** from URL via `window.history.replaceState()`
- ✅ **auth_success flag** required (not just token presence)
- ✅ **Short-lived exposure** (< 1 second before cleaning)
- ✅ **HTTPS required** (prevents network sniffing)
- ✅ **No server logging** of URL params with tokens

### 3. CORS Configuration
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:5173",  // Development
                        "https://roompilot.pro"    // Production
                    )
                    .allowedMethods("GET", "POST", "PATCH", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(false)  // Not needed for header-only auth
                    .maxAge(3600);
            }
        };
    }
}
```

### 4. Input Validation
- Validate all user inputs
- Sanitize email addresses
- Phone number format validation
- Prevent XSS attacks (React does this automatically)

### 5. Rate Limiting
```java
// Prevent brute force attacks
@RateLimit(requests = 5, perMinutes = 1)
@PostMapping("/api/auth/google/callback")
public AuthResponse handleCallback(...) { }
```

### 6. CSRF Protection
- Use `state` parameter in OAuth flow
- Validate state on callback
- Store state in Redis/session with expiration

### 7. SQL Injection Prevention
- Use parameterized queries (Spring Data JPA does this)
- Never concatenate SQL strings

### 8. Secrets Management
- Never commit secrets to Git
- Use environment variables
- Consider AWS Secrets Manager or HashiCorp Vault for production

### 9. Audit Logging
```java
// Log all authentication events
@Service
public class AuthAuditService {
    public void logLogin(User user, String ipAddress) {
        log.info("User {} logged in from IP {}", user.getEmail(), ipAddress);
    }

    public void logLogout(User user) {
        log.info("User {} logged out", user.getEmail());
    }

    public void logFailedLogin(String email, String reason) {
        log.warn("Failed login attempt for {} - {}", email, reason);
    }
}
```

### 10. Data Privacy (GDPR Compliance)
- Store only necessary Google data
- Provide data export functionality
- Implement account deletion
- Clear privacy policy
- User consent for data storage

### 11. Admin Email Security
**Critical:** The `ADMIN_EMAILS` environment variable is a sensitive security control

**Protection Measures:**
1. **Never expose in frontend:** Admin emails should never be sent to client
2. **Environment variable only:** Never hardcode in source code
3. **Gitignore enforcement:** Add `.env` to `.gitignore`
4. **Production secrets:** Use AWS Secrets Manager or similar in production
5. **Audit logging:** Log all admin account creations and role assignments
6. **Regular review:** Periodically audit who has admin access

**Configuration Security:**
```java
// ❌ BAD - Hardcoded
private static final List<String> ADMIN_EMAILS = Arrays.asList(
    "admin@roompilot.com"
);

// ✅ GOOD - Environment variable
@Value("${ADMIN_EMAILS:}")
private String adminEmails;
```

**API Security:**
- Never expose `ADMIN_EMAILS` list via API endpoint
- Don't include `isAdmin` flag in user response (infer from role)
- Log admin authentication attempts for monitoring

**Example Audit Log:**
```java
@Service
public class AdminAuditService {
    public void logAdminAccountCreation(User user) {
        log.info("🔐 ADMIN ACCOUNT CREATED - Email: {}, ID: {}, Timestamp: {}",
            user.getEmail(), user.getId(), Instant.now());
    }

    public void logAdminLogin(User user, String ipAddress) {
        log.info("🔐 ADMIN LOGIN - Email: {}, IP: {}, Timestamp: {}",
            user.getEmail(), ipAddress, Instant.now());
    }

    public void logAdminRoleAttempt(String email, boolean success) {
        if (!success) {
            log.warn("⚠️ UNAUTHORIZED ADMIN ROLE ATTEMPT - Email: {}", email);
        }
    }
}
```

---

## Edge Cases & Error Handling

### Edge Case 1: User Clicks "Sign in with Google" Twice
**Problem:** Multiple concurrent OAuth flows

**Solution:**
- Disable button after first click
- Show loading state
- Cancel pending requests if new one initiated

```jsx
const [isLoading, setIsLoading] = useState(false);

const handleGoogleSuccess = async (credential) => {
  if (isLoading) return;  // Prevent duplicate requests
  setIsLoading(true);

  try {
    await login(credential);
  } finally {
    setIsading(false);
  }
};
```

### Edge Case 2: JWT Expires While User Is Active
**Problem:** Token expires mid-session

**Solution:**
- Implement token refresh mechanism
- Show "Session expired" modal
- Redirect to login

```jsx
// In axios interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired
      showSessionExpiredModal();
      localStorage.removeItem('authToken');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
    return Promise.reject(error);
  }
);
```

### Edge Case 3: User Changes Google Account
**Problem:** User signs in with different Google account

**Solution:**
- Create new user account
- Don't merge accounts
- Show "new account created" message

### Edge Case 4: User Deleted From Database But Has Valid JWT
**Problem:** JWT is valid but user no longer exists

**Solution:**
```java
public User validateAndGetUser(String userId) {
    return userRepository.findById(UUID.fromString(userId))
        .filter(user -> user.getDeletedAt() == null)
        .orElseThrow(() -> new UserNotFoundException());
}
```

### Edge Case 5: Network Failure During OAuth Flow
**Problem:** OAuth callback fails due to network issue

**Solution:**
- Show error message
- Provide "Try Again" button
- Log error for debugging

```jsx
const handleGoogleError = () => {
  setError('Google sign-in failed. Please check your internet connection and try again.');
};
```

### Edge Case 6: User Tries to Access Wrong Dashboard
**Problem:** Resident tries to access `/host/dashboard`

**Solution:**
- `RoleRoute` component redirects to correct dashboard
- Show brief message: "Redirecting to your dashboard..."

### Edge Case 7: Concurrent Role Selection
**Problem:** User opens multiple tabs, tries to set role twice

**Solution:**
```java
@Transactional
public User setUserRole(UUID userId, String role) {
    User user = userRepository.findByIdForUpdate(userId);  // SELECT FOR UPDATE

    if (user.getRole() != null) {
        throw new RoleAlreadySetException();
    }

    user.setRole(role);
    return userRepository.save(user);
}
```

### Edge Case 8: Google OAuth Consent Revoked
**Problem:** User revokes Google app permissions

**Solution:**
- JWT becomes invalid on next validation
- User must re-authenticate
- Clear localStorage
- Redirect to login

### Edge Case 9: Email Already Exists But Different Google Account
**Problem:** User has account, tries to sign in with different Google account with same email

**Solution:**
- Emails are linked to Google IDs
- If `google_id` doesn't match, treat as new account
- Send warning email to original account

### Edge Case 10: User Closes Browser During Role Selection
**Problem:** User authenticated but hasn't selected role

**Solution:**
- JWT is saved in localStorage (persists)
- On next visit, `/auth/me` returns `hasSelectedRole: false`
- Redirect to role selection page

### Edge Case 11: Admin Email Added to List After User Already Has Account
**Problem:** User already exists as HOST or RESIDENT, then their email is added to ADMIN_EMAILS

**Solution:**
```java
// On next login, backend detects admin email and updates role
if (isAdminEmail && user.getRole() != "ADMIN") {
    log.info("Promoting user {} from {} to ADMIN",
        user.getEmail(), user.getRole());
    auditService.logRolePromotion(user, user.getRole(), "ADMIN");
    user.setRole("ADMIN");
}
```
- User is automatically promoted to ADMIN on next login
- Old role is logged for audit trail
- User receives email notification about role change (optional)

### Edge Case 12: Admin Email Removed from List
**Problem:** Admin email is removed from `ADMIN_EMAILS` but user still has ADMIN role in database

**Solution:**
- **Decision:** Existing ADMIN role persists (database is source of truth)
- Removing from list only prevents NEW admin accounts
- To revoke admin: manually update database
- Alternative: Add demotion logic on login:
```java
if (!isAdminEmail && user.getRole() == "ADMIN") {
    log.warn("Demoting admin user {} - email no longer in whitelist", user.getEmail());
    user.setRole(null);  // Force role selection
    auditService.logAdminDemotion(user);
}
```

### Edge Case 13: Non-Admin Tries to Access Admin Dashboard
**Problem:** User directly navigates to `/admin/dashboard`

**Solution:**
- `RoleRoute` component checks `user.role !== 'ADMIN'`
- Redirects to appropriate dashboard based on role
- No error message (security by obscurity)

### Edge Case 14: Admin Tries to Access Role Selection Page
**Problem:** Admin with `role='ADMIN'` navigates to `/onboarding/role-selection`

**Solution:**
```jsx
// In RoleSelection component
useEffect(() => {
  if (user.role === 'ADMIN') {
    navigate('/admin/dashboard', { replace: true });
  }
}, [user, navigate]);
```

### Edge Case 15: Multiple Admin Emails with Same Google Account
**Problem:** Two admin emails listed, but both are aliases for same Google account

**Solution:**
- Google OAuth returns the primary email
- Only the primary email will match
- Use canonical emails in `ADMIN_EMAILS` list
- Document: "Use the primary Google account email"

### Edge Case 16: Typo in ADMIN_EMAILS Environment Variable
**Problem:** Admin email has typo (`admni@roompilot.com` instead of `admin@roompilot.com`)

**Solution:**
- Admin cannot log in with ADMIN role
- Backend logs show normal user creation
- **Prevention:** Add startup validation:
```java
@PostConstruct
public void validateAdminEmails() {
    String adminEmailsEnv = environment.getProperty("ADMIN_EMAILS", "");
    if (adminEmailsEnv.isEmpty()) {
        log.warn("⚠️ No admin emails configured in ADMIN_EMAILS");
        return;
    }

    List<String> emails = parseAdminEmails(adminEmailsEnv);
    log.info("🔐 Admin emails configured: {}", emails.size());

    // Validate email format
    for (String email : emails) {
        if (!isValidEmail(email)) {
            log.error("❌ Invalid admin email format: {}", email);
        }
    }
}
```

---

## Testing Requirements

### Unit Tests

#### Backend Tests (JUnit + Mockito)

**UserServiceTest.java:**
```java
@SpringBootTest
class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldCreateNewUserFromGoogleData() {
        GoogleUserInfo googleUser = GoogleUserInfo.builder()
            .id("123456")
            .email("test@example.com")
            .name("Test User")
            .picture("https://example.com/pic.jpg")
            .build();

        User createdUser = userService.createUserFromGoogle(googleUser);

        assertEquals("123456", createdUser.getGoogleId());
        assertEquals("test@example.com", createdUser.getEmail());
        assertNull(createdUser.getRole());
    }

    @Test
    void shouldThrowExceptionWhenRoleAlreadySet() {
        User user = User.builder()
            .id(UUID.randomUUID())
            .role("HOST")
            .build();

        when(userRepository.findById(any())).thenReturn(Optional.of(user));

        assertThrows(RoleAlreadySetException.class, () -> {
            userService.setUserRole(user.getId(), "RESIDENT");
        });
    }

    @Test
    void shouldThrowExceptionForInvalidRole() {
        User user = User.builder()
            .id(UUID.randomUUID())
            .build();

        when(userRepository.findById(any())).thenReturn(Optional.of(user));

        assertThrows(InvalidRoleException.class, () -> {
            userService.setUserRole(user.getId(), "ADMIN");
        });
    }

    @Test
    void shouldAutoAssignAdminRoleForWhitelistedEmail() {
        GoogleUserInfo googleUser = GoogleUserInfo.builder()
            .id("123456")
            .email("admin@roompilot.com")
            .name("Admin User")
            .build();

        // Mock admin email list
        when(environment.getProperty("ADMIN_EMAILS")).thenReturn("admin@roompilot.com");

        User createdUser = userService.createUserFromGoogle(googleUser, true);

        assertEquals("ADMIN", createdUser.getRole());
        assertTrue(createdUser.getHasSelectedRole());
    }

    @Test
    void shouldNotAutoAssignAdminForNonWhitelistedEmail() {
        GoogleUserInfo googleUser = GoogleUserInfo.builder()
            .id("123456")
            .email("user@example.com")
            .name("Regular User")
            .build();

        when(environment.getProperty("ADMIN_EMAILS")).thenReturn("admin@roompilot.com");

        User createdUser = userService.createUserFromGoogle(googleUser, false);

        assertNull(createdUser.getRole());
        assertFalse(createdUser.getHasSelectedRole());
    }

    @Test
    void shouldPromoteExistingUserToAdminWhenEmailAddedToList() {
        User existingUser = User.builder()
            .id(UUID.randomUUID())
            .email("john@roompilot.com")
            .role("HOST")
            .build();

        when(userRepository.findById(any())).thenReturn(Optional.of(existingUser));
        when(environment.getProperty("ADMIN_EMAILS")).thenReturn("john@roompilot.com");

        User updatedUser = authService.handleLogin(existingUser.getId());

        assertEquals("ADMIN", updatedUser.getRole());
        verify(auditService).logRolePromotion(existingUser, "HOST", "ADMIN");
    }
}
```

**JwtServiceTest.java:**
```java
@SpringBootTest
class JwtServiceTest {
    @Autowired
    private JwtService jwtService;

    @Test
    void shouldGenerateValidJwt() {
        User user = User.builder()
            .id(UUID.randomUUID())
            .email("test@example.com")
            .role("HOST")
            .build();

        String token = jwtService.generateToken(user);

        assertNotNull(token);
        assertTrue(jwtService.validateToken(token));
    }

    @Test
    void shouldExtractUserIdFromToken() {
        User user = User.builder()
            .id(UUID.randomUUID())
            .email("test@example.com")
            .build();

        String token = jwtService.generateToken(user);
        UUID extractedId = jwtService.getUserIdFromToken(token);

        assertEquals(user.getId(), extractedId);
    }

    @Test
    void shouldRejectExpiredToken() {
        String expiredToken = generateExpiredToken();

        assertFalse(jwtService.validateToken(expiredToken));
    }
}
```

#### Frontend Tests (Jest + React Testing Library)

**Login.test.jsx:**
```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from './Login';
import { AuthProvider } from '../auth/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Login Page', () => {
  it('renders login page with Google sign-in button', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome to RoomPilot')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('redirects to role selection for new users', async () => {
    // Mock login response
    const mockLogin = jest.fn().mockResolvedValue({
      isNewUser: true,
      user: { hasSelectedRole: false }
    });

    // Test login flow
    // ... (implementation details)
  });
});
```

### Integration Tests

**AuthFlowIntegrationTest.java:**
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class AuthFlowIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldCompleteFullAuthenticationFlow() throws Exception {
        // 1. Mock Google OAuth callback
        mockMvc.perform(post("/api/auth/google/callback")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"code\": \"mock-code\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.token").exists())
            .andExpect(jsonPath("$.user.hasSelectedRole").value(false));

        // 2. Set user role
        String token = extractTokenFromResponse();

        mockMvc.perform(post("/api/users/me/role")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"role\": \"HOST\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.role").value("HOST"));

        // 3. Verify user can access protected endpoint
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.role").value("HOST"));
    }
}
```

### Manual Testing Checklist

**Regular User Tests:**
- [ ] New user can sign in with Google
- [ ] New user is redirected to role selection
- [ ] User can select HOST role
- [ ] User can select RESIDENT role
- [ ] Existing user is redirected to correct dashboard
- [ ] Protected routes require authentication
- [ ] Invalid JWT returns 401
- [ ] Expired JWT returns 401
- [ ] Logout clears session
- [ ] User cannot change role after setting it
- [ ] Session persists after browser refresh
- [ ] Session expires after 7 days
- [ ] CORS works from frontend domain
- [ ] Rate limiting prevents abuse

**Admin User Tests:**
- [ ] Admin email in whitelist gets ADMIN role automatically
- [ ] Admin is redirected to /admin/dashboard (skips role selection)
- [ ] Admin can access /host/dashboard
- [ ] Admin can access /resident/dashboard
- [ ] Non-admin cannot access /admin/dashboard
- [ ] Admin role appears in JWT token
- [ ] Admin account creation is logged
- [ ] Admin cannot manually select role via /api/users/me/role
- [ ] Existing user promoted to ADMIN when email added to list
- [ ] Non-whitelisted email does NOT get ADMIN role
- [ ] ADMIN_EMAILS validation runs on startup
- [ ] Case-insensitive email matching works (Admin@roompilot.com == admin@roompilot.com)

**Security Tests:**
- [ ] ADMIN_EMAILS list is not exposed via any API endpoint
- [ ] Frontend doesn't receive admin email list
- [ ] Role cannot be manually changed to ADMIN
- [ ] Audit logs capture admin actions

---

## Future Enhancements

### Phase 2 (Post-MVP)
1. **Social Auth Expansion**
   - Apple Sign-In
   - Facebook Login

2. **Advanced Security**
   - Two-factor authentication (TOTP)
   - Device fingerprinting
   - Suspicious activity detection

3. **Account Management**
   - Account deletion
   - Data export (GDPR compliance)
   - Email change flow

4. **Token Refresh**
   - Automatic token refresh before expiration
   - Refresh tokens with rotation

5. **Admin Panel**
   - User management dashboard
   - Audit log viewer
   - Manual account verification

### Phase 3 (Future)
1. **Magic Link Login**
   - Email-based passwordless auth (alternative to Google)

2. **SSO for Organizations**
   - SAML 2.0 support
   - Enterprise login

3. **Biometric Auth**
   - WebAuthn support
   - Fingerprint/Face ID on mobile

---

## Success Metrics

### KPIs to Track
1. **Sign-up Success Rate:** % of users who complete Google OAuth
2. **Role Selection Rate:** % of new users who select a role
3. **Session Duration:** Average time before token expiration/logout
4. **Failed Login Attempts:** Track and investigate patterns
5. **Time to First Login:** From landing page to authenticated

### Goals
- Sign-up success rate: > 95%
- Role selection rate: > 90%
- Failed login attempts: < 2%
- Time to first login: < 30 seconds

---

## Dependencies

### Backend (Spring Boot)
```xml
<!-- pom.xml -->
<dependencies>
    <!-- Google OAuth -->
    <dependency>
        <groupId>com.google.api-client</groupId>
        <artifactId>google-api-client</artifactId>
        <version>2.2.0</version>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
    </dependency>

    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
</dependencies>
```

### Frontend (React)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@react-oauth/google": "^0.12.1",
    "axios": "^1.6.2"
  }
}
```

---

## Conclusion

This authentication system provides:
- ✅ **Secure:** Google OAuth 2.0 with JWT
- ✅ **Simple:** One-click sign-in, no passwords
- ✅ **Scalable:** Stateless JWT architecture
- ✅ **User-friendly:** Automatic profile population
- ✅ **Privacy-first:** Minimal data storage
- ✅ **Role-based access:** HOST, RESIDENT, and ADMIN roles
- ✅ **Admin auto-assignment:** Hardcoded email-based admin access
- ✅ **Production-ready:** HTTPS, CORS, rate limiting, error handling, audit logging

Implementation time: **1-2 weeks** for a single full-stack developer.

---

## Summary of Admin Role Implementation

**Key Features:**
1. **Email-based whitelist:** `ADMIN_EMAILS` environment variable
2. **Auto-assignment:** Admins get role automatically on first login
3. **No manual selection:** Admins skip role selection page
4. **Full visibility:** Admins can access all dashboards (host, resident, admin)
5. **Audit logging:** All admin actions are logged for security
6. **Immutable role:** Admin role cannot be manually changed
7. **Auto-promotion:** Existing users automatically promoted when email added to list

**Security Considerations:**
- Admin emails stored in environment variables only
- Never exposed via API or frontend
- Case-insensitive matching
- Comprehensive audit logging
- Production secrets management required

---

**Next Steps:**
1. Set up Google Cloud project and OAuth credentials
2. Configure `ADMIN_EMAILS` environment variable
3. Implement backend `/api/auth/google/callback` endpoint with **redirect + tokens in URL**
4. **CRITICAL:** Implement `tokenService.js` with `extractTokensFromUrl()` function
5. Create database migration for `users` table (with ADMIN role)
6. Build frontend `/login` page (separate from existing landing page)
7. Update `AuthContext` to call `tokenService.extractTokensFromUrl()` on mount
8. Add `Authorization: Bearer {token}` header to all API requests
9. Implement Content Security Policy (CSP) headers
10. Create role selection page (`/onboarding/role-selection`)
11. Create `/admin/dashboard` page
12. Create `/host/dashboard` and `/resident/dashboard` pages
13. Implement audit logging service
14. **Test on real iOS Safari device** (CRITICAL)
15. Test complete authentication flow (regular + admin users)
16. Deploy to staging environment
17. Security audit before production

**Note:** The existing landing page at `/` should remain unchanged with NO link to `/login` during pre-launch.

---

## iOS Safari Testing Requirements

### Critical Tests

**MUST test on real iOS device before production:**

1. **iPhone Safari - Login Flow**
   - Navigate to `/login`
   - Click "Sign in with Google"
   - Authenticate with Google
   - **Verify:** Redirected to dashboard with tokens in URL
   - **Verify:** Tokens extracted and URL cleaned
   - **Verify:** Tokens stored in localStorage
   - **Verify:** API requests include `Authorization` header
   - **Verify:** User data loads successfully

2. **iPad Safari - Login Flow**
   - Same tests as iPhone

3. **Session Persistence**
   - Log in on iOS Safari
   - Close Safari completely
   - Reopen Safari and navigate to app
   - **Verify:** Still logged in (tokens persist in localStorage)

4. **Logout Flow**
   - Log out on iOS Safari
   - **Verify:** Redirected to login
   - **Verify:** localStorage cleared
   - **Verify:** Cannot access protected pages

### Debug Tools for iOS

**Enable Safari Web Inspector on iOS:**

1. iPhone/iPad: Settings → Safari → Advanced → Web Inspector (enable)
2. Mac: Safari → Develop → [Your iPhone] → [Your App]
3. Check Network tab for Authorization headers
4. Check Console for tokenService logs
5. Check Storage tab for localStorage

**Logging for iOS debugging:**

```javascript
// Add to tokenService.js
if (this.isIOSDevice()) {
  console.log('[iOS] Device detected');
  console.log('[iOS] Tokens extracted:', !!accessToken);
  console.log('[iOS] localStorage available:', typeof localStorage !== 'undefined');
}
```

### Common iOS Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Infinite login loop** | Redirects to login after OAuth | `extractTokensFromUrl()` not called or called too late |
| **401 on all requests** | No Authorization header | Check tokenService.getAccessToken() returns token |
| **Tokens not in localStorage** | OAuth callback works but no persistence | URL extraction timing issue |
| **URL still has tokens** | Security risk - tokens in browser history | URL cleaning failed - check `window.history.replaceState()` |

---

## Summary: Key Implementation Points

### 🎯 Critical for iOS Safari Compatibility

1. **OAuth callback returns redirect with tokens in URL** (not JSON response)
   ```
   Location: /dashboard?auth_success=true&access_token=xxx&refresh_token=yyy
   ```

2. **Frontend extracts tokens from URL on mount**
   ```javascript
   tokenService.extractTokensFromUrl();  // MUST be first in useEffect
   ```

3. **Tokens stored in localStorage**
   ```javascript
   localStorage.setItem('roompilot_access_token', accessToken);
   ```

4. **URL cleaned immediately**
   ```javascript
   window.history.replaceState({}, document.title, cleanUrl);
   ```

5. **All requests include Authorization header**
   ```javascript
   config.headers['Authorization'] = `Bearer ${token}`;
   ```

6. **Backend checks Authorization header only** (no cookies)
   ```java
   String authHeader = request.getHeader("Authorization");
   ```

### 🔒 Critical for Security

1. **Content Security Policy** - Protects against XSS
2. **Input sanitization** - Use DOMPurify for all user inputs
3. **HTTPS required** - Mandatory in production
4. **URL token cleaning** - Prevents history leaks
5. **Token expiration** - 7-30 days maximum

### ✅ Success Criteria

- [ ] Login works on iOS Safari (real device test)
- [ ] Login works on Desktop browsers
- [ ] Tokens extracted from URL successfully
- [ ] URL cleaned (no tokens in browser history)
- [ ] Authorization header sent with all requests
- [ ] localStorage populated with tokens
- [ ] Logout clears localStorage
- [ ] Session persists across browser restarts
- [ ] No infinite login loop
- [ ] CSP headers implemented

**Note:** The existing landing page at `/` should remain unchanged with NO link to `/login` during pre-launch.
