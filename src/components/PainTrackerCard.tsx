import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Activity,
} from 'lucide-react';
import { PainEntry, PainLevel } from '../types/health';
import {
  formatGermanDate,
  getCurrentTimeHm,
  getTodayIso,
} from '../utils/healthHelpers';

interface PainTrackerCardProps {
  painEntries: PainEntry[];
  onAddPainEntry: (entry: Omit<PainEntry, 'id'>) => void;
  onUpdatePainEntry: (updated: PainEntry) => void;
  onDeletePainEntry: (id: string) => void;
}

const PAIN_LEVELS: PainLevel[] = ['Stark', 'Leicht', 'Kurz'];

export const PainTrackerCard: React.FC<PainTrackerCardProps> = ({
  painEntries,
  onAddPainEntry,
  onUpdatePainEntry,
  onDeletePainEntry,
}) => {
  const [hasPain, setHasPain] = useState<boolean>(true);
  const [description, setDescription] = useState<string>('');
  const [painLevel, setPainLevel] = useState<PainLevel>('Leicht');
  const [entryDate, setEntryDate] = useState<string>(getTodayIso());

  // Inline Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<PainEntry | null>(null);

  const handleSaveEntry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanDesc =
      description.trim() ||
      (hasPain ? `Schmerzen (${painLevel})` : 'Keine Schmerzen');
    onAddPainEntry({
      date: entryDate || getTodayIso(),
      time: getCurrentTimeHm(),
      hasPain,
      description: cleanDesc,
      level: hasPain ? painLevel : undefined,
    });
    setDescription('');
  };

  const startEditing = (entry: PainEntry) => {
    setEditingId(entry.id);
    setEditDraft({
      ...entry,
      level: entry.level || 'Leicht',
    });
  };

  const handleSaveEdit = () => {
    if (!editDraft) return;
    onUpdatePainEntry({
      ...editDraft,
      description:
        editDraft.description.trim() ||
        (editDraft.hasPain
          ? `Schmerzen (${editDraft.level || 'Leicht'})`
          : 'Keine Schmerzen'),
      level: editDraft.hasPain ? editDraft.level || 'Leicht' : undefined,
    });
    setEditingId(null);
    setEditDraft(null);
  };

  const getLevelBadgeStyle = (level?: PainLevel) => {
    if (level === 'Stark') {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    if (level === 'Leicht') {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    return 'bg-teal-100 text-teal-800 border-teal-300';
  };

  return (
    <div className="bg-emerald-50/70 rounded-xl border border-emerald-800 overflow-hidden">
      {/* Card Header */}
      <div className="px-3.5 py-2.5 border-b border-emerald-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-red-600 shrink-0" />
          <h2 className="text-sm font-bold text-slate-900">Schmerzen</h2>
        </div>
        <button
          type="button"
          onClick={() => handleSaveEntry()}
          className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Eintragen</span>
        </button>
      </div>

      {/* Interactive Form Body */}
      <form onSubmit={handleSaveEntry} className="p-3 space-y-2.5">
        {/* Row 1: Ja ☑️ "color rot" | Nein ☑️ "color Grün" | Unselected = Grau */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setHasPain(true)}
            aria-pressed={hasPain}
            className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              hasPain
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-700 shadow-xs'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-600 border-slate-300'
            }`}
          >
            {hasPain ? (
              <CheckSquare className="w-4 h-4 shrink-0" />
            ) : (
              <Square className="w-4 h-4 shrink-0" />
            )}
            <span>Ja ☑️</span>
          </button>

          <button
            type="button"
            onClick={() => setHasPain(false)}
            aria-pressed={!hasPain}
            className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !hasPain
                ? 'bg-green-600 hover:bg-green-700 text-white border-green-700 shadow-xs'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-600 border-slate-300'
            }`}
          >
            {!hasPain ? (
              <CheckSquare className="w-4 h-4 shrink-0" />
            ) : (
              <Square className="w-4 h-4 shrink-0" />
            )}
            <span>Nein ☑️</span>
          </button>
        </div>

        {/* Row 2: [Schmerzen Beschreibung] & Datum */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-emerald-950 mb-1">
              Schmerzen Beschreibung
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Schmerzen Beschreibung (z. B. Rücken, Kopf, Gelenke)..."
              className="w-full min-h-[34px] px-2.5 py-1.5 rounded-lg border border-emerald-800 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-emerald-950 mb-1">
              Datum
            </label>
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="w-full min-h-[34px] px-2 py-1.5 rounded-lg border border-emerald-800 bg-white font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>
        </div>

        {/* Row 3: Schmerzen Stufe: <Stark> <Leicht> <Kurz> */}
        <div className="pt-0.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-emerald-950">
              Schmerzen Stufe:
            </span>

            <div className="grid grid-cols-3 gap-1.5 flex-1 sm:flex-initial">
              {PAIN_LEVELS.map((lvl) => {
                const isSelected = hasPain && painLevel === lvl;
                const activeColor =
                  lvl === 'Stark'
                    ? 'bg-red-600 text-white border-red-700 shadow-xs'
                    : lvl === 'Leicht'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                    : 'bg-teal-700 text-white border-teal-800 shadow-xs';

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setHasPain(true);
                      setPainLevel(lvl);
                    }}
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? activeColor
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-600 border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 shrink-0" />}
                    <span>{lvl}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </form>

      {/* Saved Daily Pain Entries List */}
      <div className="border-t border-emerald-800/80 bg-white/90">
        <div className="px-3.5 py-1.5 bg-emerald-100/60 border-b border-emerald-800/60 flex items-center justify-between">
          <span className="text-[11px] font-bold text-emerald-950">
            Gespeicherte Schmerzen-Einträge ({painEntries.length})
          </span>
          <span className="text-[10px] font-semibold text-teal-800">
            Synchronisiert mit Bericht
          </span>
        </div>

        <div className="divide-y divide-emerald-200/70 max-h-56 overflow-y-auto">
          {painEntries.slice(0, 8).map((entry) => (
            <div key={entry.id} className="px-3.5 py-2">
              {editingId === entry.id && editDraft ? (
                <div className="space-y-2 py-1">
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditDraft({ ...editDraft, hasPain: true })
                      }
                      className={`py-1 px-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
                        editDraft.hasPain
                          ? 'bg-red-600 text-white border-red-700'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      <span>Ja ☑️</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditDraft({ ...editDraft, hasPain: false })
                      }
                      className={`py-1 px-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
                        !editDraft.hasPain
                          ? 'bg-green-600 text-white border-green-700'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      <span>Nein ☑️</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      value={editDraft.description}
                      onChange={(e) =>
                        setEditDraft({
                          ...editDraft,
                          description: e.target.value,
                        })
                      }
                      placeholder="Schmerzen Beschreibung..."
                      className="sm:col-span-2 px-2 py-1 rounded border border-emerald-800 bg-white text-xs text-slate-900"
                    />
                    <input
                      type="date"
                      value={editDraft.date}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, date: e.target.value })
                      }
                      className="px-2 py-1 rounded border border-emerald-800 bg-white font-mono text-xs text-slate-900"
                    />
                  </div>

                  {editDraft.hasPain && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-emerald-950">
                        Schmerzen Stufe:
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        {PAIN_LEVELS.map((lvl) => {
                          const sel = editDraft.level === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() =>
                                setEditDraft({ ...editDraft, level: lvl })
                              }
                              className={`px-2 py-0.5 rounded border text-[11px] font-bold cursor-pointer ${
                                sel
                                  ? 'bg-red-600 text-white border-red-700'
                                  : 'bg-slate-200 text-slate-600 border-slate-300'
                              }`}
                            >
                              {lvl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditDraft(null);
                      }}
                      className="px-2 py-0.5 rounded border border-emerald-800 bg-white text-[10px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>Abbrechen</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-2.5 py-0.5 rounded bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Speichern</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          entry.hasPain
                            ? 'bg-red-600 text-white border-red-700'
                            : 'bg-green-600 text-white border-green-700'
                        }`}
                      >
                        {entry.hasPain ? 'Ja ☑️' : 'Nein ☑️'}
                      </span>

                      {entry.hasPain && entry.level && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getLevelBadgeStyle(
                            entry.level
                          )}`}
                        >
                          Stufe: {entry.level}
                        </span>
                      )}

                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {entry.description}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {formatGermanDate(entry.date)} · {entry.time} Uhr
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditing(entry)}
                      className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-800/70 text-emerald-950 transition-colors cursor-pointer"
                      title="Eintrag bearbeiten"
                      aria-label="Eintrag bearbeiten"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeletePainEntry(entry.id)}
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
  );
};
