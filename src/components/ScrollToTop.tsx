import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathnameRef = useRef(pathname);
  const prevHashRef = useRef(hash);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasScrolledRef = useRef(false);
  const targetScrollPositionRef = useRef<number | null>(null);
  const scrollGuardIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollBlockedRef = useRef(false);
  const lastScrollTimeRef = useRef<number>(0);

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
    if (scrollGuardIntervalRef.current) {
      clearInterval(scrollGuardIntervalRef.current);
      scrollGuardIntervalRef.current = null;
    }
    
    // Reset flags when pathname changes
    if (pathnameChanged) {
      hasScrolledRef.current = false;
      targetScrollPositionRef.current = null;
      scrollBlockedRef.current = false;
      lastScrollTimeRef.current = 0;
    }
    
    // If navigating with a hash (either hash changed or pathname changed with hash)
    if (hash && !hasScrolledRef.current) {
      hasScrolledRef.current = true;
      scrollBlockedRef.current = true;
      
      // Function to perform the scroll
      const performScroll = () => {
        const element = document.querySelector(hash);
        if (element) {
          // Get the element's position relative to document
          const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
          // Account for sticky navbar (approximately 80px for navbar + sticky nav)
          const offset = 80;
          const targetPosition = Math.max(0, elementTop - offset);
          targetScrollPositionRef.current = targetPosition;
          lastScrollTimeRef.current = Date.now();
          
          // Use smooth scroll with proper offset
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Set up scroll guard immediately to prevent unwanted scrolling
          scrollGuardIntervalRef.current = setInterval(() => {
            const now = Date.now();
            // Only guard if it's been less than 4 seconds since our scroll
            if (now - lastScrollTimeRef.current < 4000 && targetScrollPositionRef.current !== null) {
              const currentScroll = window.pageYOffset;
              const expectedPosition = targetScrollPositionRef.current;
              
              // If we've scrolled significantly away from target (more than 50px), restore position
              if (Math.abs(currentScroll - expectedPosition) > 50) {
                // Only restore if it's been more than 1 second since our intentional scroll
                // This prevents interfering with the smooth scroll animation
                if (now - lastScrollTimeRef.current > 1000) {
                  window.scrollTo({
                    top: expectedPosition,
                    behavior: 'auto'
                  });
                  lastScrollTimeRef.current = now;
                }
              }
            } else {
              // Clear guard after 4 seconds
              if (scrollGuardIntervalRef.current) {
                clearInterval(scrollGuardIntervalRef.current);
                scrollGuardIntervalRef.current = null;
              }
              scrollBlockedRef.current = false;
              targetScrollPositionRef.current = null;
            }
          }, 200); // Check every 200ms
        }
      };
      
      // Wait for page to render and content to load
      // If pathname changed, wait longer for images and content to load
      const delay = pathnameChanged ? 600 : 100;
      
      scrollTimeoutRef.current = setTimeout(() => {
        // Wait for images to load
        const images = document.querySelectorAll('img');
        let imagesLoaded = 0;
        const totalImages = images.length;
        
        if (totalImages === 0) {
          // No images, scroll immediately
          requestAnimationFrame(() => {
            requestAnimationFrame(performScroll);
          });
        } else {
          // Wait for images to load or timeout after 2 seconds
          const imageLoadTimeout = setTimeout(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(performScroll);
            });
          }, 2000);
          
          images.forEach((img) => {
            if (img.complete) {
              imagesLoaded++;
              if (imagesLoaded === totalImages) {
                clearTimeout(imageLoadTimeout);
                requestAnimationFrame(() => {
                  requestAnimationFrame(performScroll);
                });
              }
            } else {
              img.addEventListener('load', () => {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                  clearTimeout(imageLoadTimeout);
                  requestAnimationFrame(() => {
                    requestAnimationFrame(performScroll);
                  });
                }
              }, { once: true });
              
              img.addEventListener('error', () => {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                  clearTimeout(imageLoadTimeout);
                  requestAnimationFrame(() => {
                    requestAnimationFrame(performScroll);
                  });
                }
              }, { once: true });
            }
          });
        }
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
      if (scrollGuardIntervalRef.current) {
        clearInterval(scrollGuardIntervalRef.current);
      }
    };
  }, [pathname, hash]);

  return null;
}

