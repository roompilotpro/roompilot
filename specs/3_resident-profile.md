# Feature: Resident Profile Completion

## Metadata
issue_number: `3`
issue_md: `Registration flow - Resident profile completion after role selection`

## Feature Description
Implement a profile completion flow for RESIDENT users after they select their role during registration. This captures essential information (bio, employment status) needed for room rental applications, while optionally collecting phone number. The flow ensures residents have complete profiles before accessing the marketplace.

## User Story
As a Resident user
I want to complete my profile with bio and employment information after selecting my role
So that I can apply for rooms and hosts can review my application with relevant details

## Problem Statement
After Google OAuth login and role selection, resident users are redirected to a placeholder dashboard without completing their profile. The PRD requires residents to have bio and employment information for rental applications, but there's no mechanism to collect this data. Hosts need this information to evaluate applicants.

## Solution Statement
Create a multi-step profile completion flow that:
1. Intercepts residents after role selection before dashboard access
2. Collects bio (required) and employment status (required)
3. Prompts for phone number (optional)
4. Tracks profile completion status
5. Redirects to resident dashboard only after profile is complete

## Relevant Files
Use these files to implement the feature:

### Backend Files to Modify/Create

**Database Migration:**
- `backend/src/main/resources/db/migration/V4__create_resident_profiles_table.sql` - NEW: Create resident_profiles table

**Models/Entities:**
- `backend/src/main/java/com/roompilot/model/ResidentProfile.java` - NEW: JPA entity for resident profile
- `backend/src/main/java/com/roompilot/model/EmploymentStatus.java` - NEW: Enum for employment options
- `backend/src/main/java/com/roompilot/model/dto/ResidentProfileDTO.java` - NEW: DTO for API responses
- `backend/src/main/java/com/roompilot/model/dto/ResidentProfileRequest.java` - NEW: Request DTO for create/update
- `backend/src/main/java/com/roompilot/model/dto/AuthResponse.java` - UPDATE: Add hasCompletedProfile flag
- `backend/src/main/java/com/roompilot/model/dto/UserDTO.java` - UPDATE: Add profileCompleted flag

**Repositories:**
- `backend/src/main/java/com/roompilot/repository/ResidentProfileRepository.java` - NEW: JPA repository

**Services:**
- `backend/src/main/java/com/roompilot/service/ResidentProfileService.java` - NEW: Business logic for profile CRUD
- `backend/src/main/java/com/roompilot/service/AuthService.java` - UPDATE: Include profile completion status in auth response

**Controllers:**
- `backend/src/main/java/com/roompilot/controller/ResidentController.java` - NEW: REST endpoints for resident profile

**Tests:**
- `backend/src/test/java/com/roompilot/service/ResidentProfileServiceTest.java` - NEW: Unit tests
- `backend/src/test/java/com/roompilot/controller/ResidentControllerTest.java` - NEW: Controller tests

### Frontend Files to Modify/Create

**Pages:**
- `frontend/src/pages/onboarding/ResidentProfilePage.jsx` - NEW: Profile completion wizard
- `frontend/src/pages/ResidentDashboard.jsx` - UPDATE: Remove placeholder, add real content

**Components:**
- `frontend/src/components/onboarding/ProfileWizard.jsx` - NEW: Multi-step form component
- `frontend/src/components/onboarding/BioStep.jsx` - NEW: Bio input step
- `frontend/src/components/onboarding/EmploymentStep.jsx` - NEW: Employment selection step
- `frontend/src/components/onboarding/PhoneStep.jsx` - NEW: Optional phone input step
- `frontend/src/components/onboarding/ProfileReview.jsx` - NEW: Review before submit

**Services:**
- `frontend/src/services/residentService.js` - NEW: API calls for resident profile

**Context/State:**
- `frontend/src/context/AuthContext.jsx` - UPDATE: Add profileCompleted to user state

**Routing:**
- `frontend/src/App.jsx` - UPDATE: Add profile completion route and redirect logic

**Utils:**
- `frontend/src/utils/validation.js` - NEW: Form validation helpers

### New Files Summary

