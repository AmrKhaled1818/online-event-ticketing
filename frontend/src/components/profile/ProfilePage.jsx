import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProfilePage.css';

// EyeIcon component with proper SVG icons
const EyeIcon = ({ isVisible }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {isVisible ? (
      // Eye open icon
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      // Eye closed icon
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

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

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/profile');
      if (response.data.success) {
        const fetchedUser = response.data.data;
        setUser(fetchedUser);
        setFormData(prevData => ({
          ...prevData,
          name: fetchedUser.name || '',
          email: fetchedUser.email || '',
          profilePicture: fetchedUser.profilePicture || '',
          // Keep password fields empty
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));

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
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change - Field: ${name}, Value: ${value}`); // Debug log
    
    // Special handling for password fields
    if (name === 'currentPassword' || name === 'newPassword' || name === 'confirmPassword') {
      console.log(`Password field ${name} being updated with value: ${value}`);
    }
    
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [name]: value
      };
      console.log('Updated form data:', newData);
      return newData;
    });
  };

  const togglePasswordVisibility = (field) => {
    console.log(`Toggling password visibility for: ${field}`); // Debug log
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleFocus = (field) => {
    console.log(`Focused on ${field}`); // Debug log to confirm focus
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('Form data at submit:', formData); // Debug log

    // Password validation
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        return;
      }
      if (!formData.newPassword) {
        setError('New password is required');
        return;
      }
      if (!formData.confirmPassword) {
        setError('Please confirm your new password');
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

      // Only include password fields if they're being changed
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      console.log('Sending update data:', updateData); // Debug log

      const response = await api.put('/users/profile', updateData);
      if (response.data.success) {
        setSuccess('Profile updated successfully');
        await loadProfile();
        setIsEditing(false);
        // Clear password fields after successful update
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
      console.error('Update error:', err); // Debug log
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
      toast.success('Booking cancelled successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setBookings(prevBookings => prevBookings.filter(booking => booking._id !== selectedBooking._id));
      setShowConfirmModal(false);
      setSelectedBooking(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setShowConfirmModal(false);
      setSelectedBooking(null);
    }
  };

  // Add this effect to monitor form data changes
  useEffect(() => {
    console.log('Form data state updated:', formData);
  }, [formData]);

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
      <ToastContainer />
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
              // Reset password fields when canceling edit
              if (isEditing) {
                setFormData(prev => ({
                  ...prev,
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                }));
              }
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
                    onFocus={() => handleFocus('name')}
                    disabled={!isEditing}
                    className={`form-input ${!isEditing ? 'disabled' : ''}`}
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
                    onFocus={() => handleFocus('email')}
                    disabled={!isEditing}
                    className={`form-input ${!isEditing ? 'disabled' : ''}`}
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
                      onFocus={() => handleFocus('profilePicture')}
                      className="form-input"
                      placeholder="https://example.com/your-photo.jpg"
                    />
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="password-section">
                  <h3>Change Password</h3>
                  
                  <div className="form-grid password-grid">
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <div className="password-input-group">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus('currentPassword')}
                          className="form-input"
                          placeholder="Enter current password"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() => togglePasswordVisibility('current')}
                          tabIndex="-1"
                        >
                          <EyeIcon isVisible={showPasswords.current} />
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
                          onFocus={() => handleFocus('newPassword')}
                          className="form-input"
                          placeholder="Enter new password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() => togglePasswordVisibility('new')}
                          tabIndex="-1"
                        >
                          <EyeIcon isVisible={showPasswords.new} />
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <div className="password-input-group">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus('confirmPassword')}
                          className="form-input"
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() => togglePasswordVisibility('confirm')}
                          tabIndex="-1"
                        >
                          <EyeIcon isVisible={showPasswords.confirm} />
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
                        <p className="booking-price">Total: {booking.totalPrice} EGP</p>
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