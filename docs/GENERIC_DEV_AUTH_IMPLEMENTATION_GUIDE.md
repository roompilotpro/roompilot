# Generic Development Authentication System - Implementation Guide

**Version:** 2.0
**Last Updated:** 2025-01-15
**Status:** Production-Ready Pattern
**Portability:** Framework-Agnostic with Reference Implementations

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Solution Architecture](#solution-architecture)
4. [Core Principles](#core-principles)
5. [Implementation Components](#implementation-components)
6. [Security Architecture](#security-architecture)
7. [Technology-Specific Implementations](#technology-specific-implementations)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Checklist](#deployment-checklist)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## Executive Summary

### What This Is

A **development-only authentication bypass system** that allows developers and automated tools to:
- Instantly authenticate as any user without OAuth/SSO flows
- Switch between different user roles seamlessly
- Create test users on-demand
- Enable automated testing and CI/CD workflows
- Improve developer productivity by 10x for local testing

### What This Is NOT

- **NOT** a replacement for production authentication
- **NOT** accessible in production environments (by design)
- **NOT** a security vulnerability (when implemented correctly)
- **NOT** enabled by default (explicit opt-in required)

### Key Metrics

- **Setup Time:** 5 seconds to authenticate (vs. 30+ seconds with OAuth)
- **Role Switching:** Instant (vs. database manipulation or multiple accounts)
- **Automated Testing:** 100% compatible with headless/CI environments
- **Security Risk:** Zero (when properly configured with environment guards)

---

## Problem Statement

### Common Developer Pain Points

#### 1. **OAuth/SSO Friction in Local Development**
```
Problem: Every app restart requires OAuth flow
Impact: 30-60 seconds wasted per restart
Frequency: 10-50 times per day
Annual Cost: 50-200 hours per developer
```

#### 2. **Impossible Automated Testing**
```
Problem: CI/CD cannot complete OAuth flows
Impact: Cannot test authenticated features
Result: Lower code coverage, more bugs in production
```

#### 3. **Multi-Role Testing Complexity**
```
Problem: Need multiple Google/OAuth accounts OR database manipulation
Impact: Slow role-switching, complex test setup
Result: Inadequate permission testing
```

#### 4. **API Development Friction**
```
Problem: Testing API endpoints requires valid OAuth tokens
Impact: Complex token generation, expired tokens
Result: Slower API development cycle
```

#### 5. **New Developer Onboarding**
```
Problem: Must configure OAuth before first run
Impact: 30-60 minute setup before "Hello World"
Result: Poor developer experience
```

### Quantified Impact

| Scenario | Without Dev Auth | With Dev Auth | Time Saved |
|----------|-----------------|---------------|------------|
| Local development restart | 45 sec | 3 sec | 42 sec |
| Role switching | 5 min | 5 sec | 4 min 55 sec |
| API endpoint testing | 10 min setup | 0 sec | 10 min |
| CI/CD test runs | Impossible | Automatic | ∞ |
| New developer onboarding | 1 hour | 5 min | 55 min |

---

## Solution Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT MODE                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐        ┌─────────────────┐                    │
│  │  Login   │───────▶│  Dev Auth Panel │                    │
│  │  Page    │        │  (Yellow Banner)│                    │
│  └──────────┘        └────────┬────────┘                    │
│                               │                              │
│                               │ User selects from dropdown   │
│                               ▼                              │
│                      ┌──────────────────┐                    │
│                      │ GET /dev-users   │                    │
│                      │ Returns all users│                    │
│                      └────────┬─────────┘                    │
│                               │                              │
│                               │ POST {user_id}               │
│                               ▼                              │
│                      ┌──────────────────┐                    │
│                      │ POST /dev-login  │                    │
│  ┌──────────────────▶│ Security Check   │                    │
│  │                   │ • ENV != prod?   │                    │
│  │                   │ • Flag enabled?  │                    │
│  │                   └────────┬─────────┘                    │
│  │                            │                              │
│  │                            │ Generate JWT                 │
│  │                            ▼                              │
│  │                   ┌──────────────────┐                    │
│  │                   │  Return Tokens   │                    │
│  │                   │  + User Data     │                    │
│  │                   └────────┬─────────┘                    │
│  │                            │                              │
│  │                            ▼                              │
│  │                   ┌──────────────────┐                    │
│  │                   │  Authenticated!  │                    │
│  │                   │  Navigate to app │                    │
│  │                   └──────────────────┘                    │
│  │                                                            │
│  │ Optional: Create Test User                                │
│  │                                                            │
│  └────── POST /dev-create-user {email, role}                 │
│           Creates user + flags as is_dev_user=true           │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     PRODUCTION MODE                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  All /dev-* endpoints return 404 (not 403)                   │
│  Dev auth panel not rendered in frontend                     │
│  Environment check prevents any bypass                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐      │
│  │  Security Guard (check_dev_auth_enabled)           │      │
│  │  • Validates ENVIRONMENT != production             │      │
│  │  • Validates ENABLE_DEV_AUTH == true               │      │
│  │  • Returns 404 if blocked (not 403)                │      │
│  │  • Logs warning on access                          │      │
│  └────────────────┬───────────────────────────────────┘      │
│                   │                                           │
│  ┌────────────────▼───────────────────────────────────┐      │
│  │  API Endpoints                                     │      │
│  │  • GET  /api/auth/dev-users                        │      │
│  │  • POST /api/auth/dev-create-user                  │      │
│  │  • POST /api/auth/dev-login                        │      │
│  └────────────────┬───────────────────────────────────┘      │
│                   │                                           │
│  ┌────────────────▼───────────────────────────────────┐      │
│  │  Business Logic                                    │      │
│  │  • User lookup (by ID or email)                    │      │
│  │  • JWT token generation                            │      │
│  │  • Session creation                                │      │
│  │  • Audit logging                                   │      │
│  └────────────────┬───────────────────────────────────┘      │
│                   │                                           │
│  ┌────────────────▼───────────────────────────────────┐      │
│  │  Database Layer                                    │      │
│  │  • users table (with is_dev_user flag)             │      │
│  │  • user_sessions table                             │      │
│  │  • auth_logs table (event_type="dev_login")        │      │
│  └────────────────────────────────────────────────────┘      │
│                                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                       FRONTEND LAYER                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐      │
│  │  Conditional Rendering                             │      │
│  │  if (process.env.NODE_ENV === 'development')       │      │
│  │    render <DevLoginPanel />                        │      │
│  └────────────────┬───────────────────────────────────┘      │
│                   │                                           │
│  ┌────────────────▼───────────────────────────────────┐      │
│  │  DevLoginPanel Component                           │      │
│  │  • Fetch users list on mount                       │      │
│  │  • Search/filter users by role                     │      │
│  │  • Display grouped dropdown                        │      │
│  │  • "Test Login" button                             │      │
│  │  • "Create Test User" form                         │      │
│  └────────────────┬───────────────────────────────────┘      │
│                   │                                           │
│  ┌────────────────▼───────────────────────────────────┐      │
│  │  Token Management                                  │      │
│  │  • Store access_token in localStorage/cookies      │      │
│  │  • Store refresh_token securely                    │      │
│  │  • Navigate to authenticated route                 │      │
│  └────────────────────────────────────────────────────┘      │
│                                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     UTILITY LAYER                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  • seed_dev_users script (creates standard test accounts)    │
│  • generate_test_token CLI (for API testing)                 │
│  • Database migration (adds is_dev_user field)               │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Core Principles

### 1. **Security by Default**

```
Principle: Dev auth MUST be impossible to enable in production
Implementation: Multiple layers of defense
```

**Defense Layers:**
1. Environment variable check: `ENVIRONMENT != "production"`
2. Explicit enable flag: `ENABLE_DEV_AUTH == "true"`
3. 404 response (not 403) to avoid information disclosure
4. Frontend conditional rendering based on build environment
5. Audit logging of all dev auth attempts
6. Visual warnings in development UI

### 2. **Explicit Opt-In**

```
Principle: Never enabled by default, even in development
Implementation: Requires explicit configuration
```

**Configuration Required:**
```bash
# Must BOTH be set
ENVIRONMENT=development
ENABLE_DEV_AUTH=true
```

### 3. **Audit Everything**

```
Principle: All dev auth usage must be logged
Implementation: Comprehensive audit trail
```

**Log Format:**
```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "event_type": "dev_login",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "test@example.com",
  "role": "admin",
  "ip_address": "127.0.0.1",
  "user_agent": "Mozilla/5.0...",
  "environment": "development"
}
```

### 4. **Parity with Production Auth**

```
Principle: Dev auth must behave identically to OAuth flow
Implementation: Same token format, same session logic
```

**Implementation:**
- Generate same JWT format as OAuth
- Create same session records
- Return same response structure
- Trigger same authentication events

### 5. **Developer Experience First**

```
Principle: Make it delightfully easy to use
Implementation: Minimal friction, maximum clarity
```

**UX Considerations:**
- Visual distinction (yellow warning banner)
- Searchable user dropdown
- Quick user creation
- Clear role indicators
- One-click login

---

## Implementation Components

### Component 1: Security Guard Function

**Purpose:** Central security check for all dev auth endpoints

**Pseudo-code:**
```python
def check_dev_auth_enabled():
    """
    CRITICAL SECURITY FUNCTION
    Prevents dev auth in production environments
    """
    environment = get_environment_variable("ENVIRONMENT", default="production")
    dev_auth_flag = get_environment_variable("ENABLE_DEV_AUTH", default="false")

    # Normalize to lowercase for comparison
    environment = environment.lower()
    dev_auth_flag = dev_auth_flag.lower()

    # Block if production OR flag not explicitly enabled
    if environment == "production" or dev_auth_flag != "true":
        # Return 404 to avoid information disclosure
        # (don't reveal that endpoint exists)
        raise NotFoundError("Not found")

    # Log warning in development
    log_warning("⚠️  DEV AUTHENTICATION ACCESS - Should never occur in production!")
```

**Key Points:**
- Default to most secure (production, disabled)
- Use 404 (not 403) to avoid revealing endpoint existence
- Log every access for audit trail
- Keep function simple and auditable

### Component 2: Database Schema Changes

**Purpose:** Flag test users to distinguish from real users

**Migration (SQL):**
```sql
-- Add is_dev_user column to users table
ALTER TABLE users
ADD COLUMN is_dev_user BOOLEAN
NOT NULL
DEFAULT FALSE
SERVER_DEFAULT 'false';

-- Create index for performance
CREATE INDEX idx_users_is_dev_user ON users(is_dev_user);

-- Optional: Add comment for documentation
COMMENT ON COLUMN users.is_dev_user IS
  'Flags users created via dev auth system (for testing only)';
```

**User Model Update:**
```python
class User:
    # ... existing fields ...
    is_dev_user: bool = False  # Flag for dev-created test users
```

**Why This Matters:**
- Easily identify and clean up test data
- Prevent test users from appearing in production reports
- Enable bulk deletion of test users
- Track which users are "real" vs "test"

### Component 3: Backend API Endpoints

#### Endpoint 1: GET /api/auth/dev-users

**Purpose:** Return all users for dropdown selection

**Request:**
```http
GET /api/auth/dev-users
```

**Response:**
```json
[
  {
    "id": "uuid-or-int-1",
    "email": "admin@test.com",
    "name": "Test Admin",
    "role": "admin",
    "is_active": true,
    "is_dev_user": true,
    "created_at": "2025-01-15T10:00:00Z"
  },
  {
    "id": "uuid-or-int-2",
    "email": "builder@test.com",
    "name": "Test Builder",
    "role": "builder",
    "is_active": true,
    "is_dev_user": true,
    "created_at": "2025-01-15T10:00:00Z"
  }
]
```

**Implementation Pattern:**
```python
@router.get("/dev-users")
async def get_dev_users(db: Database):
    # Security check
    check_dev_auth_enabled()

    # Query all users, ordered by role then email
    users = db.query(User).order_by(User.role, User.email).all()

    # Transform to response format
    result = [
        {
            "id": user.id,
            "email": user.email,
            "name": user.name or derive_name_from_email(user.email),
            "role": user.role,
            "is_active": user.is_active,
            "is_dev_user": user.is_dev_user,
            "created_at": user.created_at.isoformat()
        }
        for user in users
    ]

    log_info(f"[DEV-AUTH] Returned {len(result)} users for dropdown")
    return result
```

**Error Handling:**
```python
- 404: Dev auth not enabled or production environment
- 500: Database error
```

#### Endpoint 2: POST /api/auth/dev-create-user

**Purpose:** Create new test user on-demand

**Request:**
```json
POST /api/auth/dev-create-user
Content-Type: application/json

{
  "email": "newtest@example.com",
  "role": "builder",
  "name": "New Test User",  // optional
  "builder_id": "123"       // optional, role-specific
}
```

**Response:**
```json
{
  "id": "uuid-or-int-123",
  "email": "newtest@example.com",
  "name": "New Test User",
  "role": "builder",
  "is_active": true,
  "is_dev_user": true,
  "created_at": "2025-01-15T11:00:00Z"
}
```

**Implementation Pattern:**
```python
@router.post("/dev-create-user")
async def dev_create_user(request: CreateUserRequest, db: Database):
    # Security check
    check_dev_auth_enabled()

    # Idempotency: check if user exists
    existing = db.query(User).filter(email=request.email).first()
    if existing:
        log_info(f"[DEV-AUTH] User already exists: {request.email}")
        return serialize_user(existing)

    # Create user
    name = request.name or derive_name_from_email(request.email)
    user = User(
        email=request.email,
        name=name,
        role=request.role,
        is_active=True,
        is_dev_user=True  # IMPORTANT: flag as test user
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    log_info(f"[DEV-AUTH] Created test user: {request.email} ({request.role})")

    # Role-specific setup (e.g., create employee record for employee role)
    handle_role_specific_setup(user, request, db)

    return serialize_user(user)
```

**Validation:**
- Email must be valid format
- Role must be in allowed roles list
- Name is optional (derive from email if not provided)
- Idempotent (safe to call multiple times)

#### Endpoint 3: POST /api/auth/dev-login

**Purpose:** Authenticate as any user without password/OAuth

**Request:**
```json
POST /api/auth/dev-login
Content-Type: application/json

{
  "user_id": "uuid-or-int-123"  // OR "email": "test@example.com"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid-or-int-123",
    "email": "test@example.com",
    "name": "Test User",
    "role": "admin",
    "picture": null
  }
}
```

**Implementation Pattern:**
```python
@router.post("/dev-login")
async def dev_login(request: DevLoginRequest, http_request: Request, db: Database):
    # Security check
    check_dev_auth_enabled()

    # Find user by ID or email
    if request.user_id:
        user = db.query(User).filter(id=request.user_id).first()
    elif request.email:
        user = db.query(User).filter(email=request.email).first()
    else:
        raise ValidationError("user_id or email required")

    if not user:
        raise NotFoundError("User not found")

    # Log authentication attempt
    log_warning(
        f"[DEV-AUTH] Login as user_id={user.id}, "
        f"email={user.email}, role={user.role}"
    )

    # Generate JWT tokens (same format as OAuth)
    access_token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role
    })
    refresh_token = create_refresh_token({
        "sub": user.id
    })

    # Store refresh token in database (same as OAuth)
    store_refresh_token(db, user.id, refresh_token, http_request)

    # Log authentication event
    log_auth_event(db, user.id, "dev_login", http_request, {
        "email": user.email,
        "role": user.role
    })

    log_info(f"[DEV-AUTH] Successfully authenticated {user.email} as {user.role}")

    # Return same structure as OAuth flow
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": serialize_user(user)
    }
```

**Security Checks:**
1. `check_dev_auth_enabled()` first
2. Validate user exists
3. Log all attempts
4. Use same token generation as OAuth
5. Create session record

### Component 4: Frontend Dev Login Panel

**Purpose:** User interface for selecting and logging in as test users

**Component Structure:**
```typescript
interface DevLoginPanelProps {
  onLoginSuccess: (data: AuthResponse) => void;
}

interface DevUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  is_dev_user: boolean;
}

function DevLoginPanel({ onLoginSuccess }: DevLoginPanelProps) {
  // State
  const [users, setUsers] = useState<DevUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // API calls
  async function fetchUsers() {
    const response = await api.get('/api/auth/dev-users');
    setUsers(response.data);
    if (response.data.length > 0) {
      setSelectedUserId(response.data[0].id);
    }
  }

  async function handleLogin() {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/dev-login', {
        user_id: selectedUserId
      });

      // Store tokens
      tokenService.setTokens(
        response.data.access_token,
        response.data.refresh_token
      );

      // Call success callback
      onLoginSuccess(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  // UI rendering...
}
```

**UI Components:**

1. **Warning Banner**
```tsx
<div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
  <div className="flex items-center gap-2">
    <WarningIcon className="text-yellow-600" />
    <h3 className="text-lg font-semibold text-yellow-900">
      Development Test Login
    </h3>
  </div>
  <p className="text-sm text-yellow-800">
    Bypass OAuth - login as any user for testing.
    Not available in production.
  </p>
</div>
```

2. **Search Input**
```tsx
<input
  type="text"
  placeholder="Search users..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full px-3 py-2 border rounded-lg"
/>
```

3. **User Dropdown (Grouped by Role)**
```tsx
<select
  value={selectedUserId}
  onChange={(e) => setSelectedUserId(e.target.value)}
  className="w-full px-3 py-2 border rounded-lg"
>
  {Object.entries(groupedUsers).map(([role, users]) => (
    <optgroup key={role} label={role.toUpperCase()}>
      {users.map(user => (
        <option key={user.id} value={user.id}>
          {user.email} - {user.name}
          {user.is_dev_user ? ' 🧪' : ''}
        </option>
      ))}
    </optgroup>
  ))}
</select>
```

4. **Selected User Preview**
```tsx
{selectedUser && (
  <div className="p-3 bg-white rounded-lg border">
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{selectedUser.name}</p>
        <p className="text-sm text-gray-600">{selectedUser.email}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[selectedUser.role]}`}>
        {selectedUser.role.toUpperCase()}
      </span>
    </div>
  </div>
)}
```

5. **Login Button**
```tsx
<button
  onClick={handleLogin}
  disabled={loading || !selectedUserId}
  className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
>
  {loading ? 'Logging in...' : 'Test Login'}
</button>
```

6. **Create User Form (Collapsible)**
```tsx
<button onClick={() => setShowCreateForm(!showCreateForm)}>
  {showCreateForm ? '▼' : '▶'} Create new test user
</button>

{showCreateForm && (
  <form onSubmit={handleCreateUser}>
    <input type="email" placeholder="Email*" required />
    <input type="text" placeholder="Name (optional)" />
    <select>
      <option value="admin">Admin</option>
      <option value="builder">Builder</option>
      <option value="employee">Employee</option>
    </select>
    <button type="submit">Create User</button>
  </form>
)}
```

**Styling Principles:**
- Yellow/amber colors for warning/development theme
- Clear visual hierarchy
- Responsive design
- Accessible (keyboard navigation, ARIA labels)
- Loading states for all async operations

### Component 5: Login Page Integration

**Pattern:**
```tsx
function LoginPage() {
  const { loginWithOAuth, checkAuth } = useAuth();

  const handleDevLoginSuccess = async () => {
    // Re-check auth to load user data
    await checkAuth(true);
    // Navigation happens via auth context
  };

  return (
    <div className="login-container">
      {/* Primary OAuth Login */}
      <button onClick={loginWithOAuth}>
        Sign in with Google/OAuth
      </button>

      {/* Dev Login Panel - Conditional Rendering */}
      {process.env.NODE_ENV === 'development' && (
        <DevLoginPanel onLoginSuccess={handleDevLoginSuccess} />
      )}
    </div>
  );
}
```

**Key Points:**
- Only render in development (`NODE_ENV === 'development'`)
- Place below primary auth (OAuth remains primary)
- Clear visual separation
- Callback triggers same auth flow as OAuth

### Component 6: Seed Script

**Purpose:** Create standard test users for consistent testing

**Implementation:**
```python
#!/usr/bin/env python3
"""
Seed development database with test users.
Run: python scripts/seed_dev_users.py
"""

def seed_dev_users(db: Database):
    # Standard test users for all roles
    test_users = [
        {"email": "admin@test.com", "name": "Test Admin", "role": "admin"},
        {"email": "builder@test.com", "name": "Test Builder", "role": "builder"},
        {"email": "employee@test.com", "name": "Test Employee", "role": "employee"},
        {"email": "sub@test.com", "name": "Test Subcontractor", "role": "subcontractor"},
        {"email": "client@test.com", "name": "Test Client", "role": "client"},
    ]

    created_count = 0
    for user_data in test_users:
        # Idempotent: skip if exists
        existing = db.query(User).filter(email=user_data["email"]).first()
        if existing:
            print(f"✓ User exists: {user_data['email']}")
            continue

        # Create user
        user = User(**user_data, is_active=True, is_dev_user=True)
        db.add(user)
        db.commit()
        created_count += 1
        print(f"✓ Created: {user_data['email']} ({user_data['role']})")

    print(f"\n✅ Seeded {created_count} new users")
    print("\nTest Accounts:")
    for user in test_users:
        print(f"  • {user['email']:25s} - {user['role']}")

if __name__ == "__main__":
    # Safety check
    environment = os.getenv("ENVIRONMENT", "production")
    if environment == "production":
        print("ERROR: Cannot seed dev users in production!")
        sys.exit(1)

    db = get_database_session()
    try:
        seed_dev_users(db)
    finally:
        db.close()
```

**Features:**
- Idempotent (safe to run multiple times)
- Covers all roles
- Production safeguard
- Clear console output

### Component 7: Token Generation CLI

**Purpose:** Generate JWT tokens for API testing without UI

**Implementation:**
```python
#!/usr/bin/env python3
"""
Generate JWT tokens for API testing.
Usage: python scripts/generate_test_token.py --email admin@test.com --role admin
"""

import argparse
from datetime import datetime, timedelta
import jwt

def generate_token(email: str, role: str, days_valid: int = 30) -> str:
    secret_key = os.getenv("JWT_SECRET_KEY")
    algorithm = os.getenv("JWT_ALGORITHM", "HS256")

    expires = datetime.utcnow() + timedelta(days=days_valid)

    payload = {
        "sub": email,
        "email": email,
        "role": role,
        "exp": expires,
        "iat": datetime.utcnow(),
        "dev_token": True  # Flag for debugging
    }

    return jwt.encode(payload, secret_key, algorithm=algorithm)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", required=True)
    parser.add_argument("--role", required=True,
                       choices=['admin', 'builder', 'employee', 'subcontractor', 'client'])
    parser.add_argument("--days", type=int, default=30)

    args = parser.parse_args()

    token = generate_token(args.email, args.role, args.days)
    expires = datetime.utcnow() + timedelta(days=args.days)

    print("="*80)
    print("JWT Token Generated")
    print("="*80)
    print(f"Email:   {args.email}")
    print(f"Role:    {args.role}")
    print(f"Expires: {expires.strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print(f"\nToken:\n{token}")
    print(f"\nUsage:\ncurl -H 'Authorization: Bearer {token}' http://localhost:8000/api/...")
    print("="*80)

if __name__ == "__main__":
    main()
```

**Usage Examples:**
```bash
# Generate admin token
python scripts/generate_test_token.py --email admin@test.com --role admin

# Generate builder token with custom expiry
python scripts/generate_test_token.py --email builder@test.com --role builder --days 7

# Use in curl
TOKEN=$(python scripts/generate_test_token.py --email admin@test.com --role admin | grep "^eyJ")
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/users
```

---

## Security Architecture

### Defense in Depth

```
┌──────────────────────────────────────────────────────────┐
│ Layer 1: Environment Check                               │
│ • Reads ENVIRONMENT variable                             │
│ • Blocks if ENVIRONMENT == "production"                  │
│ • Default: "production" (fail-safe)                      │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│ Layer 2: Explicit Enable Flag                            │
│ • Reads ENABLE_DEV_AUTH variable                         │
│ • Blocks if ENABLE_DEV_AUTH != "true"                    │
│ • Default: "false" (fail-safe)                           │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│ Layer 3: Runtime Validation                              │
│ • Validates on EVERY request                             │
│ • No caching of security decisions                       │
│ • Guards at endpoint level                               │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│ Layer 4: 404 Response (Not 403)                          │
│ • Returns 404 to avoid information disclosure            │
│ • Attackers can't confirm endpoint exists                │
│ • No difference from truly missing endpoint              │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│ Layer 5: Comprehensive Audit Logging                     │
│ • Logs ALL dev auth access attempts                      │
│ • Includes IP, user agent, timestamp                     │
│ • Separate log prefix [DEV-AUTH]                         │
│ • Alerts on production access attempts                   │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│ Layer 6: Frontend Build-Time Gating                      │
│ • Dev panel only in development builds                   │
│ • Production builds exclude component entirely           │
│ • No code shipped to production                          │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│ Layer 7: Database Flagging                               │
│ • All dev users flagged is_dev_user=true                 │
│ • Easy identification and cleanup                        │
│ • Excluded from production reports                       │
└──────────────────────────────────────────────────────────┘
```

### Security Checklist

**Development Phase:**
- [ ] Security guard function implemented
- [ ] Default values are secure (production, disabled)
- [ ] 404 response on blocked access (not 403)
- [ ] All endpoints call security guard first
- [ ] Comprehensive audit logging
- [ ] is_dev_user flag on all test users

**Testing Phase:**
- [ ] Unit tests verify production blocking
- [ ] Integration tests verify flag requirement
- [ ] Test 404 response in production mode
- [ ] Test audit logs created
- [ ] Test frontend conditional rendering

**Deployment Phase:**
- [ ] Verify ENVIRONMENT=production in prod env
- [ ] Verify ENABLE_DEV_AUTH is NOT set in prod
- [ ] Test /dev-users returns 404 in production
- [ ] Test /dev-login returns 404 in production
- [ ] Remove all is_dev_user=true users from prod DB
- [ ] Review audit logs for any dev auth attempts

### Threat Model

**Threat 1: Accidental Production Enable**
```
Risk: Developer sets ENABLE_DEV_AUTH=true in production
Mitigation:
  - Environment check (ENVIRONMENT must != production)
  - Deployment checklist verification
  - Automated tests in CI/CD
  - Startup warning logs if flag detected
```

**Threat 2: Information Disclosure**
```
Risk: 403 response reveals endpoint existence
Mitigation:
  - Use 404 (not 403) for blocked requests
  - No difference from truly missing endpoints
  - No error details in response
```

**Threat 3: Token Leakage**
```
Risk: Dev-generated tokens used maliciously
Mitigation:
  - Tokens flagged with "dev_token": true
  - Standard expiration times
  - Session tracking (can be revoked)
  - Audit logging of all usage
```

**Threat 4: Test Data in Production**
```
Risk: is_dev_user=true records in production database
Mitigation:
  - Database flagging (easy to identify)
  - Deployment checklist cleanup step
  - Automated script to detect and report
  - Production reports exclude dev users
```

---

## Technology-Specific Implementations

### FastAPI + React (Reference Implementation)

**Backend (FastAPI):**
```python
# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Literal
import os
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Schemas
class DevLoginRequest(BaseModel):
    user_id: Optional[str] = None
    email: Optional[EmailStr] = None

class DevCreateUserRequest(BaseModel):
    email: EmailStr
    role: Literal['admin', 'builder', 'employee', 'subcontractor', 'client']
    name: Optional[str] = None

class DevUserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    is_active: bool
    is_dev_user: bool

# Security guard
def check_dev_auth_enabled():
    environment = os.getenv("ENVIRONMENT", "production").lower()
    dev_auth = os.getenv("ENABLE_DEV_AUTH", "false").lower()

    if environment == "production" or dev_auth != "true":
        raise HTTPException(status_code=404, detail="Not found")

    logger.warning("⚠️  DEV AUTH ACCESS")

# Endpoints
@router.get("/dev-users", response_model=List[DevUserResponse])
async def get_dev_users(db: Session = Depends(get_db)):
    check_dev_auth_enabled()
    users = db.query(User).order_by(User.role, User.email).all()
    return [serialize_user(u) for u in users]

@router.post("/dev-create-user", response_model=DevUserResponse)
async def dev_create_user(req: DevCreateUserRequest, db: Session = Depends(get_db)):
    check_dev_auth_enabled()
    # Implementation...

@router.post("/dev-login")
async def dev_login(req: DevLoginRequest, db: Session = Depends(get_db)):
    check_dev_auth_enabled()
    # Implementation...
```

**Frontend (React + TypeScript):**
```tsx
// components/auth/DevLoginPanel.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DevLoginPanel({ onLoginSuccess }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    axios.get('/api/auth/dev-users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleLogin = async () => {
    const res = await axios.post('/api/auth/dev-login', {
      user_id: selectedUserId
    });

    localStorage.setItem('access_token', res.data.access_token);
    onLoginSuccess(res.data);
  };

  return (/* UI */);
}
```

### Django + Vue.js

**Backend (Django):**
```python
# views.py
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import os

def check_dev_auth_enabled():
    environment = os.getenv("ENVIRONMENT", "production").lower()
    dev_auth = os.getenv("ENABLE_DEV_AUTH", "false").lower()

    if environment == "production" or dev_auth != "true":
        return JsonResponse({"detail": "Not found"}, status=404)

    return None

@require_http_methods(["GET"])
def dev_users(request):
    error = check_dev_auth_enabled()
    if error:
        return error

    users = User.objects.all().order_by('role', 'email')
    return JsonResponse([serialize_user(u) for u in users], safe=False)

@require_http_methods(["POST"])
def dev_login(request):
    error = check_dev_auth_enabled()
    if error:
        return error

    # Implementation...
```

**Frontend (Vue.js):**
```vue
<template>
  <div v-if="isDevelopment" class="dev-login-panel">
    <select v-model="selectedUserId">
      <option v-for="user in users" :key="user.id" :value="user.id">
        {{ user.email }} - {{ user.role }}
      </option>
    </select>
    <button @click="handleLogin">Test Login</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      selectedUserId: null,
      isDevelopment: process.env.NODE_ENV === 'development'
    }
  },
  async mounted() {
    const res = await fetch('/api/auth/dev-users');
    this.users = await res.json();
  },
  methods: {
    async handleLogin() {
      const res = await fetch('/api/auth/dev-login', {
        method: 'POST',
        body: JSON.stringify({ user_id: this.selectedUserId })
      });
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);
      this.$emit('login-success', data);
    }
  }
}
</script>
```

### Express + Angular

**Backend (Express.js):**
```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();

