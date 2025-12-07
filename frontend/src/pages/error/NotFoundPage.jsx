import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'

/**
 * NotFoundPage - 404 error page
 * Displayed when a user navigates to a non-existent route
 */
function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-snow to-cloud">
      <nav className="bg-white border-b border-cloud py-4 px-8 flex justify-center">
        <Link
          to={ROUTES.HOME}
          className="font-display text-2xl font-bold text-primary no-underline flex items-center gap-2.5"
        >
          <span className="w-9 h-9 bg-gradient-to-br from-primary to-[#1e40af] rounded-[10px] flex items-center justify-center text-white font-bold text-lg font-body">
            R
          </span>
          RoomPilot
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-[600px] text-center">
          <div className="text-[5rem] mb-4 animate-[float_3s_ease-in-out_infinite]">&#128269;</div>
          <div className="font-display text-[8rem] font-extrabold text-primary leading-none mb-4 [text-shadow:0_4px_6px_rgba(37,99,235,0.2)] md:text-[6rem] sm:text-[4rem]">
            404
          </div>
          <h1 className="font-display text-[2.5rem] font-bold text-midnight mb-4 md:text-[2rem] sm:text-2xl">
            Oops! Page not found
          </h1>
          <p className="text-lg text-slate mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Don't worry, we'll help you
            find your way back.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-12 md:flex-col md:items-stretch">
            <Link to={ROUTES.HOME} className="no-underline">
              <Button variant="primary" size="lg">
                Go Home
              </Button>
            </Link>
            <Link to={ROUTES.SEARCH} className="no-underline">
              <Button variant="outline" size="lg">
                Search Listings
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md">
            <h3 className="font-display text-xl text-midnight mb-4">Need Help?</h3>
            <ul className="list-none flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <span className="text-xl">&#128172;</span>
                <Link
                  to={ROUTES.CONTACT}
                  className="text-primary no-underline font-medium transition-colors hover:text-[#1e40af] hover:underline"
                >
                  Contact Support
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">&#128218;</span>
                <Link
                  to={ROUTES.HELP}
                  className="text-primary no-underline font-medium transition-colors hover:text-[#1e40af] hover:underline"
                >
                  Visit Help Center
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">&#10067;</span>
                <Link
                  to={ROUTES.FAQ}
                  className="text-primary no-underline font-medium transition-colors hover:text-[#1e40af] hover:underline"
                >
                  Browse FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotFoundPage
