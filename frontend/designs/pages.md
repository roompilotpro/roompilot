# RoomPilot UI Pages Specification

This document tracks the status of all UI pages and specifies missing modals/components still needed.

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

---

## Completed Pages Summary

**Total: 49 pages completed**

### Public/Marketing (7 pages)
- `public-how-it-works-renters.html`
- `public-how-it-works-landlords.html`
- `public-pricing.html`
- `public-trust-safety.html`
- `public-faq.html`
- `public-terms.html`
- `public-privacy.html`

### Auth & Onboarding (7 pages)
- `auth-signup.html`
- `auth-signup-form.html`
- `auth-login.html`
- `auth-forgot-password.html`
- `auth-reset-password.html`
- `onboarding-host.html`
- `onboarding-renter.html`

### Renter (7 pages)
- `resident-dashboard.html`
- `renter-application-flow.html`
- `renter-payments.html`
- `renter-messages.html`
- `renter-maintenance.html`
- `renter-profile.html`
- `renter-settings.html`

### Landlord (18 pages)
- `landlord-dashboard.html`
- `landlord-properties.html`
- `landlord-property-detail.html`
- `landlord-room-detail.html`
- `landlord-add-property.html`
- `landlord-add-room.html`
- `landlord-applications.html`
- `landlord-application-detail.html`
- `landlord-tenants.html`
- `landlord-tenant-detail.html`
- `landlord-payouts.html`
- `landlord-payout-settings.html`
- `landlord-billing-settings.html`
- `landlord-messages.html`
- `landlord-announcement.html`
- `landlord-maintenance.html`
- `landlord-profile.html`
- `landlord-settings.html`

### Shared (3 pages)
- `shared-notifications.html`
- `shared-help.html`
- `shared-contact.html`

### Error States (3 pages)
- `error-404.html`
- `error-500.html`
- `error-maintenance.html`

### Other (4 pages)
- `landing.html`
- `search-page.html`
- `room-details.html`

---

## Missing Modals & Components

The following modals and components are needed to complete the UI. Each should be built as a reusable modal template.

### Modal Base Pattern
All modals should follow this structure:
- Overlay backdrop (semi-transparent dark)
- Centered modal container with max-width
- Header with title and close button (X)
- Body content area
- Footer with action buttons
- Escape key and backdrop click to close
- Focus trap for accessibility

---

## 1. PAYMENT & BILLING MODALS

### 1.1 modal-add-payment-method.html
**Description:** Modal form to add a new credit card or bank account for payments.

**Triggered From:**
- `renter-payments.html` - "Add New" button in payment methods section
- `renter-application-flow.html` - Payment step if no saved method

**Key Components:**
- Tab selector: Credit/Debit Card | Bank Account
- Card form:
    - Card number input with validation and card type detection
    - Expiration date (MM/YY picker)
    - CVV/CVC field (3-4 digits)
    - Cardholder name
    - Billing address section (expandable)
- Bank form:
    - Account holder name
    - Routing number (9 digits with validation)
    - Account number
    - Confirm account number
    - Account type dropdown (Checking/Savings)
- "Set as default payment method" checkbox
- Cancel / Save buttons
- Security badges (Stripe, encrypted)

**Design Notes:**
- Use Stripe Elements for PCI compliance
- Show card brand icon (Visa, Mastercard, Amex, Discover) on detection
- Real-time validation with inline error messages
- Loading spinner on save
- Success toast before closing

---

### 1.2 modal-payment-confirmation.html
**Description:** Success/failure state after completing a payment.

**Triggered From:**
- Any "Pay Now" button across the application
- `renter-payments.html` - Pay balance button
- `resident-dashboard.html` - Quick pay buttons

**Key Components:**
- Success state:
    - Green checkmark icon (animated)
    - "Payment Successful" heading
    - Amount paid
    - Confirmation number
    - Date and time
    - Receipt email sent note
    - "View Receipt" link
    - "Done" button
- Failure state:
    - Red X icon
    - "Payment Failed" heading
    - Error message (card declined, insufficient funds, etc.)
    - "Try Again" button
    - "Use Different Method" link
    - Support contact link

