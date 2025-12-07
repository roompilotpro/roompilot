import { Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'

/**
 * MaintenancePage - Scheduled maintenance page
 * Displayed when the site is undergoing maintenance
 */
function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-bg to-snow">
      <nav className="bg-white border-b border-cloud py-4 px-8 flex justify-center">
        <Link to={ROUTES.HOME} className="font-display text-2xl font-bold text-primary no-underline flex items-center gap-2.5">
          <span className="w-9 h-9 bg-gradient-to-br from-primary to-[#1e40af] rounded-[10px] flex items-center justify-center text-white font-bold text-lg font-body">R</span>
          RoomPilot
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-[600px] text-center">
          <div className="text-[5rem] mb-4 animate-[float_3s_ease-in-out_infinite] md:text-[4rem]">&#128736;&#65039;</div>
          <h1 className="font-display text-[2.5rem] font-bold text-midnight mb-4 md:text-[2rem] sm:text-2xl">We'll be back soon!</h1>
          <p className="text-lg text-slate mb-8 leading-relaxed">
            RoomPilot is currently undergoing scheduled maintenance to improve your experience. We
            apologize for any inconvenience.
          </p>

          <div className="flex gap-8 justify-center mb-8 flex-wrap md:flex-col md:gap-4">
            <div className="flex items-start gap-4 text-left">
              <span className="text-[2rem]">&#128197;</span>
              <div>
                <strong className="block text-midnight mb-1">Expected Duration</strong>
                <p className="text-slate m-0">2-4 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <span className="text-[2rem]">&#9889;</span>
              <div>
                <strong className="block text-midnight mb-1">What's Happening</strong>
                <p className="text-slate m-0">System upgrades and improvements</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md sm:p-6">
            <h3 className="font-display text-xl text-midnight mb-4">Need urgent help?</h3>
            <ul className="list-none flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <span className="text-xl">&#128231;</span>
                <a href="mailto:support@roompilot.com" className="text-primary no-underline font-medium transition-colors hover:text-[#1e40af] hover:underline">support@roompilot.com</a>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MaintenancePage
