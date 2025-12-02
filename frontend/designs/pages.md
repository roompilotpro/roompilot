# RoomPilot UI Pages Specification

This document contains specifications for all pages needed in the RoomPilot application. Each page section includes the page name, description, key components, and design notes. Use this as a reference for building each page individually.

---

## Design System Reference

All pages should use the established RoomPilot design system:

### Colors
```css
--color-midnight: #0f1419;
--color-charcoal: #1a2332;
--color-slate: #3d4f5f;
--color-mist: #8899a6;
--color-cloud: #e8ecef;
--color-snow: #f7f9fa;
--color-white: #ffffff;

--color-primary: #2563eb;
--color-primary-light: #3b82f6;
--color-primary-dark: #1d4ed8;
--color-primary-bg: #eff6ff;

--color-accent: #10b981;
--color-accent-light: #34d399;
--color-accent-bg: #ecfdf5;

--color-warm: #f59e0b;
--color-warm-bg: #fffbeb;
--color-coral: #f43f5e;
--color-coral-bg: #fff1f2;
```

### Typography
- Display font: `'Fraunces', Georgia, serif`
- Body font: `'DM Sans', -apple-system, sans-serif`

### Existing Pages (Already Built)
1. `roompilot-landing.html` - Landing page
2. `roompilot-search.html` - Search/browse listings
3. `roompilot-room-detail.html` - Room detail page
4. `roompilot-landlord-dashboard.html` - Landlord dashboard

---

## 1. PUBLIC / MARKETING PAGES

### 1.1 How It Works - Renters
**File:** `public-how-it-works-renters.html`

**Description:** Step-by-step guide showing renters how to find and secure a room on RoomPilot.

**Key Components:**
- Navigation (same as landing page)
- Hero section with headline "Find Your Room in 3 Simple Steps"
- Step-by-step flow with illustrations:
    1. Search & Browse - Find rooms by location, price, amenities
    2. Apply Instantly - Submit your profile, optional background check
    3. Move In & Pay Weekly - Low upfront cost, pay as you go
- Benefits section (no membership fees, weekly payments, transparent pricing)
- Comparison: RoomPilot vs traditional renting (lower upfront, faster process)
- FAQ accordion specific to renters
- CTA: "Find a Room" button
- Footer

**Design Notes:**
- Use timeline/step visualization with icons
- Include placeholder images for app screenshots
- Light, welcoming aesthetic

---

### 1.2 How It Works - Landlords
**File:** `public-how-it-works-landlords.html`

**Description:** Walkthrough for landlords showing the hosting journey and platform benefits.

**Key Components:**
- Navigation
- Hero: "Start Earning More From Your Rooms"
- Step-by-step host journey:
    1. List Your Property - Add photos, set prices and rules
    2. Review Applications - You approve who moves in
    3. Automate Billing - Weekly rent collected automatically
    4. Get Paid Fast - Daily/weekly payouts via Stripe
- Dashboard preview section (screenshot of landlord dashboard)
- Fee comparison table vs PadSplit/Bungalow
- Automation features highlight (auto-billing, reminders, late fees)
- Testimonial placeholders
- CTA: "Start Hosting" button
- Footer

**Design Notes:**
- Show dashboard screenshots/mockups
- Emphasize control and automation
- Use the dark card style for automation features section

---

### 1.3 Pricing Page
**File:** `public-pricing.html`

**Description:** Clear breakdown of RoomPilot's fee structure for hosts.

**Key Components:**
- Navigation
- Hero: "Simple, Transparent Pricing"
- Pricing cards:
    - **Transaction Fee Plan**: 2% per rent payment, no monthly fee
    - **Flat Rate Plan** (optional): $15/room/month, 0% transaction fee
- "What's Included" feature list for both plans
- Comparison calculator (input rooms + rent = see savings vs competitors)
- Competitor comparison table (RoomPilot vs PadSplit vs Bungalow)
- FAQ accordion (payment processing, when fees apply, Stripe fees)
- CTA: "Get Started Free"
- Footer

**Design Notes:**
- Highlight the 2% plan as recommended
- Use green accent for savings callouts
- Calculator should be interactive

---

### 1.4 Trust & Safety Page
**File:** `public-trust-safety.html`

**Description:** Overview of platform security, verification, and protection measures.

