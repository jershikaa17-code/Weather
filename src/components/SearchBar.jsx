import { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

function SearchBar({ onSearch, disabled }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    onSearch(query);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <Search className="search-bar__icon" size={19} aria-hidden="true" />
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search for a city (e.g. Chennai, Mumbai, Tokyo)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="City name"
        disabled={disabled}
      />
      <button type="submit" className="search-bar__button" disabled={disabled}>
        {disabled ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}

export default SearchBar;
