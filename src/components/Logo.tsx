import { Link } from 'react-router-dom';
import logoImage from '@/assets/shikshaq-logo.svg';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showText = false, size = 'md' }: LogoProps) {
  // SVG is 252x92, so aspect ratio is ~2.74:1 (wider than tall)
  const sizeClasses = {
    sm: 'h-7 w-auto', // ~28px height, auto width to maintain aspect
    md: 'h-10 w-auto', // ~40px height
    lg: 'h-14 w-auto', // ~56px height
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoImage}
        alt="ShikshAQ Logo"
        className={`${sizeClasses[size]} object-contain flex-shrink-0`}
      />
      {showText && (
        <span className="font-serif text-foreground leading-none">
          ShikshAq.in
        </span>
      )}
    </Link>
  );
}

