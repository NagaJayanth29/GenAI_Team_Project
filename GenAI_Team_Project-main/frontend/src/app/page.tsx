'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  FileText,
  UtensilsCrossed,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Building2,
  GraduationCap,
  Bot,
  Home,
  MapPin,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { OperationalOverview } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';

const FLOATING_EMOJIS_DASHBOARD = [
  { emoji: '🏠', top: '5%', left: '2%', size: 'text-xl', delay: '0s', duration: 'animate-float-slow' },
  { emoji: '📚', top: '10%', right: '3%', size: 'text-lg', delay: '1s', duration: 'animate-float' },
  { emoji: '🍽️', top: '20%', left: '3%', size: 'text-xl', delay: '0.5s', duration: 'animate-float' },
  { emoji: '🌿', top: '30%', right: '2%', size: 'text-lg', delay: '1.5s', duration: 'animate-float-slow' },
];

const HOSTELS = [
  { name: 'Nelson Mandela Men\'s Hostel', code: 'MH1', type: "Men's Hostel", color: 'text-kare-indigo', emoji: '🏠' },
  { name: 'Bhagat Singh Men\'s Hostel', code: 'MH2', type: "Men's Hostel", color: 'text-kare-indigo', emoji: '🏠' },
  { name: 'Dr. S. Radhakrishnan Men\'s Hostel', code: 'MH3', type: "Men's Hostel", color: 'text-kare-indigo', emoji: '🏠' },
  { name: 'Bharathi Men\'s Hostel', code: 'MH4', type: "Men's Hostel", color: 'text-kare-indigo', emoji: '🏠' },
  { name: 'Sarojini Naidu Ladies Hostel', code: 'LH1', type: "Ladies Hostel", color: 'text-kare-teal', emoji: '🏠' },
  { name: 'Annai Teresa Ladies Hostel', code: 'LH2', type: "Ladies Hostel", color: 'text-kare-teal', emoji: '🏠' },
  { name: 'Indira Gandhi Ladies Hostel', code: 'LH3', type: "Ladies Hostel", color: 'text-kare-teal', emoji: '🏠' },
] as const;

const FACILITIES = [
  { name: 'Wi-Fi', icon: Search, color: 'text-kare-violet' },
  { name: 'Laundry & Housekeeping', icon: Bell, color: 'text-kare-indigo' },
  { name: 'RO Drinking Water', icon: MapPin, color: 'text-kare-teal' },
  { name: 'Hostel Libraries & TV Rooms', icon: FileText, color: 'text-kare-blue' },
  { name: 'Medical Assistance', icon: AlertCircle, color: 'text-kare-green' },
  { name: 'Student Help-desk Support', icon: GraduationCap, color: 'text-kare-indigo' },
  { name: 'CCTV Surveillance', icon: Home, color: 'text-kare-blue' },
  { name: 'Biometric Attendance', icon: GraduationCap, color: 'text-kare-violet' },
] as const;

const STAT_CARDS = [
  {
    label: 'Total Complaints',
    icon: AlertCircle,
    iconColor: 'text-kare-coral',
    badge: 'border-kare-coral/30 bg-status-errorBg text-kare-coral',
    valueKey: 'total_complaints',
    subtitle: 'Logged across residential blocks',
  },
  {
    label: 'Pending Triage',
    icon: Clock,
    iconColor: 'text-kare-orange',
    badge: 'border-kare-orange/30 bg-status-warningBg text-kare-orange',
    valueKey: 'pending_complaints',
    subtitle: 'Requires warden or maintenance review',
  },
  {
    label: 'Resolved Issues',
    icon: CheckCircle2,
    iconColor: 'text-kare-green',
    badge: 'border-kare-green/30 bg-status-successBg text-kare-green',
    valueKey: 'resolved_complaints',
    subtitle: 'Verified completed work orders',
  },
  {
    label: 'Indexed Documents',
    icon: FileText,
    iconColor: 'text-kare-indigo',
    badge: 'border-kare-indigo/30 bg-violetBg text-kare-indigo',
    valueKey: 'indexed_documents',
    subtitle: 'Vector chunks in knowledge base',
  },
] as const;