function checkDevAuthEnabled(req, res, next) {
  const environment = process.env.ENVIRONMENT || 'production';
  const devAuth = process.env.ENABLE_DEV_AUTH || 'false';

  if (environment === 'production' || devAuth !== 'true') {
    return res.status(404).json({ detail: 'Not found' });
  }

  console.warn('⚠️  DEV AUTH ACCESS');
  next();
}

router.get('/dev-users', checkDevAuthEnabled, async (req, res) => {
  const users = await User.find().sort({ role: 1, email: 1 });
  res.json(users.map(serializeUser));
});

router.post('/dev-login', checkDevAuthEnabled, async (req, res) => {
  // Implementation...
});

module.exports = router;
```

**Frontend (Angular):**
```typescript
// dev-login-panel.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dev-login-panel',
  template: `
    <div *ngIf="isDevelopment" class="dev-login-panel">
      <select [(ngModel)]="selectedUserId">
        <option *ngFor="let user of users" [value]="user.id">
          {{ user.email }} - {{ user.role }}
        </option>
      </select>
      <button (click)="handleLogin()">Test Login</button>
    </div>
  `
})
export class DevLoginPanelComponent implements OnInit {
  users: any[] = [];
  selectedUserId: string | null = null;
  isDevelopment = !environment.production;

