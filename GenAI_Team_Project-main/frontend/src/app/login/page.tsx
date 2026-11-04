'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Shield,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RoleOption {
  value: 'student' | 'admin';
  label: string;
  icon: React.ElementType;
  emoji: string;
  color: string;
  description: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'student',
    label: 'Student Resident',
    icon: GraduationCap,
    emoji: '🎓',
    color: 'border-kare-indigo/30 bg-indigo/10 text-kare-indigo',
    description: 'Access mess menu, complaints, and policy assistant.',
  },
  {
    value: 'admin',
    label: 'Administrator',
    icon: Shield,
    emoji: '🛡️',
    color: 'border-kare-blue/30 bg-blue/10 text-kare-blue',
    description: 'Manage hostel operations, documents, and announcements.',
  },
];

const FLOATING_EMOJIS = [
  { emoji: '🏠', top: '10%', left: '5%', size: 'text-2xl', delay: '0s', duration: 'animate-float-slow' },
  { emoji: '🎓', top: '15%', right: '8%', size: 'text-xl', delay: '1s', duration: 'animate-float' },
  { emoji: '📚', top: '30%', left: '8%', size: 'text-lg', delay: '2s', duration: 'animate-float-slow' },
  { emoji: '🍽️', top: '55%', right: '10%', size: 'text-xl', delay: '0.5s', duration: 'animate-float' },
  { emoji: '🤖', top: '70%', left: '10%', size: 'text-2xl', delay: '1.5s', duration: 'animate-float-slow' },
  { emoji: '✨', top: '85%', right: '6%', size: 'text-lg', delay: '2.5s', duration: 'animate-float-fast' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoadingAuth, currentUser, currentRole } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated && currentUser) {
      if (currentRole === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    }
  }, [isAuthenticated, currentUser, currentRole, isLoadingAuth, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      setFieldErrors({});

      const user = await login(email.trim(), password, role);

      if (user.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1 flex items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Floating emojis - desktop background */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
          {FLOATING_EMOJIS.map((emo, idx) => (
            <span
              key={idx}
              className={`absolute ${emo.size} ${emo.duration} ${emo.delay} select-none`}
              style={{ top: emo.top, left: emo.left, right: emo.right }}
            >
              {emo.emoji}
            </span>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          {/* Desktop: Split-screen layout */}
          <div className="hidden lg:flex lg:h-[620px] lg:rounded-xl lg:border lg:border-border lg:bg-white lg:shadow-panel lg:overflow-hidden">
            {/* Brand Panel */}
            <div className="flex-1 p-10 flex flex-col justify-between relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kare-violet via-kare-teal to-kare-coral" />
              <div className="flex items-center space-x-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kare-indigo text-white shadow-lg">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-charcoal">
                    HostelIQ AI
                  </h1>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Smart Hostel & Residential Life Assistant
                  </p>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 leading-tight text-charcoal">
                Welcome to KARE Hostel Portal
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-8">
                Kalasalingam Academy of Research and Education &mdash; Your hostel life, made smarter.
              </p>
              <div className="mt-auto border-t border-border pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  University Hostels
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-charcoal">
                    <span className="text-kare-indigo">🏠</span>
                    <span>Nelson Mandela Men&rsquo;s Hostel (MH1)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-charcoal">
                    <span className="text-kare-indigo">🏠</span>
                    <span>Bhagat Singh Men&rsquo;s Hostel (MH2)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-charcoal">
                    <span className="text-kare-teal">🏠</span>
                    <span>Sarojini Naidu Ladies Hostel (LH1)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-charcoal">
                    <span className="text-kare-teal">🏠</span>
                    <span>Annai Teresa Ladies Hostel (LH2)</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Form Panel */}
            <div className="flex-1 bg-white p-10 flex flex-col justify-center border-l border-border">
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                role={role}
                setRole={setRole}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                error={error}
                fieldErrors={fieldErrors}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          {/* Mobile: Single column layout */}
          <div className="lg:hidden max-w-md w-full">
            <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
              {/* Floating emojis - mobile */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {FLOATING_EMOJIS.slice(0, 4).map((emo, idx) => (
                  <span
                    key={idx}
                    className={`absolute ${emo.size} ${emo.duration} ${emo.delay} select-none`}
                    style={{ top: emo.top, left: emo.left, right: emo.right }}
                  >
                    {emo.emoji}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kare-indigo text-white shadow-lg">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-charcoal">
                    HostelIQ AI
                  </h1>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Smart Hostel & Residential Life Assistant
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-4 text-charcoal text-center">
                KARE Hostel Portal
              </h2>
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                role={role}
                setRole={setRole}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                error={error}
                fieldErrors={fieldErrors}
                onSubmit={handleSubmit}
              />
              <div className="mt-8 flex items-center justify-center text-xs text-muted-foreground">
                <span className="flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-kare-green" />
                  <span>Demo session &mdash; clears on tab close</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-white py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            HostelIQ AI &mdash; Academic Demonstration Portal for Kalasalingam Academy of Research and Education
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Accepts any valid email and password (8+ characters). Not for production use.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface LoginFormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  role: 'student' | 'admin';
  setRole: (v: 'student' | 'admin') => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
}

function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  showPassword,
  setShowPassword,
  loading,
  error,
  fieldErrors,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 w-full max-w-md">
      <h2 className="text-lg font-semibold text-charcoal">
        Sign in to your account
      </h2>
      <p className="text-xs text-muted-foreground">
        Enter your email address and password to access the portal.
      </p>

      {error && (
        <div className="flex items-start space-x-3 rounded-xl border border-status-error/30 bg-status-errorBg p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-status-error" />
          <span className="text-xs text-status-error leading-relaxed">
            {error}
          </span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-charcoal mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -mt-2 h-4 w-4 text-muted-foreground" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@university.edu"
            className={`block w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-charcoal transition-smooth focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none ${
              fieldErrors.email ? 'border-status-error focus:ring-status-error' : 'border-border'
            }`}
          />
        </div>
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-status-error">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-charcoal">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -mt-2 h-4 w-4 text-muted-foreground" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`block w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-charcoal transition-smooth focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none ${
              fieldErrors.password ? 'border-status-error focus:ring-status-error' : 'border-border'
            }`}
          />
        </div>
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-status-error">{fieldErrors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-charcoal mb-2">
          I am accessing as
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ROLE_OPTIONS.map((option) => {
            const isSelected = role === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                className={`flex flex-col items-center space-x-1.5 rounded-xl border p-4 text-center transition-smooth ${
                  isSelected
                    ? option.color
                    : 'border-border bg-white text-charcoal hover:bg-divider hover:border-charcoal/40'
                }`}
              >
                <span className="text-xl">{option.emoji}</span>
                <option.icon className={`h-4 w-4 ${isSelected ? 'text-current' : 'text-muted-foreground'}`} />
                <div>
                  <span className="text-sm font-semibold text-charcoal">
                    {option.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`inline-flex w-full items-center justify-center space-x-2 rounded-xl py-3 px-4 text-sm font-medium transition-smooth disabled:opacity-60 disabled:cursor-not-allowed ${
          loading
            ? 'bg-charcoal text-white'
            : 'bg-primary text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

