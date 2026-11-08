import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  HeartPulse,
  Droplet,
  Scale,
  Stethoscope,
  Clock,
  MapPin,
  Trash2,
} from 'lucide-react';
import {
  BloodPressureEntry,
  BloodSugarEntry,
  DoctorAppointment,
  DoctorQuestion,
  PreventiveCheckItem,
  UserHealthProfile,
  WeightBodyEntry,
} from '../types/health';
import {
  formatGermanDate,
  formatGlucose,
  getDaysInFutureIso,
  getTodayIso,
} from '../utils/healthHelpers';
import { QuickEntryTab } from './QuickEntryModal';

interface CalendarViewProps {
  appointments: DoctorAppointment[];
  doctorQuestions: DoctorQuestion[];
  preventiveChecks: PreventiveCheckItem[];
  bpEntries: BloodPressureEntry[];
  sugarEntries: BloodSugarEntry[];
  weightEntries: WeightBodyEntry[];
  profile: UserHealthProfile;
  onNavigateToSection: (
    section: 'dashboard' | 'vitals' | 'medications' | 'doctors' | 'calendar' | 'report'
  ) => void;
  onOpenQuickEntry: (tab: QuickEntryTab) => void;
  onAddAppointment: (apt: Omit<DoctorAppointment, 'id'>) => void;
  onDeleteAppointment: (id: string) => void;
  onUpdateAppointment?: (apt: DoctorAppointment) => void;
}

