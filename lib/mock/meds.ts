import type { Medication, MedAdministration } from "@/lib/types";

export const medications: Medication[] = [
  { id: "m1", residentId: "r1", name: "Metformin", dose: "500 mg", route: "Oral", schedule: ["08:00", "18:00"], reason: "Type 2 Diabetes" },
  { id: "m2", residentId: "r1", name: "Atorvastatin", dose: "20 mg", route: "Oral", schedule: ["20:00"], reason: "Cholesterol" },
  { id: "m3", residentId: "r2", name: "Levothyroxine", dose: "75 mcg", route: "Oral", schedule: ["07:30"], reason: "Hypothyroidism" },
  { id: "m4", residentId: "r3", name: "Levetiracetam", dose: "500 mg", route: "Oral", schedule: ["08:00", "20:00"], reason: "Epilepsy" },
  { id: "m5", residentId: "r3", name: "Baclofen", dose: "10 mg", route: "Oral", schedule: ["09:00", "13:00", "21:00"], reason: "Muscle spasticity" },
  { id: "m6", residentId: "r4", name: "Sertraline", dose: "50 mg", route: "Oral", schedule: ["09:00"], reason: "Anxiety" },
  { id: "m7", residentId: "r5", name: "Melatonin", dose: "3 mg", route: "Oral", schedule: ["21:00"], reason: "Sleep support" },
  { id: "m8", residentId: "r1", name: "Acetaminophen", dose: "500 mg", route: "Oral", schedule: [], reason: "PRN pain", prn: true },
];

// Seed today's administration records. Times before "now" assumed given/refused.
export const seedAdministrations: MedAdministration[] = [
  { id: "a1", medId: "m3", scheduledTime: "07:30", status: "given", staffId: "s2", at: "07:34" },
  { id: "a2", medId: "m1", scheduledTime: "08:00", status: "given", staffId: "s2", at: "08:05" },
  { id: "a3", medId: "m4", scheduledTime: "08:00", status: "due" },
  { id: "a4", medId: "m5", scheduledTime: "09:00", status: "due" },
  { id: "a5", medId: "m6", scheduledTime: "09:00", status: "due" },
  { id: "a6", medId: "m5", scheduledTime: "13:00", status: "upcoming" },
  { id: "a7", medId: "m1", scheduledTime: "18:00", status: "upcoming" },
  { id: "a8", medId: "m4", scheduledTime: "20:00", status: "upcoming" },
  { id: "a9", medId: "m2", scheduledTime: "20:00", status: "upcoming" },
  { id: "a10", medId: "m5", scheduledTime: "21:00", status: "upcoming" },
  { id: "a11", medId: "m7", scheduledTime: "21:00", status: "upcoming" },
];

export function medById(id: string) {
  return medications.find((m) => m.id === id)!;
}