**Design Notes:**
- Use accent green for success, coral for failure
- Animate the icon on appearance
- Auto-close after 5 seconds on success (optional)

---

### 1.3 modal-receipt-viewer.html
**Description:** Display detailed receipt for a specific payment.

**Triggered From:**
- `renter-payments.html` - "View" links in payment history
- `landlord-payouts.html` - Transaction detail links

**Key Components:**
- Receipt header:
    - RoomPilot logo
    - "Payment Receipt" title
    - Receipt number
- Payment details:
    - Date and time
    - Amount paid
    - Payment method (last 4 digits of card)
    - Transaction ID
- Breakdown:
    - Weekly rent: $XXX
    - Late fee (if applicable): $XX
    - Processing fee: $X.XX
    - Total: $XXX.XX
- Property/room information
- Landlord information
- Actions:
    - Download PDF button
    - Print button
    - Email receipt button
- Close button

**Design Notes:**
- Clean, printable layout
- Use monospace font for transaction IDs
- PDF download should generate matching format

---

### 1.4 modal-add-funds.html
**Description:** Add money to wallet balance (if wallet feature enabled).

**Triggered From:**
- `renter-payments.html` - "Add Funds" button in wallet section

**Key Components:**
- Current balance display
- Amount input:
    - Preset amounts: $50, $100, $200, $500
    - Custom amount field
    - Minimum $10 note
- Payment method selector (saved cards)
- Add new payment method link
- Summary:
    - Amount to add
    - Processing fee (if any)
    - New balance after
- Cancel / Add Funds buttons

**Design Notes:**
- Highlight recommended amount
- Real-time balance calculation
- Disable submit if amount below minimum

---

### 1.5 modal-autopay-setup.html
**Description:** Configure automatic payment settings.

**Triggered From:**
- `renter-payments.html` - Auto-pay toggle or "Set Up" button
- `resident-dashboard.html` - Auto-pay CTA

**Key Components:**
- Enable/disable toggle at top
- Payment method selector
- Schedule options:
    - Pay on due date (default)
    - Pay X days before due date
- Notification preferences:
    - Email before charge
    - SMS reminder
- Terms acceptance checkbox
- Current rent amount display
- Cancel / Save Settings buttons

**Design Notes:**
- Show warning about card expiration
- Explain what happens if payment fails
- Success confirmation after saving

---

## 2. VERIFICATION & IDENTITY MODALS

### 2.1 modal-phone-verification.html
**Description:** Verify phone number via SMS OTP code.

**Triggered From:**
- `renter-profile.html` - Phone verification button
- `onboarding-renter.html` - Profile step
- `renter-application-flow.html` - Confirm profile step

**Key Components:**
- Phone number display (masked: ***-***-1234)
- "We sent a code to..." message
- OTP input field (6 digits, auto-advance)
- Countdown timer (60 seconds)
- "Resend Code" link (disabled until timer expires)
- "Use different number" link
- Cancel / Verify buttons

**Design Notes:**
- Auto-focus first digit
- Auto-submit when all 6 digits entered
- Show error shake animation on wrong code
- Success checkmark animation on verify

---

### 2.2 modal-id-verification.html
**Description:** Upload government ID for identity verification.

**Triggered From:**
- `renter-profile.html` - "Complete Verification" button
- `onboarding-renter.html` - Verification step

**Key Components:**
- Step indicator (1. Select ID Type, 2. Upload Front, 3. Upload Back)
- ID type selector:
    - Driver's License
    - State ID
    - Passport
    - Passport Card
- Upload area:
    - Drag and drop zone
    - Camera capture button (mobile)
    - File browser button
    - Accepted formats note (JPG, PNG, PDF)
- Photo preview with retake option
- Guidelines overlay showing ID placement
- Privacy notice
- Cancel / Submit for Review buttons

**Design Notes:**
- Show example of good vs bad photo
- Real-time quality check (blur, lighting)
- Processing indicator after submit
- Explain 24-48 hour review timeline

---

### 2.3 modal-background-check.html
**Description:** Consent and payment flow for optional background check.

