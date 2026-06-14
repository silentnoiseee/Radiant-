"use client";

import { create } from "zustand";
import type { MedAdministration, MedStatus, Visit, Shift } from "@/lib/types";
import { seedAdministrations } from "@/lib/mock/meds";
import { supabase } from "@/lib/supabase/client";

// Medication administrations remain demo-only (seeded in memory). Visits and
// shifts are now backed by Supabase so they persist across refreshes and are
// shared by every visitor to the app.

function timeStr(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// --- Row mappers: Supabase row -> app type ---
type VisitRow = {
  id: string;
  visitor_name: string;
  visiting_resident_id: string;
  relationship: string;
  check_in: string;
  check_out: string | null;
  on_site: boolean;
};
function mapVisit(row: VisitRow): Visit {
  return {
    id: row.id,
    visitorName: row.visitor_name,
    visitingResidentId: row.visiting_resident_id,
    relationship: row.relationship,
    checkIn: timeStr(row.check_in),
    checkOut: row.check_out ? timeStr(row.check_out) : undefined,
    onSite: row.on_site,
  };
}

type ShiftRow = {
  id: string;
  staff_id: string;
  clock_in: string;
  clock_out: string | null;
};
function mapShift(row: ShiftRow): Shift {
  return {
    id: row.id,
    staffId: row.staff_id,
    clockIn: row.clock_in,
    clockOut: row.clock_out ?? undefined,
  };
}

interface DemoState {
  administrations: MedAdministration[];
  visits: Visit[];
  shifts: Shift[];
  visitsLoaded: boolean;
  shiftsLoaded: boolean;
  setMedStatus: (id: string, status: MedStatus, reason?: string) => void;
  loadVisits: () => Promise<void>;
  loadShifts: () => Promise<void>;
  addVisit: (v: Omit<Visit, "id" | "onSite">) => Promise<void>;
  checkOut: (id: string) => Promise<void>;
  clockIn: (staffId: string) => Promise<void>;
  clockOut: (staffId: string) => Promise<void>;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  administrations: seedAdministrations,
  visits: [],
  shifts: [],
  visitsLoaded: false,
  shiftsLoaded: false,

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

  loadVisits: async () => {
    const { data, error } = await supabase
      .from("visits")
      .select("*")
      .order("check_in", { ascending: true });
    if (error) {
      console.error("loadVisits", error);
      return;
    }
    set({ visits: (data as VisitRow[]).map(mapVisit), visitsLoaded: true });
  },

  loadShifts: async () => {
    const { data, error } = await supabase
      .from("shifts")
      .select("*")
      .order("clock_in", { ascending: true });
    if (error) {
      console.error("loadShifts", error);
      return;
    }
    set({ shifts: (data as ShiftRow[]).map(mapShift), shiftsLoaded: true });
  },

  addVisit: async (v) => {
    const { data, error } = await supabase
      .from("visits")
      .insert({
        visitor_name: v.visitorName,
        visiting_resident_id: v.visitingResidentId,
        relationship: v.relationship,
      })
      .select()
      .single();
    if (error || !data) {
      console.error("addVisit", error);
      return;
    }
    set((s) => ({ visits: [...s.visits, mapVisit(data as VisitRow)] }));
  },

  checkOut: async (id) => {
    const { data, error } = await supabase
      .from("visits")
      .update({ on_site: false, check_out: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error || !data) {
      console.error("checkOut", error);
      return;
    }
    const updated = mapVisit(data as VisitRow);
    set((s) => ({ visits: s.visits.map((vi) => (vi.id === id ? updated : vi)) }));
  },

  clockIn: async (staffId) => {
    if (get().shifts.some((sh) => sh.staffId === staffId && !sh.clockOut)) return;
    const { data, error } = await supabase
      .from("shifts")
      .insert({ staff_id: staffId })
      .select()
      .single();
    if (error || !data) {
      console.error("clockIn", error);
      return;
    }
    set((s) => ({ shifts: [...s.shifts, mapShift(data as ShiftRow)] }));
  },

  clockOut: async (staffId) => {
    const open = get().shifts.find((sh) => sh.staffId === staffId && !sh.clockOut);
    if (!open) return;
    const { data, error } = await supabase
      .from("shifts")
      .update({ clock_out: new Date().toISOString() })
      .eq("id", open.id)
      .select()
      .single();
    if (error || !data) {
      console.error("clockOut", error);
      return;
    }
    const updated = mapShift(data as ShiftRow);
    set((s) => ({ shifts: s.shifts.map((sh) => (sh.id === open.id ? updated : sh)) }));
  },
}));

// --- Derived helpers ---

/** Hours worked for a shift; if still open, measured up to now. */
export function shiftHours(shift: Shift, now: number = Date.now()) {
  const end = shift.clockOut ? new Date(shift.clockOut).getTime() : now;
  const ms = Math.max(0, end - new Date(shift.clockIn).getTime());
  return ms / 3600000;
}

export function formatDuration(hoursDecimal: number) {
  const totalMin = Math.round(hoursDecimal * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h + "h " + String(m).padStart(2, "0") + "m";
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
