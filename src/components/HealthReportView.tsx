import React, { useState } from 'react';
import {
  Download,
  Printer,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  Trash2,
  Calendar,
} from 'lucide-react';
import { QuickEntryTab } from './QuickEntryModal';
import {
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
} from '../types/health';
import {
  calculateBmi,
  classifyBloodPressure,
  evaluateGlucoseStatus,
  exportHealthDataAsCsv,
  exportHealthReportAsPdf,
  formatGermanDate,
  formatGlucose,
  getDaysAgoIso,
  getGlucoseTypeLabel,
  getTodayIso,
} from '../utils/healthHelpers';

interface HealthReportViewProps {
  profile: UserHealthProfile;
  onUpdateProfile?: (patch: Partial<UserHealthProfile>) => void;
  bpEntries: BloodPressureEntry[];
  sugarEntries: BloodSugarEntry[];
  weightEntries: WeightBodyEntry[];
  medications: MedicationItem[];
  medLogs: MedicationIntakeLog[];
  hydrationByDate?: Record<string, DailyHydrationActivity>;
  appointments: DoctorAppointment[];
  preventiveChecks?: PreventiveCheckItem[];
  doctorQuestions: DoctorQuestion[];
  painEntries?: PainEntry[];
  onDeleteQuestion?: (id: string) => void;
  onToggleQuestionAsked?: (id: string, answerNote?: string) => void;
  onOpenQuickEntry: (tab: QuickEntryTab) => void;
  onOpenPrivacyModal?: () => void;
}

const WATER_GOAL_PRESETS = [1500, 1800, 2000, 2250, 2500, 3000];

