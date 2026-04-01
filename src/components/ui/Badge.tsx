import React from 'react';

type Variant = 'easy' | 'medium' | 'hard' | 'info' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const variantMap: Record<Variant, string> = {
  easy:    'bg-[rgba(44,187,93,0.15)]   text-success  border-[rgba(44,187,93,0.3)]',
  medium:  'bg-[rgba(255,192,30,0.15)]  text-warning  border-[rgba(255,192,30,0.3)]',
  hard:    'bg-[rgba(255,55,95,0.15)]   text-error    border-[rgba(255,55,95,0.3)]',
  info:    'bg-[rgba(59,130,246,0.15)]  text-info     border-[rgba(59,130,246,0.3)]',
  default: 'bg-bg-elevated              text-text-muted border-border',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5
        text-xs font-medium
        border rounded
        ${variantMap[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