export default function OverviewPage() {
  const { currentUser, currentRole } = useApp();
  const [overview, setOverview] = useState<OperationalOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOverview();
      setOverview(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'In Progress':
        return <Badge variant="primary">In Progress</Badge>;
      case 'Under Review':
        return <Badge variant="info">Under Review</Badge>;
      case 'Rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="warning">Submitted</Badge>;
    }
  };

  const userName = currentUser?.full_name || 'Student Resident';
  const userLocation = currentUser?.room_number && currentUser?.block_name
    ? `${currentUser.room_number} \u2022 ${currentUser.block_name}`
    : 'University Residential Portal';

  return (
    <div className="space-y-6 relative">
      {/* Floating emojis - dashboard background */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-0 -mt-20">
        {FLOATING_EMOJIS_DASHBOARD.map((emo, idx) => (
          <span
            key={idx}
            className={`absolute ${emo.size} ${emo.duration} ${emo.delay} select-none opacity-80`}
            style={{ top: emo.top, left: emo.left, right: emo.right }}
          >
            {emo.emoji}
          </span>
        ))}
      </div>

      {/* University Header */}
      <div className="rounded-xl border border-border bg-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col lg:flex-shrink-0">
          <div className="flex items-center space-x-2.5 mb-1">
            <Building2 className="h-4 w-4 text-kare-indigo" />
            <h1 className="text-base font-semibold tracking-tight text-charcoal">
              HostelIQ AI &mdash; KARE
            </h1>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Kalasalingam Academy of Research and Education &mdash; Smart Hostel & Residential Life Assistant. Daily mess dining, verified policy intelligence, and grievance management.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0 lg:ml-4">
          <span className="inline-flex items-center rounded border border-primary/30 bg-primary-light px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
            {currentRole === 'admin' ? 'Administrator' : 'Student Resident'}
          </span>
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-divider transition-smooth disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Portal</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-status-error/30 bg-status-errorBg p-4 text-xs text-status-error">
          <div className="font-semibold">Backend Connection Notice</div>
          <p className="mt-0.5">{error}. Ensure the backend server is running at port 8000.</p>
        </div>
      )}

      {/* Operational Metric Tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-white p-5 hover:border-primary/40 transition-smooth"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {stat.label}
              </span>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-charcoal">
              {loading ? '\u2014' : (overview as any)[stat.valueKey] ?? 0}
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">
              {loading ? '\u2014' : stat.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Quick Access Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 🤖 HostelIQ AI Assistant — violet/indigo */}
        <Link
          href="/ask"
          className="group rounded-xl border border-border bg-white p-5 hover:border-kare-violet/40 transition-slow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violetBg text-kare-violet group-hover:bg-kare-violet group-hover:text-white transition-colors">
              <Bot className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-kare-violet transition-colors" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
            🤖 HostelIQ AI Assistant
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Ask about hostel policies, curfew timings, visitors, and more. Grounded in approved documents.
          </p>
          <div className="h-1 w-full rounded-full bg-divider overflow-hidden">
            <div className="h-full bg-gradient-to-r from-kare-violet to-kare-indigo w-2/3" />
          </div>
        </Link>

        {/* 🍽️ Mess Menu — orange/yellow */}
        <Link
          href="/mess-menu"
          className="group rounded-xl border border-border bg-white p-5 hover:border-kare-orange/40 transition-slow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-warningBg text-kare-orange group-hover:bg-kare-orange group-hover:text-white transition-colors">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-kare-orange transition-colors" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
            🍽️ Mess Menu
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            View today's dining schedule and the full 7-day meal roster.
          </p>
          <div className="h-1 w-full rounded-full bg-divider overflow-hidden">
            <div className="h-full bg-gradient-to-r from-kare-orange to-kare-yellow w-1/2" />
          </div>
        </Link>

        {/* 📢 Announcements — blue */}
        <Link
          href="/announcements"
          className="group rounded-xl border border-border bg-white p-5 hover:border-kare-blue/40 transition-slow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-infoBg text-kare-blue group-hover:bg-kare-blue group-hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-kare-blue transition-colors" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
            📢 Announcements
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Check official circulars, maintenance notices, and wardens' updates.
          </p>
          <div className="h-1 w-full rounded-full bg-divider overflow-hidden">
            <div className="h-full bg-gradient-to-r from-kare-blue to-kare-indigo w-3/5" />
          </div>
        </Link>

        {/* 📝 Complaints — pink/coral */}
        <Link
          href="/complaints"
          className="group rounded-xl border border-border bg-white p-5 hover:border-kare-coral/40 transition-slow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-errorBg text-kare-coral group-hover:bg-kare-coral group-hover:text-white transition-colors">
              <AlertCircle className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-kare-coral transition-colors" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
            📝 Complaints
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Submit maintenance grievances and track work orders with verified IDs.
          </p>
          <div className="h-1 w-full rounded-full bg-divider overflow-hidden">
            <div className="h-full bg-gradient-to-r from-kare-coral to-kare-orange w-4/5" />
          </div>
        </Link>

        {/* 🏠 Hostel Information — teal */}
        <Link
          href="/hostel-info"
          className="group rounded-xl border border-border bg-white p-5 hover:border-kare-teal/40 transition-slow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-tealBg text-kare-teal group-hover:bg-kare-teal group-hover:text-white transition-colors">
              <Home className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-kare-teal transition-colors" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
            🏠 Hostel Information
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            View KARE hostel names, blocks, and campus facilities.
          </p>
          <div className="h-1 w-full rounded-full bg-divider overflow-hidden">
            <div className="h-full bg-gradient-to-r from-kare-teal to-kare-green w-3/5" />
          </div>
        </Link>

        {/* 📚 Hostel Facilities — blue/violet */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violetBg text-kare-blue">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Facilities</span>
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
            📚 Hostel Facilities
          </h2>
          <div className="space-y-2 text-xs">
            <p className="text-muted-foreground leading-relaxed">
              Wi-Fi, laundry & housekeeping, RO drinking water, hostel libraries, TV rooms, medical assistance, student help-desk, CCTV surveillance, biometric attendance.
            </p>
          </div>
        </div>
      </div>

      {/* Hostel Names Cards */}
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="border-b border-border pb-3 mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal flex items-center space-x-2">
            <Home className="h-3.5 w-3.5 text-kare-teal" />
            KARE University Hostels
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {HOSTELS.map((h) => (
            <div
              key={h.code}
              className={`rounded-lg border p-3 text-center transition-smooth hover:border-${h.color.replace('text-', '')}/40 ${h.color}`}
            >
              <span className="text-lg block mb-1">{h.emoji}</span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-charcoal block">
                {h.code}
              </span>
              <span className="text-[9px] text-muted-foreground leading-tight">
                {h.name.split(' ').slice(0, 3).join(' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Tables: Recent Announcements & Recent Complaints */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Notices */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-kare-blue" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                Official Circulars
              </h2>
            </div>
            <Link
              href="/announcements"
              className="text-[10px] font-medium text-kare-blue hover:underline"
            >
              View All Notices \u2192
            </Link>
          </div>

          <div className="divide-y divide-border">
            {overview?.recent_announcements && overview.recent_announcements.length > 0 ? (
              overview.recent_announcements.slice(0, 3).map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-2">
                    {item.is_pinned && (
                      <span className="rounded bg-status-warningBg border border-kare-orange/30 px-1.5 py-0.2 text-[9px] font-semibold text-kare-orange uppercase">
                        Pinned
                      </span>
                    )}
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {item.category}
                    </span>
                    <span className="text-muted-foreground">\u2022</span>
                    <span className="text-[10px] text-muted-foreground">
                      {item.created_at.slice(0, 10)}
                    </span>
                  </div>
                  <h3 className="mt-1 text-xs font-semibold text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[10px] leading-normal text-muted-foreground line-clamp-2">
                    {item.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No active announcements published.
              </div>
            )}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-kare-coral" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                Active Maintenance Records
              </h2>
            </div>
            <Link
              href="/complaints"
              className="text-[10px] font-medium text-kare-coral hover:underline"
            >
              Submit / Track Complaints \u2192
            </Link>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] font-semibold uppercase text-muted-foreground">
                  <th className="pb-2">Tracking ID</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Title</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {overview?.recent_complaints && overview.recent_complaints.length > 0 ? (
                  overview.recent_complaints.slice(0, 4).map((c) => (
                    <tr key={c.id} className="hover:bg-white/40">
                      <td className="py-2.5 font-mono text-[10px] font-medium text-charcoal">
                        {c.tracking_id}
                      </td>
                      <td className="py-2.5 text-[10px] text-muted-foreground">
                        {c.category}
                      </td>
                      <td className="py-2.5 font-medium text-charcoal truncate max-w-[160px]">
                        {c.title}
                      </td>
                      <td className="py-2.5 text-right">
                        {getStatusBadge(c.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4">
                      <EmptyState
                        icon={AlertCircle}
                        title="No complaints logged"
                        description="There are currently no active maintenance work orders in the database."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

