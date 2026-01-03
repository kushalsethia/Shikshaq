import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo_no_background.png';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        <img
          src={logoImage}
          alt="ShikshAq Logo"
          className="w-full h-full object-contain"
        />
      </div>
      {showText && (
        <span className={`font-serif ${textSizeClasses[size]} text-foreground leading-none`}>
          ShikshAq.in
        </span>
      )}
    </Link>
  );
}

