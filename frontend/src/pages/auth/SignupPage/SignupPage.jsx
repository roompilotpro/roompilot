import { Link, useNavigate } from 'react-router-dom'
import { RoleCard, SocialProof } from '../../../components/auth'
import { ROUTES } from '../../../router/routes'

function SignupPage() {
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    navigate(`${ROUTES.SIGNUP_FORM}?role=${role}`)
  }

  return (
    <div className="font-body bg-gradient-to-br from-snow to-cloud min-h-screen flex flex-col text-midnight">
      <header className="py-8 px-4 text-center">
        <Link to={ROUTES.HOME} className="font-display text-[2rem] font-bold text-primary no-underline">
          RoomPilot
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-8 px-4 max-w-[1100px] mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="font-display text-[2.5rem] md:text-[2rem] font-bold text-midnight mb-4 leading-tight">Welcome to RoomPilot</h1>
          <p className="text-lg text-slate max-w-[600px] mx-auto">
            Join thousands finding their perfect room or connecting with great renters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 w-full mb-8">
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

        <p className="text-center text-base text-slate">
          Already have an account? <Link to={ROUTES.LOGIN} className="text-primary no-underline font-semibold hover:underline">Sign in</Link>
        </p>

        <SocialProof />
      </main>
    </div>
  )
}

export default SignupPage
