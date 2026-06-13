import type { Home, Staff } from "@/lib/types";

export const homes: Home[] = [
  {
    id: "h1",
    name: "Sunrise House",
    city: "Orlando, FL",
    address: "1428 Marigold Lane, Orlando, FL 32801",
    capacity: 6,
    licenseNo: "FL-APD-118204",
  },
  {
    id: "h2",
    name: "Lakeside Home",
    city: "Winter Park, FL",
    address: "302 Cypress Bend Dr, Winter Park, FL 32789",
    capacity: 5,
    licenseNo: "FL-APD-118677",
  },
];

export const staff: Staff[] = [
  { id: "s1", name: "Grace Okafor", role: "Manager", homeId: "h1", onShift: true, medValidationExpiry: "2026-09-12", avatarColor: "#2E8B8B", hourlyRate: 28, pin: "1234" },
  { id: "s2", name: "Tasha Bell", role: "Caregiver", homeId: "h1", onShift: true, medValidationExpiry: "2026-07-01", avatarColor: "#E8924A", hourlyRate: 22, pin: "2468" },
  { id: "s3", name: "Daniel Cho", role: "Caregiver", homeId: "h1", onShift: false, medValidationExpiry: "2026-06-21", avatarColor: "#1F3A5F", hourlyRate: 22, pin: "1357" },
  { id: "s4", name: "Renata Silva", role: "Nurse", homeId: "h2", onShift: true, medValidationExpiry: "2026-11-30", avatarColor: "#2E8B5B", hourlyRate: 31, pin: "4321" },
  { id: "s5", name: "Marcus Webb", role: "Caregiver", homeId: "h2", onShift: true, medValidationExpiry: "2026-06-18", avatarColor: "#C9A227", hourlyRate: 21, pin: "8642" },
];

export const owner = { id: "owner1", name: "Patricia Adeyemi", role: "Owner" as const };

export function staffById(id?: string) {
  return staff.find((s) => s.id === id);
}
export function homeById(id: string) {
  return homes.find((h) => h.id === id)!;
}
