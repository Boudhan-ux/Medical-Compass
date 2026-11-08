import React, { useState } from 'react';
import {
  Pill,
  Bell,
  Check,
  Clock,
  SkipForward,
  AlertTriangle,
  Plus,
  PackagePlus,
  Trash2,
} from 'lucide-react';
import { MedicationIntakeLog, MedicationItem } from '../types/health';
import { formatGermanDate, getCurrentTimeHm, getTodayIso } from '../utils/healthHelpers';

interface MedicationsViewProps {
  medications: MedicationItem[];
  medLogs: MedicationIntakeLog[];
  onLogIntake: (
    med: MedicationItem,
    scheduledTime: string,
    status: 'eingenommen' | 'uebersprungen' | 'verschoben'
  ) => void;
  onAddMedication: (med: Omit<MedicationItem, 'id'>) => void;
  onRefillMedication: (id: string, addedTablets: number) => void;
  onDeleteMedication: (id: string) => void;
  onClearMedLogs: () => void;
  onDeleteMedLog: (id: string) => void;
  onSendTestNotification: (title: string, body: string) => void;
}

const WEEKDAY_LABELS = [
  { num: 1, short: 'Mo' },
  { num: 2, short: 'Di' },
  { num: 3, short: 'Mi' },
  { num: 4, short: 'Do' },
  { num: 5, short: 'Fr' },
  { num: 6, short: 'Sa' },
  { num: 7, short: 'So' },
];

