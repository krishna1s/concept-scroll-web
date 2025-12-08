import React from 'react';
import logoImage from 'figma:asset/808e1b4f0389778ae7e85bff7f0771dc28481d90.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <img 
      src={logoImage} 
      alt="ConceptScroll Logo" 
      className={`object-contain ${sizeClasses[size]} ${className}`}
    />
  );
}