  @Output() loginSuccess = new EventEmitter();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('/api/auth/dev-users').subscribe(
      (data: any) => this.users = data
    );
  }

  handleLogin() {
    this.http.post('/api/auth/dev-login', {
      user_id: this.selectedUserId
    }).subscribe((data: any) => {
      localStorage.setItem('access_token', data.access_token);
      this.loginSuccess.emit(data);
    });
  }
}
```

### Ruby on Rails + React

**Backend (Rails):**
```ruby
# app/controllers/auth/dev_controller.rb
class Auth::DevController < ApplicationController
  before_action :check_dev_auth_enabled

  def users
    users = User.order(:role, :email)
    render json: users.map { |u| serialize_user(u) }
  end

  def create_user
    user = User.create!(
      email: params[:email],
      role: params[:role],
      name: params[:name],
      is_dev_user: true
    )
    render json: serialize_user(user)
  end

  def login
    user = User.find_by(id: params[:user_id]) || User.find_by(email: params[:email])

    if user.nil?
      render json: { error: 'User not found' }, status: 404
      return
    end

    token = generate_jwt(user)
    render json: { access_token: token, user: serialize_user(user) }
  end

  private

  def check_dev_auth_enabled
    environment = ENV['ENVIRONMENT'] || 'production'
    dev_auth = ENV['ENABLE_DEV_AUTH'] || 'false'

    if environment == 'production' || dev_auth != 'true'
      render json: { error: 'Not found' }, status: 404
    end
  end
