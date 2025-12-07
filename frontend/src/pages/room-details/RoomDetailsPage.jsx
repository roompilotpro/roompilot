import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import {
  PhotoGallery,
  ListingHeader,
  HostStrip,
  BookingCard,
  AmenitiesGrid,
  HouseRulesGrid,
  LocationSection,
  ReviewsSection,
  SimilarListings,
} from '../../components/room-details'
import { classNames } from '../../utils'

// Mock data for the room
const MOCK_ROOM = {
  id: '1',
  title: 'Sunny Private Room with City Views',
  location: 'Midtown, Atlanta, GA',
  badges: ['verified', 'new'],
  meta: {
    roomType: 'Private room',
    bathType: 'Private bath',
    size: '180 sq ft',
  },
  rating: 4.92,
  reviewCount: 47,
  host: {
    name: 'Marcus',
    yearsHosting: 2,
    totalRooms: 12,
    isSuperhost: true,
  },
  description: [
    'Wake up to stunning city views in this bright, modern private room located in the heart of Midtown Atlanta. The room features large windows that flood the space with natural light, a comfortable queen-size bed with premium linens, and a dedicated workspace perfect for remote work.',
    "You'll have your own private bathroom with a walk-in shower, fresh towels, and complimentary toiletries. The room is fully furnished and move-in ready—just bring your clothes and you're set.",
    'The house is shared with 3 other working professionals who value cleanliness and quiet. Common areas include a fully equipped kitchen, living room with smart TV, and a backyard patio.',
  ],
  roomDetails: [
    { icon: '🛏️', label: 'Bed', value: 'Queen size' },
    { icon: '🚿', label: 'Bathroom', value: 'Private (ensuite)' },
    { icon: '📐', label: 'Room size', value: '180 sq ft' },
    { icon: '🪑', label: 'Furnishing', value: 'Fully furnished' },
    { icon: '👥', label: 'Housemates', value: '3 others' },
    { icon: '📅', label: 'Minimum stay', value: '1 month' },
  ],
  amenities: [
    { icon: '📶', label: 'High-speed WiFi (200 Mbps)', available: true },
    { icon: '❄️', label: 'Central air conditioning', available: true },
    { icon: '🧺', label: 'In-unit washer/dryer', available: true },
    { icon: '🍳', label: 'Full kitchen access', available: true },
    { icon: '📺', label: 'Smart TV in common area', available: true },
    { icon: '💼', label: 'Dedicated workspace', available: true },
    { icon: '🔒', label: 'Room lock', available: true },
    { icon: '🌳', label: 'Backyard access', available: true },
    { icon: '🅿️', label: 'Parking not included', available: false },
    { icon: '🏋️', label: 'No gym access', available: false },
  ],
  rules: [
    { label: 'Guests allowed (notify host)', allowed: true },
    { label: 'Quiet hours: 10pm - 7am', allowed: true },
    { label: 'No smoking', allowed: false },
    { label: 'No pets', allowed: false },
    { label: 'No parties or events', allowed: false },
    { label: 'Long-term stays welcome', allowed: true },
  ],
  nearby: [
    { icon: '🚇', title: 'Transit', description: '5 min walk to Midtown MARTA station' },
    { icon: '🛒', title: 'Shopping', description: 'Whole Foods, Target within 0.5 miles' },
    { icon: '🌳', title: 'Parks', description: 'Piedmont Park 10 min walk' },
  ],
  reviewCategories: [
    { label: 'Cleanliness', value: 4.9 },
    { label: 'Accuracy', value: 5.0 },
    { label: 'Communication', value: 4.8 },
    { label: 'Location', value: 5.0 },
    { label: 'Value', value: 4.7 },
    { label: 'Housemates', value: 4.9 },
  ],
  reviews: [
    {
      author: 'James',
      date: 'November 2024',
      rating: 5,
      text: 'Great room and even better host! Marcus was super responsive and the place was exactly as described. The location is unbeatable - walking distance to everything in Midtown. Highly recommend.',
    },
    {
      author: 'Sarah',
      date: 'October 2024',
      rating: 5,
      text: 'Stayed here for 3 months while on a work assignment. The room is spacious, clean, and the private bathroom is a huge plus. My housemates were respectful and quiet. Would definitely stay again!',
    },
    {
      author: 'David',
      date: 'September 2024',
      rating: 4,
      text: "Nice room with great natural light. The only minor issue was that parking isn't included, which can be tricky in Midtown. But overall a fantastic value for the location and amenities.",
    },
  ],
  pricing: {
    weeklyPrice: '$175',
    monthlyPrice: '$700',
    utilitiesIncluded: true,
  },
  availability: {
    isAvailable: true,
    text: 'Available now',
  },
  breakdown: [
    { label: '$175 × 4 weeks', value: '$700' },
    { label: 'Move-in fee (one-time)', value: '$50' },
    { label: 'RoomPilot service fee', value: '$0' },
  ],
  total: { label: 'First month total', value: '$750' },
  features: [
    { icon: '⚡', title: 'Weekly payments', description: 'Pay as you go, not a month upfront' },
    { icon: '🛡️', title: 'No deposit required', description: 'Just a $50 move-in fee' },
    { icon: '✓', title: 'Background check optional', description: 'Faster approval available' },
  ],
}

