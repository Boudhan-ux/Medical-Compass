import React, { useState } from 'react';
import {
  HeartPulse,
  Droplet,
  Scale,
  GlassWater,
  Plus,
  Trash2,
  Bell,
  Footprints,
  SlidersHorizontal,
  Wind,
  FlaskConical,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import {
  BloodPressureEntry,
  BloodSugarEntry,
  DailyHydrationActivity,
  DaytimePeriod,
  GlucoseUnit,
  PainEntry,
  UserHealthProfile,
  WeightBodyEntry,
} from '../types/health';
import {
  calculateBmi,
  classifyBloodPressure,
  classifyBmi,
  evaluateGlucoseStatus,
  formatGermanDate,
  formatGlucose,
  formatShortGermanDate,
  getCurrentTimeHm,
  getDaysAgoIso,
  getGlucoseTypeLabel,
  getTodayIso,
} from '../utils/healthHelpers';
import { QuickEntryTab } from './QuickEntryModal';
import { PainTrackerCard } from './PainTrackerCard';

export type VitalsSubTab = 'bp' | 'sugar' | 'weight' | 'water' | 'spo2' | 'labs';

interface LabValueRow {
  id: string;
  untersuchung: string;
  resultat: string;
  referenzwerte: string;
}

const DEFAULT_LAB_VALUES: LabValueRow[] = [
  { id: 'lab-1', untersuchung: 'GOT (AST)', resultat: '24 U/l', referenzwerte: '< 50 U/l' },
  { id: 'lab-2', untersuchung: 'GPT (ALT)', resultat: '28 U/l', referenzwerte: '< 50 U/l' },
  { id: 'lab-3', untersuchung: 'YGT / GGT', resultat: '32 U/l', referenzwerte: '< 60 U/l' },
  { id: 'lab-4', untersuchung: 'Harnsäure', resultat: '5,4 mg/dl', referenzwerte: '3,4 – 7,0 mg/dl' },
  { id: 'lab-5', untersuchung: 'Cortisol', resultat: '14,2 µg/dl', referenzwerte: '6,2 – 19,4 µg/dl' },
  { id: 'lab-6', untersuchung: 'Glykos. HbA1c (NGSP)', resultat: '5,8 %', referenzwerte: '4,0 – 6,0 %' },
  { id: 'lab-7', untersuchung: 'Glykos. HbA1c (IFCC)', resultat: '40 mmol/mol', referenzwerte: '20 – 42 mmol/mol' },
  { id: 'lab-8', untersuchung: 'CRP', resultat: '1,8 mg/l', referenzwerte: '< 5,0 mg/l' },
];

export interface OxygenSaturationEntry {
  id: string;
  spo2Percent: number;
  pulse: number;
  date: string;
  time: string;
  context: string;
  note: string;
}

const INITIAL_SPO2_ENTRIES: OxygenSaturationEntry[] = [
  {
    id: 'spo2-1',
    spo2Percent: 98,
    pulse: 66,
    date: getTodayIso(),
    time: '07:40',
    context: 'Morgens in Ruhe',
    note: 'Normale Atmung nach dem Aufstehen',
  },
  {
    id: 'spo2-2',
    spo2Percent: 97,
    pulse: 72,
    date: getDaysAgoIso(1),
    time: '18:30',
    context: 'Nach Spaziergang',
    note: '30 Min. an der frischen Luft',
  },
  {
    id: 'spo2-3',
    spo2Percent: 99,
    pulse: 64,
    date: getDaysAgoIso(3),
    time: '08:00',
    context: 'Morgens in Ruhe',
    note: 'Optimaler Wert',
  },
  {
    id: 'spo2-4',
    spo2Percent: 97,
    pulse: 68,
    date: getDaysAgoIso(5),
    time: '19:15',
    context: 'Abends in Ruhe',
    note: '',
  },
  {
    id: 'spo2-5',
    spo2Percent: 98,
    pulse: 65,
    date: getDaysAgoIso(8),
    time: '07:50',
    context: 'Morgens in Ruhe',
    note: '',
  },
];

interface VitalsViewProps {
  activeSubTab: VitalsSubTab;
  onChangeSubTab: (tab: VitalsSubTab) => void;
  bpEntries: BloodPressureEntry[];
  onDeleteBp: (id: string) => void;
  sugarEntries: BloodSugarEntry[];
  onDeleteSugar: (id: string) => void;
  weightEntries: WeightBodyEntry[];
  onDeleteWeight: (id: string) => void;
  todayHydration: DailyHydrationActivity;
  onAddWater: (amountMl: number, label: string) => void;
  onRemoveWaterLog: (id: string) => void;
  onUpdateActivity: (stepsDelta: number, minutesDelta: number, summary: string) => void;
  profile: UserHealthProfile;
  onUpdateProfile: (patch: Partial<UserHealthProfile>) => void;
  onOpenQuickEntry: (tab: QuickEntryTab) => void;
  painEntries: PainEntry[];
  onAddPainEntry: (entry: Omit<PainEntry, 'id'>) => void;
  onUpdatePainEntry: (updated: PainEntry) => void;
  onDeletePainEntry: (id: string) => void;
}

export const VitalsView: React.FC<VitalsViewProps> = ({
  activeSubTab,
  onChangeSubTab,
  bpEntries,
  onDeleteBp,
  sugarEntries,
  onDeleteSugar,
  weightEntries,
  onDeleteWeight,
  todayHydration,
  onAddWater,
  onRemoveWaterLog,
  onUpdateActivity,
  profile,
  onUpdateProfile,
  onOpenQuickEntry,
  painEntries,
  onAddPainEntry,
  onUpdatePainEntry,
  onDeletePainEntry,
}) => {
  // BP Filters
  const [bpRange, setBpRange] = useState<'week' | 'month' | 'year'>('month');
  const [bpPeriodFilter, setBpPeriodFilter] = useState<'alle' | DaytimePeriod>('alle');

  // Sugar Filters
  const [sugarRange, setSugarRange] = useState<'day' | 'week' | 'month'>('month');
  const [showTargetEditor, setShowTargetEditor] = useState(false);

  // Water Reminder Input
  const [newReminderTime, setNewReminderTime] = useState('16:00');

  // Movement & Steps Inline Edit State
  const [isEditingMovement, setIsEditingMovement] = useState(false);
  const [editStepsToday, setEditStepsToday] = useState(String(todayHydration.steps));
  const [editStepsGoal, setEditStepsGoal] = useState(String(profile.dailyStepsGoal));
  const [editActiveMinToday, setEditActiveMinToday] = useState(
    String(todayHydration.activeMinutes)
  );
  const [editActiveMinGoal, setEditActiveMinGoal] = useState(
    String(profile.dailyActiveMinutesGoal)
  );
  const [editActivitySummary, setEditActivitySummary] = useState(
    todayHydration.activitySummary || ''
  );

  const handleOpenMovementEditor = () => {
    setEditStepsToday(String(todayHydration.steps));
    setEditStepsGoal(String(profile.dailyStepsGoal));
    setEditActiveMinToday(String(todayHydration.activeMinutes));
    setEditActiveMinGoal(String(profile.dailyActiveMinutesGoal));
    setEditActivitySummary(todayHydration.activitySummary || '');
    setIsEditingMovement(true);
  };

  const handleActivityNoteChange = (val: string) => {
    setEditActivitySummary(val);
    // Automatically extract steps or minutes if user types them into "Letzte Aktivität"
    const stepsMatch = val.match(/(\d+(?:\.\d+)?)\s*Schritte/i);
    const minMatch = val.match(/(\d+)\s*Min/i);
    if (stepsMatch) {
      const parsedSteps = parseInt(stepsMatch[1].replace('.', ''), 10);
      if (!isNaN(parsedSteps)) {
        setEditStepsToday(String(parsedSteps));
      }
    }
    if (minMatch) {
      const parsedMin = parseInt(minMatch[1], 10);
      if (!isNaN(parsedMin)) {
        setEditActiveMinToday(String(parsedMin));
        if (!stepsMatch) {
          // Estimate ~100 steps per active minute if only minutes were typed in the note
          setEditStepsToday(String(parsedMin * 100));
        }
      }
    }
  };

  const handleSaveMovementEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextSteps = Math.max(0, parseInt(editStepsToday, 10) || 0);
    const nextMin = Math.max(0, parseInt(editActiveMinToday, 10) || 0);
    const nextStepsGoal = Math.max(500, parseInt(editStepsGoal, 10) || 8000);
    const nextMinGoal = Math.max(5, parseInt(editActiveMinGoal, 10) || 35);

    onUpdateProfile({
      dailyStepsGoal: nextStepsGoal,
      dailyActiveMinutesGoal: nextMinGoal,
    });

    const stepsDelta = nextSteps - todayHydration.steps;
    const minDelta = nextMin - todayHydration.activeMinutes;
    onUpdateActivity(stepsDelta, minDelta, editActivitySummary.trim());
    setIsEditingMovement(false);
  };

  // Sport InfoCard & Schlafdiagnostik state
  const [selectedSportItems, setSelectedSportItems] = useState<string[]>(['Laufband']);

  // Sport entry form states for Laufband, Fahrrad, Gymnastik
  const [treadmillDate, setTreadmillDate] = useState(getTodayIso());
  const [treadmillMinutes, setTreadmillMinutes] = useState('20');
  const [treadmillCalories, setTreadmillCalories] = useState('165');

  const [bikeDate, setBikeDate] = useState(getTodayIso());
  const [bikeMinutes, setBikeMinutes] = useState('30');
  const [bikeKm, setBikeKm] = useState('8.5');

  const [gymDate, setGymDate] = useState(getTodayIso());
  const [gymMinutes, setGymMinutes] = useState('15');
  const [gymCategory, setGymCategory] = useState<
    | 'Mobilisation & Aufwärmen'
    | 'Kräftigung'
    | 'Dehnen'
    | 'Koordination & Gleichgewicht'
  >('Mobilisation & Aufwärmen');

  interface SportActivityLog {
    id: string;
    sportType: 'Laufband' | 'Fahrrad' | 'Gymnastik';
    date: string;
    minutes: number;
    calories?: number;
    distanceKm?: number;
    gymCategory?:
      | 'Mobilisation & Aufwärmen'
      | 'Kräftigung'
      | 'Dehnen'
      | 'Koordination & Gleichgewicht';
  }

  const [sportLogs, setSportLogs] = useState<SportActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('gesundlife_sport_logs_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [
      {
        id: 'sp-1',
        sportType: 'Laufband',
        date: getTodayIso(),
        minutes: 20,
        calories: 165,
      },
      {
        id: 'sp-2',
        sportType: 'Fahrrad',
        date: getDaysAgoIso(1),
        minutes: 30,
        distanceKm: 8.5,
      },
      {
        id: 'sp-3',
        sportType: 'Gymnastik',
        date: getDaysAgoIso(2),
        minutes: 15,
        gymCategory: 'Mobilisation & Aufwärmen',
      },
    ];
  });

  const [editingSportId, setEditingSportId] = useState<string | null>(null);
  const [editSportDraft, setEditSportDraft] = useState<SportActivityLog | null>(null);

  const saveSportLogs = (next: SportActivityLog[]) => {
    setSportLogs(next);
    try {
      localStorage.setItem('gesundlife_sport_logs_v1', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleAddTreadmillLog = () => {
    const mins = Math.max(1, parseInt(treadmillMinutes, 10) || 20);
    const kcal = Math.max(0, parseInt(treadmillCalories, 10) || 0);
    const newEntry: SportActivityLog = {
      id: `sp-${Date.now()}-lb`,
      sportType: 'Laufband',
      date: treadmillDate || getTodayIso(),
      minutes: mins,
      calories: kcal,
    };
    saveSportLogs([newEntry, ...sportLogs]);
    onUpdateActivity(mins * 80, mins, `Laufband: ${mins} Min. · ${kcal} kcal`);
  };

  const handleAddBikeLog = () => {
    const mins = Math.max(1, parseInt(bikeMinutes, 10) || 30);
    const km = Math.max(0, parseFloat(bikeKm.replace(',', '.')) || 0);
    const newEntry: SportActivityLog = {
      id: `sp-${Date.now()}-fr`,
      sportType: 'Fahrrad',
      date: bikeDate || getTodayIso(),
      minutes: mins,
      distanceKm: km,
    };
    saveSportLogs([newEntry, ...sportLogs]);
    onUpdateActivity(mins * 60, mins, `Fahrrad: ${mins} Min. · ${km} km`);
  };

  const handleAddGymLog = () => {
    const mins = Math.max(1, parseInt(gymMinutes, 10) || 15);
    const newEntry: SportActivityLog = {
      id: `sp-${Date.now()}-gm`,
      sportType: 'Gymnastik',
      date: gymDate || getTodayIso(),
      minutes: mins,
      gymCategory,
    };
    saveSportLogs([newEntry, ...sportLogs]);
    onUpdateActivity(mins * 40, mins, `Gymnastik (${gymCategory}): ${mins} Min.`);
  };

  const handleDeleteSportLog = (id: string) => {
    saveSportLogs(sportLogs.filter((item) => item.id !== id));
    if (editingSportId === id) {
      setEditingSportId(null);
      setEditSportDraft(null);
    }
  };

  const startEditingSportLog = (item: SportActivityLog) => {
    setEditingSportId(item.id);
    setEditSportDraft({ ...item });
  };

  const handleSaveEditedSportLog = () => {
    if (!editSportDraft) return;
    saveSportLogs(
      sportLogs.map((item) =>
        item.id === editSportDraft.id ? editSportDraft : item
      )
    );
    setEditingSportId(null);
    setEditSportDraft(null);
  };

  const [sleepDate, setSleepDate] = useState(getTodayIso());
  const [sleepDurationHours, setSleepDurationHours] = useState('7.5');
  const [sleepQualityTags, setSleepQualityTags] = useState<string[]>([
    'Erholsamer Schlaf',
  ]);
  const [sleepNote, setSleepNote] = useState('Ruhige Atmung, 1× kurz aufgewacht');

  interface SleepDiagnosticLog {
    id: string;
    date: string;
    durationHours: number;
    qualityTags: string[];
    note: string;
  }

  const [sleepLogs, setSleepLogs] = useState<SleepDiagnosticLog[]>(() => {
    const threeMonthsCutoff = getDaysAgoIso(90);
    try {
      const saved = localStorage.getItem('gesundlife_sleep_logs_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (item: SleepDiagnosticLog) => item && item.date >= threeMonthsCutoff
          );
          if (valid.length !== parsed.length) {
            localStorage.setItem('gesundlife_sleep_logs_v1', JSON.stringify(valid));
          }
          return valid;
        }
      }
    } catch {
      // ignore storage errors
    }
    return [
      {
        id: 'sl-1',
        date: getTodayIso(),
        durationHours: 7.5,
        qualityTags: ['Erholsamer Schlaf'],
        note: 'Ruhige Atmung, 1× kurz aufgewacht',
      },
      {
        id: 'sl-2',
        date: getDaysAgoIso(1),
        durationHours: 7.0,
        qualityTags: ['Erholsamer Schlaf'],
        note: 'Durchgeschlafen, morgens erholt',
      },
      {
        id: 'sl-3',
        date: getDaysAgoIso(2),
        durationHours: 6.5,
        qualityTags: ['Unruhiger Schlaf'],
        note: 'Abends spät eingeschlafen',
      },
      {
        id: 'sl-4',
        date: getDaysAgoIso(3),
        durationHours: 8.0,
        qualityTags: ['Erholsamer Schlaf'],
        note: 'Sehr erholsamer Tiefschlaf',
      },
      {
        id: 'sl-5',
        date: getDaysAgoIso(4),
        durationHours: 6.0,
        qualityTags: ['Durchschlafstörung'],
        note: '2× nachts wach gewesen',
      },
      {
        id: 'sl-6',
        date: getDaysAgoIso(5),
        durationHours: 7.5,
        qualityTags: ['Erholsamer Schlaf'],
        note: 'Gute Schlafqualität',
      },
    ];
  });

  const [editingSleepId, setEditingSleepId] = useState<string | null>(null);
  const [editSleepDraft, setEditSleepDraft] = useState<SleepDiagnosticLog | null>(null);

  const saveSleepLogs = (next: SleepDiagnosticLog[]) => {
    const threeMonthsCutoff = getDaysAgoIso(90);
    const sorted = [...next]
      .filter((item) => item.date >= threeMonthsCutoff)
      .sort((a, b) => b.date.localeCompare(a.date));
    setSleepLogs(sorted);
    try {
      localStorage.setItem('gesundlife_sleep_logs_v1', JSON.stringify(sorted));
    } catch {
      // ignore
    }
  };

  const handleAddSleepLog = () => {
    const hrs = Math.min(16, Math.max(1, parseFloat(sleepDurationHours.replace(',', '.')) || 7.5));
    const newEntry: SleepDiagnosticLog = {
      id: `sl-${Date.now()}`,
      date: sleepDate || getTodayIso(),
      durationHours: hrs,
      qualityTags:
        sleepQualityTags.length > 0 ? [...sleepQualityTags] : ['Erholsamer Schlaf'],
      note: sleepNote.trim(),
    };
    saveSleepLogs([newEntry, ...sleepLogs]);
    setSleepNote('');
  };

  const handleDeleteSleepLog = (id: string) => {
    saveSleepLogs(sleepLogs.filter((item) => item.id !== id));
    if (editingSleepId === id) {
      setEditingSleepId(null);
      setEditSleepDraft(null);
    }
  };

  const startEditingSleepLog = (item: SleepDiagnosticLog) => {
    setEditingSleepId(item.id);
    setEditSleepDraft({ ...item, qualityTags: [...item.qualityTags] });
  };

  const handleSaveEditedSleepLog = () => {
    if (!editSleepDraft) return;
    saveSleepLogs(
      sleepLogs.map((item) =>
        item.id === editSleepDraft.id ? editSleepDraft : item
      )
    );
    setEditingSleepId(null);
    setEditSleepDraft(null);
  };

  const toggleSportItem = (sport: string) => {
    setSelectedSportItems((prev) =>
      prev.includes(sport)
        ? prev.filter((item) => item !== sport)
        : [...prev, sport]
    );
  };

  const toggleSleepQualityTag = (tag: string) => {
    setSleepQualityTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 6. Sauerstoffsättigung (SpO2) State
  const [spo2Entries, setSpo2Entries] = useState<OxygenSaturationEntry[]>(() => {
    try {
      const saved = localStorage.getItem('gesundlife_spo2_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return INITIAL_SPO2_ENTRIES;
  });
  const [showSpo2Form, setShowSpo2Form] = useState(false);
  const [newSpo2Val, setNewSpo2Val] = useState('98');
  const [newSpo2Pulse, setNewSpo2Pulse] = useState('68');
  const [newSpo2Date, setNewSpo2Date] = useState(getTodayIso());
  const [newSpo2Time, setNewSpo2Time] = useState(getCurrentTimeHm());
  const [newSpo2Contexts, setNewSpo2Contexts] = useState<string[]>(['In Ruhe']);
  const [newSpo2Note, setNewSpo2Note] = useState('');

  const toggleSpo2Context = (preset: string) => {
    setNewSpo2Contexts((prev) =>
      prev.includes(preset)
        ? prev.filter((item) => item !== preset)
        : [...prev, preset]
    );
  };

  const saveSpo2List = (nextList: OxygenSaturationEntry[]) => {
    setSpo2Entries(nextList);
    try {
      localStorage.setItem('gesundlife_spo2_v1', JSON.stringify(nextList));
    } catch {
      // ignore
    }
  };

  const handleAddSpo2Entry = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Math.min(100, Math.max(70, parseInt(newSpo2Val, 10) || 98));
    const pulseVal = Math.min(220, Math.max(30, parseInt(newSpo2Pulse, 10) || 68));
    const entry: OxygenSaturationEntry = {
      id: `spo2-${Date.now()}`,
      spo2Percent: val,
      pulse: pulseVal,
      date: newSpo2Date || getTodayIso(),
      time: newSpo2Time || getCurrentTimeHm(),
      context: newSpo2Contexts.length > 0 ? newSpo2Contexts.join(', ') : 'In Ruhe',
      note: newSpo2Note.trim(),
    };
    saveSpo2List([entry, ...spo2Entries]);
    setNewSpo2Note('');
    setShowSpo2Form(false);
  };

  const handleDeleteSpo2Entry = (id: string) => {
    saveSpo2List(spo2Entries.filter((item) => item.id !== id));
  };

  // 6. Laborwerte State
  const [labValues, setLabValues] = useState<LabValueRow[]>(() => {
    try {
      const saved = localStorage.getItem('gesundlife_lab_values_v2');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_LAB_VALUES;
  });
  const [newLabName, setNewLabName] = useState('');
  const [newLabResult, setNewLabResult] = useState('');
  const [newLabReference, setNewLabReference] = useState('');
  const [showAddLabRow, setShowAddLabRow] = useState(false);

  const saveLabValues = (next: LabValueRow[]) => {
    setLabValues(next);
    try {
      localStorage.setItem('gesundlife_lab_values_v2', JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  };

  const handleUpdateLabField = (
    id: string,
    field: 'resultat' | 'referenzwerte',
    value: string
  ) => {
    saveLabValues(
      labValues.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleAddLabRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabName.trim()) return;
    const nextRow: LabValueRow = {
      id: `lab-${Date.now()}`,
      untersuchung: newLabName.trim(),
      resultat: newLabResult.trim() || '—',
      referenzwerte: newLabReference.trim() || '—',
    };
    saveLabValues([...labValues, nextRow]);
    setNewLabName('');
    setNewLabResult('');
    setNewLabReference('');
    setShowAddLabRow(false);
  };

  const handleDeleteLabRow = (id: string) => {
    saveLabValues(labValues.filter((row) => row.id !== id));
  };

  // Filter BP entries by timeframe and period
  const bpCutoffDate =
    bpRange === 'week'
      ? getDaysAgoIso(7)
      : bpRange === 'month'
      ? getDaysAgoIso(30)
      : getDaysAgoIso(365);

  const filteredBp = bpEntries
    .filter((e) => e.date >= bpCutoffDate)
    .filter((e) => (bpPeriodFilter === 'alle' ? true : e.period === bpPeriodFilter))
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  const chartBp = [...filteredBp].reverse();

  const morningBp = filteredBp.filter((e) => e.period === 'morgens');
  const eveningBp = filteredBp.filter((e) => e.period === 'abends');

  const avgSysMorning = morningBp.length
    ? Math.round(morningBp.reduce((acc, e) => acc + e.systolic, 0) / morningBp.length)
    : 0;
  const avgDiaMorning = morningBp.length
    ? Math.round(morningBp.reduce((acc, e) => acc + e.diastolic, 0) / morningBp.length)
    : 0;
  const avgSysEvening = eveningBp.length
    ? Math.round(eveningBp.reduce((acc, e) => acc + e.systolic, 0) / eveningBp.length)
    : 0;
  const avgDiaEvening = eveningBp.length
    ? Math.round(eveningBp.reduce((acc, e) => acc + e.diastolic, 0) / eveningBp.length)
    : 0;

  // Filter Sugar entries
  const sugarCutoffDate =
    sugarRange === 'day'
      ? getDaysAgoIso(1)
      : sugarRange === 'week'
      ? getDaysAgoIso(7)
      : getDaysAgoIso(30);

  const filteredSugar = sugarEntries
    .filter((e) => e.date >= sugarCutoffDate)
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  const chartSugar = [...filteredSugar].reverse();

  // Weight & Body calculations
  const sortedWeights = [...weightEntries].sort((a, b) =>
    `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
  );
  const chartWeights = [...sortedWeights].reverse();
  const latestWeight = sortedWeights[0];
  const oldestWeight = sortedWeights[sortedWeights.length - 1];
  const currentBmi = latestWeight
    ? calculateBmi(latestWeight.weightKg, profile.heightCm)
    : 0;
  const bmiInfo = classifyBmi(currentBmi);
  const weightDiffToTarget = latestWeight
    ? +(latestWeight.weightKg - profile.targetWeightKg).toFixed(1)
    : 0;

  // Water progress
  const totalWaterToday = todayHydration.waterLogs.reduce(
    (sum, item) => sum + item.amountMl,
    0
  );
  const waterPercentage = Math.min(
    100,
    Math.round((totalWaterToday / Math.max(1, profile.dailyWaterGoalMl)) * 100)
  );
  const stepsPercentage = Math.min(
    100,
    Math.round((todayHydration.steps / Math.max(1, profile.dailyStepsGoal)) * 100)
  );

  const handleAddWaterReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTime) return;
    if (!profile.waterReminderTimes.includes(newReminderTime)) {
      const updated = [...profile.waterReminderTimes, newReminderTime].sort();
      onUpdateProfile({ waterReminderTimes: updated });
    }
  };

  const handleRemoveWaterReminder = (timeStr: string) => {
    onUpdateProfile({
      waterReminderTimes: profile.waterReminderTimes.filter((t) => t !== timeStr),
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Körperwerte & Messungen
          </h1>
        </div>

        {/* Interactive Segmented Control */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1 p-1 bg-emerald-50/80 rounded-xl border border-emerald-800">
          <button
            type="button"
            onClick={() => onChangeSubTab('bp')}
            className={`min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap shrink-0 border ${
              activeSubTab === 'bp'
                ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                : 'bg-emerald-100/70 text-emerald-950 border-emerald-800/60 hover:bg-emerald-200/70'
            }`}
          >
            <span className="text-sm leading-none select-none shrink-0" aria-hidden="true">
              ❤️
            </span>
            <span>1. Blutdruck & Puls</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeSubTab('sugar')}
            className={`min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap shrink-0 border ${
              activeSubTab === 'sugar'
                ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                : 'bg-emerald-100/70 text-emerald-950 border-emerald-800/60 hover:bg-emerald-200/70'
            }`}
          >
            <span className="text-sm leading-none select-none shrink-0" aria-hidden="true">
              🩸
            </span>
            <span>2. Blutzucker</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeSubTab('weight')}
            className={`min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap shrink-0 border ${
              activeSubTab === 'weight'
                ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                : 'bg-emerald-100/70 text-emerald-950 border-emerald-800/60 hover:bg-emerald-200/70'
            }`}
          >
            <span
              className="text-sm leading-none select-none shrink-0 text-black brightness-0"
              aria-hidden="true"
            >
              ⚖️
            </span>
            <span>3. Gewicht & BMI</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeSubTab('water')}
            className={`min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap shrink-0 border ${
              activeSubTab === 'water'
                ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                : 'bg-emerald-100/70 text-emerald-950 border-emerald-800/60 hover:bg-emerald-200/70'
            }`}
          >
            <span
              className="text-sm leading-none select-none shrink-0 text-black brightness-0"
              aria-hidden="true"
            >
              🩸
            </span>
            <span>4. Trinken & Sport</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeSubTab('spo2')}
            className={`min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap shrink-0 border ${
              activeSubTab === 'spo2'
                ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                : 'bg-emerald-100/70 text-emerald-950 border-emerald-800/60 hover:bg-emerald-200/70'
            }`}
          >
            <span
              className="text-xs font-extrabold font-mono leading-none select-none shrink-0 text-blue-600"
              aria-hidden="true"
            >
              O₂
            </span>
            <span>5. Sauerstoffsättigung</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeSubTab('labs')}
            className={`min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap shrink-0 border ${
              activeSubTab === 'labs'
                ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                : 'bg-emerald-100/70 text-emerald-950 border-emerald-800/60 hover:bg-emerald-200/70'
            }`}
          >
            <FlaskConical className={`w-3.5 h-3.5 ${activeSubTab === 'labs' ? 'text-white' : 'text-teal-700'}`} />
            <span>6. Laborwerte</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          1. BLUTDRUCK UND PULS
         ===================================================================== */}
      {activeSubTab === 'bp' && (
        <div className="space-y-4">
          {/* Interactive Chart Card */}
          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-800 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-800/80">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Blutdruck- und Pulsverlauf
                </h2>
                <p className="text-[11px] text-slate-600">
                  Systolisch (oben) · Diastolisch (unten) · Puls in Schlägen pro Minute
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Alle Zeiten indicator */}
                <div className="flex items-center p-1 bg-white/80 rounded-lg border border-emerald-800/60">
                  <button
                    type="button"
                    onClick={() => setBpPeriodFilter('alle')}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-700 text-white whitespace-nowrap shrink-0"
                  >
                    Alle Zeiten
                  </button>
                </div>

                {/* Timeframe Filter */}
                <div className="flex items-center gap-1 p-1 bg-white/80 rounded-lg border border-emerald-800/60">
                  {[
                    { id: 'week', label: 'Woche' },
                    { id: 'month', label: 'Monat' },
                    { id: 'year', label: 'Jahr' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setBpRange(t.id as 'week' | 'month' | 'year')}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        bpRange === t.id
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SVG Blood Pressure Chart */}
            {chartBp.length > 0 ? (
              <div className="mt-2">
                <div className="w-full overflow-x-auto">
                  <svg
                    viewBox="0 20 760 215"
                    className="w-full h-44 min-w-[520px] overflow-visible"
                  >
                    {/* Target Zone Band (70 - 135 mmHg) */}
                    <rect
                      x="45"
                      y="55"
                      width="695"
                      height="115"
                      fill="#f0fdfa"
                      rx="6"
                    />
                    {/* Horizontal Reference Grid Lines */}
                    {[160, 135, 110, 85, 60].map((val) => {
                      const y = 200 - ((val - 50) / 120) * 170;
                      return (
                        <g key={val}>
                          <line
                            x1="45"
                            y1={y}
                            x2="740"
                            y2={y}
                            stroke={val === 135 || val === 85 ? '#0f766e' : '#e2e8f0'}
                            strokeDasharray={val === 135 || val === 85 ? '4 4' : undefined}
                            strokeWidth="1"
                          />
                          <text
                            x="38"
                            y={y + 4}
                            textAnchor="end"
                            fontSize="12"
                            className="text-[12px] fill-slate-700 font-bold font-mono"
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Data Points & Connecting Lines */}
                    {chartBp.map((entry, idx) => {
                      const stepX =
                        chartBp.length === 1
                          ? 340
                          : 70 + (idx / (chartBp.length - 1)) * 640;
                      const ySys = 200 - ((entry.systolic - 50) / 120) * 170;
                      const yDia = 200 - ((entry.diastolic - 50) / 120) * 170;
                      const yPulse = 200 - ((entry.pulse - 50) / 120) * 170;

                      const nextEntry = chartBp[idx + 1];
                      const nextX =
                        nextEntry && chartBp.length > 1
                          ? 70 + ((idx + 1) / (chartBp.length - 1)) * 640
                          : null;
                      const nextYSys = nextEntry
                        ? 200 - ((nextEntry.systolic - 50) / 120) * 170
                        : null;
                      const nextYDia = nextEntry
                        ? 200 - ((nextEntry.diastolic - 50) / 120) * 170
                        : null;

                      return (
                        <g key={entry.id}>
                          {/* Range Bar between Sys and Dia */}
                          <line
                            x1={stepX}
                            y1={ySys}
                            x2={stepX}
                            y2={yDia}
                            stroke="#99f6e4"
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                          {nextX !== null && nextYSys !== null && nextYDia !== null && (
                            <>
                              <line
                                x1={stepX}
                                y1={ySys}
                                x2={nextX}
                                y2={nextYSys}
                                stroke="#0f766e"
                                strokeWidth="2.2"
                              />
                              <line
                                x1={stepX}
                                y1={yDia}
                                x2={nextX}
                                y2={nextYDia}
                                stroke="#0284c7"
                                strokeWidth="2"
                              />
                            </>
                          )}
                          {/* Systolic Point */}
                          <circle
                            cx={stepX}
                            cy={ySys}
                            r="4.5"
                            fill="#0f766e"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text
                            x={stepX}
                            y={ySys - 9}
                            textAnchor="middle"
                            fontSize="12"
                            className="text-[12px] font-mono font-bold fill-slate-900"
                          >
                            {entry.systolic}
                          </text>
                          {/* Diastolic Point */}
                          <circle
                            cx={stepX}
                            cy={yDia}
                            r="4"
                            fill="#0284c7"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text
                            x={stepX}
                            y={yDia + 15}
                            textAnchor="middle"
                            fontSize="12"
                            className="text-[12px] font-mono font-bold fill-slate-800"
                          >
                            {entry.diastolic}
                          </text>
                          {/* Pulse Marker */}
                          <circle cx={stepX} cy={yPulse} r="2.5" fill="#64748b" />
                          {/* Date X-axis label */}
                          <text
                            x={stepX}
                            y={226}
                            textAnchor="middle"
                            fontSize="12"
                            className="text-[12px] fill-slate-800 font-bold font-mono"
                          >
                            {formatShortGermanDate(entry.date)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span>
                    Legende: Dunkelgrün = Systolisch (mmHg) · Blau = Diastolisch (mmHg) · Grau = Puls (bpm)
                  </span>
                  <span>Gestrichelte Linien: Zielkorridor 135/85 mmHg</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-slate-600">
                  Keine Blutdruckmessungen für diesen Filter vorhanden.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenQuickEntry('bp')}
                  className="mt-3 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold"
                >
                  Erste Blutdruckmessung eintragen
                </button>
              </div>
            )}
          </div>

          {/* Blood Pressure Log List */}
          <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-emerald-800/80 flex items-center">
              <h3 className="text-sm font-bold text-slate-900">
                Gespeicherte Blutdruck- und Pulswerte ({filteredBp.length})
              </h3>
            </div>
            <div className="divide-y divide-emerald-800">
              {filteredBp.map((item) => {
                const status = classifyBloodPressure(item.systolic, item.diastolic);
                return (
                  <div
                    key={item.id}
                    className="px-3.5 py-2.5 flex items-center justify-between gap-2 hover:bg-emerald-100/40 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-sm font-bold font-mono tabular-nums text-slate-900 whitespace-nowrap">
                          {item.systolic}/{item.diastolic} mmHg
                        </span>
                        <span className="text-xs font-mono tabular-nums text-slate-700 whitespace-nowrap">
                          · Puls {item.pulse} bpm
                        </span>
                        <span
                          className={`text-xs font-bold whitespace-nowrap ${
                            status.label === 'Normal'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          · {status.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {formatGermanDate(item.date)} um {item.time} Uhr ·{' '}
                        {item.period.charAt(0).toUpperCase() + item.period.slice(1)} ·{' '}
                        {item.contextTag}
                        {item.note ? ` — „${item.note}“` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteBp(item.id)}
                      className="min-h-[32px] min-w-[32px] shrink-0 flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Eintrag löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. BLUTZUCKER-TRACKER
         ===================================================================== */}
      {activeSubTab === 'sugar' && (
        <div className="space-y-4">
          {/* Top Controls & Personal Target Summary */}
          <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 px-3.5 py-2.5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Persönliche Blutzucker-Zielbereiche nach ärztlicher Vorgabe
                </h2>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Nüchtern-Zielbereich:{' '}
                  <strong className="font-mono">
                    {formatGlucose(profile.glucoseTargetFastingMin, profile.glucoseUnit)}–
                    {formatGlucose(profile.glucoseTargetFastingMax, profile.glucoseUnit)}{' '}
                    {profile.glucoseUnit}
                  </strong>{' '}
                  · Nach dem Essen (Postprandial):{' '}
                  <strong className="font-mono">
                    unter {formatGlucose(profile.glucoseTargetPostMealMax, profile.glucoseUnit)}{' '}
                    {profile.glucoseUnit}
                  </strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {/* Unit Switcher mg/dl vs mmol/l */}
                <div className="flex items-center gap-1 p-0.5 bg-white/80 rounded-lg border border-emerald-800/60">
                  {(['mg/dl', 'mmol/l'] as GlucoseUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => onUpdateProfile({ glucoseUnit: u })}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        profile.glucoseUnit === u
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowTargetEditor(!showTargetEditor)}
                  className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white border border-emerald-800/70 hover:bg-emerald-50 text-xs font-medium text-slate-700 flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Zielbereich anpassen</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenQuickEntry('sugar')}
                  className="min-h-[32px] px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span>+Neu eintragen</span>
                </button>
              </div>
            </div>

            {showTargetEditor && (
              <div className="mt-3 pt-3 border-t border-emerald-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nüchtern Minimum (mg/dl)
                  </label>
                  <input
                    type="number"
                    value={profile.glucoseTargetFastingMin}
                    onChange={(e) =>
                      onUpdateProfile({
                        glucoseTargetFastingMin: Number(e.target.value) || 70,
                      })
                    }
                    className="w-full min-h-[36px] px-2.5 py-1 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nüchtern Maximum (mg/dl)
                  </label>
                  <input
                    type="number"
                    value={profile.glucoseTargetFastingMax}
                    onChange={(e) =>
                      onUpdateProfile({
                        glucoseTargetFastingMax: Number(e.target.value) || 100,
                      })
                    }
                    className="w-full min-h-[36px] px-2.5 py-1 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Maximalwert 2 Std. nach Mahlzeit (mg/dl)
                  </label>
                  <input
                    type="number"
                    value={profile.glucoseTargetPostMealMax}
                    onChange={(e) =>
                      onUpdateProfile({
                        glucoseTargetPostMealMax: Number(e.target.value) || 140,
                      })
                    }
                    className="w-full min-h-[36px] px-2.5 py-1 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sugar Chart Card */}
          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-800 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-800/80">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Blutzuckerverlauf ({profile.glucoseUnit})
                </h3>
                <p className="text-[11px] text-slate-600">
                  Nüchternmessungen & Messungen nach den Mahlzeiten im Zeitverlauf
                </p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-white/80 rounded-lg border border-emerald-800/60 self-start">
                {[
                  { id: 'day', label: 'Tag / 48h' },
                  { id: 'week', label: 'Woche' },
                  { id: 'month', label: 'Monat' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSugarRange(tab.id as 'day' | 'week' | 'month')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      sugarRange === tab.id
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {chartSugar.length > 0 ? (
              <div className="mt-5 overflow-x-auto">
                <svg
                  viewBox="0 0 760 220"
                  className="w-full h-52 min-w-[500px] overflow-visible"
                >
                  {/* Target Corridor Shading */}
                  <rect
                    x="45"
                    y="62"
                    width="695"
                    height="95"
                    fill="#f0fdfa"
                    rx="6"
                  />
                  {[160, 140, 100, 70].map((mgVal) => {
                    const y = 190 - ((mgVal - 50) / 130) * 160;
                    return (
                      <g key={mgVal}>
                        <line
                          x1="45"
                          y1={y}
                          x2="740"
                          y2={y}
                          stroke={mgVal === 140 || mgVal === 100 ? '#0f766e' : '#e2e8f0'}
                          strokeDasharray={mgVal === 140 || mgVal === 100 ? '4 4' : undefined}
                          strokeWidth="1"
                        />
                        <text
                          x="40"
                          y={y + 4}
                          textAnchor="end"
                          fontSize="12"
                          className="text-[12px] font-mono font-bold fill-slate-700"
                        >
                          {formatGlucose(mgVal, profile.glucoseUnit)}
                        </text>
                      </g>
                    );
                  })}

                  {chartSugar.map((entry, idx) => {
                    const x =
                      chartSugar.length === 1
                        ? 360
                        : 75 + (idx / (chartSugar.length - 1)) * 630;
                    const y = 190 - ((entry.valueMgDl - 50) / 130) * 160;
                    const next = chartSugar[idx + 1];
                    const nextX =
                      next && chartSugar.length > 1
                        ? 75 + ((idx + 1) / (chartSugar.length - 1)) * 630
                        : null;
                    const nextY = next
                      ? 190 - ((next.valueMgDl - 50) / 130) * 160
                      : null;

                    const isFasting = entry.measurementType === 'nuechtern';

                    return (
                      <g key={entry.id}>
                        {nextX !== null && nextY !== null && (
                          <line
                            x1={x}
                            y1={y}
                            x2={nextX}
                            y2={nextY}
                            stroke="#0f766e"
                            strokeWidth="2.2"
                          />
                        )}
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill={isFasting ? '#0f766e' : '#0284c7'}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          fontSize="12"
                          className="text-[12px] font-mono font-bold fill-slate-900"
                        >
                          {formatGlucose(entry.valueMgDl, profile.glucoseUnit)}
                        </text>
                        <text
                          x={x}
                          y={210}
                          textAnchor="middle"
                          fontSize="12"
                          className="text-[12px] font-mono font-bold fill-slate-800"
                        >
                          {formatShortGermanDate(entry.date)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-2.5 border-t border-emerald-800/30">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="inline-block w-3 h-3 rounded-full bg-[#0f766e] border border-white shadow-2xs shrink-0"
                        aria-hidden="true"
                      />
                      <span>= Nüchternmessung</span>
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="inline-block w-3 h-3 rounded-full bg-[#0284c7] border border-white shadow-2xs shrink-0"
                        aria-hidden="true"
                      />
                      <span>= Nach dem Essen</span>
                    </span>
                  </div>
                  <span>Einheit: {profile.glucoseUnit}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-8 text-center">
                Keine Blutzucker-Einträge für diesen Zeitraum vorhanden.
              </p>
            )}
          </div>

          {/* Sugar Entries List */}
          <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-emerald-800/80 flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Blutzucker-Protokoll mit Mahlzeiten & Wohlbefinden
              </h3>
              <span className="text-[11px] font-medium text-slate-600 whitespace-nowrap shrink-0">
                {filteredSugar.length} Einträge
              </span>
            </div>
            <div className="divide-y divide-emerald-800">
              {filteredSugar.map((item) => {
                const evaluation = evaluateGlucoseStatus(item, profile);
                return (
                  <div
                    key={item.id}
                    className="px-3.5 py-2.5 flex items-center justify-between gap-2 hover:bg-emerald-100/40 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-sm font-bold font-mono tabular-nums text-slate-900 whitespace-nowrap">
                          {formatGlucose(item.valueMgDl, profile.glucoseUnit)}{' '}
                          {profile.glucoseUnit}
                        </span>
                        <span className="text-xs font-medium text-slate-700">
                          · {getGlucoseTypeLabel(item.measurementType)} ({item.mealDistance})
                        </span>
                        <span
                          className={`text-xs font-bold whitespace-nowrap ${
                            evaluation.tone === 'emerald'
                              ? 'text-teal-700'
                              : evaluation.tone === 'amber'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          · {evaluation.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {formatGermanDate(item.date)} um {item.time} Uhr · Wohlbefinden:{' '}
                        {item.wellbeing}
                        {item.foodNote ? ` · Essen: ${item.foodNote}` : ''}
                        {item.activityNote ? ` · Bewegung: ${item.activityNote}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteSugar(item.id)}
                      className="min-h-[32px] min-w-[32px] shrink-0 flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. GEWICHT UND KÖRPERWERTE
         ===================================================================== */}
      {activeSubTab === 'weight' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2">
              <p className="text-xs font-semibold text-emerald-950 leading-tight">
                Aktuelles Gewicht
              </p>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900 leading-tight">
                  {latestWeight ? latestWeight.weightKg.toFixed(1) : '—'}
                </span>
                <span className="text-[11px] text-slate-600">kg</span>
              </div>
              {latestWeight && oldestWeight && (
                <p className="text-[11px] text-teal-800 font-medium leading-tight mt-0.5">
                  Veränderung:{' '}
                  {(latestWeight.weightKg - oldestWeight.weightKg > 0 ? '+' : '') +
                    (latestWeight.weightKg - oldestWeight.weightKg).toFixed(1)}{' '}
                  kg seit Start
                </p>
              )}
            </div>

            <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2">
              <p className="text-xs font-semibold text-emerald-950 leading-tight">
                Größe & Body-Mass-Index (BMI)
              </p>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900 leading-tight">
                  {currentBmi || '—'}
                </span>
                <span className="text-[11px] text-slate-600">
                  BMI ({profile.heightCm} cm)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                Einstufung: {bmiInfo.label}
              </p>
            </div>

            <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2">
              <p className="text-xs font-semibold text-emerald-950 leading-tight">
                Persönliches Wunschgewicht
              </p>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-lg font-bold font-mono tabular-nums text-teal-800 leading-tight">
                  {profile.targetWeightKg.toFixed(1)} kg
                </span>
                <span className="text-[11px] text-slate-600">
                  ({weightDiffToTarget > 0 ? `noch ${weightDiffToTarget} kg` : 'Ziel erreicht'})
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <label className="text-[11px] text-slate-600">Ziel:</label>
                <input
                  type="number"
                  step="0.5"
                  value={profile.targetWeightKg}
                  onChange={(e) =>
                    onUpdateProfile({
                      targetWeightKg: parseFloat(e.target.value) || 78,
                    })
                  }
                  className="w-14 px-1.5 py-0.5 rounded bg-white border border-emerald-800/60 font-mono text-[11px]"
                />
                <label className="text-[11px] text-slate-600 ml-1">cm:</label>
                <input
                  type="number"
                  value={profile.heightCm}
                  onChange={(e) =>
                    onUpdateProfile({
                      heightCm: parseInt(e.target.value, 10) || 175,
                    })
                  }
                  className="w-13 px-1.5 py-0.5 rounded bg-white border border-emerald-800/60 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2">
              <p className="text-xs font-semibold text-emerald-950 leading-tight">
                Bauchumfang & Körperfett
              </p>
              <div className="mt-0.5 flex items-baseline gap-2">
                <div>
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900 leading-tight">
                    {latestWeight?.waistCm ?? '—'}
                  </span>
                  <span className="text-[11px] text-slate-600 ml-0.5">cm</span>
                </div>
                <div>
                  <span className="text-sm font-semibold font-mono tabular-nums text-slate-800 leading-tight">
                    {latestWeight?.bodyFatPercent ?? '—'}%
                  </span>
                  <span className="text-[11px] text-slate-600 ml-0.5">KFA</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                Körperzusammensetzung
              </p>
            </div>
          </div>

          {/* Weight Chart */}
          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-800 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-800/80">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Gewichtsverlauf & Wunschgewicht-Ziellinie
                </h2>
                <p className="text-[11px] text-slate-600">
                  Kontinuierliche Entwicklung in kg inklusive persönlichem Zielwert ({profile.targetWeightKg.toFixed(1)} kg)
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenQuickEntry('weight')}
                className="min-h-[32px] px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1 self-start whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Gewicht eintragen</span>
              </button>
            </div>

            {chartWeights.length > 0 && (
              <div className="mt-3 overflow-x-auto">
                <svg
                  viewBox="0 0 760 210"
                  className="w-full h-44 min-w-[480px] overflow-visible"
                >
                  {/* Target Weight Line */}
                  {(() => {
                    const minW = Math.min(
                      profile.targetWeightKg - 2,
                      ...chartWeights.map((w) => w.weightKg - 1)
                    );
                    const maxW = Math.max(
                      profile.targetWeightKg + 2,
                      ...chartWeights.map((w) => w.weightKg + 1)
                    );
                    const span = Math.max(4, maxW - minW);
                    const targetY =
                      175 - ((profile.targetWeightKg - minW) / span) * 140;

                    return (
                      <>
                        <line
                          x1="45"
                          y1={targetY}
                          x2="740"
                          y2={targetY}
                          stroke="#0f766e"
                          strokeDasharray="5 5"
                          strokeWidth="1.5"
                        />
                        <text
                          x="738"
                          y={targetY - 6}
                          textAnchor="end"
                          className="text-[10px] font-mono fill-teal-700 font-semibold"
                        >
                          Wunschgewicht: {profile.targetWeightKg.toFixed(1)} kg
                        </text>

                        {chartWeights.map((entry, idx) => {
                          const x =
                            chartWeights.length === 1
                              ? 360
                              : 75 + (idx / (chartWeights.length - 1)) * 630;
                          const y = 175 - ((entry.weightKg - minW) / span) * 140;
                          const next = chartWeights[idx + 1];
                          const nextX =
                            next && chartWeights.length > 1
                              ? 75 + ((idx + 1) / (chartWeights.length - 1)) * 630
                              : null;
                          const nextY = next
                            ? 175 - ((next.weightKg - minW) / span) * 140
                            : null;

                          return (
                            <g key={entry.id}>
                              {nextX !== null && nextY !== null && (
                                <line
                                  x1={x}
                                  y1={y}
                                  x2={nextX}
                                  y2={nextY}
                                  stroke="#0f172a"
                                  strokeWidth="2.2"
                                />
                              )}
                              <circle
                                cx={x}
                                cy={y}
                                r="4.5"
                                fill="#0f766e"
                                stroke="#ffffff"
                                strokeWidth="1.5"
                              />
                              <text
                                x={x}
                                y={y - 10}
                                textAnchor="middle"
                                fontSize="12"
                                className="text-[12px] font-mono font-bold fill-slate-900"
                              >
                                {entry.weightKg.toFixed(1)}
                              </text>
                              <text
                                x={x}
                                y={198}
                                textAnchor="middle"
                                fontSize="12"
                                className="text-[12px] font-mono font-bold fill-slate-800"
                              >
                                {formatShortGermanDate(entry.date)}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            )}
          </div>

          {/* Weight History List */}
          <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-emerald-800/80 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-900">
                Messverlauf Gewicht, BMI, Bauchumfang & Körperfett
              </h3>
              <span className="text-[11px] font-medium text-slate-600 shrink-0">
                {sortedWeights.length} Einträge
              </span>
            </div>
            <div className="divide-y divide-emerald-800">
              {sortedWeights.map((item) => {
                const itemBmi = calculateBmi(item.weightKg, profile.heightCm);
                return (
                  <div
                    key={item.id}
                    className="px-2.5 py-1.5 flex items-center justify-between gap-2 hover:bg-emerald-100/40 transition-colors"
                  >
                    <div className="space-y-0 min-w-0 leading-tight">
                      <div className="flex flex-wrap items-baseline gap-1.5">
                        <span className="text-xs font-bold font-mono tabular-nums text-slate-900">
                          {item.weightKg.toFixed(1)} kg
                        </span>
                        <span className="text-[11px] font-mono text-slate-700">
                          · BMI {itemBmi}
                        </span>
                        {item.waistCm && (
                          <span className="text-[11px] font-mono text-slate-600">
                            · Bauchumfang {item.waistCm} cm
                          </span>
                        )}
                        {item.bodyFatPercent && (
                          <span className="text-[11px] font-mono text-slate-600">
                            · Körperfett {item.bodyFatPercent}%
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                        {formatGermanDate(item.date)} um {item.time} Uhr
                        {item.note ? ` — ${item.note}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteWeight(item.id)}
                      className="min-h-[28px] min-w-[28px] flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 shrink-0"
                      title="Löschen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. TRINK-ERINNERUNG & BEWEGUNG
         ===================================================================== */}
      {activeSubTab === 'water' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Left 7 Cols: Hydration Tracker */}
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 px-3 py-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 leading-tight">
                    Heutiges Trinkziel & Flüssigkeitsbilanz
                  </h2>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Wassermenge mit einem Klick eintragen
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-xs font-bold font-mono tabular-nums text-slate-800">
                    {totalWaterToday} / {profile.dailyWaterGoalMl} ml
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${waterPercentage}%` }}
                />
              </div>

              {/* 1-Click Water Entry Buttons */}
              <div className="mt-2.5">
                <p className="text-[11px] font-semibold text-slate-700 mb-1.5">
                  Wassermenge mit einem Klick eintragen:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { ml: 150, label: 'Kleines Glas' },
                    { ml: 250, label: 'Großes Glas' },
                    { ml: 330, label: 'Flasche' },
                    { ml: 500, label: 'Karaffe' },
                  ].map((btn) => (
                    <button
                      key={btn.ml}
                      type="button"
                      onClick={() => onAddWater(btn.ml, btn.label)}
                      className="min-h-[42px] px-2 py-1.5 rounded-lg border border-emerald-800/70 bg-white/90 hover:bg-emerald-100/80 text-teal-950 flex flex-col items-center justify-center transition-colors active:scale-[0.98]"
                    >
                      <span className="text-xs font-bold font-mono leading-tight">+{btn.ml} ml</span>
                      <span className="text-[10px] text-teal-800 leading-tight">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Goal Config ("Ziel 2000 ml" mit Auswahl & selbst eintragen) */}
              <div className="mt-2.5 pt-2 border-t border-emerald-800/50 flex flex-wrap items-center justify-between gap-2">
                <label className="text-[11px] font-semibold text-slate-700">
                  Tägliches Trinkziel auswählen oder selbst eintragen:
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  <select
                    aria-label="Tägliches Trinkziel auswählen"
                    value={
                      [1500, 1800, 2000, 2250, 2500, 3000].includes(profile.dailyWaterGoalMl)
                        ? String(profile.dailyWaterGoalMl)
                        : 'custom'
                    }
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        onUpdateProfile({
                          dailyWaterGoalMl: Number(e.target.value) || 2000,
                        });
                      }
                    }}
                    className="min-h-[28px] px-2 py-0.5 rounded-lg bg-white border border-emerald-800 font-mono font-bold text-xs text-teal-800 cursor-pointer"
                  >
                    {[1500, 1800, 2000, 2250, 2500, 3000].map((goal) => (
                      <option key={goal} value={String(goal)}>
                        Ziel {goal} ml
                      </option>
                    ))}
                    <option value="custom">Selbst eintragen…</option>
                  </select>

                  <div className="flex items-center gap-1 bg-white border border-emerald-800 rounded-lg px-2 py-0.5 min-h-[28px]">
                    <span className="text-[10px] font-semibold text-slate-600">
                      Selbst:
                    </span>
                    <input
                      type="number"
                      min={500}
                      max={6000}
                      step="50"
                      value={profile.dailyWaterGoalMl}
                      onChange={(e) =>
                        onUpdateProfile({
                          dailyWaterGoalMl: Math.max(500, Number(e.target.value) || 2000),
                        })
                      }
                      aria-label="Individuelles tägliches Trinkziel selbst eintragen (ml)"
                      className="w-16 font-mono font-bold text-xs text-teal-900 bg-transparent focus:outline-none text-right"
                    />
                    <span className="text-[10px] font-mono font-bold text-teal-800">
                      ml
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Water Logs */}
            <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
              <div className="px-2.5 py-1.5 border-b border-emerald-800/80 flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-slate-900">
                  Heutige Getränke-Einträge ({todayHydration.waterLogs.length})
                </h3>
                <span className="text-[11px] font-mono text-slate-600">
                  Summe: {totalWaterToday} ml
                </span>
              </div>
              <div className="divide-y divide-emerald-800">
                {todayHydration.waterLogs.map((log) => (
                  <div
                    key={log.id}
                    className="px-2.5 py-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="text-xs">
                      <span className="font-bold font-mono text-slate-900">
                        +{log.amountMl} ml
                      </span>
                      <span className="text-slate-700 ml-1.5">· {log.label}</span>
                      <span className="text-[11px] font-mono text-slate-500 ml-1.5">
                        · {log.time} Uhr
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveWaterLog(log.id)}
                      className="min-h-[28px] min-w-[28px] flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-600"
                      title="Eintrag entfernen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Reminder Times & Daily Activity */}
          <div className="lg:col-span-5 space-y-3">
            {/* Configurable Reminder Times */}
            <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Bell className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <h3 className="text-xs font-bold text-slate-900">
                  Trink-Erinnerungen (Frei wählbare Uhrzeiten)
                </h3>
              </div>
              <p className="text-[11px] text-slate-600 mb-2 leading-snug">
                Medical Compass erinnert dich zu diesen Uhrzeiten automatisch an ein Glas Wasser.
              </p>

              <div className="space-y-1.5 mb-2.5">
                {profile.waterReminderTimes.map((timeStr) => (
                  <div
                    key={timeStr}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/90 border border-emerald-800/60"
                  >
                    <span className="text-xs font-mono font-semibold text-slate-900">
                      {timeStr} Uhr · Trink-Erinnerung aktiv
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWaterReminder(timeStr)}
                      title="Uhrzeit entfernen"
                      aria-label="Uhrzeit entfernen"
                      className="min-h-[26px] min-w-[26px] inline-flex items-center justify-center rounded-md text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddWaterReminder} className="flex items-center gap-1.5">
                <input
                  type="time"
                  value={newReminderTime}
                  onChange={(e) => setNewReminderTime(e.target.value)}
                  className="min-h-[30px] px-2.5 py-1 rounded-lg bg-white border border-emerald-800 font-mono text-xs flex-1"
                />
                <button
                  type="submit"
                  className="min-h-[30px] px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold whitespace-nowrap shrink-0"
                >
                  + Uhrzeit hinzufügen
                </button>
              </form>
            </div>

            {/* Daily Movement & Steps */}
            <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 px-3 py-2.5">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-900">
                    Tägliche Bewegung & Schritte
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-teal-700">
                    {stepsPercentage}%
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      isEditingMovement
                        ? setIsEditingMovement(false)
                        : handleOpenMovementEditor()
                    }
                    className="p-1 rounded-md bg-white/90 hover:bg-emerald-100 border border-emerald-800/70 text-emerald-950 transition-colors cursor-pointer"
                    title="Tägliche Bewegung & Schritte bearbeiten"
                    aria-label="Tägliche Bewegung & Schritte bearbeiten"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-600">
                Heute: <strong className="font-mono">{todayHydration.steps}</strong> /{' '}
                {profile.dailyStepsGoal} Schritte ·{' '}
                <strong className="font-mono">{todayHydration.activeMinutes}</strong> /{' '}
                {profile.dailyActiveMinutesGoal} Min. aktiv
              </p>

              <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden my-2">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all"
                  style={{ width: `${stepsPercentage}%` }}
                />
              </div>

              {/* Clickable / Editable "Letzte Aktivität" row */}
              <div className="flex items-center justify-between gap-2 mb-2 px-2 py-1 rounded-lg bg-white/80 border border-emerald-800/50">
                <p
                  onClick={handleOpenMovementEditor}
                  className="text-[11px] text-slate-700 leading-snug cursor-pointer hover:text-slate-950 flex-1 min-w-0"
                  title="Klicken, um Aktivität und Werte zu ändern"
                >
                  <span className="font-semibold text-emerald-950">Letzte Aktivität:</span>{' '}
                  <span className="underline decoration-dotted underline-offset-2">
                    {todayHydration.activitySummary || 'Noch keine Notiz'}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={handleOpenMovementEditor}
                  className="px-1.5 py-0.5 rounded bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-950 text-[10px] font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Letzte Aktivität & Werte ändern"
                >
                  <Pencil className="w-2.5 h-2.5" />
                  <span>Ändern</span>
                </button>
              </div>

              {/* Inline Edit Panel for Steps, Active Minutes, Goals & Letzte Aktivität */}
              {isEditingMovement && (
                <form
                  onSubmit={handleSaveMovementEdit}
                  className="mb-2.5 p-2.5 rounded-lg bg-white/95 border border-emerald-800 space-y-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                        Schritte heute
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={50}
                        value={editStepsToday}
                        onChange={(e) => setEditStepsToday(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                        Schritte Tagesziel
                      </label>
                      <input
                        type="number"
                        min={500}
                        step={500}
                        value={editStepsGoal}
                        onChange={(e) => setEditStepsGoal(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                        Aktive Min. heute
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={5}
                        value={editActiveMinToday}
                        onChange={(e) => setEditActiveMinToday(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                        Min. Tagesziel
                      </label>
                      <input
                        type="number"
                        min={5}
                        step={5}
                        value={editActiveMinGoal}
                        onChange={(e) => setEditActiveMinGoal(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                      Letzte Aktivität (ändert Notiz & Werte, z. B. „20 Min. Spaziergang, 2000 Schritte“)
                    </label>
                    <input
                      type="text"
                      value={editActivitySummary}
                      onChange={(e) => handleActivityNoteChange(e.target.value)}
                      placeholder="z. B. 20 Min. Spaziergang (2000 Schritte)"
                      className="w-full px-2 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setIsEditingMovement(false)}
                      className="px-2 py-1 rounded border border-emerald-800 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>Abbrechen</span>
                    </button>
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Werte speichern</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateActivity(1000, 10, '10 Min. Spaziergang (+1.000 Schritte)')
                  }
                  className="min-h-[32px] px-2 py-1 rounded-lg bg-white border border-emerald-800/70 hover:bg-emerald-100/70 text-[11px] font-semibold text-slate-800 cursor-pointer"
                >
                  +1.000 Schritte (10 Min.)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateActivity(2500, 25, '25 Min. zügiges Gehen / Radfahren')
                  }
                  className="min-h-[32px] px-2 py-1 rounded-lg bg-white border border-emerald-800/70 hover:bg-emerald-100/70 text-[11px] font-semibold text-slate-800 cursor-pointer"
                >
                  +2.500 Schritte (25 Min.)
                </button>
              </div>

              {/* InfoCard: Laufband, Fahrrad, Gymnastik mit Aktivitäts-Eintragung & Protokoll */}
              <div className="mt-2.5 pt-2 border-t border-emerald-800/60 space-y-2.5">
                <p className="text-[11px] font-bold text-emerald-950">
                  Training & Sportart auswählen (Mehrfachauswahl):
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Laufband', 'Fahrrad', 'Gymnastik'] as const).map((sport) => {
                    const isSelected = selectedSportItems.includes(sport);
                    return (
                      <button
                        key={sport}
                        type="button"
                        onClick={() => toggleSportItem(sport)}
                        className={`min-h-[32px] px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                            : 'bg-white text-slate-800 border-emerald-800/70 hover:bg-emerald-100/70'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 shrink-0" />}
                        <span>{sport}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 1. Laufband Option: Minuten, Kalorien, Datum */}
                {selectedSportItems.includes('Laufband') && (
                  <div className="p-2.5 rounded-lg bg-white/95 border border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-950">
                        Laufband – Aktivität eintragen
                      </span>
                      <button
                        type="button"
                        onClick={handleAddTreadmillLog}
                        className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Eintragen</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Minuten
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={treadmillMinutes}
                          onChange={(e) => setTreadmillMinutes(e.target.value)}
                          placeholder="Min."
                          className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Kalorien (kcal)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={treadmillCalories}
                          onChange={(e) => setTreadmillCalories(e.target.value)}
                          placeholder="kcal"
                          className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Datum
                        </label>
                        <input
                          type="date"
                          value={treadmillDate}
                          onChange={(e) => setTreadmillDate(e.target.value)}
                          className="w-full px-1.5 py-1 rounded border border-emerald-800 bg-white font-mono text-[11px] text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Fahrrad Option: Minuten, Km, Datum */}
                {selectedSportItems.includes('Fahrrad') && (
                  <div className="p-2.5 rounded-lg bg-white/95 border border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-950">
                        Fahrrad – Aktivität eintragen
                      </span>
                      <button
                        type="button"
                        onClick={handleAddBikeLog}
                        className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Eintragen</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Minuten
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={bikeMinutes}
                          onChange={(e) => setBikeMinutes(e.target.value)}
                          placeholder="Min."
                          className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Km
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min={0}
                          value={bikeKm}
                          onChange={(e) => setBikeKm(e.target.value)}
                          placeholder="Km"
                          className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Datum
                        </label>
                        <input
                          type="date"
                          value={bikeDate}
                          onChange={(e) => setBikeDate(e.target.value)}
                          className="w-full px-1.5 py-1 rounded border border-emerald-800 bg-white font-mono text-[11px] text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Gymnastik Option: Minuten, Aktivitäts-Kategorie, Datum */}
                {selectedSportItems.includes('Gymnastik') && (
                  <div className="p-2.5 rounded-lg bg-white/95 border border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-950">
                        Gymnastik – Aktivität eintragen
                      </span>
                      <button
                        type="button"
                        onClick={handleAddGymLog}
                        className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Eintragen</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Minuten
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={gymMinutes}
                          onChange={(e) => setGymMinutes(e.target.value)}
                          placeholder="Min."
                          className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Aktivitäts-Kategorie
                        </label>
                        <select
                          value={gymCategory}
                          onChange={(e) =>
                            setGymCategory(
                              e.target.value as
                                | 'Mobilisation & Aufwärmen'
                                | 'Kräftigung'
                                | 'Dehnen'
                                | 'Koordination & Gleichgewicht'
                            )
                          }
                          className="w-full px-1.5 py-1 rounded border border-emerald-800 bg-white text-[11px] font-semibold text-slate-900"
                        >
                          <option value="Mobilisation & Aufwärmen">
                            Mobilisation & Aufwärmen
                          </option>
                          <option value="Kräftigung">Kräftigung</option>
                          <option value="Dehnen">Dehnen</option>
                          <option value="Koordination & Gleichgewicht">
                            Koordination & Gleichgewicht
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Datum
                        </label>
                        <input
                          type="date"
                          value={gymDate}
                          onChange={(e) => setGymDate(e.target.value)}
                          className="w-full px-1.5 py-1 rounded border border-emerald-800 bg-white font-mono text-[11px] text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Gespeicherte Trainings-Einträge mit Datum, Änderung-Icon & Löschen-Icon */}
                <div className="rounded-lg bg-white/95 border border-emerald-800 overflow-hidden">
                  <div className="px-2.5 py-1.5 bg-emerald-100/70 border-b border-emerald-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-950">
                      Gespeicherte Trainings-Aktivitäten ({sportLogs.length})
                    </span>
                  </div>
                  <div className="divide-y divide-emerald-800">
                    {sportLogs.map((log) => (
                      <div key={log.id} className="px-2.5 py-1.5">
                        {editingSportId === log.id && editSportDraft ? (
                          <div className="space-y-2 py-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-950">
                                {editSportDraft.sportType} bearbeiten
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              <div>
                                <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                                  Minuten
                                </label>
                                <input
                                  type="number"
                                  min={1}
                                  value={editSportDraft.minutes}
                                  onChange={(e) =>
                                    setEditSportDraft({
                                      ...editSportDraft,
                                      minutes: Math.max(1, parseInt(e.target.value, 10) || 1),
                                    })
                                  }
                                  className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                                />
                              </div>

                              {editSportDraft.sportType === 'Laufband' && (
                                <div>
                                  <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                                    Kalorien (kcal)
                                  </label>
                                  <input
                                    type="number"
                                    min={0}
                                    value={editSportDraft.calories ?? 0}
                                    onChange={(e) =>
                                      setEditSportDraft({
                                        ...editSportDraft,
                                        calories: Math.max(
                                          0,
                                          parseInt(e.target.value, 10) || 0
                                        ),
                                      })
                                    }
                                    className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                                  />
                                </div>
                              )}

                              {editSportDraft.sportType === 'Fahrrad' && (
                                <div>
                                  <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                                    Km
                                  </label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    min={0}
                                    value={editSportDraft.distanceKm ?? 0}
                                    onChange={(e) =>
                                      setEditSportDraft({
                                        ...editSportDraft,
                                        distanceKm: Math.max(
                                          0,
                                          parseFloat(e.target.value) || 0
                                        ),
                                      })
                                    }
                                    className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                                  />
                                </div>
                              )}

                              {editSportDraft.sportType === 'Gymnastik' && (
                                <div>
                                  <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                                    Kategorie
                                  </label>
                                  <select
                                    value={
                                      editSportDraft.gymCategory ||
                                      'Mobilisation & Aufwärmen'
                                    }
                                    onChange={(e) =>
                                      setEditSportDraft({
                                        ...editSportDraft,
                                        gymCategory: e.target.value as
                                          | 'Mobilisation & Aufwärmen'
                                          | 'Kräftigung'
                                          | 'Dehnen'
                                          | 'Koordination & Gleichgewicht',
                                      })
                                    }
                                    className="w-full px-1 py-1 rounded border border-emerald-800 bg-white text-[10px] font-semibold text-slate-900"
                                  >
                                    <option value="Mobilisation & Aufwärmen">
                                      Mobilisation & Aufwärmen
                                    </option>
                                    <option value="Kräftigung">Kräftigung</option>
                                    <option value="Dehnen">Dehnen</option>
                                    <option value="Koordination & Gleichgewicht">
                                      Koordination & Gleichgewicht
                                    </option>
                                  </select>
                                </div>
                              )}

                              <div>
                                <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                                  Datum
                                </label>
                                <input
                                  type="date"
                                  value={editSportDraft.date}
                                  onChange={(e) =>
                                    setEditSportDraft({
                                      ...editSportDraft,
                                      date: e.target.value,
                                    })
                                  }
                                  className="w-full px-1.5 py-1 rounded border border-emerald-800 bg-white font-mono text-[11px] text-slate-900"
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSportId(null);
                                  setEditSportDraft(null);
                                }}
                                className="px-2 py-0.5 rounded border border-emerald-800 bg-white text-[10px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                                <span>Abbrechen</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveEditedSportLog}
                                className="px-2.5 py-0.5 rounded bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                <span>Speichern</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-bold text-slate-900">
                                  {log.sportType}:
                                </span>
                                <span className="text-[11px] font-mono font-semibold text-teal-800">
                                  {log.minutes} Min.
                                </span>
                                {log.sportType === 'Laufband' && (
                                  <span className="text-[11px] font-mono text-slate-700">
                                    · {log.calories ?? 0} kcal
                                  </span>
                                )}
                                {log.sportType === 'Fahrrad' && (
                                  <span className="text-[11px] font-mono text-slate-700">
                                    · {log.distanceKm ?? 0} km
                                  </span>
                                )}
                                {log.sportType === 'Gymnastik' && (
                                  <span className="text-[11px] font-semibold text-emerald-900">
                                    · {log.gymCategory || 'Mobilisation & Aufwärmen'}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] font-mono text-slate-500">
                                Datum: {formatGermanDate(log.date)}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => startEditingSportLog(log)}
                                className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-800/70 text-emerald-950 transition-colors cursor-pointer"
                                title="Eintrag ändern / bearbeiten"
                                aria-label="Eintrag ändern"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSportLog(log.id)}
                                className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 transition-colors cursor-pointer"
                                title="Eintrag löschen"
                                aria-label="Eintrag löschen"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* New Card: "Schlafdiagnostik" mit täglicher Eintragung, Änderung-Icon & Löschen-Icon */}
            <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 px-3 py-2.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-slate-900">
                  Schlafdiagnostik (Tägliche Eintragung)
                </h3>
                <button
                  type="button"
                  onClick={handleAddSleepLog}
                  className="px-2.5 py-1 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  <span>Eintragen</span>
                </button>
              </div>

              {/* Formular für tägliche Schlaf-Eintragung */}
              <div className="p-2.5 rounded-lg bg-white/95 border border-emerald-800 space-y-2">
                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                      Schlafdauer (Std.)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="16"
                      value={sleepDurationHours}
                      onChange={(e) => setSleepDurationHours(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                      Datum
                    </label>
                    <input
                      type="date"
                      value={sleepDate}
                      onChange={(e) => setSleepDate(e.target.value)}
                      className="w-full px-1.5 py-1 rounded border border-emerald-800 bg-white font-mono text-[11px] text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                      Befund / Notiz
                    </label>
                    <input
                      type="text"
                      placeholder="z. B. Ruhige Atmung"
                      value={sleepNote}
                      onChange={(e) => setSleepNote(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-emerald-950 mb-1">
                    Schlafqualität auswählen (Mehrfachauswahl):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      'Erholsamer Schlaf',
                      'Unruhiger Schlaf',
                      'Durchschlafstörung',
                      'Schnarchen / Apnoe-Hinweis',
                    ].map((tag) => {
                      const isSelected = sleepQualityTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleSleepQualityTag(tag)}
                          className={`px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                              : 'bg-white text-slate-800 border-emerald-800/70 hover:bg-emerald-100/70'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 shrink-0" />}
                          <span>{tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Gespeicherte tägliche Schlafdiagnostik-Einträge mit Datum, Änderung-Icon & Löschen-Icon */}
              <div className="rounded-lg bg-white/95 border border-emerald-800 overflow-hidden">
                <div className="px-2.5 py-1.5 bg-emerald-100/70 border-b border-emerald-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-950">
                    Gespeicherte Schlafdiagnostik ({sleepLogs.length})
                  </span>
                </div>
                <div className="divide-y divide-emerald-800">
                  {sleepLogs.map((log) => (
                    <div key={log.id} className="px-2.5 py-1.5">
                      {editingSleepId === log.id && editSleepDraft ? (
                        <div className="space-y-2 py-1">
                          <div className="grid grid-cols-3 gap-1.5">
                            <div>
                              <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                                Schlafdauer (Std.)
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                min="1"
                                max="16"
                                value={editSleepDraft.durationHours}
                                onChange={(e) =>
                                  setEditSleepDraft({
                                    ...editSleepDraft,
                                    durationHours: Math.max(
                                      1,
                                      parseFloat(e.target.value) || 1
                                    ),
                                  })
                                }
                                className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                                Datum
                              </label>
                              <input
                                type="date"
                                value={editSleepDraft.date}
                                onChange={(e) =>
                                  setEditSleepDraft({
                                    ...editSleepDraft,
                                    date: e.target.value,
                                  })
                                }
                                className="w-full px-1.5 py-1 rounded border border-emerald-800 bg-white font-mono text-[11px] text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                                Befund / Notiz
                              </label>
                              <input
                                type="text"
                                value={editSleepDraft.note}
                                onChange={(e) =>
                                  setEditSleepDraft({
                                    ...editSleepDraft,
                                    note: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {[
                              'Erholsamer Schlaf',
                              'Unruhiger Schlaf',
                              'Durchschlafstörung',
                              'Schnarchen / Apnoe-Hinweis',
                            ].map((tag) => {
                              const isSel = editSleepDraft.qualityTags.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => {
                                    const nextTags = isSel
                                      ? editSleepDraft.qualityTags.filter((t) => t !== tag)
                                      : [...editSleepDraft.qualityTags, tag];
                                    setEditSleepDraft({
                                      ...editSleepDraft,
                                      qualityTags:
                                        nextTags.length > 0
                                          ? nextTags
                                          : ['Erholsamer Schlaf'],
                                    });
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer ${
                                    isSel
                                      ? 'bg-teal-700 text-white border-teal-800'
                                      : 'bg-white text-slate-700 border-emerald-800/60'
                                  }`}
                                >
                                  {tag}
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSleepId(null);
                                setEditSleepDraft(null);
                              }}
                              className="px-2 py-0.5 rounded border border-emerald-800 bg-white text-[10px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                              <span>Abbrechen</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveEditedSleepLog}
                              className="px-2.5 py-0.5 rounded bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              <span>Speichern</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-mono font-bold text-teal-800">
                                {log.durationHours} Std.
                              </span>
                              <span className="text-[11px] font-semibold text-slate-900">
                                · {log.qualityTags.join(', ')}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 leading-snug">
                              <span className="font-mono text-slate-500">
                                Datum: {formatGermanDate(log.date)}
                              </span>
                              {log.note ? ` · ${log.note}` : ''}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEditingSleepLog(log)}
                              className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-800/70 text-emerald-950 transition-colors cursor-pointer"
                              title="Schlaf-Eintrag ändern"
                              aria-label="Schlaf-Eintrag ändern"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSleepLog(log.id)}
                              className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 transition-colors cursor-pointer"
                              title="Schlaf-Eintrag löschen"
                              aria-label="Schlaf-Eintrag löschen"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* New Card: "Schmerzen" */}
            <PainTrackerCard
              painEntries={painEntries}
              onAddPainEntry={onAddPainEntry}
              onUpdatePainEntry={onUpdatePainEntry}
              onDeletePainEntry={onDeletePainEntry}
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          6. SAUERSTOFFSÄTTIGUNG (SpO2)
         ===================================================================== */}
      {activeSubTab === 'spo2' && (() => {
        const sortedSpo2 = [...spo2Entries].sort((a, b) =>
          `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
        );
        const chartSpo2 = [...sortedSpo2].reverse();
        const latestSpo2 = sortedSpo2[0];
        const avgSpo2 = sortedSpo2.length
          ? (
              sortedSpo2.reduce((sum, item) => sum + item.spo2Percent, 0) /
              sortedSpo2.length
            ).toFixed(1)
          : '—';

        const classifySpo2 = (val: number) => {
          if (val >= 95) {
            return { label: 'Normal (95–100 %)', color: 'text-teal-800 bg-emerald-100 border-emerald-800/40' };
          }
          if (val >= 90) {
            return { label: 'Leicht erniedrigt (90–94 %)', color: 'text-amber-800 bg-amber-100 border-amber-700/40' };
          }
          return { label: 'Niedrig (< 90 %)', color: 'text-rose-800 bg-rose-100 border-rose-700/40' };
        };

        return (
          <div className="space-y-3">
            {/* Top KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2">
                <div className="flex items-center justify-between gap-1.5">
                  <p className="text-xs font-semibold text-emerald-950 leading-tight">
                    Aktuelle Sauerstoffsättigung
                  </p>
                  <span
                    className="text-xs font-extrabold font-mono leading-none select-none shrink-0 text-blue-600"
                    aria-hidden="true"
                  >
                    O₂
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900 leading-tight">
                    {latestSpo2 ? `${latestSpo2.spo2Percent} %` : '—'}
                  </span>
                  <span className="text-[11px] text-blue-600 font-bold font-mono">O₂</span>
                </div>
                {latestSpo2 && (
                  <p className="text-[11px] text-teal-800 font-medium leading-tight mt-0.5">
                    {classifySpo2(latestSpo2.spo2Percent).label}
                  </p>
                )}
              </div>

              <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2">
                <div className="flex items-center justify-between gap-1.5">
                  <p className="text-xs font-semibold text-emerald-950 leading-tight">
                    Durchschnitt (Ø O₂)
                  </p>
                  <span
                    className="text-xs font-extrabold font-mono leading-none select-none shrink-0 text-blue-600"
                    aria-hidden="true"
                  >
                    O₂
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900 leading-tight">
                    {avgSpo2} %
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  Aus {sortedSpo2.length} gespeicherten Messungen
                </p>
              </div>

              <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2">
                <p className="text-xs font-semibold text-emerald-950 leading-tight">
                  Puls bei letzter Messung
                </p>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900 leading-tight">
                    {latestSpo2 ? latestSpo2.pulse : '—'}
                  </span>
                  <span className="text-[11px] text-slate-600">bpm</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  {latestSpo2 ? latestSpo2.context : 'In Ruhe'}
                </p>
              </div>

              <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2">
                <p className="text-xs font-semibold text-emerald-950 leading-tight">
                  Referenz- & Zielbereich
                </p>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-lg font-bold font-mono tabular-nums text-teal-800 leading-tight">
                    95 – 100 %
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  Optimaler Bereich für Erwachsene
                </p>
              </div>
            </div>

            {/* Chart & New Measurement Card */}
            <div className="bg-emerald-50/70 rounded-2xl border border-emerald-800 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-800/60">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-blue-600 font-mono font-extrabold">O₂</span>
                    <span>Sauerstoffsättigung im Verlauf</span>
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    Blutsauerstoffgehalt in Prozent (%) · Grüner Zielkorridor: 95 % bis 100 %
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSpo2Form((prev) => !prev)}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 self-start whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Sauerstoffsättigung eintragen</span>
                </button>
              </div>

              {/* Inline Add SpO2 Form */}
              {showSpo2Form && (
                <form
                  onSubmit={handleAddSpo2Entry}
                  className="mt-4 p-4 rounded-xl bg-emerald-100/70 border border-emerald-800 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">
                        Sauerstoffsättigung (%)
                      </label>
                      <input
                        type="number"
                        min={70}
                        max={100}
                        required
                        value={newSpo2Val}
                        onChange={(e) => setNewSpo2Val(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-emerald-800 bg-white font-mono text-sm font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">
                        Puls (bpm)
                      </label>
                      <input
                        type="number"
                        min={30}
                        max={220}
                        required
                        value={newSpo2Pulse}
                        onChange={(e) => setNewSpo2Pulse(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-emerald-800 bg-white font-mono text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">
                        Datum
                      </label>
                      <input
                        type="date"
                        required
                        value={newSpo2Date}
                        onChange={(e) => setNewSpo2Date(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-emerald-800 bg-white text-xs font-mono text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">
                        Uhrzeit
                      </label>
                      <input
                        type="time"
                        required
                        value={newSpo2Time}
                        onChange={(e) => setNewSpo2Time(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-emerald-800 bg-white text-xs font-mono text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                        Messsituation auswählen (Mehrfachauswahl möglich)
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Morgens in Ruhe',
                          'In Ruhe',
                          'Nach Bewegung / Sport',
                          'Nach Spaziergang',
                          'Abends in Ruhe',
                        ].map((preset) => {
                          const isSelected = newSpo2Contexts.includes(preset);
                          return (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => toggleSpo2Context(preset)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 border cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                                  : 'bg-white text-slate-800 border-emerald-800/70 hover:bg-emerald-50'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 shrink-0" />}
                              <span>{preset}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* New InfoCard under "Messsituation auswählen": Laufband, Fahrrad, Gymnastik */}
                    <div className="bg-emerald-50/90 border border-emerald-800 rounded-xl px-3 py-2 space-y-1.5">
                      <p className="text-xs font-bold text-emerald-950">
                        Sport & Aktivität
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['Laufband', 'Fahrrad', 'Gymnastik'] as const).map((sport) => {
                          const isSelected = newSpo2Contexts.includes(sport);
                          return (
                            <button
                              key={sport}
                              type="button"
                              onClick={() => toggleSpo2Context(sport)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 border cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                                  : 'bg-white text-slate-800 border-emerald-800/70 hover:bg-emerald-50'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 shrink-0" />}
                              <span>{sport}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* New Card: "Schlafdiagnostik" */}
                    <div className="bg-emerald-50/90 border border-emerald-800 rounded-xl px-3 py-2 space-y-1.5">
                      <p className="text-xs font-bold text-emerald-950">
                        Schlafdiagnostik
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Erholsamer Schlaf',
                          'Unruhiger Schlaf',
                          'Durchschlafstörung',
                          'Schnarchen / Apnoe-Hinweis',
                        ].map((diag) => {
                          const isSelected = newSpo2Contexts.includes(diag);
                          return (
                            <button
                              key={diag}
                              type="button"
                              onClick={() => toggleSpo2Context(diag)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 border cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                                  : 'bg-white text-slate-800 border-emerald-800/70 hover:bg-emerald-50'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 shrink-0" />}
                              <span>{diag}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">
                        Notiz (optional)
                      </label>
                      <input
                        type="text"
                        value={newSpo2Note}
                        onChange={(e) => setNewSpo2Note(e.target.value)}
                        placeholder="z.B. Ruhige Atmung, Fingerpulsoximeter"
                        className="w-full px-3 py-1.5 rounded-lg border border-emerald-800 bg-white text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowSpo2Form(false)}
                      className="px-3 py-1.5 rounded-lg border border-emerald-800 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold cursor-pointer"
                    >
                      Speichern
                    </button>
                  </div>
                </form>
              )}

              {/* SVG Line Chart */}
              {chartSpo2.length > 0 && (
                <div className="mt-5 overflow-x-auto">
                  <svg
                    viewBox="0 0 760 200"
                    className="w-full h-44 min-w-[480px] overflow-visible"
                  >
                    {/* Normal Target Band (95% - 100%) */}
                    <rect
                      x="45"
                      y="20"
                      width="695"
                      height="75"
                      fill="#d1fae5"
                      fillOpacity="0.6"
                      rx="6"
                    />
                    {[100, 98, 95, 92, 90].map((pct) => {
                      const y = 170 - ((pct - 88) / 12) * 150;
                      return (
                        <g key={pct}>
                          <line
                            x1="45"
                            y1={y}
                            x2="740"
                            y2={y}
                            stroke={pct === 95 ? '#065f46' : '#cbd5e1'}
                            strokeDasharray={pct === 95 ? '4 4' : undefined}
                            strokeWidth={pct === 95 ? '1.5' : '1'}
                          />
                          <text
                            x="40"
                            y={y + 4}
                            textAnchor="end"
                            fontSize="12"
                            className="text-[12px] font-mono font-bold fill-slate-700"
                          >
                            {pct}%
                          </text>
                        </g>
                      );
                    })}

                    {chartSpo2.map((entry, idx) => {
                      const x =
                        chartSpo2.length === 1
                          ? 360
                          : 75 + (idx / (chartSpo2.length - 1)) * 630;
                      const clamped = Math.min(100, Math.max(88, entry.spo2Percent));
                      const y = 170 - ((clamped - 88) / 12) * 150;
                      const next = chartSpo2[idx + 1];
                      const nextX =
                        next && chartSpo2.length > 1
                          ? 75 + ((idx + 1) / (chartSpo2.length - 1)) * 630
                          : null;
                      const nextClamped = next
                        ? Math.min(100, Math.max(88, next.spo2Percent))
                        : null;
                      const nextY =
                        nextClamped !== null
                          ? 170 - ((nextClamped - 88) / 12) * 150
                          : null;

                      return (
                        <g key={entry.id}>
                          {nextX !== null && nextY !== null && (
                            <line
                              x1={x}
                              y1={y}
                              x2={nextX}
                              y2={nextY}
                              stroke="#065f46"
                              strokeWidth="2.2"
                            />
                          )}
                          <circle
                            cx={x}
                            cy={y}
                            r="5"
                            fill={entry.spo2Percent >= 95 ? '#065f46' : '#d97706'}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text
                            x={x}
                            y={y - 10}
                            textAnchor="middle"
                            fontSize="12"
                            className="text-[12px] font-mono font-bold fill-slate-900"
                          >
                            {entry.spo2Percent}%
                          </text>
                          <text
                            x={x}
                            y={192}
                            textAnchor="middle"
                            fontSize="12"
                            className="text-[12px] font-mono font-bold fill-slate-800"
                          >
                            {formatShortGermanDate(entry.date)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>

            {/* SpO2 History Table / Log Card */}
            <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
              <div className="px-2.5 py-1.5 border-b border-emerald-800/80 flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="text-blue-600 font-mono font-extrabold">O₂</span>
                  <span>Messprotokoll Sauerstoffsättigung</span>
                </h3>
                <span className="text-[11px] font-semibold text-emerald-950 shrink-0">
                  {sortedSpo2.length} Einträge
                </span>
              </div>
              <div className="divide-y divide-emerald-800">
                {sortedSpo2.map((item) => {
                  const status = classifySpo2(item.spo2Percent);
                  return (
                    <div
                      key={item.id}
                      className="px-2.5 py-1.5 flex items-center justify-between gap-2 hover:bg-emerald-100/40 transition-colors"
                    >
                      <div className="space-y-0 min-w-0 leading-tight">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold font-mono tabular-nums text-slate-900">
                            {item.spo2Percent} %
                          </span>
                          <span className="text-[11px] font-extrabold font-mono text-blue-600">
                            O₂
                          </span>
                          <span className="text-[11px] font-mono text-slate-700">
                            · Puls {item.pulse} bpm
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                          {formatGermanDate(item.date)} um {item.time} Uhr · {item.context}
                          {item.note ? ` — ${item.note}` : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSpo2Entry(item.id)}
                        title="Eintrag löschen"
                        aria-label="Eintrag löschen"
                        className="min-h-[28px] min-w-[28px] inline-flex items-center justify-center rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* =====================================================================
          6. LABORWERTE
         ===================================================================== */}
      {activeSubTab === 'labs' && (
        <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-emerald-800/80 flex items-center justify-between gap-2">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap">
              Laborwerte & Befunde
            </h2>

            <button
              type="button"
              onClick={() => setShowAddLabRow(!showAddLabRow)}
              className="px-2 py-1 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              +Hinzufügen
            </button>
          </div>

          {showAddLabRow && (
            <form
              onSubmit={handleAddLabRow}
              className="p-3 bg-white/90 border-b border-emerald-800/60 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center"
            >
              <input
                type="text"
                required
                placeholder="Untersuchung (z. B. TSH)"
                value={newLabName}
                onChange={(e) => setNewLabName(e.target.value)}
                className="min-h-[30px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white text-xs text-slate-900"
              />
              <input
                type="text"
                placeholder="Resultat (z. B. 1,9 mU/l)"
                value={newLabResult}
                onChange={(e) => setNewLabResult(e.target.value)}
                className="min-h-[30px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white text-xs font-mono text-slate-900"
              />
              <input
                type="text"
                placeholder="Referenzwerte (z. B. 0,4 – 4,0)"
                value={newLabReference}
                onChange={(e) => setNewLabReference(e.target.value)}
                className="min-h-[30px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white text-xs font-mono text-slate-900"
              />
              <div className="flex items-center gap-1.5">
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold whitespace-nowrap cursor-pointer"
                >
                  +Hinzufügen
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLabRow(false)}
                  className="px-2 py-1 rounded-md border border-emerald-800 bg-white text-[11px] font-medium text-slate-700 cursor-pointer"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-emerald-800/70 bg-emerald-100/60 text-xs font-bold text-slate-900">
                  <th className="py-2.5 px-3 sm:px-4">Untersuchung</th>
                  <th className="py-2.5 px-3 sm:px-4">Resultat</th>
                  <th className="py-2.5 px-3 sm:px-4">Referenzwerte</th>
                  <th className="py-2.5 px-2 w-9 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-800 text-xs">
                {labValues.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-emerald-100/40 transition-colors"
                  >
                    <td className="py-2 px-3 sm:px-4 font-semibold text-slate-900">
                      {row.untersuchung}
                    </td>
                    <td className="py-1.5 px-3 sm:px-4">
                      <input
                        type="text"
                        value={row.resultat}
                        onChange={(e) =>
                          handleUpdateLabField(row.id, 'resultat', e.target.value)
                        }
                        placeholder="Resultat..."
                        className="w-full max-w-[160px] min-h-[28px] px-2 py-1 rounded-md border border-emerald-800/60 bg-white/90 font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-700"
                      />
                    </td>
                    <td className="py-1.5 px-3 sm:px-4">
                      <input
                        type="text"
                        value={row.referenzwerte}
                        onChange={(e) =>
                          handleUpdateLabField(row.id, 'referenzwerte', e.target.value)
                        }
                        placeholder="Referenzwerte..."
                        className="w-full max-w-[180px] min-h-[28px] px-2 py-1 rounded-md border border-emerald-800/60 bg-white/90 font-mono text-xs text-slate-700 focus:outline-none focus:border-teal-700"
                      />
                    </td>
                    <td className="py-1.5 px-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteLabRow(row.id)}
                        className="min-h-[28px] min-w-[28px] inline-flex items-center justify-center rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Zeile löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