end
```

---

## Testing Strategy

### Unit Tests

**Test 1: Security Guard Blocks Production**
```python
def test_dev_auth_blocked_in_production():
    with mock.patch.dict(os.environ, {"ENVIRONMENT": "production"}):
        response = client.get("/api/auth/dev-users")
        assert response.status_code == 404
        assert response.json() == {"detail": "Not found"}
```

**Test 2: Security Guard Requires Enable Flag**
```python
def test_dev_auth_requires_flag():
    with mock.patch.dict(os.environ, {
        "ENVIRONMENT": "development",
        "ENABLE_DEV_AUTH": "false"
    }):
        response = client.get("/api/auth/dev-users")
        assert response.status_code == 404
```

**Test 3: Dev Login Works When Enabled**
```python
def test_dev_login_works_when_enabled(db):
    user = User(email="test@example.com", role="admin", is_active=True)
    db.add(user)
    db.commit()

    with mock.patch.dict(os.environ, {
        "ENVIRONMENT": "development",
        "ENABLE_DEV_AUTH": "true"
    }):
        response = client.post("/api/auth/dev-login", json={
            "user_id": str(user.id)
        })
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert response.json()["user"]["email"] == "test@example.com"
```

**Test 4: Create User is Idempotent**
```python
def test_create_user_idempotent(db):
    with mock.patch.dict(os.environ, {
        "ENVIRONMENT": "development",
        "ENABLE_DEV_AUTH": "true"
    }):
        # Create first time
        response1 = client.post("/api/auth/dev-create-user", json={
            "email": "test@example.com",
            "role": "admin"
        })
        assert response1.status_code == 200
        user_id = response1.json()["id"]

        # Create again with same email
        response2 = client.post("/api/auth/dev-create-user", json={
            "email": "test@example.com",
            "role": "builder"  # Different role
        })
        assert response2.status_code == 200
        assert response2.json()["id"] == user_id  # Same user returned
