import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { SUBJECT_PATH_TO_FILTER } from '@/utils/subjectMapping';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  sticky?: boolean;
  showGlow?: boolean;
}

export function SearchBar({ className = '', placeholder = 'Look for tuition teachers', sticky = false, showGlow = true }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [glowVisible, setGlowVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check if we're on a subject page or browse page
  const isSubjectPage = SUBJECT_PATH_TO_FILTER.hasOwnProperty(location.pathname);
  const isBrowsePage = location.pathname === '/all-tuition-teachers-in-kolkata';
  const isSearchablePage = isSubjectPage || isBrowsePage;

  // Sync with URL parameter if on Browse or Subject page
  useEffect(() => {
    if (isSearchablePage) {
      const urlQuery = searchParams.get('q') || '';
      setQuery(urlQuery);
    }
  }, [searchParams, location.pathname, isSearchablePage]);

  // Fade out glow after 2 seconds
  useEffect(() => {
    if (showGlow && !sticky) {
      const timer = setTimeout(() => {
        setGlowVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showGlow, sticky]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Use window.location.href to force a full page refresh
      // This ensures filters are properly synced from URL params on page load
      // Preserve the current path (subject page or browse page)
      const currentPath = isSubjectPage ? location.pathname : '/all-tuition-teachers-in-kolkata';
      const url = `${currentPath}?q=${encodeURIComponent(query.trim())}`;
      window.location.href = url;
    }
  };

  const handleClear = () => {
    setQuery('');
    // Remove search query from URL, preserve current path
    const currentPath = isSubjectPage ? location.pathname : '/all-tuition-teachers-in-kolkata';
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('q');
    const newUrl = newSearchParams.toString()
      ? `${currentPath}?${newSearchParams.toString()}`
      : currentPath;
    navigate(newUrl);
  };

  return (
    <div className={`relative group transition-all duration-300 ease-out ${showGlow && !sticky ? 'search-bar-glow-wrapper focus-within:scale-[1.02]' : ''} ${className}`}>
      {/* Gradient glow behind the search bar (non-sticky only) */}
      {showGlow && !sticky && (
        <>
          <div
            className="search-bar-glow-blur transition-opacity duration-1000 ease-out"
            style={{ opacity: glowVisible ? 1 : 0 }}
            aria-hidden="true"
          />
          <div
            className="search-bar-glow-sharp transition-opacity duration-1000 ease-out"
            style={{ opacity: glowVisible ? 1 : 0 }}
            aria-hidden="true"
          />
        </>
      )}
      <form onSubmit={handleSubmit} className="relative">
        <Search className={`absolute ${sticky ? 'left-2.5 w-3.5 h-3.5' : 'left-3 sm:left-5 w-4 h-4 sm:w-5 sm:h-5'} top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-colors duration-200 z-[2]`} strokeWidth={sticky ? 2 : 2.5} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={sticky ? "search-input-sticky pl-9 pr-8" : `search-input ${showGlow ? 'search-input-pulse' : ''} pl-10 sm:pl-14 pr-10 sm:pr-12 py-3 sm:py-5 text-sm sm:text-base`}
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute ${sticky ? 'right-2.5' : 'right-3 sm:right-4'} top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted active:bg-muted/80 transition-all duration-200 z-[2]`}
            aria-label="Clear search"
          >
            <X className={`${sticky ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} text-muted-foreground hover:text-foreground`} />
          </button>
        )}
      </form>
    </div>
  );
}
