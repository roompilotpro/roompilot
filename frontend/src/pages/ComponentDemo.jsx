import { useState } from 'react'
import { classNames } from '../utils/classNames'

// Primitives
import {
  Button,
  IconButton,
  ButtonGroup,
  Badge,
  StatusBadge,
  Avatar,
  LoadingSpinner,
  Skeleton,
  Rating,
  ProgressBar,
  TrendIndicator,
} from '../components/primitives'

// Forms
import {
  Input,
  Select,
  Textarea,
  Checkbox,
  RadioGroup,
  Toggle,
  RangeSlider,
  DatePicker,
  FileUpload,
  TagInput,
  OTPInput,
  FormGroup,
  FormRow,
} from '../components/forms'

// Cards
import {
  Card,
  StatCard,
  QuickActionCard,
  TenantCard,
  PaymentCard,
  WalletCard,
  OptionCard,
  FeatureCard,
  PricingCard,
  PropertyCard,
  RoomListingCard,
  RequestCard,
} from '../components/cards'

// Layout
import {
  Sidebar,
  Header,
  Footer,
  PublicNavigation,
  AppShell,
  TwoColumnLayout,
} from '../components/layout'

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-xl font-semibold text-charcoal mb-4 pb-3 border-b border-cloud">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Demo({ label, children, fullWidth = false }) {
  return (
    <div className={classNames(
      'flex items-start gap-4 p-3 bg-snow rounded-md',
      fullWidth && 'flex-col'
    )}>
      <span className={classNames(
        'shrink-0 text-sm font-medium text-slate pt-2',
        fullWidth ? 'w-full pb-2' : 'w-[140px]'
      )}>{label}</span>
      <div className={classNames(
        'flex flex-wrap items-center gap-3 flex-1',
        fullWidth && 'w-full block',
        '[&_.input-wrapper]:w-[280px] [&_.select-wrapper]:w-[280px] [&_.textarea-wrapper]:w-[280px]',
        '[&_.date-picker]:w-[280px] [&_.file-upload-wrapper]:w-[280px] [&_.tag-input]:w-[280px]',
        '[&_.range-slider]:w-[280px] [&_.form-row]:w-full [&_.form-row]:max-w-[600px]',
        '[&_.radio-group]:w-full [&_.radio-group]:max-w-[400px]',
        'md:[&_.input-wrapper]:w-full md:[&_.select-wrapper]:w-full md:[&_.textarea-wrapper]:w-full',
        'md:[&_.date-picker]:w-full md:[&_.file-upload-wrapper]:w-full md:[&_.tag-input]:w-full md:[&_.range-slider]:w-full'
      )}>{children}</div>
    </div>
  )
}

