'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { MessMenuItem } from '@/types';

export default function AdminMessEditorPage() {
  const { currentRole, currentUser } = useApp();
  const [weeklyMenu, setWeeklyMenu] = useState<MessMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Editor form state
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('09:30');
  const [items, setItems] = useState<string[]>(['']);
  const [isVeg, setIsVeg] = useState(true);
  const [hasEgg, setHasEgg] = useState(false);
  const [isJain, setIsJain] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMenu();
  }, [currentUser]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getWeeklyMenu();
      setWeeklyMenu(data);
      populateFormFor(selectedDay, selectedMeal, data);
    } catch (err: any) {
      setError(err.message || 'Failed to load menu schedule.');
    } finally {
      setLoading(false);
    }
  };

  const populateFormFor = (day: string, meal: string, list: MessMenuItem[]) => {
    const found = list.find((m) => m.day_of_week === day && m.meal_type === meal);
    if (found) {
      setStartTime(found.start_time);
      setEndTime(found.end_time);
      setItems(found.items.length > 0 ? found.items : ['']);
      setIsVeg(found.dietary_info.veg);
      setHasEgg(found.dietary_info.egg);
      setIsJain(found.dietary_info.jain);
    }
  };

  const handleSelectSlot = (day: string, meal: string) => {
    setSelectedDay(day);
    setSelectedMeal(meal);
    populateFormFor(day, meal, weeklyMenu);
  };

  const handleItemChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = val;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated.length > 0 ? updated : ['']);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanItems = items.map((i) => i.trim()).filter((i) => i.length > 0);
    if (cleanItems.length === 0) {
      setError('At least one meal item is required.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(null);

      await api.updateMenuItem({
        day_of_week: selectedDay,
        meal_type: selectedMeal,
        start_time: startTime,
        end_time: endTime,
        items: cleanItems,
        dietary_info: {
          veg: isVeg,
          egg: hasEgg,
          dairy: true,
          jain: isJain,
        },
      });

      setSaveSuccess(`Updated schedule for ${selectedDay} ${selectedMeal}.`);
      loadMenu();
    } catch (err: any) {
      setError(err.message || 'Failed to update meal slot.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-border pb-4">
        <h1 className="text-lg font-semibold tracking-tight text-charcoal">
          Mess Menu Schedule Editor
        </h1>
        <p className="mt-0.5 text-xs text-charcoal-muted">
          Authorize weekly dining schedules, serving hours, and dietary classifications.
        </p>
      </div>

      {saveSuccess && (
        <div className="rounded-md border border-status-success/40 bg-status-successBg p-4 text-xs text-status-success flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-status-error/30 bg-status-errorBg p-4 text-xs text-status-error">
          <div className="font-semibold">Notice</div>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Day & Meal Selector Grid */}
      <div className="rounded-md border border-border bg-white p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted mb-2">
          1. Select Day and Meal Slot to Edit
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => handleSelectSlot(d, selectedMeal)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedDay === d
                  ? 'bg-primary text-white'
                  : 'border border-border bg-white text-charcoal hover:bg-divider'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {meals.map((m) => (
            <button
              key={m}
              onClick={() => handleSelectSlot(selectedDay, m)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedMeal === m
                  ? 'border border-primary bg-primary-light text-primary font-semibold'
                  : 'border border-border bg-white text-charcoal hover:bg-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Form */}
      <form
        onSubmit={handleSave}
        className="rounded-md border border-border bg-white p-5 space-y-4 shadow-subtle"
      >
        <div className="border-b border-border pb-2 text-xs font-semibold uppercase tracking-wider text-charcoal">
          2. Edit Menu & Timings for {selectedDay} — {selectedMeal}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-charcoal-muted">
              Serving Start Time (24h format)
            </label>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="07:30"
              required
              className="mt-1 w-full rounded border border-border bg-white px-3 py-2 text-xs font-mono text-charcoal focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-charcoal-muted">
              Serving End Time (24h format)
            </label>
            <input
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="09:30"
              required
              className="mt-1 w-full rounded border border-border bg-white px-3 py-2 text-xs font-mono text-charcoal focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Menu Items List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-medium text-charcoal-muted">
              Food Items Offered:
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center space-x-1 text-xs text-primary font-medium hover:underline"
            >
              <Plus className="h-3 w-3" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(idx, e.target.value)}
                  placeholder={`Item ${idx + 1} (e.g. Rajma Masala, Steamed Rice...)`}
                  className="w-full rounded border border-border bg-white px-3 py-1.5 text-xs text-charcoal focus:border-primary focus:outline-none"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-charcoal-muted hover:text-status-error"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Flags */}
        <div className="border-t border-border pt-3">
          <div className="text-[11px] font-medium text-charcoal-muted mb-2">
            Dietary Availability Flags:
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-charcoal">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVeg}
                onChange={(e) => setIsVeg(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>Vegetarian Option Available</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasEgg}
                onChange={(e) => setHasEgg(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>Egg Option Available</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isJain}
                onChange={(e) => setIsJain(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>Jain Friendly (No Onion/Garlic)</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? 'Saving...' : `Save ${selectedDay} ${selectedMeal}`}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

