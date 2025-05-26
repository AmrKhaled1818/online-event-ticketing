import React, { useState } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload, currentImage, label, className }) => {
  const [preview, setPreview] = useState(currentImage || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Call the parent's onImageUpload function
      await onImageUpload(file);
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`image-upload-container ${className || ''}`}>
      {label && <label className="image-upload-label">{label}</label>}
      
      <div className="image-preview-container">
        {preview ? (
          <img src={preview} alt="Preview" className="image-preview" />
        ) : (
          <div className="image-placeholder">
            <i className="fas fa-image"></i>
            <span>No image selected</span>
          </div>
        )}
      </div>

      <div className="image-upload-controls">
        <label className="upload-button">
          {loading ? 'Uploading...' : 'Choose Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {error && <div className="image-upload-error">{error}</div>}
    </div>
  );
};

export default ImageUpload; 