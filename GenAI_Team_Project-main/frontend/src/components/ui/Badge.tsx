import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'violet'
  | 'teal'
  | 'primary'
  | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'border-status-success/30 bg-status-successBg text-status-success',
  warning: 'border-status-warning/40 bg-status-warningBg text-status-warning',
  error: 'border-status-error/30 bg-status-errorBg text-status-error',
  info: 'border-status-info/30 bg-status-infoBg text-status-info',
  violet: 'border-kare-violet/30 bg-violetBg text-kare-violet',
  teal: 'border-status-teal/30 bg-status-tealBg text-status-teal',
  primary: 'border-primary/30 bg-primary-light text-primary',
  neutral: 'border-border bg-surface text-muted-foreground',
};

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium leading-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
