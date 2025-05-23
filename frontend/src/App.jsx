import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import VerifyOtpPage from './components/auth/VerifyOtpPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import LogoutPage from './components/auth/LogoutPage';
import ProfilePage from './components/profile/ProfilePage';
import EventList from './components/events/EventList';
import EventDetails from './components/events/EventDetails';
import UserBookingsPage from './components/bookings/UserBookingsPage';
import BookingDetails from './components/bookings/BookingDetails';
import MyEventsPage from './components/events/MyEventsPage';
import EventForm from './components/events/EventForm';
import EventAnalytics from './components/events/EventAnalytics';
import AdminEventsPage from './components/admin/AdminEventsPage';
import AdminUsersPage from './components/admin/AdminUsersPage';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import HomePage from './components/home/Home';
import LegalFallback from './components/Terms.jsx';
import ScrollToTop from './components/ScrollToTop'; // adjust path as needed

// Simple auth check (can be replaced later with proper context)
const isAuthenticated = document.cookie.includes('token=') || localStorage.getItem('token');

function AppRoutes() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/forgot-password', '/verify-otp', '/reset-password'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
        <ScrollToTop />

      <Routes>
        {/* Redirect root to homepage */}
        <Route path="/" element={<HomePage />} />

        {/* Public routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/events" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/events" /> : <RegisterPage />} />
        <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/events" /> : <ForgotPasswordPage />} />
        <Route path="/verify-otp" element={isAuthenticated ? <Navigate to="/events" /> : <VerifyOtpPage />} />
        <Route path="/reset-password" element={isAuthenticated ? <Navigate to="/events" /> : <ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/bookings" element={<UserBookingsPage />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/my-events/new" element={<EventForm />} />
        <Route path="/my-events/:id/edit" element={<EventForm />} />
        <Route path="/my-events/analytics" element={<EventAnalytics />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/termsandpolicy" element={<LegalFallback />} />
        <Route path="/termsandpolicy" element={<LegalFallback />} />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {shouldShowNavbar && <Footer />} {/* Show footer on main app pages */}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
