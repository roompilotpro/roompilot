# ROOMPILOT — PRODUCT REQUIREMENTS DOCUMENT (PRD) v1.0

## 1. Product Summary

RoomPilot is an automation-first co-living marketplace for room rentals. It gives hosts PadSplit-style tools without PadSplit's hand-holding, interference, or high fees.

**Core Value:**

RoomPilot provides control, automation, fast payouts, and legitimacy — without corporate involvement.

### Problems With Current Platforms (PadSplit, Alcove, Bungalow)

- High fees (PadSplit charges ~8% + resident upcharges + "first 10 days" fees)
- Constant host interference, micromanagement, and pressure
- Forced "network transfers" that harm hosts
- Manual support → slow, expensive, frustrating
- Legacy tech that feels heavy, corporate, and outdated
- Monthly payouts with 30-day holds
- Hosts feel blamed, not supported

### RoomPilot Fixes This

- Automated billing and reminders
- Low fees (≈2% or flat per-room subscription)
- No required human involvement
- No unnecessary "network" mechanics
- Fast daily or weekly payouts
- Cleaner, modern UI
- Marketplace that relies on Google Ads + SEO to drive demand
- A legitimate-looking platform without bureaucracy

## 2. Differentiators

### 1. No Hand-Holding

Hosts manage their own operations through automation.

### 2. Much Lower Fees

2% fee or $10–$20 per room monthly SaaS.

### 3. Automated Support

Automated payment reminders, late fees, house chats, templates, rules — not humans.

### 4. No Forced Transfers

Residents cannot hop from house to house unless the host approves.

### 5. Fast Payouts

Stripe Connect → payouts in days, not monthly batches.

### 6. Simple Experience for Renters

Renters care about price, location, and availability — not network features.

### 7. Privacy & Security First

Google OAuth sign-in only — no password storage, no personal data handling, instant authentication.

## 3. Target Users

### Hosts

- Room rental operators
- Former or current PadSplit hosts
- Investors with 1–10 homes
- People who want stability without interference

### Renters

- Working-class individuals
- People searching "rooms near me"
- Need something affordable and fast
- Don't compare features
- Don't care about a "network"

## 4. High-Level System Architecture

The platform consists of:

- **Frontend:** React / Next.js
- **Backend:** Node.js or Python API
- **Database:** PostgreSQL
- **Authentication:** Google OAuth 2.0 (Sign in with Google)
- **Payments:** Stripe Connect
- **Messaging:** Firebase Realtime DB or WebSockets
- **File Storage:** AWS S3
- **Background Checks:** Checkr or TransUnion SmartMove

**Authentication Strategy:**
- Single sign-on via Google OAuth only
- No password storage or management
- Store only: Google user ID, email, name, profile picture URL
- Simplified onboarding with pre-filled profile data

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        WebApp[Web App<br/>React/Next.js]
        MobileApp[Mobile App<br/>React Native]
    end
    
    subgraph "API Layer"
        API[API Server<br/>Node.js/Python]
        Auth[Google OAuth 2.0<br/>Sign in with Google]
    end
    
    subgraph "Services Layer"
        Billing[Billing Service]
        Messaging[Messaging Service<br/>Firebase/WebSockets]
        Notifications[Notification Service]
        Documents[Document Generator]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Database)]
        S3[AWS S3<br/>File Storage]
    end
    
    subgraph "External Services"
        Google[Google OAuth]
        Stripe[Stripe Connect<br/>Payments]
        BG[Background Checks<br/>Checkr/SmartMove]
        Email[Email Service<br/>SendGrid/SES]
        SMS[SMS Service<br/>Twilio]
    end
    
    WebApp --> API
    MobileApp --> API
    API --> Auth
    Auth --> Google
    API --> Billing
    API --> Messaging
    API --> Notifications
    API --> Documents
    
    Billing --> DB
    Messaging --> DB
    Notifications --> DB
    Documents --> DB
    Documents --> S3
    
    API --> DB
    API --> S3
    
    Billing --> Stripe
    API --> BG
    Notifications --> Email
    Notifications --> SMS
