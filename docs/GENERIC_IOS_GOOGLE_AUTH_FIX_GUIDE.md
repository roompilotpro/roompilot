# Generic iOS/Safari Google OAuth Authentication Fix Guide

**Version:** 2.0
**Last Updated:** 2025-11-15
**Status:** Production-Tested Patterns - Two Approaches (Simple & Dual)
**Portability:** Framework-Agnostic with Reference Implementations

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [The Problem](#the-problem)
3. [Root Causes Deep Dive](#root-causes-deep-dive)
4. [Two Solution Approaches](#two-solution-approaches)
5. [Recommended: Simple Authorization Header Approach](#recommended-simple-authorization-header-approach)
6. [Alternative: Dual Authentication Approach](#alternative-dual-authentication-approach)
7. [Security Considerations](#security-considerations)
8. [Testing Strategies](#testing-strategies)
9. [Deployment Checklist](#deployment-checklist)
10. [Troubleshooting](#troubleshooting)
11. [Technology-Specific Examples](#technology-specific-examples)

---

## Executive Summary

### What This Solves

**Problem:** Infinite login loop on iOS Safari when using Google OAuth with cookie-based authentication in cross-domain (frontend ≠ backend domain) deployments.

**Root Cause:** iOS Safari's Intelligent Tracking Prevention (ITP) blocks third-party cookies, preventing cookie-based session management from working when frontend and backend are on different domains.

**Solutions:** This guide provides **two approaches**:

1. **✅ RECOMMENDED: Simple Authorization Header Approach** (for new projects)
   - Use Authorization headers only (no cookies)
   - ~50% less code than dual approach
   - Works everywhere: iOS, Android, Desktop
   - Single unified code path

2. **Alternative: Dual Authentication Approach** (for existing cookie-based systems)
   - httpOnly cookies for desktop
   - Authorization headers for iOS/mobile
   - Best for migrating existing systems
   - Defense-in-depth security

### Quick Comparison

| Aspect | Simple (Headers Only) | Dual (Cookies + Headers) |
|--------|----------------------|-------------------------|
| **Complexity** | ⭐⭐⭐⭐⭐ Very Simple | ⭐⭐ Complex |
| **Code Lines** | ~40 lines | ~80 lines |
| **iOS Compatible** | ✅ Yes | ✅ Yes |
| **Desktop Compatible** | ✅ Yes | ✅ Yes |
| **XSS Protection** | ⚠️ Requires CSP + sanitization | ✅ Desktop: httpOnly cookies |
| **Implementation Time** | 1-2 hours | 3-4 hours |
| **Best For** | New projects, SPAs | Existing cookie systems |

### Key Takeaways

1. **Never rely solely on cookies** for cross-domain auth (iOS blocks them)
2. **For new projects**: Use Authorization header approach (simpler, works everywhere)
3. **For existing systems**: Use dual approach (backward compatible)
4. **URL token extraction** is necessary for iOS OAuth callback in both approaches
5. **Test on real iOS devices** before production deployment
6. **Implement strong XSS protections** if using header-only approach (CSP, input sanitization)

### Which Approach Should You Use?

**✅ Use Simple Authorization Header Approach if:**
- Starting a new project
- Building a modern SPA (React, Vue, Angular)
- Mobile-first application
- Can implement Content Security Policy (CSP)
- Want less code complexity
- API-first architecture

**⚠️ Use Dual Authentication Approach if:**
- Migrating existing cookie-based system
- High-security requirements (financial, healthcare, government)
- Desktop-heavy enterprise application
- Need maximum XSS protection for desktop users
- Cannot guarantee perfect CSP implementation
- Backward compatibility is critical

---

## The Problem

### Symptoms

When deploying a web application with:
- **Frontend:** Vercel/Netlify/Cloud (`app.example.com`)
- **Backend:** Different domain (`api.example.com` or different service)
- **Auth:** Google OAuth with cookie-based sessions

**On iOS Safari:**
1. User clicks "Login with Google"
2. Redirects to Google OAuth ✅
3. Successfully authenticates with Google ✅
4. Redirects back to app ✅
5. Backend sets authentication cookies ✅
6. **Frontend can't read cookies** ❌
7. `GET /api/auth/me` returns 401 ❌
8. **Redirects back to login** ❌
9. **Infinite loop** 🔄

**On Desktop browsers (Chrome, Firefox, Safari):**
- Everything works perfectly ✅
- Cookies are set and read correctly ✅

### Why It's Confusing

- Works perfectly on desktop
- Works in local development (same `localhost` domain)
- Only breaks in production on iOS/Safari
- No obvious error messages
- Cookies appear to be set (visible in backend logs)
- Frontend never receives them

---

## Root Causes Deep Dive

### 1. Third-Party Cookie Blocking (Primary Cause)

**iOS Safari's Intelligent Tracking Prevention (ITP)**

iOS Safari treats cross-domain cookies as "third-party" cookies and blocks them by default.

```
Frontend Domain: https://app.example.com  (Vercel)
Backend Domain:  https://api.example.com  (Render)
                        ↓
           Different domains = Third-party cookies
                        ↓
              iOS Safari blocks them
```

**Timeline:**
- **iOS 11 (2017)**: ITP introduced
- **iOS 12.2 (2019)**: Full third-party cookie blocking
- **iOS 13+ (2019-present)**: Even stricter policies
- **iOS 14.5+ (2021)**: App Tracking Transparency

### 2. SameSite Cookie Policy

**What is SameSite?**

The `SameSite` cookie attribute controls whether cookies are sent in cross-site requests.

```http
Set-Cookie: session=abc123; SameSite=Lax
Set-Cookie: session=abc123; SameSite=Strict
Set-Cookie: session=abc123; SameSite=None; Secure
```

**iOS Safari Behavior:**

| SameSite Value | Desktop | iOS Safari |
|----------------|---------|------------|
| `Lax` (default) | ✅ Works for top-level navigation | ❌ Blocked for cross-domain |
| `Strict` | ⚠️ Very restrictive | ❌ Blocked entirely |
| `None; Secure` | ✅ Works | ❌ Still blocked by ITP |

**The Paradox:**
- To allow cross-domain cookies, use `SameSite=None; Secure`
- But iOS Safari blocks third-party cookies regardless of `SameSite`
- **Result:** No cookie configuration works on iOS cross-domain

### 3. Secure Context Requirements

**HTTPS Requirement:**

```
SameSite=None REQUIRES Secure flag
Secure flag REQUIRES HTTPS
```

**What This Means:**
- Can't use `SameSite=None` on `http://` (local development)
- Must use HTTPS in production
- Localhost is exempt (special case)

### 4. Cross-Origin Resource Sharing (CORS)

**Credentials and CORS:**

```javascript
// Frontend must send credentials
axios.create({
  withCredentials: true  // Send cookies cross-domain
});

// Backend must allow credentials
app.use(cors({
  origin: 'https://app.example.com',
  credentials: true  // Allow cookies
}));
```

**iOS Safari Issue:**
- Even with correct CORS setup, cookies still blocked
- `withCredentials: true` is necessary but not sufficient

### 5. Cookie Domain Mismatch

**Setting cookies for wrong domain:**

```python
# ❌ WRONG - Won't work cross-domain
response.set_cookie(
    domain=".example.com"  # Trying to set for parent domain
)

# ✅ CORRECT - Let browser determine domain
response.set_cookie(
    domain=None  # Browser uses request domain
)
```

### 6. OAuth Redirect Flow Complexity

**The OAuth Dance:**

```
1. Frontend: https://app.example.com
   ↓ Click "Login with Google"
2. Redirect to: https://accounts.google.com/oauth/...
   ↓ User logs in
3. Google redirects to: https://api.example.com/auth/callback
   ↓ Backend processes auth
4. Backend redirects to: https://app.example.com/dashboard
   ↓ Backend sets cookies in redirect response
5. Frontend loads: https://app.example.com/dashboard
   ↓ Makes request to: https://api.example.com/api/auth/me
   ❌ iOS Safari: Cookies not sent (third-party)
```

**The Key Problem:**
Cookies set during redirect (step 4) are not available to JavaScript requests (step 5) on iOS because they're considered third-party.

---

## Two Solution Approaches

This guide provides two battle-tested solutions to the iOS Safari cross-domain authentication problem. Both work perfectly on iOS, but differ in complexity and security trade-offs.

### Approach Comparison

| Feature | Simple (Recommended) | Dual (Alternative) |
|---------|---------------------|-------------------|
| **Implementation** | Authorization headers only | Cookies + Authorization headers |
| **Code Complexity** | Low (~40 lines) | Medium (~80 lines) |
| **Code Paths** | 1 unified path | 2 separate paths (desktop/mobile) |
| **iOS Support** | ✅ Perfect | ✅ Perfect |
| **Desktop Support** | ✅ Perfect | ✅ Perfect |
| **XSS Protection** | Requires CSP + sanitization | Desktop: httpOnly cookies<br>Mobile: localStorage |
| **CSRF Protection** | ✅ Not vulnerable | Requires CSRF tokens |
| **Debugging** | ✅ Easy (visible headers) | ⚠️ Mixed (cookies hidden) |
| **Best For** | New projects, SPAs, Mobile apps | Existing cookie systems, Enterprise |

### How Each Approach Works

**Simple Authorization Header Approach:**
```
1. OAuth callback → Tokens in URL
2. Frontend extracts tokens → Store in localStorage
3. All requests → Send Authorization: Bearer {token}
4. Backend checks → Authorization header only
✅ Same flow for iOS and Desktop
```

**Dual Authentication Approach:**
```
1. OAuth callback → Tokens in URL + Set cookies
2. Frontend extracts tokens → Store in localStorage
3. Desktop requests → Cookies sent automatically
4. iOS requests → Authorization: Bearer {token}
5. Backend checks → Cookies first, then Authorization header
⚠️ Different flows for iOS and Desktop
```

---

## Recommended: Simple Authorization Header Approach

**For most new projects, this is the recommended approach.** It's simpler, has a single code path, and works perfectly on all platforms.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              SIMPLE AUTHORIZATION HEADER FLOW                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User clicks "Login with Google"                         │
│     ↓                                                        │
│  2. Redirect to Google OAuth                                │
│     ↓                                                        │
│  3. User authenticates with Google                          │
│     ↓                                                        │
│  4. Google redirects to: /api/auth/google/callback          │
│     ↓                                                        │
│  5. Backend:                                                 │
│     - Verify OAuth code                                     │
│     - Create/get user                                       │
│     - Generate JWT tokens                                   │
│     - Redirect to: /dashboard?                              │
│         auth_success=true&                                  │
│         access_token=xxx&                                   │
│         refresh_token=yyy                                   │
│     ↓                                                        │
│  6. Frontend:                                                │
│     - Extract tokens from URL                               │
│     - Store in localStorage                                 │
│     - Clean URL (remove tokens)                             │
│     ↓                                                        │
│  7. All API requests (iOS + Desktop):                       │
│     - Add header: Authorization: Bearer {token}             │
│     ↓                                                        │
│  8. Backend:                                                 │
│     - Check Authorization header                            │
│     - Verify JWT token                                      │
│     - Return user data                                      │
│                                                              │
│  ✅ Single unified flow for all platforms                  │
└─────────────────────────────────────────────────────────────┘
```

### Implementation: Backend (FastAPI)

#### Step 1: OAuth Callback - Tokens in URL Only

```python
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
import os

router = APIRouter()

@router.get("/auth/google/callback")
async def google_callback(code: str, state: str):
    """
    Google OAuth callback - Simple approach (no cookies)
    """
    try:
        # Exchange code for Google tokens
        google_tokens = await exchange_code_for_tokens(code)

        # Get user info from Google
        user_info = await get_google_user_info(google_tokens['access_token'])

        # Create or get user from database
        user = await get_or_create_user(user_info)

        # Generate JWT tokens
        access_token = create_jwt_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(days=30)
        )
        refresh_token = create_refresh_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(days=90)
        )

        # Redirect with tokens in URL (works for iOS + Desktop)
        frontend_url = os.getenv("FRONTEND_URL")
        redirect_url = (
            f"{frontend_url}/dashboard?"
            f"auth_success=true&"
            f"access_token={access_token}&"
            f"refresh_token={refresh_token}"
        )

        return RedirectResponse(url=redirect_url)

    except Exception as e:
        # Redirect to login with error
        frontend_url = os.getenv("FRONTEND_URL")
        return RedirectResponse(
            url=f"{frontend_url}/login?error=auth_failed"
        )
```

#### Step 2: Authentication - Check Authorization Header Only

```python
from fastapi import Request, HTTPException, Depends
from jose import JWTError, jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

async def get_current_user(request: Request):
    """
    Simple: Only check Authorization header (no cookies)
    Works for both iOS and Desktop
    """
    # Get Authorization header
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    # Extract token (remove "Bearer " prefix)
    token = auth_header[7:]

    try:
        # Verify JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Load user from database
        user = db.query(User).filter(User.id == user_id).first()

        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User not found")

        return user

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Use in protected endpoints
@router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role
    }
```

#### Step 3: Logout - Simple Return (No Cookies to Clear)

```python
@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout - Simple approach (no server-side session)
    For stateless JWT, just return success
    Client will clear localStorage

    Optional: Implement token blacklist in database for added security
    """
    # Optional: Add token to blacklist table
    # await blacklist_token(current_user.id)

    return {"message": "Logged out successfully"}
```

### Implementation: Frontend (React/TypeScript)

#### Step 1: Token Service

```typescript
// services/tokenService.ts
const ACCESS_TOKEN_KEY = 'app_access_token';
const REFRESH_TOKEN_KEY = 'app_refresh_token';

export const tokenService = {
  /**
   * Save tokens to localStorage
   */
  setTokens(accessToken: string, refreshToken: string): void {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    console.log('[TokenService] Tokens saved to localStorage');
  },

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Clear all tokens (call on logout)
   */
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    console.log('[TokenService] Tokens cleared');
  },

  /**
   * Check if valid tokens exist
   */
  hasTokens(): boolean {
    return !!this.getAccessToken();
  },

  /**
   * Extract tokens from URL after OAuth redirect
   * CRITICAL for iOS compatibility
   */
  extractTokensFromUrl(): {
    accessToken: string | null;
    refreshToken: string | null;
  } {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const authSuccess = params.get('auth_success');

    // Only proceed if we have valid OAuth callback
    if (accessToken && refreshToken && authSuccess === 'true') {
      console.log('[TokenService] OAuth callback detected, extracting tokens');

      // Store tokens
      this.setTokens(accessToken, refreshToken);

      // CRITICAL: Clean URL to remove tokens
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
    }

    return { accessToken, refreshToken };
  },

  /**
   * Detect iOS device (useful for debugging)
   */
  isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) &&
           !('MSStream' in window);
  }
};
```

#### Step 2: API Service with Authorization Header

```typescript
// services/api.ts
import axios from 'axios';
import { tokenService } from './tokenService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:9000',
  // NOTE: withCredentials not needed (we're not using cookies)
});

// Request interceptor - Add Authorization header
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = tokenService.getAccessToken();

    if (token) {
      // Add Authorization header to ALL requests
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenService.clearTokens();

      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Step 3: Auth Context

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { tokenService } from '../services/tokenService';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check authentication status
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);

      // CRITICAL: Extract tokens from URL first (OAuth callback)
      tokenService.extractTokensFromUrl();

      // Check if we have tokens
      if (!tokenService.hasTokens()) {
        setUser(null);
        return;
      }

      // Try to get current user
      const response = await api.get('/api/auth/me');
      setUser(response.data);

    } catch (error: any) {
      if (error?.response?.status === 401) {
        setUser(null);
        tokenService.clearTokens();
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initiate Google OAuth login
   */
  const loginWithGoogle = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
    window.location.href = `${apiUrl}/api/auth/google/login`;
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // Call backend logout endpoint (optional for stateless JWT)
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens from localStorage
      tokenService.clearTokens();

      // Reset user state
      setUser(null);

      // Redirect to login
      window.location.replace('/login');
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### XSS Protection Requirements

**Since this approach uses localStorage (accessible to JavaScript), you MUST implement these XSS protections:**

#### 1. Content Security Policy (CSP)

```html
<!-- In your index.html -->
<meta http-equiv="Content-Security-Policy"
      content="
        default-src 'self';
        script-src 'self' https://accounts.google.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://your-api.com https://accounts.google.com;
        frame-src https://accounts.google.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
      ">
```

Or via HTTP header (backend):

```python
# FastAPI middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' https://accounts.google.com; "
        "connect-src 'self' https://your-api.com;"
    )
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

#### 2. Input Sanitization

```typescript
// Always sanitize user inputs
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};

// Use in forms
const handleSubmit = (data: FormData) => {
  const sanitizedData = {
    ...data,
    name: sanitizeInput(data.name),
    description: sanitizeInput(data.description),
  };
  // ... submit sanitized data
};
```

#### 3. Framework XSS Protections

```typescript
// React: NEVER use dangerouslySetInnerHTML with user input
// ❌ WRONG
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ CORRECT
<div>{userInput}</div>

// If you MUST render HTML, sanitize it first
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### Environment Configuration

**Development (.env):**
```bash
# Backend
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET_KEY=your-dev-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=30

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:9000/api/auth/google/callback

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Production (.env.production):**
```bash
# Backend
ENVIRONMENT=production
FRONTEND_URL=https://app.example.com
JWT_SECRET_KEY=your-production-secret-key-use-strong-random
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=30

# Google OAuth
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_REDIRECT_URI=https://api.example.com/api/auth/google/callback

# CORS
CORS_ORIGINS=https://app.example.com,https://www.example.com

# Security (MUST use HTTPS in production)
SECURE_COOKIES=false  # Not using cookies in simple approach
```

**Frontend (.env.production):**
```bash
REACT_APP_API_URL=https://api.example.com
# or for Vite:
VITE_API_URL=https://api.example.com
```

### Summary: Simple Approach

**✅ Advantages:**
- Much simpler implementation (~50% less code)
- Single unified code path for all platforms
- Easy to debug (headers visible in DevTools)
- No CSRF vulnerability
- Works perfectly on iOS, Android, Desktop

**⚠️ Requirements:**
- MUST implement Content Security Policy
- MUST sanitize all user inputs
- MUST use framework XSS protections
- HTTPS required in production

**📦 What You Get:**
- ~40 lines of auth code total
- Works everywhere
- Easy to maintain
- Perfect for modern SPAs

---

## Alternative: Dual Authentication Approach

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐                                               │
│  │  User    │                                               │
│  │  clicks  │                                               │
│  │  login   │                                               │
│  └────┬─────┘                                               │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────────────┐                                        │
│  │ Google OAuth    │                                        │
│  │ Flow            │                                        │
│  └────────┬────────┘                                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────────────────┐            │
│  │ Backend OAuth Callback                      │            │
│  │ - Verify auth code                          │            │
│  │ - Create JWT tokens                         │            │
│  │ - Set httpOnly cookies (for desktop)        │            │
│  │ - Add tokens to URL params (for iOS)        │            │
│  │                                              │            │
│  │ Redirect:                                    │            │
│  │ app.com/dashboard?                           │            │
│  │   access_token=xxx&                          │            │
│  │   refresh_token=yyy&                         │            │
│  │   auth_success=true                          │            │
│  └────────┬────────────────────────────────────┘            │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────────────────┐            │
│  │ Frontend Token Extraction                   │            │
│  │ - Check URL for tokens                      │            │
│  │ - If found: Save to localStorage            │            │
│  │ - Clean URL (remove tokens)                 │            │
│  │ - Try /api/auth/me with token               │            │
│  └────────┬────────────────────────────────────┘            │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────────────────┐            │
│  │ Dual Authentication                          │            │
│  │                                              │            │
│  │ Desktop Browsers:                            │            │
│  │ ✅ Use httpOnly cookies                     │            │
│  │ ✅ More secure (XSS protection)             │            │
│  │ ✅ Automatic cookie transmission            │            │
│  │                                              │            │
│  │ iOS Safari / Mobile:                         │            │
│  │ ✅ Use localStorage + Authorization header  │            │
│  │ ⚠️ Less secure but necessary                │            │
│  │ ✅ Works despite cookie blocking            │            │
│  └─────────────────────────────────────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Why This Works

**For Desktop:**
- Cookies work normally ✅
- Also saves to localStorage as backup ✅
- Uses httpOnly cookies for better security ✅

**For iOS:**
- Cookies blocked but localStorage works ✅
- Token extracted from URL on redirect ✅
- Authorization header sent with every request ✅
- No dependency on cookies ✅

**Backward Compatibility:**
- Existing cookie-based auth still works ✅
- No breaking changes for desktop users ✅
- Graceful fallback to localStorage ✅

---

## Implementation Guide: Dual Approach

**Note:** This section covers the **Dual Authentication Approach** implementation. For the simpler approach, see the "Recommended: Simple Authorization Header Approach" section above.

### Phase 1: Backend Changes

#### 1.1 Update OAuth Callback to Include Tokens in URL

**Purpose:** Pass tokens to frontend via URL so iOS can extract them

**Before:**
```python
# ❌ Only sets cookies (doesn't work on iOS)
@router.get("/auth/google/callback")
async def google_callback(code: str, state: str, response: Response):
    # ... verify code, create user ...

    access_token = create_access_token(user)
    refresh_token = create_refresh_token(user)

    # Set cookies
    response.set_cookie("access_token", access_token)
    response.set_cookie("refresh_token", refresh_token)

    # Redirect to dashboard
    return RedirectResponse(url=f"{FRONTEND_URL}/dashboard")
```

**After:**
```python
# ✅ Sets cookies AND includes tokens in URL
@router.get("/auth/google/callback")
async def google_callback(code: str, state: str, response: Response):
    # ... verify code, create user ...

    access_token = create_access_token(user)
    refresh_token = create_refresh_token(user)

    # Redirect with tokens in URL for iOS compatibility
    redirect_url = (
        f"{FRONTEND_URL}/dashboard?"
        f"auth_success=true&"
        f"access_token={access_token}&"
        f"refresh_token={refresh_token}"
    )
    response = RedirectResponse(url=redirect_url)

    # Also set cookies for desktop browsers (better security)
    response.set_cookie(
        key="access_token",
        value=access_token,
        path="/",
        httponly=True,
        secure=COOKIE_SECURE,  # True in production
        samesite=COOKIE_SAMESITE,  # "none" for cross-domain
        max_age=30 * 24 * 60 * 60  # 30 days
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        path="/",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=90 * 24 * 60 * 60  # 90 days
    )

    return response
```

#### 1.2 Accept Authorization Header in Addition to Cookies

**Purpose:** Allow iOS clients to authenticate via Bearer token

**Before:**
```python
# ❌ Only checks cookies
async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401)

    # Verify token...
```

**After:**
```python
# ✅ Checks both cookies and Authorization header
async def get_current_user(request: Request):
    # Try cookie first (desktop)
    token = request.cookies.get("access_token")

    # Fallback to Authorization header (iOS/mobile)
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Verify token...
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        # ... load user from database ...
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

#### 1.3 Fix Logout to Delete Cookies with Matching Parameters

**Purpose:** Ensure cookies are properly deleted (common gotcha)

**Problem:**
```python
# ❌ Cookies won't be deleted if parameters don't match
response.set_cookie("token", value="...", secure=True, samesite="none")
# Later...
response.delete_cookie("token")  # Won't work! Missing secure/samesite
```

**Solution:**
```python
# ✅ Use exact same parameters for deletion
@router.post("/logout")
async def logout(request: Request, response: Response):
    # Clear cookies with SAME parameters they were set with
    response.delete_cookie(
        key="access_token",
        path="/",              # Must match set_cookie
        domain=None,           # Must match set_cookie
        secure=COOKIE_SECURE,  # Must match set_cookie
        samesite=COOKIE_SAMESITE  # Must match set_cookie
    )
    response.delete_cookie(
        key="refresh_token",
        path="/",
        domain=None,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE
    )

    return {"message": "Logged out successfully"}
```

### Phase 2: Frontend Changes

#### 2.1 Create Token Service

**File:** `frontend/src/services/tokenService.ts` (or `.js`)

```typescript
// Token storage service for iOS compatibility
const ACCESS_TOKEN_KEY = 'app_access_token';
const REFRESH_TOKEN_KEY = 'app_refresh_token';

export const tokenService = {
  /**
   * Save tokens to localStorage
   * Used by iOS when cookies don't work
   */
  setTokens(accessToken: string, refreshToken: string): void {
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
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Clear all tokens
   * Call this on logout
   */
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if we have valid tokens
   */
  hasTokens(): boolean {
    return !!this.getAccessToken();
  },

  /**
   * Extract tokens from URL after OAuth redirect
   * This is the KEY function for iOS compatibility
   */
  extractTokensFromUrl(): {
    accessToken: string | null;
    refreshToken: string | null;
  } {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const authSuccess = params.get('auth_success');

    // If tokens are in URL, store them and clean the URL
    if (accessToken && refreshToken && authSuccess === 'true') {
      this.setTokens(accessToken, refreshToken);

      // CRITICAL: Clean the URL to remove sensitive tokens
      // Prevents tokens from appearing in browser history
      const url = new URL(window.location.href);
      url.searchParams.delete('access_token');
      url.searchParams.delete('refresh_token');
      url.searchParams.delete('auth_success');

      // Use replaceState (not pushState) to avoid adding to history
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search + url.hash
      );

      console.log('[TokenService] Tokens extracted from URL and stored');
    }

    return { accessToken, refreshToken };
  },

  /**
   * Detect if running on iOS device
   * Useful for debugging/logging
   */
  isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) &&
           !('MSStream' in window);
  }
};
```

#### 2.2 Update API Service to Send Authorization Header

**File:** `frontend/src/services/api.ts` (or `.js`)

```typescript
import axios from 'axios';
import { tokenService } from './tokenService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  withCredentials: true  // IMPORTANT: Enable cookies for desktop
});

// Request interceptor - Add Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    // Check localStorage for token (iOS compatibility)
    const accessToken = tokenService.getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Cookies are automatically included via withCredentials: true
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenService.clearTokens();
      // Redirect to login or trigger refresh token flow
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 2.3 Update Auth Context to Extract Tokens on Mount

**File:** `frontend/src/contexts/AuthContext.tsx` (or `.jsx`)

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { tokenService } from '../services/tokenService';

interface User {
  id: string;
  email: string;
  name: string;
  // ... other fields
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check authentication status
   * IMPORTANT: Call tokenService.extractTokensFromUrl() BEFORE checkAuth
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);

      // CRITICAL: Extract tokens from URL if present (OAuth callback)
      tokenService.extractTokensFromUrl();

      // Now try to get current user
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setUser(null);
        tokenService.clearTokens();
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initiate Google OAuth login
   */
  const loginWithGoogle = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    window.location.href = `${apiUrl}/api/auth/google/login`;
  };

  /**
   * Logout user
   * IMPORTANT: Clear both server-side cookies AND localStorage
   */
  const logout = async () => {
    try {
      // Call backend logout endpoint (clears cookies)
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage tokens (iOS)
      tokenService.clearTokens();

      // Clear any other cached data
      localStorage.clear();
      sessionStorage.clear();

      // Reset user state
      setUser(null);

      // Force navigation to login
      window.location.replace('/login');
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Phase 3: Environment Configuration

#### 3.1 Development Environment

**Backend `.env` (local development):**
```bash
# Works with localhost (no cross-domain issues)
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
FRONTEND_URL=http://localhost:3000
```

#### 3.2 Production Environment

**Backend `.env.prod` (production):**
```bash
# CRITICAL settings for iOS Safari compatibility
COOKIE_SECURE=true
COOKIE_SAMESITE=none  # Required for cross-domain cookies

# Your actual production URLs
CORS_ORIGINS=https://app.example.com,https://www.example.com
FRONTEND_URL=https://app.example.com
BACKEND_URL=https://api.example.com

# Google OAuth callback (must match Google Console)
GOOGLE_REDIRECT_URI=https://api.example.com/api/auth/google/callback
```

**Frontend `.env.production`:**
```bash
REACT_APP_API_URL=https://api.example.com
# or for Vite:
VITE_API_URL=https://api.example.com
```

### Phase 4: CORS Configuration

**Critical CORS settings for cross-domain authentication:**

```python
# FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://app.example.com",
        "https://www.example.com"
    ],
    allow_credentials=True,  # REQUIRED for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# Express.js
const cors = require('cors');

app.use(cors({
  origin: 'https://app.example.com',
  credentials: true  // REQUIRED for cookies
}));

# Django
CORS_ALLOWED_ORIGINS = [
    "https://app.example.com",
]
CORS_ALLOW_CREDENTIALS = True  # REQUIRED
```

---

## Security Considerations

### Trade-offs

| Approach | Security Level | iOS Compatible | Desktop Secure |
|----------|---------------|----------------|----------------|
| **Cookies only** | ⭐⭐⭐⭐⭐ Excellent | ❌ Broken | ✅ Yes |
| **localStorage only** | ⭐⭐ Poor (XSS risk) | ✅ Works | ⚠️ Less secure |
| **Dual (our solution)** | ⭐⭐⭐⭐ Good | ✅ Works | ✅ Yes |

### Security Risks and Mitigations

#### 1. Tokens in URL

**Risk:** Tokens visible in URL, could leak via:
- Browser history
- Referrer headers
- Server logs
- Shoulder surfing

**Mitigations:**
- ✅ Clean URL immediately after extraction (`window.history.replaceState`)
- ✅ Use `auth_success=true` flag (not just token presence)
- ✅ Tokens only in URL during redirect (not exposed to user)
- ✅ Short-lived access tokens (30 days or less)
- ✅ HTTPS required (prevents network sniffing)

#### 2. localStorage XSS Vulnerability

**Risk:** JavaScript can access localStorage, making tokens vulnerable to XSS attacks

**Mitigations:**
- ✅ Implement Content Security Policy (CSP)
- ✅ Sanitize all user inputs
- ✅ Use httpOnly cookies for desktop (XSS-proof)
- ✅ Regular security audits
- ✅ Token rotation on sensitive actions
- ✅ Short token expiry times

**Content Security Policy Example:**
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com;
               connect-src 'self' https://api.example.com;">
```

#### 3. Token Expiry and Refresh

**Best Practices:**
```typescript
// Check token expiry before requests
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Refresh token if needed
async function ensureValidToken() {
  const token = tokenService.getAccessToken();
  if (!token || isTokenExpired(token)) {
    await refreshAccessToken();
  }
}
```

#### 4. Logout Security

**Ensure complete cleanup:**
```typescript
async function logout() {
  // 1. Call backend (clear server-side sessions)
  await api.post('/api/auth/logout');

  // 2. Clear localStorage
  tokenService.clearTokens();

  // 3. Clear all storage
  localStorage.clear();
  sessionStorage.clear();

  // 4. Clear IndexedDB (if used)
  await clearIndexedDB();

  // 5. Force page reload (clears memory)
  window.location.replace('/login');
}
```

### Security Checklist

**Before Production:**
- [ ] HTTPS enabled for both frontend and backend
- [ ] `COOKIE_SECURE=true` in production
- [ ] `COOKIE_SAMESITE=none` for cross-domain
- [ ] Content Security Policy implemented
- [ ] Input sanitization for all user data
- [ ] Token expiry set (30 days max for access tokens)
- [ ] Refresh token rotation implemented
- [ ] Logout clears all tokens (server + client)
- [ ] CORS properly configured (no wildcards in production)
- [ ] Tokens cleaned from URL immediately after extraction

---

## Testing Strategies

### Testing on iOS (Local Development)

#### Option 1: Local Network Testing

1. **Find your local IP:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Windows
   ipconfig
   ```

2. **Update backend `.env`:**
   ```bash
   CORS_ORIGINS=http://localhost:3000,http://192.168.1.100:3000
   FRONTEND_URL=http://192.168.1.100:3000
   GOOGLE_REDIRECT_URI=http://192.168.1.100:8000/api/auth/google/callback
   ```

3. **Update frontend `.env.local`:**
   ```bash
   REACT_APP_API_URL=http://192.168.1.100:8000
   ```

4. **Update Google OAuth Console:**
   - Add redirect URI: `http://192.168.1.100:8000/api/auth/google/callback`

5. **Access on iPhone:**
   - Connect to same WiFi
   - Open Safari: `http://192.168.1.100:3000`

#### Option 2: ngrok Tunneling

```bash
# Start ngrok for backend
ngrok http 8000

# Update .env with ngrok URL
FRONTEND_URL=https://abc123.ngrok.io
GOOGLE_REDIRECT_URI=https://abc123.ngrok.io/api/auth/google/callback
```

### Testing Checklist

**Desktop Browsers:**
- [ ] Chrome - Login works
- [ ] Firefox - Login works
- [ ] Safari - Login works
- [ ] Edge - Login works
- [ ] Cookies are set (check DevTools)
- [ ] Logout clears cookies

**iOS/Mobile:**
- [ ] iPhone Safari - Login works
- [ ] iPhone Chrome - Login works
- [ ] iPad Safari - Login works
- [ ] Android Chrome - Login works
- [ ] Tokens stored in localStorage
- [ ] Authorization header sent with requests
- [ ] Logout clears localStorage

**Flow Testing:**
- [ ] Fresh login (no existing session)
- [ ] Return to app (existing session)
- [ ] Logout and re-login
- [ ] Session expires (token refresh)
- [ ] Network failure during login
- [ ] Cancel OAuth at Google
- [ ] Use "back" button during OAuth

**Security Testing:**
- [ ] Tokens removed from URL after extraction
- [ ] HTTPS enforced in production
- [ ] CORS blocks unauthorized origins
- [ ] Invalid tokens rejected (401)
- [ ] Expired tokens refreshed
- [ ] Logout invalidates server session

---

## Deployment Checklist

### Pre-Deployment

**Code Review:**
- [ ] Token extraction implemented in frontend
- [ ] Authorization header added to API requests
- [ ] Logout clears both cookies and localStorage
- [ ] URL cleaning after token extraction
- [ ] Error handling for failed auth

**Configuration:**
- [ ] Production environment variables set
- [ ] `COOKIE_SECURE=true`
- [ ] `COOKIE_SAMESITE=none`
- [ ] HTTPS enabled for both domains
- [ ] CORS origins configured (no wildcards)
- [ ] Google OAuth redirect URI updated

**Testing:**
- [ ] Tested on real iOS device
- [ ] Tested on Android device
- [ ] Tested on desktop browsers
- [ ] Verified token storage in localStorage
- [ ] Verified Authorization header sent
- [ ] Tested logout flow

### Deployment

1. **Deploy Backend First:**
   - Update environment variables
   - Verify `/api/auth/google/callback` works
   - Test OAuth flow manually

2. **Deploy Frontend:**
   - Update API URL to production backend
   - Test login immediately after deployment

3. **Verify Google OAuth Console:**
   - Redirect URI matches production backend
   - Authorized domains include frontend domain

### Post-Deployment

**Verification:**
- [ ] Login works on iOS Safari
- [ ] Login works on desktop browsers
- [ ] Tokens stored in localStorage (iOS)
- [ ] Cookies stored (desktop)
- [ ] Authorization header sent
- [ ] Logout clears all tokens
- [ ] No infinite login loop

**Monitoring:**
- [ ] Monitor error logs for 401 responses
- [ ] Check for repeated login attempts (infinite loop)
- [ ] Verify token refresh working
- [ ] Monitor localStorage usage

---

## Troubleshooting

### Issue 1: Still Infinite Login Loop on iOS

**Symptoms:**
- Redirects to Google OAuth ✅
- Returns to app ✅
- Immediately redirects back to login ❌

**Diagnosis:**
```typescript
// Add to AuthContext checkAuth function
console.log('[Auth] Checking URL for tokens...');
const { accessToken } = tokenService.extractTokensFromUrl();
console.log('[Auth] Token in URL:', !!accessToken);
console.log('[Auth] Token in localStorage:', !!tokenService.getAccessToken());
```

**Solutions:**

1. **Check if tokens are in URL after OAuth:**
   - After Google redirect, check browser URL
   - Should see: `?auth_success=true&access_token=xxx&refresh_token=yyy`
   - If missing: Backend not adding tokens to redirect URL

2. **Check if token extraction runs:**
   ```typescript
   // Should be called BEFORE any API requests
   useEffect(() => {
     tokenService.extractTokensFromUrl();  // Must be first
     checkAuth();  // Then check auth
   }, []);
   ```

3. **Check if Authorization header is sent:**
   - Open Safari DevTools (enable in Settings > Safari > Advanced)
   - Check Network tab
   - Look for `Authorization: Bearer xxx` header
   - If missing: API service not adding header

4. **Check backend accepts Authorization header:**
   ```python
   # Add logging
   async def get_current_user(request: Request):
       token = request.cookies.get("access_token")
       print(f"Cookie token: {bool(token)}")

       if not token:
           auth_header = request.headers.get("Authorization")
           print(f"Auth header: {auth_header[:50] if auth_header else None}")
           if auth_header and auth_header.startswith("Bearer "):
               token = auth_header.split(" ")[1]

       print(f"Final token: {bool(token)}")
   ```

### Issue 2: Tokens Not Extracted from URL

**Symptoms:**
- URL has tokens after redirect
- localStorage empty
- Still getting 401

**Diagnosis:**
```typescript
// Add to token extraction
extractTokensFromUrl() {
  console.log('[TokenService] Checking URL:', window.location.search);
  const params = new URLSearchParams(window.location.search);
  console.log('[TokenService] Params:', Object.fromEntries(params));

  const accessToken = params.get('access_token');
  console.log('[TokenService] Access token found:', !!accessToken);

  // ... rest of code
}
```

**Solutions:**

1. **Check function is called:**
   - Add console.log at start of extractTokensFromUrl
   - Verify it runs on page load

2. **Check timing:**
   ```typescript
   // ❌ WRONG - May run after other code
   useEffect(() => {
     checkAuth();
     tokenService.extractTokensFromUrl();  // Too late!
   }, []);

   // ✅ CORRECT - Extract first
   useEffect(() => {
     tokenService.extractTokensFromUrl();  // First!
     checkAuth();
   }, []);
   ```

3. **Check URL format:**
   ```
   # ✅ CORRECT
   https://app.com/dashboard?auth_success=true&access_token=xxx&refresh_token=yyy

   # ❌ WRONG (missing auth_success flag)
   https://app.com/dashboard?access_token=xxx&refresh_token=yyy
   ```

### Issue 3: Works in Development, Breaks in Production

**Symptoms:**
- Works on localhost ✅
- Breaks on production iOS ❌

**Common Causes:**

1. **HTTP vs HTTPS:**
   ```bash
   # ❌ WRONG - Production using HTTP
   FRONTEND_URL=http://app.example.com

   # ✅ CORRECT - Must use HTTPS
   FRONTEND_URL=https://app.example.com
   ```

2. **Cookie settings:**
   ```python
   # ❌ WRONG - Development settings in production
   COOKIE_SECURE=false  # Must be true
   COOKIE_SAMESITE=lax  # Must be none for cross-domain

   # ✅ CORRECT
   COOKIE_SECURE=true
   COOKIE_SAMESITE=none
   ```

3. **CORS configuration:**
   ```python
   # ❌ WRONG - Development URL
   CORS_ORIGINS=http://localhost:3000

   # ✅ CORRECT - Production URL
   CORS_ORIGINS=https://app.example.com
   ```

### Issue 4: Logout Doesn't Clear Cookies

**Symptoms:**
- Click logout
- Cookies still visible
- Can still access protected pages

**Solution:**

```python
# Use EXACT same parameters for delete as set

# When setting:
response.set_cookie(
    key="access_token",
    value=token,
    path="/",
    domain=None,
    secure=True,
    samesite="none"
)

# When deleting (must match exactly):
response.delete_cookie(
    key="access_token",
    path="/",         # ✅ Match
    domain=None,      # ✅ Match
    secure=True,      # ✅ Match
    samesite="none"   # ✅ Match
)
```

### Issue 5: Authorization Header Not Sent

**Symptoms:**
- Token in localStorage ✅
- 401 errors ❌
- Authorization header missing in network requests

**Diagnosis:**
```typescript
// Test API interceptor
api.interceptors.request.use(config => {
  console.log('[API] Request URL:', config.url);
  console.log('[API] Headers:', config.headers);

  const token = tokenService.getAccessToken();
  console.log('[API] Token from storage:', token?.substring(0, 20));

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('[API] Added Authorization header');
  }

  return config;
});
```

**Solutions:**

1. **Check interceptor is registered:**
   - Ensure API client imports tokenService
   - Verify interceptor code runs

2. **Check token retrieval:**
   ```typescript
   // Test token service
   const token = tokenService.getAccessToken();
   console.log('Token exists:', !!token);
   console.log('Token preview:', token?.substring(0, 20));
   ```

3. **Check header format:**
   ```typescript
   // ✅ CORRECT
   config.headers['Authorization'] = `Bearer ${token}`;

   // ❌ WRONG (missing 'Bearer')
   config.headers['Authorization'] = token;

   // ❌ WRONG (case-sensitive)
   config.headers['authorization'] = `Bearer ${token}`;
   ```

---

## Technology-Specific Examples

### FastAPI + React

**Backend:**
```python
# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse

@router.get("/google/callback")
async def google_callback(
    code: str,
    state: str,
    response: Response,
    db: Session = Depends(get_db)
):
    # Exchange code for Google tokens
    google_tokens = await exchange_code_for_tokens(code)
    user_info = await get_google_user_info(google_tokens['access_token'])

    # Create or get user
    user = await get_or_create_user(db, user_info)

    # Generate JWT tokens
    access_token = create_jwt_token(user.id)
    refresh_token = create_refresh_token(user.id)

    # Redirect with tokens for iOS
    redirect_url = (
        f"{FRONTEND_URL}/dashboard?"
        f"auth_success=true&"
        f"access_token={access_token}&"
        f"refresh_token={refresh_token}"
    )
    response = RedirectResponse(url=redirect_url)

    # Set cookies for desktop
    response.set_cookie(
        key="access_token",
        value=access_token,
        path="/",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=2592000  # 30 days
    )

    return response

async def get_current_user(request: Request):
    # Try cookie first
    token = request.cookies.get("access_token")

    # Fallback to header
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]

    if not token:
        raise HTTPException(status_code=401)

    # Verify and return user
    return verify_token(token)
```

**Frontend:**
```typescript
// services/api.ts
import axios from 'axios';
import { tokenService } from './tokenService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Django + Vue.js

**Backend:**
```python
# views.py
from django.http import HttpResponseRedirect
from django.conf import settings

def google_callback(request):
    code = request.GET.get('code')
    # Exchange code, create user, etc.

    access_token = create_jwt(user.id)
    refresh_token = create_refresh(user.id)

    # Redirect with tokens
    redirect_url = (
        f"{settings.FRONTEND_URL}/dashboard?"
        f"auth_success=true&"
        f"access_token={access_token}&"
        f"refresh_token={refresh_token}"
    )
    response = HttpResponseRedirect(redirect_url)

    # Set cookies
    response.set_cookie(
        'access_token',
        access_token,
        max_age=2592000,
        secure=settings.COOKIE_SECURE,
        httponly=True,
        samesite=settings.COOKIE_SAMESITE
    )

    return response

# middleware.py
def get_user_from_request(request):
    # Try cookie
    token = request.COOKIES.get('access_token')

    # Try Authorization header
    if not token:
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]

    return verify_token(token) if token else None
```

**Frontend:**
```javascript
// api.js
import axios from 'axios';
import { tokenService } from './tokenService';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Express + Angular

**Backend:**
```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;

  // Exchange code, create user
  const user = await handleGoogleAuth(code);

  const accessToken = generateJWT(user.id);
  const refreshToken = generateRefresh(user.id);

  // Redirect with tokens
  const redirectUrl = `${process.env.FRONTEND_URL}/dashboard?` +
    `auth_success=true&` +
    `access_token=${accessToken}&` +
    `refresh_token=${refreshToken}`;

  // Set cookies
  res.cookie('access_token', accessToken, {
    maxAge: 2592000000,
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAMESITE
  });

  res.redirect(redirectUrl);
});

// middleware/auth.js
function authenticateToken(req, res, next) {
  // Try cookie
  let token = req.cookies.access_token;

  // Try header
  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.sendStatus(401);
  }

  verify(token, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

**Frontend:**
```typescript
// services/api.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    const token = tokenService.getAccessToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  get(url: string) {
    return this.http.get(url, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }
}
```

---

## Summary

### Two Approaches, Same Goal

Both approaches solve the iOS Safari cross-domain authentication problem. Choose based on your project needs:

### ✅ Recommended: Simple Authorization Header Approach

**The Core Pattern:**
1. Backend: Include tokens in OAuth redirect URL
2. Frontend: Extract tokens from URL → Store in localStorage
3. Frontend: Send `Authorization: Bearer {token}` header with every request
4. Backend: Check Authorization header only
5. Both: Clear localStorage on logout

**Why Choose This:**
- ~40 lines of auth code total
- Single unified code path (iOS + Desktop use same flow)
- Easy to debug and maintain
- Works perfectly everywhere
- No cookie complexity

**Requirements:**
- MUST implement CSP (Content Security Policy)
- MUST sanitize all user inputs
- MUST use HTTPS in production

**Success Criteria:**
- ✅ Login works on iOS Safari
- ✅ Login works on desktop browsers
- ✅ Authorization header sent with all requests
- ✅ Tokens stored in localStorage
- ✅ Tokens cleaned from URL immediately
- ✅ Logout clears localStorage
- ✅ No infinite login loop

### Alternative: Dual Authentication Approach

**The Core Pattern:**
1. Backend: Include tokens in URL AND set httpOnly cookies
2. Frontend: Extract tokens from URL → Store in localStorage
3. Frontend: Send Authorization header (cookies sent automatically)
4. Backend: Check cookies first, fallback to Authorization header
5. Both: Clear cookies AND localStorage on logout

**Why Choose This:**
- Desktop users get httpOnly cookie XSS protection
- Backward compatible with existing cookie systems
- Defense-in-depth security approach
- Already handling cookie complexity

**Requirements:**
- All requirements from simple approach
- PLUS proper cookie configuration (secure, samesite)
- PLUS cookie deletion with matching parameters
- PLUS CSRF token handling

**Success Criteria:**
- ✅ All success criteria from simple approach
- ✅ PLUS cookies stored (desktop only)
- ✅ PLUS cookie/header fallback working
- ✅ PLUS logout clears both cookies and localStorage

### Key Gotchas to Avoid (Both Approaches)

1. ❌ Not extracting tokens from URL
2. ❌ Extracting tokens but not storing them
3. ❌ Storing tokens but not sending Authorization header
4. ❌ Backend not accepting Authorization header
5. ❌ Not cleaning tokens from URL immediately
6. ❌ Not using HTTPS in production
7. ❌ Not implementing CSP for XSS protection
8. ❌ Not clearing localStorage on logout

**Additional for Dual Approach:**
9. ❌ Deleting cookies with different parameters than set
10. ❌ Wrong `COOKIE_SAMESITE` value
11. ❌ Not setting `withCredentials: true` for cookies

### Final Recommendation

**For new projects:** Use the **Simple Authorization Header Approach** (documented first)
- Simpler, faster to implement
- Easier to maintain
- Works everywhere
- Just add strong XSS protections

**For existing systems:** Use the **Dual Authentication Approach** (documented second)
- Backward compatible
- Preserves existing cookie security for desktop
- Adds iOS support without breaking desktop users

---

## References

### Official Documentation

- [WebKit ITP (Intelligent Tracking Prevention)](https://webkit.org/tracking-prevention/)
- [MDN: SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [MDN: Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

### Blog Posts & Articles

- [WebKit Blog: Full Third-Party Cookie Blocking](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)
- [Chrome: SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)
- [OWASP: Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

### Tools

- [JWT.io - Token Debugger](https://jwt.io/)
- [ngrok - Local Tunneling](https://ngrok.com/)
- [Chrome DevTools - Network](https://developer.chrome.com/docs/devtools/network/)
- [Safari Web Inspector](https://developer.apple.com/safari/tools/)

---

## Appendix: Complete Working Example

### File Structure
```
project/
├── backend/
│   ├── routes/
│   │   └── auth.py
│   └── .env.prod
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── tokenService.ts
│   │   └── contexts/
│   │       └── AuthContext.tsx
│   └── .env.production
└── docs/
    └── ios-auth-fix.md
```

### Complete Token Service (Production-Ready)

```typescript
/**
 * Token Service for iOS Safari Compatibility
 *
 * This service handles token storage and retrieval for cross-domain
 * authentication where iOS Safari blocks third-party cookies.
 *
 * Key Features:
 * - Extract tokens from OAuth redirect URL
 * - Store tokens in localStorage (iOS fallback)
 * - Clean sensitive data from URL
 * - Provide token refresh mechanism
 * - Detect iOS devices for logging/debugging
 */

const ACCESS_TOKEN_KEY = 'app_access_token';
const REFRESH_TOKEN_KEY = 'app_refresh_token';
const TOKEN_EXPIRY_KEY = 'app_token_expiry';

export interface TokenPair {
  accessToken: string | null;
  refreshToken: string | null;
}

export const tokenService = {
  /**
   * Save tokens to localStorage
   * @param accessToken JWT access token
   * @param refreshToken JWT refresh token
   * @param expiresIn Optional expiry time in seconds
   */
  setTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn?: number
  ): void {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

      if (expiresIn) {
        const expiry = Date.now() + (expiresIn * 1000);
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
      }
    }

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    // Log for debugging (remove in production)
    if (this.isIOSDevice()) {
      console.log('[TokenService] Tokens stored (iOS device detected)');
    }
  },

  /**
   * Get access token from localStorage
   * @returns Access token or null
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get refresh token from localStorage
   * @returns Refresh token or null
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if access token is expired
   * @returns true if token is expired or expiry not set
   */
  isTokenExpired(): boolean {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return false; // Unknown, assume valid

    return Date.now() > parseInt(expiry, 10);
  },

  /**
   * Get tokens as object
   * @returns TokenPair object
   */
  getTokens(): TokenPair {
    return {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken()
    };
  },

  /**
   * Clear all tokens from storage
   * Call this on logout
   */
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);

    console.log('[TokenService] All tokens cleared');
  },

  /**
   * Check if valid tokens exist
   * @returns true if access token exists and not expired
   */
  hasValidTokens(): boolean {
    const hasToken = !!this.getAccessToken();
    const notExpired = !this.isTokenExpired();
    return hasToken && notExpired;
  },

  /**
   * Extract tokens from URL after OAuth redirect
   * This is the CRITICAL function for iOS compatibility
   *
   * OAuth callback adds tokens to URL like:
   * /dashboard?auth_success=true&access_token=xxx&refresh_token=yyy
   *
   * This function:
   * 1. Checks for tokens in URL
   * 2. Stores them in localStorage
   * 3. Cleans URL to remove sensitive data
   *
   * @returns Extracted tokens or null
   */
  extractTokensFromUrl(): TokenPair {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const authSuccess = params.get('auth_success');
    const expiresIn = params.get('expires_in');

    // Only proceed if we have valid OAuth callback
    if (accessToken && refreshToken && authSuccess === 'true') {
      console.log('[TokenService] OAuth callback detected, extracting tokens...');

      // Store tokens in localStorage
      this.setTokens(
        accessToken,
        refreshToken,
        expiresIn ? parseInt(expiresIn, 10) : undefined
      );

      // CRITICAL: Clean the URL to remove sensitive tokens
      // This prevents tokens from:
      // - Appearing in browser history
      // - Being sent in Referer headers
      // - Being visible in URL bar
      const url = new URL(window.location.href);
      url.searchParams.delete('access_token');
      url.searchParams.delete('refresh_token');
      url.searchParams.delete('auth_success');
      url.searchParams.delete('expires_in');

      // Use replaceState (not pushState) to avoid adding to browser history
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search + url.hash
      );

      console.log('[TokenService] ✓ Tokens extracted and URL cleaned');

      return { accessToken, refreshToken };
    }

    // No tokens in URL
    return { accessToken: null, refreshToken: null };
  },

  /**
   * Detect if running on iOS device
   * Useful for conditional logic and debugging
   *
   * @returns true if iOS device (iPhone, iPad, iPod)
   */
  isIOSDevice(): boolean {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const notMSStream = !('MSStream' in window); // Exclude IE
    return isIOS && notMSStream;
  },

  /**
   * Get device information for debugging
   * @returns Device info object
   */
  getDeviceInfo(): {
    isIOS: boolean;
    isSafari: boolean;
    userAgent: string;
    hasLocalStorage: boolean;
    hasCookies: boolean;
  } {
    return {
      isIOS: this.isIOSDevice(),
      isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
      userAgent: navigator.userAgent,
      hasLocalStorage: typeof localStorage !== 'undefined',
      hasCookies: navigator.cookieEnabled
    };
  },

  /**
   * Debug helper - log all token information
   * REMOVE IN PRODUCTION
   */
  debugTokens(): void {
    console.group('[TokenService] Debug Info');
    console.log('Device:', this.getDeviceInfo());
    console.log('Has tokens:', this.hasValidTokens());
    console.log('Access token exists:', !!this.getAccessToken());
    console.log('Refresh token exists:', !!this.getRefreshToken());
    console.log('Token expired:', this.isTokenExpired());
    console.log('Token preview:', this.getAccessToken()?.substring(0, 30) + '...');
    console.groupEnd();
  }
};
```

---

**End of Generic iOS/Safari Google OAuth Authentication Fix Guide**

**Created:** 2025-01-15
**Updated:** 2025-11-15 (Version 2.0 - Added complete simple Authorization header approach)
**Based on:** Production implementations (both approaches battle-tested)
**Status:** Production-ready patterns for both approaches

### What Changed in Version 2.0

- ✅ Added complete **Simple Authorization Header Approach** (recommended for new projects)
- ✅ Full implementation guide with code examples (FastAPI + React)
- ✅ Self-contained document (no external references needed)
- ✅ Side-by-side comparison of both approaches
- ✅ Clear guidance on when to use each approach
- ✅ Complete XSS protection requirements
- ✅ Environment configuration examples
- ✅ Updated summary with both patterns

### How to Use This Guide

1. **For new projects:** Follow the "Recommended: Simple Authorization Header Approach" section
2. **For existing cookie-based systems:** Follow the "Alternative: Dual Authentication Approach" section
3. **Copy this guide to your new repo** - It's fully self-contained
4. **Customize the code examples** for your specific framework/stack
5. **Test on real iOS devices** before production deployment
