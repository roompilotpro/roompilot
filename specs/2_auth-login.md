# Feature: Google OAuth 2.0 Authentication & Role-Based Access Control

## Metadata
issue_number: `0`
issue_md: `issues/0_auth-login.md`

## Feature Description
Implement Google OAuth 2.0 as the exclusive authentication method for RoomPilot, supporting three user roles (Host, Resident, Admin) with automatic admin assignment via email whitelist. The system uses JWT tokens for session management and provides a development authentication mode for testing. The architecture separates public landing pages from authenticated login flows, with role selection occurring after first login for non-admin users.

## User Story
As a RoomPilot user
I want to sign in using my Google account and select my role (Host or Resident)
So that I can securely access the platform without creating yet another username/password, and be directed to the appropriate dashboard based on my role

## Problem Statement
RoomPilot currently has no authentication system, leaving all endpoints publicly accessible. Users need a secure, frictionless way to authenticate without password management overhead. The system must support three distinct user types (Hosts who manage properties, Residents who rent rooms, and Admins who oversee the platform) with different permission levels. Additionally, the authentication must work reliably across all browsers, including iOS Safari which blocks third-party cookies.

## Solution Statement
Implement Google OAuth 2.0 with JWT-based session management using authorization headers (avoiding cookie dependency for iOS Safari compatibility). Create a role selection flow for new users, with automatic admin role assignment for whitelisted emails. Provide development authentication bypass for rapid testing. Structure the frontend with separated public landing and login pages, and implement role-based routing to direct users to appropriate dashboards.

## Relevant Files
Use these files to implement the feature:

### Backend Files (Java Spring Boot)

**Configuration Files:**
- `backend/pom.xml` - Add Spring Security, OAuth2, and JWT dependencies
- `backend/src/main/resources/application.properties` - Add JWT secret, OAuth2 credentials, admin email whitelist
- `backend/src/main/resources/application-local.properties` - Development auth configuration

**New Security Configuration:**
- `backend/src/main/java/com/roompilot/config/SecurityConfig.java` - NEW: Spring Security filter chain, JWT validation, public/protected endpoint configuration
- `backend/src/main/java/com/roompilot/config/JwtConfig.java` - NEW: JWT configuration properties (secret, expiration)

**Models/Entities:**
- `backend/src/main/java/com/roompilot/model/User.java` - NEW: User entity with google_id, email, name, role, profile_picture_url
- `backend/src/main/java/com/roompilot/model/UserRole.java` - NEW: Enum for HOST, RESIDENT, ADMIN roles
- `backend/src/main/java/com/roompilot/model/dto/AuthResponse.java` - NEW: DTO for login response (JWT + user data)
- `backend/src/main/java/com/roompilot/model/dto/UserDTO.java` - NEW: DTO for user data without sensitive fields
- `backend/src/main/java/com/roompilot/model/dto/RoleSelectionRequest.java` - NEW: DTO for role selection

**Repositories:**
- `backend/src/main/java/com/roompilot/repository/UserRepository.java` - NEW: JPA repository with findByGoogleId, findByEmail, existsByGoogleId

**Services:**
- `backend/src/main/java/com/roompilot/service/AuthService.java` - NEW: OAuth2 code exchange, user creation/lookup, admin email checking
- `backend/src/main/java/com/roompilot/service/JwtService.java` - NEW: JWT generation, validation, claims extraction
- `backend/src/main/java/com/roompilot/service/UserService.java` - NEW: User CRUD operations, role updates
- `backend/src/main/java/com/roompilot/service/GoogleOAuthService.java` - NEW: Google OAuth2 token exchange, user info fetching

**Controllers:**
- `backend/src/main/java/com/roompilot/controller/AuthController.java` - NEW: OAuth callback, login, logout, token refresh, dev auth endpoints
- `backend/src/main/java/com/roompilot/controller/UserController.java` - NEW: Get current user, update role, get profile

**Security Components:**
- `backend/src/main/java/com/roompilot/security/JwtAuthenticationFilter.java` - NEW: Extract/validate JWT from Authorization header, set SecurityContext
- `backend/src/main/java/com/roompilot/security/JwtAuthenticationEntryPoint.java` - NEW: Handle unauthorized requests (401 responses)
- `backend/src/main/java/com/roompilot/security/CustomUserDetails.java` - NEW: UserDetails implementation for Spring Security

**Utilities:**
- `backend/src/main/java/com/roompilot/util/AdminEmailValidator.java` - NEW: Check if email is in admin whitelist

**Database Migrations:**
- `backend/src/main/resources/db/migration/V3__create_users_table.sql` - NEW: Create users table with Google OAuth fields and role enum

**Exception Handling:**
- `backend/src/main/java/com/roompilot/exception/AuthenticationException.java` - NEW: Custom exception for auth errors
- `backend/src/main/java/com/roompilot/exception/GlobalExceptionHandler.java` - NEW: Centralized exception handling for auth errors

**Update Existing Files:**
- `backend/src/main/java/com/roompilot/config/CorsConfig.java` - Update to work with Spring Security, ensure Authorization header is allowed
- `backend/src/main/java/com/roompilot/controller/MessageController.java` - Add @PreAuthorize annotations to secure endpoints

