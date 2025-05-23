import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/profile');
      if (response.data.success) {
        const fetchedUser = response.data.data;
        setUser(fetchedUser);
        setFormData({
          name: fetchedUser.name,
          email: fetchedUser.email,
          profilePicture: fetchedUser.profilePicture || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        if (fetchedUser.role === 'user') {
          const bookingRes = await api.get('/users/bookings');
          if (bookingRes.data.success) {
            setBookings(bookingRes.data.data);
          }
        }
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        profilePicture: formData.profilePicture
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await api.put('/users/profile', updateData);
      if (response.data.success) {
        setSuccess('Profile updated successfully');
        await loadProfile();
        setIsEditing(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowConfirmModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      await api.delete(`/bookings/${selectedBooking._id}`);
      setSuccess('Booking cancelled successfully');
      await loadProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
    setShowConfirmModal(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <div className="profile-page-wrapper">
        <div className="loading">Loading your profile...</div>
      </div>
    );
  }

  if (!user && error) {
    return (
      <div className="profile-page-wrapper">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-picture-container">
            <img 
            src={`https://ui-avatars.com/api/?name=${user.name}&background=8E1616&color=fff&size=128`} 
            alt="User Icon"
            className="profile-picture"
            />

            {isEditing && (
              <button className="profile-picture-edit">
                ✏️
              </button>
            )}
          </div>
          
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <span className="profile-role">{user.role}</span>
          
          <button 
            className={`edit-profile-btn ${isEditing ? 'cancel' : ''}`}
            onClick={() => {
              setIsEditing(!isEditing);
              setError('');
              setSuccess('');
            }}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {/* Main Content */}
        <div className="profile-main-content">
          {/* Profile Form */}
          <div className="profile-form-card">
            <h3 className="card-title">Profile Information</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {isEditing && (
                  <div className="form-group full-width">
                    <label className="form-label">Profile Picture URL</label>
                    <input
                      type="url"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://example.com/your-photo.jpg"
                    />
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="password-section">
                  <h3>Change Password</h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <div className="password-input-group">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() => togglePasswordVisibility('current')}
                        >
                          {showPasswords.current ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <div className="password-input-group">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() => togglePasswordVisibility('new')}
                        >
                          {showPasswords.new ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Confirm New Password</label>
                      <div className="password-input-group">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() => togglePasswordVisibility('confirm')}
                        >
                          {showPasswords.confirm ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              {isEditing && (
                <div className="action-buttons">
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Bookings Section */}
          {user?.role === 'user' && (
            <div className="bookings-card">
              <h3 className="card-title">My Bookings</h3>
              
              {bookings.length === 0 ? (
                <div className="no-bookings">
                  You haven't booked any events yet. Start exploring!
                </div>
              ) : (
                <div className="bookings-grid">
                  {bookings.map(booking => (
                    <div key={booking._id} className="booking-item">
                      <div className="booking-info">
                        <h3>{booking.event.title}</h3>
                        <p><strong>Date:</strong> {new Date(booking.event.date).toLocaleDateString()}</p>
                        <p><strong>Location:</strong> {booking.event.location}</p>
                        <p><strong>Tickets:</strong> {booking.ticketsBooked}</p>
                        <p className="booking-price">Total: ${booking.totalPrice}</p>
                      </div>
                      <button 
                        className="cancel-booking-btn"
                        onClick={() => handleCancelBooking(booking)}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cancel Booking</h3>
            <p>Are you sure you want to cancel your booking for "{selectedBooking?.event.title}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="modal-btn confirm"
                onClick={confirmCancelBooking}
              >
                Yes, Cancel Booking
              </button>
              <button 
                className="modal-btn cancel"
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedBooking(null);
                }}
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;