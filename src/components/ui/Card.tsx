import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export default function Card({ children, className = '', onClick, padding = 'md' }: CardProps) {
  const base =
    'bg-bg-card border border-border rounded-lg shadow-sm';
  const interactive = onClick
    ? 'cursor-pointer hover:border-border-hover transition-colors duration-150'
    : '';

  return (
    <div
      className={`${base} ${interactive} ${paddingMap[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
