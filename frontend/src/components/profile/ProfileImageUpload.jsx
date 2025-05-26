import React, { useState } from 'react';
import './ProfileImageUpload.css';
import api from '../../api/api';

const ProfileImageUpload = ({ currentImage, onImageUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/users/profile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setPreviewUrl(response.data.data.profileImage);
        onImageUpdate(response.data.data.profileImage);
      } else {
        setError(response.data.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-image-upload">
      <div className="image-container">
        {previewUrl ? (
          <img src={previewUrl} alt="Profile" className="profile-image" />
        ) : (
          <div className="profile-placeholder">
            <span>No Image</span>
          </div>
        )}
        {loading && <div className="loading-overlay">Uploading...</div>}
      </div>

      <div className="upload-controls">
        <label htmlFor="profile-image" className="upload-button">
          {loading ? 'Uploading...' : 'Change Photo'}
          <input
            type="file"
            id="profile-image"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
            style={{ display: 'none' }}
          />
        </label>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ProfileImageUpload; 