import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ROUTES } from './routes'

// Layouts
import PublicLayout from '../components/layout/PublicLayout'

// Public pages
import LandingPage from '../pages/public/LandingPage'
import PricingPage from '../pages/public/PricingPage'
import FAQPage from '../pages/public/FAQPage'
import HowItWorksLandlordsPage from '../pages/public/HowItWorksLandlordsPage'
import HowItWorksRentersPage from '../pages/public/HowItWorksRentersPage'
import TrustSafetyPage from '../pages/public/TrustSafetyPage'
import PrivacyPage from '../pages/public/PrivacyPage'
import TermsPage from '../pages/public/TermsPage'

// Auth pages
import {
  LoginPage,
  SignupPage,
  SignupFormPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  OnboardingRenterPage,
  OnboardingHostPage,
} from '../pages/auth'

// Landlord pages
import {
  LandlordDashboardPage,
  PropertiesListPage,
  PropertyDetailPage,
  AddPropertyPage,
  AddRoomPage,
} from '../pages/landlord'

// Error pages
import NotFoundPage from '../pages/error/NotFoundPage'
import ServerErrorPage from '../pages/error/ServerErrorPage'
import MaintenancePage from '../pages/error/MaintenancePage'

/**
 * Main application router
 * Defines all routes and their corresponding page components
 */
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages with PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route path={ROUTES.PRICING} element={<PricingPage />} />
          <Route path={ROUTES.FAQ} element={<FAQPage />} />
          <Route path={ROUTES.HOW_IT_WORKS_LANDLORDS} element={<HowItWorksLandlordsPage />} />
          <Route path={ROUTES.HOW_IT_WORKS_RENTERS} element={<HowItWorksRentersPage />} />
          <Route path={ROUTES.TRUST_SAFETY} element={<TrustSafetyPage />} />
          <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
          <Route path={ROUTES.TERMS} element={<TermsPage />} />
        </Route>

        {/* Auth pages (standalone - no layout wrapper) */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.SIGNUP_FORM} element={<SignupFormPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={ROUTES.ONBOARDING_RENTER} element={<OnboardingRenterPage />} />
        <Route path={ROUTES.ONBOARDING_HOST} element={<OnboardingHostPage />} />

        {/* Landlord pages (AppShell layout is in each page) */}
        <Route path={ROUTES.LANDLORD.DASHBOARD} element={<LandlordDashboardPage />} />
        <Route path={ROUTES.LANDLORD.PROPERTIES} element={<PropertiesListPage />} />
        <Route path={ROUTES.LANDLORD.PROPERTY_NEW} element={<AddPropertyPage />} />
        <Route path={ROUTES.LANDLORD.PROPERTY_DETAIL} element={<PropertyDetailPage />} />
        <Route path={ROUTES.LANDLORD.ROOM_NEW} element={<AddRoomPage />} />

        {/* Error pages (no layout) */}
        <Route path={ROUTES.ERROR} element={<ServerErrorPage />} />
        <Route path={ROUTES.MAINTENANCE} element={<MaintenancePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