// Mock similar listings
const SIMILAR_LISTINGS = [
  {
    id: '2',
    location: 'East Atlanta',
    title: 'Cozy room in renovated bungalow',
    weeklyPrice: '$145',
  },
  {
    id: '3',
    location: 'West End',
    title: 'Spacious master suite with ensuite',
    weeklyPrice: '$195',
  },
  { id: '4', location: 'Old Fourth Ward', title: 'Modern room near BeltLine', weeklyPrice: '$185' },
  {
    id: '5',
    location: 'Grant Park',
    title: 'Charming room in Victorian home',
    weeklyPrice: '$160',
  },
]

/**
 * RoomDetailsPage - Individual room listing detail page
 */
function RoomDetailsPage() {
  const navigate = useNavigate()
  useParams() // Hook required for future id usage
  const [isSaved, setIsSaved] = useState(false)

  // In real app, fetch room data based on id
  const room = MOCK_ROOM

  const handleBack = () => {
    navigate(-1)
  }

  const handleShare = () => {
    // In real app, implement share functionality
    console.log('Share listing')
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleShowAllPhotos = () => {
    console.log('Show all photos')
  }

  const handleReviewsClick = () => {
    document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleShowAllAmenities = () => {
    console.log('Show all amenities')
  }

  const handleShowAllReviews = () => {
    console.log('Show all reviews')
  }

  const handleApply = (formData) => {
    console.log('Apply:', formData)
    // Navigate to application flow
  }

  const handleReport = () => {
    console.log('Report listing')
  }

  const handleSimilarListingClick = (listing) => {
    navigate(ROUTES.ROOM_DETAILS.replace(':id', listing.id))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] h-[var(--nav-height)] px-10 flex items-center justify-between bg-white border-b border-cloud md:px-5">
        <div className="flex items-center gap-6">
          <button type="button" className="flex items-center gap-2 py-2 px-3 bg-transparent border-none font-body text-sm font-medium text-slate cursor-pointer rounded-md transition-all hover:bg-snow hover:text-charcoal" onClick={handleBack}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to search
          </button>

          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-[#1d4ed8] rounded-[10px] flex items-center justify-center text-white font-bold text-lg shadow-[0_2px_8px_rgba(37,99,235,0.3)]">R</div>
            <span className="font-display text-[22px] font-semibold text-midnight tracking-tight">RoomPilot</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center gap-1.5 py-2.5 px-4 bg-transparent border-none font-body text-sm font-medium text-slate cursor-pointer rounded-md transition-all hover:bg-snow" onClick={handleShare}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16,6 12,2 8,6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share
          </button>
          <button
            type="button"
            className={classNames(
              'flex items-center gap-1.5 py-2.5 px-4 bg-transparent border-none font-body text-sm font-medium text-slate cursor-pointer rounded-md transition-all hover:bg-snow',
              isSaved && '[&_svg]:fill-coral [&_svg]:text-coral'
            )}
            onClick={handleSave}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            Save
          </button>
        </div>
      </nav>

      {/* Photo Gallery */}
      <PhotoGallery onShowAll={handleShowAllPhotos} totalCount={24} />

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-10 pb-20 grid grid-cols-[1fr_380px] gap-20 lg:grid-cols-1 lg:gap-10 md:px-5 md:pb-15">
        {/* Left Column - Details */}
        <div className="min-w-0">
          <ListingHeader
            badges={room.badges}
            title={room.title}
            location={room.location}
            meta={room.meta}
            rating={room.rating}
            reviewCount={room.reviewCount}
            onReviewsClick={handleReviewsClick}
          />

          <HostStrip host={room.host} />

          {/* Description */}
          <section className="py-8 border-b border-cloud">
            <h2 className="font-display text-[22px] font-semibold text-midnight mb-5">About this room</h2>
            <div className="text-base leading-relaxed text-slate [&_p]:mb-4 [&_p:last-child]:mb-0">
              {room.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <button type="button" className="inline-flex items-center gap-1 mt-2 text-[15px] font-semibold text-charcoal bg-transparent border-none cursor-pointer underline p-0">
              Show more →
            </button>
          </section>

          {/* Room Details */}
          <section className="py-8 border-b border-cloud">
            <h2 className="font-display text-[22px] font-semibold text-midnight mb-5">Room details</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              {room.roomDetails.map((detail, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-snow rounded-md">
                  <div className="w-11 h-11 bg-white rounded-[10px] flex items-center justify-center text-[22px] shrink-0">{detail.icon}</div>
                  <div className="min-w-0">
                    <div className="text-[13px] text-slate mb-0.5">{detail.label}</div>
                    <div className="text-[15px] font-semibold text-charcoal">{detail.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <AmenitiesGrid
            amenities={room.amenities}
            totalCount={18}
            onShowAll={handleShowAllAmenities}
          />

          <HouseRulesGrid rules={room.rules} />

          <LocationSection nearby={room.nearby} />

          <ReviewsSection
            id="reviews"
            score={room.rating}
            totalCount={room.reviewCount}
            categories={room.reviewCategories}
            reviews={room.reviews}
            onShowAll={handleShowAllReviews}
          />
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:order-first">
          <BookingCard
            pricing={room.pricing}
            availability={room.availability}
            breakdown={room.breakdown}
            total={room.total}
            features={room.features}
            onApply={handleApply}
            onReport={handleReport}
          />
        </div>
      </div>

      {/* Similar Listings */}
      <SimilarListings listings={SIMILAR_LISTINGS} onListingClick={handleSimilarListingClick} />
    </div>
  )
}

export default RoomDetailsPage
