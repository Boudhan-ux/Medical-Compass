import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  HeartPulse,
  Pill,
  Stethoscope,
  Calendar,
  FileText,
  Bell,
  X,
  User,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import {
  AppLanguage,
  BloodPressureEntry,
  BloodSugarEntry,
  DailyHydrationActivity,
  DoctorAppointment,
  DoctorQuestion,
  MedicationIntakeLog,
  MedicationItem,
  PainEntry,
  PreventiveCheckItem,
  UserHealthProfile,
  WeightBodyEntry,
} from './types/health';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_BP_ENTRIES,
  INITIAL_DOCTOR_QUESTIONS,
  INITIAL_HYDRATION_ACTIVITY,
  INITIAL_MEDICATIONS,
  INITIAL_MED_LOGS,
  INITIAL_PAIN_ENTRIES,
  INITIAL_PREVENTIVE_CHECKS,
  INITIAL_SUGAR_ENTRIES,
  INITIAL_USER_PROFILE,
  INITIAL_WEIGHT_ENTRIES,
} from './data/initialHealthData';
import {
  getCurrentTimeHm,
  getDaysInFutureIso,
  getTodayIso,
} from './utils/healthHelpers';
import { DashboardView } from './components/DashboardView';
import { VitalsSubTab, VitalsView } from './components/VitalsView';
import { MedicationsView } from './components/MedicationsView';
import { PreventiveDoctorsView } from './components/PreventiveDoctorsView';
import { CalendarView } from './components/CalendarView';
import { HealthReportView } from './components/HealthReportView';
import { QuickEntryModal, QuickEntryTab } from './components/QuickEntryModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { PrivacySecurityModal } from './components/PrivacySecurityModal';
import { UI_LABELS, useAutoTranslateDOM } from './utils/i18n';
import { usePWAInstall } from './hooks/usePWAInstall';