```
backend/
├── src/main/resources/db/migration/
│   └── V4__create_resident_profiles_table.sql
├── src/main/java/com/roompilot/
│   ├── model/
│   │   ├── ResidentProfile.java
│   │   ├── EmploymentStatus.java
│   │   └── dto/
│   │       ├── ResidentProfileDTO.java
│   │       └── ResidentProfileRequest.java
│   ├── repository/
│   │   └── ResidentProfileRepository.java
│   ├── service/
│   │   └── ResidentProfileService.java
│   └── controller/
│       └── ResidentController.java
└── src/test/java/com/roompilot/
    ├── service/
    │   └── ResidentProfileServiceTest.java
    └── controller/
        └── ResidentControllerTest.java

frontend/
└── src/
    ├── pages/
    │   └── onboarding/
    │       └── ResidentProfilePage.jsx
    ├── components/
    │   └── onboarding/
    │       ├── ProfileWizard.jsx
    │       ├── BioStep.jsx
    │       ├── EmploymentStep.jsx
    │       ├── PhoneStep.jsx
    │       └── ProfileReview.jsx
    ├── services/
    │   └── residentService.js
    └── utils/
        └── validation.js
```

## Implementation Plan

### Phase 1: Foundation (Backend Infrastructure)
Set up database schema and backend entities for resident profiles. This creates the data layer needed to store profile information.

**Key Deliverables:**
- Flyway migration for resident_profiles table
- ResidentProfile JPA entity
- EmploymentStatus enum with detailed options
- ResidentProfileRepository

### Phase 2: Core Implementation (Backend API + Frontend UI)
Implement the REST API endpoints and frontend profile completion wizard. This creates the full user experience.

**Key Deliverables:**
- ResidentProfileService with create/read/update operations
- ResidentController with REST endpoints
- Profile completion wizard with multi-step form
- Form validation on frontend and backend

### Phase 3: Integration (Auth Flow + Routing)
Integrate profile completion into the authentication flow so users are redirected appropriately based on profile status.

**Key Deliverables:**
- AuthResponse includes profileCompleted flag
- OAuthCallbackPage checks profile status and redirects
- ProtectedRoute for resident dashboard requires completed profile
- Profile completion status persisted in auth context

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Create Database Migration

**Create V4__create_resident_profiles_table.sql:**
```sql
CREATE TABLE resident_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT NOT NULL,
    employment_status VARCHAR(50) NOT NULL,
    profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resident_profiles_user_id ON resident_profiles(user_id);

COMMENT ON TABLE resident_profiles IS 'Stores resident-specific profile data for room rental applications';
COMMENT ON COLUMN resident_profiles.employment_status IS 'Enum: EMPLOYED, SELF_EMPLOYED, PART_TIME, CONTRACTOR, STUDENT, RETIRED, DISABLED, UNEMPLOYED, OTHER';
```

**Test Migration:**
- Run `./start-backend.sh` to apply migration
- Verify table created with correct columns

### 2. Create Backend Models and DTOs

**Create EmploymentStatus.java enum:**
```java
public enum EmploymentStatus {
    EMPLOYED,
    SELF_EMPLOYED,
    PART_TIME,
    CONTRACTOR,
    STUDENT,
    RETIRED,
    DISABLED,
    UNEMPLOYED,
    OTHER
}
```

**Create ResidentProfile.java entity:**
- UUID id (primary key)
- User user (OneToOne relationship)
- String bio (required, min 50 chars, max 1000 chars)
- EmploymentStatus employmentStatus (required)
- Boolean profileCompleted (default false)
- LocalDateTime createdAt, updatedAt
- @PrePersist and @PreUpdate hooks

**Create ResidentProfileDTO.java:**
- id, userId, bio, employmentStatus, profileCompleted, createdAt, updatedAt

**Create ResidentProfileRequest.java:**
- bio (required), employmentStatus (required), phone (optional)

### 3. Create Repository and Service

**Create ResidentProfileRepository.java:**
- findByUserId(UUID userId)
- existsByUserId(UUID userId)

**Create ResidentProfileService.java:**
- createProfile(UUID userId, ResidentProfileRequest request)
- getProfileByUserId(UUID userId)
- updateProfile(UUID userId, ResidentProfileRequest request)
- isProfileCompleted(UUID userId)
- toDTO(ResidentProfile profile)

**Write Unit Tests:**
- ResidentProfileServiceTest.java - Test CRUD operations, validation

### 4. Create REST Controller

**Create ResidentController.java:**
- POST /api/residents/profile - Create profile (requires RESIDENT role)
- GET /api/residents/profile - Get current user's profile
- PUT /api/residents/profile - Update profile
- GET /api/residents/profile/status - Check if profile is completed

**Add Swagger Documentation:**
- @Operation annotations on all endpoints
- Request/response schema documentation

**Write Controller Tests:**
- ResidentControllerTest.java - Test all endpoints, auth requirements

### 5. Update Auth Flow for Profile Status

**Update AuthService.java:**
- Add method to check profile completion status
- Include profileCompleted in auth response for RESIDENT users

**Update AuthResponse.java:**
- Add hasCompletedProfile boolean field

**Update UserDTO.java:**
- Add profileCompleted field

