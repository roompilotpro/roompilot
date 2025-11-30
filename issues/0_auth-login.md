### Authentication & User Management

### Goals
- Implement Google OAuth 2.0 as the **only** authentication method
- No password storage, no custom auth - just Google sign-in
- Support three user roles: **Host**, **Resident**, and **Admin**
- Role selection happens after first successful login (except for admins)
- **Admin auto-assignment:** Admins are automatically identified by hardcoded email addresses
- Secure session management with JWT tokens
- Seamless user experience with automatic profile data population
- Implement development authentication (testing only) - bypass OAuth flow for rapid local development and automated testing

**Key Differences for Admin Flow:**
1. **No role selection:** Admin role is auto-assigned on first login
2. **Email whitelist:** Email must be in `ADMIN_EMAILS` environment variable
3. **Automatic redirect:** Goes directly to `/admin/dashboard`
4. **Audit logging:** Admin account creation is logged for security
5. **Immutable role:** Admin role cannot be changed once set

**Key Points:**
- **Landing page (`/`)**: Public marketing page - remains unchanged, NO link to login (product not launched yet)
- **Login page (`/login`)**: Separate authentication page - accessed directly via URL only
- Users must navigate to `/login` directly (bookmark, direct link, shared internally, etc.)
- Login page is for internal testing and authorized users only during pre-launch
- After product launch, you can add a "Sign In" link to the landing page