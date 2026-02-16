import React, { useEffect, useRef, useState } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  animation: string;
  delay?: number;
  threshold?: number;
  as?: React.ElementType;
}

export function AnimateOnScroll({
  children,
  className,
  animation,
  delay = 0,
  threshold = 0.1,
  as: Tag = "div",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const style: React.CSSProperties = delay > 0 ? { animationDelay: `${delay}ms` } : {};

  return (
    <Tag
      ref={ref}
      className={[
        isVisible ? animation : "opacity-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={isVisible ? style : undefined}
    >
      {children}
    </Tag>
  );
}
