import type { Visit, Doc } from "@/lib/types";

export const visits: Visit[] = [
  { id: "v1", visitorName: "Eleanor Thompson", visitingResidentId: "r1", relationship: "Mother", checkIn: "10:02", onSite: true },
  { id: "v2", visitorName: "Dr. Alan Pierce", visitingResidentId: "r3", relationship: "Physician", checkIn: "09:15", checkOut: "09:55", onSite: false },
];

export const documents: Doc[] = [
  { id: "d1", residentId: "r1", name: "Care Plan 2026", type: "PDF", updated: "2026-05-30" },
  { id: "d2", residentId: "r1", name: "Diabetes Management Protocol", type: "PDF", updated: "2026-04-12" },
  { id: "d3", residentId: "r1", name: "Guardianship Letter", type: "PDF", updated: "2025-11-02" },
  { id: "d4", residentId: "r3", name: "Seizure Action Plan", type: "PDF", updated: "2026-06-01" },
];
