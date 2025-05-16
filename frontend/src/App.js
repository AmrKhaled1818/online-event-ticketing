import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import LogoutPage from './components/auth/LogoutPage';
import ProfilePage from './components/Profile/ProfilePage';
import EventList from './components/Events/EventList';
import EventDetails from './components/Events/EventDetails';
import UserBookingsPage from './components/Bookings/UserBookingsPage';
import BookingDetails from './components/Bookings/BookingDetails';
import MyEventsPage from './components/Events/MyEventsPage';
import EventForm from './components/Events/EventForm';
import EventAnalytics from './components/Events/EventAnalytics';
import AdminEventsPage from './components/Admin/AdminEventsPage';
import AdminUsersPage from './components/Admin/AdminUsersPage';
function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />//check this
            <Route path="/logout" element={<LogoutPage />} />// check this
            <Route path="/profile" element={<ProfilePage />} />//check
            <Route path="/" element={<EventList />} />//check
            <Route path="/events/:id" element={<EventDetails />} />//check
            <Route path="/bookings" element={<UserBookingsPage />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
            <Route path="/my-events" element={<MyEventsPage />} />
            <Route path="/my-events/new" element={<EventForm />} />
            <Route path="/my-events/:id/edit" element={<EventForm />} />
            <Route path="/my-events/analytics" element={<EventAnalytics />} />
            <Route path="/admin/events" element={<AdminEventsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />

          <Route path="*" element={<LoginPage />} /> {/* Default route for now */}
        </Routes>
      </Router>
  );
}

export default App;
