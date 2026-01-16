import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathnameRef = useRef(pathname);
  const prevHashRef = useRef(hash);

  useEffect(() => {
    // Only handle hash navigation if hash changed or pathname changed with hash
    if (hash && (hash !== prevHashRef.current || pathname !== prevPathnameRef.current)) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const element = document.querySelector(hash);
          if (element) {
            // Get the element's position
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            // Account for sticky navbar (approximately 80px for navbar + sticky nav)
            const offset = 80;
            const targetPosition = elementTop - offset;
            
            // Use smooth scroll with proper offset
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    } else if (!hash && pathname !== prevPathnameRef.current) {
      // Only scroll to top if pathname changed and there's no hash
      // Use instant scroll for pathname changes
      window.scrollTo(0, 0);
    }

    // Update refs
    prevPathnameRef.current = pathname;
    prevHashRef.current = hash;
  }, [pathname, hash]);

  return null;
}

