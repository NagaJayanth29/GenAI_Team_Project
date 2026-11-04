'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, User, Search, Bell, Pin, Shield } from 'lucide-react';
import { api } from '@/lib/api';
import { AnnouncementItem } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';

const PRIORITY_STYLES: Record<string, { badge: string; border: string }> = {
  Urgent: { badge: 'border-status-error/30 bg-status-errorBg text-status-error', border: 'border-kare-red/50' },
  High: { badge: 'border-kare-orange/30 bg-status-warningBg text-kare-orange', border: 'border-kare-orange/30' },
  Normal: { badge: 'border-status-info/30 bg-status-infoBg text-status-info', border: 'border-kare-blue/30' },
};

const CATEGORY_STYLES: Record<string, string> = {
  Urgent: 'border-kare-red/30 bg-status-errorBg text-kare-red',
  Maintenance: 'border-kare-orange/30 bg-status-warningBg text-kare-orange',
  Mess: 'border-kare-yellow/30 bg-kare-yellow/20 text-kare-yellow',
  General: 'border-kare-indigo/30 bg-primary-light text-primary',
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['All', 'General', 'Mess', 'Maintenance', 'Urgent'];

  useEffect(() => {
    loadAnnouncements();
  }, [selectedCategory]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAnnouncements(selectedCategory);
      setAnnouncements(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch announcements.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = announcements.filter((item) => {
    if (!searchQuery) return true;
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-border bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-kare-blue" />
            <h1 className="text-base font-semibold tracking-tight text-charcoal">
              📢 Official Circulars & Announcements
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Authoritative institutional circulars issued by the Council of Wardens, Estate Office, and Mess Council.
          </p>
        </div>
        <div className="flex gap-2 sm:ml-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-smooth ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-glow'
                  : 'border border-border bg-white text-charcoal hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-96">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search circulars..."
          className="w-full rounded-xl border border-border bg-white py-2 pl-9 pr-3 text-xs text-charcoal placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-status-error/30 bg-status-errorBg p-4 text-xs text-status-error">
          <div className="font-semibold">Notice Retrieval Error</div>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const priorityStyle = PRIORITY_STYLES[item.priority];
            const categoryStyle = CATEGORY_STYLES[item.category];
            return (
              <article
                key={item.id}
                className={`rounded-xl border p-5 transition-smooth ${
                  item.is_pinned
                    ? 'border-kare-yellow/40 bg-status-warningBg/30'
                    : priorityStyle.border + ' hover:border-primary/40 bg-white'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center space-x-2">
                    {item.is_pinned && (
                      <span className="inline-flex items-center rounded border border-kare-yellow/40 bg-status-warningBg px-2 py-0.5 text-[9px] font-semibold text-kare-yellow uppercase">
                        <Pin className="h-3 w-3" />
                        Pinned Notice
                      </span>
                    )}
                    <span className={`rounded border px-2 py-0.5 text-[9px] font-semibold ${categoryStyle}`}>
                      {item.category}
                    </span>
                    {item.priority === 'Urgent' && (
                      <span className="inline-flex items-center rounded border border-status-error/30 bg-status-errorBg px-2 py-0.5 text-[9px] font-semibold text-status-error uppercase">
                        <Shield className="h-3 w-3" />
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{item.created_at.slice(0, 10)}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <h2 className="text-sm font-semibold text-charcoal">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[10px] text-muted-foreground">
                  <div className="flex items-center space-x-1.5">
                    <User className="h-3.5 w-3.5 text-kare-blue" />
                    <span className="font-medium text-charcoal">{item.author_name}</span>
                  </div>
                  <div>
                    <Badge variant="info" className="text-[9px]">
                      Target: {item.target_audience}
                    </Badge>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <EmptyState
            icon={Bell}
            title={loading ? 'Retrieving circulars...' : 'No circulars found'}
            description={
              loading
                ? 'Connecting to institutional notices database...'
                : 'There are currently no circulars matching the selected category or search filter.'
            }
            accent="blue"
          />
        )}
      </div>
    </div>
  );
}

