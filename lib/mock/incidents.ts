import type { Incident } from "@/lib/types";

export const incidents: Incident[] = [
  {
    id: "i1",
    residentId: "r3",
    homeId: "h1",
    type: "Medical — Seizure",
    severity: "moderate",
    whatHappened: "Lena experienced a brief tonic-clonic seizure lasting approximately 45 seconds at 11:10 AM in the living room. She was seated in her wheelchair.",
    actionTaken: "Staff stayed with Lena, ensured airway clear and protected from injury, timed the event. Guardian and on-call nurse notified. No rescue medication required. Resting comfortably.",
    status: "open",
    reportedBy: "s1",
    time: "11:18",
  },
];
