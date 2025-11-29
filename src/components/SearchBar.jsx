// Kode baru
import { Search, X } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = "Cari ikan..." }) {
  const [query, setQuery] = useState('');

  const handleSearch = (value) => {
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <Search className="text-aqua-main w-5 h-5" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-4 bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl 
                   focus:ring-2 focus:ring-aqua-main/50 focus:border-aqua-main/50 focus:bg-white/70
                   shadow-soft transition-all duration-300 text-aqua-dark placeholder-gray-400
                   hover:border-aqua-main/30"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-aqua-main transition-colors p-1 rounded-full hover:bg-aqua-soft/30"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

