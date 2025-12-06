# RoomPilot Frontend Component Specification

This document outlines all frontend components needed to implement the RoomPilot design system based on the 49 page designs and 38 modal designs.

---

## Design System Foundation

### Design Tokens

```
Colors:
├── Neutrals: midnight (#0f1419), charcoal (#1a2332), slate (#3d4f5f), mist (#8899a6), cloud (#e8ecef), snow (#f7f9fa), white (#ffffff)
├── Primary: primary (#2563eb), primary-light (#3b82f6), primary-dark (#1d4ed8), primary-bg (#eff6ff)
├── Accent: accent (#10b981), accent-light (#34d399), accent-dark (#059669), accent-bg (#ecfdf5)
├── Warm: warm (#f59e0b), warm-bg (#fffbeb)
├── Coral: coral (#f43f5e), coral-bg (#fff1f2)
└── Purple: purple (#8b5cf6), purple-bg (#f5f3ff)

Typography:
├── Display: 'Fraunces', Georgia, serif
└── Body: 'DM Sans', -apple-system, sans-serif

Spacing:
├── sidebar-width: 260px
├── header-height: 72px
└── nav-height: 72px

Radii: sm (8px), md (12px), lg (16px), xl (24px)
Shadows: sm, md, lg, xl
```

---

## 1. Layout Components

### AppShell
Container for authenticated app pages (landlord/renter dashboards)
- Fixed sidebar + scrollable main content
- Responsive: sidebar collapses on mobile

### Sidebar
- Logo with badge (Host/Renter)
- Navigation links with icons and badges
- User profile section at bottom
- Active state highlighting

### Header
- Page title + subtitle/date
- Action buttons (notifications, search)
- Primary CTA button
- Sticky positioning

### PublicNavigation
- Logo
- Search bar (expandable on mobile)
- Navigation links
- Auth buttons (Login/Signup)

### Footer
- Multi-column link sections
- Copyright
- Social links

### TwoColumnLayout
- Used for messages, search results
- Resizable panels
- Mobile: stacked layout

---

## 2. Button Components

### Button
Variants:
- `primary`: Blue background, white text
- `secondary`/`outline`: White/transparent with border
- `ghost`: Transparent, no border
- `danger`: Coral/red for destructive actions
- `white`: White background, primary text

Sizes: `sm`, `md`, `lg`

States: default, hover, active, disabled, loading

### IconButton
- Circular buttons for actions
- Sizes: 36px, 40px, 44px
- Used in header, cards, modals

### ButtonGroup
- Horizontal group of related buttons
- Connected styling option

---

## 3. Form Components

### Input
- Text, email, password, tel, number types
- Label, placeholder, helper text
- Error state with message
- Focus ring styling
- Password visibility toggle variant

### Select
- Dropdown with custom styling
- Multi-select variant
- Searchable variant

### Textarea
- Resizable (vertical)
- Character count option
- Auto-resize variant

### Checkbox
- Standard checkbox
- Checkbox group with card styling
- Indeterminate state

### RadioGroup
- Standard radio buttons
- Option card variant (large clickable cards)

### Toggle/Switch
- On/off toggle
- With label
- Sizes: sm, md

### RangeSlider
- Single or dual handle
- Price range variant
- Custom track styling

### DatePicker
- Calendar dropdown
- Date range selection
- Move-in date format

### FileUpload
- Drag and drop zone
- File preview
- Multiple file support
- Image upload with preview

### TagInput
- Add/remove tags
- Neighborhood selection variant

### OTPInput
- 6-digit verification code
- Auto-advance between fields
- Auto-submit on complete

### FormGroup
- Label + input + error wrapper
- Consistent spacing

### FormRow
- Side-by-side inputs
- Responsive: stacks on mobile

---

## 4. Card Components

### Card
Base card with border, shadow, padding
- Header with title + action link
- Content area
- Footer with actions

### StatCard
Dashboard statistics display
- Icon (colored background)
- Value (large, display font)
- Label
- Trend indicator (+/-%)

### PropertyCard
Property listing display
- Image with status badge
- Name, address
- Occupancy bar
- Revenue
- Dropdown actions

### RoomListingCard
Search results card
- Image gallery with dots
- Favorite button
- Badge (New, Verified)
- Location, title, details
- Amenity tags
- Price (weekly + monthly)
- Rating