type MainSection =
  | 'dashboard'
  | 'vitals'
  | 'medications'
  | 'doctors'
  | 'calendar'
  | 'report';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Safeguard against storage quota or restricted webview storage
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<MainSection>('dashboard');
  const [vitalsSubTab, setVitalsSubTab] = useState<VitalsSubTab>('bp');

  // Quick Entry Modal State
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [quickModalTab, setQuickModalTab] = useState<QuickEntryTab>('bp');

  // Profile & Settings Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Privacy & Security Modal State (DSGVO / Play Store / PIN)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [appPin, setAppPin] = useState<string | null>(() =>
    loadFromStorage<string | null>('gesundlife_app_pin_v1', null)
  );
  const [isAppLocked, setIsAppLocked] = useState<boolean>(() =>
    Boolean(loadFromStorage<string | null>('gesundlife_app_pin_v1', null))
  );
  const [unlockPinInput, setUnlockPinInput] = useState('');
  const [unlockError, setUnlockError] = useState(false);
  const [confirmForgotPinReset, setConfirmForgotPinReset] = useState(false);

  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(() =>
    loadFromStorage<boolean>('gesundlife_privacy_accepted_v1', false)
  );

  // In-App Notification Banner State
  const [toastNotification, setToastNotification] = useState<{
    title: string;
    body: string;
  } | null>(null);

  const { isOnline } = usePWAInstall();

  // Persistent State
  const [dataResetVersion, setDataResetVersion] = useState(0);
  const [profile, setProfile] = useState<UserHealthProfile>(() =>
    loadFromStorage('gesundlife_profile_v1', INITIAL_USER_PROFILE)
  );
  const currentLanguage: AppLanguage =
    profile.language === 'en' ||
    profile.language === 'es' ||
    profile.language === 'fr' ||
    profile.language === 'ar'
      ? profile.language
      : 'de';
  const uiLabels = UI_LABELS[currentLanguage];
  useAutoTranslateDOM(currentLanguage);
  const [bpEntries, setBpEntries] = useState<BloodPressureEntry[]>(() =>
    loadFromStorage('gesundlife_bp_v1', INITIAL_BP_ENTRIES)
  );
  const [sugarEntries, setSugarEntries] = useState<BloodSugarEntry[]>(() =>
    loadFromStorage('gesundlife_sugar_v1', INITIAL_SUGAR_ENTRIES)
  );
  const [weightEntries, setWeightEntries] = useState<WeightBodyEntry[]>(() =>
    loadFromStorage('gesundlife_weight_v1', INITIAL_WEIGHT_ENTRIES)
  );
  const [medications, setMedications] = useState<MedicationItem[]>(() =>
    loadFromStorage('gesundlife_meds_v1', INITIAL_MEDICATIONS)
  );
  const [medLogs, setMedLogs] = useState<MedicationIntakeLog[]>(() =>
    loadFromStorage('gesundlife_medlogs_v1', INITIAL_MED_LOGS)
  );
  const [hydrationByDate, setHydrationByDate] = useState<
    Record<string, DailyHydrationActivity>
  >(() => loadFromStorage('gesundlife_hydration_v1', INITIAL_HYDRATION_ACTIVITY));
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(() =>
    loadFromStorage('gesundlife_appointments_v1', INITIAL_APPOINTMENTS)
  );
  const [preventiveChecks, setPreventiveChecks] = useState<PreventiveCheckItem[]>(() =>
    loadFromStorage('gesundlife_preventive_v1', INITIAL_PREVENTIVE_CHECKS)
  );
  const [doctorQuestions, setDoctorQuestions] = useState<DoctorQuestion[]>(() =>
    loadFromStorage('gesundlife_questions_v1', INITIAL_DOCTOR_QUESTIONS)
  );
  const [painEntries, setPainEntries] = useState<PainEntry[]>(() =>
    loadFromStorage('gesundlife_pain_logs_v1', INITIAL_PAIN_ENTRIES)
  );

  // Sync changes safely to localStorage
  useEffect(() => {
    saveToStorage('gesundlife_profile_v1', profile);
  }, [profile]);
  useEffect(() => {
    saveToStorage('gesundlife_bp_v1', bpEntries);
  }, [bpEntries]);
  useEffect(() => {
    saveToStorage('gesundlife_sugar_v1', sugarEntries);
  }, [sugarEntries]);
  useEffect(() => {
    saveToStorage('gesundlife_weight_v1', weightEntries);
  }, [weightEntries]);
  useEffect(() => {
    saveToStorage('gesundlife_meds_v1', medications);
  }, [medications]);
  useEffect(() => {
    saveToStorage('gesundlife_medlogs_v1', medLogs);
  }, [medLogs]);
  useEffect(() => {
    saveToStorage('gesundlife_hydration_v1', hydrationByDate);
  }, [hydrationByDate]);
  useEffect(() => {
    saveToStorage('gesundlife_appointments_v1', appointments);
  }, [appointments]);
  useEffect(() => {
    saveToStorage('gesundlife_preventive_v1', preventiveChecks);
  }, [preventiveChecks]);
  useEffect(() => {
    saveToStorage('gesundlife_questions_v1', doctorQuestions);
  }, [doctorQuestions]);
  useEffect(() => {
    saveToStorage('gesundlife_pain_logs_v1', painEntries);
  }, [painEntries]);

  const todayIso = getTodayIso();
  const todayHydration: DailyHydrationActivity = hydrationByDate[todayIso] || {
    date: todayIso,
    waterLogs: [],
    steps: 0,
    activeMinutes: 0,
    activitySummary: '',
  };

  // Handlers
  const handleUpdateProfile = (patch: Partial<UserHealthProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  };

  const triggerNotification = (title: string, body: string) => {
    setToastNotification({ title, body });
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, { body, icon: '/pwa-192x192.png' });
        } catch {
          // Fallback to in-app toast banner already shown
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            try {
              new Notification(title, { body, icon: '/pwa-192x192.png' });
            } catch {
              // Ignore in restricted iframe
            }
          }
        });
      }
    }
  };

  const handleAddBp = (entry: Omit<BloodPressureEntry, 'id'>) => {
    const newEntry: BloodPressureEntry = {
      ...entry,
      id: `bp-${Date.now()}`,
    };
    setBpEntries((prev) =>
      [newEntry, ...prev].sort((a, b) =>
        `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
      )
    );
    setToastNotification({
      title: 'Blutdruck & Puls gespeichert',
      body: `${entry.systolic}/${entry.diastolic} mmHg · Puls ${entry.pulse} bpm (${entry.contextTag})`,
    });
  };

  const handleDeleteBp = (id: string) => {
    setBpEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddSugar = (entry: Omit<BloodSugarEntry, 'id'>) => {
    const newEntry: BloodSugarEntry = {
      ...entry,
      id: `bs-${Date.now()}`,
    };
    setSugarEntries((prev) =>
      [newEntry, ...prev].sort((a, b) =>
        `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
      )
    );
    setToastNotification({
      title: 'Blutzuckerwert gespeichert',
      body: `${entry.valueMgDl} mg/dl (${entry.mealDistance})`,
    });
  };

  const handleDeleteSugar = (id: string) => {
    setSugarEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddWeight = (entry: Omit<WeightBodyEntry, 'id'>) => {
    const newEntry: WeightBodyEntry = {
      ...entry,
      id: `w-${Date.now()}`,
    };
    setWeightEntries((prev) =>
      [newEntry, ...prev].sort((a, b) =>
        `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
      )
    );
    setToastNotification({
      title: 'Gewicht & Körperwerte aktualisiert',
      body: `${entry.weightKg.toFixed(1)} kg erfolgreich protokolliert.`,
    });
  };

  const handleDeleteWeight = (id: string) => {
    setWeightEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddWater = (amountMl: number, label: string) => {
    const newLog = {
      id: `wl-${Date.now()}`,
      time: getCurrentTimeHm(),
      amountMl,
      label,
    };
    setHydrationByDate((prev) => {
      const current = prev[todayIso] || {
        date: todayIso,
        waterLogs: [],
        steps: 0,
        activeMinutes: 0,
        activitySummary: '',
      };
      return {
        ...prev,
        [todayIso]: {
          ...current,
          waterLogs: [newLog, ...current.waterLogs],
        },
      };
    });
    setToastNotification({
      title: `+${amountMl} ml eingetragen`,
      body: `${label} wurde deinem heutigen Trinkziel hinzugefügt.`,
    });
  };

  const handleRemoveWaterLog = (logId: string) => {
    setHydrationByDate((prev) => {
      const current = prev[todayIso];
      if (!current) return prev;
      return {
        ...prev,
        [todayIso]: {
          ...current,
          waterLogs: current.waterLogs.filter((l) => l.id !== logId),
        },
      };
    });
  };

  const handleUpdateActivity = (
    stepsDelta: number,
    minutesDelta: number,
    summary: string
  ) => {
    setHydrationByDate((prev) => {
      const current = prev[todayIso] || {
        date: todayIso,
        waterLogs: [],
        steps: 0,
        activeMinutes: 0,
        activitySummary: '',
      };
      const nextSteps = Math.max(0, current.steps + stepsDelta);
      const nextMinutes = Math.max(0, current.activeMinutes + minutesDelta);
      return {
        ...prev,
        [todayIso]: {
          ...current,
          steps: nextSteps,
          activeMinutes: nextMinutes,
          activitySummary: summary !== undefined ? summary : current.activitySummary,
        },
      };
    });
    setToastNotification({
      title: 'Bewegung & Schritte aktualisiert',
      body:
        stepsDelta > 0
          ? `+${stepsDelta} Schritte (${minutesDelta} Min.) gespeichert.`
          : `Aktuelle Werte & Aktivität wurden gespeichert.`,
    });
  };

  const handleLogMedication = (
    med: MedicationItem,
    scheduledTime: string,
    status: 'eingenommen' | 'uebersprungen' | 'verschoben'
  ) => {
    const existing = medLogs.find(
      (l) =>
        l.medicationId === med.id &&
        l.date === todayIso &&
        l.scheduledTime === scheduledTime
    );

    // Calculate +30 min time if postponed
    let postponedTo: string | undefined;
    if (status === 'verschoben') {
      const [h, m] = getCurrentTimeHm().split(':').map(Number);
      const d = new Date();
      d.setHours(h, m + 30);
      postponedTo = `${String(d.getHours()).padStart(2, '0')}:${String(
        d.getMinutes()
      ).padStart(2, '0')}`;
    }

    const newLog: MedicationIntakeLog = {
      id: existing?.id || `ml-${Date.now()}`,
      medicationId: med.id,
      medicationName: med.name,
      dosage: med.dosage,
      date: todayIso,
      scheduledTime,
      actionTime: getCurrentTimeHm(),
      status,
      postponedTo,
    };

    setMedLogs((prev) => {
      const filtered = prev.filter(
        (l) =>
          !(
            l.medicationId === med.id &&
            l.date === todayIso &&
            l.scheduledTime === scheduledTime
          )
      );
      return [newLog, ...filtered];
    });

    // Update stock count if transitioning to 'eingenommen'
    if (status === 'eingenommen' && existing?.status !== 'eingenommen') {
      setMedications((prev) =>
        prev.map((m) =>
          m.id === med.id ? { ...m, stockCount: Math.max(0, m.stockCount - 1) } : m
        )
      );
    } else if (status !== 'eingenommen' && existing?.status === 'eingenommen') {
      setMedications((prev) =>
        prev.map((m) => (m.id === med.id ? { ...m, stockCount: m.stockCount + 1 } : m))
      );
    }

    setToastNotification({
      title: `${med.name} (${med.dosage})`,
      body:
        status === 'eingenommen'
          ? `Als eingenommen markiert (${newLog.actionTime} Uhr).`
          : status === 'verschoben'
          ? `Erinnerung verschoben auf ${postponedTo} Uhr.`
          : 'Für heute als übersprungen markiert.',
    });
  };

  const handleAddMedication = (newMed: Omit<MedicationItem, 'id'>) => {
    setMedications((prev) => [...prev, { ...newMed, id: `med-${Date.now()}` }]);
    setToastNotification({
      title: 'Medikament hinzugefügt',
      body: `${newMed.name} (${newMed.dosage}) wurde in deinen Einnahmeplan aufgenommen.`,
    });
  };

  const handleRefillMedication = (id: string, addedTablets: number) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, stockCount: m.stockCount + addedTablets } : m
      )
    );
    setToastNotification({
      title: 'Tablettenvorrat aufgefüllt',
      body: `+${addedTablets} Stück zum Vorrat hinzugefügt.`,
    });
  };

  const handleDeleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearMedLogs = () => {
    setMedLogs([]);
  };

  const handleDeleteMedLog = (id: string) => {
    setMedLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAddAppointment = (apt: Omit<DoctorAppointment, 'id'>) => {
    setAppointments((prev) => [...prev, { ...apt, id: `apt-${Date.now()}` }]);
    setToastNotification({
      title: 'Arzttermin gespeichert',
      body: `${apt.doctorName} (${apt.specialty}) am ${apt.date} um ${apt.time} Uhr.`,
    });
  };

  const handleDeleteAppointment = (id: string) => {
    const deletedApt = appointments.find((a) => a.id === id);
    const remainingApts = appointments.filter((a) => a.id !== id);
    setAppointments(remainingApts);

    setDoctorQuestions((prev) =>
      prev.filter((q) => {
        if (q.appointmentId === id) return false;
        if (
          q.appointmentId &&
          !remainingApts.some((a) => a.id === q.appointmentId)
        ) {
          return false;
        }
        if (deletedApt) {
          const stillHasSpecialty = remainingApts.some(
            (a) => a.specialty === deletedApt.specialty
          );
          if (
            !stillHasSpecialty &&
            (q.specialty === deletedApt.specialty ||
              q.specialty.includes(deletedApt.specialty))
          ) {
            return false;
          }
        }
        return true;
      })
    );
  };

  // Keep doctorQuestions in sync if an appointment was already deleted previously
  useEffect(() => {
    setDoctorQuestions((prev) => {
      const cleaned = prev.filter((q) => {
        if (
          q.appointmentId &&
          !appointments.some((a) => a.id === q.appointmentId)
        ) {
          return false;
        }
        return true;
      });
      return cleaned.length === prev.length ? prev : cleaned;
    });
  }, [appointments]);

  const handleUpdateAppointment = (updated: DoctorAppointment) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const handleMarkPreventiveDone = (id: string) => {
    setPreventiveChecks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              lastDoneDate: todayIso,
              nextDueDate: getDaysInFutureIso(365),
              status: 'aktuell',
            }
          : item
      )
    );
  };

  const handleAddPreventiveCheck = (newItem: Omit<PreventiveCheckItem, 'id'>) => {
    setPreventiveChecks((prev) => [
      { ...newItem, id: `prev-${Date.now()}` },
      ...prev,
    ]);
  };

  const handleUpdatePreventiveCheck = (updated: PreventiveCheckItem) => {
    setPreventiveChecks((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeletePreventiveCheck = (id: string) => {
    setPreventiveChecks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddQuestion = (question: string, specialty: string) => {
    const matchedApt =
      appointments.find(
        (a) => a.specialty === specialty || specialty.includes(a.specialty)
      ) || appointments[0];
    const newQ: DoctorQuestion = {
      id: `dq-${Date.now()}`,
      question,
      specialty,
      appointmentId: matchedApt?.id,
      createdAt: todayIso,
      asked: false,
      answerNote: '',
    };
    setDoctorQuestions((prev) => [newQ, ...prev]);
  };

  const handleToggleQuestionAsked = (id: string, answerNote?: string) => {
    setDoctorQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        if (answerNote !== undefined) {
          return { ...q, asked: true, answerNote };
        }
        return { ...q, asked: !q.asked };
      })
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setDoctorQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAddPainEntry = (entry: Omit<PainEntry, 'id'>) => {
    const newEntry: PainEntry = {
      ...entry,
      id: `pain-${Date.now()}`,
    };
    setPainEntries((prev) =>
      [newEntry, ...prev].sort((a, b) =>
        `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
      )
    );
    setToastNotification({
      title: entry.hasPain
        ? `Schmerzen gespeichert (${entry.level || 'Ja'})`
        : 'Schmerzstatus gespeichert (Nein)',
      body: entry.description,
    });
  };

  const handleUpdatePainEntry = (updated: PainEntry) => {
    setPainEntries((prev) =>
      prev
        .map((item) => (item.id === updated.id ? updated : item))
        .sort((a, b) =>
          `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
        )
    );
  };

  const handleDeletePainEntry = (id: string) => {
    setPainEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const openQuickEntry = (tab: QuickEntryTab) => {
    setQuickModalTab(tab);
    setQuickModalOpen(true);
  };

  const navigateToVitals = (subTab: VitalsSubTab) => {
    setVitalsSubTab(subTab);
    setActiveSection('vitals');
  };

  // Privacy & Security Handlers
  const handleSetPin = (newPin: string | null) => {
    setAppPin(newPin);
    saveToStorage('gesundlife_app_pin_v1', newPin);
    if (!newPin) {
      setIsAppLocked(false);
    }
  };

  const handleAcceptPrivacy = () => {
    setPrivacyAccepted(true);
    saveToStorage('gesundlife_privacy_accepted_v1', true);
  };

  const handleExportFullBackup = () => {
    const payload = {
      app: 'Medical Compass',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      bpEntries,
      sugarEntries,
      weightEntries,
      medications,
      medLogs,
      hydrationByDate,
      appointments,
      preventiveChecks,
      doctorQuestions,
      painEntries,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Medical_Assistent_pro_Backup_${getTodayIso()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFullBackup = (jsonText: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Ungültiges Dateiformat.' };
      }
      if (parsed.profile && typeof parsed.profile === 'object') {
        setProfile({ ...INITIAL_USER_PROFILE, ...parsed.profile });
      }
      if (Array.isArray(parsed.bpEntries)) setBpEntries(parsed.bpEntries);
      if (Array.isArray(parsed.sugarEntries)) setSugarEntries(parsed.sugarEntries);
      if (Array.isArray(parsed.weightEntries)) setWeightEntries(parsed.weightEntries);
      if (Array.isArray(parsed.medications)) setMedications(parsed.medications);
      if (Array.isArray(parsed.medLogs)) setMedLogs(parsed.medLogs);
      if (parsed.hydrationByDate && typeof parsed.hydrationByDate === 'object') {
        setHydrationByDate(parsed.hydrationByDate);
      }
      if (Array.isArray(parsed.appointments)) setAppointments(parsed.appointments);
      if (Array.isArray(parsed.preventiveChecks)) setPreventiveChecks(parsed.preventiveChecks);
      if (Array.isArray(parsed.doctorQuestions)) setDoctorQuestions(parsed.doctorQuestions);
      if (Array.isArray(parsed.painEntries)) setPainEntries(parsed.painEntries);
      return {
        success: true,
        message: 'Sicherungsdatei wurde erfolgreich geprüft und wiederhergestellt.',
      };
    } catch {
      return {
        success: false,
        message: 'Fehler beim Lesen der Sicherungsdatei. Bitte prüfe die JSON-Datei.',
      };
    }
  };

  const handleDeleteAllData = () => {
    const emptyProfile: UserHealthProfile = {
      ...INITIAL_USER_PROFILE,
      fullName: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      birthYear: 0,
      age: 0,
      email: '',
      healthInsurance: '',
      insuranceNumber: '',
      familyDoctor: '',
      primaryDoctorName: '',
      avatarUrl: '',
      language: 'de',
      waterReminderTimes: [],
    };
    try {
      localStorage.setItem('gesundlife_profile_v1', JSON.stringify(emptyProfile));
      localStorage.setItem('gesundlife_bp_v1', '[]');
      localStorage.setItem('gesundlife_sugar_v1', '[]');
      localStorage.setItem('gesundlife_weight_v1', '[]');
      localStorage.setItem('gesundlife_meds_v1', '[]');
      localStorage.setItem('gesundlife_medlogs_v1', '[]');
      localStorage.setItem('gesundlife_hydration_v1', '{}');
      localStorage.setItem('gesundlife_appointments_v1', '[]');
      localStorage.setItem('gesundlife_preventive_v1', '[]');
      localStorage.setItem('gesundlife_questions_v1', '[]');
      localStorage.setItem('gesundlife_pain_logs_v1', '[]');
      localStorage.setItem('gesundlife_spo2_v1', '[]');
      localStorage.setItem('gesundlife_lab_values_v2', '[]');
      localStorage.setItem('gesundlife_doctor_notes_v1', '[]');
      localStorage.setItem('gesundlife_sleep_logs_v1', '[]');
      localStorage.setItem('gesundlife_sport_logs_v1', '[]');
      localStorage.removeItem('gesundlife_app_pin_v1');
    } catch {
      // ignore
    }
    setProfile(emptyProfile);
    setBpEntries([]);
    setSugarEntries([]);
    setWeightEntries([]);
    setMedications([]);
    setMedLogs([]);
    setHydrationByDate({});
    setAppointments([]);
    setPreventiveChecks([]);
    setDoctorQuestions([]);
    setPainEntries([]);
    setAppPin(null);
    setIsAppLocked(false);
    setDataResetVersion((v) => v + 1);
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockPinInput === appPin) {
      setIsAppLocked(false);
      setUnlockPinInput('');
      setUnlockError(false);
    } else {
      setUnlockError(true);
      setUnlockPinInput('');
    }
  };

  if (isAppLocked && appPin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-950 p-4 text-slate-900">
        <div className="w-full max-w-sm rounded-2xl bg-emerald-50 border-2 border-emerald-700 p-6 shadow-2xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-700 flex items-center justify-center mx-auto shadow-md overflow-hidden">
            <img
              src="/pwa-192x192.png"
              alt="Medical Compass Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              Medical Compass ist gesperrt
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Bitte gib deine 4-stellige Sicherheits-PIN ein, um auf deine Gesundheitsdaten zuzugreifen.
            </p>
          </div>
          <form onSubmit={handleUnlockSubmit} className="space-y-3">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoFocus
              placeholder="••••"
              value={unlockPinInput}
              onChange={(e) => {
                setUnlockError(false);
                setUnlockPinInput(e.target.value.replace(/\D/g, ''));
              }}
              className="w-40 mx-auto block px-4 py-2 rounded-xl border-2 border-emerald-800 bg-white font-mono text-xl font-bold tracking-widest text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
            {unlockError && (
              <p className="text-xs font-semibold text-rose-700">
                Falsche PIN. Bitte erneut versuchen.
              </p>
            )}
            <button
              type="submit"
              className="w-full min-h-[42px] rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Entsperren
            </button>
          </form>

          {/* Warning if PIN is forgotten */}
          <div className="rounded-xl border border-amber-600/80 bg-amber-50 p-2.5 text-left text-[11px] text-amber-950 space-y-1.5">
            <p className="font-bold text-amber-950">
              ⚠️ Warnung: PIN vergessen = Verlust aller Daten
            </p>
            <p className="text-amber-900 leading-snug">
              Wenn du deine PIN vergisst, gehen alle gespeicherten Gesundheits- und Profildaten unwiderruflich verloren.
            </p>
            {!confirmForgotPinReset ? (
              <button
                type="button"
                onClick={() => setConfirmForgotPinReset(true)}
                className="text-[11px] font-bold text-rose-700 hover:underline cursor-pointer"
              >
                PIN vergessen? Alle Daten löschen & App zurücksetzen…
              </button>
            ) : (
              <div className="pt-1.5 border-t border-amber-600/40 space-y-1.5">
                <p className="font-bold text-rose-800">
                  Wirklich alle Daten (inkl. Profil) unwiderruflich löschen, um die PIN-Sperre aufzuheben?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmForgotPinReset(false);
                      handleDeleteAllData();
                    }}
                    className="px-2.5 py-1 rounded-md bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Ja, alle Daten löschen
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmForgotPinReset(false)}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 text-[11px] font-semibold cursor-pointer"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-500">
            🔒 100 % lokale Gerätesicherheit · DSGVO-geschützt
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-slate-50 text-slate-900"
    >
      {/* =====================================================================
          TOP BAR: ONLY LOGO + "Medical Compass" + PROFIL ICON
          Moved down on mobile/APK so it sits cleanly below the Android status bar
         ===================================================================== */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 pt-[max(env(safe-area-inset-top),2.25rem)] md:pt-2 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-8 h-14">
          {/* Left: Brand logo & wordmark */}
          <button
            type="button"
            onClick={() => setActiveSection('dashboard')}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-teal-800 whitespace-nowrap shrink-0 cursor-pointer py-1"
          >
            <span className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-800/60 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
              <img
                src="/pwa-192x192.png"
                alt="Medical Compass Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </span>
            <span>Medical Compass</span>
          </button>

          {/* Right: Dark green Profile icon-only button */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setProfileModalOpen(true)}
              title={uiLabels.settingsProfileTitle}
              aria-label={uiLabels.settingsProfileTitle}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white border border-emerald-950 shadow-xs transition-all cursor-pointer"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-900 border border-emerald-600 flex items-center justify-center overflow-hidden shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* In-App Notification Toast */}
      {toastNotification && (
        <div className="no-print fixed top-24 md:top-16 right-4 z-50 max-w-sm rounded-2xl bg-slate-900 text-white p-4 shadow-xl border border-slate-700 flex items-start gap-3">
          <Bell className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-white">{toastNotification.title}</p>
            <p className="text-slate-300 mt-0.5">{toastNotification.body}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-white"
            aria-label="Benachrichtigung schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Offline Mode Indicator */}
      {!isOnline && (
        <div className="no-print bg-amber-600 text-white text-xs font-medium px-4 py-2 text-center">
          Offline-Modus aktiv — Deine Gesundheitsdaten werden lokal auf deinem Gerät gespeichert.
        </div>
      )}

      {/* =====================================================================
          MAIN WORKSPACE CONTAINER
         ===================================================================== */}
      <main
        key={dataResetVersion}
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 pb-12"
      >
        {activeSection === 'dashboard' && (
          <DashboardView
            profile={profile}
            bpEntries={bpEntries}
            sugarEntries={sugarEntries}
            weightEntries={weightEntries}
            medications={medications}
            medLogs={medLogs}
            todayHydration={todayHydration}
            appointments={appointments}
            doctorQuestions={doctorQuestions}
            onOpenQuickEntry={openQuickEntry}
            onNavigateToVitals={navigateToVitals}
            onNavigateToSection={setActiveSection}
            onLogMedication={handleLogMedication}
            onAddWater={handleAddWater}
            painEntries={painEntries}
            onAddPainEntry={handleAddPainEntry}
            onUpdatePainEntry={handleUpdatePainEntry}
            onDeletePainEntry={handleDeletePainEntry}
          />
        )}

        {activeSection === 'vitals' && (
          <VitalsView
            activeSubTab={vitalsSubTab}
            onChangeSubTab={setVitalsSubTab}
            bpEntries={bpEntries}
            onDeleteBp={handleDeleteBp}
            sugarEntries={sugarEntries}
            onDeleteSugar={handleDeleteSugar}
            weightEntries={weightEntries}
            onDeleteWeight={handleDeleteWeight}
            todayHydration={todayHydration}
            onAddWater={handleAddWater}
            onRemoveWaterLog={handleRemoveWaterLog}
            onUpdateActivity={handleUpdateActivity}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onOpenQuickEntry={openQuickEntry}
            painEntries={painEntries}
            onAddPainEntry={handleAddPainEntry}
            onUpdatePainEntry={handleUpdatePainEntry}
            onDeletePainEntry={handleDeletePainEntry}
          />
        )}

        {activeSection === 'medications' && (
          <MedicationsView
            medications={medications}
            medLogs={medLogs}
            onLogIntake={handleLogMedication}
            onAddMedication={handleAddMedication}
            onRefillMedication={handleRefillMedication}
            onDeleteMedication={handleDeleteMedication}
            onClearMedLogs={handleClearMedLogs}
            onDeleteMedLog={handleDeleteMedLog}
            onSendTestNotification={triggerNotification}
          />
        )}

        {activeSection === 'doctors' && (
          <PreventiveDoctorsView
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            preventiveChecks={preventiveChecks}
            onAddPreventiveCheck={handleAddPreventiveCheck}
            onMarkPreventiveDone={handleMarkPreventiveDone}
            onUpdatePreventiveCheck={handleUpdatePreventiveCheck}
            onDeletePreventiveCheck={handleDeletePreventiveCheck}
            doctorQuestions={doctorQuestions}
            onAddQuestion={handleAddQuestion}
            onToggleQuestionAsked={handleToggleQuestionAsked}
            onDeleteQuestion={handleDeleteQuestion}
          />
        )}

        {activeSection === 'calendar' && (
          <CalendarView
            appointments={appointments}
            doctorQuestions={doctorQuestions}
            preventiveChecks={preventiveChecks}
            bpEntries={bpEntries}
            sugarEntries={sugarEntries}
            weightEntries={weightEntries}
            profile={profile}
            onNavigateToSection={setActiveSection}
            onOpenQuickEntry={openQuickEntry}
            onAddAppointment={handleAddAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onUpdateAppointment={handleUpdateAppointment}
          />
        )}

        {activeSection === 'report' && (
          <HealthReportView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            bpEntries={bpEntries}
            sugarEntries={sugarEntries}
            weightEntries={weightEntries}
            medications={medications}
            medLogs={medLogs}
            hydrationByDate={hydrationByDate}
            appointments={appointments}
            preventiveChecks={preventiveChecks}
            doctorQuestions={doctorQuestions}
            painEntries={painEntries}
            onDeleteQuestion={handleDeleteQuestion}
            onToggleQuestionAsked={handleToggleQuestionAsked}
            onOpenQuickEntry={openQuickEntry}
            onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
          />
        )}
      </main>

      {/* DSGVO / Google Play Store Privacy & Medical Disclaimer Footer Card */}
      <footer className="no-print w-full max-w-7xl mx-auto px-4 sm:px-8 pb-36 md:pb-24">
        <div className="rounded-xl border border-emerald-800 bg-emerald-50/90 px-2.5 py-1.5 shadow-2xs flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[10px] leading-tight text-slate-700">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-1.5 gap-y-0.5">
            <span className="font-bold text-emerald-950">Medical Compass</span>
            <span className="text-emerald-800/60">·</span>
            <span>🔒 100 % lokale Datenspeicherung (DSGVO-konform)</span>
            <span className="text-emerald-800/60">·</span>
            <span>Kein Ersatz für ärztliche Diagnose (Notruf: 112)</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-2 gap-y-0.5">
            <button
              type="button"
              onClick={() => setPrivacyModalOpen(true)}
              className="font-bold text-teal-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>Datenschutzerklärung, PIN-Schutz & Datenlöschung</span>
            </button>
            <span className="text-emerald-800/60">·</span>
            <a
              href="mailto:info.Boudhan@web.de"
              className="font-semibold text-emerald-950 hover:text-teal-800 hover:underline"
            >
              Support: info.Boudhan@web.de
            </a>
            <span className="text-emerald-800/60">·</span>
            <span className="font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-800/40 px-1.5 py-0.5 rounded text-[9px]">
              App Version V1.0 2026
            </span>
          </div>
        </div>
      </footer>

      {/* First-Start DSGVO & Play Store Consent Banner */}
      {!privacyAccepted && (
        <div className="no-print fixed bottom-32 md:bottom-24 left-3 right-3 z-40 max-w-3xl mx-auto rounded-2xl bg-emerald-950 text-white p-3.5 shadow-2xl border border-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">
                Datenschutz & Sicherheit bei Medical Compass (DSGVO)
              </p>
              <p className="text-emerald-100 text-[11px] mt-0.5 leading-snug">
                Deine Gesundheitsdaten bleiben zu 100 % lokal auf deinem Gerät gespeichert. Es gibt
                keine Cloud-Weitergabe und keine Werbe-Tracker. Die App dient der persönlichen
                Dokumentation und ersetzt keinen Arztbesuch.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setPrivacyModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-[11px] font-semibold cursor-pointer"
            >
              Details & PIN
            </button>
            <button
              type="button"
              onClick={handleAcceptPrivacy}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold cursor-pointer"
            >
              Verstanden & Zustimmen
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          FIXED BOTTOM ICON BAR (ICON-ONLY, RAISED ABOVE ANDROID SYSTEM BAR)
         ===================================================================== */}
      <nav
        aria-label="Hauptnavigation"
        className="no-print fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-slate-300 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-[max(env(safe-area-inset-bottom),3.25rem)] md:pb-2"
      >
        <div className="max-w-xl mx-auto grid grid-cols-6 items-center h-14 px-2 gap-1">
          <button
            type="button"
            onClick={() => setActiveSection('dashboard')}
            aria-label={uiLabels.navDashboard}
            title={uiLabels.navDashboard}
            className={`min-h-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeSection === 'dashboard'
                ? 'text-teal-700 bg-teal-50 border border-teal-700/40 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('vitals')}
            aria-label={uiLabels.navVitals}
            title={uiLabels.navVitals}
            className={`min-h-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeSection === 'vitals'
                ? 'text-teal-700 bg-teal-50 border border-teal-700/40 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <HeartPulse className="w-5 h-5 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('medications')}
            aria-label={uiLabels.navMedications}
            title={uiLabels.navMedications}
            className={`min-h-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeSection === 'medications'
                ? 'text-teal-700 bg-teal-50 border border-teal-700/40 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Pill className="w-5 h-5 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('doctors')}
            aria-label={uiLabels.navDoctors}
            title={uiLabels.navDoctors}
            className={`min-h-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeSection === 'doctors'
                ? 'text-teal-700 bg-teal-50 border border-teal-700/40 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Stethoscope className="w-5 h-5 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('calendar')}
            aria-label={uiLabels.navCalendar}
            title={uiLabels.navCalendar}
            className={`min-h-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeSection === 'calendar'
                ? 'text-teal-700 bg-teal-50 border border-teal-700/40 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Calendar className="w-5 h-5 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('report')}
            aria-label={uiLabels.navReport}
            title={uiLabels.navReport}
            className={`min-h-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeSection === 'report'
                ? 'text-teal-700 bg-teal-50 border border-teal-700/40 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <FileText className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </nav>

      {/* Quick Entry Modal */}
      <QuickEntryModal
        isOpen={quickModalOpen}
        initialTab={quickModalTab}
        onClose={() => setQuickModalOpen(false)}
        profile={profile}
        onAddBp={handleAddBp}
        onAddSugar={handleAddSugar}
        onAddWeight={handleAddWeight}
        onAddWater={handleAddWater}
        onUpdateActivity={handleUpdateActivity}
      />

      {/* Profile & Language Settings Modal */}
      <ProfileSettingsModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      {/* Privacy, Security & GDPR Modal */}
      <PrivacySecurityModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        pinEnabled={Boolean(appPin)}
        onSetPin={handleSetPin}
        onLockNow={() => {
          if (appPin) setIsAppLocked(true);
        }}
        onExportFullBackup={handleExportFullBackup}
        onImportFullBackup={handleImportFullBackup}
        onDeleteAllData={handleDeleteAllData}
      />
    </div>
  );
}
