'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  FileCheck2,
  UtensilsCrossed,
  Bell,
  Clock,
  ArrowRight,
  RefreshCw,
  Shield,
  Building2,
  User,
  ScrollText,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { OperationalOverview } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';

const ADMIN_STAT_CARDS = [
  {
    label: 'Total Complaints',
    icon: AlertCircle,
    iconColor: 'text-kare-red',
    badge: 'border-kare-red/30 bg-status-errorBg text-kare-red',
    valueKey: 'total_complaints',
    subtitle: 'All submitted work orders',
  },
  {
    label: 'Unresolved / Triage',
    icon: Clock,
    iconColor: 'text-kare-orange',
    badge: 'border-kare-orange/30 bg-status-warningBg text-kare-orange',
    valueKey: 'pending_complaints',
    subtitle: 'Requires warden assignment',
  },
  {
    label: 'Approved Documents',
    icon: FileCheck2,
    iconColor: 'text-kare-indigo',
    badge: 'border-kare-indigo/30 bg-violetBg text-kare-indigo',
    valueKey: 'indexed_documents',
    subtitle: 'Vector chunks in knowledge base',
  },
  {
    label: 'Active Circulars',
    icon: Bell,
    iconColor: 'text-kare-blue',
    badge: 'border-kare-blue/30 bg-status-infoBg text-kare-blue',
    valueKey: 'active_announcements',
    subtitle: 'Published to residential portal',
  },
] as const;

const ADMIN_MODULES = [
  {
    href: '/admin/complaints',
    label: 'Complaint Triage Desk',
    icon: AlertCircle,
    emoji: '📝',
    color: 'border-kare-red/30 bg-kare-red/10 text-kare-red',
    desc: 'Update repair statuses, assign technicians, and record resolution remarks.',
  },
  {
    href: '/admin/documents',
    label: 'Document Ingestion',
    icon: FileCheck2,
    emoji: '📄',
    color: 'border-kare-indigo/30 bg-kare-indigo/10 text-kare-indigo',
    desc: 'Upload institutional policy PDFs, inspect chunk vectors, and manage index.',
  },
  {
    href: '/admin/mess-editor',
    label: 'Mess Schedule Matrix',
    icon: UtensilsCrossed,
    emoji: '🍽️',
    color: 'border-kare-orange/30 bg-kare-orange/10 text-kare-orange',
    desc: 'Modify weekly meal schedules, timings, and dietary flags.',
  },
  {
    href: '/admin/announcements',
    label: 'Publish Circulars',
    icon: Bell,
    emoji: '📢',
    color: 'border-kare-blue/30 bg-kare-blue/10 text-kare-blue',
    desc: 'Broadcast emergency alerts, maintenance schedules, and notices.',
  },
  {
    href: '/admin/logs',
    label: 'System & Audit Logs',
    icon: ScrollText,
    emoji: '📋',
    color: 'border-kare-violet/30 bg-kare-violet/10 text-kare-violet',
    desc: 'Review immutable audit and ingestion trail.',
  },
] as const;

export default function AdminOverviewPage() {
  const { currentRole, currentUser } = useApp();
  const [overview, setOverview] = useState<OperationalOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOverview();
      setOverview(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to administrative metrics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="rounded-xl border border-border bg-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col lg:flex-shrink-0">
          <div className="flex items-center space-x-2.5 mb-1">
            <Shield className="h-4 w-4 text-kare-indigo" />
            <span className="inline-flex items-center rounded border border-primary/30 bg-primary-light px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
              Role: Chief Warden / Administrator
            </span>
          </div>
          <h1 className="mt-1 text-base font-semibold tracking-tight text-charcoal">
            🏛️ KARE Administrative Control Center
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Institutional oversight for residential rules, mess schedule matrices, documents ingestion, and maintenance triage.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0 lg:ml-4">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-divider transition-smooth disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-status-error/30 bg-status-errorBg p-4 text-xs text-status-error">
          <div className="font-semibold">Administrative Access Error</div>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Real Metric Tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {ADMIN_STAT_CARDS.map((stat) => (
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

      {/* Quick Administration Modules */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ADMIN_MODULES.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="group rounded-xl border border-border bg-white p-5 hover:border-primary/40 transition-slow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${mod.color}`}>
                <span className="text-xl">{mod.emoji}</span>
                <mod.icon className={`h-5 w-5 ${mod.color.replace('bg-', 'text-').replace('/10', '')}`} />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h2 className="mt-1 text-xs font-semibold uppercase tracking-wider text-charcoal">
              {mod.label}
            </h2>
            <p className="mt-1.5 text-[10px] text-muted-foreground leading-relaxed">
              {mod.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Unresolved Complaints Triage Preview */}
      <div className="rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 mb-0">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-kare-orange" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal">
              Pending Grievances Requiring Action
            </h2>
          </div>
          <Link
            href="/admin/complaints"
            className="text-[10px] font-medium text-kare-red hover:underline"
          >
            Open Full Triage Desk \u2192
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-white/50 text-[10px] font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Tracking ID</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Room / Block</th>
                <th className="px-5 py-3">Issue Category</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {overview?.recent_complaints && overview.recent_complaints.filter((c) => c.status !== 'Resolved').length > 0 ? (
                overview.recent_complaints
                  .filter((c) => c.status !== 'Resolved')
                  .slice(0, 5)
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-white/40">
                      <td className="px-5 py-3 font-mono font-medium text-charcoal">
                        {c.tracking_id}
                      </td>
                      <td className="px-5 py-3 font-medium text-charcoal">
                        {c.student_name}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {c.room_number}, {c.block_name}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {c.category}
                      </td>
                      <td className="px-5 py-3 font-medium text-charcoal">
                        <span className={c.priority === 'Urgent' ? 'text-kare-red' : c.priority === 'High' ? 'text-kare-orange' : 'text-charcoal'}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded border border-kare-yellow/40 bg-status-warningBg px-2 py-0.5 text-[10px] font-medium text-kare-yellow">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={AlertCircle}
                      title="No pending complaints"
                      description="There are no unresolved complaints in the database queue."
                      accent="orange"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