export default function ComponentDemo() {
  // Form states
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('option1')
  const [toggleOn, setToggleOn] = useState(false)
  const [sliderValue, setSliderValue] = useState(50)
  const [rangeValue, setRangeValue] = useState([200, 800])
  const [selectedDate, setSelectedDate] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [tags, setTags] = useState(['React', 'JavaScript'])
  const [otp, setOtp] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [requestExpanded, setRequestExpanded] = useState(false)

  // Layout states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [appShellSidebarCollapsed, setAppShellSidebarCollapsed] = useState(true)

  // Sample data for layout components
  const sampleNavLinks = [
    { icon: '🏠', label: 'Dashboard', href: '#', active: true },
    { icon: '🏢', label: 'Properties', href: '#', badge: '3', badgeVariant: 'primary' },
    { icon: '👥', label: 'Tenants', href: '#' },
    { icon: '💳', label: 'Payments', href: '#' },
    { icon: '🔧', label: 'Maintenance', href: '#', badge: '2', badgeVariant: 'danger' },
    { icon: '⚙️', label: 'Settings', href: '#' },
  ]

  const sampleUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: null,
  }

  const sampleFooterColumns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Demo', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Blog', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Status', href: '#' },
      ],
    },
  ]

  const sampleLegalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ]

  const samplePublicNavLinks = [
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'About', href: '#' },
  ]

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  const radioOptions = [
    { value: 'option1', label: 'First Option', description: 'Description for first' },
    { value: 'option2', label: 'Second Option', description: 'Description for second' },
    { value: 'option3', label: 'Third Option' },
  ]

  return (
    <div className="p-8 max-w-[1400px] mx-auto bg-snow min-h-screen md:p-4">
      <header className="text-center mb-8 p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-charcoal mb-2">RoomPilot Component Library</h1>
        <p className="text-slate text-base">Visual demo of all implemented components</p>
      </header>

      {/* PRIMITIVES */}
      <Section title="Buttons">
        <Demo label="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
        </Demo>
        <Demo label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Demo>
        <Demo label="States">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </Demo>
        <Demo label="With Icons">
          <Button leftIcon={<span>←</span>}>Back</Button>
          <Button rightIcon={<span>→</span>}>Next</Button>
        </Demo>
      </Section>

      <Section title="Icon Buttons">
        <Demo label="Variants">
          <IconButton variant="primary" label="Add">
            +
          </IconButton>
          <IconButton variant="secondary" label="Edit">
            ✎
          </IconButton>
          <IconButton variant="ghost" label="Menu">
            ☰
          </IconButton>
          <IconButton variant="danger" label="Delete">
            ×
          </IconButton>
        </Demo>
        <Demo label="Sizes">
          <IconButton size="sm" label="Small">
            ★
          </IconButton>
          <IconButton size="md" label="Medium">
            ★
          </IconButton>
          <IconButton size="lg" label="Large">
            ★
          </IconButton>
        </Demo>
      </Section>

      <Section title="Button Groups">
        <Demo label="Horizontal">
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Center</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
        </Demo>
        <Demo label="Attached">
          <ButtonGroup attached>
            <Button variant="outline">Day</Button>
            <Button variant="primary">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
        </Demo>
      </Section>

      <Section title="Badges">
        <Demo label="Colors">
          <Badge color="primary">Primary</Badge>
          <Badge color="success">Success</Badge>
          <Badge color="warning">Warning</Badge>
          <Badge color="danger">Danger</Badge>
          <Badge color="purple">Purple</Badge>
          <Badge color="gray">Gray</Badge>
        </Demo>
        <Demo label="With Dot">
          <Badge color="success" dot>
            Active
          </Badge>
          <Badge color="warning" dot>
            Pending
          </Badge>
        </Demo>
        <Demo label="Sizes">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
        </Demo>
      </Section>

      <Section title="Status Badges">
        <Demo label="Statuses">
          <StatusBadge status="active" />
          <StatusBadge status="pending" />
          <StatusBadge status="inactive" />
          <StatusBadge status="verified" />
          <StatusBadge status="warning" />
          <StatusBadge status="error" />
        </Demo>
      </Section>

      <Section title="Avatars">
        <Demo label="Sizes">
          <Avatar size="xs" initials="XS" />
          <Avatar size="sm" initials="SM" />
          <Avatar size="md" initials="MD" />
          <Avatar size="lg" initials="LG" />
          <Avatar size="xl" initials="XL" />
          <Avatar size="2xl" initials="2X" />
        </Demo>
        <Demo label="With Image">
          <Avatar src="https://i.pravatar.cc/150?img=1" alt="User" size="lg" />
          <Avatar src="https://i.pravatar.cc/150?img=2" alt="User" size="lg" />
        </Demo>
      </Section>

      <Section title="Loading Spinner">
        <Demo label="Sizes">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
        </Demo>
        <Demo label="Colors">
          <LoadingSpinner color="primary" />
          <LoadingSpinner color="white" />
          <LoadingSpinner color="muted" />
        </Demo>
      </Section>

      <Section title="Skeleton">
        <Demo label="Variants">
          <div className="w-[200px]">
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
          </div>
          <Skeleton variant="circle" width={48} height={48} />
          <Skeleton variant="rect" width={100} height={60} />
        </Demo>
      </Section>

      <Section title="Rating">
        <Demo label="Values">
          <Rating value={5} />
          <Rating value={4.5} />
          <Rating value={3} />
          <Rating value={2.5} />
        </Demo>
      </Section>

      <Section title="Progress Bar">
        <Demo label="Values">
          <div className="w-[200px]">
            <ProgressBar value={25} />
            <ProgressBar value={50} />
            <ProgressBar value={75} />
            <ProgressBar value={100} />
          </div>
        </Demo>
        <Demo label="Colors">
          <div className="w-[200px]">
            <ProgressBar value={60} color="primary" />
            <ProgressBar value={60} color="success" />
            <ProgressBar value={60} color="warning" />
            <ProgressBar value={60} color="danger" />
          </div>
        </Demo>
        <Demo label="With Label">
          <div className="w-[200px]">
            <ProgressBar value={75} showLabel />
          </div>
        </Demo>
      </Section>

      <Section title="Trend Indicator">
        <Demo label="Trends">
          <TrendIndicator value={12.5} />
          <TrendIndicator value={-8.3} />
          <TrendIndicator value={0} />
        </Demo>
        <Demo label="Override">
          <TrendIndicator value={5} trend="negative" />
        </Demo>
      </Section>

      {/* FORMS */}
      <Section title="Input">
        <Demo label="Basic">
          <Input
            label="Email"
            placeholder="Enter your email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Demo>
        <Demo label="With Error">
          <Input label="Password" type="password" error="Password must be at least 8 characters" />
        </Demo>
        <Demo label="With Prefix/Suffix">
          <Input label="Price" prefix="$" placeholder="0.00" />
        </Demo>
        <Demo label="Sizes">
          <Input size="sm" placeholder="Small" />
          <Input size="md" placeholder="Medium" />
          <Input size="lg" placeholder="Large" />
        </Demo>
        <Demo label="Disabled">
          <Input label="Disabled" value="Can't edit this" disabled />
        </Demo>
      </Section>

      <Section title="Select">
        <Demo label="Basic">
          <Select
            label="Choose Option"
            options={selectOptions}
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          />
        </Demo>
        <Demo label="Searchable">
          <Select
            label="Searchable"
            options={selectOptions}
            searchable
            placeholder="Type to search..."
          />
        </Demo>
        <Demo label="With Error">
          <Select label="Required" options={selectOptions} error="Please select an option" />
        </Demo>
      </Section>

      <Section title="Textarea">
        <Demo label="Basic">
          <Textarea
            label="Description"
            placeholder="Enter description..."
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
          />
        </Demo>
        <Demo label="With Character Count">
          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            showCharCount
            maxLength={200}
          />
        </Demo>
        <Demo label="Auto Resize">
          <Textarea
            label="Auto Resize"
            placeholder="Type to expand..."
            autoResize
            minRows={2}
            maxRows={6}
          />
        </Demo>
      </Section>

      <Section title="Checkbox">
        <Demo label="Basic">
          <Checkbox
            label="Accept terms and conditions"
            checked={checkboxChecked}
            onChange={(e) => setCheckboxChecked(e.target.checked)}
          />
        </Demo>
        <Demo label="With Description">
          <Checkbox
            label="Newsletter"
            description="Receive weekly updates via email"
            checked={true}
            onChange={() => {}}
          />
        </Demo>
        <Demo label="Card Variant">
          <Checkbox
            label="Premium Plan"
            description="$29/month"
            card
            checked={true}
            onChange={() => {}}
          />
        </Demo>
        <Demo label="Indeterminate">
          <Checkbox label="Select All" indeterminate />
        </Demo>
      </Section>

      <Section title="Radio Group">
        <Demo label="Standard">
          <RadioGroup
            name="demo-radio"
            label="Select an option"
            options={radioOptions}
            value={radioValue}
            onChange={(e) => setRadioValue(e.target.value)}
          />
        </Demo>
        <Demo label="Horizontal">
          <RadioGroup
            name="demo-radio-h"
            options={[
              { value: 'a', label: 'Option A' },
              { value: 'b', label: 'Option B' },
              { value: 'c', label: 'Option C' },
            ]}
            orientation="horizontal"
            value="b"
            onChange={() => {}}
          />
        </Demo>
        <Demo label="Card Variant">
          <RadioGroup
            name="demo-radio-card"
            variant="card"
            options={[
              { value: 'monthly', label: 'Monthly', description: '$29/mo' },
              { value: 'yearly', label: 'Yearly', description: '$290/yr' },
            ]}
            value="monthly"
            onChange={() => {}}
          />
        </Demo>
      </Section>

      <Section title="Toggle">
        <Demo label="Basic">
          <Toggle
            label="Enable notifications"
            checked={toggleOn}
            onChange={(e) => setToggleOn(e.target.checked)}
          />
        </Demo>
        <Demo label="With Description">
          <Toggle
            label="Dark Mode"
            description="Use dark theme across the app"
            checked={true}
            onChange={() => {}}
          />
        </Demo>
        <Demo label="Sizes">
          <Toggle label="Small" size="sm" />
          <Toggle label="Medium" size="md" />
        </Demo>
        <Demo label="Label Position">
          <Toggle label="Left label" labelPosition="left" />
        </Demo>
      </Section>

      <Section title="Range Slider">
        <Demo label="Single Value">
          <RangeSlider
            label="Volume"
            value={sliderValue}
            onChange={(e) => setSliderValue(e.target.value)}
          />
        </Demo>
        <Demo label="Range (Dual Handle)">
          <RangeSlider
            label="Price Range"
            range
            min={0}
            max={1000}
            value={rangeValue}
            onChange={(e) => setRangeValue(e.target.value)}
            formatValue={(v) => `$${v}`}
          />
        </Demo>
      </Section>

      <Section title="Date Picker">
        <Demo label="Basic">
          <DatePicker
            label="Move-in Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="Select date"
          />
        </Demo>
        <Demo label="With Error">
          <DatePicker label="Required Date" error="Please select a date" />
        </Demo>
      </Section>

      <Section title="File Upload">
        <Demo label="Basic">
          <FileUpload
            label="Upload Documents"
            accept=".pdf,.doc,.docx"
            value={uploadedFiles}
            onChange={(e) => setUploadedFiles(e.target.files)}
            helperText="PDF, DOC up to 10MB"
          />
        </Demo>
        <Demo label="Multiple">
          <FileUpload label="Upload Images" accept="image/*" multiple maxFiles={5} />
        </Demo>
      </Section>

      <Section title="Tag Input">
        <Demo label="Basic">
          <TagInput
            label="Skills"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add skill..."
          />
        </Demo>
        <Demo label="With Suggestions">
          <TagInput
            label="Technologies"
            suggestions={['React', 'Vue', 'Angular', 'Svelte', 'Next.js']}
            placeholder="Type to see suggestions..."
          />
        </Demo>
      </Section>

      <Section title="OTP Input">
        <Demo label="6 Digits">
          <OTPInput
            label="Enter verification code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            onComplete={(code) => console.log('OTP Complete:', code)}
          />
        </Demo>
        <Demo label="4 Digits">
          <OTPInput length={4} size="lg" />
        </Demo>
        <Demo label="With Error">
          <OTPInput error="Invalid code" />
        </Demo>
      </Section>

      <Section title="Form Layout">
        <Demo label="FormGroup">
          <FormGroup label="Full Name" required helperText="Enter your legal name">
            <input type="text" className="w-full p-3 border border-cloud rounded-md text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-bg" placeholder="John Doe" />
          </FormGroup>
        </Demo>
        <Demo label="FormRow (2 columns)">
          <FormRow columns={2}>
            <Input label="First Name" placeholder="John" />
            <Input label="Last Name" placeholder="Doe" />
          </FormRow>
        </Demo>
        <Demo label="FormRow (3 columns)">
          <FormRow columns={3} gap="sm">
            <Input label="City" placeholder="Boston" />
            <Input label="State" placeholder="MA" />
            <Input label="ZIP" placeholder="02115" />
          </FormRow>
        </Demo>
      </Section>

      {/* CARDS */}
      <Section title="Card (Base)">
        <Demo label="Default">
          <Card title="Card Title" className="w-[300px]">
            <p>This is the card content.</p>
          </Card>
        </Demo>
        <Demo label="With Footer">
          <Card
            title="Card with Footer"
            footer={<Button size="sm">Action</Button>}
            className="w-[300px]"
          >
            <p>Card content with a footer action.</p>
          </Card>
        </Demo>
        <Demo label="Elevated">
          <Card variant="elevated" hoverable className="w-[300px]">
            <p>Elevated hoverable card.</p>
          </Card>
        </Demo>
      </Section>

      <Section title="StatCard">
        <Demo label="Colors">
          <StatCard
            icon="$"
            color="blue"
            value="$12,450"
            label="Monthly Revenue"
            trendValue={12.5}
            trendDirection="up"
          />
          <StatCard
            icon="📦"
            color="green"
            value="24"
            label="Total Properties"
            trendValue={8.3}
            trendDirection="up"
          />
          <StatCard
            icon="👥"
            color="amber"
            value="89%"
            label="Occupancy Rate"
            trendValue={2.1}
            trendDirection="down"
          />
          <StatCard icon="🔧" color="purple" value="7" label="Open Requests" />
        </Demo>
      </Section>

      <Section title="QuickActionCard">
        <Demo label="Actions">
          <QuickActionCard icon="➕" label="Add Property" onClick={() => {}} />
          <QuickActionCard icon="👤" label="Add Tenant" onClick={() => {}} />
          <QuickActionCard icon="💳" label="Process Payment" onClick={() => {}} />
          <QuickActionCard icon="🔧" label="Create Request" disabled />
        </Demo>
      </Section>

      <Section title="TenantCard">
        <Demo label="Statuses">
          <TenantCard
            name="John Smith"
            roomAssignment="Unit 203"
            rentAmount="$1,200/mo"
            status="active"
            onView={() => {}}
            onEdit={() => {}}
          />
          <TenantCard
            avatarUrl="https://i.pravatar.cc/150?img=5"
            name="Sarah Johnson"
            roomAssignment="Unit 105"
            rentAmount="$950/mo"
            status="pending"
            onView={() => {}}
          />
        </Demo>
      </Section>

      <Section title="PaymentCard">
        <Demo label="Card Types">
          <PaymentCard
            type="visa"
            lastFour="4242"
            expiryDate="12/25"
            isDefault
            onEdit={() => {}}
            onRemove={() => {}}
          />
          <PaymentCard type="mastercard" lastFour="5555" expiryDate="08/24" onEdit={() => {}} />
          <PaymentCard type="bank" lastFour="1234" onRemove={() => {}} />
        </Demo>
      </Section>

      <Section title="WalletCard">
        <Demo label="Default">
          <WalletCard balance="$2,450.00" onAddFunds={() => {}} onWithdraw={() => {}} />
        </Demo>
        <Demo label="Loading">
          <WalletCard loading />
        </Demo>
      </Section>

      <Section title="OptionCard">
        <Demo label="Selectable">
          <OptionCard
            icon="🏠"
            title="I'm a Landlord"
            description="List and manage rental properties"
            value="landlord"
            selected={selectedOption === 'landlord'}
            onChange={() => setSelectedOption('landlord')}
          />
          <OptionCard
            icon="🔑"
            title="I'm a Renter"
            description="Find and rent a room"
            value="renter"
            selected={selectedOption === 'renter'}
            onChange={() => setSelectedOption('renter')}
          />
        </Demo>
      </Section>

      <Section title="FeatureCard">
        <Demo label="Features">
          <FeatureCard
            icon="📊"
            heading="Smart Analytics"
            description="Track occupancy, revenue, and tenant trends"
            metrics={[
              { value: '47', label: 'Rooms' },
              { value: '92%', label: 'Occupancy' },
            ]}
          />
          <FeatureCard
            icon="💰"
            heading="Automated Payments"
            description="Collect rent automatically every month"
            highlight
          />
        </Demo>
      </Section>

      <Section title="PricingCard">
        <Demo label="Plans">
          <PricingCard
            planName="Starter"
            description="For individual landlords"
            price="$0"
            period="/month"
            features={['Up to 3 properties', 'Basic analytics', 'Email support']}
            ctaText="Get Started"
            ctaVariant="outline"
            onCtaClick={() => {}}
          />
          <PricingCard
            planName="Pro"
            description="For growing portfolios"
            price="$29"
            period="/month"
            features={[
              'Unlimited properties',
              'Advanced analytics',
              'Priority support',
              'Automated payments',
            ]}
            ctaText="Upgrade Now"
            recommended
            onCtaClick={() => {}}
          />
        </Demo>
      </Section>

      <Section title="PropertyCard">
        <Demo label="Properties">
          <div className="bg-white rounded-lg overflow-hidden">
            <PropertyCard
              name="Sunset Apartments"
              address="123 Main St, San Francisco, CA"
              occupiedRooms={8}
              totalRooms={10}
              revenue="$4,200/mo"
              status="active"
              onView={() => {}}
              onMenuClick={() => {}}
            />
            <PropertyCard
              imageUrl="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop"
              name="Downtown Lofts"
              address="456 Market St, San Francisco, CA"
              occupiedRooms={3}
              totalRooms={6}
              revenue="$2,100/mo"
              status="pending"
              onView={() => {}}
            />
          </div>
        </Demo>
      </Section>

      <Section title="RoomListingCard">
        <Demo label="Listing">
          <RoomListingCard
            images={[
              'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
            ]}
            badge="verified"
            location="San Francisco, CA"
            rating={4.8}
            title="Cozy room in shared apartment"
            details="1 bed • Shared bath • 12x10 ft"
            amenities={['WiFi', 'Laundry', 'Parking']}
            weeklyPrice="$250"
            monthlyPrice="$950"
            isFavorite={isFavorite}
            onFavoriteToggle={() => setIsFavorite(!isFavorite)}
            onClick={() => {}}
          />
          <RoomListingCard
            badge="new"
            location="Oakland, CA"
            rating={4.5}
            title="Sunny private room"
            details="1 bed • Private bath"
            amenities={['WiFi', 'Kitchen']}
            weeklyPrice="$200"
            onClick={() => {}}
          />
        </Demo>
      </Section>

      <Section title="RequestCard">
        <Demo label="Maintenance">
          <div className="max-w-[350px]">
            <RequestCard
              id="req-001"
              title="Leaking faucet in kitchen"
              category="plumbing"
              priority="urgent"
              location="Unit 203, Sunset Apartments"
              tenant="John Smith"
              timestamp="2 hours ago"
              description="The kitchen faucet has been dripping constantly. Water pooling under the sink."
              status="new"
              expanded={requestExpanded}
              onExpandToggle={() => setRequestExpanded(!requestExpanded)}
              onClick={() => {}}
            />
          </div>
          <div className="max-w-[350px]">
            <RequestCard
              id="req-002"
              title="AC not cooling"
              category="hvac"
              priority="normal"
              location="Unit 105"
              timestamp="1 day ago"
              status="in-progress"
              draggable
            />
          </div>
        </Demo>
      </Section>

      {/* LAYOUT */}
      <Section title="Sidebar">
        <Demo label="With Toggle" fullWidth>
          <div className="mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            </Button>
          </div>
          <div className="relative w-full border border-cloud rounded-md overflow-hidden bg-snow h-[400px] flex [&_.sidebar]:relative [&_.sidebar]:shrink-0 [&_.sidebar__overlay]:hidden">
            <Sidebar
              logo="R"
              logoText="RoomPilot"
              logoBadge="Pro"
              links={sampleNavLinks}
              user={sampleUser}
              collapsed={sidebarCollapsed}
            />
            <div className="flex-1 p-4 bg-white">
              <p className="p-4 bg-cloud rounded-sm text-slate text-sm text-center">Main content area</p>
            </div>
          </div>
        </Demo>
      </Section>

      <Section title="Header">
        <Demo label="With Title & Actions" fullWidth>
          <div className="relative w-full border border-cloud rounded-md overflow-hidden bg-snow [&_.header]:relative">
            <Header
              title="Dashboard"
              subtitle="Welcome back, John"
              sticky={false}
              actions={
                <>
                  <IconButton variant="ghost" label="Notifications">
                    🔔
                  </IconButton>
                  <IconButton variant="ghost" label="Settings">
                    ⚙️
                  </IconButton>
                  <Button variant="primary" size="sm">
                    Add Property
                  </Button>
                </>
              }
            />
          </div>
        </Demo>
        <Demo label="Custom Left Content" fullWidth>
          <div className="relative w-full border border-cloud rounded-md overflow-hidden bg-snow [&_.header]:relative">
            <Header
              sticky={false}
              leftContent={
                <div className="flex items-center gap-3">
                  <Avatar src="https://i.pravatar.cc/150?img=3" name="Sarah" size="md" />
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-slate">
                      Property Manager
                    </div>
                  </div>
                </div>
              }
              actions={
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              }
            />
          </div>
        </Demo>
      </Section>

      <Section title="Footer">
        <Demo label="Full Footer" fullWidth>
          <div className="relative w-full border border-cloud rounded-md overflow-hidden bg-snow">
            <Footer
              logo="R"
              logoText="RoomPilot"
              tagline="Simplify your rental management"
              columns={sampleFooterColumns}
              legalLinks={sampleLegalLinks}
            />
          </div>
        </Demo>
      </Section>

      <Section title="PublicNavigation">
        <Demo label="Default Variant" fullWidth>
          <div className="relative w-full border border-cloud rounded-md overflow-hidden bg-snow [&_.public-nav]:relative">
            <PublicNavigation
              logo="R"
              logoText="RoomPilot"
              links={samplePublicNavLinks}
              actions={
                <>
                  <Button variant="ghost">Sign In</Button>
                  <Button variant="primary">Get Started</Button>
                </>
              }
            />
          </div>
        </Demo>
        <Demo label="Transparent Variant" fullWidth>
          <div className="relative w-full border border-cloud rounded-md overflow-hidden bg-primary [&_.public-nav]:relative">
            <PublicNavigation
              logo="R"
              logoText="RoomPilot"
              variant="transparent"
              links={samplePublicNavLinks}
              actions={
                <>
                  <Button variant="ghost" className="text-white">
                    Sign In
                  </Button>
                  <Button variant="white">Get Started</Button>
                </>
              }
            />
          </div>
        </Demo>
      </Section>

      <Section title="AppShell">
        <Demo label="Complete Layout" fullWidth>
          <div className="mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAppShellSidebarCollapsed(!appShellSidebarCollapsed)}
            >
              {appShellSidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
            </Button>
          </div>
          <div className="relative w-full border border-cloud rounded-md overflow-hidden bg-snow h-[500px] [&_.app-shell]:h-full [&_.sidebar]:absolute">
            <AppShell
              sidebar={{
                logo: 'R',
                logoText: 'RoomPilot',
                links: sampleNavLinks,
                user: sampleUser,
              }}
              header={{
                title: 'Properties',
                subtitle: 'Manage your rental properties',
              }}
              sidebarCollapsed={appShellSidebarCollapsed}
              onSidebarToggle={setAppShellSidebarCollapsed}
            >
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <StatCard icon="🏢" color="blue" value="24" label="Total Properties" />
                  <StatCard icon="👥" color="green" value="89%" label="Occupancy" />
                  <StatCard icon="💰" color="amber" value="$12,450" label="Revenue" />
                </div>
              </div>
            </AppShell>
          </div>
        </Demo>
      </Section>

      <Section title="TwoColumnLayout">
        <Demo label="Default" fullWidth>
          <div className="relative w-full border border-cloud rounded-md overflow-hidden bg-snow h-[350px] [&_.two-column-layout]:h-full">
            <TwoColumnLayout
              leftWidth="300px"
              left={
                <div className="h-full flex items-center justify-center bg-white border border-dashed border-cloud">
                  <span>Left Panel (300px)</span>
                </div>
              }
              right={
                <div className="h-full flex items-center justify-center bg-white border border-dashed border-cloud">
                  <span>Right Panel (flexible)</span>
                </div>
              }
            />
          </div>
        </Demo>
        <Demo label="Messages Variant" fullWidth>
          <div className="relative w-full border border-cloud rounded-md overflow-hidden bg-snow h-[350px] [&_.two-column-layout]:h-full">
            <TwoColumnLayout
              variant="messages"
              leftWidth="280px"
              stickyLeft
              left={
                <div className="p-3 bg-white h-full">
                  <Input placeholder="Search messages..." size="sm" />
                  <div className="mt-3">
                    {['Alice Smith', 'Bob Johnson', 'Carol White'].map((name) => (
                      <div
                        key={name}
                        className="p-3 border-b border-cloud cursor-pointer"
                      >
                        <div className="font-medium">{name}</div>
                        <div className="text-sm text-slate">
                          Last message preview...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }
              right={
                <div className="p-4 bg-snow h-full">
                  <div className="text-center text-mist mt-8">
                    Select a conversation
                  </div>
                </div>
              }
            />
          </div>
        </Demo>
        <Demo label="Search Variant" fullWidth>
          <div className="relative w-full border border-cloud rounded-md overflow-hidden bg-snow h-[350px] [&_.two-column-layout]:h-full">
            <TwoColumnLayout
              variant="search"
              leftWidth="320px"
              left={
                <div className="p-4 bg-white h-full">
                  <h3 className="mb-3 text-lg">
                    Filters
                  </h3>
                  <div className="flex flex-col gap-3">
                    <Select label="Location" options={selectOptions} size="sm" />
                    <RangeSlider
                      label="Price Range"
                      range
                      min={0}
                      max={2000}
                      value={[200, 1200]}
                      formatValue={(v) => `$${v}`}
                    />
                  </div>
                </div>
              }
              right={
                <div className="p-4 bg-snow h-full">
                  <div className="mb-3 text-slate">
                    12 results found
                  </div>
                  <div className="grid gap-3">
                    <Card className="p-3">Room listing result 1</Card>
                    <Card className="p-3">Room listing result 2</Card>
                  </div>
                </div>
              }
            />
          </div>
        </Demo>
      </Section>
    </div>
  )
}