**Update AuthController /api/auth/me:**
- Include profile completion status for residents

### 6. Create Frontend Profile Completion Page

**Create ResidentProfilePage.jsx:**
- Multi-step wizard container
- Steps: Bio → Employment → Phone (optional) → Review
- Progress indicator showing current step
- Navigation between steps (back/next)
- Submit handler that calls API
- Redirect to dashboard on success

**Create ProfileWizard.jsx:**
- Reusable wizard component
- Props: steps, currentStep, onNext, onBack, onSubmit
- Renders current step component
- Shows progress bar

### 7. Create Form Step Components

**Create BioStep.jsx:**
- Textarea for bio (min 50 chars, max 1000 chars)
- Character counter
- Placeholder with helpful prompt
- Validation feedback

**Create EmploymentStep.jsx:**
- Radio buttons or select for employment status
- All 9 options from enum
- Clear labels and descriptions for each option

**Create PhoneStep.jsx:**
- Phone input field (optional)
- Format validation
- Skip button
- "We'll use this to contact you about applications"

**Create ProfileReview.jsx:**
- Summary of all entered data
- Edit buttons to go back to specific steps
- Confirm and submit button

### 8. Create Resident Service

**Create residentService.js:**
```javascript
export const createProfile = async (profileData) => {
  return api.post('/api/residents/profile', profileData);
};

export const getProfile = async () => {
  return api.get('/api/residents/profile');
};

export const updateProfile = async (profileData) => {
  return api.put('/api/residents/profile', profileData);
};

export const getProfileStatus = async () => {
  return api.get('/api/residents/profile/status');
};
```

### 9. Update Auth Context and Routing

**Update AuthContext.jsx:**
- Add profileCompleted to user state
- Update checkAuth() to include profile status
- Add method to refresh profile status

**Update App.jsx:**
- Add route: /onboarding/resident-profile → ResidentProfilePage
- Update OAuthCallbackPage redirect logic:
  - If RESIDENT and !profileCompleted → /onboarding/resident-profile
  - If RESIDENT and profileCompleted → /resident/dashboard

**Create ProfileProtectedRoute.jsx:**
- Wraps resident dashboard
- Checks if profile is completed
- Redirects to profile completion if not

### 10. Update OAuth Callback Logic

**Update OAuthCallbackPage.jsx:**
```javascript
// After successful auth:
if (user.role === 'RESIDENT') {
  if (!authResponse.hasCompletedProfile) {
    navigate('/onboarding/resident-profile');
  } else {
    navigate('/resident/dashboard');
  }
} else if (user.role === 'HOST') {
  navigate('/host/dashboard');
} else if (user.role === 'ADMIN') {
  navigate('/admin/dashboard');
}
```

### 11. Create E2E Test Documentation

**Create .claude/commands/e2e/test_resident_profile.md:**
- Test Case 1: New resident completes profile
  - Login with Google
  - Select RESIDENT role
  - Verify redirect to profile completion
  - Fill bio (50+ chars)
  - Select employment status
  - Skip phone (optional)
  - Review and submit
  - Verify redirect to dashboard
  - Take screenshot

- Test Case 2: Returning resident with incomplete profile
  - Login as existing resident without profile
  - Verify forced redirect to profile completion
  - Complete profile
  - Verify dashboard access

- Test Case 3: Profile validation
  - Try submitting bio under 50 chars
  - Verify validation error shown
  - Try skipping employment status
  - Verify required field error

- Test Case 4: Edit profile after completion
  - Login as resident with completed profile
  - Navigate to settings/profile
  - Edit bio
  - Verify changes saved

### 12. Run Validation Commands

**Run all tests and verify no regressions**

## Testing Strategy

### Unit Tests

**Backend:**
1. ResidentProfileServiceTest.java
   - Test profile creation with valid data
   - Test profile creation with invalid bio (too short)
   - Test profile update
   - Test duplicate profile prevention
   - Test profile status check

2. ResidentControllerTest.java
   - Test POST /api/residents/profile with valid data
   - Test POST returns 400 for invalid data
   - Test GET returns 404 if no profile
   - Test PUT updates existing profile
   - Test endpoints require authentication
   - Test endpoints require RESIDENT role

**Frontend:**
- Test ProfileWizard navigation between steps
- Test form validation on each step
- Test API call on submit

### Edge Cases

1. **User with RESIDENT role but no profile:**
   - Should be redirected to profile completion
   - Should not access dashboard

2. **User tries to create duplicate profile:**
   - Backend should return 409 Conflict
   - Frontend should handle gracefully

