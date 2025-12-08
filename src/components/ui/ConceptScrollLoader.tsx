import React from 'react';

interface ConceptScrollLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConceptScrollLoader({ size = 'md', className = '' }: ConceptScrollLoaderProps) {
  // Size mappings
  const containerHeight = {
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-12'
  };

  const dotSize = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const gapSize = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  };

  return (
    <div className={`flex items-center justify-center ${containerHeight[size]} ${gapSize[size]} ${className}`} aria-label="Loading">
      <div className={`${dotSize[size]} rounded-full bg-purple-600 animate-bounce [animation-delay:-0.3s]`}></div>
      <div className={`${dotSize[size]} rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]`}></div>
      <div className={`${dotSize[size]} rounded-full bg-pink-500 animate-bounce [animation-delay:-0s]`}></div>
      <div className={`${dotSize[size]} rounded-full bg-orange-400 animate-bounce [animation-delay:-0.15s]`}></div>
    </div>
  );
}