```

### Data Flow Diagram

```mermaid
sequenceDiagram
    participant T as Resident
    participant L as Host
    participant RP as RoomPilot
    participant S as Stripe
    participant DB as Database
    
    Note over T,DB: Booking & Onboarding Flow
    T->>RP: Search & Apply for Room
    RP->>L: Notify Application
    L->>RP: Approve Resident
    T->>RP: Load Wallet Balance
    RP->>S: Process Payment
    S->>DB: Store Transaction
    
    Note over T,DB: Weekly Billing Cycle
    RP->>DB: Check Due Payments
    DB->>RP: Return Resident List
    RP->>S: Deduct from Wallet
    S->>DB: Update Balance
    RP->>T: Send Receipt
    RP->>S: Payout to Host
    S->>L: Transfer Funds
    
    Note over T,DB: Late Payment Flow
    RP->>DB: Detect Insufficient Balance
    RP->>T: Send Reminder
    RP->>DB: Apply Late Fee
    RP->>L: Notify Host
```

### Database Schema (Entity Relationship)

```mermaid
erDiagram
    USER ||--o{ PROPERTY : owns
    USER ||--o{ RESIDENT_PROFILE : has
    USER {
        uuid id PK
        string google_id UK
        string email
        string full_name
        string profile_picture_url
        string phone
        enum role
        timestamp created_at
        timestamp last_login
    }
    
    PROPERTY ||--|{ ROOM : contains
    PROPERTY {
        uuid id PK
        uuid host_id FK
        string address
        string city
        string state
        string zip
        text description
        json amenities
        timestamp created_at
    }
    
    ROOM ||--o{ BOOKING : has
    ROOM {
        uuid id PK
        uuid property_id FK
        string room_number
        decimal price_per_week
        enum status
        int max_occupants
        json photos
        timestamp created_at
    }
    
    RESIDENT_PROFILE ||--o{ BOOKING : makes
    RESIDENT_PROFILE ||--o{ WALLET : has
    RESIDENT_PROFILE {
        uuid id PK
        uuid user_id FK
        text bio
        string employment_status
        boolean background_check_passed
        timestamp background_check_date
    }
    
    BOOKING ||--|{ PAYMENT : generates
    BOOKING {
        uuid id PK
        uuid room_id FK
        uuid resident_id FK
        date move_in_date
        date move_out_date
        enum status
        decimal weekly_rate
        timestamp created_at
    }
    
    WALLET ||--o{ TRANSACTION : tracks
    WALLET {
        uuid id PK
        uuid resident_id FK
        decimal balance
        timestamp last_updated
    }
    
    PAYMENT ||--o{ TRANSACTION : records
    PAYMENT {
        uuid id PK
        uuid booking_id FK
        decimal amount
        enum status
        date due_date
        date paid_date
        decimal late_fee
        string stripe_payment_id
    }
    
    TRANSACTION {
        uuid id PK
        uuid wallet_id FK
        uuid payment_id FK
        decimal amount
        enum type
        string description
        timestamp created_at
    }
    
    PROPERTY ||--o{ MESSAGE : references
    USER ||--o{ MESSAGE : sends
    MESSAGE {
        uuid id PK
        uuid sender_id FK
        uuid recipient_id FK
        uuid property_id FK
        text content
        boolean is_read
        timestamp created_at
    }
    
    PROPERTY ||--o{ DOCUMENT : has
    DOCUMENT {
        uuid id PK
        uuid property_id FK
        enum type
        string file_url
        timestamp created_at
    }
```

## 5. Key Features (MVP)

### 5.1 Host Onboarding

- Sign in with Google (one-click authentication)
- Select role (Host or Resident)
- Add properties and rooms
- Upload photos
- Set pricing
- Connect Stripe account
- Publish listing

### 5.2 Resident Onboarding

- Sign in with Google (one-click authentication)
- Complete profile (bio, employment info)
- Optional background check
- Load balance (wallet-style)
- Get approved by host

### 5.3 Marketplace

- Search by price, location
- View rooms
- Request booking
- Auto notification to host

### 5.4 Billing System (Core Feature)

The RoomPilot billing engine includes:

- Resident wallet balance
- Weekly payment deductions
- Auto reminders
- Auto late fees
- Auto insufficient balance notifications
- Host payouts
- Full payment history dashboard

This is the "insane billing system" equivalent BUT rebuilt using automation.

#### Billing System Flow

```mermaid
flowchart TD
    Start([Weekly Billing Cycle Trigger]) --> CheckDue[Check All Due Payments]
    CheckDue --> ForEach{For Each<br/>Active Booking}
    
    ForEach --> CheckBalance{Check<br/>Wallet Balance}
    
    CheckBalance -->|Sufficient| Deduct[Deduct Payment]
    Deduct --> UpdateWallet[Update Wallet Balance]
    UpdateWallet --> CreateTxn[Create Transaction Record]
    CreateTxn --> SendReceipt[Send Receipt to Resident]
    SendReceipt --> QueuePayout[Queue Payout to Host]
    
    CheckBalance -->|Insufficient| SendReminder[Send Low Balance Reminder]
    SendReminder --> Wait24[Wait 24 Hours]
    Wait24 --> Recheck{Recheck Balance}
    
    Recheck -->|Now Sufficient| Deduct
    Recheck -->|Still Insufficient| ApplyLateFee[Apply Late Fee]
    ApplyLateFee --> NotifyBoth[Notify Resident & Host]
    NotifyBoth --> MarkOverdue[Mark Payment Overdue]
    
    QueuePayout --> BatchPayout{Daily Payout<br/>Schedule}
    BatchPayout --> ProcessStripe[Process Stripe Transfer]
    ProcessStripe --> UpdateHost[Update Host Balance]
    UpdateHost --> SendPayoutNotif[Send Payout Notification]
    
    MarkOverdue --> EscalationCheck{Days Overdue > 7?}
    EscalationCheck -->|Yes| FlagAccount[Flag Account for Review]
    EscalationCheck -->|No| ContinueMonitor[Continue Monitoring]
    
    SendPayoutNotif --> End([End])
    FlagAccount --> End
    ContinueMonitor --> ForEach
    
    ForEach -->|No More| End
    
    style Start fill:#e1f5e1
    style Deduct fill:#e1f0ff
    style ApplyLateFee fill:#ffe1e1
    style ProcessStripe fill:#fff4e1
    style End fill:#e1f5e1
```

### 5.5 Communication System

- House group chat
- One-on-one host ↔ resident chat
- Maintenance ticket system
- Auto message templates

### 5.6 Document + Rules System

Auto-generate:

- License agreement
- House rules
- Receipts
- Payment notices

### 5.7 Admin Dashboard

- Properties
- Rooms
- Residents
- Payments
- Applications
- Settings

## 6. User Flows

### 6.1 Host Flow

```mermaid
graph TD
    A[Sign in with Google] --> B[Select Role: Host]
    B --> C[Add Property Details]
    C --> D[Add Rooms & Photos]
    D --> E[Set Pricing & Rules]
    E --> F[Connect Stripe Account]
    F --> G[Publish Listing]
    G --> H[Receive Applications]
    H --> I{Review Application}
    I -->|Approve| J[Resident Loads Balance]
    I -->|Reject| H
    J --> K[Move-In]
    K --> L[Weekly Automated Charges]
    L --> M[Receive Payouts]
    M --> L
    
    style A fill:#e1f5e1
    style G fill:#fff4e1
    style M fill:#e1f0ff
```

**Host Flow Steps:**

1. Sign in with Google
2. Select role (Host)
3. Add property details
4. Add rooms and photos
5. Set pricing + rules
6. Connect Stripe account
7. Publish
8. Receive applications
9. Approve
10. Resident loads balance
11. Move-in
12. Weekly automated charges

### 6.2 Resident Flow

```mermaid
graph TD
    A[Sign in with Google] --> B[Select Role: Resident]
    B --> C[Complete Profile]
    C --> D[Search Rooms]
    D --> E[Filter by Price/Location]
    E --> F[View Room Details]
    F --> G[Apply for Room]
    G --> H{Background Check?}
    H -->|Optional| I[Complete Background Check]
    H -->|Skip| J[Load Wallet Balance]
    I --> J
    J --> K[Wait for Approval]
    K --> L{Host Decision}
    L -->|Approved| M[Move In]
    L -->|Rejected| D
    M --> N[Weekly Auto-Payments]
    N --> O{Balance Check}
    O -->|Sufficient| N
    O -->|Low Balance| P[Receive Reminder]
    P --> Q[Add Funds]
    Q --> N
    
    style A fill:#e1f5e1
    style M fill:#fff4e1
    style N fill:#e1f0ff
```

**Resident Flow Steps:**

1. Sign in with Google
2. Select role (Resident)
3. Complete profile
4. Search rooms
5. Apply
6. Optional background check
7. Load balance
8. Get approved
9. Move in
10. Weekly automated payments

## 7. Pricing Model

**Option A: Transaction Fee**

2% fee per transaction (vs. PadSplit ~8%).

**Option B: SaaS Fee**

$10–$20 per room monthly.

**Optional Upsells**

- Background checks
- Identity verification
- Service fees

## 8. Competitive Positioning

### Feature Comparison

```mermaid
graph LR
    subgraph "PadSplit"
        PS1[High Fees: ~8%]
        PS2[Monthly Payouts]
        PS3[Manual Support]
        PS4[Forced Transfers]
        PS5[Resident-Biased]
        PS6[Overly Involved]
    end
    
    subgraph "RoomPilot"
        RP1[Low Fees: 2%]
        RP2[Fast Payouts]
        RP3[Automation-First]
        RP4[No Forced Transfers]
        RP5[Host Respect]
        RP6[Lightweight Ops]
    end
    
    PS1 -.->|vs| RP1
    PS2 -.->|vs| RP2
    PS3 -.->|vs| RP3
    PS4 -.->|vs| RP4
    PS5 -.->|vs| RP5
    PS6 -.->|vs| RP6
    
    style PS1 fill:#ffe1e1
    style PS2 fill:#ffe1e1
    style PS3 fill:#ffe1e1
    style PS4 fill:#ffe1e1
    style PS5 fill:#ffe1e1
    style PS6 fill:#ffe1e1
    
    style RP1 fill:#e1f5e1
    style RP2 fill:#e1f5e1
    style RP3 fill:#e1f5e1
    style RP4 fill:#e1f5e1
    style RP5 fill:#e1f5e1
    style RP6 fill:#e1f5e1
```

### PadSplit

- High fees
- Monthly payouts
- Manual support
- Forced network transfers
- Bias toward resident experience
- Overly involved

### RoomPilot

- Low fees
- Fast payouts
- Automation-first
- No forced transfers
- Respect for hosts
- Lightweight operations

## 9. Future Features (Post-MVP)

- Resident ratings / property score
- Automated eviction workflow
- AI fraud detection
- AI resident screening
- Host CRM
- API integrations (Zillow, Facebook Marketplace)
- Advanced automations
- Premium host analytics

## 10. Open Questions

1. Weekly or monthly billing for residents?
2. What is the exact late fee structure?
3. Background checks: required or optional?
4. Are host approvals required or can they auto-approve?
5. Should hosts be able to set custom additional fees?
6. SMS notifications or app-only?
7. Should we support "instant book"?
8. Should we support deposit alternatives (e.g., $50 non-refundable instead of $200 refundable)?

## 11. Next Steps

I can generate any or all of these:

- A cleaned-up **visual UML diagram** for Google Docs
- A **landing page draft** for RoomPilot.pro
- A **pitch deck outline** for investors
- Full **database schema (tables + relationships)**
- Full **API spec (endpoints + methods)**
- A **technical architecture document** (for Richard to code from)
- A **market test landing page** to run Google Ads to validate demand