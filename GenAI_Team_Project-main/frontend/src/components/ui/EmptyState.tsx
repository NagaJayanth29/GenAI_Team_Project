import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  accent?: 'violet' | 'blue' | 'orange' | 'green' | 'red' | 'neutral';
}

const accentStyles: Record<string, string> = {
  violet: 'border-vibgyor-violet/30 bg-violetBg text-vibgyor-violet',
  blue: 'border-status-info/30 bg-status-infoBg text-status-info',
  orange: 'border-status-warning/40 bg-status-warningBg text-status-warning',
  green: 'border-status-success/30 bg-status-successBg text-status-success',
  red: 'border-status-error/30 bg-status-errorBg text-status-error',
  neutral: 'border-border bg-white text-muted-foreground',
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  accent = 'neutral',
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-white p-8 text-center transition-smooth hover:border-primary/40 ${className}`}
    >
      <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl border bg-white ${accentStyles[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-xs font-semibold text-charcoal">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center space-x-1.5 rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-white hover:bg-primary-hover transition-colors"
          >
            <span>{actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}

