import React, { useState } from 'react';
import './EventSearch.css';
import api from '../../api/api';

const EventSearch = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!searchTerm.trim()) {
      onSearchResults(null);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/events/search?query=${encodeURIComponent(searchTerm)}`);
      if (response.data.success) {
        onSearchResults(response.data.data);
      } else {
        onSearchResults([]);
        setError(response.data.message || 'No events found');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error.response?.data?.message || 'Error searching events');
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events by name..."
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <div className="search-error">{error}</div>}
      </form>
    </div>
  );
};

export default EventSearch; 