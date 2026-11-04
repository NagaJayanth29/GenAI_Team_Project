'use client';

import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { ComplaintItem, ComplaintCategory, ComplaintPriority, ComplaintStatus } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';

const STATUS_CONFIG: Record<ComplaintStatus, { variant: BadgeVariant; icon: React.ElementType; label: string; color: string }> = {
  Submitted: { variant: 'warning', icon: Clock, label: 'Submitted', color: 'text-kare-yellow' },
  'Under Review': { variant: 'info', icon: Clock, label: 'Under Review', color: 'text-kare-blue' },
  'In Progress': { variant: 'primary', icon: Wrench, label: 'In Progress', color: 'text-kare-blue' },
  Resolved: { variant: 'success', icon: CheckCircle2, label: 'Resolved', color: 'text-kare-green' },
  Rejected: { variant: 'error', icon: XCircle, label: 'Rejected', color: 'text-kare-red' },
};

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral' | 'violet';

export default function ComplaintsPage() {
  const { currentUser } = useApp();
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successItem, setSuccessItem] = useState<ComplaintItem | null>(null);

  const [category, setCategory] = useState<ComplaintCategory>('Plumbing');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roomNumber, setRoomNumber] = useState(currentUser?.room_number || '');
  const [blockName, setBlockName] = useState(currentUser?.block_name || '');

  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState<ComplaintItem | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.room_number) setRoomNumber(currentUser.room_number);
    if (currentUser?.block_name) setBlockName(currentUser.block_name);
    loadComplaints();
  }, [currentUser]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getComplaints();
      setComplaints(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve complaints.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 5) {
      setError('Issue title must be at least 5 characters long.');
      return;
    }
    if (description.trim().length < 15) {
      setError('Please provide a description of at least 15 characters to assist maintenance technicians.');
      return;
    }
    if (!roomNumber.trim()) {
      setError('Room number is required.');
      return;
    }
    if (!blockName.trim()) {
      setError('Hostel block name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessItem(null);

      const created = await api.submitComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        room_number: roomNumber.trim(),
        block_name: blockName.trim(),
        student_name: currentUser?.full_name || 'Student Resident',
      });

      setSuccessItem(created);
      setTitle('');
      setDescription('');
      setShowForm(false);
      loadComplaints();
    } catch (err: any) {
      setError(err.message || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode.trim()) return;
    try {
      setLookupError(null);
      setLookupResult(null);
      const item = complaints.find(
        (c) => c.tracking_id.toLowerCase() === lookupCode.trim().toLowerCase()
      );
      if (item) {
        setLookupResult(item);
      } else {
        setLookupError(`No record found for tracking ID "${lookupCode.trim().toUpperCase()}".`);
      }
    } catch (err: any) {
      setError(err.message || 'Lookup failed.');
    }
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1.5">
        <Icon className="h-3 w-3" />
        <span className={config.color}>{config.label}</span>
      </Badge>
    );
  };

  const getPriorityColor = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'Urgent':
        return 'text-kare-red font-semibold';
      case 'High':
        return 'text-kare-orange font-semibold';
      case 'Medium':
        return 'text-kare-yellow font-semibold';
      default:
        return 'text-kare-green font-semibold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="rounded-xl border border-border bg-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col lg:flex-shrink-0">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-kare-red" />
            <h1 className="text-base font-semibold tracking-tight text-charcoal">
              📝 Hostel Maintenance & Grievance Desk
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Submit, track, and monitor residential repair work orders with verified audit IDs.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0 lg:ml-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-medium text-white hover:bg-primary-hover transition-smooth"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>{showForm ? 'Cancel Submission' : 'Log New Complaint'}</span>
          </button>
        </div>
      </div>

      {/* Backend Confirmed Submission Alert */}
      {successItem && (
        <div className="rounded-xl border border-status-success/40 bg-status-successBg p-4 text-xs">
          <div className="flex items-center space-x-2 font-semibold text-status-success">
            <CheckCircle2 className="h-4 w-4" />
            <span>Complaint Successfully Confirmed by Database</span>
          </div>
          <div className="mt-2 text-charcoal">
            Your tracking ID is{' '}
            <strong className="font-mono text-sm text-kare-indigo">
              {successItem.tracking_id}
            </strong>
            . Use this code anytime to check work order progress or communicate with estate supervisors.
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-status-error/30 bg-status-errorBg p-4 text-xs text-status-error">
          <div className="font-semibold">Notice</div>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Complaint Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-white p-6 space-y-5 shadow-card"
        >
          <div className="border-b border-border pb-3 text-[10px] font-semibold uppercase tracking-wider text-charcoal">
            New Grievance Work Order
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground">
                Grievance Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-charcoal focus:border-primary focus:outline-none"
              >
                <option value="Plumbing">🚰 Plumbing (Taps, Drainage, Flush)</option>
                <option value="Electrical">⚡ Electrical (Fans, Switches, Regulators)</option>
                <option value="Carpentry">🪑 Carpentry (Bed, Desk, Cupboard Lock)</option>
                <option value="Cleanliness">🧹 Cleanliness (Corridor, Washroom Sanitation)</option>
                <option value="Mess">🍽️ Mess (Dining Hall Quality, Food Service)</option>
                <option value="Internet">📶 Internet (LAN Port, Wi-Fi Coverage)</option>
                <option value="Other">🔧 Other / General Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-muted-foreground">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-charcoal focus:border-primary focus:outline-none"
              >
                <option value="Low">🟢 Low (General routine maintenance)</option>
                <option value="Medium">🟡 Medium (Affecting daily convenience)</option>
                <option value="High">🟠 High (Immediate attention needed)</option>
                <option value="Urgent">🔴 Urgent (Safety hazard, sparking, flooding)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-medium text-muted-foreground">
                Room Number
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-charcoal focus:border-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-medium text-muted-foreground">
                Hostel Block Name
              </label>
              <input
                type="text"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-charcoal focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-medium text-muted-foreground">
              Issue Title (Concise Subject)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Washroom faucet dripping continuously"
              required
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-charcoal focus:border-primary focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-medium text-muted-foreground">
              Detailed Description & Location Specifications
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details to assist maintenance technicians in diagnosing the issue..."
              required
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-charcoal focus:border-primary focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end space-x-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-border bg-white px-4 py-2 text-xs font-medium text-charcoal hover:bg-divider transition-smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-50 transition-smooth"
            >
              {submitting ? 'Verifying with DB...' : 'Submit & Generate Tracking ID'}
            </button>
          </div>
        </form>
      )}

      {/* Quick Tracking Code Lookup Box */}
      <div className="rounded-xl border border-border bg-white p-5">
        <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-medium text-muted-foreground">
              Quick Tracking ID Verification:
            </div>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                placeholder="Enter tracking code (e.g. CMP-2026-0041)..."
                className="w-full rounded-xl border border-border bg-white py-1.5 pl-9 pr-3 text-xs text-charcoal focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-xl border border-border bg-white px-4 py-1.5 text-xs font-medium text-charcoal hover:bg-divider sm:self-end transition-smooth"
          >
            Verify Status
          </button>
        </form>

        {lookupError && (
          <div className="mt-2 text-xs text-kare-red">{lookupError}</div>
        )}

        {lookupResult && (
          <div className="mt-3 rounded-xl border border-border bg-white/60 p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold text-charcoal">
                {lookupResult.tracking_id}
              </span>
              <div>{getStatusBadge(lookupResult.status)}</div>
            </div>
            <div className="font-medium text-charcoal">{lookupResult.title}</div>
            <div className="text-[10px] text-muted-foreground">{lookupResult.description}</div>
            {lookupResult.admin_notes && (
              <div className="mt-2 border-t border-border pt-1.5 text-[10px]">
                <strong className="text-kare-indigo font-semibold">Admin Remarks:</strong>{' '}
                <span className="text-charcoal">{lookupResult.admin_notes}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Complaints Table */}
      <div className="rounded-xl border border-border bg-white">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal">
            Logged Complaints ({complaints.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-white/50 text-[10px] font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Tracking ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Title & Location</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Resolution Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {complaints.length > 0 ? (
                complaints.map((item) => (
                  <tr key={item.id} className="hover:bg-white/30 align-top">
                    <td className="px-4 py-3 font-mono font-medium text-charcoal whitespace-nowrap">
                      {item.tracking_id}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-[10px]">
                      {item.created_at.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-charcoal">{item.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {item.room_number}, {item.block_name}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={getPriorityColor(item.priority)}>{item.priority}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-4 py-3 text-[10px] text-charcoal max-w-[240px]">
                      {item.admin_notes || (
                        <span className="text-muted-foreground italic">Pending review</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6">
                    <EmptyState
                      icon={Wrench}
                      title="No complaints currently logged"
                      description="You have no active maintenance tickets or repair grievances registered under this student profile."
                      actionLabel="Log New Complaint"
                      onAction={() => setShowForm(true)}
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

