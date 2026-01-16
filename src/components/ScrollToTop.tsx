import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathnameRef = useRef(pathname);
  const prevHashRef = useRef(hash);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasScrolledRef = useRef(false);
  const targetScrollPositionRef = useRef<number | null>(null);
  const scrollGuardTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Disable browser's automatic scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const pathnameChanged = pathname !== prevPathnameRef.current;
    const hashChanged = hash !== prevHashRef.current;
    
    // Clear any pending scroll operations
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
    if (scrollGuardTimeoutRef.current) {
      clearTimeout(scrollGuardTimeoutRef.current);
      scrollGuardTimeoutRef.current = null;
    }
    
    // Reset flags when pathname changes
    if (pathnameChanged) {
      hasScrolledRef.current = false;
      targetScrollPositionRef.current = null;
    }
    
    // If navigating with a hash (either hash changed or pathname changed with hash)
    if (hash && !hasScrolledRef.current) {
      hasScrolledRef.current = true;
      
      // Wait for page to render, then scroll to hash element
      const delay = pathnameChanged ? 400 : 100;
      
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
              targetScrollPositionRef.current = targetPosition;
              
              // Use smooth scroll with proper offset
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
              
              // Set up a scroll guard to prevent unwanted scrolling for 3 seconds
              scrollGuardTimeoutRef.current = setTimeout(() => {
                // Monitor scroll position and prevent unwanted changes
                let lastScrollTime = Date.now();
                const checkInterval = setInterval(() => {
                  const now = Date.now();
                  // Only check if it's been more than 1 second since our scroll
                  if (now - lastScrollTime > 1000 && targetScrollPositionRef.current !== null) {
                    const currentScroll = window.pageYOffset;
                    const expectedPosition = targetScrollPositionRef.current;
                    
                    // If we've scrolled significantly away from target (more than 100px), restore position
                    if (Math.abs(currentScroll - expectedPosition) > 100) {
                      window.scrollTo({
                        top: expectedPosition,
                        behavior: 'auto'
                      });
                    }
                  }
                }, 500);
                
                // Clear the guard after 3 seconds
                setTimeout(() => {
                  clearInterval(checkInterval);
                  targetScrollPositionRef.current = null;
                }, 3000);
              }, 1500);
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
      if (scrollGuardTimeoutRef.current) {
        clearTimeout(scrollGuardTimeoutRef.current);
      }
    };
  }, [pathname, hash]);

  return null;
}

