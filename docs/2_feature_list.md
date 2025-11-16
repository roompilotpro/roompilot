# RoomPilot MVP - Prioritized Feature List

## Priority Framework

- **P0** - Critical for MVP launch (blocks everything)
- **P1** - Core MVP features (needed for basic functionality)
- **P2** - Enhanced MVP (improves experience but not blocking)
- **P3** - Post-MVP (nice to have, can wait)

---

## P0: Foundation (Week 1-2)

### 1. Authentication & User Management
**Why:** Can't do anything without users
- [ ] Google OAuth 2.0 integration (Sign in with Google)
- [ ] User model (id, google_id, email, name, profile_picture_url, phone)
- [ ] Role selection on first login (Host vs Resident)
- [ ] Basic user profile page
- [ ] Session management

### 2. Database Schema Setup
**Why:** Foundation for all features
- [ ] Users table
- [ ] Properties table
- [ ] Rooms table
- [ ] Bookings table
- [ ] Payments table
- [ ] Wallets table
- [ ] Transactions table
- [ ] Flyway migrations for all core tables

---

## P1: Core Host Flow (Week 3-4)

### 3. Property & Room Management
**Why:** Hosts need to list rooms before residents can book
- [ ] Add property (address, city, state, zip, description, amenities)
- [ ] Add rooms to property (room_number, price_per_week, max_occupants, status)
- [ ] Upload room photos (AWS S3 integration)
- [ ] Edit property/room details
- [ ] Publish/unpublish listings
- [ ] Basic property dashboard

### 4. Stripe Connect Integration
**Why:** Can't process payments without this
- [ ] Stripe Connect onboarding flow for hosts
- [ ] Store Stripe account ID in database
- [ ] Test mode Stripe account setup
- [ ] Payout capability (Stripe Connect transfers)

---

## P1: Core Resident Flow (Week 5-6)

### 5. Marketplace & Search
**Why:** Residents need to find rooms
- [ ] Public room listing page (no auth required)
- [ ] Search by location (city, state, zip)
- [ ] Filter by price range
- [ ] Room detail page (photos, price, amenities, property info)
- [ ] "Apply for Room" button

### 6. Booking & Application System
**Why:** Core transaction flow
- [ ] Resident profile form (bio, employment_status)
- [ ] Application submission to host
- [ ] Host notification (email) when application received
- [ ] Host dashboard to view/approve/reject applications
- [ ] Booking creation on approval
- [ ] Booking status tracking (pending, approved, active, ended)

---

## P1: Core Billing System (Week 7-9) 🔥 **CRITICAL DIFFERENTIATOR**

### 7. Wallet System
**Why:** Pre-funded wallet is core to auto-billing
- [ ] Resident wallet balance tracking
- [ ] Stripe payment intent for loading balance
- [ ] Add funds to wallet UI
- [ ] Wallet balance display
- [ ] Minimum balance requirements

### 8. Automated Billing Engine
**Why:** This IS the product - "PadSplit billing without PadSplit"
- [ ] Weekly payment scheduler (cron job)
- [ ] Check all active bookings for due payments
- [ ] Deduct from wallet if balance sufficient
- [ ] Create transaction records
- [ ] Update payment status
- [ ] Queue payouts to hosts

### 9. Payment Notifications & Receipts
**Why:** Transparency and trust
- [ ] Email receipt to resident on successful payment
- [ ] Email notification to host on payout
- [ ] Low balance warning email (3 days before due)
- [ ] Payment history page for residents
- [ ] Revenue dashboard for hosts

### 10. Late Payment Handling
**Why:** Automates the hard part
- [ ] Detect insufficient balance
- [ ] Send 24-hour reminder
- [ ] Auto-apply late fee after 24 hours
- [ ] Mark payment as overdue
- [ ] Notify both resident and host
- [ ] Escalation flag after 7 days overdue

---

## P2: Enhanced Experience (Week 10-11)

### 11. Basic Communication
**Why:** Hosts and residents need to communicate
- [ ] Messages table (sender_id, recipient_id, property_id, content)
- [ ] One-on-one messaging (host ↔ resident)
- [ ] Message inbox UI
- [ ] Unread message indicators
- [ ] Email notification on new message

### 12. Document Generation
**Why:** Legal compliance and professionalism
- [ ] Auto-generate license agreement (PDF)
- [ ] Auto-generate house rules document
- [ ] Payment receipt PDF
- [ ] Documents stored in S3
- [ ] Document download from dashboard

### 13. Admin Dashboards
**Why:** Better UX for managing operations
- [ ] Host dashboard overview (properties, bookings, revenue)
- [ ] Resident dashboard overview (current booking, balance, payments)
- [ ] Payment history with filters
- [ ] Application status tracking
- [ ] Quick actions (approve, message, add funds)