3. **Bio exactly at boundaries:**
   - 49 chars should fail validation
   - 50 chars should pass
   - 1000 chars should pass
   - 1001 chars should fail

4. **Phone number formats:**
   - Various formats should be accepted
   - Invalid formats should show warning (not error, since optional)

5. **User refreshes during wizard:**
   - State should be preserved (localStorage?)
   - Or user starts over (acceptable for MVP)

6. **Network failure during submit:**
   - Show error message
   - Allow retry
   - Don't lose form data

## Acceptance Criteria

1. **Profile Creation:**
   - [ ] RESIDENT users can create profile with bio and employment status
   - [ ] Bio must be between 50-1000 characters
   - [ ] Employment status is required (one of 9 options)
   - [ ] Phone is optional

2. **Onboarding Flow:**
   - [ ] New residents redirected to profile completion after role selection
   - [ ] Returning residents without profile redirected to complete it
   - [ ] Residents with completed profile go directly to dashboard
   - [ ] Profile wizard shows progress through steps

3. **Validation:**
   - [ ] Bio length validated on frontend and backend
   - [ ] Employment status required validation
   - [ ] Clear error messages for validation failures

4. **API Security:**
   - [ ] All endpoints require authentication
   - [ ] Profile endpoints require RESIDENT role
   - [ ] Users can only access their own profile

5. **User Experience:**
   - [ ] Multi-step wizard with clear progress indication
   - [ ] Back/Next navigation between steps
   - [ ] Review step before final submission
   - [ ] Success redirect to dashboard

6. **Data Persistence:**
   - [ ] Profile saved to database
   - [ ] Profile completion status tracked
   - [ ] Profile can be updated after initial creation

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

### Backend Validation
```bash
# Run all backend tests
cd backend && ./mvnw test

# Run specific profile tests
cd backend && ./mvnw test -Dtest=ResidentProfileServiceTest
cd backend && ./mvnw test -Dtest=ResidentControllerTest

# Build and verify
cd backend && ./mvnw clean install

# Start backend and verify migration
./start-backend.sh
# Check logs for "V4__create_resident_profiles_table.sql" migration success

# Test profile endpoints manually
curl -X POST http://localhost:8080/api/residents/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bio": "This is my bio with at least 50 characters for testing.", "employmentStatus": "EMPLOYED"}'
```

### Frontend Validation
```bash
# Install dependencies
cd frontend && npm install

# Build frontend
cd frontend && npm run build

# Run linter
cd frontend && npm run lint

# Start frontend
./start-frontend.sh
```

### E2E Validation
```bash
# Start all services
./start-dev.sh

# Manual E2E tests per .claude/commands/e2e/test_resident_profile.md
# 1. Test new resident profile completion
# 2. Test returning resident redirect
# 3. Test validation errors
# 4. Test profile edit
```

### Regression Testing
```bash
# Verify existing auth flow still works
# 1. Login with Google OAuth
# 2. Select role (should still work)
# 3. Existing message functionality at /test.html

# Run all backend tests
cd backend && ./mvnw test
```

## Notes

### Employment Status Options (Detailed)

| Value | Display Label | Description |
|-------|--------------|-------------|
| EMPLOYED | Full-time Employed | Working full-time for an employer |
| SELF_EMPLOYED | Self-Employed | Running own business or freelancing |
| PART_TIME | Part-time Employed | Working part-time hours |
| CONTRACTOR | Contractor/Gig Worker | Contract work, gig economy |
| STUDENT | Student | Currently enrolled in education |
| RETIRED | Retired | No longer working by choice |
| DISABLED | Receiving Disability | Receiving disability benefits |
| UNEMPLOYED | Currently Unemployed | Seeking employment |
| OTHER | Other | Doesn't fit above categories |

### Future Enhancements (Out of Scope)

1. **Background Check Integration** - Connect to Checkr/TransUnion for resident verification
2. **Income Verification** - Verify employment with pay stubs or bank statements
3. **References** - Allow residents to add landlord references
4. **ID Verification** - Upload government ID for identity verification
5. **Profile Picture Upload** - Custom picture beyond Google profile
6. **Social Profiles** - Link LinkedIn, Facebook for credibility

### Design Decisions

1. **Bio Minimum 50 chars**: Ensures meaningful content for hosts to review
2. **Employment Required**: Hosts need this to assess financial stability
3. **Phone Optional**: Not blocking, but prompted - useful for contact
4. **Multi-step Wizard**: Better UX than single long form
5. **Profile Completion Flag**: Simple boolean vs. percentage (keep simple for MVP)

### Dependencies

- No new libraries required
- Uses existing Spring Boot, JPA, React Router setup
- Follows existing patterns from auth implementation