export const HealthReportView: React.FC<HealthReportViewProps> = ({
  profile,
  onUpdateProfile,
  bpEntries,
  sugarEntries,
  weightEntries,
  medications,
  medLogs,
  hydrationByDate = {},
  appointments,
  preventiveChecks = [],
  doctorQuestions,
  painEntries = [],
  onDeleteQuestion,
  onToggleQuestionAsked,
  onOpenQuickEntry,
  onOpenPrivacyModal,
}) => {
  const [comparisonMode, setComparisonMode] = useState<'week' | 'month'>('week');
  const selectedAppointmentId = appointments[0]?.id || '';
  const includeMedications = true;
  const includeOpenQuestions = true;
  const patientSummaryNote = '';
  const [waterGoalMl, setWaterGoalMl] = useState<number>(
    profile.dailyWaterGoalMl || 2000
  );
  const [isCustomWaterGoal, setIsCustomWaterGoal] = useState<boolean>(
    !WATER_GOAL_PRESETS.includes(profile.dailyWaterGoalMl || 2000)
  );
  const [customWaterGoalInput, setCustomWaterGoalInput] = useState<string>(
    String(profile.dailyWaterGoalMl || 2000)
  );

  const applyWaterGoal = (nextGoal: number) => {
    const validGoal = Math.max(500, Math.min(6000, Math.round(nextGoal) || 2000));
    setWaterGoalMl(validGoal);
    setCustomWaterGoalInput(String(validGoal));
    if (onUpdateProfile) {
      onUpdateProfile({ dailyWaterGoalMl: validGoal });
    }
  };

  // Compute Week vs Previous Week OR Month vs Previous Month
  const periodDays = comparisonMode === 'week' ? 7 : 30;
  const currentStart = getDaysAgoIso(periodDays);
  const previousStart = getDaysAgoIso(periodDays * 2);

  const bpCurrent = bpEntries.filter((e) => e.date >= currentStart);
  const bpPrev = bpEntries.filter(
    (e) => e.date >= previousStart && e.date < currentStart
  );

  const avgBp = (arr: BloodPressureEntry[]) => {
    if (!arr.length) return { sys: 0, dia: 0, pulse: 0 };
    return {
      sys: Math.round(arr.reduce((s, x) => s + x.systolic, 0) / arr.length),
      dia: Math.round(arr.reduce((s, x) => s + x.diastolic, 0) / arr.length),
      pulse: Math.round(arr.reduce((s, x) => s + x.pulse, 0) / arr.length),
    };
  };

  const curBpStats = avgBp(bpCurrent);
  const prevBpStats = avgBp(bpPrev);

  const sugarCurrent = sugarEntries.filter((e) => e.date >= currentStart);
  const sugarPrev = sugarEntries.filter(
    (e) => e.date >= previousStart && e.date < currentStart
  );

  const avgSugar = (arr: BloodSugarEntry[]) =>
    arr.length
      ? Math.round(arr.reduce((s, x) => s + x.valueMgDl, 0) / arr.length)
      : 0;

  const curSugarAvg = avgSugar(sugarCurrent);
  const prevSugarAvg = avgSugar(sugarPrev);

  const sortedWeights = [...weightEntries].sort((a, b) =>
    `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
  );
  const latestWeight = sortedWeights[0];
  const prevWeight =
    sortedWeights.find((w) => w.date <= currentStart) ||
    sortedWeights[sortedWeights.length - 1];

  const takenCount = medLogs.filter((l) => l.status === 'eingenommen').length;
  const adherenceRate = medLogs.length
    ? Math.round((takenCount / medLogs.length) * 100)
    : 100;

  const selectedApt = appointments.find((a) => a.id === selectedAppointmentId);
  // Keep openQuestions strictly synchronized with existing appointments
  const openQuestions = doctorQuestions.filter((q) => {
    if (q.asked) return false;
    if (
      q.appointmentId &&
      !appointments.some((a) => a.id === q.appointmentId)
    ) {
      return false;
    }
    return true;
  });

  // 1. Load Sleep Diagnostic Logs for Line Chart (Max. 3 Months = 90 Days; older entries auto-deleted)
  const threeMonthsCutoff = getDaysAgoIso(90);
  const sleepLogs: Array<{
    id: string;
    date: string;
    durationHours: number;
    qualityTags: string[];
    note: string;
  }> = (() => {
    try {
      const raw = localStorage.getItem('gesundlife_sleep_logs_v1');
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (item) => item && typeof item.date === 'string' && item.date >= threeMonthsCutoff
          );
          if (valid.length !== parsed.length) {
            localStorage.setItem('gesundlife_sleep_logs_v1', JSON.stringify(valid));
          }
          return valid;
        }
      }
    } catch {
      // ignore
    }
    return [
      { id: 'sl-1', date: getTodayIso(), durationHours: 7.5, qualityTags: ['Erholsamer Schlaf'], note: '' },
      { id: 'sl-2', date: getDaysAgoIso(1), durationHours: 7.0, qualityTags: ['Erholsamer Schlaf'], note: '' },
      { id: 'sl-3', date: getDaysAgoIso(2), durationHours: 6.5, qualityTags: ['Unruhiger Schlaf'], note: '' },
      { id: 'sl-4', date: getDaysAgoIso(3), durationHours: 8.0, qualityTags: ['Erholsamer Schlaf'], note: '' },
      { id: 'sl-5', date: getDaysAgoIso(4), durationHours: 6.0, qualityTags: ['Durchschlafstörung'], note: '' },
      { id: 'sl-6', date: getDaysAgoIso(5), durationHours: 7.5, qualityTags: ['Erholsamer Schlaf'], note: '' },
    ];
  })();

  const chartSleepLogs = [...sleepLogs]
    .filter((item) => item.date >= threeMonthsCutoff)
    .sort((a, b) => a.date.localeCompare(b.date));

  const avgSleepHours = chartSleepLogs.length
    ? (
        chartSleepLogs.reduce((sum, item) => sum + item.durationHours, 0) /
        chartSleepLogs.length
      ).toFixed(1)
    : '0.0';

  // 2. Load Sport Logs for Fahrrad & Laufband (Woche / Monat) – always live from storage
  const sportLogs: Array<{
    id: string;
    sportType: 'Laufband' | 'Fahrrad' | 'Gymnastik';
    date: string;
    minutes: number;
    calories?: number;
    distanceKm?: number;
  }> = (() => {
    try {
      const raw = localStorage.getItem('gesundlife_sport_logs_v1');
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      { id: 'sp-1', sportType: 'Laufband', date: getTodayIso(), minutes: 20, calories: 165 },
      { id: 'sp-2', sportType: 'Fahrrad', date: getDaysAgoIso(1), minutes: 30, distanceKm: 8.5 },
      { id: 'sp-3', sportType: 'Gymnastik', date: getDaysAgoIso(2), minutes: 15 },
    ];
  })();

  const weekCutoff = getDaysAgoIso(7);
  const monthCutoff = getDaysAgoIso(30);

  const bikeWeekLogs = sportLogs.filter(
    (s) => s.sportType === 'Fahrrad' && s.date >= weekCutoff
  );
  const bikeMonthLogs = sportLogs.filter(
    (s) => s.sportType === 'Fahrrad' && s.date >= monthCutoff
  );
  const bikeWeekMinutes = bikeWeekLogs.reduce((sum, s) => sum + (s.minutes || 0), 0);
  const bikeWeekHours = (bikeWeekMinutes / 60).toFixed(1);
  const bikeWeekKm = bikeWeekLogs
    .reduce((sum, s) => sum + (s.distanceKm || 0), 0)
    .toFixed(1);

  const bikeMonthMinutes = bikeMonthLogs.reduce((sum, s) => sum + (s.minutes || 0), 0);
  const bikeMonthHours = (bikeMonthMinutes / 60).toFixed(1);
  const bikeMonthKm = bikeMonthLogs
    .reduce((sum, s) => sum + (s.distanceKm || 0), 0)
    .toFixed(1);

  const treadmillWeekLogs = sportLogs.filter(
    (s) => s.sportType === 'Laufband' && s.date >= weekCutoff
  );
  const treadmillMonthLogs = sportLogs.filter(
    (s) => s.sportType === 'Laufband' && s.date >= monthCutoff
  );
  const treadmillWeekMinutes = treadmillWeekLogs.reduce(
    (sum, s) => sum + (s.minutes || 0),
    0
  );
  const treadmillWeekHours = (treadmillWeekMinutes / 60).toFixed(1);
  const treadmillWeekCalories = treadmillWeekLogs.reduce(
    (sum, s) => sum + (s.calories || 0),
    0
  );

  const treadmillMonthMinutes = treadmillMonthLogs.reduce(
    (sum, s) => sum + (s.minutes || 0),
    0
  );
  const treadmillMonthHours = (treadmillMonthMinutes / 60).toFixed(1);
  const treadmillMonthCalories = treadmillMonthLogs.reduce(
    (sum, s) => sum + (s.calories || 0),
    0
  );

  // 3. Live Water Intake (7-Day Bar Chart) & Steps (Week / Month) directly from hydrationByDate
  const { waterBarData, stepsWeekTotal, stepsMonthTotal, stepsWeekAvg, stepsMonthAvg } = (() => {
    const days: Array<{ date: string; totalMl: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const iso = getDaysAgoIso(i);
      const dayRecord = hydrationByDate[iso];
      const sumMl =
        dayRecord && Array.isArray(dayRecord.waterLogs)
          ? dayRecord.waterLogs.reduce(
              (acc, l) => acc + (Number(l.amountMl) || 0),
              0
            )
          : 0;
      days.push({ date: iso, totalMl: sumMl });
    }

    let weekSteps = 0;
    for (let i = 0; i < 7; i++) {
      const iso = getDaysAgoIso(i);
      const dayRecord = hydrationByDate[iso];
      if (dayRecord && typeof dayRecord.steps === 'number') {
        weekSteps += Math.max(0, dayRecord.steps);
      }
    }

    let monthSteps = 0;
    for (let i = 0; i < 30; i++) {
      const iso = getDaysAgoIso(i);
      const dayRecord = hydrationByDate[iso];
      if (dayRecord && typeof dayRecord.steps === 'number') {
        monthSteps += Math.max(0, dayRecord.steps);
      }
    }

    return {
      waterBarData: days,
      stepsWeekTotal: weekSteps,
      stepsMonthTotal: monthSteps,
      stepsWeekAvg: Math.round(weekSteps / 7),
      stepsMonthAvg: Math.round(monthSteps / 30),
    };
  })();

  const formatShortDayMonth = (iso: string) => {
    const parts = iso.split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.`;
    return iso;
  };

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSentMessage, setEmailSentMessage] = useState('');
  const [actionStatusMessage, setActionStatusMessage] = useState('');

  const handlePrintReport = () => {
    try {
      window.print();
    } catch {
      // Ignore if print dialog is blocked in preview iframe
    }
    setActionStatusMessage(
      `Druckerauswahl für den Gesundheitsbericht (${formatGermanDate(getTodayIso())}) wurde geöffnet.`
    );
  };

  const handleSendReportEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const subject = encodeURIComponent(
      `Arztbericht – ${profile.fullName} (${formatGermanDate(getTodayIso())})`
    );
    const bodyLines = [
      `Ärztlicher Gesundheitsbericht für ${profile.fullName}`,
      `Datum: ${formatGermanDate(getTodayIso())}`,
      `Hausarzt: ${profile.primaryDoctorName}`,
      '',
      `1. Letzte Blutdruck- & Pulsmessungen (Ø ${periodDays} Tage): ${
        curBpStats.sys ? `${curBpStats.sys}/${curBpStats.dia} mmHg (Puls ${curBpStats.pulse} bpm)` : '—'
      }`,
      `2. Letzte Blutzuckerwerte (Ø ${periodDays} Tage): ${
        curSugarAvg ? `${formatGlucose(curSugarAvg, profile.glucoseUnit)} ${profile.glucoseUnit}` : '—'
      }`,
      `3. Gewicht & BMI: ${
        latestWeight
          ? `${latestWeight.weightKg.toFixed(1)} kg (BMI ${calculateBmi(latestWeight.weightKg, profile.heightCm)})`
          : '—'
      }`,
      `4. Aktueller Medikamentenplan: ${
        medications.map((m) => `${m.name} ${m.dosage}`).join(', ') || '—'
      } (Einnahmetreue: ${adherenceRate}%)`,
      `5. Offene Fragen für das Arztgespräch: ${
        openQuestions.map((q) => q.question).join(' | ') || 'Keine offenen Fragen'
      }`,
      `6. Schlafdiagnostik: Ø ${avgSleepHours} Std. (${sleepLogs.length} Einträge)`,
      `7. Schmerzen Protokoll: ${
        painEntries
          .slice(0, 5)
          .map(
            (p) =>
              `${formatGermanDate(p.date)}: ${
                p.hasPain
                  ? `Ja (${p.level || 'Leicht'}) - ${p.description}`
                  : `Nein (${p.description})`
              }`
          )
          .join(' | ') || '—'
      }`,
    ];
    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail.trim())}?subject=${subject}&body=${encodeURIComponent(
      bodyLines.join('\n')
    )}`;
    window.location.href = mailtoUrl;
    setEmailSentMessage(
      recipientEmail.trim()
        ? `E-Mail-Entwurf für ${recipientEmail.trim()} wurde geöffnet.`
        : 'E-Mail-Programm mit deinem Arztbericht wurde geöffnet.'
    );
  };

  const handleCreatePdf = () => {
    exportHealthReportAsPdf({
      profile,
      bpEntries,
      sugarEntries,
      weightEntries,
      medications: includeMedications ? medications : [],
      doctorQuestions: includeOpenQuestions ? doctorQuestions : [],
      sleepLogs,
      painEntries,
      selectedAppointment: selectedApt,
      patientSummaryNote,
      filenamePrefix: 'Medical_Assistent_pro_Gesundheitsbericht_PDF',
    });
    setActionStatusMessage(
      'PDF-Dokument (inkl. 6. Schlafdiagnostik & 7. Schmerzen Protokoll) wurde erfolgreich erstellt und heruntergeladen.'
    );
  };

  const handleExportCsv = () => {
    exportHealthDataAsCsv(bpEntries, sugarEntries, weightEntries, medLogs, profile, {
      medications: includeMedications ? medications : [],
      doctorQuestions: includeOpenQuestions ? doctorQuestions : [],
      sleepLogs,
      painEntries,
    });
    setActionStatusMessage(
      'CSV-Datei (inkl. 6. Schlafdiagnostik & 7. Schmerzen Protokoll) wurde erfolgreich erstellt und heruntergeladen.'
    );
  };

  return (
    <div className="space-y-4">
      {/* Print-Only Header for direct printer selection */}
      <div className="hidden print:block border-b-2 border-teal-800 pb-3 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Ärztlicher Gesundheitsbericht – Medical Compass
            </h1>
            <p className="text-xs text-slate-700 mt-0.5">
              Patient: <strong>{profile.fullName}</strong>
              {profile.birthDate ? ` (Geb.: ${formatGermanDate(profile.birthDate)})` : ''} · Hausarzt: <strong>{profile.primaryDoctorName}</strong>
            </p>
          </div>
          <div className="text-right text-xs text-slate-600 font-mono">
            Stand: {formatGermanDate(getTodayIso())}
          </div>
        </div>
      </div>

      {/* Header & Export Actions */}
      <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 border-b border-emerald-800/80 pb-2.5">
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900 leading-snug">
            Gesundheitsbericht
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Übersicht aller Messungen · Wochen- & Monatsvergleich · PDF-Druck & CSV-Export
          </p>
        </div>

        <div className="flex flex-nowrap items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setShowEmailForm((prev) => !prev);
              setEmailSentMessage('');
            }}
            className="min-h-[32px] px-2 py-1 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            title="Arztbericht per E-Mail senden"
          >
            <span>Arztbericht</span>
            <Mail className="w-3.5 h-3.5 shrink-0" />
          </button>

          <button
            type="button"
            onClick={handleCreatePdf}
            className="min-h-[32px] px-2 py-1 rounded-xl border border-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 text-[11px] sm:text-xs font-semibold text-slate-900 flex items-center justify-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            title="PDF drucken oder herunterladen"
          >
            <span>📄 PDF</span>
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                handlePrintReport();
              }}
              title="Direkt zur Druckerauswahl"
              className="inline-flex items-center justify-center p-0.5 rounded hover:bg-emerald-200/70 text-teal-800"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
            </span>
            <Download className="w-3.5 h-3.5 text-teal-800 shrink-0" />
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="min-h-[32px] px-2 py-1 rounded-xl border border-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 text-[11px] sm:text-xs font-semibold text-slate-900 flex items-center justify-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            title="CSV drucken oder herunterladen"
          >
            <span>📊 CSV</span>
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                handlePrintReport();
              }}
              title="Direkt zur Druckerauswahl"
              className="inline-flex items-center justify-center p-0.5 rounded hover:bg-emerald-200/70 text-teal-800"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
            </span>
            <Download className="w-3.5 h-3.5 text-teal-800 shrink-0" />
          </button>
        </div>
      </div>

      {showEmailForm && (
        <form
          onSubmit={handleSendReportEmail}
          className="no-print bg-emerald-50/90 rounded-xl border border-emerald-800 px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 flex-1">
            <Mail className="w-4 h-4 text-teal-700 shrink-0" />
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Empfänger E-Mail-Adresse (z. B. praxis@hausarzt.de)"
              className="w-full min-h-[32px] px-2.5 py-1 rounded-lg bg-white border border-emerald-800 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="submit"
              className="min-h-[32px] px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-Mail öffnen & senden</span>
            </button>
            <button
              type="button"
              onClick={() => setShowEmailForm(false)}
              className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white border border-emerald-800 text-xs font-medium text-slate-700 hover:bg-emerald-100 cursor-pointer"
            >
              Schließen
            </button>
          </div>
          {emailSentMessage && (
            <p className="text-[11px] font-medium text-teal-800 sm:col-span-2">
              {emailSentMessage}
            </p>
          )}
        </form>
      )}

      {actionStatusMessage && (
        <div className="no-print bg-emerald-100/90 border border-emerald-800 rounded-xl px-3 py-2 flex items-center justify-between gap-2.5 text-xs text-emerald-950 font-medium overflow-hidden">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="min-w-0 flex-1 break-words leading-snug">
              {actionStatusMessage}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActionStatusMessage('')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-800 text-emerald-950 text-[11px] font-bold shrink-0 cursor-pointer"
          >
            OK
          </button>
        </div>
      )}

      {/* Week & Month Comparison Matrix */}
      <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 px-3 py-2.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900">
            Vergleich Wochen & Monaten
          </h2>

          <div className="no-print flex items-center gap-1 p-0.5 bg-white/85 rounded-lg border border-emerald-800/70">
            <button
              type="button"
              onClick={() => setComparisonMode('week')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap text-center ${
                comparisonMode === 'week'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Wochenvergleich
            </button>
            <button
              type="button"
              onClick={() => setComparisonMode('month')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap text-center ${
                comparisonMode === 'month'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Monatsvergleich
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* Blood Pressure Comparison */}
          <div className="px-2.5 py-2 rounded-lg bg-white/85 border border-emerald-800/70 space-y-0.5">
            <p className="text-[11px] font-semibold text-emerald-950 truncate">
              Ø Blutdruck ({comparisonMode === 'week' ? '7 Tage' : '30 Tage'})
            </p>
            <p className="text-base font-bold font-mono tabular-nums text-slate-900 leading-tight">
              {curBpStats.sys ? `${curBpStats.sys}/${curBpStats.dia}` : '—'}{' '}
              <span className="text-[10px] font-normal text-slate-500">mmHg</span>
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate">
              {prevBpStats.sys ? (
                <>
                  {curBpStats.sys <= prevBpStats.sys ? (
                    <ArrowDownRight className="w-3 h-3 text-teal-700 shrink-0" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3 text-amber-700 shrink-0" />
                  )}
                  <span className="truncate">
                    {prevBpStats.sys}/{prevBpStats.dia} · Puls {curBpStats.pulse}
                  </span>
                </>
              ) : (
                <span>Ø Puls: {curBpStats.pulse || '—'} bpm</span>
              )}
            </div>
          </div>

          {/* Glucose Comparison */}
          <div className="px-2.5 py-2 rounded-lg bg-white/85 border border-emerald-800/70 space-y-0.5">
            <p className="text-[11px] font-semibold text-emerald-950 truncate">
              Ø Blutzucker ({comparisonMode === 'week' ? '7 Tage' : '30 Tage'})
            </p>
            <p className="text-base font-bold font-mono tabular-nums text-slate-900 leading-tight">
              {curSugarAvg ? formatGlucose(curSugarAvg, profile.glucoseUnit) : '—'}{' '}
              <span className="text-[10px] font-normal text-slate-500">
                {profile.glucoseUnit}
              </span>
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate">
              {prevSugarAvg ? (
                <>
                  {curSugarAvg <= prevSugarAvg ? (
                    <ArrowDownRight className="w-3 h-3 text-teal-700 shrink-0" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3 text-amber-700 shrink-0" />
                  )}
                  <span className="truncate">
                    {formatGlucose(prevSugarAvg, profile.glucoseUnit)}{' '}
                    {profile.glucoseUnit}
                  </span>
                </>
              ) : (
                <span className="truncate">
                  Ziel ≤ {formatGlucose(profile.glucoseTargetFastingMax, profile.glucoseUnit)}
                </span>
              )}
            </div>
          </div>

          {/* Weight & BMI Comparison */}
          <div className="px-2.5 py-2 rounded-lg bg-white/85 border border-emerald-800/70 space-y-0.5">
            <p className="text-[11px] font-semibold text-emerald-950 truncate">
              Gewicht & BMI
            </p>
            <p className="text-base font-bold font-mono tabular-nums text-slate-900 leading-tight">
              {latestWeight ? `${latestWeight.weightKg.toFixed(1)} kg` : '—'}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-teal-700 font-medium truncate">
              {latestWeight && prevWeight ? (
                <>
                  {latestWeight.weightKg <= prevWeight.weightKg ? (
                    <ArrowDownRight className="w-3 h-3 shrink-0" />
                  ) : (
                    <Minus className="w-3 h-3 shrink-0" />
                  )}
                  <span className="truncate">
                    {(latestWeight.weightKg - prevWeight.weightKg).toFixed(1)} kg · BMI{' '}
                    {calculateBmi(latestWeight.weightKg, profile.heightCm)}
                  </span>
                </>
              ) : (
                <span className="truncate">Ziel: {profile.targetWeightKg} kg</span>
              )}
            </div>
          </div>

          {/* Medication Adherence */}
          <div className="px-2.5 py-2 rounded-lg bg-white/85 border border-emerald-800/70 space-y-0.5">
            <p className="text-[11px] font-semibold text-emerald-950 truncate">
              Therapietreue
            </p>
            <p className="text-base font-bold font-mono tabular-nums text-teal-800 leading-tight">
              {adherenceRate}%
            </p>
            <p className="text-[11px] text-slate-600 truncate">
              {takenCount}/{medLogs.length} Einnahmen
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================================
          NEW REPORT CARDS:
          1. Liniendiagramm für Schlafdiagnostik
          2. Fahrrad & Laufband (Gesamtstunden, Km, Kalorien / Woche & Monat)
          3. Wasser trinken – Balkendiagramm
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* 1. Card: Liniendiagramm für Schlafdiagnostik (Max. 3 Monate) */}
        <div className="lg:col-span-6 bg-emerald-50/70 rounded-xl border border-emerald-800 px-3 py-2.5 space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-emerald-800/70 pb-1.5">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                Schlafdiagnostik – Liniendiagramm
              </h2>
              <p className="text-xs text-slate-700 font-medium">
                Max. 3 Monate (90 Tage) · Ältere Monate werden automatisch gelöscht
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-white border border-emerald-800 text-xs sm:text-sm font-mono font-bold text-teal-800 shrink-0">
              Ø {avgSleepHours} Std. ({chartSleepLogs.length})
            </span>
          </div>

          <div className="overflow-x-auto pt-1">
            {chartSleepLogs.length > 0 ? (
              (() => {
                const svgWidth = Math.max(540, chartSleepLogs.length * 64 + 90);
                const plotWidth = svgWidth - 110;
                return (
                  <svg
                    viewBox={`0 0 ${svgWidth} 190`}
                    className="w-full h-48 sm:h-52 min-w-[380px] overflow-visible"
                  >
                    {/* Zielkorridor 7.0 - 8.5 Std. */}
                    <rect
                      x="48"
                      y="43"
                      width={svgWidth - 64}
                      height="30"
                      fill="#d1fae5"
                      fillOpacity="0.75"
                      rx="4"
                    />
                    {[10, 8, 6, 4].map((hr) => {
                      const y = 148 - ((hr - 4) / 6) * 120;
                      return (
                        <g key={hr}>
                          <line
                            x1="48"
                            y1={y}
                            x2={svgWidth - 16}
                            y2={y}
                            stroke={hr === 8 ? '#065f46' : '#cbd5e1'}
                            strokeDasharray={hr === 8 ? '4 3' : undefined}
                            strokeWidth={hr === 8 ? '1.5' : '1'}
                          />
                          <text
                            x="42"
                            y={y + 4}
                            textAnchor="end"
                            fontSize="13"
                            className="text-[13px] font-mono font-bold fill-slate-800"
                          >
                            {hr}h
                          </text>
                        </g>
                      );
                    })}

                    {chartSleepLogs.map((entry, idx) => {
                      const x =
                        chartSleepLogs.length === 1
                          ? svgWidth / 2
                          : 78 + (idx / (chartSleepLogs.length - 1)) * plotWidth;
                      const clamped = Math.min(10, Math.max(4, entry.durationHours));
                      const y = 148 - ((clamped - 4) / 6) * 120;
                      const next = chartSleepLogs[idx + 1];
                      const nextX =
                        next && chartSleepLogs.length > 1
                          ? 78 + ((idx + 1) / (chartSleepLogs.length - 1)) * plotWidth
                          : null;
                      const nextClamped = next
                        ? Math.min(10, Math.max(4, next.durationHours))
                        : null;
                      const nextY =
                        nextClamped !== null
                          ? 148 - ((nextClamped - 4) / 6) * 120
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
                              strokeWidth="2.6"
                            />
                          )}
                          <circle
                            cx={x}
                            cy={y}
                            r="5.5"
                            fill={entry.durationHours >= 7 ? '#065f46' : '#d97706'}
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <rect
                            x={x - 20}
                            y={y - 25}
                            width="40"
                            height="17"
                            rx="4"
                            fill="#ffffff"
                            fillOpacity="0.92"
                          />
                          <text
                            x={x}
                            y={y - 12}
                            textAnchor="middle"
                            fontSize="13"
                            className="text-[13px] font-mono font-bold fill-slate-950"
                          >
                            {entry.durationHours}h
                          </text>
                          <text
                            x={x}
                            y={176}
                            textAnchor="middle"
                            fontSize="13"
                            className="text-[13px] font-mono font-bold fill-slate-800"
                          >
                            {formatShortDayMonth(entry.date)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                );
              })()
            ) : (
              <p className="text-xs text-slate-600 py-8 text-center">
                Noch keine Schlafdiagnostik-Einträge in den letzten 3 Monaten vorhanden.
              </p>
            )}
          </div>
        </div>

        {/* 2. Card: Wasser trinken – Balkendiagramm */}
        <div className="lg:col-span-6 bg-emerald-50/70 rounded-xl border border-emerald-800 px-3 py-2.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/70 pb-1.5">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                Wasser trinken – Balkendiagramm
              </h2>
              <p className="text-xs text-slate-700 font-medium">
                Tägliche Trinkmenge (ml) der letzten 7 Tage · Ziel: {waterGoalMl} ml
              </p>
            </div>

            {/* "Ziel 2000 ml" mit Auswahl & selbst eintragen */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <select
                aria-label="Trinkziel auswählen"
                value={
                  !isCustomWaterGoal && WATER_GOAL_PRESETS.includes(waterGoalMl)
                    ? String(waterGoalMl)
                    : 'custom'
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom') {
                    setIsCustomWaterGoal(true);
                    setCustomWaterGoalInput(String(waterGoalMl));
                  } else {
                    setIsCustomWaterGoal(false);
                    applyWaterGoal(Number(val));
                  }
                }}
                className="px-2 py-1 rounded-md bg-white border border-emerald-800 text-xs font-mono font-bold text-teal-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-700"
              >
                {WATER_GOAL_PRESETS.map((preset) => (
                  <option key={preset} value={String(preset)}>
                    Ziel {preset} ml
                  </option>
                ))}
                <option value="custom">Selbst eintragen…</option>
              </select>

              <div className="flex items-center gap-1 bg-white border border-emerald-800 rounded-md px-1.5 py-0.5">
                <span className="text-[11px] font-semibold text-slate-700">
                  Selbst:
                </span>
                <input
                  type="number"
                  min={500}
                  max={6000}
                  step={50}
                  value={customWaterGoalInput}
                  onChange={(e) => {
                    setCustomWaterGoalInput(e.target.value);
                    setIsCustomWaterGoal(true);
                    const parsed = Number(e.target.value);
                    if (parsed >= 500 && parsed <= 6000) {
                      setWaterGoalMl(parsed);
                      if (onUpdateProfile) {
                        onUpdateProfile({ dailyWaterGoalMl: parsed });
                      }
                    }
                  }}
                  onBlur={() => {
                    applyWaterGoal(Number(customWaterGoalInput) || 2000);
                  }}
                  placeholder="2000"
                  aria-label="Trinkziel selbst eintragen in ml"
                  className="w-16 text-xs font-mono font-bold text-teal-900 bg-transparent focus:outline-none text-right"
                />
                <span className="text-[11px] font-mono font-bold text-teal-800">
                  ml
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pt-1">
            {(() => {
              const chartMaxMl = Math.max(
                2600,
                waterGoalMl + 400,
                ...waterBarData.map((d) => d.totalMl + 200)
              );
              const gridSteps = [2500, 2000, 1500, 1000, 500];
              const goalY = 148 - (waterGoalMl / chartMaxMl) * 118;

              return (
                <svg
                  viewBox="0 0 540 190"
                  className="w-full h-48 sm:h-52 min-w-[380px] overflow-visible"
                >
                  {gridSteps.map((mlVal) => {
                    const y = 148 - (mlVal / chartMaxMl) * 118;
                    return (
                      <g key={mlVal}>
                        <line
                          x1="52"
                          y1={y}
                          x2="524"
                          y2={y}
                          stroke="#cbd5e1"
                          strokeWidth="1"
                        />
                        <text
                          x="46"
                          y={y + 4}
                          textAnchor="end"
                          fontSize="13"
                          className="text-[13px] font-mono font-bold fill-slate-800"
                        >
                          {mlVal}
                        </text>
                      </g>
                    );
                  })}

                  {/* Dynamische Ziellinie für das gewählte / selbst eingetragene Trinkziel */}
                  <line
                    x1="52"
                    y1={goalY}
                    x2="524"
                    y2={goalY}
                    stroke="#065f46"
                    strokeDasharray="4 3"
                    strokeWidth="1.8"
                  />
                  <text
                    x="522"
                    y={Math.max(14, goalY - 5)}
                    textAnchor="end"
                    fontSize="12"
                    className="text-[12px] font-mono font-bold fill-emerald-950"
                  >
                    Ziel {waterGoalMl} ml
                  </text>

                  {waterBarData.map((d, idx) => {
                    const barWidth = 38;
                    const x = 66 + idx * 65;
                    const clampedMl = Math.min(chartMaxMl, Math.max(0, d.totalMl));
                    const barHeight = Math.max(6, (clampedMl / chartMaxMl) * 118);
                    const y = 148 - barHeight;
                    const reachedGoal = d.totalMl >= waterGoalMl;

                    return (
                      <g key={d.date}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx="4"
                          fill={reachedGoal ? '#0f766e' : '#059669'}
                        />
                        <rect
                          x={x - 3}
                          y={y - 21}
                          width={barWidth + 6}
                          height="16"
                          rx="3"
                          fill="#ffffff"
                          fillOpacity="0.92"
                        />
                        <text
                          x={x + barWidth / 2}
                          y={y - 9}
                          textAnchor="middle"
                          fontSize="13"
                          className="text-[13px] font-mono font-bold fill-slate-950"
                        >
                          {d.totalMl}
                        </text>
                        <text
                          x={x + barWidth / 2}
                          y={176}
                          textAnchor="middle"
                          fontSize="13"
                          className="text-[13px] font-mono font-bold fill-slate-800"
                        >
                          {formatShortDayMonth(d.date)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
          </div>
        </div>

        {/* 3. New Card: "Schmerzen Liniendiagramm" – Tägliche Analyse */}
        <div className="lg:col-span-12 bg-emerald-50/70 rounded-xl border border-emerald-800 px-3 py-2.5 space-y-2.5">
          {(() => {
            const chartPainEntries = [...painEntries].sort((a, b) =>
              `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
            );
            const painYesCount = chartPainEntries.filter((e) => e.hasPain).length;
            const painNoCount = chartPainEntries.filter((e) => !e.hasPain).length;

            const getPainScore = (entry: PainEntry): number => {
              if (!entry.hasPain) return 0;
              if (entry.level === 'Stark') return 3;
              if (entry.level === 'Leicht') return 2;
              if (entry.level === 'Kurz') return 1;
              return 2;
            };

            const yLevels: Array<{ val: number; label: string; color: string }> = [
              { val: 3, label: 'Stark', color: '#dc2626' },
              { val: 2, label: 'Leicht', color: '#d97706' },
              { val: 1, label: 'Kurz', color: '#0f766e' },
              { val: 0, label: 'Nein', color: '#16a34a' },
            ];

            return (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/70 pb-1.5">
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                      Schmerzen Liniendiagramm – Tägliche Analyse
                    </h2>
                    <p className="text-xs text-slate-700 font-medium">
                      Tägliche Analyse von Schmerzstatus (Ja / Nein), Schmerzen Stufe (Stark, Leicht, Kurz) & Beschreibung
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-xs font-bold">
                      Ja: {painYesCount}×
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-green-600 text-white text-xs font-bold">
                      Nein: {painNoCount}×
                    </span>
                  </div>
                </div>

                {/* SVG Line Chart for Daily Pain Analysis */}
                <div className="overflow-x-auto pt-1">
                  {chartPainEntries.length > 0 ? (
                    (() => {
                      const svgWidth = Math.max(
                        560,
                        chartPainEntries.length * 76 + 100
                      );
                      const plotWidth = svgWidth - 120;

                      return (
                        <svg
                          viewBox={`0 0 ${svgWidth} 195`}
                          className="w-full h-48 sm:h-52 min-w-[400px] overflow-visible"
                        >
                          {/* Background Reference Bands */}
                          <rect
                            x="58"
                            y="20"
                            width={svgWidth - 76}
                            height="28"
                            fill="#fee2e2"
                            fillOpacity="0.65"
                            rx="4"
                          />
                          <rect
                            x="58"
                            y="136"
                            width={svgWidth - 76}
                            height="26"
                            fill="#dcfce7"
                            fillOpacity="0.75"
                            rx="4"
                          />

                          {yLevels.map((lvl) => {
                            const y = 150 - (lvl.val / 3) * 116;
                            return (
                              <g key={lvl.val}>
                                <line
                                  x1="58"
                                  y1={y}
                                  x2={svgWidth - 18}
                                  y2={y}
                                  stroke={
                                    lvl.val === 3
                                      ? '#fca5a5'
                                      : lvl.val === 0
                                      ? '#86efac'
                                      : '#cbd5e1'
                                  }
                                  strokeDasharray={
                                    lvl.val === 3 || lvl.val === 0
                                      ? '4 3'
                                      : undefined
                                  }
                                  strokeWidth="1.2"
                                />
                                <text
                                  x="52"
                                  y={y + 4}
                                  textAnchor="end"
                                  fontSize="12"
                                  fill={lvl.color}
                                  className="text-[12px] font-mono font-bold"
                                >
                                  {lvl.label}
                                </text>
                              </g>
                            );
                          })}

                          {chartPainEntries.map((entry, idx) => {
                            const x =
                              chartPainEntries.length === 1
                                ? svgWidth / 2
                                : 88 +
                                  (idx / (chartPainEntries.length - 1)) *
                                    plotWidth;
                            const score = getPainScore(entry);
                            const y = 150 - (score / 3) * 116;

                            const next = chartPainEntries[idx + 1];
                            const nextX =
                              next && chartPainEntries.length > 1
                                ? 88 +
                                  ((idx + 1) / (chartPainEntries.length - 1)) *
                                    plotWidth
                                : null;
                            const nextScore = next ? getPainScore(next) : null;
                            const nextY =
                              nextScore !== null
                                ? 150 - (nextScore / 3) * 116
                                : null;

                            const pointColor = entry.hasPain
                              ? '#dc2626'
                              : '#16a34a';
                            const badgeText = entry.hasPain
                              ? entry.level || 'Ja'
                              : 'Nein';

                            return (
                              <g key={entry.id}>
                                {nextX !== null && nextY !== null && (
                                  <line
                                    x1={x}
                                    y1={y}
                                    x2={nextX}
                                    y2={nextY}
                                    stroke="#0f766e"
                                    strokeWidth="2.5"
                                  />
                                )}
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="6"
                                  fill={pointColor}
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                />
                                <rect
                                  x={x - 24}
                                  y={y - 25}
                                  width="48"
                                  height="17"
                                  rx="4"
                                  fill="#ffffff"
                                  fillOpacity="0.94"
                                  stroke={pointColor}
                                  strokeWidth="1"
                                />
                                <text
                                  x={x}
                                  y={y - 13}
                                  textAnchor="middle"
                                  fontSize="11"
                                  fill={pointColor}
                                  className="text-[11px] font-mono font-bold"
                                >
                                  {badgeText}
                                </text>
                                <text
                                  x={x}
                                  y={178}
                                  textAnchor="middle"
                                  fontSize="12"
                                  className="text-[12px] font-mono font-bold fill-slate-800"
                                >
                                  {formatShortDayMonth(entry.date)}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      );
                    })()
                  ) : (
                    <p className="text-xs text-slate-600 py-6 text-center">
                      Noch keine Schmerzen-Einträge für die tägliche Analyse vorhanden.
                    </p>
                  )}
                </div>

                {/* Tägliche Analyse Details */}
                {painEntries.length > 0 && (
                  <div className="rounded-lg bg-white/95 border border-emerald-800 overflow-hidden">
                    <div className="px-2.5 py-1.5 bg-emerald-100/70 border-b border-emerald-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950">
                        Tägliche Analyse – Schmerzen Protokoll ({painEntries.length})
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        Rot = Ja · Grün = Nein
                      </span>
                    </div>
                    <div className="divide-y divide-emerald-200/70 max-h-44 overflow-y-auto">
                      {painEntries.slice(0, 7).map((item) => (
                        <div
                          key={item.id}
                          className="px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.hasPain
                                  ? 'bg-red-600 text-white'
                                  : 'bg-green-600 text-white'
                              }`}
                            >
                              {item.hasPain ? 'Ja ☑️' : 'Nein ☑️'}
                            </span>
                            {item.hasPain && item.level && (
                              <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-800 border border-red-200 text-[10px] font-bold">
                                Stufe: {item.level}
                              </span>
                            )}
                            <span className="font-semibold text-slate-900">
                              {item.description}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-slate-600 shrink-0">
                            {formatGermanDate(item.date)} · {item.time} Uhr
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* 3. Card: Sport & Training Übersicht (Woche / Monat) */}
      <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 px-3 py-2.5 space-y-2">
        <div className="flex items-center justify-between gap-2 border-b border-emerald-800/70 pb-1.5">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            Sport & Training Übersicht (Woche / Monat)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Fahrrad Card: Gesamtstunden & Km / Woche & Monat */}
          <div className="rounded-lg bg-white/95 border border-emerald-800 p-2.5 space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-1">
              <span className="text-xs font-bold text-emerald-950">
                🚴 Fahrrad – Gesamtstunden & Km
              </span>
              <span className="text-[10px] font-semibold text-teal-800">
                Woche / Monat
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-md bg-emerald-50/80 border border-emerald-800/60">
                <p className="text-[10px] font-bold uppercase text-emerald-900">
                  Pro Woche (7 Tage)
                </p>
                <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                  Gesamtstunden: {bikeWeekHours} Std.
                </p>
                <p className="text-xs font-mono font-bold text-teal-800">
                  Strecke: {bikeWeekKm} Km
                </p>
              </div>
              <div className="p-2 rounded-md bg-emerald-50/80 border border-emerald-800/60">
                <p className="text-[10px] font-bold uppercase text-emerald-900">
                  Pro Monat (30 Tage)
                </p>
                <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                  Gesamtstunden: {bikeMonthHours} Std.
                </p>
                <p className="text-xs font-mono font-bold text-teal-800">
                  Strecke: {bikeMonthKm} Km
                </p>
              </div>
            </div>
          </div>

          {/* Laufband Card: Gesamtstunden & Kalorien / Woche & Monat */}
          <div className="rounded-lg bg-white/95 border border-emerald-800 p-2.5 space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-1">
              <span className="text-xs font-bold text-emerald-950">
                🏃 Laufband – Gesamtstunden & Kalorien
              </span>
              <span className="text-[10px] font-semibold text-teal-800">
                Woche / Monat
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-md bg-emerald-50/80 border border-emerald-800/60">
                <p className="text-[10px] font-bold uppercase text-emerald-900">
                  Pro Woche (7 Tage)
                </p>
                <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                  Gesamtstunden: {treadmillWeekHours} Std.
                </p>
                <p className="text-xs font-mono font-bold text-teal-800">
                  Kalorien: {treadmillWeekCalories} kcal
                </p>
              </div>
              <div className="p-2 rounded-md bg-emerald-50/80 border border-emerald-800/60">
                <p className="text-[10px] font-bold uppercase text-emerald-900">
                  Pro Monat (30 Tage)
                </p>
                <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                  Gesamtstunden: {treadmillMonthHours} Std.
                </p>
                <p className="text-xs font-mono font-bold text-teal-800">
                  Kalorien: {treadmillMonthCalories} kcal
                </p>
              </div>
            </div>
          </div>

          {/* Gesamtschritte Card: Woche & Monat */}
          <div className="rounded-lg bg-white/95 border border-emerald-800 p-2.5 space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-1">
              <span className="text-xs font-bold text-emerald-950">
                👣 Gesamtschritte
              </span>
              <span className="text-[10px] font-semibold text-teal-800">
                Woche / Monat
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-md bg-emerald-50/80 border border-emerald-800/60">
                <p className="text-[10px] font-bold uppercase text-emerald-900">
                  Pro Woche (7 Tage)
                </p>
                <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                  Gesamt: {stepsWeekTotal.toLocaleString('de-DE')}
                </p>
                <p className="text-xs font-mono font-bold text-teal-800">
                  Ø Tag: {stepsWeekAvg.toLocaleString('de-DE')} Schritte
                </p>
              </div>
              <div className="p-2 rounded-md bg-emerald-50/80 border border-emerald-800/60">
                <p className="text-[10px] font-bold uppercase text-emerald-900">
                  Pro Monat (30 Tage)
                </p>
                <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                  Gesamt: {stepsMonthTotal.toLocaleString('de-DE')}
                </p>
                <p className="text-xs font-mono font-bold text-teal-800">
                  Ø Tag: {stepsMonthAvg.toLocaleString('de-DE')} Schritte
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable & Exported Report Sections (1 - 7) — hidden on screen, visible only when printing */}
      <div className="hidden print:block bg-emerald-50/70 rounded-2xl border border-emerald-800 p-3.5 space-y-3">
        <div className="border-b border-emerald-800/70 pb-1.5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            Inhalt des ausgedruckten Berichts (PDF & CSV): Abschnitte 1 bis 7
          </h2>
          <span className="text-[11px] font-semibold text-teal-800">
            Vollständig in PDF-Druck & CSV-Export enthalten
          </span>
        </div>

        {/* 1. Blutdruck & 2. Blutzucker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* 1. Letzte Blutdruck- & Pulsmessungen */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-1.5">
              1. Letzte Blutdruck- & Pulsmessungen
            </h3>
            <div className="border border-emerald-800 rounded-xl overflow-hidden bg-white/85">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-emerald-100/70 border-b border-emerald-800 text-emerald-950">
                    <th className="py-1.5 px-2 font-semibold">Datum / Zeit</th>
                    <th className="py-1.5 px-2 font-semibold text-right">Sys/Dia</th>
                    <th className="py-1.5 px-2 font-semibold text-right">Puls</th>
                    <th className="py-1.5 px-2 font-semibold">Kontext / Bewertung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-800">
                  {bpEntries.slice(0, 7).map((bp) => (
                    <tr key={bp.id}>
                      <td className="py-1 px-2 font-mono text-slate-600 whitespace-nowrap">
                        {formatGermanDate(bp.date)} {bp.time}
                      </td>
                      <td className="py-1 px-2 font-mono font-bold text-right text-slate-900 tabular-nums whitespace-nowrap">
                        {bp.systolic}/{bp.diastolic}
                      </td>
                      <td className="py-1 px-2 font-mono text-right text-slate-700 tabular-nums whitespace-nowrap">
                        {bp.pulse}
                      </td>
                      <td className="py-1 px-2 text-slate-600 leading-tight">
                        {classifyBloodPressure(bp.systolic, bp.diastolic).label} ·{' '}
                        {bp.contextTag}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Letzte Blutzuckerwerte (mg/dl) */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-1.5">
              2. Letzte Blutzuckerwerte ({profile.glucoseUnit})
            </h3>
            <div className="border border-emerald-800 rounded-xl overflow-hidden bg-white/85">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-emerald-100/70 border-b border-emerald-800 text-emerald-950">
                    <th className="py-1.5 px-2 font-semibold">Datum / Zeit</th>
                    <th className="py-1.5 px-2 font-semibold text-right">Wert</th>
                    <th className="py-1.5 px-2 font-semibold">Zeitpunkt</th>
                    <th className="py-1.5 px-2 font-semibold">Bewertung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-800">
                  {sugarEntries.slice(0, 7).map((bs) => (
                    <tr key={bs.id}>
                      <td className="py-1 px-2 font-mono text-slate-600 whitespace-nowrap">
                        {formatGermanDate(bs.date)} {bs.time}
                      </td>
                      <td className="py-1 px-2 font-mono font-bold text-right text-slate-900 tabular-nums whitespace-nowrap">
                        {formatGlucose(bs.valueMgDl, profile.glucoseUnit)}{' '}
                        {profile.glucoseUnit}
                      </td>
                      <td className="py-1 px-2 text-slate-600 leading-tight">
                        {getGlucoseTypeLabel(bs.measurementType)}
                      </td>
                      <td className="py-1 px-2 text-slate-600 leading-tight">
                        {evaluateGlucoseStatus(bs, profile).label}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Gewicht & BMI + 4. Aktueller Medikamentenplan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
          {/* 3. Gewicht & BMI */}
          <div className="border border-emerald-800 rounded-xl bg-white/85 overflow-hidden">
            <div className="px-2.5 py-1.5 bg-emerald-100/70 border-b border-emerald-800 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-900">
                3. Gewicht & BMI ({weightEntries.length} Messungen)
              </h3>
              <span className="inline-flex items-center justify-center shrink-0" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
                  <rect x="5.5" y="5" width="13" height="6" rx="1.5" fill="#fff7ed" stroke="#9a3412" strokeWidth="1" />
                  <text x="12" y="9.6" textAnchor="middle" fontSize="5.2" fontFamily="monospace" fontWeight="bold" fill="#c2410c">88.8</text>
                </svg>
              </span>
            </div>
            <div className="divide-y divide-emerald-800 text-[11px]">
              {weightEntries.slice(0, 5).map((w) => {
                const bmi = calculateBmi(w.weightKg, profile.heightCm);
                return (
                  <div
                    key={w.id}
                    className="px-2.5 py-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 leading-tight">
                      <strong className="font-mono text-slate-900">
                        {w.weightKg.toFixed(1)} kg
                      </strong>{' '}
                      <span className="text-teal-800 font-semibold font-mono">
                        · BMI {bmi}
                      </span>
                      {w.waistCm && (
                        <span className="text-slate-600">
                          {' '}
                          · Bauchumfang {w.waistCm} cm
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-slate-600 whitespace-nowrap shrink-0">
                      {formatGermanDate(w.date)} {w.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Aktueller Medikamentenplan */}
          {includeMedications && (
            <div className="border border-emerald-800 rounded-xl bg-white/85 overflow-hidden">
              <div className="px-2.5 py-1.5 bg-emerald-100/70 border-b border-emerald-800 flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-slate-900">
                  4. Aktueller Medikamentenplan ({medications.length} Präparate)
                </h3>
                <span className="inline-flex items-center justify-center shrink-0" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                    <g transform="rotate(-35 12 12)">
                      <path d="M4 12C4 9.23858 6.23858 7 9 7H12V17H9C6.23858 17 4 14.7614 4 12Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                      <path d="M12 7H15C17.7614 7 20 9.23858 20 12C20 14.7614 17.7614 17 15 17H12V7Z" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
                      <line x1="12" y1="7" x2="12" y2="17" stroke="#991b1b" strokeWidth="1.5" />
                    </g>
                  </svg>
                </span>
              </div>
              <div className="divide-y divide-emerald-800 text-[11px]">
                {medications.map((m) => (
                  <div
                    key={m.id}
                    className="px-2.5 py-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 leading-tight">
                      <strong className="text-slate-900">
                        {m.name} {m.dosage}
                      </strong>{' '}
                      <span className="text-slate-600">
                        ({m.form}) · {m.instructions}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-teal-800 whitespace-nowrap shrink-0">
                      {m.times.join(', ')} Uhr
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Offene Fragen für das Arztgespräch */}
        {includeOpenQuestions && (
          <div className="border border-emerald-800 rounded-xl bg-white/85 overflow-hidden">
            <div className="px-2.5 py-1.5 bg-emerald-100/70 border-b border-emerald-800 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-900">
                5. Offene Fragen für das Arztgespräch ({openQuestions.length})
              </h3>
              <span className="text-[10px] font-semibold text-teal-800">
                Automatisch synchronisiert mit Termine
              </span>
            </div>
            {openQuestions.length > 0 ? (
              <ul className="divide-y divide-emerald-800 text-[11px] text-slate-800">
                {openQuestions.map((q, idx) => (
                  <li
                    key={q.id}
                    className="px-2.5 py-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-start gap-1.5 min-w-0 flex-1">
                      <span className="font-mono font-semibold text-teal-800 shrink-0">
                        {idx + 1}.
                      </span>
                      <span className="leading-tight">
                        {q.question}{' '}
                        <em className="text-slate-500">({q.specialty})</em>
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {onToggleQuestionAsked && (
                        <button
                          type="button"
                          onClick={() => onToggleQuestionAsked(q.id)}
                          title="Als besprochen markieren"
                          className="p-1 rounded hover:bg-emerald-100 text-teal-700 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteQuestion && (
                        <button
                          type="button"
                          onClick={() => onDeleteQuestion(q.id)}
                          title="Frage löschen"
                          className="p-1 rounded hover:bg-rose-50 text-slate-500 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-2.5 py-2 text-[11px] text-slate-500">
                Aktuell sind keine offenen Fragen vorhanden (oder zugehörige Termine wurden entfernt).
              </p>
            )}
          </div>
        )}

        {/* 6. Schlafdiagnostik & 7. Schmerzen Protokoll */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
          {/* 6. Schlafdiagnostik */}
          <div className="border border-emerald-800 rounded-xl bg-white/85 overflow-hidden">
            <div className="px-2.5 py-1.5 bg-emerald-100/70 border-b border-emerald-800 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-900">
                6. Schlafdiagnostik ({sleepLogs.length} Einträge)
              </h3>
              <span className="text-[10px] font-mono font-bold text-teal-800">
                Ø {avgSleepHours} Std.
              </span>
            </div>
            {sleepLogs.length > 0 ? (
              <div className="divide-y divide-emerald-800 text-[11px]">
                {sleepLogs.slice(0, 7).map((s) => (
                  <div
                    key={s.id}
                    className="px-2.5 py-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 leading-tight">
                      <strong className="font-mono text-teal-900">
                        {s.durationHours} Std.
                      </strong>{' '}
                      <span className="font-semibold text-slate-900">
                        · {s.qualityTags.join(', ')}
                      </span>
                      {s.note && (
                        <span className="text-slate-600"> · {s.note}</span>
                      )}
                    </div>
                    <span className="font-mono text-slate-600 whitespace-nowrap shrink-0">
                      {formatGermanDate(s.date)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-2.5 py-2 text-[11px] text-slate-500">
                Keine Schlafdiagnostik-Einträge vorhanden.
              </p>
            )}
          </div>

          {/* 7. Schmerzen Protokoll */}
          <div className="border border-emerald-800 rounded-xl bg-white/85 overflow-hidden">
            <div className="px-2.5 py-1.5 bg-emerald-100/70 border-b border-emerald-800 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-900">
                7. Schmerzen Protokoll ({painEntries.length} Einträge)
              </h3>
              <span className="text-[10px] font-semibold text-teal-800">
                Tägliche Dokumentation
              </span>
            </div>
            {painEntries.length > 0 ? (
              <div className="divide-y divide-emerald-800 text-[11px]">
                {painEntries.slice(0, 7).map((p) => (
                  <div
                    key={p.id}
                    className="px-2.5 py-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0 leading-tight">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          p.hasPain
                            ? 'bg-red-600 text-white'
                            : 'bg-green-600 text-white'
                        }`}
                      >
                        {p.hasPain ? 'Ja' : 'Nein'}
                      </span>
                      {p.hasPain && p.level && (
                        <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-800 border border-red-200 text-[10px] font-bold">
                          Stufe: {p.level}
                        </span>
                      )}
                      <span className="font-semibold text-slate-900">
                        {p.description}
                      </span>
                    </div>
                    <span className="font-mono text-slate-600 whitespace-nowrap shrink-0">
                      {formatGermanDate(p.date)} {p.time}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-2.5 py-2 text-[11px] text-slate-500">
                Keine Schmerzen-Einträge vorhanden.
              </p>
            )}
          </div>
        </div>

        {/* Live Overview of Current Appointments & Preventive Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
          <div className="border border-emerald-800 rounded-xl bg-white/85 overflow-hidden">
            <div className="px-2.5 py-1.5 bg-emerald-100/70 border-b border-emerald-800 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-800" />
                <span>Aktuelle Arzttermine ({appointments.length})</span>
              </h3>
            </div>
            {appointments.length > 0 ? (
              <div className="divide-y divide-emerald-800 text-[11px]">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="px-2.5 py-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 leading-tight">
                      <strong className="text-slate-900">{apt.doctorName}</strong>{' '}
                      <span className="text-teal-800 font-semibold">
                        ({apt.specialty})
                      </span>
                      {apt.reason && (
                        <span className="text-slate-600"> · {apt.reason}</span>
                      )}
                    </div>
                    <span className="font-mono font-semibold text-slate-800 whitespace-nowrap shrink-0">
                      {formatGermanDate(apt.date)} · {apt.time} Uhr
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-2.5 py-2 text-[11px] text-slate-500">
                Aktuell sind keine geplanten Arzttermine eingetragen.
              </p>
            )}
          </div>

          <div className="border border-emerald-800 rounded-xl bg-white/85 overflow-hidden">
            <div className="px-2.5 py-1.5 bg-emerald-100/70 border-b border-emerald-800">
              <h3 className="text-xs font-bold text-slate-900">
                Aktuelle Notizen & Vorsorge ({preventiveChecks.length})
              </h3>
            </div>
            {preventiveChecks.length > 0 ? (
              <div className="divide-y divide-emerald-800 text-[11px]">
                {preventiveChecks.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="px-2.5 py-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 leading-tight">
                      <strong className="text-slate-900">{item.title}</strong>{' '}
                      <span className="text-slate-600">({item.category})</span>
                    </div>
                    <span className="font-mono text-teal-800 font-semibold whitespace-nowrap shrink-0">
                      Fällig: {formatGermanDate(item.nextDueDate)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-2.5 py-2 text-[11px] text-slate-500">
                Keine Notizen oder Vorsorge-Einträge vorhanden.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