const WEEKDAYS_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTHS_DE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  doctorQuestions,
  preventiveChecks,
  bpEntries,
  sugarEntries,
  weightEntries,
  profile,
  onNavigateToSection,
  onOpenQuickEntry,
  onAddAppointment,
  onDeleteAppointment,
  onUpdateAppointment,
}) => {
  const todayIso = getTodayIso();
  const [selectedDateIso, setSelectedDateIso] = useState<string>(todayIso);

  const initialDateObj = new Date(`${todayIso}T12:00:00`);
  const [viewYear, setViewYear] = useState<number>(initialDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDateObj.getMonth());

  // Full appointment form state ("Neuen Arzttermin eintragen")
  const [showAptForm, setShowAptForm] = useState(false);
  const [newAptDoctorName, setNewAptDoctorName] = useState('');
  const [newAptSpecialty, setNewAptSpecialty] =
    useState<DoctorAppointment['specialty']>('Hausarzt');
  const [newAptDate, setNewAptDate] = useState(getDaysInFutureIso(7));
  const [newAptTime, setNewAptTime] = useState('09:30');
  const [newAptLocation, setNewAptLocation] = useState('');
  const [newAptReason, setNewAptReason] = useState('');
  const [newAptIsBloodTest, setNewAptIsBloodTest] = useState(false);
  const [newAptFastingRequired, setNewAptFastingRequired] = useState(false);
  const [newAptNotes, setNewAptNotes] = useState('');

  // Quick appointment creation for selected date
  const [showAddApt, setShowAddApt] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState<DoctorAppointment['specialty']>('Hausarzt');
  const [aptTime, setAptTime] = useState('09:00');
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState('');
  const [fastingRequired, setFastingRequired] = useState(false);

  // Edit existing appointment state
  const [editingAptId, setEditingAptId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DoctorAppointment | null>(null);

  const startEditingAppointment = (apt: DoctorAppointment) => {
    setEditingAptId(apt.id);
    setEditDraft({ ...apt });
  };

  const handleSaveEditedAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDraft || !editDraft.doctorName.trim() || !editDraft.reason.trim()) return;
    onUpdateAppointment?.({
      ...editDraft,
      doctorName: editDraft.doctorName.trim(),
      reason: editDraft.reason.trim(),
      location: editDraft.location.trim() || 'Praxis vor Ort',
    });
    setEditingAptId(null);
    setEditDraft(null);
  };

  const sortedAppointments = [...appointments].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
  );

  const nextAppointment =
    [...appointments]
      .filter((a) => a.date >= todayIso)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0] ||
    sortedAppointments[0];

  const openQuestionsCount = doctorQuestions.filter((q) => !q.asked).length;

  // Calendar grid generation (Monday-first)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Convert JS Sunday=0..Saturday=6 to Monday=0..Sunday=6
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

  const calendarCells: Array<{ day: number | null; iso: string | null }> = [];
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push({ day: null, iso: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(
      2,
      '0'
    )}`;
    calendarCells.push({ day: d, iso });
  }

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleCreateFullAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptDoctorName.trim() || !newAptReason.trim()) return;
    onAddAppointment({
      doctorName: newAptDoctorName.trim(),
      specialty: newAptSpecialty,
      date: newAptDate,
      time: newAptTime,
      location: newAptLocation.trim() || 'Praxis vor Ort',
      reason: newAptReason.trim(),
      isBloodTest: newAptIsBloodTest,
      fastingRequired: newAptFastingRequired,
      notes: newAptNotes.trim(),
    });
    setNewAptDoctorName('');
    setNewAptReason('');
    setNewAptLocation('');
    setNewAptNotes('');
    setNewAptIsBloodTest(false);
    setNewAptFastingRequired(false);
    setShowAptForm(false);
  };

  const handleCreateAppointmentForSelectedDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !reason.trim()) return;
    onAddAppointment({
      doctorName: doctorName.trim(),
      specialty,
      date: selectedDateIso,
      time: aptTime,
      location: location.trim() || 'Praxis vor Ort',
      reason: reason.trim(),
      fastingRequired,
      reminderNote: fastingRequired ? 'Bitte nüchtern erscheinen' : '',
    });
    setDoctorName('');
    setReason('');
    setLocation('');
    setFastingRequired(false);
    setShowAddApt(false);
  };

  // Data for selected date
  const selectedAppointments = appointments.filter((a) => a.date === selectedDateIso);
  const selectedBp = bpEntries.filter((b) => b.date === selectedDateIso);
  const selectedSugar = sugarEntries.filter((s) => s.date === selectedDateIso);
  const selectedWeight = weightEntries.filter((w) => w.date === selectedDateIso);
  const selectedPreventive = preventiveChecks.filter(
    (p) => p.nextDueDate === selectedDateIso || p.lastDoneDate === selectedDateIso
  );

  return (
    <div className="space-y-4">
      {/* Header: Kalender + Neuen Arzttermin eintragen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-emerald-800/80 pb-2.5">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-snug">
            Kalender
          </h1>
          <p className="text-xs text-slate-600">
            Arzttermine, Vorsorge & tägliche Messungen im Überblick
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAptForm(!showAptForm)}
          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 self-start whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span>{showAptForm ? 'Formular schließen' : 'Neuen Arzttermin eintragen'}</span>
        </button>
      </div>

      {/* New Appointment Form */}
      {showAptForm && (
        <form
          onSubmit={handleCreateFullAppointment}
          className="bg-emerald-50/70 rounded-xl border border-emerald-800 px-3 py-2.5 space-y-2.5"
        >
          <h2 className="text-sm font-bold text-slate-900 leading-tight">
            Arzttermin / Planen
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                Arzt / Praxisname
              </label>
              <input
                type="text"
                required
                placeholder="z. B. Dr. med. Claudia Weber"
                value={newAptDoctorName}
                onChange={(e) => setNewAptDoctorName(e.target.value)}
                className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                Fachrichtung
              </label>
              <select
                value={newAptSpecialty}
                onChange={(e) =>
                  setNewAptSpecialty(e.target.value as DoctorAppointment['specialty'])
                }
                className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 text-xs bg-white text-slate-900"
              >
                <option value="Hausarzt">Hausarzt</option>
                <option value="Innere Medizin">Innere Medizin</option>
                <option value="Kardiologie">Kardiologie</option>
                <option value="Diabetologie">Diabetologie</option>
                <option value="HNO">HNO</option>
                <option value="Neurologie">Neurologie</option>
                <option value="Radiologie">Radiologie</option>
                <option value="Chirurgie">Chirurgie</option>
                <option value="Urologie">Urologie</option>
                <option value="Labor / Blutuntersuchung">Labor / Blutuntersuchung</option>
                <option value="Augenarzt">Augenarzt</option>
                <option value="Zahnarzt">Zahnarzt</option>
                <option value="Orthopädie">Orthopädie</option>
                <option value="Sonstiger Facharzt">Sonstiger Facharzt</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                Adresse / Ort
              </label>
              <input
                type="text"
                placeholder="z. B. Hauptstr. 42"
                value={newAptLocation}
                onChange={(e) => setNewAptLocation(e.target.value)}
                className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                Datum
              </label>
              <input
                type="date"
                required
                value={newAptDate}
                onChange={(e) => setNewAptDate(e.target.value)}
                className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                Uhrzeit
              </label>
              <input
                type="time"
                required
                value={newAptTime}
                onChange={(e) => setNewAptTime(e.target.value)}
                className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white font-mono text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                Untersuchungsgrund
              </label>
              <input
                type="text"
                required
                placeholder="z. B. Blutabnahme HbA1c & Quartalskontrolle"
                value={newAptReason}
                onChange={(e) => setNewAptReason(e.target.value)}
                className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
              Vorbereitungs-Notiz (optional)
            </label>
            <input
              type="text"
              placeholder="z. B. Versichertenkarte, Impfpass und Medikamentenplan mitbringen"
              value={newAptNotes}
              onChange={(e) => setNewAptNotes(e.target.value)}
              className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => setShowAptForm(false)}
              className="min-h-[30px] px-3 py-1 rounded-lg border border-emerald-800 bg-white text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="min-h-[30px] px-3.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer"
            >
              Termin speichern
            </button>
          </div>
        </form>
      )}

      {/* =====================================================================
          INTERACTIVE MONTHLY CALENDAR
         ===================================================================== */}
      <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 border border-emerald-800 text-slate-800 flex items-center gap-1 text-xs font-semibold"
            aria-label="Vorheriger Monat"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Zurück</span>
          </button>

          <h3 className="text-sm font-bold text-slate-900">
            {MONTHS_DE[viewMonth]} {viewYear}
          </h3>

          <button
            type="button"
            onClick={handleNextMonth}
            className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 border border-emerald-800 text-slate-800 flex items-center gap-1 text-xs font-semibold"
            aria-label="Nächster Monat"
          >
            <span>Weiter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS_DE.map((wd) => (
            <div
              key={wd}
              className="text-[11px] font-bold text-emerald-950 py-1"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((cell, idx) => {
            if (!cell.day || !cell.iso) {
              return <div key={`empty-${idx}`} className="h-11 rounded-lg" />;
            }

            const isToday = cell.iso === todayIso;
            const isSelected = cell.iso === selectedDateIso;
            const hasApt = appointments.some((a) => a.date === cell.iso);
            const hasBp = bpEntries.some((b) => b.date === cell.iso);
            const hasSugar = sugarEntries.some((s) => s.date === cell.iso);
            const hasWeight = weightEntries.some((w) => w.date === cell.iso);

            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => setSelectedDateIso(cell.iso!)}
                className={`h-11 rounded-lg border text-xs font-mono flex flex-col items-center justify-between p-1 transition-colors ${
                  isSelected
                    ? 'bg-teal-700 text-white border-emerald-950 font-bold'
                    : isToday
                    ? 'bg-emerald-200/80 text-teal-950 border-emerald-800 font-bold'
                    : 'bg-white/90 hover:bg-emerald-100 text-slate-800 border-emerald-800/50'
                }`}
              >
                <span className="leading-none">{cell.day}</span>
                <span className="flex items-center gap-0.5">
                  {hasApt && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-300' : 'bg-amber-600'
                      }`}
                      title="Arzttermin"
                    />
                  )}
                  {(hasBp || hasSugar || hasWeight) && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-emerald-200' : 'bg-teal-600'
                      }`}
                      title="Messwerte vorhanden"
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-700">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
              Arzttermin
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
              Messung gespeichert
            </span>
          </div>
          <span className="font-mono text-slate-600">
            Ausgewählt: {formatGermanDate(selectedDateIso)}
          </span>
        </div>
      </div>

      {/* =====================================================================
          TERMINE (UNTER CARD KALENDER)
         ===================================================================== */}
      <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-emerald-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-teal-700 shrink-0" />
            <h2 className="text-sm font-bold text-slate-900">
              Termine
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToSection('doctors')}
            className="text-xs font-semibold text-teal-800 hover:text-teal-950 whitespace-nowrap shrink-0"
          >
            Vorsorge & Fragen ({openQuestionsCount})
          </button>
        </div>

        <div className="divide-y divide-emerald-800">
          {sortedAppointments.length > 0 ? (
            sortedAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3.5 hover:bg-emerald-100/40 transition-colors"
              >
                {editingAptId === apt.id && editDraft ? (
                  <form
                    onSubmit={handleSaveEditedAppointment}
                    className="space-y-2.5 bg-white/90 p-3 rounded-xl border border-emerald-800"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Arzt / Praxisname"
                        value={editDraft.doctorName}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, doctorName: e.target.value })
                        }
                        className="w-full min-h-[34px] px-2.5 py-1 rounded-lg border border-emerald-800 text-xs"
                      />
                      <select
                        value={editDraft.specialty}
                        onChange={(e) =>
                          setEditDraft({
                            ...editDraft,
                            specialty: e.target.value as DoctorAppointment['specialty'],
                          })
                        }
                        className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 text-xs bg-white"
                      >
                        <option value="Hausarzt">Hausarzt</option>
                        <option value="Innere Medizin">Innere Medizin</option>
                        <option value="Kardiologie">Kardiologie</option>
                        <option value="Diabetologie">Diabetologie</option>
                        <option value="HNO">HNO</option>
                        <option value="Neurologie">Neurologie</option>
                        <option value="Radiologie">Radiologie</option>
                        <option value="Chirurgie">Chirurgie</option>
                        <option value="Urologie">Urologie</option>
                        <option value="Labor / Blutuntersuchung">
                          Labor / Blutuntersuchung
                        </option>
                        <option value="Augenarzt">Augenarzt</option>
                        <option value="Zahnarzt">Zahnarzt</option>
                        <option value="Orthopädie">Orthopädie</option>
                        <option value="Sonstiger Facharzt">Sonstiger Facharzt</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Ort / Adresse"
                        value={editDraft.location}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, location: e.target.value })
                        }
                        className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="date"
                        required
                        value={editDraft.date}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, date: e.target.value })
                        }
                        className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 text-xs"
                      />
                      <input
                        type="time"
                        required
                        value={editDraft.time}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, time: e.target.value })
                        }
                        className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 text-xs font-mono"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Grund"
                        value={editDraft.reason}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, reason: e.target.value })
                        }
                        className="w-full min-h-[32px] px-2.5 py-1 rounded-lg border border-emerald-800 text-xs"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAptId(null);
                          setEditDraft(null);
                        }}
                        className="min-h-[30px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white text-xs font-semibold text-slate-700"
                      >
                        Abbrechen
                      </button>
                      <button
                        type="submit"
                        className="min-h-[30px] px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
                      >
                        Speichern
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-1.5">
                        <span className="text-xs sm:text-sm font-bold font-mono text-teal-800">
                          {formatGermanDate(apt.date)} · {apt.time} Uhr
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          · {apt.doctorName}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          · {apt.specialty}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-800">{apt.reason}</p>
                      <p className="text-[11px] text-slate-600">
                        Ort: {apt.location}
                        {apt.isBloodTest ? ' · Blutuntersuchung geplant' : ''}
                        {apt.fastingRequired
                          ? ' · WICHTIG: Bitte nüchtern erscheinen!'
                          : ''}
                      </p>
                      {apt.notes && (
                        <p className="text-[11px] text-slate-600">
                          Hinweis: {apt.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 self-end lg:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditingAppointment(apt)}
                        className="min-h-[30px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white hover:bg-emerald-100 text-emerald-950 text-xs font-semibold transition-colors"
                      >
                        Bearbeiten
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteAppointment(apt.id)}
                        className="min-h-[30px] px-2.5 py-1 rounded-lg border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors"
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="p-4 text-xs text-slate-500">
              Kein anstehender Termin eingetragen.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
