import React, { useState } from 'react';
import { X, HeartPulse, Droplet, Scale, GlassWater, Check } from 'lucide-react';
import {
  BloodPressureEntry,
  BloodSugarEntry,
  DaytimePeriod,
  GlucoseMeasurementType,
  UserHealthProfile,
  WeightBodyEntry,
} from '../types/health';
import {
  getCurrentTimeHm,
  getTodayIso,
  parseGlucoseInputToMgDl,
} from '../utils/healthHelpers';

export type QuickEntryTab = 'bp' | 'sugar' | 'weight' | 'water';

interface QuickEntryModalProps {
  isOpen: boolean;
  initialTab: QuickEntryTab;
  onClose: () => void;
  profile: UserHealthProfile;
  onAddBp: (entry: Omit<BloodPressureEntry, 'id'>) => void;
  onAddSugar: (entry: Omit<BloodSugarEntry, 'id'>) => void;
  onAddWeight: (entry: Omit<WeightBodyEntry, 'id'>) => void;
  onAddWater: (amountMl: number, label: string) => void;
  onUpdateActivity: (stepsDelta: number, minutesDelta: number, summary: string) => void;
}

const BP_CONTEXT_PRESETS = [
  'Vor der Tablette',
  'Nach der Tablette',
  'In Ruhe',
  'Nach dem Sport',
  'Nach dem Aufstehen',
  'Stress / Anspannung',
];

const SPORT_CONTEXT_PRESETS = ['Laufband', 'Fahrrad', 'Gymnastik'];

const SLEEP_DIAGNOSTIC_PRESETS = [
  'Erholsamer Schlaf',
  'Unruhiger Schlaf',
  'Durchschlafstörung',
  'Schnarchen / Apnoe-Hinweis',
];