### Frontend Files (React + Vite)

**Configuration:**
- `frontend/.env.local` - Add VITE_GOOGLE_CLIENT_ID
- `frontend/package.json` - Add react-router-dom for routing
- `frontend/vite.config.js` - May need proxy configuration for development

**New Routing & Layout:**
- `frontend/src/router.jsx` - NEW: React Router configuration with public/protected routes
- `frontend/src/pages/LandingPage.jsx` - NEW: Public marketing page (move current App.jsx content here)
- `frontend/src/pages/LoginPage.jsx` - NEW: Google OAuth login button
- `frontend/src/pages/RoleSelectionPage.jsx` - NEW: Host vs Resident selection for first-time users
- `frontend/src/pages/HostDashboard.jsx` - NEW: Dashboard for hosts
- `frontend/src/pages/ResidentDashboard.jsx` - NEW: Dashboard for residents
- `frontend/src/pages/AdminDashboard.jsx` - NEW: Dashboard for admins
- `frontend/src/pages/UnauthorizedPage.jsx` - NEW: 401/403 error page

**Components:**
- `frontend/src/components/ProtectedRoute.jsx` - NEW: Route wrapper that checks authentication
- `frontend/src/components/RoleProtectedRoute.jsx` - NEW: Route wrapper that checks specific roles
- `frontend/src/components/GoogleLoginButton.jsx` - NEW: Styled Google OAuth button
- `frontend/src/components/Header.jsx` - NEW: Navigation header with logout button
- `frontend/src/components/RoleSelector.jsx` - NEW: Host/Resident selection cards

**Services/API:**
- `frontend/src/services/authService.js` - NEW: OAuth flow initiation, token management, logout
- `frontend/src/services/userService.js` - NEW: Get current user, update role
- `frontend/src/services/api.js` - UPDATE: Add JWT token to all requests via interceptor
- `frontend/src/utils/tokenStorage.js` - NEW: localStorage token management with cleanup

**Context/State Management:**
- `frontend/src/context/AuthContext.jsx` - NEW: Global auth state (user, token, isAuthenticated, loading)
- `frontend/src/hooks/useAuth.js` - NEW: Custom hook for accessing auth context

**OAuth Callback Handler:**
- `frontend/src/pages/OAuthCallbackPage.jsx` - NEW: Handle OAuth redirect, extract tokens from URL, redirect to role selection or dashboard

**Update Existing Files:**
- `frontend/src/main.jsx` - Wrap app with Router and AuthProvider
- `frontend/src/App.jsx` - Convert to router-based layout with outlet for pages
- `frontend/index.html` - Update title, add Google OAuth meta tags

### Testing Files

**Backend Tests:**
- `backend/src/test/java/com/roompilot/service/AuthServiceTest.java` - NEW: Test OAuth flow, admin detection, user creation
- `backend/src/test/java/com/roompilot/service/JwtServiceTest.java` - NEW: Test token generation, validation, expiration
- `backend/src/test/java/com/roompilot/controller/AuthControllerTest.java` - NEW: Test auth endpoints
- `backend/src/test/java/com/roompilot/security/JwtAuthenticationFilterTest.java` - NEW: Test filter logic
- `backend/src/test/java/com/roompilot/util/AdminEmailValidatorTest.java` - NEW: Test admin email whitelist logic

**E2E Test Documentation:**
- `.claude/commands/e2e/test_auth_flow.md` - NEW: E2E test plan for complete authentication flow

### Documentation Files

**Root Level:**
- `README.md` - UPDATE: Add authentication setup instructions, environment variables
- `.env.local.example` - NEW: Example environment file with all required variables

## Implementation Plan

### Phase 1: Foundation (Backend Security Infrastructure)
Set up the core authentication infrastructure on the backend including Spring Security, JWT utilities, database schema, and admin email validation. This provides the foundation for all authentication flows.

**Key Deliverables:**
- Spring Security dependencies and configuration
- JWT token generation and validation
- Users database table with Flyway migration
- Admin email whitelist validation
- Basic security filter chain

### Phase 2: Core Implementation (OAuth2 Flow + Frontend)
Implement the complete Google OAuth 2.0 flow including backend token exchange, frontend login UI, role selection, and routing. This creates the end-to-end authentication experience.

**Key Deliverables:**
- Google OAuth2 service for token exchange
- Auth controller endpoints (callback, login, logout)
- React Router setup with protected routes
- Login page with Google button
- Role selection page
- Auth context and token management
- Dashboard pages for each role

### Phase 3: Integration (Securing Existing Endpoints + Testing)
Secure existing application endpoints, integrate authentication across the app, implement development auth for testing, and create comprehensive tests to validate the entire system.

**Key Deliverables:**
- Protected Message endpoints
- Development authentication bypass
- Unit tests for all auth components
- E2E test documentation
- Updated CORS configuration
- Complete validation and deployment readiness

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Setup Backend Dependencies and Configuration

