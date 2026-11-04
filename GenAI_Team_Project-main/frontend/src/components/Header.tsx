'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Shield, User, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Header() {
  const pathname = usePathname();
  const { currentRole, currentUser, logout, setMobileMenuOpen } = useApp();

  const getPageInfo = () => {
    switch (pathname) {
      case '/':
        return { title: 'Student Portal Dashboard', section: 'Student Services' };
      case '/ask':
        return { title: 'Ask HostelIQ — Policy Assistant', section: 'Policy Intelligence' };
      case '/mess-menu':
        return { title: 'Dining & Mess Schedule', section: 'Hostel Dining' };
      case '/announcements':
        return { title: 'Official Circulars & Notices', section: 'Notices & Broadcasts' };
      case '/complaints':
        return { title: 'Maintenance Grievances & Complaints', section: 'Grievance Desk' };
      case '/admin':
        return { title: 'Administrative Control Center', section: 'Hostel Administration' };
      case '/admin/documents':
        return { title: 'Approved Policy Documents & Ingestion', section: 'Document Management' };
      case '/admin/mess-editor':
        return { title: 'Weekly Mess Schedule Editor', section: 'Dining Management' };
      case '/admin/announcements':
        return { title: 'Publish Circulars & Notices', section: 'Announcements Desk' };
      case '/admin/complaints':
        return { title: 'Complaint Triage & Resolution', section: 'Maintenance Desk' };
      case '/admin/logs':
        return { title: 'System Logs & Ingestion Trail', section: 'System Auditing' };
      default:
        return { title: 'Residential Portal', section: 'Hostel Services' };
    }
  };

  const { title, section } = getPageInfo();

  const sectionColors: Record<string, string> = {
    'Student Services': 'text-kare-indigo',
    'Policy Intelligence': 'text-kare-violet',
    'Hostel Dining': 'text-kare-orange',
    'Notices & Broadcasts': 'text-kare-blue',
    'Grievance Desk': 'text-kare-red',
    'Hostel Administration': 'text-kare-indigo',
    'Document Management': 'text-kare-violet',
    'Dining Management': 'text-kare-orange',
    'Announcements Desk': 'text-kare-blue',
    'Maintenance Desk': 'text-kare-red',
    'System Auditing': 'text-kare-violet',
    'Hostel Services': 'text-muted-foreground',
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white px-4 md:px-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-xl border border-border p-1.5 text-muted-foreground hover:bg-white md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <div className="flex items-center space-x-1.5 text-[10px] font-medium">
            <span className={sectionColors[section] || 'text-muted-foreground'}>
              {section}
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-charcoal font-semibold">{title}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Role & User Badge */}
        {currentUser && (
          <div className="flex items-center space-x-2 rounded-xl border border-border bg-white px-2.5 py-1 text-[10px]">
            {currentRole === 'admin' ? (
              <>
                <Shield className="h-3.5 w-3.5 text-kare-indigo" />
                <span className="font-semibold text-kare-indigo uppercase tracking-wider">Admin</span>
              </>
            ) : (
              <>
                <User className="h-3.5 w-3.5 text-kare-blue" />
                <span className="font-semibold text-kare-blue uppercase tracking-wider">Student</span>
              </>
            )}
            <span className="hidden text-muted-foreground md:inline">|</span>
            <span className="hidden font-medium text-charcoal md:inline truncate max-w-xs">
              {currentUser.email}
            </span>
          </div>
        )}

        {/* Sign Out Button */}
        <button
          onClick={logout}
          title="Sign out of institutional terminal"
          className="inline-flex items-center space-x-1 rounded-xl border border-border bg-white px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-status-error/40 hover:bg-status-errorBg hover:text-status-error transition-smooth"
          aria-label="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}