### TenantCard
- Avatar with initials
- Name, room assignment
- Status badge
- Quick actions

### PaymentCard
- Payment method icon
- Card/account details
- Default badge
- Edit/remove actions

### WalletCard
- Gradient background
- Large balance display
- Action buttons

### RequestCard
Expandable maintenance request
- Icon + category
- Title, description
- Status badge
- Expandable detail section

### QuickActionCard
- Icon
- Label
- Click to navigate

### OptionCard
Selectable card (onboarding)
- Icon
- Title, description
- Selected state with border

### FeatureCard
Marketing/info card
- Icon
- Heading
- Description
- Hover lift effect

### PricingCard
- Plan name
- Price
- Features list
- CTA button
- Recommended badge

---

## 5. Table & List Components

### DataTable
- Column headers
- Sortable columns
- Row hover state
- Action column

### PropertyTable
- Property image + info
- Occupancy bar
- Revenue
- Status badge
- Actions dropdown

### PaymentHistoryTable
- Date, tenant, amount, status
- View receipt link
- Pagination

### ConversationList
- Avatar, name, preview, time
- Unread indicator
- Active/selected state

### NotificationList
- Icon, title, body, time
- Unread state
- Filter tabs

### TimelineList
Vertical timeline with connecting line
- Timeline dot (active, completed states)
- Title, description, time

### ActivityFeed
- Activity icon (payment, tenant, system)
- Description text
- Timestamp
- Connecting line

---

## 6. Navigation Components

### Tabs
- Horizontal tab buttons
- Active state styling
- Icon + label variant

### ProgressSteps
Multi-step form indicator
- Step circles with numbers
- Connecting line
- Active, completed, pending states

### Breadcrumb
- Path navigation
- Separator icons

### Pagination
- Page numbers
- Prev/next buttons

### ViewToggle
Grid/List view switcher
- Button group style

### FilterBar
Horizontal filter controls
- Filter chips
- Dropdown filters
- Dividers
- Toggle buttons

### FilterChip
- Icon + label
- Dropdown arrow
- Active state (filled)

---

## 7. Feedback Components

### Badge
Status indicators
- Variants: active (green), pending (amber), issue (coral), new (blue)
- Dot + text style
- Pill shaped

### StatusBadge
Inline status display
- Status dot
- Status text
- Background color by status

### Alert
Message banners
- Variants: info, success, warning, error
- Icon + message
- Dismissible option

### Toast
Temporary notifications
- Position: top-right
- Auto-dismiss
- Variants: success, error, info

### EmptyState
No data placeholder
- Icon (large, muted)
- Title
- Description
- Optional CTA

### LoadingSpinner
- Circular spinner
- Sizes: sm, md, lg

### ProgressBar
- Determinate with percentage
- Colored fill (primary, accent, status colors)

### Skeleton
Loading placeholders
- Text, card, image variants

---

## 8. Modal Components

### ModalBase
Foundation for all modals
- Overlay backdrop (blur optional)
- Centered container
- Header with title + close
- Body content
- Footer with actions
- Focus trap, escape to close

### ConfirmationModal
Generic confirm dialog
- Icon (warning/question)
- Title + message
- Cancel + confirm buttons
- Danger variant (red button)

### SuccessModal
- Animated checkmark
- Title
- Message
- Next action button
- Auto-close option

### ErrorModal
- Animated X icon
- Error title + message
- Error code display
- Retry + support actions

### LoadingModal
- Spinner
- Progress bar (optional)
- Status message
- Cancel button (optional)

### FormModal
Modal with form content
- Standard form inputs
- Multi-step variant
- Validation states

### PhotoGalleryModal
Full-screen image viewer
- Large image display
- Navigation arrows
- Thumbnail strip
- Close, share, download

### PhotoUploadModal
- Drag and drop zone
- Photo grid with reorder
- Set cover photo
- Delete photos

---

## 9. Specific Modal Implementations (38 total)

### Payment & Billing
- AddPaymentMethodModal
- PaymentConfirmationModal
- ReceiptViewerModal
- AddFundsModal
- AutopaySetupModal

### Verification & Identity
- PhoneVerificationModal
- IdVerificationModal
- BackgroundCheckModal

### Application & Tenant
- DeclineApplicationModal
- ApproveApplicationModal
- RequestInfoModal
- EndTenancyModal
- LeaseRenewalModal