**Add Maven Dependencies:**
- Add `spring-boot-starter-security` to pom.xml
- Add JWT library (`io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
- Add `spring-boot-starter-oauth2-client` for OAuth2 support
- Add Spring HTTP client dependencies for Google API calls
- Run `./mvnw clean install` to verify dependencies resolve

**Configure Application Properties:**
- Add JWT secret, expiration time (7 days) to application.properties
- Add Google OAuth client ID and client secret placeholders
- Add ADMIN_EMAILS environment variable configuration
- Add ENVIRONMENT and ENABLE_DEV_AUTH for development mode
- Create application-dev.properties for development-specific settings

### 2. Create Database Schema with Flyway Migration

**Create V3__create_users_table.sql:**
- Create users table with id (UUID), google_id, email, full_name, profile_picture_url, phone, role, is_dev_user
- Add role CHECK constraint for 'HOST', 'RESIDENT', 'ADMIN'
- Add created_at, last_login, updated_at timestamps
- Add soft delete with deleted_at column
- Create indexes on google_id, email, role, is_dev_user, created_at
- Create token_blacklist table for logout functionality (optional)
- Add comments documenting is_dev_user purpose

**Test Migration:**
- Run `./start-backend.sh` to apply migration
- Verify tables created in database
- Check indexes are created properly

### 3. Create Backend Models and DTOs

**Create User Entity (User.java):**
- Define JPA entity with all fields from database schema
- Add UserRole enum (HOST, RESIDENT, ADMIN)
- Add @PrePersist and @PreUpdate lifecycle hooks
- Add proper getters/setters
- Implement equals/hashCode on id field

**Create DTOs:**
- AuthResponse.java - Contains JWT token, user data, hasSelectedRole flag
- UserDTO.java - User data without sensitive fields (for API responses)
- RoleSelectionRequest.java - Request DTO for role selection
- GoogleTokenResponse.java - DTO for Google OAuth token response
- GoogleUserInfo.java - DTO for Google user info response

**Create Exception Classes:**
- AuthenticationException.java - Custom exception for auth errors
- InvalidTokenException.java - For JWT validation failures
- UserAlreadyExistsException.java - For duplicate user registration

### 4. Implement JWT Service and Utilities

**Create JwtService.java:**
- Implement generateToken(User user) - Creates JWT with user ID, email, role in claims
- Implement validateToken(String token) - Validates signature and expiration
- Implement getUserIdFromToken(String token) - Extracts user ID from claims
- Implement isTokenExpired(String token) - Checks expiration
- Use JJWT library with HS256 algorithm
- Set token expiration to 7 days (configurable)

**Create JwtConfig.java:**
- @ConfigurationProperties for JWT settings
- Properties: secret, expirationMs, refreshExpirationMs
- Validation for required properties

**Create AdminEmailValidator.java:**
- Read ADMIN_EMAILS from environment (comma-separated)
- Implement isAdminEmail(String email) - Case-insensitive check
- Normalize emails to lowercase for comparison
- Handle null/empty email lists gracefully

**Write Unit Tests:**
- JwtServiceTest.java - Test token generation, validation, expiration, claims extraction
- AdminEmailValidatorTest.java - Test admin email detection with various inputs

### 5. Create Repositories and Services

**Create UserRepository.java:**
- Extend JpaRepository<User, UUID>
- Add findByGoogleId(String googleId)
- Add findByEmail(String email)
- Add existsByGoogleId(String googleId)
- Add findByEmailIn(List<String> emails) for bulk lookup

**Create GoogleOAuthService.java:**
- Implement exchangeCodeForToken(String code) - Exchange auth code for access token
- Implement getUserInfo(String accessToken) - Fetch user profile from Google
- Use RestTemplate or WebClient for HTTP calls
- Handle errors and token expiration
- Map Google response to GoogleUserInfo DTO

**Create AuthService.java:**
- Implement handleGoogleCallback(String code) - Main OAuth flow orchestration
  - Exchange code for tokens using GoogleOAuthService
  - Fetch user info from Google
  - Check if user exists in database
  - If new user and email in ADMIN_EMAILS, create with role=ADMIN
  - If new user and not admin, create with role=NULL
  - Update last_login timestamp
  - Generate JWT token using JwtService
  - Return AuthResponse with token and user data
- Implement selectRole(UUID userId, UserRole role) - Handle role selection
  - Validate role is HOST or RESIDENT (not ADMIN)
  - Update user.role in database
  - Return updated user
- Implement handleDevAuth(String email, UserRole role) - Development auth
  - Check ENABLE_DEV_AUTH=true
  - Create or find user by email
  - Set is_dev_user=true flag
  - Set role if provided
  - Generate JWT token
  - Return AuthResponse

**Create UserService.java:**
- Implement getCurrentUser(UUID userId) - Get user by ID
- Implement updateUserRole(UUID userId, UserRole role) - Update role
- Implement getUserByEmail(String email)
- Implement deleteUser(UUID userId) - Soft delete (set deleted_at)

**Write Unit Tests:**
- AuthServiceTest.java - Test OAuth flow, admin detection, role selection, dev auth
- UserServiceTest.java - Test user CRUD operations
- GoogleOAuthServiceTest.java - Mock HTTP calls, test token exchange

### 6. Implement Security Configuration

**Create JwtAuthenticationFilter.java:**
- Extend OncePerRequestFilter
- Extract JWT from Authorization header (Bearer token)
- Validate token using JwtService
- Load user from database using UserRepository
- Set SecurityContext with authenticated user
- Handle exceptions gracefully (continue filter chain for public endpoints)

**Create JwtAuthenticationEntryPoint.java:**
- Implement AuthenticationEntryPoint
- Return 401 Unauthorized with JSON error response
- Include error message and timestamp

**Create CustomUserDetails.java:**
- Implement UserDetails interface
- Wrap User entity
- Map user.role to GrantedAuthority (ROLE_HOST, ROLE_RESIDENT, ROLE_ADMIN)
- Implement required methods (getAuthorities, getUsername, isAccountNonExpired, etc.)

**Create SecurityConfig.java:**
- Configure HttpSecurity with JWT filter
- Define public endpoints: /api/auth/**, /actuator/health, /swagger-ui/**, /v3/api-docs/**
- Define protected endpoints: /api/** (require authentication)
- Disable CSRF (using JWT, not cookies)
- Set session management to STATELESS
- Configure CORS to work with security
- Add JwtAuthenticationFilter before UsernamePasswordAuthenticationFilter
- Set JwtAuthenticationEntryPoint for unauthorized requests

**Update CorsConfig.java:**
- Ensure compatibility with Spring Security
- Verify Authorization header is in allowedHeaders
- Confirm allowCredentials is true

**Write Unit Tests:**
- JwtAuthenticationFilterTest.java - Test filter with valid/invalid/expired tokens
- SecurityConfigTest.java - Test endpoint access rules

### 7. Create Authentication Controller

**Create AuthController.java:**
- POST /api/auth/google/callback - Handle OAuth callback
  - Accept authorization code in request body
  - Call AuthService.handleGoogleCallback(code)
  - Extract token from URL parameters on redirect
  - Return AuthResponse with JWT and user data
  - Handle errors (invalid code, Google API errors)

- GET /api/auth/me - Get current authenticated user
  - Extract user from SecurityContext
  - Return UserDTO
  - Requires authentication

- POST /api/users/me/role - Select role for new users
  - Accept RoleSelectionRequest (role: HOST or RESIDENT)
  - Validate user doesn't already have role
  - Call AuthService.selectRole(userId, role)
  - Return updated UserDTO
  - Requires authentication

- POST /api/auth/logout - Logout (optional blacklist implementation)
  - Extract JWT from request
  - Add to blacklist (if implemented)
  - Return 200 OK
  - Requires authentication

- POST /api/auth/dev/login - Development authentication (testing only)
  - Check ENABLE_DEV_AUTH environment variable
  - Accept email and optional role in request
  - Call AuthService.handleDevAuth(email, role)
  - Return AuthResponse
  - Return 403 Forbidden if dev auth disabled

**Add Swagger Documentation:**
- Add @Operation, @ApiResponse annotations
- Document request/response schemas
- Add security requirement annotations

**Write Unit Tests:**
- AuthControllerTest.java - Test all endpoints with valid/invalid inputs
- Test authentication requirements
- Test role selection validation
- Test dev auth enable/disable

### 8. Update Existing Endpoints for Security

**Update MessageController.java:**
- Add @PreAuthorize("isAuthenticated()") to all endpoints
- Inject SecurityContext to get current user
- Associate messages with users (if needed - may defer to later feature)

**Test Protected Endpoints:**
- Verify endpoints return 401 without JWT
- Verify endpoints work with valid JWT
- Test invalid/expired JWT handling

### 9. Create Frontend Routing Infrastructure

**Install Dependencies:**
- Run `npm install react-router-dom` in frontend directory
- Verify installation in package.json

**Create AuthContext.jsx:**
- Create context for global auth state
- State: user (UserDTO), token (string), isAuthenticated (boolean), loading (boolean)
- Actions: login(token, user), logout(), setUser(user), checkAuth()
- Implement checkAuth() - Validate token on app load by calling /api/auth/me
- Store token in localStorage
- Clear token on logout

**Create useAuth.js hook:**
- Custom hook to access AuthContext
- Return auth state and actions

**Create tokenStorage.js:**
- getToken() - Get token from localStorage
- setToken(token) - Store token in localStorage
- removeToken() - Clear token from localStorage
- cleanUrlToken() - Remove token from URL after OAuth callback

**Update api.js:**
- Add axios request interceptor
- Inject Authorization header with Bearer token on every request
- Handle 401 responses by clearing auth and redirecting to login

### 10. Create Login and Role Selection Pages

**Create LoginPage.jsx:**
- Display "Sign in with Google" button
- On click, redirect to backend OAuth initiation endpoint
- Show loading spinner during redirect
- Include "Authorized users only" message
- Style consistently with landing page

**Create GoogleLoginButton.jsx:**
- Reusable Google-styled button component
- Handle click to initiate OAuth flow
- Show loading state

**Create OAuthCallbackPage.jsx:**
- Component rendered at /auth/callback route
- Extract authorization code from URL query parameters
- Call backend /api/auth/google/callback with code
- On success, extract token and user from response
- Store token using authContext.login()
- Clean token from URL using tokenStorage.cleanUrlToken()
- Redirect based on user.role:
  - If role is null, redirect to /onboarding/role-selection
  - If role is ADMIN, redirect to /admin/dashboard
  - If role is HOST, redirect to /host/dashboard
  - If role is RESIDENT, redirect to /resident/dashboard
- Show loading spinner during process
- Handle errors (invalid code, network issues)

**Create RoleSelectionPage.jsx:**
- Display two cards: "I'm a Host" and "I'm a Resident"
- On selection, call /api/users/me/role with selected role
- Update auth context with new user data
- Redirect to appropriate dashboard
- Prevent access if user already has role

**Create RoleSelector.jsx:**
- Reusable component for role selection cards
- Props: onSelect, loading
- Visual cards with icons and descriptions

### 11. Create Protected Routes and Dashboards

**Create ProtectedRoute.jsx:**
- Wrapper component that checks authentication
- If not authenticated, redirect to /login
- If authenticated, render children
- Show loading state while checking auth

**Create RoleProtectedRoute.jsx:**
- Extends ProtectedRoute with role checking
- Props: allowedRoles (array of UserRole)
- Check if user.role is in allowedRoles
- If not authorized, redirect to /unauthorized
- If authorized, render children

**Create Dashboard Pages:**
- HostDashboard.jsx - Placeholder dashboard for hosts
- ResidentDashboard.jsx - Placeholder dashboard for residents
- AdminDashboard.jsx - Placeholder dashboard for admins
- Each should display welcome message with user name
- Include logout button
- Show user role
- Placeholder for future features

**Create UnauthorizedPage.jsx:**
- Display 403 error message
- Provide link back to home
- Suggest logging in with correct account

**Create Header.jsx:**
- Navigation component with logo
- Display user name and profile picture
- Logout button that calls authService.logout()
- Show different nav items based on user role

### 12. Update Main App Structure and Routing

**Update main.jsx:**
- Wrap App with BrowserRouter
- Wrap App with AuthProvider
- Structure: BrowserRouter > AuthProvider > App

**Update App.jsx:**
- Remove existing message list functionality (move to separate page)
- Implement React Router with Routes
- Define routes:
  - / - LandingPage (public)
  - /login - LoginPage (public)
  - /auth/callback - OAuthCallbackPage (public)
  - /onboarding/role-selection - RoleSelectionPage (protected)
  - /host/dashboard - HostDashboard (protected, HOST only)
  - /resident/dashboard - ResidentDashboard (protected, RESIDENT only)
  - /admin/dashboard - AdminDashboard (protected, ADMIN only)
  - /unauthorized - UnauthorizedPage (public)
- Wrap protected routes with ProtectedRoute
- Wrap role-specific routes with RoleProtectedRoute

**Create LandingPage.jsx:**
- Move current App.jsx content (marketing page from index.html)
- This becomes the public homepage at /
- No link to /login (as per requirements)
- Users must navigate to /login directly

**Move Test App:**
- The existing message list functionality stays at /test.html
- This is already separated and working

### 13. Implement Authentication Services

**Create authService.js:**
- initiateGoogleLogin() - Redirect to Google OAuth URL
  - Construct OAuth URL with client ID, redirect URI, scopes
  - Redirect browser to Google consent screen

- handleCallback(code) - Exchange code for token
  - POST to /api/auth/google/callback with code
  - Return AuthResponse (token + user)

- getCurrentUser() - GET /api/auth/me
  - Return current user data
  - Throw error if not authenticated

- logout() - Clear local state and optionally call backend
  - Call POST /api/auth/logout (if implementing blacklist)
  - Clear localStorage token
  - Redirect to /login

- devLogin(email, role) - Development authentication
  - POST to /api/auth/dev/login with email and role
  - Return AuthResponse

**Create userService.js:**
- selectRole(role) - POST /api/users/me/role
  - Send role selection
  - Return updated user

- getProfile() - GET /api/users/me
  - Return current user profile

### 14. Add Environment Configuration

**Create .env.local.example:**
- Document all required environment variables
- VITE_GOOGLE_CLIENT_ID
- VITE_API_URL
- VITE_OAUTH_REDIRECT_URI

**Update .env.local:**
- Add VITE_GOOGLE_CLIENT_ID (placeholder for setup instructions)
- Add VITE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback

**Update backend .env.local:**
- Add JWT_SECRET (generate random base64 string)
- Add GOOGLE_CLIENT_ID
- Add GOOGLE_CLIENT_SECRET
- Add ADMIN_EMAILS (comma-separated list)
- Add ENABLE_DEV_AUTH=true for development
- Add ENVIRONMENT=development

### 15. Create E2E Test Documentation

**Create .claude/commands/e2e/test_auth_flow.md:**
- Document complete authentication test flow
- Test Case 1: First-time Host login
  - Navigate to /login
  - Click "Sign in with Google"
  - Complete Google OAuth
  - Verify redirect to /onboarding/role-selection
  - Select "Host" role
  - Verify redirect to /host/dashboard
  - Verify user name displayed
  - Take screenshot

- Test Case 2: Returning Host login
  - Logout
  - Navigate to /login
  - Sign in with same Google account
  - Verify direct redirect to /host/dashboard (skip role selection)
  - Take screenshot

- Test Case 3: Admin auto-assignment
  - Use admin email from ADMIN_EMAILS
  - Login via Google OAuth
  - Verify direct redirect to /admin/dashboard (no role selection)
  - Verify role is ADMIN
  - Take screenshot

- Test Case 4: Development authentication
  - Navigate to /login
  - Use dev auth endpoint or UI (if implemented)
  - Login with test email
  - Verify successful authentication

- Test Case 5: Protected route access
  - Without logging in, try to access /host/dashboard
  - Verify redirect to /login
  - Login and verify access granted

- Test Case 6: Role-based access control
  - Login as Resident
  - Try to access /host/dashboard
  - Verify redirect to /unauthorized

- Test Case 7: Logout flow
  - Login as any user
  - Click logout button
  - Verify redirect to /login
  - Verify cannot access protected routes
  - Verify token removed from localStorage

### 16. Write Comprehensive Unit Tests

**Backend Tests:**
- Run all existing tests to ensure no regressions
- Ensure new tests cover:
  - JWT generation and validation (JwtServiceTest.java)
  - Admin email detection (AdminEmailValidatorTest.java)
  - OAuth flow (AuthServiceTest.java)
  - Role selection validation (AuthServiceTest.java)
  - User CRUD operations (UserServiceTest.java)
  - Auth controller endpoints (AuthControllerTest.java)
  - Security filter (JwtAuthenticationFilterTest.java)

**Frontend Tests (Optional - if time permits):**
- Test auth context state management
- Test protected route redirects
- Test role selection logic

### 17. Update Documentation

**Update README.md:**
- Add authentication setup section
- Document how to get Google OAuth credentials
- Document environment variables needed
- Document admin email configuration
- Add screenshots of login flow
- Document development authentication

**Create GOOGLE_OAUTH_SETUP.md:**
- Step-by-step guide to create Google OAuth app
- Configure authorized redirect URIs
- Get client ID and secret
- Add to environment variables

### 18. Integration Testing and Validation

**Manual Integration Tests:**
- Test complete OAuth flow from frontend to backend
- Test role selection and dashboard redirects
- Test admin auto-assignment
- Test development auth
- Test logout flow
- Test token expiration handling
- Test cross-browser compatibility (Chrome, Safari, Firefox)
- Test iOS Safari specifically (no cookie issues)

**Security Validation:**
- Verify all protected endpoints require JWT
- Verify invalid tokens are rejected
- Verify expired tokens are rejected
- Verify CORS headers are correct
- Verify no sensitive data in JWT payload
- Verify admin emails are not exposed in API

### 19. Run Validation Commands

Execute every command to validate the feature works correctly with zero regressions.

**Backend Validation:**
- `cd backend && ./mvnw clean test` - Run all backend tests
- `cd backend && ./mvnw clean install` - Build backend
- `./start-backend.sh` - Start backend server
- Verify Flyway migration runs successfully
- Check logs for any security errors
- Test health endpoint: `curl http://localhost:8080/actuator/health`

**Frontend Validation:**
- `cd frontend && npm install` - Install new dependencies
- `cd frontend && npm run build` - Build frontend
- `./start-frontend.sh` - Start frontend dev server
- Verify no console errors
- Verify routing works

**End-to-End Validation:**
- Run all E2E test cases from .claude/commands/e2e/test_auth_flow.md
- Verify each test case passes
- Take screenshots as evidence
- Document any issues found

**Security Validation:**
- Attempt to access protected endpoints without token (should get 401)
- Attempt to access with invalid token (should get 401)
- Attempt to access with expired token (should get 401)
- Verify role-based access works correctly
- Verify admin auto-assignment works

**Regression Testing:**
- Verify existing message functionality still works at /test.html
- Verify landing page still works
- Verify all existing tests pass

## Testing Strategy

### Unit Tests

**Backend Unit Tests (JUnit 5 + Mockito):**

1. **JwtServiceTest.java:**
   - Test token generation with user data
   - Test token validation with valid token
   - Test token validation with invalid signature
   - Test token validation with expired token
   - Test claims extraction (user ID, email, role)
   - Test token expiration calculation

2. **AuthServiceTest.java:**
   - Test Google OAuth callback with new user
   - Test Google OAuth callback with existing user
   - Test admin email detection and auto-assignment
   - Test non-admin user creation (role=null)
   - Test role selection for new users
   - Test role selection rejection for admins
   - Test development auth with ENABLE_DEV_AUTH=true
   - Test development auth rejection with ENABLE_DEV_AUTH=false
   - Test is_dev_user flag setting

3. **GoogleOAuthServiceTest.java:**
   - Mock HTTP calls to Google OAuth API
   - Test successful token exchange
   - Test token exchange with invalid code
   - Test user info retrieval
   - Test error handling for network failures

4. **UserServiceTest.java:**
   - Test user creation
   - Test user lookup by ID, email, google_id
   - Test role update
   - Test soft delete

5. **AdminEmailValidatorTest.java:**
   - Test admin email detection (case-insensitive)
   - Test non-admin email
   - Test empty email list
   - Test multiple admin emails

6. **AuthControllerTest.java:**
   - Test OAuth callback endpoint
   - Test /api/auth/me endpoint
   - Test role selection endpoint
   - Test logout endpoint
   - Test dev auth endpoint
   - Test authentication requirements

7. **JwtAuthenticationFilterTest.java:**
   - Test filter with valid token
   - Test filter with missing token
   - Test filter with invalid token
   - Test filter with expired token
   - Test SecurityContext population

**Frontend Unit Tests (Optional):**
- Test AuthContext state management
- Test useAuth hook
- Test token storage utilities
- Test protected route logic

### Edge Cases

1. **User exists but with different OAuth provider:**
   - Currently only Google supported, but handle gracefully
   - Future: Support multiple OAuth providers per email

2. **Token expires during active session:**
   - Frontend detects 401 response
   - Redirect to login
   - Show "session expired" message
   - Future: Implement refresh tokens

3. **User tries to select ADMIN role:**
   - Backend rejects request
   - Return 403 Forbidden
   - Frontend shows error message

4. **Admin tries to change role:**
   - Backend prevents role changes for admins
   - Return 403 Forbidden with message "Admin role cannot be changed"

5. **User closes browser during OAuth flow:**
   - OAuth state is lost
   - User must restart login flow
   - No partial data saved

6. **Multiple tabs/windows:**
   - Token stored in localStorage (shared across tabs)
   - Logout in one tab affects all tabs
   - Consider implementing cross-tab communication

7. **ADMIN_EMAILS environment variable changes:**
   - Existing admins remain admins
   - New logins checked against updated list
   - Requires backend restart

8. **User deleted/banned:**
   - Soft delete with deleted_at timestamp
   - JWT still valid until expiration
   - Future: Implement token blacklist

9. **Google OAuth returns partial user data:**
   - Handle missing profile picture
   - Handle missing name (use email as fallback)

10. **Network failures during OAuth:**
    - Show user-friendly error message
    - Provide retry mechanism
    - Log errors for debugging

11. **iOS Safari cookie blocking:**
    - Handled by using Authorization headers instead of cookies
    - Tokens in localStorage, not cookies
    - Should work seamlessly on iOS

12. **User has JWT but account deleted:**
    - UserRepository returns empty
    - Filter clears SecurityContext
    - Return 401 Unauthorized

## Acceptance Criteria

1. **Google OAuth Integration:**
   - [ ] User can click "Sign in with Google" and complete OAuth flow
   - [ ] Backend successfully exchanges auth code for tokens
   - [ ] User profile data (email, name, picture) fetched from Google
   - [ ] JWT token generated and returned to frontend

2. **Role Selection:**
   - [ ] New users (non-admin) redirected to role selection page
   - [ ] User can select Host or Resident role
   - [ ] Role selection updates user in database
   - [ ] User redirected to appropriate dashboard after selection
   - [ ] Users cannot select Admin role manually

3. **Admin Auto-Assignment:**
   - [ ] Users with emails in ADMIN_EMAILS automatically assigned ADMIN role
   - [ ] Admins skip role selection and go directly to admin dashboard
   - [ ] Admin role creation is logged
   - [ ] Admin role cannot be changed

4. **Session Management:**
   - [ ] JWT token stored in localStorage
   - [ ] Token included in Authorization header on all API requests
   - [ ] Token expiration set to 7 days
   - [ ] Expired tokens rejected with 401 response
   - [ ] Invalid tokens rejected with 401 response

5. **Protected Routes:**
   - [ ] Unauthenticated users redirected to /login when accessing protected routes
   - [ ] Authenticated users can access routes appropriate for their role
   - [ ] Users cannot access routes not allowed for their role (403 Unauthorized)

6. **Landing Page vs Login Page:**
   - [ ] Landing page (/) is public and has no login link
   - [ ] Login page (/login) accessible via direct URL
   - [ ] Landing page content is visible without authentication

7. **Development Authentication:**
   - [ ] Dev auth endpoint works when ENABLE_DEV_AUTH=true
   - [ ] Dev auth returns 403 when ENABLE_DEV_AUTH=false
   - [ ] Users created via dev auth have is_dev_user=true flag

8. **Security:**
   - [ ] All protected endpoints require valid JWT
   - [ ] CORS configured correctly with Authorization header
   - [ ] No sensitive data in JWT payload
   - [ ] Admin emails not exposed via API
   - [ ] Works on iOS Safari (no cookie dependency)

9. **User Experience:**
   - [ ] Smooth redirect flow through OAuth process
   - [ ] Loading states shown during async operations
   - [ ] Error messages displayed for failed operations
   - [ ] User name and profile picture displayed in header
   - [ ] Logout button clears session and redirects to login

10. **Database:**
    - [ ] Users table created with correct schema
    - [ ] Flyway migration runs successfully
    - [ ] Indexes created for performance
    - [ ] Soft delete implemented (deleted_at column)

11. **Testing:**
    - [ ] All unit tests pass
    - [ ] All E2E test cases documented and validated
    - [ ] Zero regressions in existing functionality

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

### Backend Tests
```bash
# Navigate to backend directory
cd backend

# Run all tests
./mvnw test

# Build project
./mvnw clean install

# Verify no compilation errors
echo "Backend build status: $?"
```

### Frontend Tests
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (including new ones)
npm install

# Build frontend
npm run build

# Check for build errors
echo "Frontend build status: $?"

# Lint code
npm run lint
```

### Database Migration
```bash
# Start backend which will run Flyway migrations
./start-backend.sh

# In another terminal, verify migration
cd backend
./mvnw flyway:info

# Check users table exists
# Connect to database and run: \dt users
```

### Integration Tests
```bash
# Start all services
./start-dev.sh

# Wait for services to be ready
sleep 10

# Test backend health
curl http://localhost:8080/actuator/health

# Test backend is secured (should return 401)
curl -i http://localhost:8080/api/messages

# Test public endpoints are accessible
curl http://localhost:8080/api/auth/google

# Test frontend is accessible
curl -I http://localhost:5173
```

### E2E Manual Testing
```bash
# Follow test cases in .claude/commands/e2e/test_auth_flow.md
# Test each scenario and document results:

# 1. First-time user login with role selection
# 2. Returning user login (skip role selection)
# 3. Admin auto-assignment
# 4. Development authentication
# 5. Protected route access
# 6. Role-based access control
# 7. Logout flow
# 8. Token expiration handling
# 9. iOS Safari compatibility
```

### Security Validation
```bash
# Test protected endpoints without auth (should fail)
curl -i http://localhost:8080/api/auth/me

# Test with invalid token (should fail)
curl -i -H "Authorization: Bearer invalid.token.here" http://localhost:8080/api/auth/me

# Test CORS headers
curl -i -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS http://localhost:8080/api/auth/me

# Verify response includes:
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Headers: Authorization
```

### Regression Testing
```bash
# Verify existing functionality still works
# Test message endpoints at /test.html manually
# Test landing page loads at /

# Run existing backend tests
cd backend && ./mvnw test

# Verify no test failures
```

## Notes

### Required External Setup

**Google OAuth Credentials:**
1. Go to Google Cloud Console (console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - http://localhost:8080/api/auth/google/callback (backend)
   - http://localhost:5173/auth/callback (frontend dev)
   - https://your-domain.com/auth/callback (production)
6. Copy Client ID and Client Secret to environment variables

**Environment Variables:**
- Backend requires: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET, ADMIN_EMAILS
- Frontend requires: VITE_GOOGLE_CLIENT_ID, VITE_API_URL
- Use strong, randomly generated JWT_SECRET (at least 256 bits)

### Security Considerations

1. **JWT Secret:** Must be at least 256 bits, randomly generated, never committed to git
2. **HTTPS in Production:** All OAuth redirects must use HTTPS in production
3. **CORS:** Carefully configure allowed origins, never use "*" in production
4. **XSS Protection:** Sanitize all user inputs, use Content Security Policy headers
5. **Token Storage:** localStorage is XSS-vulnerable, acceptable trade-off for iOS Safari compatibility
6. **Admin Emails:** Never expose ADMIN_EMAILS list via API

### Future Enhancements (Out of Scope)

1. **Refresh Tokens:** Currently tokens expire after 7 days, user must re-authenticate
2. **Multi-Provider OAuth:** Support Apple, Facebook, GitHub OAuth
3. **Two-Factor Authentication:** Google handles this, but could add app-level 2FA
4. **Token Blacklist:** Optional logout implementation, requires Redis or database
5. **Rate Limiting:** Prevent brute force attacks on auth endpoints
6. **Audit Logging:** Log all authentication events for security monitoring
7. **Email Verification:** Send verification email after first login
8. **Password Reset:** Not needed with OAuth-only approach
9. **Remember Me:** Longer token expiration for trusted devices
10. **Account Deletion:** GDPR-compliant user data deletion

### Development Tips

1. **Use Development Auth:** Speeds up testing, no Google OAuth needed for basic flows
2. **Token Debugging:** Use jwt.io to decode and inspect JWT tokens
3. **Browser DevTools:** Check Application > Local Storage for token storage
4. **Network Tab:** Monitor API requests for token inclusion
5. **Backend Logs:** Enable DEBUG logging for security filter to troubleshoot auth issues

### iOS Safari Compatibility

This implementation specifically avoids cookies and uses Authorization headers to ensure compatibility with iOS Safari's Intelligent Tracking Prevention (ITP). All tokens are:
- Passed via URL on OAuth callback redirect
- Stored in localStorage by frontend
- Sent via Authorization header on subsequent requests
- Never stored in cookies

### Testing Strategy Notes

- Unit tests should cover 80%+ code coverage for auth components
- E2E tests should validate complete user journeys
- Test with multiple Google accounts (personal, work, admin)
- Test on multiple browsers, especially iOS Safari
- Test network failures and edge cases
- Use development auth for automated testing

### Known Limitations

1. **Single OAuth Provider:** Only Google supported initially
2. **No Refresh Tokens:** Users must re-authenticate after 7 days
3. **No Revocation:** Tokens valid until expiration (unless blacklist implemented)
4. **localStorage XSS Risk:** Tokens accessible to JavaScript (mitigated by CSP)
5. **No Cross-Device Sync:** Login on one device doesn't affect others