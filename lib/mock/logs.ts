import type { DailyLog } from "@/lib/types";

export const dailyLogs: DailyLog[] = [
  { id: "l1", residentId: "r2", category: "meal", title: "Breakfast — ate well", note: "Finished oatmeal and fruit, drank full glass of water. Helped clear his plate.", staffId: "s2", time: "08:10" },
  { id: "l2", residentId: "r1", category: "activity", title: "Morning walk", note: "20-minute walk around the block. Bright mood, pointed out neighborhood cat.", staffId: "s2", time: "08:45" },
  { id: "l3", residentId: "r3", category: "behavior", title: "Reported aura", note: "Lena signed that she felt 'fuzzy' around 8:20. No seizure. Rescue protocol reviewed, monitoring closely.", staffId: "s1", time: "08:25" },
  { id: "l4", residentId: "r5", category: "activity", title: "Art session", note: "Painted with watercolors for 30 minutes. Used headphones, very calm and focused.", staffId: "s4", time: "10:15" },
  { id: "l5", residentId: "r4", category: "other", title: "Day program pickup", note: "Van arrived 9:05, Anthony used his breathing card before leaving. Smooth transition.", staffId: "s5", time: "09:05" },
];