**Triggered From:**
- `renter-application-flow.html` - Background check step
- `onboarding-renter.html` - Optional background check step
- `renter-profile.html` - Add background check button

**Key Components:**
- Explanation section:
    - What's included (criminal, eviction, credit)
    - How it helps your application
    - Who can see it
    - How long it's valid
- Consent form:
    - Full legal name input
    - Date of birth input
    - SSN input (optional, for credit check)
    - Current address
    - Consent checkbox with terms link
- Payment section:
    - Cost: $30 one-time fee
    - Payment method selector
    - Add new method link
- Processing time note (24-48 hours)
- Cancel / Authorize & Pay button

**Design Notes:**
- Secure lock icon near SSN field
- Mask SSN input except last 4
- Show trusted partner logo (Checkr, etc.)
- Clear that this is optional

---

## 3. APPLICATION & TENANT MODALS

### 3.1 modal-decline-application.html
**Description:** Decline a tenant application with reason.

**Triggered From:**
- `landlord-application-detail.html` - "Decline" button

**Key Components:**
- Applicant name and room applied for
- Reason selector (required):
    - Income requirements not met
    - Background check concerns
    - References could not be verified
    - Room no longer available
    - Applicant withdrew
    - Other
- Additional notes textarea (optional, internal)
- Message to applicant toggle:
    - Generic decline message preview
    - Option to customize message
- Warning: "This action cannot be undone"
- Cancel / Decline Application buttons

**Design Notes:**
- Use coral/red accent for decline action
- Confirm before sending
- Show what applicant will see

---

### 3.2 modal-approve-application.html
**Description:** Approve application and set move-in terms.

**Triggered From:**
- `landlord-application-detail.html` - "Approve" button

**Key Components:**
- Applicant summary (name, photo, verified badges)
- Room and property details
- Move-in terms:
    - Move-in date picker
    - Weekly rent amount (editable)
    - Move-in fee amount (editable)
    - Security deposit (if applicable)
- Payment due summary:
    - First week rent
    - Move-in fee
    - Total due from tenant
- License agreement preview link
- Message to applicant (auto-generated, editable)
- Cancel / Approve & Send buttons

**Design Notes:**
- Use accent green for approve action
- Show timeline of what happens next
- Explain tenant will receive email/notification

---

### 3.3 modal-request-info.html
**Description:** Request additional information from applicant.

**Triggered From:**
- `landlord-application-detail.html` - "Request More Info" button

**Key Components:**
- Common requests checkboxes:
    - Proof of income
    - Employment verification letter
    - Additional references
    - Photo ID
    - Bank statements
    - Other documents
- Custom request textarea
- Deadline picker (optional)
- Message preview
- Cancel / Send Request buttons

**Design Notes:**
- Show applicant will be notified
- Track request status in application timeline

---

### 3.4 modal-end-tenancy.html
**Description:** Initiate move-out process for a tenant.

**Triggered From:**
- `landlord-tenant-detail.html` - "End Tenancy" button

**Key Components:**
- Tenant and room information
- End reason selector:
    - Tenant request / voluntary move-out
    - Lease violation
    - Non-payment
    - End of lease term
    - Property being sold/renovated
    - Other
- Move-out date picker
- Checklist:
    - Final inspection scheduled
    - Outstanding balance review
    - Security deposit disposition
- Security deposit handling:
    - Full refund
    - Partial refund (with deductions)
    - No refund (with reason)
- Deductions itemizer (if partial/no refund):
    - Cleaning: $XX
    - Damages: $XX
    - Unpaid rent: $XX
- Final message to tenant
- Cancel / Process Move-Out buttons

**Design Notes:**
- Multi-step wizard format
- Legal compliance notes
- Timeline of deposit return requirements

---

### 3.5 modal-lease-renewal.html
**Description:** Offer lease renewal to existing tenant.

**Triggered From:**
- `landlord-tenant-detail.html` - "Offer Renewal" button
- Automated prompt near lease end

**Key Components:**
- Current lease summary:
    - Start date, end date
    - Current rent
    - Lease type
- New terms:
    - New start date
    - Lease duration (month-to-month, 6 months, 12 months)
    - New rent amount
    - Rent change note (+/- from current)