**Key Components:**
- Navigation
- Hero: "Your Safety is Our Priority"
- Sections:
    - Host Verification (ID verification, Stripe KYC)
    - Tenant Screening (optional background checks, profile verification)
    - Secure Payments (Stripe integration, encrypted transactions)
    - Communication Safety (in-app messaging, no phone sharing until approved)
    - Dispute Resolution (how issues are handled)
- Trust badges (Stripe, background check partner logos)
- FAQ on safety topics
- Footer

**Design Notes:**
- Use shield/lock icons throughout
- Professional, reassuring tone
- Clean sections with icons

---

### 1.5 FAQ / Help Center
**File:** `public-faq.html`

**Description:** Comprehensive FAQ with categorized questions for hosts and renters.

**Key Components:**
- Navigation
- Search bar at top
- Category tabs: All | For Hosts | For Renters | Payments | Getting Started
- Accordion-style FAQ sections:
    - Getting Started
    - Payments & Billing
    - For Hosts
    - For Renters
    - Account & Settings
    - Trust & Safety
- Contact support CTA at bottom
- Footer

**Design Notes:**
- Clean, searchable interface
- Expandable accordions
- Highlight popular questions

---

### 1.6 Terms of Service
**File:** `public-terms.html`

**Description:** Legal terms of service document.

**Key Components:**
- Navigation (minimal)
- Document title and last updated date
- Table of contents with anchor links
- Formatted legal text sections
- Footer

**Design Notes:**
- Clean, readable typography
- Proper heading hierarchy
- Sticky table of contents on desktop

---

### 1.7 Privacy Policy
**File:** `public-privacy.html`

**Description:** Privacy policy document.

**Key Components:**
- Same structure as Terms of Service
- Sections: Data collection, usage, sharing, retention, rights, contact

---

## 2. AUTHENTICATION & ONBOARDING

### 2.1 Sign Up - Role Selection
**File:** `auth-signup.html`

**Description:** Initial sign-up page where users choose their role.

**Key Components:**
- Minimal navigation (logo only)
- Two role cards:
    - "I'm looking for a room" (Renter) - icon, description, CTA
    - "I have rooms to rent" (Landlord) - icon, description, CTA
