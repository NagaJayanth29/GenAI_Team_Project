'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  X,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { ComplaintItem, ComplaintStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminComplaintsPage() {
  const { currentRole, currentUser } = useApp();
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Update modal state
  const [editingComplaint, setEditingComplaint] = useState<ComplaintItem | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadComplaints();
  }, [statusFilter, categoryFilter, currentUser]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getComplaints(statusFilter, categoryFilter);
      setComplaints(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (item: ComplaintItem) => {
    setEditingComplaint(item);
    setNewStatus(item.status);
    setAdminNotes(item.admin_notes || '');
    setUpdateSuccess(null);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComplaint) return;

    try {
      setUpdating(true);
      setError(null);

      const updated = await api.updateComplaintStatus(
        editingComplaint.id,
        newStatus,
        adminNotes.trim() || undefined
      );

      setUpdateSuccess(`Tracking ID ${updated.tracking_id} updated to status "${updated.status}".`);
      setEditingComplaint(null);
      loadComplaints();
    } catch (err: any) {
      setError(err.message || 'Failed to update complaint.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':   return <Badge variant="success">Resolved</Badge>;
      case 'In Progress': return <Badge variant="primary">In Progress</Badge>;
      case 'Under Review': return <Badge variant="info">Under Review</Badge>;
      case 'Rejected':   return <Badge variant="error">Rejected</Badge>;
      default:           return <Badge variant="warning">Submitted</Badge>;
    }
  };

  const filtered = complaints.filter((c) => {
    if (!searchTerm) return true;
    return (
      c.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.room_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-border pb-4">
        <h1 className="text-lg font-semibold tracking-tight text-charcoal">
          Complaint Triage & Resolution Desk
        </h1>
        <p className="mt-0.5 text-xs text-charcoal-muted">
          Review student repair work orders, assign technicians, update lifecycle statuses, and document official resolution remarks.
        </p>
      </div>

      {updateSuccess && (
        <div className="rounded-md border border-status-success/40 bg-status-successBg p-4 text-xs text-status-success flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{updateSuccess}</span>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-status-error/30 bg-status-errorBg p-4 text-xs text-status-error">
          <div className="font-semibold">Notice</div>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col justify-between gap-3 rounded-md border border-border bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-charcoal-muted">
              Filter Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-0.5 rounded border border-border bg-white px-2.5 py-1 text-xs text-charcoal focus:border-primary focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted (New)</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-charcoal-muted">
              Filter Category:
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="mt-0.5 rounded border border-border bg-white px-2.5 py-1 text-xs text-charcoal focus:border-primary focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Mess">Mess</option>
              <option value="Internet">Internet</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-charcoal-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracking ID, student, room..."
            className="w-full rounded border border-border bg-white py-1.5 pl-9 pr-3 text-xs text-charcoal focus:border-primary focus:outline-none sm:w-64"
          />
        </div>
      </div>

      {/* Complaints Table */}
      <div className="rounded-md border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal">
            Active Residential Complaints ({filtered.length})
          </h2>
          <button onClick={loadComplaints} className="text-xs text-charcoal-muted hover:text-charcoal">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-white/50 text-[11px] font-semibold uppercase text-charcoal-muted">
              <tr>
                <th className="px-5 py-3">Tracking ID</th>
                <th className="px-5 py-3">Student & Location</th>
                <th className="px-5 py-3">Issue Category</th>
                <th className="px-5 py-3">Subject & Details</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Admin Remarks</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/30 align-top">
                    <td className="px-5 py-3 font-mono font-medium text-charcoal whitespace-nowrap">
                      {item.tracking_id}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-charcoal">{item.student_name}</div>
                      <div className="text-[11px] text-charcoal-muted">
                        {item.room_number}, {item.block_name}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-charcoal-muted whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="px-5 py-3 max-w-[240px]">
                      <div className="font-medium text-charcoal">{item.title}</div>
                      <div className="text-[11px] text-charcoal-muted line-clamp-2">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="font-medium text-charcoal">{item.priority}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-5 py-3 text-[11px] text-charcoal max-w-[200px]">
                      {item.admin_notes || (
                        <span className="text-charcoal-muted italic">No remarks recorded</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="rounded border border-border bg-white px-2.5 py-1 text-[11px] font-medium text-charcoal hover:bg-divider"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10">
                    <EmptyState
                      icon={Wrench}
                      title="No complaints found"
                      description="No complaints match the current filters. Try clearing the status or category filter."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4">
          <div className="w-full max-w-md rounded-md border border-border bg-white p-6 shadow-panel space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-semibold text-charcoal">
                  Update Complaint Status
                </h3>
                <p className="text-[11px] font-mono text-primary font-medium">
                  {editingComplaint.tracking_id} — {editingComplaint.category}
                </p>
              </div>
              <button
                onClick={() => setEditingComplaint(null)}
                className="text-charcoal-muted hover:text-charcoal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-charcoal bg-white p-3 rounded border border-border">
              <div className="font-semibold text-charcoal">{editingComplaint.title}</div>
              <div className="text-[11px] text-charcoal-muted mt-0.5">
                Reported by {editingComplaint.student_name} ({editingComplaint.room_number})
              </div>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-charcoal-muted">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="mt-1 w-full rounded border border-border bg-white px-3 py-2 text-xs text-charcoal focus:border-primary focus:outline-none"
                >
                  <option value="Submitted">Submitted (New / Unreviewed)</option>
                  <option value="Under Review">Under Review (Assessing requirements)</option>
                  <option value="In Progress">In Progress (Technician deployed)</option>
                  <option value="Resolved">Resolved (Work verified completed)</option>
                  <option value="Rejected">Rejected (Out of scope / invalid)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-charcoal-muted">
                  Official Administrative Remarks & Technician Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Document assigned staff name, parts replaced, or justification..."
                  className="mt-1 w-full rounded border border-border bg-white px-3 py-2 text-xs text-charcoal focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingComplaint(null)}
                  className="rounded border border-border bg-white px-3 py-1.5 text-xs text-charcoal hover:bg-divider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded bg-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Confirm Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