export const QuickEntryModal: React.FC<QuickEntryModalProps> = ({
  isOpen,
  initialTab,
  onClose,
  profile,
  onAddBp,
  onAddSugar,
  onAddWeight,
  onAddWater,
  onUpdateActivity,
}) => {
  const [activeTab, setActiveTab] = useState<QuickEntryTab>(initialTab);

  // Sync when modal opens with a specific tab
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const currentHour = new Date().getHours();
  const defaultPeriod: DaytimePeriod =
    currentHour < 11 ? 'morgens' : currentHour < 17 ? 'mittags' : 'abends';

  // BP Form State
  const [sys, setSys] = useState('124');
  const [dia, setDia] = useState('78');
  const [pulse, setPulse] = useState('68');
  const [bpDate, setBpDate] = useState(getTodayIso());
  const [bpTime, setBpTime] = useState(getCurrentTimeHm());
  const [bpPeriod, setBpPeriod] = useState<DaytimePeriod>(defaultPeriod);
  const [bpContexts, setBpContexts] = useState<string[]>(['Vor der Tablette']);
  const [sportContexts, setSportContexts] = useState<string[]>([]);
  const [lbMinutes, setLbMinutes] = useState('20');
  const [lbCalories, setLbCalories] = useState('165');
  const [frMinutes, setFrMinutes] = useState('30');
  const [frKm, setFrKm] = useState('8.5');
  const [gymMinutes, setGymMinutes] = useState('15');
  const [gymCategory, setGymCategory] = useState(
    'Mobilisation & Aufwärmen'
  );
  const [sleepDiagnostics, setSleepDiagnostics] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState('7.5');
  const [bpNote, setBpNote] = useState('');

  const toggleBpContext = (preset: string) => {
    setBpContexts((prev) =>
      prev.includes(preset)
        ? prev.filter((item) => item !== preset)
        : [...prev, preset]
    );
  };

  const toggleSportContext = (preset: string) => {
    setSportContexts((prev) =>
      prev.includes(preset)
        ? prev.filter((item) => item !== preset)
        : [...prev, preset]
    );
  };

  const toggleSleepDiagnostic = (preset: string) => {
    setSleepDiagnostics((prev) =>
      prev.includes(preset)
        ? prev.filter((item) => item !== preset)
        : [...prev, preset]
    );
  };

  // Blood Sugar Form State
  const [sugarVal, setSugarVal] = useState(
    profile.glucoseUnit === 'mmol/l' ? '5.3' : '95'
  );
  const [sugarType, setSugarType] = useState<GlucoseMeasurementType>('nuechtern');
  const [mealDistance, setMealDistance] = useState('Nüchtern (> 8 Std.)');
  const [sugarDate, setSugarDate] = useState(getTodayIso());
  const [sugarTime, setSugarTime] = useState(getCurrentTimeHm());
  const [foodNote, setFoodNote] = useState('');
  const [activityNote, setActivityNote] = useState('');
  const [wellbeing, setWellbeing] = useState<BloodSugarEntry['wellbeing']>('Gut');

  // Weight Form State
  const [weightKg, setWeightKg] = useState('81.2');
  const [waistCm, setWaistCm] = useState('92');
  const [bodyFat, setBodyFat] = useState('22.3');
  const [weightDate, setWeightDate] = useState(getTodayIso());
  const [weightTime, setWeightTime] = useState(getCurrentTimeHm());
  const [weightNote, setWeightNote] = useState('');

  // Water & Movement State
  const [waterAmount, setWaterAmount] = useState('250');
  const [waterLabel, setWaterLabel] = useState('Glas Wasser');
  const [stepsAdd, setStepsAdd] = useState('1500');
  const [minutesAdd, setMinutesAdd] = useState('20');
  const [activityDesc, setActivityDesc] = useState('Spaziergang an der frischen Luft');

  if (!isOpen) return null;

  const handleSaveBp = (e: React.FormEvent) => {
    e.preventDefault();
    const s = Number(sys);
    const d = Number(dia);
    const p = Number(pulse);
    if (!s || !d || !p) return;
    const formattedSports = sportContexts.map((sc) => {
      if (sc === 'Laufband') return `Laufband (${lbMinutes} Min., ${lbCalories} kcal)`;
      if (sc === 'Fahrrad') return `Fahrrad (${frMinutes} Min., ${frKm} km)`;
      if (sc === 'Gymnastik') return `Gymnastik (${gymMinutes} Min., ${gymCategory})`;
      return sc;
    });
    const allContexts = [
      ...bpContexts,
      ...formattedSports,
      ...sleepDiagnostics.map((sd) => `Schlaf: ${sd} (${sleepHours} Std.)`),
    ];
    onAddBp({
      systolic: s,
      diastolic: d,
      pulse: p,
      date: bpDate,
      time: bpTime,
      period: bpPeriod,
      contextTag: allContexts.length > 0 ? allContexts.join(', ') : 'In Ruhe',
      note: bpNote.trim(),
    });
    onClose();
  };

  const handleSaveSugar = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(sugarVal.replace(',', '.'));
    if (isNaN(num) || num <= 0) return;
    const mgDl = parseGlucoseInputToMgDl(num, profile.glucoseUnit);
    onAddSugar({
      valueMgDl: mgDl,
      measurementType: sugarType,
      mealDistance,
      date: sugarDate,
      time: sugarTime,
      foodNote: foodNote.trim(),
      activityNote: activityNote.trim(),
      wellbeing,
    });
    onClose();
  };

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightKg.replace(',', '.'));
    if (isNaN(w) || w <= 0) return;
    const waist = waistCm ? parseFloat(waistCm.replace(',', '.')) : undefined;
    const bf = bodyFat ? parseFloat(bodyFat.replace(',', '.')) : undefined;
    onAddWeight({
      weightKg: w,
      waistCm: waist && !isNaN(waist) ? waist : undefined,
      bodyFatPercent: bf && !isNaN(bf) ? bf : undefined,
      date: weightDate,
      time: weightTime,
      note: weightNote.trim(),
    });
    onClose();
  };

  const handleSaveWaterAndActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const wAmt = parseInt(waterAmount, 10);
    if (!isNaN(wAmt) && wAmt > 0) {
      onAddWater(wAmt, waterLabel || 'Wasser');
    }
    const sAdd = parseInt(stepsAdd, 10) || 0;
    const mAdd = parseInt(minutesAdd, 10) || 0;
    if (sAdd > 0 || mAdd > 0) {
      onUpdateActivity(sAdd, mAdd, activityDesc);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm pt-10 sm:p-4">
      <div className="w-full max-w-xl rounded-t-3xl sm:rounded-2xl bg-white border border-slate-200 shadow-xl max-h-[85vh] sm:max-h-[92vh] pb-[max(env(safe-area-inset-bottom),3rem)] sm:pb-0 flex flex-col overflow-hidden">
        {/* Mobile grab handle */}
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Neue Messung eintragen</h2>
            <p className="text-xs text-slate-500">
              Datum und Uhrzeit werden automatisch vorgeschlagen
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Tab Selector */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('bp')}
            className={`min-h-[40px] flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'bp'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-sm leading-none select-none shrink-0" aria-hidden="true">
              ❤️
            </span>
            <span>Blutdruck</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sugar')}
            className={`min-h-[40px] flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'sugar'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-sm leading-none select-none shrink-0" aria-hidden="true">
              🩸
            </span>
            <span>Blutzucker</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('weight')}
            className={`min-h-[40px] flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'weight'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span
              className="text-sm leading-none select-none shrink-0 text-black brightness-0"
              aria-hidden="true"
            >
              ⚖️
            </span>
            <span>Gewicht</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('water')}
            className={`min-h-[40px] flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'water'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span
              className="text-sm leading-none select-none shrink-0 text-black brightness-0"
              aria-hidden="true"
            >
              🩸
            </span>
            <span>Trinken/Sport</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'bp' && (
            <form onSubmit={handleSaveBp} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Systolisch (mmHg)
                  </label>
                  <input
                    type="number"
                    min={60}
                    max={260}
                    required
                    value={sys}
                    onChange={(e) => setSys(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-lg font-semibold text-slate-900 focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Diastolisch (mmHg)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={160}
                    required
                    value={dia}
                    onChange={(e) => setDia(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-lg font-semibold text-slate-900 focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Puls (Schläge/Min)
                  </label>
                  <input
                    type="number"
                    min={35}
                    max={220}
                    required
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-lg font-semibold text-slate-900 focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Datum</label>
                  <input
                    type="date"
                    value={bpDate}
                    onChange={(e) => setBpDate(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Uhrzeit</label>
                  <input
                    type="time"
                    value={bpTime}
                    onChange={(e) => setBpTime(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tageszeit</label>
                  <select
                    value={bpPeriod}
                    onChange={(e) => setBpPeriod(e.target.value as DaytimePeriod)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white"
                  >
                    <option value="morgens">Morgens</option>
                    <option value="mittags">Mittags</option>
                    <option value="abends">Abends</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Messsituation auswählen (Mehrfachauswahl möglich)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {BP_CONTEXT_PRESETS.map((preset) => {
                    const isSelected = bpContexts.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => toggleBpContext(preset)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        <span>{preset}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* New InfoCard under "Messsituation auswählen": Laufband, Fahrrad, Gymnastik */}
              <div className="bg-emerald-50/80 border border-emerald-800 rounded-xl px-3 py-2.5 space-y-2">
                <p className="text-xs font-bold text-slate-900">
                  Training & Sportart auswählen (Mehrfachauswahl):
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {SPORT_CONTEXT_PRESETS.map((sport) => {
                    const isSelected = sportContexts.includes(sport);
                    return (
                      <button
                        key={sport}
                        type="button"
                        onClick={() => toggleSportContext(sport)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 border cursor-pointer ${
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

                {sportContexts.includes('Laufband') && (
                  <div className="p-2 rounded-lg bg-white border border-emerald-800 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                        Laufband: Minuten
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={lbMinutes}
                        onChange={(e) => setLbMinutes(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-emerald-800 font-mono text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                        Kalorien (kcal)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={lbCalories}
                        onChange={(e) => setLbCalories(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-emerald-800 font-mono text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {sportContexts.includes('Fahrrad') && (
                  <div className="p-2 rounded-lg bg-white border border-emerald-800 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                        Fahrrad: Minuten
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={frMinutes}
                        onChange={(e) => setFrMinutes(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-emerald-800 font-mono text-xs font-bold text-slate-900"
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
                        value={frKm}
                        onChange={(e) => setFrKm(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-emerald-800 font-mono text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {sportContexts.includes('Gymnastik') && (
                  <div className="p-2 rounded-lg bg-white border border-emerald-800 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                        Gymnastik: Minuten
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={gymMinutes}
                        onChange={(e) => setGymMinutes(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-emerald-800 font-mono text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                        Aktivitäts-Kategorie
                      </label>
                      <select
                        value={gymCategory}
                        onChange={(e) => setGymCategory(e.target.value)}
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
                  </div>
                )}
              </div>

              {/* New Card: "Schlafdiagnostik" */}
              <div className="bg-emerald-50/80 border border-emerald-800 rounded-xl px-3 py-2.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900">
                    Schlafdiagnostik
                  </p>
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-medium text-slate-700">
                      Schlafdauer (Std.):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="16"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                      className="w-14 px-1.5 py-0.5 rounded border border-emerald-800 bg-white font-mono text-xs font-bold text-slate-900 text-center"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SLEEP_DIAGNOSTIC_PRESETS.map((diag) => {
                    const isSelected = sleepDiagnostics.includes(diag);
                    return (
                      <button
                        key={diag}
                        type="button"
                        onClick={() => toggleSleepDiagnostic(diag)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 border cursor-pointer ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                            : 'bg-white text-slate-800 border-emerald-800/70 hover:bg-emerald-100/70'
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
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ergänzende Notiz (optional)
                </label>
                <input
                  type="text"
                  placeholder="z. B. Linker Oberarm nach 5 Min. Sitzen"
                  value={bpNote}
                  onChange={(e) => setBpNote(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Blutdruck & Puls speichern</span>
              </button>
            </form>
          )}

          {activeTab === 'sugar' && (
            <form onSubmit={handleSaveSugar} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Blutzuckerwert ({profile.glucoseUnit})
                  </label>
                  <input
                    type="number"
                    step={profile.glucoseUnit === 'mmol/l' ? '0.1' : '1'}
                    required
                    value={sugarVal}
                    onChange={(e) => setSugarVal(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-lg font-semibold text-slate-900 focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Messzeitpunkt
                  </label>
                  <select
                    value={sugarType}
                    onChange={(e) => {
                      const val = e.target.value as GlucoseMeasurementType;
                      setSugarType(val);
                      if (val === 'nuechtern') setMealDistance('Nüchtern (> 8 Std.)');
                      if (val === 'vor_essen') setMealDistance('Direkt vor Mahlzeit');
                      if (val === 'nach_essen_1h') setMealDistance('1 Std. nach Mahlzeit');
                      if (val === 'nach_essen_2h') setMealDistance('2 Std. nach Mahlzeit');
                      if (val === 'vor_schlafen') setMealDistance('Vor dem Schlafen');
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white"
                  >
                    <option value="nuechtern">Nüchternmessung</option>
                    <option value="vor_essen">Vor dem Essen</option>
                    <option value="nach_essen_1h">Nach dem Essen (1 Std.)</option>
                    <option value="nach_essen_2h">Nach dem Essen (2 Std.)</option>
                    <option value="vor_schlafen">Vor dem Schlafen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Datum</label>
                  <input
                    type="date"
                    value={sugarDate}
                    onChange={(e) => setSugarDate(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Uhrzeit</label>
                  <input
                    type="time"
                    value={sugarTime}
                    onChange={(e) => setSugarTime(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Wohlbefinden
                  </label>
                  <select
                    value={wellbeing}
                    onChange={(e) =>
                      setWellbeing(e.target.value as BloodSugarEntry['wellbeing'])
                    }
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Sehr gut">Sehr gut</option>
                    <option value="Gut">Gut</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Müde">Müde</option>
                    <option value="Unwohl">Unwohl</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Notiz zu Essen / Mahlzeit
                  </label>
                  <input
                    type="text"
                    placeholder="z. B. Haferflocken mit Beeren"
                    value={foodNote}
                    onChange={(e) => setFoodNote(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Notiz zu Bewegung
                  </label>
                  <input
                    type="text"
                    placeholder="z. B. 20 Min. Spaziergang"
                    value={activityNote}
                    onChange={(e) => setActivityNote(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Blutzuckerwert speichern</span>
              </button>
            </form>
          )}

          {activeTab === 'weight' && (
            <form onSubmit={handleSaveWeight} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Gewicht (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-lg font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Bauchumfang (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Optional"
                    value={waistCm}
                    onChange={(e) => setWaistCm(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-base text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Körperfett (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Optional"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-base text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Datum</label>
                  <input
                    type="date"
                    value={weightDate}
                    onChange={(e) => setWeightDate(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Uhrzeit</label>
                  <input
                    type="time"
                    value={weightTime}
                    onChange={(e) => setWeightTime(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Notiz (optional)
                </label>
                <input
                  type="text"
                  placeholder="z. B. Morgens nüchtern gewogen"
                  value={weightNote}
                  onChange={(e) => setWeightNote(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Gewicht & Körperwerte speichern</span>
              </button>
            </form>
          )}

          {activeTab === 'water' && (
            <form onSubmit={handleSaveWaterAndActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Schnellauswahl Trinkmenge
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { ml: '150', label: 'Kleines Glas' },
                    { ml: '250', label: 'Becher' },
                    { ml: '330', label: 'Flasche' },
                    { ml: '500', label: 'Karaffe' },
                  ].map((preset) => (
                    <button
                      key={preset.ml}
                      type="button"
                      onClick={() => {
                        setWaterAmount(preset.ml);
                        setWaterLabel(preset.label);
                      }}
                      className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        waterAmount === preset.ml
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      +{preset.ml} ml
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Wassermenge (ml)
                  </label>
                  <input
                    type="number"
                    value={waterAmount}
                    onChange={(e) => setWaterAmount(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-base font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Getränk / Bezeichnung
                  </label>
                  <input
                    type="text"
                    value={waterLabel}
                    onChange={(e) => setWaterLabel(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-800 mb-2">
                  Tägliche Bewegung ergänzen (optional)
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Zusätzliche Schritte
                    </label>
                    <input
                      type="number"
                      value={stepsAdd}
                      onChange={(e) => setStepsAdd(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Aktive Minuten
                    </label>
                    <input
                      type="number"
                      value={minutesAdd}
                      onChange={(e) => setMinutesAdd(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Art der Bewegung
                  </label>
                  <input
                    type="text"
                    value={activityDesc}
                    onChange={(e) => setActivityDesc(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Trinkmenge & Bewegung eintragen</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