- Renewal incentives (optional):
    - One week free
    - Reduced first month
    - Waived fees
- Message to tenant
- Deadline for response picker
- Cancel / Send Renewal Offer buttons

**Design Notes:**
- Show percentage change in rent
- Preview what tenant will receive
- Track response status

---

## 4. PROPERTY & ROOM MODALS

### 4.1 modal-photo-gallery.html
**Description:** Full-screen photo gallery lightbox.

**Triggered From:**
- `room-details.html` - "Show all photos" button
- `landlord-property-detail.html` - Photo thumbnails
- Any property/room photo grid

**Key Components:**
- Full-screen overlay
- Large photo display
- Navigation arrows (left/right)
- Thumbnail strip at bottom
- Photo counter (3 of 12)
- Caption/description area
- Keyboard navigation (arrow keys, escape)
- Close button (X)
- Share button
- Download button (for landlords)

**Design Notes:**
- Swipe gestures on mobile
- Lazy load images
- Preload adjacent images
- Zoom on click/pinch

---

### 4.2 modal-photo-upload.html
**Description:** Upload and manage property/room photos.

**Triggered From:**
- `landlord-add-property.html` - Photos step
- `landlord-add-room.html` - Room photos section
- `landlord-property-detail.html` - Edit photos

**Key Components:**
- Drag and drop zone (large)
- File browser button
- Camera capture (mobile)
- Upload progress indicators
- Photo grid with:
    - Thumbnail preview
    - "Set as cover" star icon
    - Delete button
    - Drag handle for reorder
- Accepted formats: JPG, PNG (max 10MB each)
- Minimum 3 photos required note
- Cancel / Save Photos buttons

**Design Notes:**
- Batch upload support
- Reorder via drag and drop
- Show upload progress per file
- Auto-optimize images on upload

---

### 4.3 modal-clone-room.html
**Description:** Duplicate a room with optional modifications.

**Triggered From:**
- `landlord-add-property.html` - "Clone Room" button
- `landlord-property-detail.html` - Room actions menu

**Key Components:**
- Source room details display
- Number of copies selector (1-10)
- Room naming pattern:
    - Auto-increment (Room 2, Room 3...)
    - Custom naming template
- Fields to modify:
    - Price per room (same or individual)
    - Availability dates
    - Amenities (inherit or customize)
- Preview of rooms to be created
- Cancel / Create Rooms buttons

**Design Notes:**
- Show cost/revenue impact
- Quick creation for identical rooms
- Option to edit individually after

---

### 4.4 modal-pause-listing.html
**Description:** Temporarily hide listing from search.

**Triggered From:**
- `landlord-properties.html` - Quick actions dropdown
- `landlord-property-detail.html` - Status controls

**Key Components:**
- Property name and photo
- Current status indicator
- Reason selector:
    - Maintenance/repairs
    - Fully occupied
    - Personal reasons
    - Seasonal pause
    - Other
- Duration options:
    - Indefinitely
    - Until specific date
    - For X days/weeks
- What happens when paused:
    - Not visible in search
    - Existing applications kept
    - Current tenants unaffected
- Reactivation reminder option
- Cancel / Pause Listing buttons

**Design Notes:**
- Show when last active
- Easy reactivate from same menu

---

### 4.5 modal-delete-property.html
**Description:** Permanently delete a property listing.

**Triggered From:**
- `landlord-properties.html` - Quick actions dropdown
- `landlord-property-detail.html` - Settings tab

**Key Components:**
- Warning header (red)
- Property name and details
- Impact summary:
    - X active tenants will be affected
    - X pending applications will be declined
    - Payment history will be retained
- Requirements before deletion:
    - All tenants moved out
    - No pending applications
    - Outstanding balances resolved
- Type property name to confirm
- Cancel / Delete Property buttons (red)

**Design Notes:**
- Require explicit confirmation
- Show alternatives (pause instead)
- Cannot be undone warning
- Disable if active tenants

---

## 5. MESSAGING & COMMUNICATION MODALS

### 5.1 modal-quick-message.html
**Description:** Quick compose message without leaving current page.

