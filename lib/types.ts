export type ID = string;

export interface Home {
  id: ID;
  name: string;
  city: string;
  address: string;
  capacity: number;
  licenseNo: string;
  operational: boolean;
}

export type StaffRole = "Owner" | "Manager" | "Caregiver" | "Nurse";

export interface Staff {
  id: ID;
  name: string;
  role: StaffRole;
  homeId: ID;
  onShift: boolean;
  medValidationExpiry: string; // ISO date
  avatarColor: string;
  hourlyRate: number; // USD per hour
  pin: string; // 4-digit demo PIN
}

export interface Shift {
  id: ID;
  staffId: ID;
  clockIn: string; // ISO timestamp
  clockOut?: string; // ISO timestamp
}

export interface Guardian {
  name: string;
  relationship: string;
  phone: string;
}

export interface CarePlanGoal {
  title: string;
  detail: string;
}

export interface CarePlan {
  summary: string;
  goals: CarePlanGoal[];
  dietary: string;
  mobility: string;
  communication: string;
}

export type MedRoute = "Oral" | "Topical" | "Injection" | "Inhaled";

export interface Medication {
  id: ID;
  residentId: ID;
  name: string;
  dose: string;
  route: MedRoute;
  schedule: string[]; // times "08:00"
  reason: string;
  prn?: boolean;
}

export type MedStatus = "due" | "given" | "refused" | "held" | "upcoming";

export interface MedAdministration {
  id: ID;
  medId: ID;
  scheduledTime: string;
  status: MedStatus;
  reason?: string;
  staffId?: ID;
  at?: string;
}

export type LogCategory = "meal" | "activity" | "behavior" | "other";

export interface DailyLog {
  id: ID;
  residentId: ID;
  category: LogCategory;
  title: string;
  note: string;
  staffId: ID;
  time: string;
}

export type IncidentSeverity = "low" | "moderate" | "high";

export interface Incident {
  id: ID;
  residentId: ID;
  homeId: ID;
  type: string;
  severity: IncidentSeverity;
  whatHappened: string;
  actionTaken: string;
  status: "open" | "resolved";
  reportedBy: ID;
  time: string;
}

export interface Visit {
  id: ID;
  visitorName: string;
  visitingResidentId: ID;
  relationship: string;
  checkIn: string;
  checkOut?: string;
  onSite: boolean;
}

export interface Doc {
  id: ID;
  residentId: ID;
  name: string;
  type: string;
  updated: string;
}

export interface Resident {
  id: ID;
  name: string;
  homeId: ID;
  room: string;
  dob: string;
  age: number;
  photoColor: string;
  diagnoses: string[];
  allergies: string[];
  guardian: Guardian;
  carePlan: CarePlan;
  status: "stable" | "attention" | "appointment";
  statusNote: string;
}
