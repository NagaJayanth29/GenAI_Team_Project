import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  tinted?: boolean;
}

export function Card({
  children,
  className = '',
  padded = true,
  tinted = false,
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-white shadow-card ${padded ? 'p-5 sm:p-6' : ''} ${
        tinted ? 'bg-primary/5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex flex-col space-y-1.5 pb-3 border-b border-border ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-xs font-semibold uppercase tracking-wider text-charcoal ${className}`}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`text-xs text-muted-foreground ${className}`}>{children}</p>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`pt-3 ${className}`}>{children}</div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-4 border-t border-border pt-3 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

