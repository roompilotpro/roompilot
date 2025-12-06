import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Card } from '../../components/cards'
import { Button } from '../../components/primitives'
import { Breadcrumb } from '../../components/navigation'
import {
  Input,
  Select,
  Textarea,
  Checkbox,
  Toggle,
  FileUpload,
  DatePicker,
} from '../../components/forms'
import {
  bedTypeOptions,
  minimumStayOptions,
  roomAmenities,
  mockProperties,
} from '../../data/mockLandlordData'
import './AddRoomPage.css'

function AddRoomPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const propertyId = searchParams.get('propertyId') || '1'
  const { navLinks, user, logoBadge } = useLandlordLayout()

  const property = mockProperties.find((p) => p.id === propertyId) || mockProperties[0]

  const [formData, setFormData] = useState({
    name: '',
    roomType: 'private',
    bathroomType: 'private',
    size: '',
    bedType: '',
    furnished: true,
    weeklyRent: '',
    deposit: '',
    minimumStay: '',
    availableFrom: '',
    photos: [],
    amenities: {
      window: true,
      closet: true,
      desk: true,
    },
    rules: '',
  })

  const breadcrumbItems = [
    { label: 'Properties', href: ROUTES.LANDLORD.PROPERTIES },
    { label: property.name, href: `/landlord/properties/${property.id}` },
    { label: 'Add Room' },
  ]

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleAmenity = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenityId]: !prev.amenities[amenityId],
      },
    }))
  }

  // Auto-calculate monthly rent from weekly
  const monthlyRent = useMemo(() => {
    const weekly = parseFloat(formData.weeklyRent) || 0
    return (weekly * 4.33).toFixed(2)
  }, [formData.weeklyRent])

  const handleSubmit = () => {
    console.log('Adding room:', formData)
    navigate(`/landlord/properties/${property.id}`)
  }

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData)
  }

  const handleCancel = () => {
    navigate(`/landlord/properties/${property.id}`)
  }

  return (
    <AppShell
      sidebar={{
        links: navLinks,
        user,
        logoBadge,
      }}
      header={{
        title: 'Add New Room',
        subtitle: `Add a room to ${property.name}`,
      }}
    >
      <div className="add-room-content">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="add-room-breadcrumb" />

        {/* Form Card */}
        <Card className="add-room-card">
          {/* Basic Information */}
          <section className="form-section">
            <h2 className="form-section-title">Basic Information</h2>

            <div className="form-grid">
              <Input
                label="Room Name/Number"
                placeholder="e.g., Room 1A or Master Bedroom"
                helperText="This helps identify the room"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                required
                fullWidth
              />

              <div className="form-group">
                <label className="form-label">Room Type</label>
                <div className="toggle-options">
                  <button
                    type="button"
                    className={`toggle-option ${formData.roomType === 'private' ? 'active' : ''}`}
                    onClick={() => updateFormData('roomType', 'private')}
                  >
                    Private Room
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${formData.roomType === 'shared' ? 'active' : ''}`}
                    onClick={() => updateFormData('roomType', 'shared')}
                  >
                    Shared Room
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bathroom Type</label>
                <div className="toggle-options">
                  <button
                    type="button"
                    className={`toggle-option ${formData.bathroomType === 'private' ? 'active' : ''}`}
                    onClick={() => updateFormData('bathroomType', 'private')}
                  >
                    Private
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${formData.bathroomType === 'shared' ? 'active' : ''}`}
                    onClick={() => updateFormData('bathroomType', 'shared')}
                  >
                    Shared
                  </button>
                </div>
              </div>

              <Input
                label="Room Size"
                placeholder="Square feet"
                helperText="Optional - helps renters compare rooms"
                value={formData.size}
                onChange={(e) => updateFormData('size', e.target.value)}
                fullWidth
              />

              <Select
                label="Bed Type"
                options={bedTypeOptions}
                value={formData.bedType}
                onChange={(e) => updateFormData('bedType', e.target.value)}
                fullWidth
              />

              <div className="form-group">
                <label className="form-label">Furnished Status</label>
                <div className="toggle-options">
                  <button
                    type="button"
                    className={`toggle-option ${formData.furnished ? 'active' : ''}`}
                    onClick={() => updateFormData('furnished', true)}
                  >
                    Furnished
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${!formData.furnished ? 'active' : ''}`}
                    onClick={() => updateFormData('furnished', false)}
                  >
                    Unfurnished
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing & Availability */}
          <section className="form-section">
            <h2 className="form-section-title">Pricing & Availability</h2>

            <div className="form-grid">
              <Input
                label="Weekly Rent"
                placeholder="0.00"
                prefix="$"
                helperText="Renters typically search by weekly rent"
                value={formData.weeklyRent}
                onChange={(e) => updateFormData('weeklyRent', e.target.value)}
                type="number"
                fullWidth
              />

              <Input
                label="Monthly Rent (Auto-calculated)"
                value={monthlyRent}
                prefix="$"
                helperText="Automatically calculated as weekly × 4.33"
                disabled
                fullWidth
              />

              <Input
                label="Move-in Fee / Deposit"
                placeholder="0.00"
                prefix="$"
                helperText="One-time fee when tenant moves in"
                value={formData.deposit}
                onChange={(e) => updateFormData('deposit', e.target.value)}
                type="number"
                fullWidth
              />

              <Select
                label="Minimum Stay"
                options={minimumStayOptions}
                value={formData.minimumStay}
                onChange={(e) => updateFormData('minimumStay', e.target.value)}
                fullWidth
              />

              <DatePicker
                label="Available From"
                helperText="When can a tenant move in?"
                value={formData.availableFrom}
                onChange={(e) => updateFormData('availableFrom', e.target.value)}
                fullWidth
              />
            </div>
          </section>

          {/* Room Photos */}
          <section className="form-section">
            <h2 className="form-section-title">Room Photos</h2>

            <FileUpload
              accept="image/*"
              multiple
              helperText="Drag and drop or click to browse (JPG, PNG up to 10MB)"
              onChange={(files) => updateFormData('photos', files)}
            />
          </section>

          {/* Room Amenities */}
          <section className="form-section">
            <h2 className="form-section-title">Room-Specific Amenities</h2>
            <p className="form-section-description">
              Select amenities that are specific to this room (property amenities are already
              included)
            </p>

            <div className="amenities-grid">
              {roomAmenities.map((amenity) => (
                <Checkbox
                  key={amenity.id}
                  id={amenity.id}
                  label={`${amenity.icon} ${amenity.label}`}
                  checked={formData.amenities[amenity.id] || false}
                  onChange={() => toggleAmenity(amenity.id)}
                  card
                />
              ))}
            </div>
          </section>

          {/* Room Rules */}
          <section className="form-section">
            <h2 className="form-section-title">Room-Specific Rules</h2>
            <p className="form-section-description">
              Any additional rules or restrictions specific to this room (optional)
            </p>

            <Textarea
              label="Additional Rules or Notes"
              placeholder="e.g., This room is on the second floor, requires climbing stairs..."
              value={formData.rules}
              onChange={(e) => updateFormData('rules', e.target.value)}
              minRows={4}
              fullWidth
            />
          </section>

          {/* Actions */}
          <div className="add-room-actions">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <div className="add-room-actions-right">
              <Button variant="outline" onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Add Room
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

export default AddRoomPage
