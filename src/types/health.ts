export type DaytimePeriod = 'morgens' | 'mittags' | 'abends';

export interface BloodPressureEntry {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  period: DaytimePeriod;
  note: string;
  contextTag: string; // e.g. 'Vor der Tablette', 'Nach dem Sport', 'In Ruhe', 'Stress'
}

export type GlucoseUnit = 'mg/dl' | 'mmol/l';

export type GlucoseMeasurementType =
  | 'nuechtern'
  | 'vor_essen'
  | 'nach_essen_1h'
  | 'nach_essen_2h'
  | 'vor_schlafen';

export interface BloodSugarEntry {
  id: string;
  valueMgDl: number; // Canonical value in mg/dl
  measurementType: GlucoseMeasurementType;
  mealDistance: string; // e.g. 'Nüchtern (> 8 Std.)', '1 Std. nach Mahlzeit', '2 Std. nach Mahlzeit'
  date: string;
  time: string;
  foodNote: string;
  activityNote: string;
  wellbeing: 'Sehr gut' | 'Gut' | 'Neutral' | 'Müde' | 'Unwohl';
}

export interface WeightBodyEntry {
  id: string;
  weightKg: number;
  waistCm?: number;
  bodyFatPercent?: number;
  date: string;
  time: string;
  note: string;
}

export type MedicationStatus = 'offen' | 'eingenommen' | 'uebersprungen' | 'verschoben';

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  form: 'Tablette' | 'Kapsel' | 'Tropfen' | 'Injektion';
  times: string[]; // e.g. ['08:00', '20:00']
  weekdays: number[]; // 1=Mo ... 7=So
  stockCount: number;
  lowStockThreshold: number;
  instructions: string;
  prescriptionReminder: string; // e.g. 'Folgerezept bei Dr. Weber ab 15.11. anfordern'
}

export interface MedicationIntakeLog {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  date: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  actionTime: string; // HH:mm
  status: 'eingenommen' | 'uebersprungen' | 'verschoben';
  postponedTo?: string;
}

export interface WaterLogItem {
  id: string;
  time: string;
  amountMl: number;
  label: string;
}

export interface DailyHydrationActivity {
  date: string; // YYYY-MM-DD
  waterLogs: WaterLogItem[];
  steps: number;
  activeMinutes: number;
  activitySummary: string;
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty:
    | 'Hausarzt'
    | 'Innere Medizin'
    | 'Kardiologie'
    | 'Diabetologie'
    | 'HNO'
    | 'Neurologie'
    | 'Radiologie'
    | 'Chirurgie'
    | 'Urologie'
    | 'Augenarzt'
    | 'Labor / Blutuntersuchung'
    | 'Zahnarzt'
    | 'Orthopädie'
    | 'Sonstiger Facharzt';
  date: string;
  time: string;
  location: string;
  reason: string;
  isBloodTest?: boolean;
  fastingRequired: boolean;
  notes?: string;
  reminderNote?: string;
}

export interface PreventiveCheckItem {
  id: string;
  title: string;
  category: 'Blutuntersuchung' | 'Impfung' | 'Vorsorgeuntersuchung';
  lastDoneDate: string;
  nextDueDate: string;
  intervalLabel: string;
  status: 'aktuell' | 'faellig_bald' | 'ueberfaellig';
  notes: string;
}

export interface DoctorQuestion {
  id: string;
  question: string;
  specialty: string;
  appointmentId?: string;
  createdAt: string;
  asked: boolean;
  answerNote: string;
}

export type AppLanguage = 'de' | 'en' | 'es' | 'fr' | 'ar';

export interface UserHealthProfile {
  fullName: string;
  lastName?: string;
  firstName?: string;
  birthDate?: string;
  birthYear: number;
  age?: number;
  email?: string;
  healthInsurance?: string;
  insuranceNumber?: string;
  familyDoctor?: string;
  primaryDoctorName?: string;
  avatarUrl?: string;
  language?: AppLanguage;
  heightCm: number;
  targetWeightKg: number;
  glucoseUnit: GlucoseUnit;
  glucoseTargetFastingMin: number; // in mg/dl (default 70)
  glucoseTargetFastingMax: number; // in mg/dl (default 100)
  glucoseTargetPostMealMax: number; // in mg/dl (default 140)
  bpTargetSystolicMax: number; // default 135
  bpTargetDiastolicMax: number; // default 85
  dailyWaterGoalMl: number; // default 2200
  waterReminderTimes: string[];
  dailyStepsGoal: number; // default 8000
  dailyActiveMinutesGoal: number; // default 30
  notificationsEnabled: boolean;
}

export type PainLevel = 'Stark' | 'Leicht' | 'Kurz';

export interface PainEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  hasPain: boolean; // true = Ja (rot), false = Nein (grün)
  description: string; // Schmerzen Beschreibung
  level?: PainLevel; // Stark | Leicht | Kurz
}

export interface SleepDiagnosticEntry {
  id: string;
  date: string; // YYYY-MM-DD
  durationHours: number;
  qualityTags: string[];
  note: string;
}