### Property & Room
- PhotoGalleryModal
- PhotoUploadModal
- CloneRoomModal
- PauseListingModal
- DeletePropertyModal

### Messaging & Communication
- QuickMessageModal
- ShareListingModal
- ReportListingModal

### Finance & Payout
- PayoutBreakdownModal
- UpdateBankAccountModal
- TaxDocumentsModal
- ManualPayoutModal

### Stripe Integration
- StripeConnectModal
- StripeConnectSuccessModal

### Maintenance
- MaintenancePhotosModal
- ScheduleInspectionModal
- CancelRequestModal

### Profile & Settings
- AvatarUploadModal
- EmailChangeModal
- PasswordChangeModal
- TwoFactorSetupModal

---

## 10. Data Display Components

### Avatar
- Initials or image
- Sizes: sm (36px), md (40px), lg (120px)
- Gradient backgrounds
- Badge overlay option

### Rating
- Star icon + number
- Yellow star color

### PriceDisplay
- Value in display font
- Period label (/week, /mo)

### OccupancyBar
- Progress bar style
- Color by percentage (green/amber/red)
- Text label

### ChartBar
Bar chart component
- Tooltip on hover
- Animated fill
- Month/week labels

### PaymentCalendar
- Grid calendar
- Paid days (checkmark)
- Due date highlighting

### TrendIndicator
- Arrow + percentage
- Green (up) / Red (down)

---

## 11. Search & Filter Components

### SearchBar
Pill-shaped search input
- Icon
- Multiple input sections
- Dividers
- Search button

### FilterDropdown
Dropdown panel with filter options
- Title
- Option list (checkbox style)
- Price range slider
- Clear + apply buttons

### SortSelect
Dropdown for sort options
- Current selection
- Options list

### AmenityTag
Small tag for amenities
- Icon + label
- Snow background

---

## 12. Map Components

### MapContainer
Map display area
- Road/grid background
- Zoom controls
- Search area button

### MapMarker
Price bubble markers
- Price display
- Stem/pointer
- Active state (dark)
- Hover preview card

### MapPreview
Listing preview on marker hover
- Image
- Title, details
- Price

### MapControls
- Zoom in/out buttons
- Location button

---

## 13. Messaging Components

### ConversationItem
- Avatar
- Name
- Preview text (truncated)
- Time
- Unread badge

### MessageBubble
- Sent vs received styling
- Avatar
- Message text
- Timestamp
- Flex alignment

### ChatInput
- Textarea (auto-resize)
- Attach button
- Send button

### DateDivider
Centered date pill in chat

### ThreadMessage
Comment thread display
- Avatar
- Author + time
- Message text

---

## 14. Specialized Components

### VerificationStatus
Profile verification items
- Icon with colored background
- Title + subtitle
- Action button

### StepIndicator
Onboarding/flow steps
- Circle with number/icon
- Label
- Progress line

### CategoryTabs
FAQ/help section tabs
- Tab buttons
- Active state

### AccordionItem
FAQ expandable items
- Question header
- Expand/collapse
- Answer content

### PendingActionItem
Dashboard action items
- Icon by type
- Title + description
- Time + urgency tag

### AutomationFeature
Dark card status items
- Pulsing dot
- Feature label

---

## Component Count Summary

| Category | Count |
|----------|-------|
| Layout | 7 |
| Buttons | 3 |
| Forms | 15 |
| Cards | 13 |
| Tables/Lists | 7 |
| Navigation | 8 |
| Feedback | 8 |
| Modal Base | 5 |
| Modal Implementations | 38 |
| Data Display | 7 |
| Search/Filter | 4 |
| Map | 4 |
| Messaging | 5 |
| Specialized | 7 |
| **Total** | **~131** |

---

## Implementation Recommendations

1. **Start with design tokens** - Create CSS custom properties for all colors, spacing, typography
2. **Build atomic components first** - Buttons, inputs, badges before complex components
3. **Use composition** - Complex components should compose simpler ones
4. **Standardize modal structure** - All modals extend ModalBase
5. **Create responsive variants** - Mobile-first with breakpoints for tablet/desktop
6. **Implement state management** - For modals, forms, and interactive components
7. **Add accessibility** - ARIA labels, focus management, keyboard navigation
