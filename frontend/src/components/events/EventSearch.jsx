import React, { useState } from 'react';
import './EventSearch.css';
import api from '../../api/api';

const EventSearch = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await api.get(`/events/search?query=${encodeURIComponent(searchQuery)}`);
      onSearchResults(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching events');
      onSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="event-search">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events by name..."
          className="search-input"
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className="search-error">{error}</p>}
    </div>
  );
};

export default EventSearch; 