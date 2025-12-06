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

// Search & Discovery pages
import SearchPage from '../pages/search'
import RoomDetailsPage from '../pages/room-details'

// Landlord pages
import {
  LandlordDashboardPage,
  PropertiesListPage,
  PropertyDetailPage,
  AddPropertyPage,
  AddRoomPage,
  TenantsListPage,
  TenantDetailPage,
  ApplicationsListPage,
  ApplicationDetailPage,
  RoomDetailPage,
  MaintenancePage as LandlordMaintenancePage,
  MessagesPage as LandlordMessagesPage,
  AnnouncementPage,
  PayoutsPage,
  PayoutSettingsPage,
  BillingSettingsPage,
  SettingsPage as LandlordSettingsPage,
  ProfilePage as LandlordProfilePage,
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

        {/* Search & Discovery pages (standalone - no layout wrapper) */}
        <Route path={ROUTES.SEARCH} element={<SearchPage />} />
        <Route path={ROUTES.ROOM_DETAILS} element={<RoomDetailsPage />} />

        {/* Landlord pages (AppShell layout is in each page) */}
        <Route path={ROUTES.LANDLORD.DASHBOARD} element={<LandlordDashboardPage />} />
        <Route path={ROUTES.LANDLORD.PROPERTIES} element={<PropertiesListPage />} />
        <Route path={ROUTES.LANDLORD.PROPERTY_NEW} element={<AddPropertyPage />} />
        <Route path={ROUTES.LANDLORD.PROPERTY_DETAIL} element={<PropertyDetailPage />} />
        <Route path={ROUTES.LANDLORD.ROOM_NEW} element={<AddRoomPage />} />
        <Route path={ROUTES.LANDLORD.ROOM_DETAIL} element={<RoomDetailPage />} />
        <Route path={ROUTES.LANDLORD.TENANTS} element={<TenantsListPage />} />
        <Route path={ROUTES.LANDLORD.TENANT_DETAIL} element={<TenantDetailPage />} />
        <Route path={ROUTES.LANDLORD.APPLICATIONS} element={<ApplicationsListPage />} />
        <Route path={ROUTES.LANDLORD.APPLICATION_DETAIL} element={<ApplicationDetailPage />} />
        <Route path={ROUTES.LANDLORD.MAINTENANCE} element={<LandlordMaintenancePage />} />
        <Route path={ROUTES.LANDLORD.MESSAGES} element={<LandlordMessagesPage />} />
        <Route path={ROUTES.LANDLORD.ANNOUNCEMENTS} element={<AnnouncementPage />} />
        <Route path={ROUTES.LANDLORD.PAYOUTS} element={<PayoutsPage />} />
        <Route path={ROUTES.LANDLORD.PAYOUT_SETTINGS} element={<PayoutSettingsPage />} />
        <Route path={ROUTES.LANDLORD.BILLING} element={<BillingSettingsPage />} />
        <Route path={ROUTES.LANDLORD.SETTINGS} element={<LandlordSettingsPage />} />
        <Route path={ROUTES.LANDLORD.PROFILE} element={<LandlordProfilePage />} />

        {/* Error pages (no layout) */}
        <Route path={ROUTES.ERROR} element={<ServerErrorPage />} />
        <Route path={ROUTES.MAINTENANCE} element={<MaintenancePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
