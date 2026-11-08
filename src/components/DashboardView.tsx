import React from 'react';
import {
  HeartPulse,
  Droplet,
  Scale,
  Pill,
  GlassWater,
  Footprints,
  Calendar,
  FileText,
  Check,
  Clock,
  SkipForward,
  Plus,
  AlertTriangle,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import {
  BloodPressureEntry,
  BloodSugarEntry,
  DailyHydrationActivity,
  DoctorAppointment,
  DoctorQuestion,
  MedicationIntakeLog,
  MedicationItem,
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
  getGlucoseTypeLabel,
  getTodayIso,
} from '../utils/healthHelpers';
import { QuickEntryTab } from './QuickEntryModal';
import { VitalsSubTab } from './VitalsView';
import { PainTrackerCard } from './PainTrackerCard';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DashboardViewProps {
  profile: UserHealthProfile;
  bpEntries: BloodPressureEntry[];
  sugarEntries: BloodSugarEntry[];
  weightEntries: WeightBodyEntry[];
  medications: MedicationItem[];
  medLogs: MedicationIntakeLog[];
  todayHydration: DailyHydrationActivity;
  appointments: DoctorAppointment[];
  doctorQuestions: DoctorQuestion[];
  onOpenQuickEntry: (tab: QuickEntryTab) => void;
  onNavigateToVitals: (subTab: VitalsSubTab) => void;
  onNavigateToSection: (
    section: 'dashboard' | 'vitals' | 'medications' | 'doctors' | 'calendar' | 'report'
  ) => void;
  onLogMedication: (
    med: MedicationItem,
    scheduledTime: string,
    status: 'eingenommen' | 'uebersprungen' | 'verschoben'
  ) => void;
  onAddWater: (amountMl: number, label: string) => void;
  painEntries: PainEntry[];
  onAddPainEntry: (entry: Omit<PainEntry, 'id'>) => void;
  onUpdatePainEntry: (updated: PainEntry) => void;
  onDeletePainEntry: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  bpEntries,
  sugarEntries,
  weightEntries,
  medications,
  medLogs,
  todayHydration,
  appointments,
  doctorQuestions,
  onOpenQuickEntry,
  onNavigateToVitals,
  onNavigateToSection,
  onLogMedication,
  onAddWater,
  painEntries,
  onAddPainEntry,
  onUpdatePainEntry,
  onDeletePainEntry,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIosHint, setShowIosHint] = React.useState(false);

  const todayIso = getTodayIso();

  // Latest vitals
  const latestBp = bpEntries[0];
  const latestSugar = sugarEntries[0];
  const latestWeight = weightEntries[0];
  const currentBmi = latestWeight
    ? calculateBmi(latestWeight.weightKg, profile.heightCm)
    : 0;

  // Today's medication tasks
  const todayDoses = medications
    .flatMap((med) =>
      med.times.map((schedTime) => {
        const log = medLogs.find(
          (l) =>
            l.medicationId === med.id &&
            l.date === todayIso &&
            l.scheduledTime === schedTime
        );
        return { med, scheduledTime: schedTime, log };
      })
    )
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  const pendingDoses = todayDoses.filter(
    (d) => !d.log || d.log.status === 'verschoben'
  );
  const completedDosesCount = todayDoses.filter(
    (d) => d.log?.status === 'eingenommen'
  ).length;

  const lowStockMeds = medications.filter(
    (m) => m.stockCount <= m.lowStockThreshold
  );

  // Hydration & Activity
  const totalWaterToday = todayHydration.waterLogs.reduce(
    (acc, item) => acc + item.amountMl,
    0
  );
  const waterPercent = Math.min(
    100,
    Math.round((totalWaterToday / Math.max(1, profile.dailyWaterGoalMl)) * 100)
  );
  const stepsPercent = Math.min(
    100,
    Math.round((todayHydration.steps / Math.max(1, profile.dailyStepsGoal)) * 100)
  );

  // Combined recent measurements feed
  const recentMeasurements = [
    ...bpEntries.slice(0, 3).map((b) => ({
      id: `bp-${b.id}`,
      date: b.date,
      time: b.time,
      category: 'Blutdruck & Puls',
      valueText: `${b.systolic}/${b.diastolic} mmHg · Puls ${b.pulse} bpm`,
      detailText: `${classifyBloodPressure(b.systolic, b.diastolic).label} · ${b.period} · ${b.contextTag}`,
      onClick: () => onNavigateToVitals('bp'),
    })),
    ...sugarEntries.slice(0, 3).map((s) => ({
      id: `bs-${s.id}`,
      date: s.date,
      time: s.time,
      category: 'Blutzucker',
      valueText: `${formatGlucose(s.valueMgDl, profile.glucoseUnit)} ${profile.glucoseUnit}`,
      detailText: `${getGlucoseTypeLabel(s.measurementType)} · ${evaluateGlucoseStatus(s, profile).label}`,
      onClick: () => onNavigateToVitals('sugar'),
    })),
    ...weightEntries.slice(0, 2).map((w) => ({
      id: `w-${w.id}`,
      date: w.date,
      time: w.time,
      category: 'Gewicht & Körperwerte',
      valueText: `${w.weightKg.toFixed(1)} kg · BMI ${calculateBmi(w.weightKg, profile.heightCm)}`,
      detailText: w.waistCm
        ? `Bauchumfang ${w.waistCm} cm · Wunschgewicht ${profile.targetWeightKg} kg`
        : `Wunschgewicht ${profile.targetWeightKg} kg`,
      onClick: () => onNavigateToVitals('weight'),
    })),
  ]
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
    .slice(0, 6);

  const nextAppointment = [...appointments].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
  )[0];

  const openQuestionsCount = doctorQuestions.filter((q) => !q.asked).length;

  return (
    <div className="space-y-2">
      {/* Welcome & Daily Health Overview Header */}
      <div className="flex items-center justify-between gap-2 border-b border-emerald-800/80 pb-1.5">
        <div>
          <p className="text-[11px] font-medium text-teal-800 leading-tight">
            Dein persönlicher Gesundheitsüberblick · {formatGermanDate(todayIso)}
          </p>
          <h1
            className="text-base font-bold tracking-tight text-slate-900 leading-snug"
            style={{ textWrap: 'balance' }}
          >
            {profile.fullName.trim()
              ? `Guten Tag, ${profile.fullName.trim().split(' ')[0]}`
              : 'Guten Tag'}
          </h1>
        </div>

        {!isInstalled && (isInstallable || isIOS) && (
          <button
            type="button"
            onClick={() => (isInstallable ? install() : setShowIosHint(true))}
            className="min-h-[34px] px-3 py-1 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-teal-950 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5 text-teal-700" />
            <span>Als Smartphone-App installieren</span>
          </button>
        )}
      </div>

      {showIosHint && (
        <div className="rounded-xl border border-emerald-800 bg-emerald-50 p-3 flex items-center justify-between gap-4 text-xs text-teal-950">
          <span>
            Tippe im Browser auf <strong>Teilen</strong> und wähle{' '}
            <strong>Zum Home-Bildschirm hinzufügen</strong>, um Medical Compass wie eine native App zu starten.
          </span>
          <button
            type="button"
            onClick={() => setShowIosHint(false)}
            className="font-semibold underline shrink-0"
          >
            Schließen
          </button>
        </div>
      )}

      {/* =====================================================================
          ROW 1: VITAL METRICS AT A GLANCE (COMPACT & LIGHT GREEN BACKGROUND)
         ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* 1. Blutdruck und Puls auf einen Blick */}
        <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-semibold text-emerald-950 leading-tight">
                Blutdruck & Puls
              </span>
              <span className="text-sm leading-none select-none shrink-0" aria-hidden="true">
                ❤️
              </span>
            </div>

            {latestBp ? (
              <div className="mt-0.5">
                <div className="flex items-baseline justify-between gap-1.5">
                  <div>
                    <span className="text-lg font-bold font-mono tabular-nums text-slate-900 leading-tight">
                      {latestBp.systolic}/{latestBp.diastolic}
                    </span>
                    <span className="text-[11px] text-slate-600 ml-1">mmHg</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-teal-900">
                    Puls {latestBp.pulse} bpm
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5 truncate">
                  <span
                    className={
                      classifyBloodPressure(latestBp.systolic, latestBp.diastolic)
                        .label === 'Normal'
                        ? 'text-green-600 font-bold'
                        : 'text-red-600 font-bold'
                    }
                  >
                    {classifyBloodPressure(latestBp.systolic, latestBp.diastolic).label}
                  </span>{' '}
                  · {formatGermanDate(latestBp.date)} ({latestBp.time})
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">Noch keine Messung</p>
            )}
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-emerald-800/70 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onNavigateToVitals('bp')}
              className="text-[11px] font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1"
            >
              <span>Verlauf</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onOpenQuickEntry('bp')}
              className="min-h-[24px] px-2 py-0.5 rounded-lg bg-white hover:bg-teal-700 hover:text-white text-emerald-950 border border-emerald-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Messen</span>
            </button>
          </div>
        </div>

        {/* 2. Blutzucker auf einen Blick */}
        <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-semibold text-emerald-950 leading-tight">
                Blutzucker ({profile.glucoseUnit})
              </span>
              <span className="text-sm leading-none select-none shrink-0" aria-hidden="true">
                🩸
              </span>
            </div>

            {latestSugar ? (
              <div className="mt-0.5">
                <div className="flex items-baseline justify-between gap-1.5">
                  <div>
                    <span className="text-lg font-bold font-mono tabular-nums text-slate-900 leading-tight">
                      {formatGlucose(latestSugar.valueMgDl, profile.glucoseUnit)}
                    </span>
                    <span className="text-[11px] text-slate-600 ml-1">
                      {profile.glucoseUnit}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-teal-900">
                    {getGlucoseTypeLabel(latestSugar.measurementType)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5 truncate">
                  {evaluateGlucoseStatus(latestSugar, profile).label} ·{' '}
                  {formatGermanDate(latestSugar.date)} ({latestSugar.time})
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">Noch keine Messung</p>
            )}
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-emerald-800/70 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onNavigateToVitals('sugar')}
              className="text-[11px] font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1"
            >
              <span>Zielbereich</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onOpenQuickEntry('sugar')}
              className="min-h-[24px] px-2 py-0.5 rounded-lg bg-white hover:bg-teal-700 hover:text-white text-emerald-950 border border-emerald-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Eintragen</span>
            </button>
          </div>
        </div>

        {/* 3. Gewicht und Körperwerte */}
        <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-semibold text-emerald-950 leading-tight">
                Gewicht & BMI
              </span>
              {/* Digital Scale Symbol in Orange */}
              <span
                className="inline-flex items-center justify-center shrink-0"
                title="Digitalwaage – Gewicht & BMI"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2.5"
                    y="2.5"
                    width="19"
                    height="19"
                    rx="4"
                    fill="#f97316"
                    stroke="#c2410c"
                    strokeWidth="1.5"
                  />
                  {/* Digital LCD Screen */}
                  <rect
                    x="5.5"
                    y="5"
                    width="13"
                    height="6"
                    rx="1.5"
                    fill="#fff7ed"
                    stroke="#9a3412"
                    strokeWidth="1"
                  />
                  {/* Digital Readout Segments */}
                  <text
                    x="12"
                    y="9.6"
                    textAnchor="middle"
                    fontSize="5.2"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#c2410c"
                  >
                    88.8
                  </text>
                  {/* Scale Foot Pads */}
                  <line
                    x1="7"
                    y1="14.5"
                    x2="7"
                    y2="18.5"
                    stroke="#ffedd5"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="17"
                    y1="14.5"
                    x2="17"
                    y2="18.5"
                    stroke="#ffedd5"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>

            {latestWeight ? (
              <div className="mt-0.5">
                <div className="flex items-baseline justify-between gap-1.5">
                  <div>
                    <span className="text-lg font-bold font-mono tabular-nums text-slate-900 leading-tight">
                      {latestWeight.weightKg.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-slate-600 ml-1">kg</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-teal-900">
                    BMI {currentBmi}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5 truncate">
                  Ziel: {profile.targetWeightKg.toFixed(1)} kg
                  {latestWeight.waistCm ? ` · Bauch: ${latestWeight.waistCm} cm` : ''}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">Noch keine Messung</p>
            )}
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-emerald-800/70 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onNavigateToVitals('weight')}
              className="text-[11px] font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1"
            >
              <span>Körperwerte</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onOpenQuickEntry('weight')}
              className="min-h-[24px] px-2 py-0.5 rounded-lg bg-white hover:bg-teal-700 hover:text-white text-emerald-950 border border-emerald-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Wiegen</span>
            </button>
          </div>
        </div>

        {/* 4. Trinkziel und tägliche Bewegung */}
        <div className="bg-emerald-50/80 rounded-xl border border-emerald-800 px-2.5 py-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-semibold text-emerald-950 leading-tight">
                Trinkziel & Bewegung
              </span>
              {/* Blue Water Droplet Symbol */}
              <span
                className="inline-flex items-center justify-center shrink-0"
                title="Trinkziel & Bewegung"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.5C12 2.5 5 10.2 5 15.2C5 19.066 8.13401 22 12 22C15.866 22 19 19.066 19 15.2C19 10.2 12 2.5 12 2.5Z"
                    fill="#2563eb"
                    stroke="#1d4ed8"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 15.5C8.5 13.5 9.8 11.2 11 9.5"
                    stroke="#bfdbfe"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>

            <div className="mt-0.5">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold font-mono tabular-nums text-teal-900 leading-tight">
                  {waterPercent}%
                </span>
                <span className="text-[11px] text-slate-600 font-mono">
                  {totalWaterToday}/{profile.dailyWaterGoalMl} ml
                </span>
              </div>
              <div className="w-full h-1 bg-white/80 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 leading-tight mt-0.5 flex items-center gap-1 truncate">
                <Footprints className="w-3 h-3 text-teal-700 shrink-0" />
                <span>
                  <strong className="font-mono">{todayHydration.steps}</strong> Schritte ({stepsPercent}%)
                </span>
              </p>
            </div>
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-emerald-800/70 flex items-center justify-between gap-1.5">
            <button
              type="button"
              onClick={() => onAddWater(250, 'Glas Wasser')}
              className="min-h-[24px] flex-1 px-1.5 py-0.5 rounded-lg bg-white hover:bg-teal-700 hover:text-white text-teal-950 border border-emerald-800 text-[11px] font-mono font-semibold transition-colors"
            >
              +250 ml
            </button>
            <button
              type="button"
              onClick={() => onAddWater(500, 'Karaffe Wasser')}
              className="min-h-[24px] flex-1 px-1.5 py-0.5 rounded-lg bg-white hover:bg-teal-700 hover:text-white text-teal-950 border border-emerald-800 text-[11px] font-mono font-semibold transition-colors"
            >
              +500 ml
            </button>
            <button
              type="button"
              onClick={() => onNavigateToVitals('water')}
              className="min-h-[24px] px-1.5 py-0.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 border border-emerald-800 text-[11px] font-semibold"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          ROW 2: TODAY'S MEDICATIONS & RECENT MEASUREMENTS (LIGHT GREEN & COMPACT)
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 Cols: Tabletten, die noch eingenommen werden müssen */}
        <div className="lg:col-span-7 bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-3.5 py-2.5 border-b border-emerald-800/80 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 whitespace-nowrap">
                  Heutige Medikamente erinnerung
                </h2>
                <p className="text-[11px] text-slate-600 whitespace-nowrap">
                  {completedDosesCount} von {todayDoses.length} eingenommen ·{' '}
                  {pendingDoses.length} offen
                </p>
              </div>
              {/* Red & White Pill Symbol on the far right */}
              <span
                className="inline-flex items-center justify-center shrink-0"
                title="Heutige Medikamente Erinnerung"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g transform="rotate(-35 12 12)">
                    {/* Left Half: Red */}
                    <path
                      d="M4 12C4 9.23858 6.23858 7 9 7H12V17H9C6.23858 17 4 14.7614 4 12Z"
                      fill="#dc2626"
                      stroke="#991b1b"
                      strokeWidth="1.5"
                    />
                    {/* Right Half: White */}
                    <path
                      d="M12 7H15C17.7614 7 20 9.23858 20 12C20 14.7614 17.7614 17 15 17H12V7Z"
                      fill="#ffffff"
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />
                    {/* Center Divider */}
                    <line
                      x1="12"
                      y1="7"
                      x2="12"
                      y2="17"
                      stroke="#991b1b"
                      strokeWidth="1.5"
                    />
                  </g>
                </svg>
              </span>
            </div>

            {/* Low stock alert inside card if any */}
            {lowStockMeds.length > 0 && (
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-2 text-xs text-amber-950">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>
                    <strong>Vorrat niedrig:</strong>{' '}
                    {lowStockMeds
                      .map((m) => `${m.name} (${m.stockCount} Stk.)`)
                      .join(', ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToSection('medications')}
                  className="font-semibold underline shrink-0"
                >
                  Vorrat
                </button>
              </div>
            )}

            <div className="divide-y divide-emerald-200/60">
              {todayDoses.map(({ med, scheduledTime, log }) => {
                const status = log?.status || 'offen';
                return (
                  <div
                    key={`${med.id}-${scheduledTime}`}
                    className="px-3 py-2.5 flex flex-col items-start gap-2 hover:bg-emerald-100/40"
                  >
                    <div className="w-full">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xs font-bold font-mono text-teal-900 whitespace-nowrap shrink-0">
                          {scheduledTime} Uhr
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          · {med.name} ({med.dosage})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {med.instructions}
                        {status === 'eingenommen' &&
                          ` · Eingenommen (${log?.actionTime})`}
                        {status === 'verschoben' &&
                          ` · Verschoben (${log?.postponedTo})`}
                        {status === 'uebersprungen' && ` · Übersprungen`}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 sm:flex sm:flex-nowrap items-center gap-1.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => onLogMedication(med, scheduledTime, 'eingenommen')}
                        className={`min-h-[30px] px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-colors whitespace-nowrap ${
                          status === 'eingenommen'
                            ? 'bg-teal-700 text-white border border-teal-800'
                            : 'bg-white hover:bg-teal-50 text-slate-800 border border-emerald-800'
                        }`}
                      >
                        <span>Eingenommen</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onLogMedication(med, scheduledTime, 'verschoben')}
                        className={`min-h-[30px] px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-colors whitespace-nowrap ${
                          status === 'verschoben'
                            ? 'bg-amber-600 text-white border border-amber-700'
                            : 'bg-white hover:bg-amber-50 text-slate-700 border border-emerald-800'
                        }`}
                        title="Um 30 Minuten verschieben"
                      >
                        <span>Verschoben</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onLogMedication(med, scheduledTime, 'uebersprungen')}
                        className={`min-h-[30px] px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-colors whitespace-nowrap ${
                          status === 'uebersprungen'
                            ? 'bg-slate-800 text-white border border-slate-900'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-emerald-800'
                        }`}
                        title="Heute überspringen"
                      >
                        <span>Übersprungen</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-3.5 py-2 bg-emerald-100/50 border-t border-emerald-800/80 flex items-center justify-between text-xs text-black font-medium">
            <span className="text-black">Vorratsberechnung aktiv</span>
            <button
              type="button"
              onClick={() => onNavigateToSection('medications')}
              className="font-semibold text-black hover:underline"
            >
              + Medikament hinzufügen
            </button>
          </div>
        </div>

        {/* Right 5 Cols: New Card "Schmerzen" & Anzeige der letzten Messungen */}
        <div className="lg:col-span-5 space-y-4">
          {/* New Card: "Schmerzen" */}
          <PainTrackerCard
            painEntries={painEntries}
            onAddPainEntry={onAddPainEntry}
            onUpdatePainEntry={onUpdatePainEntry}
            onDeletePainEntry={onDeletePainEntry}
          />

          {/* Anzeige der letzten Messungen */}
          <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-emerald-800/80 flex items-center">
              <h2 className="text-sm font-bold text-slate-900">
                Letzte gespeicherte Messungen
              </h2>
            </div>

            <div className="divide-y divide-emerald-200/60">
              {recentMeasurements.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={m.onClick}
                  className="w-full px-4 py-2.5 text-left hover:bg-emerald-100/50 transition-colors flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-semibold text-slate-600">
                        {m.category}
                      </span>
                      <span className="text-xs font-bold font-mono tabular-nums text-slate-900">
                        · {m.valueText}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">
                      {formatGermanDate(m.date)} ({m.time}) · {m.detailText}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