**Triggered From:**
- `landlord-dashboard.html` - Contact buttons on tenant cards
- `resident-dashboard.html` - Message landlord button
- Various "Message" quick actions

**Key Components:**
- Recipient display (name, avatar)
- Subject line (optional)
- Message textarea
- Quick reply templates dropdown
- Attachment button
- Send / Cancel buttons

**Design Notes:**
- Pre-populate subject based on context
- Recent messages preview
- Character count for SMS fallback

---

### 5.2 modal-share-listing.html
**Description:** Share room listing via various channels.

**Triggered From:**
- `room-details.html` - Share button
- `search-page.html` - Listing card share action

**Key Components:**
- Listing preview card
- Share options:
    - Copy link button
    - Email (opens mail client)
    - Facebook
    - Twitter/X
    - WhatsApp
    - SMS/Text
- QR code display
- Embed code (for websites)
- Referral note (if referral program active)

**Design Notes:**
- Copy confirmation toast
- UTM parameters for tracking
- Mobile native share on supported devices

---

### 5.3 modal-report-listing.html
**Description:** Report a listing for policy violations.

**Triggered From:**
- `room-details.html` - Report button (flag icon)

**Key Components:**
- Reason selector (required):
    - Inaccurate information
    - Suspicious/scam listing
    - Discriminatory content
    - Inappropriate photos
    - Safety concerns
    - Other
- Additional details textarea
- Upload evidence (optional)
- Contact me about this checkbox
- Anonymous option
- Cancel / Submit Report buttons

**Design Notes:**
- Thank you message after submit
- Explain review process
- No immediate action visible to reported party

---

## 6. FINANCE & PAYOUT MODALS (Landlord)

### 6.1 modal-payout-breakdown.html
**Description:** Detailed breakdown of a specific payout.

**Triggered From:**
- `landlord-payouts.html` - "View Details" on payout row

**Key Components:**
- Payout header:
    - Date and status
    - Total amount
    - Bank account (last 4 digits)
- Payments included:
    - List of tenant payments
    - Date, tenant, room, amount for each
- Fees breakdown:
    - Gross amount
    - RoomPilot fee (2%)
    - Stripe processing fee
    - Net payout
- Late fees collected (if any)
- Download CSV button
- Download PDF button
- Close button

**Design Notes:**
- Sortable payment list
- Clear fee disclosure
- Match Stripe dashboard format

---

### 6.2 modal-update-bank-account.html
**Description:** Add or change payout bank account.

**Triggered From:**
- `landlord-payout-settings.html` - "Add Account" or "Change" button

**Key Components:**
- Current account display (if exists)
- New account form:
    - Account holder name
    - Account type (Checking/Savings)
    - Routing number
    - Account number
    - Confirm account number
- Verification method:
    - Micro-deposits (1-2 business days)
    - Instant verification (via Plaid)
- Default account selector (if multiple)
- Cancel / Save Account buttons

**Design Notes:**
- Stripe Connect integration
- Show verification status
- Warn about payout delays during verification

---

### 6.3 modal-tax-documents.html
**Description:** View and download tax documents.

**Triggered From:**
- `landlord-payout-settings.html` - Tax documents section
- `landlord-payouts.html` - Year-end link

**Key Components:**
- Year selector dropdown
- Available documents list:
    - 1099-K (if applicable)
    - Annual earnings summary
    - Payment detail export
- Document status:
    - Available
    - Processing
    - Not eligible (under threshold)
- Download buttons for each
- Request paper copy option
- Tax ID on file display
- Update tax info link

**Design Notes:**
- Explain 1099-K threshold
- Secure document delivery
- Link to tax FAQ

---

### 6.4 modal-manual-payout.html
**Description:** Request immediate payout of available balance.

**Triggered From:**
- `landlord-payouts.html` - "Get Paid Now" button

**Key Components:**
- Available balance display
- Bank account selector
- Payout speed options:
    - Standard (1-2 business days) - Free
    - Instant (minutes) - 1% fee
- Fee calculation display
- Net amount to receive
- Next automatic payout date note
- Cancel / Request Payout buttons

**Design Notes:**
- Show Instant availability based on bank
- Fee clearly displayed
- Confirmation before processing