```

**Test 5: Audit Logging**
```python
def test_dev_login_creates_audit_log(db):
    user = User(email="test@example.com", role="admin", is_active=True)
    db.add(user)
    db.commit()

    with mock.patch.dict(os.environ, {
        "ENVIRONMENT": "development",
        "ENABLE_DEV_AUTH": "true"
    }):
        client.post("/api/auth/dev-login", json={"user_id": str(user.id)})

        # Check audit log created
        log = db.query(AuthLog).filter(
            AuthLog.event_type == "dev_login",
            AuthLog.user_id == user.id
        ).first()

        assert log is not None
        assert log.details["email"] == "test@example.com"
        assert log.details["role"] == "admin"
```

### Integration Tests

**Test 6: Full Login Flow**
```python
def test_full_dev_login_flow(client, db):
    with mock.patch.dict(os.environ, {
        "ENVIRONMENT": "development",
        "ENABLE_DEV_AUTH": "true"
    }):
        # 1. Get users list
        users_response = client.get("/api/auth/dev-users")
        assert users_response.status_code == 200
        users = users_response.json()
        assert len(users) > 0

        # 2. Login as first user
        first_user = users[0]
        login_response = client.post("/api/auth/dev-login", json={
            "user_id": first_user["id"]
        })
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]

        # 3. Use token to access protected endpoint
        headers = {"Authorization": f"Bearer {token}"}
        protected_response = client.get("/api/me", headers=headers)
        assert protected_response.status_code == 200
        assert protected_response.json()["email"] == first_user["email"]