export const MedicationsView: React.FC<MedicationsViewProps> = ({
  medications,
  medLogs,
  onLogIntake,
  onAddMedication,
  onRefillMedication,
  onDeleteMedication,
  onClearMedLogs,
  onDeleteMedLog,
  onSendTestNotification,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Add Medication Form State
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [formType, setFormType] = useState<MedicationItem['form']>('Tablette');
  const [time1, setTime1] = useState('08:00');
  const [time2, setTime2] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [stockCount, setStockCount] = useState('30');
  const [lowStockThreshold, setLowStockThreshold] = useState('7');
  const [instructions, setInstructions] = useState('Vor dem Essen mit einem Glas Wasser');
  const [prescriptionReminder, setPrescriptionReminder] = useState('');
  const [refillAmounts, setRefillAmounts] = useState<Record<string, string>>({});

  const todayIso = getTodayIso();

  // Build today's scheduled doses
  const todayDoses = medications.flatMap((med) =>
    med.times.map((schedTime) => {
      const existingLog = medLogs.find(
        (l) =>
          l.medicationId === med.id &&
          l.date === todayIso &&
          l.scheduledTime === schedTime
      );
      return {
        med,
        scheduledTime: schedTime,
        log: existingLog,
      };
    })
  ).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  const lowStockMedications = medications.filter(
    (m) => m.stockCount <= m.lowStockThreshold
  );

  const toggleWeekday = (dayNum: number) => {
    if (selectedDays.includes(dayNum)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== dayNum));
      }
    } else {
      setSelectedDays([...selectedDays, dayNum].sort());
    }
  };

  const handleCreateMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;
    const times = [time1, time2].filter(Boolean).sort();
    onAddMedication({
      name: name.trim(),
      dosage: dosage.trim(),
      form: formType,
      times: times.length ? times : ['08:00'],
      weekdays: selectedDays,
      stockCount: parseInt(stockCount, 10) || 30,
      lowStockThreshold: parseInt(lowStockThreshold, 10) || 7,
      instructions: instructions.trim(),
      prescriptionReminder: prescriptionReminder.trim(),
    });
    setName('');
    setDosage('');
    setTime2('');
    setPrescriptionReminder('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-emerald-800/80 pb-2.5">
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900 leading-snug">
            Medikamenten-Protokoll
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Täglicher Einnahmeplan · Erinnerungen per Handy-Benachrichtigung · Vorratskontrolle & Folgerezepte
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-nowrap items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() =>
              onSendTestNotification(
                'Medical Compass Tablettenerinnerung',
                `Bitte denke an deine Medikamenteneinnahme (${getCurrentTimeHm()} Uhr).`
              )
            }
            className="min-h-[34px] px-2.5 py-1 rounded-xl border border-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 text-[11px] font-semibold text-slate-800 flex items-center justify-center gap-1 whitespace-nowrap"
          >
            <Bell className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="truncate">Handy-Erinnerung testen</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="min-h-[34px] px-2.5 py-1 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {showAddForm ? 'Formular schließen' : 'Medikament hinzufügen'}
            </span>
          </button>
        </div>
      </div>

      {/* Low Stock & Prescription Alert Banner */}
      {lowStockMedications.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/90 px-3.5 py-2.5">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <h2 className="text-xs font-bold text-amber-950 leading-snug">
                Hinweis auf niedrigen Tablettenvorrat & Folgerezept-Erinnerung
              </h2>
              {lowStockMedications.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1.5 border-t border-amber-200/70 text-[11px] text-amber-900"
                >
                  <div className="leading-snug">
                    <strong>
                      {m.name} ({m.dosage})
                    </strong>{' '}
                    · Nur noch <strong className="font-mono">{m.stockCount} Stück</strong> vorrätig
                    (Warnschwelle: {m.lowStockThreshold} Stück)
                    {m.prescriptionReminder ? ` — ${m.prescriptionReminder}` : ''}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const amount = parseInt(refillAmounts[m.id] ?? '30', 10);
                      onRefillMedication(m.id, !isNaN(amount) && amount > 0 ? amount : 30);
                    }}
                    className="min-h-[30px] px-2.5 py-1 rounded-lg bg-amber-900 hover:bg-amber-950 text-white text-[11px] font-semibold flex items-center gap-1 self-start sm:self-center whitespace-nowrap shrink-0"
                  >
                    <PackagePlus className="w-3 h-3 shrink-0" />
                    <span>Neue Packung (+{refillAmounts[m.id] || '30'} Stk.) buchen</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add New Medication Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateMedication}
          className="bg-white rounded-2xl border border-emerald-800 p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-slate-900">
            Neues Medikament mit individueller Erinnerung anlegen
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Medikamentenname
              </label>
              <input
                type="text"
                required
                placeholder="z. B. Bisoprolol oder L-Thyroxin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Dosierung
              </label>
              <input
                type="text"
                required
                placeholder="z. B. 2,5 mg oder 1 Tablette"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Darreichungsform
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as MedicationItem['form'])}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="Tablette">Tablette</option>
                <option value="Kapsel">Kapsel</option>
                <option value="Tropfen">Tropfen</option>
                <option value="Injektion">Injektion / Pen</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                1. Uhrzeit
              </label>
              <input
                type="time"
                required
                value={time1}
                onChange={(e) => setTime1(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                2. Uhrzeit (optional)
              </label>
              <input
                type="time"
                value={time2}
                onChange={(e) => setTime2(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Aktueller Vorrat (Stück)
              </label>
              <input
                type="number"
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Warnung ab Vorrat ≤
              </label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Wochentage der Einnahme
            </label>
            <div className="flex flex-wrap gap-1.5">
              {WEEKDAY_LABELS.map((day) => {
                const active = selectedDays.includes(day.num);
                return (
                  <button
                    key={day.num}
                    type="button"
                    onClick={() => toggleWeekday(day.num)}
                    className={`min-h-[40px] min-w-[44px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day.short}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Einnahmehinweis
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Optionale Erinnerung an Rezept / Arzttermin
              </label>
              <input
                type="text"
                placeholder="z. B. Folgerezept bei Hausarzt im nächsten Monat"
                value={prescriptionReminder}
                onChange={(e) => setPrescriptionReminder(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="min-h-[42px] px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
            >
              Medikament speichern
            </button>
          </div>
        </form>
      )}

      {/* Today's Interactive Intake Schedule */}
      <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
        <div className="px-3.5 py-2.5 border-b border-emerald-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Heutiger Einnahmeplan
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-600 shrink-0">
            {todayDoses.filter((d) => d.log?.status === 'eingenommen').length} /{' '}
            {todayDoses.length} erledigt
          </span>
        </div>

        <div className="divide-y divide-emerald-800">
          {todayDoses.map(({ med, scheduledTime, log }) => {
            const status = log?.status || 'offen';
            return (
              <div
                key={`${med.id}-${scheduledTime}`}
                className="px-3.5 py-3 flex flex-col items-start gap-2 hover:bg-emerald-100/40 transition-colors"
              >
                <div className="space-y-0.5 w-full">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-xs font-bold font-mono text-teal-900 whitespace-nowrap shrink-0">
                      {scheduledTime} Uhr
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      · {med.name} ({med.dosage})
                    </span>
                    <span className="text-[11px] text-slate-500">· {med.form}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {med.instructions} · Vorrat:{' '}
                    <strong className="font-mono">{med.stockCount} Stück</strong>
                    {status === 'eingenommen' &&
                      ` · Status: Eingenommen um ${log?.actionTime} Uhr`}
                    {status === 'uebersprungen' &&
                      ` · Status: Heute übersprungen (${log?.actionTime} Uhr)`}
                    {status === 'verschoben' &&
                      ` · Status: Verschoben auf ${log?.postponedTo} Uhr`}
                  </p>
                </div>

                {/* Action Buttons: Eingenommen, Verschoben, Übersprungen */}
                <div className="grid grid-cols-3 sm:flex sm:flex-nowrap items-center gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onLogIntake(med, scheduledTime, 'eingenommen')}
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-colors whitespace-nowrap ${
                      status === 'eingenommen'
                        ? 'bg-teal-700 text-white border border-teal-800'
                        : 'bg-white hover:bg-teal-50 text-slate-800 border border-emerald-800'
                    }`}
                  >
                    <span>Eingenommen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onLogIntake(med, scheduledTime, 'verschoben')}
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-colors whitespace-nowrap ${
                      status === 'verschoben'
                        ? 'bg-amber-600 text-white border border-amber-700'
                        : 'bg-white hover:bg-amber-50 text-slate-700 border border-emerald-800'
                    }`}
                  >
                    <span>Verschoben</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onLogIntake(med, scheduledTime, 'uebersprungen')}
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-colors whitespace-nowrap ${
                      status === 'uebersprungen'
                        ? 'bg-slate-800 text-white border border-slate-900'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-emerald-800'
                    }`}
                  >
                    <span>Übersprungen</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stored Medication Plan & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Aktueller Medikamentenplan / Medikamentenübersicht Card */}
        <div className="lg:col-span-12 bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
          <div className="px-2.5 py-1.5 border-b border-emerald-800/80 flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-slate-900">
              Aktueller Medikamentenplan
            </h3>
            <span
              className="inline-flex items-center justify-center shrink-0"
              title="Aktueller Medikamentenplan"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <g transform="rotate(-35 12 12)">
                  <path
                    d="M4 12C4 9.23858 6.23858 7 9 7H12V17H9C6.23858 17 4 14.7614 4 12Z"
                    fill="#dc2626"
                    stroke="#991b1b"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 7H15C17.7614 7 20 9.23858 20 12C20 14.7614 17.7614 17 15 17H12V7Z"
                    fill="#ffffff"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
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
          <div className="divide-y divide-emerald-800">
            {medications.map((med) => {
              const isLow = med.stockCount <= med.lowStockThreshold;
              const currentRefillValue = refillAmounts[med.id] ?? '30';
              return (
                <div
                  key={med.id}
                  className="px-2.5 py-1.5 flex items-center justify-between gap-2 hover:bg-emerald-100/40 transition-colors"
                >
                  <div className="space-y-0 min-w-0 leading-tight">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">
                        {med.name} · {med.dosage}
                      </span>
                      <span className="text-[11px] text-slate-500">({med.form})</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Uhrzeiten: <strong className="font-mono">{med.times.join(', ')} Uhr</strong> ·
                      Tage: {med.weekdays.length === 7 ? 'Täglich (Mo–So)' : `${med.weekdays.length} Tage/Woche`}
                    </p>
                    <p
                      className={`text-[11px] font-medium leading-snug ${
                        isLow ? 'text-amber-700 font-semibold' : 'text-slate-600'
                      }`}
                    >
                      Tablettenvorrat: <span className="font-mono">{med.stockCount} Stück</span>
                      {isLow ? ' (Niedriger Vorrat!)' : ''}
                    </p>
                    {med.prescriptionReminder && (
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Rezept-/Arzthinweis: {med.prescriptionReminder}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div
                      className="min-h-[28px] flex items-center rounded-lg bg-white border border-emerald-800 overflow-hidden"
                      title="Vorrat-Anzahl bearbeiten und auffüllen"
                    >
                      <div className="flex items-center pl-1.5 pr-1 py-0.5">
                        <span className="text-[11px] font-bold text-emerald-800 font-mono">+</span>
                        <input
                          type="number"
                          min={1}
                          max={1000}
                          value={currentRefillValue}
                          onChange={(e) =>
                            setRefillAmounts((prev) => ({
                              ...prev,
                              [med.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const parsed = parseInt(currentRefillValue, 10);
                              onRefillMedication(
                                med.id,
                                !isNaN(parsed) && parsed !== 0 ? parsed : 30
                              );
                            }
                          }}
                          aria-label="Vorrat Zahl bearbeiten"
                          className="w-10 px-0.5 py-0 text-[11px] font-mono font-bold text-slate-900 text-center rounded border border-emerald-200 focus:border-emerald-700 focus:bg-emerald-50/50 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const parsed = parseInt(currentRefillValue, 10);
                          onRefillMedication(
                            med.id,
                            !isNaN(parsed) && parsed !== 0 ? parsed : 30
                          );
                        }}
                        className="min-h-[28px] px-2 py-0.5 bg-emerald-50/70 hover:bg-emerald-100 border-l border-emerald-800 text-[11px] font-medium text-slate-800 transition-colors cursor-pointer"
                        title="Packung auffüllen"
                      >
                        Vorrat
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteMedication(med.id)}
                      className="min-h-[28px] min-w-[28px] flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      title="Medikament entfernen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Intake History */}
        <div className="lg:col-span-12 bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
          <div className="px-2.5 py-1.5 border-b border-emerald-800/80 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Einnahmehistorie ({medLogs.length})
              </h3>
              <p className="text-[11px] text-slate-600">
                Chronologisches Protokoll aller dokumentierten Einnahmen
              </p>
            </div>
            {medLogs.length > 0 && (
              <button
                type="button"
                onClick={onClearMedLogs}
                title="Gesamte Einnahmehistorie löschen"
                aria-label="Gesamte Einnahmehistorie löschen"
                className="min-h-[28px] min-w-[28px] inline-flex items-center justify-center rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="divide-y divide-emerald-800 max-h-[340px] overflow-y-auto">
            {medLogs.length === 0 ? (
              <p className="px-3 py-4 text-xs text-slate-500 text-center">
                Keine Einträge vorhanden — Protokollliste ist frei.
              </p>
            ) : (
              medLogs.map((log) => (
                <div
                  key={log.id}
                  className="px-2.5 py-2 flex items-center justify-between gap-2"
                >
                  <div className="space-y-0 flex-1 min-w-0 leading-tight">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="font-semibold text-slate-900">
                        {log.medicationName} ({log.dosage})
                      </span>
                      <span
                        className={`font-mono font-semibold text-[11px] ${
                          log.status === 'eingenommen'
                            ? 'text-teal-700'
                            : log.status === 'verschoben'
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {log.status === 'eingenommen'
                          ? 'Eingenommen'
                          : log.status === 'verschoben'
                          ? `Verschoben (${log.postponedTo})`
                          : 'Übersprungen'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {formatGermanDate(log.date)} · Geplant {log.scheduledTime} Uhr · Erfasst{' '}
                      {log.actionTime} Uhr
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteMedLog(log.id)}
                    title="Eintrag löschen"
                    aria-label="Eintrag löschen"
                    className="min-h-[28px] min-w-[28px] inline-flex items-center justify-center rounded-md text-rose-700 hover:bg-rose-100/80 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
