'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  LayoutDashboard,
  Search,
  UtensilsCrossed,
  Bell,
  AlertCircle,
  CalendarCheck2,
  FileCheck2,
  ScrollText,
  ShieldCheck,
  GraduationCap,
  LogOut,
  X,
  User,
  Shield,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const STUDENT_LINKS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard, color: 'text-kare-indigo' },
  { href: '/ask', label: 'Ask HostelIQ', icon: Search, color: 'text-kare-violet' },
  { href: '/mess-menu', label: 'Mess Menu', icon: UtensilsCrossed, color: 'text-kare-orange' },
  { href: '/announcements', label: 'Announcements', icon: Bell, color: 'text-kare-blue' },
  { href: '/complaints', label: 'My Complaints', icon: AlertCircle, color: 'text-kare-red' },
];

const ADMIN_LINKS = [
  { href: '/admin', label: 'Admin Overview', icon: ShieldCheck, color: 'text-kare-indigo' },
  { href: '/admin/documents', label: 'Approved Documents', icon: FileCheck2, color: 'text-kare-violet' },
  { href: '/admin/mess-editor', label: 'Mess Schedule Editor', icon: CalendarCheck2, color: 'text-kare-orange' },
  { href: '/admin/announcements', label: 'Publish Notices', icon: Bell, color: 'text-kare-blue' },
  { href: '/admin/complaints', label: 'Complaint Resolution', icon: AlertCircle, color: 'text-kare-red' },
  { href: '/admin/logs', label: 'System & Audit Logs', icon: ScrollText, color: 'text-kare-violet' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currentRole, currentUser, logout, mobileMenuOpen, setMobileMenuOpen } = useApp();

  const navLinks = currentRole === 'admin' ? ADMIN_LINKS : STUDENT_LINKS;
  const isStudent = currentRole === 'student';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-0 max-md:-translate-x-full'
        }`}
      >
        {/* Institutional Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-kare-violet to-kare-indigo text-white shadow-lg">
              <Building2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-charcoal">
                HostelIQ AI
              </div>
              <div className="text-[10px] font-medium text-muted-foreground">
                {isStudent ? 'Student Residential Portal' : 'Administrative Desk'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-md p-1 text-muted-foreground hover:bg-white md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Authenticated User Status Tag */}
        <div className="border-b border-border bg-white/40 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[10px] font-medium text-muted-foreground">
              {isStudent ? (
                <>
                  <GraduationCap className="h-3.5 w-3.5 text-kare-indigo" />
                  <span className="font-semibold text-charcoal uppercase tracking-wider">Student Portal</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-kare-indigo" />
                  <span className="font-semibold text-kare-indigo uppercase tracking-wider">Admin Console</span>
                </>
              )}
            </div>
            <span className="rounded border border-border bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              Active Term
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {isStudent ? 'Student Services' : 'Hostel Governance'}
          </div>

          {navLinks.map((item) => {
            const active = isActive(item.href);
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-smooth ${
                  active
                    ? `border border-primary/20 bg-primary/10 text-primary font-semibold ${item.color.replace('text-', 'bg-')}/10`
                    : 'text-muted-foreground hover:bg-white hover:text-charcoal'
                }`}
              >
                <IconComponent
                  className={`h-4 w-4 shrink-0 ${
                    active
                      ? `text-primary ${item.color}`
                      : 'text-muted-foreground group-hover:text-charcoal'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Authenticated Profile Footer */}
        {currentUser && (
          <div className="border-t border-border bg-white/40 p-3">
            <div className="rounded-xl border border-border bg-white p-2.5">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="truncate text-xs font-semibold text-charcoal">
                      {currentUser.full_name}
                    </span>
                    {currentRole === 'admin' ? (
                      <Shield className="h-3 w-3 text-kare-indigo" />
                    ) : (
                      <User className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="truncate text-[10px] text-muted-foreground">
                    {currentUser.room_number ? `${currentUser.room_number} \u2022 ${currentUser.block_name}` : currentUser.email}
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Sign out of institutional terminal"
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-status-errorBg hover:text-status-error hover:border-status-error/30 transition-smooth"
                  aria-label="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 text-center text-[9px] text-muted-foreground">
                HostelIQ \u2022 Academic Term 2026
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

