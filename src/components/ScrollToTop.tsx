import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathnameRef = useRef(pathname);
  const prevHashRef = useRef(hash);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const pathnameChanged = pathname !== prevPathnameRef.current;
    const hashChanged = hash !== prevHashRef.current;
    
    // Clear any pending scroll operations
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
    
    // If navigating with a hash (either hash changed or pathname changed with hash)
    if (hash) {
      // Wait for page to render, then scroll to hash element
      // If pathname changed, wait longer for the new page to fully load
      const delay = pathnameChanged ? 200 : 50;
      
      scrollTimeoutRef.current = setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const element = document.querySelector(hash);
            if (element) {
              // Get the element's position relative to document
              const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
              // Account for sticky navbar (approximately 80px for navbar + sticky nav)
              const offset = 80;
              const targetPosition = Math.max(0, elementTop - offset);
              
              // Use smooth scroll with proper offset
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
            }
          });
        });
      }, delay);
    } else if (!hash && pathnameChanged) {
      // Only scroll to top if pathname changed and there's no hash
      // Use instant scroll for pathname changes
      window.scrollTo(0, 0);
    }

    // Update refs
    prevPathnameRef.current = pathname;
    prevHashRef.current = hash;
    
    // Cleanup function
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [pathname, hash]);

  return null;
}

