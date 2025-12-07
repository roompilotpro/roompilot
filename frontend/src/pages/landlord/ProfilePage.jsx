import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button } from '../../components/primitives'

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
      <div className="max-w-[1200px]">
        {/* Public Profile Preview */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-midnight mb-2">Profile Preview</h2>
          <p className="text-slate mb-6">This is how renters will see your profile</p>

          <div className="text-center mb-8">
            <div className="w-[120px] h-[120px] rounded-full bg-primary text-white flex items-center justify-center text-5xl font-bold mx-auto mb-4">
              JD
            </div>
            <h3 className="font-display text-[28px] font-bold text-midnight mb-2">
              John Doe Properties
            </h3>
            <div className="inline-flex items-center gap-1.5 bg-accent-bg text-accent py-1.5 px-3 rounded-md text-sm font-semibold">
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

          <div className="text-slate leading-relaxed mb-6">
            Professional property manager with over 10 years of experience. I take pride in
            maintaining quality housing and ensuring my tenants have a great living experience. All
            properties are well-maintained with quick response to any issues.
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 py-2 px-4 bg-snow rounded-lg text-sm text-slate">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="text-accent"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              ID Verified
            </div>
            <div className="flex items-center gap-2 py-2 px-4 bg-snow rounded-lg text-sm text-slate">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="text-accent"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Payment Verified
            </div>
            <div className="flex items-center gap-2 py-2 px-4 bg-snow rounded-lg text-sm text-slate">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="text-accent"
              >
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

          <div className="grid grid-cols-4 md:grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-snow rounded-lg">
              <div className="text-[28px] font-bold text-primary mb-1">3</div>
              <div className="text-sm text-slate">Years</div>
            </div>
            <div className="text-center p-4 bg-snow rounded-lg">
              <div className="text-[28px] font-bold text-primary mb-1">3</div>
              <div className="text-sm text-slate">Properties</div>
            </div>
            <div className="text-center p-4 bg-snow rounded-lg">
              <div className="text-[28px] font-bold text-primary mb-1">18</div>
              <div className="text-sm text-slate">Rooms</div>
            </div>
            <div className="text-center p-4 bg-snow rounded-lg">
              <div className="text-[28px] font-bold text-primary mb-1">
                <div className="flex items-center justify-center gap-1 text-warm">
                  <span>4.8</span>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-slate">Rating (24 reviews)</div>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-midnight mb-6">
            Edit Profile Information
          </h2>

          <div className="mb-6">
            <label className="block font-semibold text-midnight mb-2">Business/Host Name</label>
            <input
              type="text"
              className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm transition-colors duration-200 focus:outline-none focus:border-primary"
              defaultValue="John Doe Properties"
            />
            <div className="text-[13px] text-slate mt-1.5">
              This name will appear on your listings and profile
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-semibold text-midnight mb-2">Profile Photo</label>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-[32px] font-bold">
                JD
              </div>
              <button className="py-2.5 px-5 bg-white border-2 border-primary text-primary rounded-lg font-semibold cursor-pointer transition-all duration-200 font-body hover:bg-primary-bg">
                Change Photo
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-semibold text-midnight mb-2">Bio/Description</label>
            <textarea
              className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm min-h-[120px] resize-y transition-colors duration-200 focus:outline-none focus:border-primary"
              defaultValue="Professional property manager with over 10 years of experience. I take pride in maintaining quality housing and ensuring my tenants have a great living experience. All properties are well-maintained with quick response to any issues."
            />
            <div className="text-[13px] text-slate mt-1.5">
              Tell renters about yourself and your properties (max 500 characters)
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-semibold text-midnight mb-2">Response Time</label>
            <select className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm transition-colors duration-200 focus:outline-none focus:border-primary">
              <option>Usually responds within 1 hour</option>
              <option>Usually responds within 2 hours</option>
              <option>Usually responds within 24 hours</option>
              <option>Response time varies</option>
            </select>
            <div className="text-[13px] text-slate mt-1.5">
              Set expectations for how quickly you respond to inquiries
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-midnight mb-6">
            Verification & Trust
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent-bg text-accent">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-midnight mb-1">Identity Verification</h4>
                  <p className="text-[13px] text-slate">Government ID confirmed</p>
                </div>
              </div>
              <span className="py-1.5 px-3 rounded-md text-[13px] font-semibold bg-accent-bg text-accent">
                Verified
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent-bg text-accent">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-midnight mb-1">Stripe Connected</h4>
                  <p className="text-[13px] text-slate">Payment processing active</p>
                </div>
              </div>
              <span className="py-1.5 px-3 rounded-md text-[13px] font-semibold bg-accent-bg text-accent">
                Active
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent-bg text-accent">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-midnight mb-1">Phone Verification</h4>
                  <p className="text-[13px] text-slate">+1 (555) 123-4567</p>
                </div>
              </div>
              <span className="py-1.5 px-3 rounded-md text-[13px] font-semibold bg-accent-bg text-accent">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
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