---

## P3: Post-MVP Enhancements

### 14. Background Checks (Post-Launch)
**Why:** Nice to have but not blocking
- [ ] Checkr or TransUnion SmartMove integration
- [ ] Optional background check flow
- [ ] Background check status in resident profile
- [ ] Host setting: require background check or not

### 15. House Group Chat (Post-Launch)
**Why:** Community feature, not critical
- [ ] Property-based group chat
- [ ] All residents in property can participate
- [ ] Firebase Realtime DB or WebSocket implementation

### 16. Advanced Features (Future)
- [ ] Maintenance ticket system
- [ ] Resident ratings
- [ ] Automated eviction workflow
- [ ] AI fraud detection
- [ ] Host CRM tools
- [ ] SMS notifications (Twilio)
- [ ] Mobile app (React Native)

---

## MVP Launch Checklist

### Before Launch
- [ ] All P0 and P1 features implemented
- [ ] Stripe Connect tested in production mode
- [ ] Google OAuth production credentials
- [ ] SSL certificate for domain
- [ ] Privacy policy & Terms of Service pages
- [ ] Weekly billing cron job tested thoroughly
- [ ] Email templates designed and tested
- [ ] AWS S3 bucket configured for production
- [ ] Database backups configured
- [ ] Error monitoring (Sentry or similar)

### Launch Criteria
- [ ] 1 test host with 1 property listed
- [ ] 1 test resident completes full booking flow
- [ ] Weekly payment auto-deducted successfully
- [ ] Late fee applied correctly on test scenario
- [ ] Payout transferred to host Stripe account
- [ ] All emails sent correctly

---

## Open Questions to Resolve Before Development

Based on PRD Section 10, these need answers:

1. **Billing frequency:** Weekly or monthly?
   *Recommendation:* Weekly (matches PRD, faster cash flow for hosts)

2. **Late fee structure:** Fixed amount or percentage?
   *Recommendation:* $25 fixed fee after 24 hours + $5/day after 3 days

3. **Background checks:** Required or optional?
   *Recommendation:* Optional for MVP, let hosts decide

4. **Auto-approve bookings:** Allowed?
   *Recommendation:* No for MVP, require host approval

5. **Custom fees:** Can hosts add additional fees?
   *Recommendation:* Not for MVP, just weekly rent

6. **Notification channels:** Email, SMS, or both?
   *Recommendation:* Email-only for MVP, SMS in P3

7. **Instant book:** Support it?
   *Recommendation:* No for MVP

8. **Deposit alternatives:** Support non-refundable deposits?
   *Recommendation:* Not for MVP, just wallet balance

---

## Success Metrics for MVP

### Host Metrics
- Time to list first property: < 15 minutes
- Payout speed: 2-3 days (Stripe standard)
- Fee transparency: 2% clearly shown

### Resident Metrics
- Search to apply: < 5 minutes
- Wallet load success rate: > 95%
- Auto-payment success rate: > 90%

### Platform Metrics
- Late payment reminder sent: 100% on time
- Late fees applied: 100% accurate
- Payout processing: 100% automated

---

## Technology Stack Alignment

From PRD Section 4:
- ✅ Frontend: React / Next.js
- ✅ Backend: Node.js or Python API
  *Note:* Current codebase uses Java Spring Boot - **need alignment decision**
- ✅ Database: PostgreSQL (already configured with Neon + Docker)
- ✅ Authentication: Google OAuth 2.0
- ✅ Payments: Stripe Connect
- ✅ File Storage: AWS S3
- ✅ Background Checks: Checkr or TransUnion SmartMove (P3)

### Architecture Decision Needed

**Current:** Java Spring Boot + React
**PRD Suggests:** Node.js/Python + React/Next.js

**Recommendation:** Continue with Spring Boot since infrastructure is already set up. Benefits:
- Type safety with Java
- Mature ecosystem for scheduled jobs (Spring Scheduler)
- Strong Stripe SDK support
- Team already familiar with setup

Alternatively, start fresh with Node.js/Next.js for faster development and alignment with PRD.

---

## Estimated Timeline

**Total MVP Duration:** 9-11 weeks

- **Weeks 1-2:** P0 Foundation
- **Weeks 3-4:** Host flow
- **Weeks 5-6:** Resident flow
- **Weeks 7-9:** Billing system (most complex)
- **Weeks 10-11:** Polish + dashboards
- **Week 12:** Testing, bug fixes, launch prep

**Aggressive timeline:** 8 weeks if cutting P2 features
**Conservative timeline:** 12-14 weeks with full P2 implementation