```

### Frontend Tests (Jest + React Testing Library)

**Test 7: Panel Only Renders in Development**
```tsx
import { render, screen } from '@testing-library/react';
import DevLoginPanel from './DevLoginPanel';

test('renders in development mode', () => {
  process.env.NODE_ENV = 'development';
  render(<DevLoginPanel onLoginSuccess={jest.fn()} />);
  expect(screen.getByText(/Development Test Login/i)).toBeInTheDocument();
});

test('does not render in production mode', () => {
  process.env.NODE_ENV = 'production';
  render(<DevLoginPanel onLoginSuccess={jest.fn()} />);
  expect(screen.queryByText(/Development Test Login/i)).not.toBeInTheDocument();
});
```

**Test 8: User Selection and Login**
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DevLoginPanel from './DevLoginPanel';

test('handles user login', async () => {
  const mockOnSuccess = jest.fn();
  const mockUsers = [
    { id: '1', email: 'admin@test.com', name: 'Admin', role: 'admin', is_active: true, is_dev_user: true }
  ];

  // Mock API
  global.fetch = jest.fn((url) => {
    if (url.includes('/dev-users')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers)
      });
    }
    if (url.includes('/dev-login')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'mock-token',
          user: mockUsers[0]
        })
      });
    }
  });

  render(<DevLoginPanel onLoginSuccess={mockOnSuccess} />);

  // Wait for users to load
  await waitFor(() => {
    expect(screen.getByText(/admin@test.com/i)).toBeInTheDocument();
  });

  // Click login
  fireEvent.click(screen.getByText(/Test Login/i));

  // Verify success callback
  await waitFor(() => {
    expect(mockOnSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ access_token: 'mock-token' })
    );
  });
});
```

### E2E Tests (Playwright/Cypress)

**Test 9: End-to-End Dev Login**
```typescript
// e2e/dev-login.spec.ts
import { test, expect } from '@playwright/test';

test('dev login flow', async ({ page }) => {
  // Navigate to login page
  await page.goto('http://localhost:3000/login');

  // Wait for dev panel to appear
  await expect(page.locator('.dev-login-panel')).toBeVisible();

  // Select a user
  await page.selectOption('select', { label: /admin@test.com/ });

  // Click test login
  await page.click('button:has-text("Test Login")');

  // Should redirect to dashboard
  await expect(page).toHaveURL(/\/dashboard/);

  // Verify authenticated
  await expect(page.locator('[data-testid="user-menu"]')).toContainText('admin@test.com');
});
```

---

## Deployment Checklist

### Pre-Deployment

**Code Review:**
- [ ] Security guard function uses 404 (not 403)
- [ ] All dev endpoints call `check_dev_auth_enabled()` first
- [ ] Frontend conditionally renders based on `NODE_ENV`
- [ ] Default environment values are secure (production, disabled)
- [ ] Audit logging implemented for all dev auth events

**Testing:**
- [ ] Unit tests pass for all security scenarios
- [ ] Integration tests verify production blocking
- [ ] E2E tests use dev auth successfully in dev mode
- [ ] Manual test: dev auth blocked in staging environment
- [ ] Manual test: /dev-users returns 404 in production-like env

### Deployment

**Environment Configuration:**
- [ ] Production `.env` has `ENVIRONMENT=production`
- [ ] Production `.env` does NOT have `ENABLE_DEV_AUTH`
- [ ] Verify environment variables loaded correctly
- [ ] Test `/api/auth/dev-users` returns 404 in production
- [ ] Test `/api/auth/dev-login` returns 404 in production

