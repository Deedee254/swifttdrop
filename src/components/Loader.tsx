'use client';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Loader({ size = 'md', className = '' }: LoaderProps) {
  const sizeClass = size === 'sm' ? 'loader-sm' : size === 'lg' ? 'loader-lg' : '';
  
  return (
    <div className={`loader ${sizeClass} ${className}`} aria-label="Loading...">
      <span className="sr-only">Loading...</span>
    </div>
  );
}