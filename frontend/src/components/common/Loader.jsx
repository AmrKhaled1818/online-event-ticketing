import React from 'react';
import { ClipLoader } from 'react-spinners';
import './Loader.css';

const Loader = ({ loading, message = 'Loading...' }) => {
  if (!loading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <ClipLoader
          color="#8E1616"
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
        />
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Loader; 