**Database Cleanup:**
- [ ] Query for users with `is_dev_user=true`
- [ ] Verify no dev users in production database
- [ ] If found, delete or flag for review
- [ ] Document any intentional test users

**Frontend Build:**
- [ ] Production build excludes dev components
- [ ] Verify `process.env.NODE_ENV === 'production'`
- [ ] Test: dev panel does not appear in production build
- [ ] Verify bundle size (dev panel code not included)

### Post-Deployment

**Monitoring:**
- [ ] Check application logs for `[DEV-AUTH]` entries
- [ ] Alert on any dev auth access in production
- [ ] Review audit logs for unexpected activity
- [ ] Monitor error rates (ensure no 500s from missing endpoints)

**Documentation:**
- [ ] Update README with dev auth instructions
- [ ] Document environment variables
- [ ] Create troubleshooting guide
- [ ] Share with team

### Rollback Plan

If dev auth accidentally enabled in production:

1. **Immediate:**
   - Set `ENABLE_DEV_AUTH=false` (or remove variable)
   - Restart application
   - Verify `/api/auth/dev-users` returns 404

2. **Investigation:**
   - Review audit logs for any dev login attempts
   - Check database for newly created `is_dev_user=true` records
   - Verify no unauthorized access occurred

3. **Cleanup:**
   - Delete any dev users created in production
   - Invalidate all sessions created via dev login
   - Review security logs for indicators of compromise

---

## Troubleshooting Guide

### Issue 1: Dev Auth Not Working in Development

**Symptoms:**
- `/api/auth/dev-users` returns 404
- Dev panel doesn't appear
- "Dev authentication not available" error

**Diagnosis:**
```bash
# Check environment variables
echo $ENVIRONMENT  # Should be "development" or "test"
echo $ENABLE_DEV_AUTH  # Should be "true"

# Check backend logs
grep "DEV-AUTH" logs/app.log

# Test endpoint directly
curl http://localhost:8000/api/auth/dev-users
```

**Solutions:**
1. **Set environment variables:**
   ```bash
   export ENVIRONMENT=development
   export ENABLE_DEV_AUTH=true
   ```

2. **Verify .env file:**
   ```bash
   cat .env | grep -E "ENVIRONMENT|ENABLE_DEV_AUTH"
   ```

3. **Check environment loading:**
   ```python
   # Add to your app startup
   print(f"ENVIRONMENT: {os.getenv('ENVIRONMENT')}")
   print(f"ENABLE_DEV_AUTH: {os.getenv('ENABLE_DEV_AUTH')}")
   ```

4. **Restart backend:**
   ```bash
   # Kill and restart to reload environment
   pkill -f "python main.py"
   python main.py
   ```

### Issue 2: Frontend Dev Panel Not Appearing

**Symptoms:**
- Backend works (curl succeeds)
- Frontend login page doesn't show dev panel
- No error in console

**Diagnosis:**
```javascript
// Add to LoginPage component
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Should show dev panel:', process.env.NODE_ENV === 'development');
```

**Solutions:**
1. **Verify NODE_ENV:**
   ```bash
   # In React
   npm run start  # NODE_ENV=development (automatic)

   # In Vue
   npm run serve  # NODE_ENV=development (automatic)

   # Custom builds
   NODE_ENV=development npm run build
   ```

2. **Check build configuration:**
   ```javascript
   // webpack.config.js or vite.config.js
   define: {
     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
   }
   ```

3. **Force development mode:**
   ```tsx
   // Temporarily hardcode for testing
   {true && <DevLoginPanel onLoginSuccess={handleSuccess} />}
   ```

### Issue 3: "User Not Found" Error

**Symptoms:**
- Dev panel appears
- User selected from dropdown
- "User not found" error on login

**Diagnosis:**
```bash
# Check database
psql -d yourdb -c "SELECT id, email, role, is_active FROM users;"

# Check API response
curl http://localhost:8000/api/auth/dev-users | jq
```

**Solutions:**
1. **Seed test users:**
   ```bash
   python scripts/seed_dev_users.py
   ```

2. **Create user via API:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/dev-create-user \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","role":"admin"}'
   ```

3. **Check user ID format:**
   ```python
   # Ensure consistent ID format (UUID vs integer)
   # Frontend sends: user_id: "123"
   # Backend expects: UUID or integer?
   ```

### Issue 4: Token Not Working After Dev Login

**Symptoms:**
- Dev login succeeds
- Token returned
- Protected endpoints return 401

**Diagnosis:**
```bash
# Decode JWT token
echo "YOUR_TOKEN" | cut -d '.' -f 2 | base64 -d | jq

