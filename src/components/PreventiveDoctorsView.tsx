import React, { useState } from 'react';
import {
  Calendar,
  Stethoscope,
  ShieldCheck,
  HelpCircle,
  Plus,
  CheckCircle2,
  Trash2,
  FlaskConical,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import {
  DoctorAppointment,
  DoctorQuestion,
  PreventiveCheckItem,
} from '../types/health';
import {
  formatGermanDate,
  getDaysInFutureIso,
  getTodayIso,
} from '../utils/healthHelpers';

interface PreventiveDoctorsViewProps {
  appointments: DoctorAppointment[];
  onAddAppointment: (apt: Omit<DoctorAppointment, 'id'>) => void;
  onDeleteAppointment: (id: string) => void;
  preventiveChecks: PreventiveCheckItem[];
  onAddPreventiveCheck: (item: Omit<PreventiveCheckItem, 'id'>) => void;
  onMarkPreventiveDone: (id: string) => void;
  onUpdatePreventiveCheck: (updated: PreventiveCheckItem) => void;
  onDeletePreventiveCheck: (id: string) => void;
  doctorQuestions: DoctorQuestion[];
  onAddQuestion: (question: string, specialty: string) => void;
  onToggleQuestionAsked: (id: string, answerNote?: string) => void;
  onDeleteQuestion: (id: string) => void;
}

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

export const PreventiveDoctorsView: React.FC<PreventiveDoctorsViewProps> = ({
  appointments,
  onAddAppointment,
  onDeleteAppointment,
  preventiveChecks,
  onAddPreventiveCheck,
  onMarkPreventiveDone,
  onUpdatePreventiveCheck,
  onDeletePreventiveCheck,
  doctorQuestions,
  onAddQuestion,
  onToggleQuestionAsked,
  onDeleteQuestion,
}) => {
  const [showAptForm, setShowAptForm] = useState(false);

  // Lab Values Table State ("Laborwerte")
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

  // Appointment Form State
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] =
    useState<DoctorAppointment['specialty']>('Hausarzt');
  const [aptDate, setAptDate] = useState(getDaysInFutureIso(7));
  const [aptTime, setAptTime] = useState('09:30');
  const [location, setLocation] = useState('');
  const [reason, setReason] = useState('');
  const [isBloodTest, setIsBloodTest] = useState(false);
  const [fastingRequired, setFastingRequired] = useState(false);
  const [notes, setNotes] = useState('');

  // Question Form State
  const [newQuestion, setNewQuestion] = useState('');
  const [questionSpecialty, setQuestionSpecialty] = useState('Hausarzt');
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [answerDraft, setAnswerDraft] = useState('');

  // Notes ("Notizen") State for +Neu (matches Muster-Einträge structure)
  const [showAddNote, setShowAddNote] = useState(false);
  const [newPrevTitle, setNewPrevTitle] = useState('');
  const [newPrevCategory, setNewPrevCategory] =
    useState<PreventiveCheckItem['category']>('Blutuntersuchung');
  const [newPrevInterval, setNewPrevInterval] = useState('Alle 3 Monate');
  const [newPrevStatus, setNewPrevStatus] =
    useState<PreventiveCheckItem['status']>('faellig_bald');
  const [newPrevLastDoneDate, setNewPrevLastDoneDate] = useState(getTodayIso());
  const [newPrevNextDueDate, setNewPrevNextDueDate] = useState(getDaysInFutureIso(90));
  const [newPrevNotes, setNewPrevNotes] = useState('');

  const [customNotes, setCustomNotes] = useState<
    Array<{ id: string; title: string; text: string; date: string }>
  >(() => {
    try {
      const saved = localStorage.getItem('gesundlife_doctor_notes_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const handleAddPreventiveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrevTitle.trim()) return;
    onAddPreventiveCheck({
      title: newPrevTitle.trim(),
      category: newPrevCategory,
      intervalLabel: newPrevInterval.trim() || 'Regelmäßig',
      status: newPrevStatus,
      lastDoneDate: newPrevLastDoneDate || getTodayIso(),
      nextDueDate: newPrevNextDueDate || getDaysInFutureIso(90),
      notes: newPrevNotes.trim(),
    });
    setNewPrevTitle('');
    setNewPrevCategory('Blutuntersuchung');
    setNewPrevInterval('Alle 3 Monate');
    setNewPrevStatus('faellig_bald');
    setNewPrevLastDoneDate(getTodayIso());
    setNewPrevNextDueDate(getDaysInFutureIso(90));
    setNewPrevNotes('');
    setShowAddNote(false);
  };

  const handleDeleteCustomNote = (id: string) => {
    const next = customNotes.filter((n) => n.id !== id);
    setCustomNotes(next);
    try {
      localStorage.setItem('gesundlife_doctor_notes_v1', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // Edit Custom Note State
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteText, setEditNoteText] = useState('');

  const startEditingCustomNote = (note: { id: string; title: string; text: string }) => {
    setEditingNoteId(note.id);
    setEditNoteTitle(note.title);
    setEditNoteText(note.text);
  };

  const handleSaveCustomNoteEdit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const next = customNotes.map((n) =>
      n.id === id
        ? { ...n, title: editNoteTitle.trim() || 'Notiz', text: editNoteText.trim() }
        : n
    );
    setCustomNotes(next);
    try {
      localStorage.setItem('gesundlife_doctor_notes_v1', JSON.stringify(next));
    } catch {
      // ignore
    }
    setEditingNoteId(null);
  };

  // Edit PreventiveCheckItem State (for "Großes Blutbild...", "Saisonale Grippeimpfung...", etc.)
  const [editingPrevId, setEditingPrevId] = useState<string | null>(null);
  const [prevDraft, setPrevDraft] = useState<PreventiveCheckItem | null>(null);

  const startEditingPreventive = (item: PreventiveCheckItem) => {
    setEditingPrevId(item.id);
    setPrevDraft({ ...item });
  };

  const handleSavePreventiveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prevDraft || !prevDraft.title.trim()) return;
    onUpdatePreventiveCheck({
      ...prevDraft,
      title: prevDraft.title.trim(),
      intervalLabel: prevDraft.intervalLabel.trim() || 'Regelmäßig',
      notes: prevDraft.notes.trim(),
    });
    setEditingPrevId(null);
    setPrevDraft(null);
  };

  const sortedAppointments = [...appointments].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
  );

  const filteredPreventive = preventiveChecks;

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !reason.trim()) return;
    onAddAppointment({
      doctorName: doctorName.trim(),
      specialty,
      date: aptDate,
      time: aptTime,
      location: location.trim() || 'Praxis vor Ort',
      reason: reason.trim(),
      isBloodTest,
      fastingRequired,
      notes: notes.trim(),
    });
    setDoctorName('');
    setReason('');
    setLocation('');
    setNotes('');
    setIsBloodTest(false);
    setFastingRequired(false);
    setShowAptForm(false);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    onAddQuestion(newQuestion.trim(), questionSpecialty);
    setNewQuestion('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2.5 border-b border-emerald-800/80 pb-2.5">
        <h1 className="text-base font-bold tracking-tight text-slate-900 leading-snug">
          Vorsorge & Laborwerte
        </h1>
      </div>

      {/* =====================================================================
          NEW CARD: LABORWERTE TABLE ("Untersuchung", "Resultat", "Referenzwerte")
         ===================================================================== */}
      <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
        <div className="px-3.5 py-2.5 border-b border-emerald-800/80 flex items-center justify-between gap-2">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap">
            Laborwerte & Befunde
          </h2>

          <button
            type="button"
            onClick={() => setShowAddLabRow(!showAddLabRow)}
            className="px-2 py-1 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold whitespace-nowrap shrink-0"
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
                className="px-2.5 py-1 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold whitespace-nowrap"
              >
                +Hinzufügen
              </button>
              <button
                type="button"
                onClick={() => setShowAddLabRow(false)}
                className="px-2 py-1 rounded-md border border-emerald-800 bg-white text-[11px] font-medium text-slate-700"
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
            <tbody className="divide-y divide-emerald-200/70 text-xs">
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
                      className="min-h-[28px] min-w-[28px] inline-flex items-center justify-center rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
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

      {/* Bottom 2 Columns: Vaccinations/Preventive Checks + Questions for Doctor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 6 Cols: Notizen */}
        <div className="lg:col-span-6 bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden flex flex-col min-w-0">
          <div className="p-4 border-b border-emerald-800/80 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <h2 className="text-sm font-bold text-slate-900">
                  Notizen
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowAddNote(!showAddNote)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white shadow-xs transition-colors"
              >
                +Neu
              </button>
            </div>

            {showAddNote && (
              <form
                onSubmit={handleAddPreventiveNote}
                className="space-y-2 bg-white/95 p-3 rounded-xl border border-emerald-800"
              >
                <div>
                  <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                    Titel / Vorsorge-Eintrag
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z. B. Großes Blutbild & Langzeitblutzucker (HbA1c)"
                    value={newPrevTitle}
                    onChange={(e) => setNewPrevTitle(e.target.value)}
                    className="w-full px-2.5 py-1 rounded border border-emerald-800 bg-white text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                      Kategorie
                    </label>
                    <select
                      value={newPrevCategory}
                      onChange={(e) =>
                        setNewPrevCategory(
                          e.target.value as PreventiveCheckItem['category']
                        )
                      }
                      className="w-full px-2 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                    >
                      <option value="Blutuntersuchung">Blutuntersuchung</option>
                      <option value="Impfung">Impfung</option>
                      <option value="Vorsorgeuntersuchung">Vorsorgeuntersuchung</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                      Intervall
                    </label>
                    <input
                      type="text"
                      placeholder="z. B. Alle 3 Monate / Jährlich"
                      value={newPrevInterval}
                      onChange={(e) => setNewPrevInterval(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                      Status
                    </label>
                    <select
                      value={newPrevStatus}
                      onChange={(e) =>
                        setNewPrevStatus(
                          e.target.value as PreventiveCheckItem['status']
                        )
                      }
                      className="w-full px-2 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                    >
                      <option value="aktuell">Aktuell / Erledigt</option>
                      <option value="faellig_bald">Demnächst fällig</option>
                      <option value="ueberfaellig">Überfällig</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                      Zuletzt durchgeführt
                    </label>
                    <input
                      type="date"
                      value={newPrevLastDoneDate}
                      onChange={(e) => setNewPrevLastDoneDate(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                      Nächster Termin / Fällig am
                    </label>
                    <input
                      type="date"
                      value={newPrevNextDueDate}
                      onChange={(e) => setNewPrevNextDueDate(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                    Notiz / Hinweis
                  </label>
                  <input
                    type="text"
                    placeholder="z. B. Termin bei Hausarzt vereinbart (Nüchtern erscheinen)"
                    value={newPrevNotes}
                    onChange={(e) => setNewPrevNotes(e.target.value)}
                    className="w-full px-2.5 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddNote(false)}
                    className="px-2.5 py-1 rounded border border-emerald-800 bg-white text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Abbrechen</span>
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Speichern</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="divide-y divide-emerald-800">
            {customNotes.map((note) => (
              <div key={note.id} className="p-3.5 hover:bg-emerald-100/40 transition-colors">
                {editingNoteId === note.id ? (
                  <form
                    onSubmit={(e) => handleSaveCustomNoteEdit(e, note.id)}
                    className="space-y-2 bg-white/95 p-2.5 rounded-lg border border-emerald-800"
                  >
                    <input
                      type="text"
                      value={editNoteTitle}
                      onChange={(e) => setEditNoteTitle(e.target.value)}
                      placeholder="Titel"
                      className="w-full px-2.5 py-1 rounded border border-emerald-800 bg-white text-xs font-bold text-slate-900"
                    />
                    <input
                      type="text"
                      value={editNoteText}
                      onChange={(e) => setEditNoteText(e.target.value)}
                      placeholder="Notiztext..."
                      className="w-full px-2.5 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-800"
                    />
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingNoteId(null)}
                        className="px-2 py-1 rounded border border-emerald-800 bg-white text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Abbrechen</span>
                      </button>
                      <button
                        type="submit"
                        className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Speichern</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs font-bold text-slate-900 block">
                        {note.title}
                      </span>
                      {note.text && (
                        <p className="text-xs text-slate-700">{note.text}</p>
                      )}
                      <p className="text-[11px] text-slate-500 font-mono">
                        {formatGermanDate(note.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditingCustomNote(note)}
                        className="min-h-[28px] min-w-[28px] flex items-center justify-center rounded-lg bg-white/90 hover:bg-emerald-100 border border-emerald-800/70 text-emerald-950 transition-colors cursor-pointer"
                        title="Notiz bearbeiten"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomNote(note.id)}
                        className="min-h-[28px] min-w-[28px] flex items-center justify-center rounded-lg bg-white/90 hover:bg-rose-50 border border-emerald-800/70 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Notiz löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredPreventive.map((item) => (
              <div
                key={item.id}
                className="p-3.5 hover:bg-emerald-100/40 transition-colors"
              >
                {editingPrevId === item.id && prevDraft ? (
                  <form
                    onSubmit={handleSavePreventiveEdit}
                    className="space-y-2 bg-white/95 p-3 rounded-xl border border-emerald-800"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                        Titel / Vorsorge-Eintrag
                      </label>
                      <input
                        type="text"
                        required
                        value={prevDraft.title}
                        onChange={(e) =>
                          setPrevDraft({ ...prevDraft, title: e.target.value })
                        }
                        className="w-full px-2.5 py-1 rounded border border-emerald-800 bg-white text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Kategorie
                        </label>
                        <select
                          value={prevDraft.category}
                          onChange={(e) =>
                            setPrevDraft({
                              ...prevDraft,
                              category: e.target.value as PreventiveCheckItem['category'],
                            })
                          }
                          className="w-full px-2 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                        >
                          <option value="Blutuntersuchung">Blutuntersuchung</option>
                          <option value="Impfung">Impfung</option>
                          <option value="Vorsorgeuntersuchung">Vorsorgeuntersuchung</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Intervall
                        </label>
                        <input
                          type="text"
                          value={prevDraft.intervalLabel}
                          onChange={(e) =>
                            setPrevDraft({ ...prevDraft, intervalLabel: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Status
                        </label>
                        <select
                          value={prevDraft.status}
                          onChange={(e) =>
                            setPrevDraft({
                              ...prevDraft,
                              status: e.target.value as PreventiveCheckItem['status'],
                            })
                          }
                          className="w-full px-2 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                        >
                          <option value="aktuell">Aktuell / Erledigt</option>
                          <option value="faellig_bald">Demnächst fällig</option>
                          <option value="ueberfaellig">Überfällig</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Zuletzt durchgeführt
                        </label>
                        <input
                          type="date"
                          value={prevDraft.lastDoneDate}
                          onChange={(e) =>
                            setPrevDraft({ ...prevDraft, lastDoneDate: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                          Nächster Termin / Fällig am
                        </label>
                        <input
                          type="date"
                          value={prevDraft.nextDueDate}
                          onChange={(e) =>
                            setPrevDraft({ ...prevDraft, nextDueDate: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950 mb-0.5">
                        Notiz / Hinweis
                      </label>
                      <input
                        type="text"
                        value={prevDraft.notes}
                        onChange={(e) =>
                          setPrevDraft({ ...prevDraft, notes: e.target.value })
                        }
                        className="w-full px-2.5 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPrevId(null);
                          setPrevDraft(null);
                        }}
                        className="px-2.5 py-1 rounded border border-emerald-800 bg-white text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Abbrechen</span>
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Speichern</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {item.category === 'Blutuntersuchung' ? (
                          <FlaskConical className="w-4 h-4 text-teal-700 shrink-0" />
                        ) : (
                          <Stethoscope className="w-4 h-4 text-teal-700 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-900">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {item.category} · {item.intervalLabel} · Zuletzt:{' '}
                        <span className="font-mono">{formatGermanDate(item.lastDoneDate)}</span> ·
                        Fällig:{' '}
                        <span className="font-mono">{formatGermanDate(item.nextDueDate)}</span>
                      </p>
                      <p
                        className={`text-[11px] font-semibold ${
                          item.status === 'aktuell'
                            ? 'text-teal-800'
                            : item.status === 'faellig_bald'
                            ? 'text-amber-800'
                            : 'text-rose-700'
                        }`}
                      >
                        Status:{' '}
                        {item.status === 'aktuell'
                          ? 'Aktuell geschützt / erledigt'
                          : item.status === 'faellig_bald'
                          ? 'Demnächst fällig'
                          : 'Überfällig – bitte Termin vereinbaren'}
                        {item.notes ? ` · ${item.notes}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                      {item.status !== 'aktuell' && (
                        <button
                          type="button"
                          onClick={() => onMarkPreventiveDone(item.id)}
                          className="min-h-[28px] px-2 py-1 rounded-lg border border-emerald-800 bg-white hover:bg-teal-700 hover:text-white text-emerald-950 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
                        >
                          Heute erledigt
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => startEditingPreventive(item)}
                        className="min-h-[28px] px-2 py-1 rounded-lg bg-white/90 hover:bg-emerald-100 border border-emerald-800/70 text-emerald-950 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Eintrag bearbeiten"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Bearbeiten</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeletePreventiveCheck(item.id)}
                        className="min-h-[28px] min-w-[28px] flex items-center justify-center rounded-lg bg-white/90 hover:bg-rose-50 border border-emerald-800/70 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Eintrag löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Collect Questions for Next Doctor Visit */}
        <div className="lg:col-span-6 bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden flex flex-col min-w-0">
          <div className="p-4 border-b border-emerald-800/80">
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle className="w-4 h-4 text-teal-700 shrink-0" />
              <h2 className="text-sm font-bold text-slate-900">
                Fragen-Liste für den Arzt
              </h2>
            </div>
            <p className="text-[11px] text-black mb-3">
              Notiere dir Fragen im Alltag sofort, damit beim Arzttermin nichts vergessen wird.
            </p>

            <form onSubmit={handleCreateQuestion} className="space-y-2">
              <input
                type="text"
                placeholder="Neue Frage an den Arzt eingeben..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full min-h-[38px] px-3 py-1.5 rounded-xl border border-emerald-800 bg-white text-xs text-slate-900"
              />
              <div className="flex items-center gap-2 w-full min-w-0">
                <select
                  value={questionSpecialty}
                  onChange={(e) => setQuestionSpecialty(e.target.value)}
                  className="min-w-0 flex-1 min-h-[38px] px-2.5 py-1.5 rounded-xl border border-emerald-800 text-xs bg-white text-slate-800 truncate"
                >
                  <option value="Hausarzt">Für Hausarzt</option>
                  <option value="Kardiologie">Für Kardiologie</option>
                  <option value="Diabetologie">Für Diabetologie</option>
                  <option value="Apotheke / Allgemein">Für Apotheke / Allgemein</option>
                </select>
                <button
                  type="submit"
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold whitespace-nowrap shrink-0"
                >
                  + Frage merken
                </button>
              </div>
            </form>
          </div>

          <div className="divide-y divide-emerald-200/60">
            {doctorQuestions.map((q) => (
              <div key={q.id} className="p-4 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleQuestionAsked(q.id)}
                    className="flex items-start gap-2 text-left group min-w-0 flex-1"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                        q.asked
                          ? 'text-teal-700'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-medium ${
                          q.asked ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {q.question}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {q.specialty} · {formatGermanDate(q.createdAt)} ·{' '}
                        {q.asked ? 'Besprochen' : 'Offen'}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteQuestion(q.id)}
                    className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 shrink-0"
                    title="Frage entfernen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {q.answerNote && (
                  <p className="text-xs text-teal-950 bg-white/85 border border-emerald-800/60 rounded-lg px-3 py-1.5 ml-6">
                    <strong>Antwort:</strong> {q.answerNote}
                  </p>
                )}

                {editingAnswerId === q.id ? (
                  <div className="ml-6 flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Antwort des Arztes notieren..."
                      value={answerDraft}
                      onChange={(e) => setAnswerDraft(e.target.value)}
                      className="min-w-0 flex-1 min-h-[34px] px-2.5 py-1 rounded-lg border border-emerald-800 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onToggleQuestionAsked(q.id, answerDraft);
                        setEditingAnswerId(null);
                        setAnswerDraft('');
                      }}
                      className="min-h-[34px] px-3 py-1 rounded-lg bg-teal-700 text-white text-xs font-semibold shrink-0"
                    >
                      Speichern
                    </button>
                  </div>
                ) : (
                  <div className="ml-6">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAnswerId(q.id);
                        setAnswerDraft(q.answerNote || '');
                      }}
                      className="text-xs text-teal-800 hover:underline font-medium"
                    >
                      {q.answerNote ? 'Arzt-Antwort bearbeiten' : '+ Antwort vom Arzt notieren'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
