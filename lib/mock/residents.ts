import type { Resident } from "@/lib/types";

export const residents: Resident[] = [
  {
    id: "r1",
    name: "Marcus Thompson",
    homeId: "h1",
    room: "1A",
    dob: "1989-03-14",
    age: 37,
    photoColor: "#2E8B8B",
    diagnoses: ["Autism Spectrum Disorder", "Type 2 Diabetes"],
    allergies: ["Penicillin", "Peanuts"],
    guardian: { name: "Eleanor Thompson", relationship: "Mother", phone: "(407) 555-0142" },
    status: "appointment",
    statusNote: "Dental appointment at 2:30 PM",
    carePlan: {
      summary: "Marcus thrives on routine and clear visual schedules. Enjoys music and afternoon walks.",
      goals: [
        { title: "Independent morning routine", detail: "Complete grooming with visual prompts, minimal staff cueing." },
        { title: "Blood sugar stability", detail: "Pre-meal glucose checks; log readings in app." },
      ],
      dietary: "Diabetic, low-sugar. No peanuts.",
      mobility: "Independent",
      communication: "Verbal; prefers short, direct sentences.",
    },
  },
  {
    id: "r2",
    name: "David Ramirez",
    homeId: "h1",
    room: "2B",
    dob: "1995-08-02",
    age: 30,
    photoColor: "#E8924A",
    diagnoses: ["Down Syndrome", "Hypothyroidism"],
    allergies: ["Latex"],
    guardian: { name: "Sofia Ramirez", relationship: "Sister", phone: "(407) 555-0188" },
    status: "stable",
    statusNote: "Great morning — helped set the table",
    carePlan: {
      summary: "David is social and loves helping with household tasks. Responds well to praise.",
      goals: [
        { title: "Community outing skills", detail: "Practice ordering and paying at the cafe weekly." },
        { title: "Daily exercise", detail: "20-minute walk after lunch." },
      ],
      dietary: "Regular, heart-healthy.",
      mobility: "Independent",
      communication: "Verbal and expressive.",
    },
  },
  {
    id: "r3",
    name: "Lena King",
    homeId: "h1",
    room: "3A",
    dob: "1992-11-21",
    age: 33,
    photoColor: "#1F3A5F",
    diagnoses: ["Cerebral Palsy", "Epilepsy"],
    allergies: ["Sulfa drugs"],
    guardian: { name: "Robert King", relationship: "Father", phone: "(407) 555-0119" },
    status: "attention",
    statusNote: "Monitor — slight seizure aura reported this morning",
    carePlan: {
      summary: "Lena uses a power wheelchair and AAC device. Sharp sense of humor, loves painting.",
      goals: [
        { title: "Seizure monitoring", detail: "Log auras and events; ensure rescue protocol is accessible." },
        { title: "Creative expression", detail: "Twice-weekly art sessions." },
      ],
      dietary: "Soft texture, thickened liquids.",
      mobility: "Power wheelchair; transfer assist x1.",
      communication: "AAC tablet + facial expression.",
    },
  },
  {
    id: "r4",
    name: "Anthony Greco",
    homeId: "h2",
    room: "1C",
    dob: "1987-05-09",
    age: 39,
    photoColor: "#2E8B5B",
    diagnoses: ["Intellectual Disability", "Anxiety"],
    allergies: [],
    guardian: { name: "Maria Greco", relationship: "Mother", phone: "(407) 555-0173" },
    status: "stable",
    statusNote: "Calm and engaged at breakfast",
    carePlan: {
      summary: "Anthony manages anxiety with grounding routines. Enjoys puzzles and gardening.",
      goals: [
        { title: "Anxiety coping skills", detail: "Use breathing card before transitions." },
        { title: "Vocational program", detail: "Attend day program Mon–Thu." },
      ],
      dietary: "Regular.",
      mobility: "Independent",
      communication: "Verbal.",
    },
  },
  {
    id: "r5",
    name: "Priya Nair",
    homeId: "h2",
    room: "2A",
    dob: "1998-01-30",
    age: 28,
    photoColor: "#C9A227",
    diagnoses: ["Fragile X Syndrome"],
    allergies: ["Shellfish"],
    guardian: { name: "Anita Nair", relationship: "Aunt", phone: "(407) 555-0155" },
    status: "stable",
    statusNote: "Looking forward to family visit today",
    carePlan: {
      summary: "Priya is gentle and routine-oriented. Sensitive to loud noise; prefers headphones.",
      goals: [
        { title: "Sensory regulation", detail: "Offer quiet space and noise-cancelling headphones." },
        { title: "Self-care independence", detail: "Lay out clothes the night before." },
      ],
      dietary: "No shellfish.",
      mobility: "Independent",
      communication: "Verbal; soft-spoken.",
    },
  },
];

export function residentById(id: string) {
  return residents.find((r) => r.id === id);
}
export function residentsByHome(homeId: string) {
  return residents.filter((r) => r.homeId === homeId);
}
