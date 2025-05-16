import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