- Or sign in link for existing users
- Social proof footer (# of rooms, # of hosts)

**Design Notes:**
- Centered, focused layout
- Large clickable cards
- Friendly, welcoming copy

---

### 2.2 Sign Up - Form
**File:** `auth-signup-form.html`

**Description:** Registration form after role selection.

**Key Components:**
- Logo
- Role indicator ("Signing up as a Renter/Host")
- Form fields:
    - Full name
    - Email
    - Password (with strength indicator)
    - Phone number
- OAuth buttons (Google, Apple)
- Terms acceptance checkbox
- Submit button
- "Already have an account? Log in" link

**Design Notes:**
- Clean, single-column form
- Password visibility toggle
- Inline validation

---

### 2.3 Login
**File:** `auth-login.html`

**Description:** Login page for existing users.

**Key Components:**
- Logo
- Email/password fields
- "Remember me" checkbox
- "Forgot password?" link
- Login button
- OAuth buttons
- "Don't have an account? Sign up" link

**Design Notes:**
- Minimal, focused design
- Consider split layout with image on desktop

---

### 2.4 Forgot Password
**File:** `auth-forgot-password.html`

**Description:** Password reset request page.

**Key Components:**
- Logo
- Explanation text
- Email input
- Submit button
- Back to login link

---

### 2.5 Reset Password
**File:** `auth-reset-password.html`

**Description:** Set new password page (accessed via email link).

**Key Components:**
- Logo
- New password field
- Confirm password field
- Password requirements list
- Submit button

---

### 2.6 Host Onboarding Wizard
**File:** `onboarding-host.html`

**Description:** Multi-step onboarding for new hosts.

**Key Components:**
- Progress indicator (Step 1 of 3)
- Step 1: Basic Info
    - Business/host name
    - Phone number
    - City/region where you operate
- Step 2: Connect Payouts
    - Stripe Connect integration card
    - Explanation of payout process
    - "Connect with Stripe" button
- Step 3: Add Your First Property
    - Option to add now or skip
    - Quick property form or link to full flow
- Completion screen with next steps

**Design Notes:**
- Clean wizard UI with clear progress
- Allow skip where appropriate
- Celebratory completion state

---

### 2.7 Renter Onboarding Wizard
**File:** `onboarding-renter.html`

**Description:** Multi-step onboarding for new renters.

**Key Components:**
- Progress indicator
- Step 1: Profile Basics
    - Phone number
    - Current city
    - Employment status (dropdown)
    - Move-in timeline
- Step 2: Background Check (Optional)
    - Explanation of benefits
    - Consent checkbox
    - "Add background check" or "Skip for now"
- Step 3: Search Preferences
    - Budget range (weekly)
    - Preferred neighborhoods
    - Must-have amenities
- Completion: "Start Searching" CTA

**Design Notes:**
- Friendly, low-pressure tone
- Make optional steps clearly optional
- Save progress

---

## 3. RENTER-FACING PAGES

### 3.1 Renter Dashboard
**File:** `renter-dashboard.html`

**Description:** Main dashboard for renters showing their current living situation.

**Key Components:**
- Renter navigation (Dashboard, Payments, Messages, Profile)
- Current stay card (if housed):
    - Property photo and name
    - Room number
    - Host name with message button
    - Next payment due date and amount
    - Quick actions: Pay Now, View Schedule, Message Host
- Payment summary widget
- Recent activity feed
- Quick action tiles:
    - Make a Payment
    - View Payment Schedule
    - Message Host
    - Report Maintenance Issue
- Empty state (if no current room): CTA to find a room

**Design Notes:**
- Mobile-first design
- Prominent payment information
- Easy access to communication

---

### 3.2 Application Flow
**File:** `renter-application-flow.html`

**Description:** Multi-step application process for a room.

**Key Components:**
- Room summary header (photo, name, price - sticky)
- Progress steps indicator
- Step 1: Confirm Profile
    - Review/edit personal info
    - Phone verification
    - Employment info
- Step 2: Background Check (if required or optional)
    - Explanation and pricing ($30)
    - Consent form
    - Skip option if not required
- Step 3: Payment Summary
    - First week rent
    - Move-in fee (if any)
    - Background check fee (if added)
    - Total due today
    - Payment method input
- Step 4: Review & Submit
    - Terms acceptance
    - Submit application button
- Confirmation screen: "Application Submitted - Awaiting Host Approval"

**Design Notes:**
- Show room context throughout
- Clear cost breakdown
- Reassuring confirmation state

---

### 3.3 Renter Wallet / Payments
**File:** `renter-payments.html`

**Description:** Payment management page for renters.

**Key Components:**
- Renter navigation
- Wallet balance card (if using wallet model)
- Upcoming payments section:
    - Next payment date, amount
    - Payment schedule (weekly calendar view)
- Auto-pay toggle with settings
- Payment history list:
    - Date, amount, status, receipt link
- Add funds button (if wallet)
- Payment methods section:
    - Saved cards/bank accounts
    - Add new method
- Download statements

**Design Notes:**
- Clear payment schedule visualization
- Easy access to receipts
- Prominent auto-pay setup

---

### 3.4 Renter Messages
**File:** `renter-messages.html`

**Description:** Messaging interface for renters.

**Key Components:**
- Renter navigation
- Conversation list sidebar:
    - Host conversation
    - House group chat (if applicable)
    - System notifications
    - Unread indicators
- Chat view:
    - Message bubbles (sent/received)
    - Timestamps
    - Image attachments support
    - Message input with send button
- Empty state for no conversations

**Design Notes:**
- Clean chat interface
- Mobile-responsive (full-screen chat on mobile)
- Real-time feel (even if not implemented)

---

### 3.5 Maintenance Requests
**File:** `renter-maintenance.html`

**Description:** Submit and track maintenance requests.

**Key Components:**
- Renter navigation
- "New Request" button
- Active requests list:
    - Issue title
    - Status badge (Submitted, In Progress, Resolved)
    - Date submitted
- Request detail view:
    - Description
    - Photos attached
    - Status timeline
    - Communication thread with host
- New request form:
    - Issue category dropdown
    - Description textarea
    - Photo upload
    - Urgency level
    - Submit button

**Design Notes:**
- Simple ticket system UI
- Clear status indicators
- Photo upload for issues

---

### 3.6 Renter Profile
**File:** `renter-profile.html`

**Description:** Renter's profile and verification status.

**Key Components:**
- Renter navigation
- Profile header:
    - Avatar (editable)
    - Name
    - Member since date
- Verification badges section:
    - Phone verified ✓
    - Email verified ✓
    - ID verified (status)
    - Background check (status)
- Personal info form (editable):
    - Name, email, phone
    - Current address
    - Employment info
- Saved searches / alerts (optional)
- Rental history (past stays on RoomPilot)

**Design Notes:**
- Progress toward "fully verified" status
- Easy editing with save states

---

### 3.7 Renter Settings
**File:** `renter-settings.html`

**Description:** Account settings for renters.

**Key Components:**
- Renter navigation
- Sections:
    - Account (email, password change)
    - Notifications (email, SMS, push toggles)
    - Privacy settings
    - Connected accounts (Google, etc.)
    - Close account

**Design Notes:**
- Standard settings page layout
- Toggle switches for notifications
- Danger zone for account closure

---

## 4. LANDLORD-FACING PAGES

### 4.1 Properties List
**File:** `landlord-properties.html`

**Description:** Overview of all properties managed by the host.

**Key Components:**
- Landlord sidebar navigation
- Header with "Add Property" button
- Properties grid/list view toggle
- Property cards showing:
    - Photo
    - Property name and address
    - Rooms count (occupied/total)
    - Monthly revenue
    - Status indicator
    - Quick actions menu
- Empty state with "Add Your First Property" CTA
- Filters: status, occupancy

**Design Notes:**
- Card-based layout
- Visual occupancy indicators
- Quick access to property details

---

### 4.2 Property Detail / Edit
**File:** `landlord-property-detail.html`

**Description:** Detailed view and management of a single property.

**Key Components:**
- Landlord sidebar
- Property header with photo, name, address, edit button
- Tab navigation:
    - **Overview**: Photos, description, amenities, house rules
    - **Rooms**: List of rooms with status, price, tenant
    - **Tenants**: Current residents with payment status
    - **Applications**: Pending applications for this property
    - **Maintenance**: Open tickets for this property
- Quick stats: occupancy, monthly revenue, avg rating
- Action buttons: Edit Property, Add Room, View Listing

**Design Notes:**
- Tabbed interface for organization
- Inline editing where possible
- Clear room-by-room breakdown

---

### 4.3 Room Management
**File:** `landlord-room-detail.html`

**Description:** Individual room management page.

**Key Components:**
- Landlord sidebar
- Breadcrumb: Properties > [Property Name] > [Room Name]
- Room header: name/number, status badge, edit button
- Room details card:
    - Photos
    - Price (weekly/monthly)
    - Size, bed type, bathroom type
    - Amenities specific to room
    - Availability date
- Current tenant section (if occupied):
    - Tenant info
    - Move-in date
    - Payment status
    - Quick actions (message, view payments)
- Billing settings for this room:
    - Rent amount
    - Late fee rules
    - Deposit/move-in fee
- Payment history for this room
- Tenancy timeline

**Design Notes:**
- Clear occupied vs vacant states
- Easy price/rules editing
- Historical payment data

---

### 4.4 Add Property Flow
**File:** `landlord-add-property.html`

**Description:** Multi-step wizard to add a new property.

**Key Components:**
- Progress indicator (Step X of 5)
- Step 1: Basic Details
    - Property name
    - Address (with autocomplete)
    - Property type dropdown
- Step 2: Photos
    - Drag-and-drop upload
    - Photo reordering
    - Cover photo selection
- Step 3: Amenities & House Rules
    - Amenities checklist
    - House rules builder (smoking, pets, guests, quiet hours)
    - Custom rules input
- Step 4: Create Rooms
    - Add rooms one by one
    - Clone similar rooms
    - Set price, size, bed type for each
- Step 5: Review & Publish
    - Preview of listing
    - Publish toggle (active/draft)
    - Submit button
- Success screen with next steps

**Design Notes:**
- Save progress between steps
- Allow adding multiple rooms at once
- Preview before publishing

---

### 4.5 Add/Edit Room Flow
**File:** `landlord-add-room.html`

**Description:** Form to add or edit a room within a property.

**Key Components:**
- Modal or dedicated page
- Form fields:
    - Room name/number
    - Room type (private room, shared room)
    - Bathroom (private, shared)
    - Size (sq ft)
    - Bed type
    - Furnished status
    - Weekly rent price
    - Move-in fee / deposit
    - Minimum stay
    - Availability date
    - Room-specific amenities
    - Room-specific rules
- Photo upload for room
- Save / Cancel buttons

**Design Notes:**
- Consistent with property add flow
- Quick inline editing for existing rooms

---

### 4.6 Applications Inbox
**File:** `landlord-applications.html`

**Description:** List and manage tenant applications.

**Key Components:**
- Landlord sidebar
- Filter bar: All Properties dropdown, Status filter (Pending, Approved, Declined)
- Applications table/list:
    - Applicant name and avatar
    - Property and room applied for
    - Application date
    - Move-in date requested
    - Background check status
    - Status badge
    - Quick action buttons (View, Approve, Decline)
- Empty state: "No pending applications"
- Sort options: newest, oldest, move-in date

**Design Notes:**
- Clear pending count badge in sidebar
- Bulk actions if multiple selected
- Quick approve/decline without opening detail

---

### 4.7 Application Detail
**File:** `landlord-application-detail.html`

**Description:** Detailed view of a single application.

**Key Components:**
- Landlord sidebar
- Back to applications link
- Applicant header:
    - Name, photo
    - Contact info
    - Verification badges
- Application summary:
    - Room applied for
    - Requested move-in date
    - Planned stay length
    - Message from applicant
- Background check section (if completed):
    - Summary badge (Clear, Review, etc.)
    - View full report link
- Applicant profile details:
    - Employment info
    - Rental history
    - References (if any)
- Message thread with applicant
- Decision panel:
    - Approve button (triggers lease agreement)
    - Decline button (with reason dropdown)
    - Request More Info button
- On approval: digital agreement preview and payment request

**Design Notes:**
- All info needed to make decision on one page
- Clear action buttons
- Approval triggers next steps inline

---

### 4.8 Tenants List
**File:** `landlord-tenants.html`

**Description:** Overview of all current tenants across properties.

**Key Components:**
- Landlord sidebar
- Filter bar: Property dropdown, Payment status filter
- Tenants table:
    - Tenant name and avatar
    - Property and room
    - Move-in date
    - Payment status (Good, Due Soon, Late, At Risk)
    - Balance/amount due
    - Quick actions (Message, View)
- Summary stats: total tenants, late payments count
- Export tenant list

**Design Notes:**
- Color-coded payment status
- Sort by payment status to surface issues
- Quick message action

---

### 4.9 Tenant Detail
**File:** `landlord-tenant-detail.html`

**Description:** Detailed view of a single tenant from host perspective.

**Key Components:**
- Landlord sidebar
- Tenant header:
    - Name, photo
    - Contact info (phone, email)
    - Current room and property
- Tenancy details:
    - Move-in date
    - Lease/license terms
    - Rent amount and frequency
- Payment status card:
    - Current balance
    - Next payment due
    - Payment streak/history indicator
- Payment history table:
    - Date, amount, status, method
    - Late fees applied
- Notes section (internal, host-only)
- Actions:
    - Send Message
    - Post Manual Charge (future feature)
    - End Tenancy (with flow)
    - Download payment history

**Design Notes:**
- Complete tenant view for host
- Easy access to payment issues
- Clear end-tenancy flow

---

### 4.10 Payouts / Earnings
**File:** `landlord-payouts.html`

**Description:** View payouts and earnings from Stripe.

**Key Components:**
- Landlord sidebar
- Summary cards:
    - Available for payout
    - Next payout date
    - Total earned this month
    - Total earned all-time
- Upcoming payouts section
- Payout history table:
    - Date
    - Amount
    - Status
    - Properties included
    - View breakdown link
- Transaction detail modal:
    - Individual payments included
    - Fees deducted (RoomPilot + Stripe)
    - Net amount
- Export transactions (CSV)

**Design Notes:**
- Clear fee breakdown
- Connect to Stripe dashboard link
- Earnings trends chart (optional)

---

### 4.11 Billing & Automation Settings
**File:** `landlord-billing-settings.html`

**Description:** Configure billing rules and automation.

**Key Components:**
- Landlord sidebar
- Global defaults section:
    - Billing frequency (weekly default)
    - Grace period for late payments
    - Late fee amount and structure
    - Maximum late fee cap
- Automation toggles:
    - Auto-billing enabled
    - Auto-reminders enabled
    - Auto-late fees enabled
- Reminder schedule:
    - Days before due
    - On due date
    - Days after due
- Per-property overrides section:
    - List properties
    - Override defaults per property
- Save changes button

**Design Notes:**
- Toggle switches for automation
- Clear explanation of what each setting does
- Preview of reminder schedule

---

### 4.12 Host Messages
**File:** `landlord-messages.html`

**Description:** Messaging center for hosts.

**Key Components:**
- Landlord sidebar
- Conversation list:
    - Filter by property
    - Tenant conversations
    - House group chats
    - System notifications
    - Unread indicators
- Chat view (same as renter)
- Templates dropdown for quick responses
- Announcement composer (message all tenants in a property)

**Design Notes:**
- Filter by property for organization
- Template messages for common situations
- Broadcast capability

---

### 4.13 Announcement Composer
**File:** `landlord-announcement.html`

**Description:** Send broadcast messages to tenants.

**Key Components:**
- Landlord sidebar
- Recipient selector:
    - All tenants
    - Specific property
    - Specific rooms
- Message templates:
    - Rent reminder
    - Rule reminder
    - Maintenance notice
    - General announcement
- Message composer:
    - Subject line
    - Message body (rich text)
    - Attachment option
- Send options:
    - Send now
    - Schedule for later
- Preview before sending

**Design Notes:**
- Template library saves time
- Clear recipient count shown
- Scheduled send option

---

### 4.14 Maintenance Board
**File:** `landlord-maintenance.html`

**Description:** Manage maintenance requests across properties.

**Key Components:**
- Landlord sidebar
- View toggle: Kanban / List
- Kanban columns:
    - New
    - In Progress
    - Waiting on Parts/Vendor
    - Resolved
- Request cards:
    - Issue title
    - Property and room
    - Tenant name
    - Submitted date
    - Priority indicator
- Drag and drop between columns
- Filter by property
- Request detail modal:
    - Full description
    - Photos
    - Communication thread
    - Internal notes
    - Vendor assignment (text field)
    - Status update buttons

**Design Notes:**
- Kanban for visual workflow
- Easy status updates
- Photo viewing for issues

---

### 4.15 Host Profile
**File:** `landlord-profile.html`

**Description:** Host's public profile and business info.

**Key Components:**
- Landlord sidebar
- Profile preview card (as seen by renters)
- Editable fields:
    - Business/host name
    - Profile photo
    - Bio/description
    - Response time badge
    - Verification badges display
- Stats display:
    - Member since
    - Properties listed
    - Total rooms
    - Average rating
- Preview public profile button

**Design Notes:**
- Show what renters see
- Easy photo upload
- Verification status prominent

---

### 4.16 Payout Settings
**File:** `landlord-payout-settings.html`

**Description:** Stripe Connect and payout configuration.

**Key Components:**
- Landlord sidebar
- Stripe Connect status:
    - Connected / Not connected
    - Account status (verified, pending, issues)
    - Reconnect option
- Connected bank accounts:
    - List of accounts
    - Default account selector
    - Add new account
- Payout schedule:
    - Daily / Weekly preference
    - Minimum payout threshold
- Tax documents section:
    - 1099 forms (when available)
    - Download tax summary

**Design Notes:**
- Clear Stripe connection status
- Easy to update payout destination
- Tax document access

---

### 4.17 Host Account Settings
**File:** `landlord-settings.html`

**Description:** Account settings for hosts.

**Key Components:**
- Landlord sidebar
- Sections:
    - Account Info (email, password, phone)
    - Notification Preferences:
        - New applications
        - Payments received
        - Late payment alerts
        - Messages
        - (Email, SMS, Push toggles for each)
    - Security:
        - Two-factor authentication
        - Active sessions
    - Plan & Billing (if subscription model):
        - Current plan
        - Usage stats
        - Upgrade/downgrade
    - Close Account

**Design Notes:**
- Granular notification controls
- Clear security options
- Subscription management if applicable

---

## 5. SHARED PAGES

### 5.1 Notifications Center
**File:** `shared-notifications.html`

**Description:** Centralized notification feed for both user types.

**Key Components:**
- Navigation (contextual to user type)
- Filter: All, Unread
- Notification categories:
    - Payments
    - Messages
    - Applications
    - System
- Notification items:
    - Icon
    - Title and description
    - Timestamp
    - Read/unread indicator
    - Click to navigate to relevant page
- Mark all as read button
- Settings link

**Design Notes:**
- Grouped by date (Today, Yesterday, Earlier)
- Clear categorization
- Quick action to mark read

---

### 5.2 Help / Support Page (Authenticated)
**File:** `shared-help.html`

**Description:** In-app help center for logged-in users.

**Key Components:**
- User navigation
- Search bar
- Quick links:
    - Contact Support
    - FAQs
    - Getting Started Guide
- Category cards:
    - Payments & Billing
    - Account Settings
    - For Hosts / For Renters
    - Technical Issues
- Recent help articles
- Contact form or chat widget

**Design Notes:**
- Contextual to user type (host vs renter)
- Easy escalation to human support

---

### 5.3 Contact Support
**File:** `shared-contact.html`

**Description:** Support ticket submission form.

**Key Components:**
- Navigation
- Category dropdown
- Subject line
- Description textarea
- Attachment upload
- Related property/room selector (if applicable)
- Submit button
- Expected response time display

---

## 6. ERROR & EMPTY STATES

### 6.1 404 Not Found
**File:** `error-404.html`

**Description:** Page not found error.

**Key Components:**
- Logo
- "Page Not Found" message
- Friendly illustration
- Suggestions: Go home, Search, Contact support
- Search bar

---

### 6.2 500 Server Error
**File:** `error-500.html`

**Description:** Server error page.

**Key Components:**
- Logo
- "Something went wrong" message
- Apology text
- Retry button
- Contact support link

---

### 6.3 Maintenance Mode
**File:** `error-maintenance.html`

**Description:** Scheduled maintenance page.

**Key Components:**
- Logo
- "We'll be right back" message
- Expected return time
- Status page link

---

## 7. EMAIL TEMPLATES (Bonus)

If creating HTML email templates:

- `email-welcome.html` - Welcome email after signup
- `email-application-received.html` - Confirm application to renter
- `email-application-approved.html` - Approval notification
- `email-application-declined.html` - Decline notification
- `email-payment-reminder.html` - Upcoming payment reminder
- `email-payment-received.html` - Payment confirmation
- `email-payment-failed.html` - Failed payment alert
- `email-payout-sent.html` - Payout notification to host
- `email-new-application.html` - New application alert to host
- `email-maintenance-update.html` - Maintenance status update

---

## Summary: All Pages by Category

### Public (10 pages)
1. public-how-it-works-renters.html
2. public-how-it-works-landlords.html
3. public-pricing.html
4. public-trust-safety.html
5. public-faq.html
6. public-terms.html
7. public-privacy.html
8. public-blog.html (optional)
9. public-about.html (optional)
10. public-contact.html (optional)

### Auth & Onboarding (7 pages)
1. auth-signup.html
2. auth-signup-form.html
3. auth-login.html
4. auth-forgot-password.html
5. auth-reset-password.html
6. onboarding-host.html
7. onboarding-renter.html

### Renter (7 pages)
1. renter-dashboard.html
2. renter-application-flow.html
3. renter-payments.html
4. renter-messages.html
5. renter-maintenance.html
6. renter-profile.html
7. renter-settings.html

### Landlord (17 pages)
1. landlord-properties.html
2. landlord-property-detail.html
3. landlord-room-detail.html
4. landlord-add-property.html
5. landlord-add-room.html
6. landlord-applications.html
7. landlord-application-detail.html
8. landlord-tenants.html
9. landlord-tenant-detail.html
10. landlord-payouts.html
11. landlord-billing-settings.html
12. landlord-messages.html
13. landlord-announcement.html
14. landlord-maintenance.html
15. landlord-profile.html
16. landlord-payout-settings.html
17. landlord-settings.html

### Shared (3 pages)
1. shared-notifications.html
2. shared-help.html
3. shared-contact.html

### Error States (3 pages)
1. error-404.html
2. error-500.html
3. error-maintenance.html

### Already Built (4 pages)
1. roompilot-landing.html ✓
2. roompilot-search.html ✓
3. roompilot-room-detail.html ✓
4. roompilot-landlord-dashboard.html ✓

---

**Total: ~47 pages** (43 new + 4 existing)

---

## Implementation Notes for Claude Code

1. **Use consistent design system** - Reference the CSS variables and existing pages
2. **Mobile-first responsive** - All pages should work on mobile
3. **Use placeholder content** - Lorem ipsum for text, emoji/colored divs for images
4. **Static HTML/CSS** - No backend required, just UI mockups
5. **Interactive elements** - Basic JS for tabs, modals, dropdowns
6. **Consistent navigation** - Reuse sidebar/nav patterns from existing pages
7. **Link pages together** - Use relative links between pages for navigation

Each subagent should receive:
- This spec document
- The design system reference
- Example of an existing page for style reference