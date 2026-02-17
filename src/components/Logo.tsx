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
  const sizeClasses = {
    sm: 'h-7 w-auto', // ~28px height, auto width to maintain aspect
    md: 'h-12 w-auto', // ~48px height
    lg: 'h-16 w-auto', // ~64px height
  };

  // If desktopSize is provided, use responsive classes
  const responsiveSizeClass = desktopSize
    ? `${sizeClasses[size]} md:${sizeClasses[desktopSize]}`
    : sizeClasses[size];

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoImage}
        alt="ShikshAQ Logo"
        className={`${responsiveSizeClass} object-contain flex-shrink-0`}
      />
      {showText && (
        <span className="font-sans text-foreground leading-none">
          ShikshAq.in
        </span>
      )}
    </Link>
  );
}

