import { useEffect, useRef, useState } from "react";

interface UseStaggerAnimationOptions {
  baseDelay?: number;
  staggerStep?: number;
  itemCount: number;
  triggerOnMount?: boolean;
}

interface UseStaggerAnimationReturn {
  ref: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
  getDelay: (index: number) => { animationDelay: string };
}

export function useStaggerAnimation({
  baseDelay = 100,
  staggerStep = 80,
  itemCount,
  triggerOnMount = false,
}: UseStaggerAnimationOptions): UseStaggerAnimationReturn {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(triggerOnMount);

  useEffect(() => {
    if (triggerOnMount) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [triggerOnMount]);

  const getDelay = (index: number): { animationDelay: string } => ({
    animationDelay: `${baseDelay + index * staggerStep}ms`,
  });

  // itemCount is accepted for external use (e.g. generating delay ranges) but
  // the hook doesn't need to iterate internally — callers use getDelay per item.
  void itemCount;

  return { ref, isVisible, getDelay };
}
