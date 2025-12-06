import { Link, useNavigate } from 'react-router-dom'
import { RoleCard, SocialProof } from '../../../components/auth'
import { ROUTES } from '../../../router/routes'
import './SignupPage.css'

function SignupPage() {
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    navigate(`${ROUTES.SIGNUP_FORM}?role=${role}`)
  }

  return (
    <div className="signup-page">
      <header className="signup-page__header">
        <Link to={ROUTES.HOME} className="signup-page__logo">
          RoomPilot
        </Link>
      </header>

      <main className="signup-page__main">
        <div className="signup-page__hero">
          <h1 className="signup-page__title">Welcome to RoomPilot</h1>
          <p className="signup-page__subtitle">
            Join thousands finding their perfect room or connecting with great renters
          </p>
        </div>

        <div className="signup-page__role-cards">
          <RoleCard
            icon="🏠"
            title="I'm looking for a room"
            description="Find your next home with verified listings, transparent pricing, and a seamless search experience."
            buttonText="Sign up as Renter"
            variant="primary"
            onClick={() => handleRoleSelect('renter')}
          />

          <RoleCard
            icon="🔑"
            title="I have rooms to rent"
            description="List your property, connect with quality renters, and manage everything from one simple dashboard."
            buttonText="Sign up as Host"
            variant="accent"
            onClick={() => handleRoleSelect('host')}
          />
        </div>

        <p className="signup-page__signin-link">
          Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
        </p>

        <SocialProof />
      </main>
    </div>
  )
}

export default SignupPage
