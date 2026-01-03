import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className = '', placeholder = 'Look for tuition teachers' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Sync with URL parameter if on Browse page
  useEffect(() => {
    if (location.pathname === '/browse') {
      const urlQuery = searchParams.get('q') || '';
      setQuery(urlQuery);
    }
  }, [searchParams, location.pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    // Remove search query from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('q');
    navigate(newSearchParams.toString() ? `/browse?${newSearchParams.toString()}` : '/browse');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="search-input pl-14 pr-12"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </form>
  );
}
