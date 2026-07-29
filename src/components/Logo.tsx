import { Link } from 'react-router-dom';
import logoImage from '@/assets/shikshaq-logo.svg';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  desktopSize?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showText = false, size = 'md', desktopSize }: LogoProps) {
  // SVG is 252x92, so aspect ratio is ~2.74:1 (wider than tall)
  // NOTE: every class below is a complete literal string so Tailwind's JIT
  // scanner can see it. Never build these with template interpolation.
  const sizeClasses = {
    sm: 'h-7 w-auto', // ~28px height, auto width to maintain aspect
    md: 'h-12 w-auto', // ~48px height
    lg: 'h-16 w-auto', // ~64px height
  } as const;

  // Mobile size -> desktop (>=768px) size
  const responsiveClasses = {
    sm: {
      sm: 'h-7 w-auto md:h-7',
      md: 'h-7 w-auto md:h-12',
      lg: 'h-7 w-auto md:h-16',
    },
    md: {
      sm: 'h-12 w-auto md:h-7',
      md: 'h-12 w-auto md:h-12',
      lg: 'h-12 w-auto md:h-16',
    },
    lg: {
      sm: 'h-16 w-auto md:h-7',
      md: 'h-16 w-auto md:h-12',
      lg: 'h-16 w-auto md:h-16',
    },
  } as const;

  // If desktopSize is provided, use responsive classes
  const responsiveSizeClass = desktopSize
    ? responsiveClasses[size][desktopSize]
    : sizeClasses[size];

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoImage}
        alt="Shikshaq Logo"
        className={`${responsiveSizeClass} object-contain flex-shrink-0`}
      />
      {showText && (
        <span className="font-sans text-foreground leading-none">
          Shikshaq.in
        </span>
      )}
    </Link>
  );
}