---

## 7. STRIPE INTEGRATION MODALS

### 7.1 modal-stripe-connect.html
**Description:** Stripe Connect onboarding flow for hosts.

**Triggered From:**
- `onboarding-host.html` - Connect payouts step
- `landlord-payout-settings.html` - Connect/reconnect button

**Key Components:**
- Introduction:
    - Why Stripe is required
    - Security and compliance info
    - What information you'll need
- Requirements checklist:
    - Government ID
    - Bank account
    - Business info (if applicable)
- "Connect with Stripe" button (opens Stripe hosted form)
- Alternative: Manual setup steps
- Skip for now link (with consequences explained)

**Design Notes:**
- Opens Stripe in new tab/modal
- Return URL handles success/failure
- Show connection status on return

---

### 7.2 modal-stripe-connect-success.html
**Description:** Confirmation after successful Stripe connection.

**Triggered From:**
- Return from Stripe Connect OAuth flow

**Key Components:**
- Success checkmark animation
- "Payouts Connected!" heading
- Account summary:
    - Business name
    - Bank account (last 4)
    - Payout schedule
- What's next:
    - Add your first property
    - Set billing preferences
    - Configure payout schedule
- "Continue to Dashboard" button

**Design Notes:**
- Celebratory animation
- Clear next steps
- Help link if issues

---

## 8. MAINTENANCE MODALS

### 8.1 modal-maintenance-photos.html
**Description:** View full-size photos attached to maintenance request.

**Triggered From:**
- `renter-maintenance.html` - Photo thumbnails
- `landlord-maintenance.html` - Request photo previews

**Key Components:**
- Full-screen photo viewer
- Navigation between photos
- Photo metadata (date taken, submitted by)
- Download button
- Close button

**Design Notes:**
- Simpler than property gallery
- Focus on issue documentation
- Pinch to zoom on mobile

---

### 8.2 modal-schedule-inspection.html
**Description:** Schedule property inspection for maintenance.

**Triggered From:**
- `landlord-maintenance.html` - "Schedule Inspection" action
- `landlord-tenant-detail.html` - Move-out inspection

**Key Components:**
- Tenant and property info
- Purpose selector:
    - Maintenance follow-up
    - Pre-move-out inspection
    - Routine inspection
    - Other
- Date picker calendar
- Time slot selector
- Duration estimate
- Notify tenant toggle
- Custom message to tenant
- Cancel / Schedule buttons

**Design Notes:**
- Show tenant's preferred times (if available)
- Calendar integration option
- Reminder notifications

---

### 8.3 modal-cancel-request.html
**Description:** Cancel a submitted maintenance request.

**Triggered From:**
- `renter-maintenance.html` - Cancel button on open request

**Key Components:**
- Request summary
- Reason selector:
    - Issue resolved on its own
    - Fixed it myself
    - No longer needed
    - Submitted in error
    - Other
- Optional notes
- Warning about re-submitting
- Keep Request / Cancel Request buttons

**Design Notes:**
- Only available for "Submitted" status
- Cannot cancel in-progress requests
- Confirmation required

---

## 9. PROFILE & SETTINGS MODALS

### 9.1 modal-avatar-upload.html
**Description:** Upload and crop profile picture.

**Triggered From:**
- `renter-profile.html` - Avatar edit button
- `landlord-profile.html` - Photo edit button

**Key Components:**
- Current avatar display
- Upload options:
    - File browser
    - Camera capture
    - Remove current photo
- Crop tool:
    - Circular crop frame
    - Zoom slider
    - Rotate buttons
- Preview at different sizes
- Cancel / Save buttons

**Design Notes:**
- Square crop, displayed as circle
- Multiple resolutions generated
- Compress for performance

---

### 9.2 modal-email-change.html
**Description:** Change account email with verification.

**Triggered From:**
- `renter-settings.html` - Change email
- `landlord-settings.html` - Change email

**Key Components:**
- Current email display
- New email input
- Confirm new email input
- Password verification
- Explanation of verification process
- Cancel / Send Verification buttons

**After submit:**
- Success message
- Check inbox prompt
- Resend verification link

