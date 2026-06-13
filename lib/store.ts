"use client";

import { create } from "zustand";
import type { MedAdministration, MedStatus, Visit, Shift } from "@/lib/types";
import { seedAdministrations } from "@/lib/mock/meds";
import { visits as seedVisits } from "@/lib/mock/visitors";

// Seed a few caregivers as already clocked in, relative to "now" so the
// elapsed time always looks sensible in the demo.
function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}
const seedShifts: Shift[] = [
  { id: "sh1", staffId: "s1", clockIn: hoursAgo(5.5) },
  { id: "sh2", staffId: "s2", clockIn: hoursAgo(5.25) },
  { id: "sh3", staffId: "s4", clockIn: hoursAgo(4) },
  { id: "sh4", staffId: "s5", clockIn: hoursAgo(6.25) },
];

interface DemoState {
  administrations: MedAdministration[];
  visits: Visit[];
  shifts: Shift[];
  setMedStatus: (id: string, status: MedStatus, reason?: string) => void;
  addVisit: (v: Omit<Visit, "id" | "onSite">) => void;
  checkOut: (id: string) => void;
  clockIn: (staffId: string) => void;
  clockOut: (staffId: string) => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  administrations: seedAdministrations,
  visits: seedVisits,
  shifts: seedShifts,
  setMedStatus: (id, status, reason) =>
    set((s) => ({
      administrations: s.administrations.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              reason,
              staffId: "s2",
              at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : a
      ),
    })),
  addVisit: (v) =>
    set((s) => ({
      visits: [...s.visits, { ...v, id: `v${s.visits.length + 1}`, onSite: true }],
    })),
  checkOut: (id) =>
    set((s) => ({
      visits: s.visits.map((v) =>
        v.id === id
          ? { ...v, onSite: false, checkOut: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
          : v
      ),
    })),
  clockIn: (staffId) =>
    set((s) => {
      // ignore if already clocked in
      if (s.shifts.some((sh) => sh.staffId === staffId && !sh.clockOut)) return s;
      return {
        shifts: [
          ...s.shifts,
          { id: `sh${s.shifts.length + 1}`, staffId, clockIn: new Date().toISOString() },
        ],
      };
    }),
  clockOut: (staffId) =>
    set((s) => ({
      shifts: s.shifts.map((sh) =>
        sh.staffId === staffId && !sh.clockOut
          ? { ...sh, clockOut: new Date().toISOString() }
          : sh
      ),
    })),
}));

// --- Derived helpers ---

/** Hours worked for a shift; if still open, measured up to `now`. */
export function shiftHours(shift: Shift, now: number = Date.now()) {
  const end = shift.clockOut ? new Date(shift.clockOut).getTime() : now;
  const ms = Math.max(0, end - new Date(shift.clockIn).getTime());
  return ms / 3600000;
}

export function formatDuration(hoursDecimal: number) {
  const totalMin = Math.round(hoursDecimal * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
