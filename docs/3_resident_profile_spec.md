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

## Implementation Plan

### Phase 1: Foundation (Backend Infrastructure)
- Flyway migration for resident_profiles table
- ResidentProfile JPA entity
- EmploymentStatus enum with detailed options
- ResidentProfileRepository

### Phase 2: Core Implementation (Backend API + Frontend UI)
- ResidentProfileService with create/read/update operations
- ResidentController with REST endpoints
- Profile completion wizard with multi-step form
- Form validation on frontend and backend

### Phase 3: Integration (Auth Flow + Routing)
- AuthResponse includes profileCompleted flag
- OAuthCallbackPage checks profile status and redirects
- ProtectedRoute for resident dashboard requires completed profile
- Profile completion status persisted in auth context

## Employment Status Options

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

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/residents/profile | Create resident profile |
| GET | /api/residents/profile | Get current user's profile |
| PUT | /api/residents/profile | Update profile |
| GET | /api/residents/profile/status | Check profile completion status |

## Files to Create

### Backend
- `V4__create_resident_profiles_table.sql` - Database migration
- `EmploymentStatus.java` - Enum for employment options
- `ResidentProfile.java` - JPA entity
- `ResidentProfileDTO.java` - DTO for API responses
- `ResidentProfileRequest.java` - Request DTO
- `ResidentProfileRepository.java` - JPA repository
- `ResidentProfileService.java` - Business logic
- `ResidentController.java` - REST endpoints

### Frontend
- `ResidentProfilePage.jsx` - Profile completion wizard
- `ProfileWizard.jsx` - Multi-step form component
- `BioStep.jsx` - Bio input step
- `EmploymentStep.jsx` - Employment selection step
- `PhoneStep.jsx` - Optional phone input step
- `ProfileReview.jsx` - Review before submit
- `residentService.js` - API calls

## Acceptance Criteria

- [ ] RESIDENT users can create profile with bio and employment status
- [ ] Bio must be between 50-1000 characters
- [ ] Employment status is required (one of 9 options)
- [ ] Phone is optional but prompted
- [ ] New residents redirected to profile completion after role selection
- [ ] Residents with completed profile go directly to dashboard
- [ ] All endpoints require authentication and RESIDENT role
- [ ] Multi-step wizard with progress indication

## See Also
- Full spec: `specs/3_resident-profile.md`
- PRD: `docs/ROOMPILOT_PRD_v1.md` (Section 5.2 - Resident Onboarding)
- Auth spec: `specs/2_auth-login.md`
