import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button } from '../../components/primitives'
import './ProfilePage.css'

function ProfilePage() {
  const { navLinks, user, logoBadge } = useLandlordLayout()

  const saveProfile = () => {
    alert('Profile updated successfully!')
  }

  const previewProfile = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AppShell
      sidebar={{
        links: navLinks,
        user,
        logoBadge,
      }}
      header={{
        title: 'Host Profile',
        subtitle: 'Manage how renters see your profile',
      }}
    >
      <div className="profile-page">
        {/* Public Profile Preview */}
        <div className="profile-card">
          <h2 className="profile-card-title">Profile Preview</h2>
          <p className="profile-card-description">This is how renters will see your profile</p>

          <div className="profile-preview-header">
            <div className="profile-photo-display">JD</div>
            <h3 className="profile-name">John Doe Properties</h3>
            <div className="profile-response-badge">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Usually responds within 1 hour
            </div>
          </div>

          <div className="profile-bio">
            Professional property manager with over 10 years of experience. I take pride in
            maintaining quality housing and ensuring my tenants have a great living experience. All
            properties are well-maintained with quick response to any issues.
          </div>

          <div className="profile-verification-badges">
            <div className="profile-badge">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              ID Verified
            </div>
            <div className="profile-badge">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Payment Verified
            </div>
            <div className="profile-badge">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Phone Verified
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat-item">
              <div className="profile-stat-value">3</div>
              <div className="profile-stat-label">Years</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-value">3</div>
              <div className="profile-stat-label">Properties</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-value">18</div>
              <div className="profile-stat-label">Rooms</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-value">
                <div className="profile-star-rating">
                  <span>4.8</span>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="profile-stat-label">Rating (24 reviews)</div>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="profile-card">
          <h2 className="profile-card-title">Edit Profile Information</h2>

          <div className="profile-form-group">
            <label className="profile-form-label">Business/Host Name</label>
            <input type="text" className="profile-form-input" defaultValue="John Doe Properties" />
            <div className="profile-form-hint">
              This name will appear on your listings and profile
            </div>
          </div>

          <div className="profile-form-group">
            <label className="profile-form-label">Profile Photo</label>
            <div className="profile-photo-upload">
              <div className="profile-current-photo">JD</div>
              <button className="profile-upload-btn">Change Photo</button>
            </div>
          </div>

          <div className="profile-form-group">
            <label className="profile-form-label">Bio/Description</label>
            <textarea
              className="profile-form-textarea"
              defaultValue="Professional property manager with over 10 years of experience. I take pride in maintaining quality housing and ensuring my tenants have a great living experience. All properties are well-maintained with quick response to any issues."
            />
            <div className="profile-form-hint">
              Tell renters about yourself and your properties (max 500 characters)
            </div>
          </div>

          <div className="profile-form-group">
            <label className="profile-form-label">Response Time</label>
            <select className="profile-form-select">
              <option>Usually responds within 1 hour</option>
              <option>Usually responds within 2 hours</option>
              <option>Usually responds within 24 hours</option>
              <option>Response time varies</option>
            </select>
            <div className="profile-form-hint">
              Set expectations for how quickly you respond to inquiries
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="profile-card">
          <h2 className="profile-card-title">Verification & Trust</h2>

          <div className="profile-verification-list">
            <div className="profile-verification-item">
              <div className="profile-verification-info">
                <div className="profile-verification-icon profile-verification-icon--verified">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="profile-verification-text">
                  <h4>Identity Verification</h4>
                  <p>Government ID confirmed</p>
                </div>
              </div>
              <span className="profile-status-badge profile-status-badge--verified">Verified</span>
            </div>

            <div className="profile-verification-item">
              <div className="profile-verification-info">
                <div className="profile-verification-icon profile-verification-icon--verified">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div className="profile-verification-text">
                  <h4>Stripe Connected</h4>
                  <p>Payment processing active</p>
                </div>
              </div>
              <span className="profile-status-badge profile-status-badge--verified">Active</span>
            </div>

            <div className="profile-verification-item">
              <div className="profile-verification-info">
                <div className="profile-verification-icon profile-verification-icon--verified">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="profile-verification-text">
                  <h4>Phone Verification</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <span className="profile-status-badge profile-status-badge--verified">Verified</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-action-buttons">
          <Button variant="primary" onClick={saveProfile}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={previewProfile}>
            Preview Public Profile
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

export default ProfilePage