**Design Notes:**
- Old email remains active until verified
- Security notification to old email
- Session continues normally

---

### 9.3 modal-password-change.html
**Description:** Change account password.

**Triggered From:**
- `renter-settings.html` - Security section
- `landlord-settings.html` - Security section

**Key Components:**
- Current password input
- New password input
- Password strength indicator
- Password requirements list:
    - Minimum 8 characters
    - One uppercase letter
    - One number
    - One special character
- Confirm new password input
- "Log out other devices" checkbox
- Cancel / Update Password buttons

**Design Notes:**
- Show/hide password toggles
- Real-time strength feedback
- Success confirmation message

---

### 9.4 modal-two-factor-setup.html
**Description:** Enable two-factor authentication.

**Triggered From:**
- `renter-settings.html` - Security section
- `landlord-settings.html` - Security section

**Key Components:**
- Introduction to 2FA benefits
- Method selection:
    - Authenticator app (recommended)
    - SMS codes
- For authenticator:
    - QR code display
    - Manual entry code
    - App download links (Google Auth, Authy)
- Verification:
    - Enter code from app
    - Verify button
- Backup codes:
    - Display 10 codes
    - Download option
    - Print option
    - "I've saved these" confirmation
- Cancel / Enable 2FA buttons

**Design Notes:**
- Clear setup instructions
- Backup codes are critical
- Option to disable later

---

## 10. GENERAL/SHARED MODALS

### 10.1 modal-confirmation.html
**Description:** Generic confirmation dialog for destructive actions.

**Triggered From:**
- Various delete, remove, cancel actions throughout app

**Key Components:**
- Icon (warning triangle or question mark)
- Title (e.g., "Are you sure?")
- Description message
- Cancel button (secondary)
- Confirm button (primary or danger)

**Variants:**
- Danger (red confirm button)
- Warning (amber confirm button)
- Info (blue confirm button)

**Design Notes:**
- Reusable component
- Pass title, message, button labels as props
- Keyboard accessible (Escape to cancel)

---

### 10.2 modal-success.html
**Description:** Generic success confirmation state.

**Triggered From:**
- Various form submissions and actions

**Key Components:**
- Animated checkmark icon
- Success title
- Description message
- Optional next action button
- Close/Done button
- Auto-close option

**Design Notes:**
- Accent green color scheme
- Celebratory but not excessive
- Quick to dismiss

---

### 10.3 modal-error.html
**Description:** Generic error state for failed operations.

**Triggered From:**
- Failed API calls, validation errors

**Key Components:**
- Error icon (X or warning)
- Error title
- Error message/description
- Error code (if applicable)
- "Try Again" button
- "Contact Support" link
- Close button

**Design Notes:**
- Coral/red color scheme
- Clear error explanation
- Actionable next steps

---

### 10.4 modal-loading.html
**Description:** Loading/processing state overlay.

**Triggered From:**
- Any async operation that takes >1 second

**Key Components:**
- Spinner animation
- Loading message (customizable)
- Optional progress percentage
- Cancel button (if operation is cancellable)

**Design Notes:**
- Blocks interaction during processing
- Timeout handling (show error after X seconds)
- Skeleton loaders for content areas preferred

---

## Implementation Notes

### Modal CSS Framework
Create shared modal styles in `modal-base.css`:
- `.modal-overlay` - fixed, full-screen, backdrop
- `.modal-container` - centered, max-width variants (sm, md, lg)
- `.modal-header` - title and close button
- `.modal-body` - scrollable content
- `.modal-footer` - action buttons

### Modal JavaScript
Create shared modal behavior in `modal.js`:
- `openModal(modalId)` - show modal with animation
- `closeModal(modalId)` - hide modal with animation
- Escape key listener
- Backdrop click handler
- Focus trap management
- Body scroll lock

### Accessibility
- Role="dialog" with aria-modal="true"
- Aria-labelledby for title
- Focus management on open/close
- Screen reader announcements

---

## Summary

**Total Completed Pages:** 49
**Total Missing Modals:** 34

These modals complete the user flows and provide necessary feedback states for all major actions in the application.
