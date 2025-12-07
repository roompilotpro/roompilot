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
import { classNames } from '../../utils'

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
      <div className="p-8 max-w-[900px] mx-auto md:p-5">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Form Card */}
        <Card className="p-8 md:p-6">
          {/* Basic Information */}
          <section className="mb-8 pb-8 border-b border-cloud">
            <h2 className="text-lg font-bold text-midnight mb-5 pb-3 border-b-2 border-cloud">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Room Name/Number"
                placeholder="e.g., Room 1A or Master Bedroom"
                helperText="This helps identify the room"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                required
                fullWidth
              />

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-midnight text-sm">Room Type</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    type="button"
                    className={classNames(
                      'flex-1 p-3 border-2 rounded-lg text-center cursor-pointer transition-all font-body text-sm font-semibold',
                      formData.roomType === 'private'
                        ? 'border-primary bg-primary text-white'
                        : 'border-cloud bg-white text-slate hover:border-primary hover:bg-primary-bg hover:text-primary'
                    )}
                    onClick={() => updateFormData('roomType', 'private')}
                  >
                    Private Room
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      'flex-1 p-3 border-2 rounded-lg text-center cursor-pointer transition-all font-body text-sm font-semibold',
                      formData.roomType === 'shared'
                        ? 'border-primary bg-primary text-white'
                        : 'border-cloud bg-white text-slate hover:border-primary hover:bg-primary-bg hover:text-primary'
                    )}
                    onClick={() => updateFormData('roomType', 'shared')}
                  >
                    Shared Room
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-midnight text-sm">Bathroom Type</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    type="button"
                    className={classNames(
                      'flex-1 p-3 border-2 rounded-lg text-center cursor-pointer transition-all font-body text-sm font-semibold',
                      formData.bathroomType === 'private'
                        ? 'border-primary bg-primary text-white'
                        : 'border-cloud bg-white text-slate hover:border-primary hover:bg-primary-bg hover:text-primary'
                    )}
                    onClick={() => updateFormData('bathroomType', 'private')}
                  >
                    Private
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      'flex-1 p-3 border-2 rounded-lg text-center cursor-pointer transition-all font-body text-sm font-semibold',
                      formData.bathroomType === 'shared'
                        ? 'border-primary bg-primary text-white'
                        : 'border-cloud bg-white text-slate hover:border-primary hover:bg-primary-bg hover:text-primary'
                    )}
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

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-midnight text-sm">Furnished Status</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    type="button"
                    className={classNames(
                      'flex-1 p-3 border-2 rounded-lg text-center cursor-pointer transition-all font-body text-sm font-semibold',
                      formData.furnished
                        ? 'border-primary bg-primary text-white'
                        : 'border-cloud bg-white text-slate hover:border-primary hover:bg-primary-bg hover:text-primary'
                    )}
                    onClick={() => updateFormData('furnished', true)}
                  >
                    Furnished
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      'flex-1 p-3 border-2 rounded-lg text-center cursor-pointer transition-all font-body text-sm font-semibold',
                      !formData.furnished
                        ? 'border-primary bg-primary text-white'
                        : 'border-cloud bg-white text-slate hover:border-primary hover:bg-primary-bg hover:text-primary'
                    )}
                    onClick={() => updateFormData('furnished', false)}
                  >
                    Unfurnished
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing & Availability */}
          <section className="mb-8 pb-8 border-b border-cloud">
            <h2 className="text-lg font-bold text-midnight mb-5 pb-3 border-b-2 border-cloud">Pricing & Availability</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          <section className="mb-8 pb-8 border-b border-cloud">
            <h2 className="text-lg font-bold text-midnight mb-5 pb-3 border-b-2 border-cloud">Room Photos</h2>

            <FileUpload
              accept="image/*"
              multiple
              helperText="Drag and drop or click to browse (JPG, PNG up to 10MB)"
              onChange={(files) => updateFormData('photos', files)}
            />
          </section>

          {/* Room Amenities */}
          <section className="mb-8 pb-8 border-b border-cloud">
            <h2 className="text-lg font-bold text-midnight mb-5 pb-3 border-b-2 border-cloud">Room-Specific Amenities</h2>
            <p className="text-sm text-slate -mt-3 mb-4">
              Select amenities that are specific to this room (property amenities are already
              included)
            </p>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
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
          <section className="mb-6">
            <h2 className="text-lg font-bold text-midnight mb-5 pb-3 border-b-2 border-cloud">Room-Specific Rules</h2>
            <p className="text-sm text-slate -mt-3 mb-4">
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
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-cloud gap-4">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <div className="flex gap-3 w-full md:w-auto justify-center">
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
