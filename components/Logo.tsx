import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  variant?: 'color' | 'white';
  animated?: boolean;
}

export function Logo({ className = '', size = 'md', variant = 'color', animated = false }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32'
  };

  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} ${className}`}
    >
      <defs>
        <linearGradient id="logo_gradient_main" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" /> {/* Indigo-500 */}
          <stop offset="50%" stopColor="#8B5CF6" /> {/* Violet-500 */}
          <stop offset="100%" stopColor="#EC4899" /> {/* Pink-500 */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 
        Concept: 
        1. "Infinite Scroll" Loop: A mobius-strip like shape formed by a page turning.
        2. "Book/Page": The basic geometry suggests a page being flipped or scrolled.
        3. "C" and "S": The shape vaguely forms a C (Concept) and S (Scroll).
        
        Drawing:
        Start top right, curve down left (page edge), loop bottom right, curve up left (back page).
      */}
      
      {/* The main continuous scroll line */}
      <path
        d="M23 7C23 7 18 5 13 8C8 11 5 16 5 21C5 25 9 27 12 27H24C26.2091 27 28 25.2091 28 23V12"
        stroke={variant === 'color' ? "url(#logo_gradient_main)" : "currentColor"}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? "animate-draw-path" : ""}
        style={animated ? { strokeDasharray: 100, strokeDashoffset: 100, animation: 'draw 1.5s ease-out forwards' } : {}}
      />

      {/* The internal page line (Creating the 'book' depth) */}
      <path
        d="M12 27C12 27 12 21 16 17C20 13 25 12 28 12"
        stroke={variant === 'color' ? "url(#logo_gradient_main)" : "currentColor"}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={variant === 'color' ? "0.8" : "0.8"}
        className={animated ? "animate-draw-path" : ""}
        style={animated ? { strokeDasharray: 100, strokeDashoffset: 100, animation: 'draw 1.5s ease-out 0.3s forwards' } : {}}
      />

      {/* Floating Spark/Star - Represents 'Concept' or 'Focus' point */}
      <circle 
        cx="23" 
        cy="9" 
        r="2" 
        fill={variant === 'color' ? "#FBBF24" : "currentColor"} 
        className={animated ? "animate-pop-in" : ""}
        style={animated ? { transformOrigin: '23px 9px', animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.5s forwards', opacity: 0, transform: 'scale(0)' } : {}}
      />
      
      {/* Small lines representing text/content on the page */}
      <path 
        d="M10 18H14" 
        stroke={variant === 'color' ? "currentColor" : "currentColor"} 
        className={`${variant === 'color' ? "text-indigo-300" : "text-white/50"} ${animated ? "opacity-0 animate-fade-in" : ""}`}
        strokeWidth="2" 
        strokeLinecap="round"
        style={animated ? { animation: 'fadeIn 0.5s ease-out 1.2s forwards' } : {}}
      />

      {animated && (
        <style>
          {`
            @keyframes draw {
              to {
                stroke-dashoffset: 0;
              }
            }
            @keyframes fadeIn {
              to {
                opacity: 1;
              }
            }
            @keyframes popIn {
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}
        </style>
      )}
    </svg>
  );
}
