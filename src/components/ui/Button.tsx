import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const variantMap: Record<Variant, string> = {
  primary:
    'bg-accent hover:bg-accent-hover text-[#1a1a1a] font-semibold border-transparent',
  secondary:
    'bg-transparent hover:bg-bg-elevated text-text-primary border-border hover:border-border-hover',
  danger:
    'bg-error hover:bg-[#ff5575] text-white font-semibold border-transparent',
  ghost:
    'bg-transparent hover:bg-bg-elevated text-text-secondary border-transparent',
};

const sizeMap: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        border rounded-md font-medium
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantMap[variant]}
        ${sizeMap[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
