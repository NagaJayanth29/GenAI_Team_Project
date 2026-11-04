import React from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  variant?: ToastVariant;
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-status-success/40 bg-status-successBg text-status-success shadow-card',
  error: 'border-status-error/40 bg-status-errorBg text-status-error shadow-card',
  info: 'border-status-info/40 bg-status-infoBg text-status-info shadow-card',
  warning: 'border-status-warning/40 bg-status-warningBg text-status-warning shadow-card',
};

export function Toast({
  variant = 'info',
  title,
  message,
  onClose,
  className = '',
}: ToastProps) {
  return (
    <div
      className={`flex items-start space-x-3 rounded-xl border p-4 text-xs ${variantStyles[variant]} ${className}`}
    >
      <div className="mt-0.5 flex shrink-0">
        {variant === 'success' && <CheckCircle2 className="h-4 w-4" />}
        {variant === 'error' && <AlertCircle className="h-4 w-4" />}
        {variant === 'warning' && <AlertTriangle className="h-4 w-4" />}
        {variant === 'info' && <Info className="h-4 w-4" />}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        {message && <p className="mt-0.5 leading-relaxed">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 shrink-0 rounded p-1 text-current hover:bg-current/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