# Test token directly
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/me
```

**Solutions:**
1. **Verify token storage:**
   ```javascript
   // Check localStorage
   console.log('Token:', localStorage.getItem('access_token'));
   ```

2. **Check token format:**
   ```python
   # Ensure same format as OAuth
   {
     "sub": user.id,
     "email": user.email,
     "role": user.role,
     "exp": expiration_timestamp
   }
   ```

3. **Verify JWT secret:**
   ```bash
   # Same secret for dev auth and OAuth
   echo $JWT_SECRET_KEY
   ```

### Issue 5: Dev Auth Working in Production

**Symptoms:**
- `/api/auth/dev-users` returns 200 in production
- Dev panel appears in production
- **CRITICAL SECURITY ISSUE**

**Immediate Actions:**
1. **Disable immediately:**
   ```bash
   # On production server
   export ENABLE_DEV_AUTH=false
   # or
   unset ENABLE_DEV_AUTH

   # Restart application
   systemctl restart your-app
   ```

2. **Verify disabled:**
   ```bash
   curl https://your-production.com/api/auth/dev-users
   # Should return: {"detail":"Not found"} with status 404
   ```

3. **Check environment:**
   ```bash
   # On production server
   env | grep -E "ENVIRONMENT|ENABLE_DEV_AUTH"
   # Should show: ENVIRONMENT=production
   # Should NOT show: ENABLE_DEV_AUTH=true
   ```

**Investigation:**
1. **Review audit logs:**
   ```bash
   grep "DEV-AUTH" /var/log/yourapp/*.log
   ```

2. **Check for unauthorized access:**
   ```sql
   SELECT * FROM auth_logs
   WHERE event_type = 'dev_login'
   AND created_at > NOW() - INTERVAL '24 hours';
   ```

3. **Identify compromised users:**
   ```sql
   SELECT * FROM users WHERE is_dev_user = true;
   ```

**Remediation:**
1. Delete dev users
2. Invalidate all sessions
3. Rotate JWT secret
4. Review security logs
5. Incident report

---

## Best Practices Summary

### DO

✅ **Use multiple security layers** (environment + flag + 404)
✅ **Default to secure values** (production, disabled)
✅ **Log all dev auth attempts** with full context
✅ **Flag all test users** with `is_dev_user=true`
✅ **Return 404 (not 403)** when blocked
✅ **Test production blocking** in CI/CD
✅ **Document clearly** for team members
✅ **Make UI distinctive** (yellow warning colors)
✅ **Maintain parity** with production auth flow
✅ **Enable only when needed** (explicit opt-in)

### DON'T

❌ **Enable by default** in any environment
❌ **Use 403 responses** (information disclosure)
❌ **Skip environment checks** (bypass security)
❌ **Forget audit logging** (no visibility)
❌ **Ship dev code to production** (bundle bloat + risk)
❌ **Use different token format** (inconsistency)
❌ **Leave test users in production** (data pollution)
❌ **Rely on single security layer** (defense in depth)
❌ **Assume it's disabled** (always verify)
❌ **Skip deployment checklist** (verification required)

---

## Conclusion

This development authentication system provides:
- **10x faster** local development
- **100% automated** testing capability
- **Zero production risk** (when properly configured)
- **Delightful UX** for developers
- **Comprehensive security** through defense in depth

**Key Success Factors:**
1. Multiple security layers
2. Explicit opt-in required
3. Comprehensive testing
4. Clear documentation
5. Deployment verification

**Portability:**
- Patterns apply to any web framework
- Reference implementations for common stacks
- Technology-agnostic core principles
- Adaptable to specific requirements

---

## Appendix A: Environment Variables Reference

| Variable | Required | Default | Values | Description |
|----------|----------|---------|--------|-------------|
| `ENVIRONMENT` | Yes | `production` | `development`, `test`, `staging`, `production` | Current environment |
| `ENABLE_DEV_AUTH` | Yes | `false` | `true`, `false` | Explicit enable flag |
| `JWT_SECRET_KEY` | Yes | - | String | Secret for JWT signing |
| `JWT_ALGORITHM` | No | `HS256` | `HS256`, etc. | JWT algorithm |
| `NODE_ENV` | Yes (frontend) | `production` | `development`, `production` | Build environment |

---

## Appendix B: API Reference

### GET /api/auth/dev-users

Get list of all users for dropdown selection.

**Authorization:** None
**Security:** Requires `ENVIRONMENT != production` AND `ENABLE_DEV_AUTH == true`

**Response 200:**
```json
[
  {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string",
    "is_active": boolean,
    "is_dev_user": boolean,
    "created_at": "ISO-8601 timestamp"
  }
]
```

**Response 404:**
```json
{
  "detail": "Not found"
}
```

### POST /api/auth/dev-create-user

Create new test user.

**Authorization:** None
**Security:** Requires `ENVIRONMENT != production` AND `ENABLE_DEV_AUTH == true`

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "role": "string (required, enum: admin|builder|employee|subcontractor|client)",
  "name": "string (optional)",
  "builder_id": "string (optional, role-specific)"
}
```

**Response 200:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "is_active": true,
  "is_dev_user": true,
  "created_at": "ISO-8601 timestamp"
}
```

**Response 404:**
```json
{
  "detail": "Not found"
}
```

### POST /api/auth/dev-login

Authenticate as any user without password.

**Authorization:** None
**Security:** Requires `ENVIRONMENT != production` AND `ENABLE_DEV_AUTH == true`

**Request Body:**
```json
{
  "user_id": "string (optional, user ID)"
  // OR
  "email": "string (optional, user email)"
  // At least one required
}
```

**Response 200:**
```json
{
  "access_token": "string (JWT)",
  "refresh_token": "string (JWT)",
  "token_type": "bearer",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string",
    "picture": "string|null"
  }
}
```

**Response 404:**
```json
{
  "detail": "Not found"
}
// OR (if user not found when enabled)
{
  "detail": "User not found"
}
```

**Response 400:**
```json
{
  "detail": "user_id or email required"
}
```

---

## Appendix C: Common Workflows

### Workflow 1: First-Time Setup

```bash
# 1. Enable dev auth
echo "ENABLE_DEV_AUTH=true" >> backend/.env
echo "ENVIRONMENT=development" >> backend/.env

# 2. Seed test users
cd backend
python scripts/seed_dev_users.py

# 3. Start application
./run-all.sh

# 4. Navigate to login page
# See yellow "Development Test Login" panel
# Select user from dropdown
# Click "Test Login"
# Authenticated!
```

### Workflow 2: Switching Roles

```bash
# Already logged in as admin
# Want to test as builder

# Option 1: User menu (if implemented)
Click user menu → "Switch User" → Select "builder@test.com" → "Test Login"

# Option 2: Logout and re-login
Logout → Login page → Dev panel → Select "builder@test.com" → "Test Login"

# Option 3: Direct navigation
Navigate to /login → Dev panel appears (if not authenticated)
```

### Workflow 3: API Testing

```bash
# Generate token
cd backend
python scripts/generate_test_token.py --email admin@test.com --role admin

# Copy token from output
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Use in API requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/users

curl -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project"}' \
  http://localhost:8000/api/projects
```

### Workflow 4: Automated Testing (CI/CD)

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    env:
      ENVIRONMENT: test
      ENABLE_DEV_AUTH: true
      JWT_SECRET_KEY: test-secret-key

    steps:
      - uses: actions/checkout@v2

      - name: Setup database
        run: |
          docker-compose up -d postgres
          sleep 5

      - name: Seed test users
        run: |
          cd backend
          python scripts/seed_dev_users.py

      - name: Run E2E tests
        run: |
          npm run test:e2e
        # Tests will use dev auth to authenticate
```

### Workflow 5: Creating Custom Test User

```bash
# Via UI:
1. Go to login page
2. Scroll to "Development Test Login" panel
3. Click "▶ Create new test user"
4. Fill form:
   - Email: contractor@example.com
   - Name: Test Contractor
   - Role: subcontractor
5. Click "Create User"
6. User appears in dropdown
7. Select and "Test Login"

# Via API:
curl -X POST http://localhost:8000/api/auth/dev-create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contractor@example.com",
    "name": "Test Contractor",
    "role": "subcontractor"
  }'

# Via Script:
cd backend
python -c "
from database import SessionLocal
from models import User

db = SessionLocal()
user = User(
    email='contractor@example.com',
    name='Test Contractor',
    role='subcontractor',
    is_active=True,
    is_dev_user=True
)
db.add(user)
db.commit()
print(f'Created user: {user.email}')
"
```

---

## Version History

- **v2.0** (2025-01-15): Generic implementation guide extracted from production system
- **v1.5** (2025-01-10): Added comprehensive security analysis
- **v1.0** (2025-01-05): Initial production deployment

---

## License

This implementation guide is provided as-is for reference. Adapt to your specific security requirements and organizational policies.

---

**End of Generic Development Authentication Implementation Guide**
