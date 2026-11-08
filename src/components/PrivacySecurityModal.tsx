import React, { useRef, useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Download,
  Upload,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Smartphone,
} from 'lucide-react';

interface PrivacySecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinEnabled: boolean;
  onSetPin: (newPin: string | null) => void;
  onLockNow: () => void;
  onExportFullBackup: () => void;
  onImportFullBackup: (jsonText: string) => { success: boolean; message: string };
  onDeleteAllData: () => void;
}

export const PrivacySecurityModal: React.FC<PrivacySecurityModalProps> = ({
  isOpen,
  onClose,
  pinEnabled,
  onSetPin,
  onLockNow,
  onExportFullBackup,
  onImportFullBackup,
  onDeleteAllData,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'security' | 'data'>('privacy');
  const [pinInput, setPinInput] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [statusMsg, setStatusMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleEnablePin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pinInput.trim();
    if (!/^\d{4}$/.test(cleaned)) {
      setStatusMsg({
        type: 'error',
        text: 'Bitte gib genau 4 Ziffern (0–9) für deine Sicherheits-PIN ein.',
      });
      return;
    }
    if (cleaned !== pinConfirm.trim()) {
      setStatusMsg({
        type: 'error',
        text: 'Die beiden PIN-Eingaben stimmen nicht überein.',
      });
      return;
    }
    onSetPin(cleaned);
    setPinInput('');
    setPinConfirm('');
    setStatusMsg({
      type: 'success',
      text: '4-stelliger PIN-Schutz aktiviert. Wichtig: Wenn du deine PIN vergisst, gehen alle gespeicherten Daten verloren!',
    });
  };

  const handleDisablePin = () => {
    onSetPin(null);
    setPinInput('');
    setPinConfirm('');
    setStatusMsg({
      type: 'success',
      text: 'Der PIN-Sperrschutz wurde deaktiviert.',
    });
  };

  const handleBackupFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setStatusMsg({
        type: 'error',
        text: 'Die ausgewählte Datei ist zu groß (maximal 5 MB erlaubt).',
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const result = onImportFullBackup(reader.result);
        setStatusMsg({
          type: result.success ? 'success' : 'error',
          text: result.message,
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmDeleteAll = () => {
    onDeleteAllData();
    setConfirmDeleteStep(false);
    setStatusMsg({
      type: 'success',
      text: 'Alle Gesundheitsdaten sowie alle persönlichen Angaben im Profil wurden vollständig gelöscht.',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-3 py-14 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-emerald-50 border-2 border-emerald-800 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 bg-emerald-100/90 border-b border-emerald-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h2
                id="privacy-modal-title"
                className="text-sm font-bold text-slate-900 leading-tight"
              >
                Datenschutz, App-Sicherheit & Play-Store-Konformität
              </h2>
              <p className="text-[11px] text-emerald-950">
                Medical Compass · DSGVO-konform & 100 % lokale Gerätespeicherung
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-950 hover:bg-emerald-200/70 transition-colors cursor-pointer"
            aria-label="Schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-emerald-100/50 border-b border-emerald-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('privacy');
              setStatusMsg(null);
            }}
            className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white/80 text-emerald-950 hover:bg-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Datenschutz (DSGVO)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('security');
              setStatusMsg(null);
            }}
            className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white/80 text-emerald-950 hover:bg-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>App-PIN & Schutz</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('data');
              setStatusMsg(null);
            }}
            className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'data'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white/80 text-emerald-950 hover:bg-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Backup & Löschung</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`mx-4 mt-3 px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-100 border-emerald-800 text-emerald-950'
                : 'bg-rose-100 border-rose-700 text-rose-900'
            }`}
          >
            <span>{statusMsg.text}</span>
            <button
              type="button"
              onClick={() => setStatusMsg(null)}
              className="text-xs underline shrink-0 cursor-pointer"
            >
              OK
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs text-slate-800">
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <div className="bg-white/95 rounded-xl border border-emerald-800 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>1. Datenschutzerklärung & Google Play Datensicherheit (Data Safety)</span>
                </div>
                <p className="leading-relaxed text-slate-700">
                  <strong>Medical Compass</strong> wurde nach dem Prinzip{' '}
                  <em>„Privacy by Design“</em> entwickelt. Sämtliche von dir eingegebenen
                  Gesundheits-, Vital-, Labor-, Medikamenten- und Profildaten werden{' '}
                  <strong>ausschließlich lokal auf deinem Smartphone bzw. Endgerät</strong>{' '}
                  gespeichert.
                </p>
                <ul className="space-y-1 text-slate-700 list-disc pl-4">
                  <li>
                    <strong>Keine Cloud-Übertragung:</strong> Es erfolgt keine automatische
                    Übermittlung deiner Gesundheitsdaten an externe Server oder Dritte.
                  </li>
                  <li>
                    <strong>Keine Werbe- oder Analyse-Tracker:</strong> Die App enthält keinerlei
                    Werbe-SDKs, Drittanbieter-Cookies oder versteckte Analysedienste.
                  </li>
                  <li>
                    <strong>Volle Datenhoheit (Art. 15, 17, 20 DSGVO):</strong> Du kannst deine
                    Daten jederzeit als PDF/CSV/JSON exportieren oder im Reiter{' '}
                    <em>„Backup & Löschung“</em> restlos von deinem Gerät entfernen.
                  </li>
                </ul>
              </div>

              <div className="bg-white/95 rounded-xl border border-emerald-800 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                  <Smartphone className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>2. Verwendete Geräteberechtigungen (Android / APK)</span>
                </div>
                <ul className="space-y-1 text-slate-700 list-disc pl-4">
                  <li>
                    <strong>Lokaler Speicher:</strong> Zum Speichern deiner Messwerte, Termine und
                    Medikamentenpläne direkt auf dem Gerät.
                  </li>
                  <li>
                    <strong>Benachrichtigungen (Optional):</strong> Ausschließlich für lokale
                    Tabletten- und Trink-Erinnerungen auf deinem Smartphone.
                  </li>
                  <li>
                    <strong>Dateiauswahl / Kamera (Optional):</strong> Nur wenn du aktiv ein
                    eigenes Profilbild oder eine lokale Sicherungsdatei auswählst.
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50/90 rounded-xl border border-amber-700/80 p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>3. Wichtiger medizinischer Hinweis (Play Store Haftungsausschluss)</span>
                </div>
                <p className="leading-relaxed text-amber-950 text-[11px]">
                  <strong>Medical Compass</strong> dient ausschließlich der persönlichen
                  Dokumentation, Selbstbeobachtung und Vorbereitung auf das Arztgespräch. Die App
                  stellt <strong>keine medizinische Beratung oder ärztliche Diagnose</strong> dar
                  und ersetzt keinesfalls den Besuch bei einem Arzt oder Apotheker. Ändere deine
                  Medikation niemals eigenmächtig ohne ärztliche Rücksprache. Bei akuten
                  gesundheitlichen Beschwerden oder Notfällen wende dich bitte sofort an den
                  ärztlichen Bereitschaftsdienst (116 117) oder den Notruf (112).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-3">
              <div className="bg-white/95 rounded-xl border border-emerald-800 p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {pinEnabled ? (
                      <Lock className="w-4 h-4 text-teal-700 shrink-0" />
                    ) : (
                      <Unlock className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        App-Sperre mit 4-stelliger Sicherheits-PIN
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        Schützt deine persönlichen Gesundheitsdaten auf dem Smartphone vor
                        unbefugten Blicken.
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                      pinEnabled
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-800'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {pinEnabled ? 'PIN-Schutz aktiv' : 'Nicht aktiviert'}
                  </span>
                </div>

                {pinEnabled && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-800/40">
                    <button
                      type="button"
                      onClick={() => {
                        onLockNow();
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>App jetzt sofort sperren</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDisablePin}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-semibold cursor-pointer"
                    >
                      PIN-Sperre deaktivieren
                    </button>
                  </div>
                )}

                {/* Warning Banner: Forgotten PIN leads to total data loss */}
                <div className="rounded-xl border border-amber-600/80 bg-amber-50/95 px-3 py-2.5 flex items-start gap-2.5 text-[11px] text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <p className="font-bold text-amber-950">
                      Wichtige Warnung: Bei vergessener PIN gehen alle Daten verloren!
                    </p>
                    <p className="mt-0.5 text-amber-900">
                      Da Medical Compass alle Daten zu 100 % lokal auf deinem Gerät speichert, kann eine vergessene PIN nicht wiederhergestellt werden. Wenn du deine PIN vergisst, verlierst du alle gespeicherten Gesundheits- und Profildaten.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleEnablePin}
                  className="pt-2 border-t border-emerald-800/40 space-y-2.5"
                >
                  <p className="text-[11px] font-bold text-emerald-950">
                    {pinEnabled ? 'Sicherheits-PIN ändern:' : 'Neue 4-stellige PIN festlegen:'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        4-stellige PIN (nur Ziffern)
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="••••"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-1.5 rounded-lg border border-emerald-800 bg-white font-mono text-sm tracking-widest text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        PIN wiederholen
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="••••"
                        value={pinConfirm}
                        onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-1.5 rounded-lg border border-emerald-800 bg-white font-mono text-sm tracking-widest text-slate-900"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{pinEnabled ? 'Neue PIN speichern' : 'PIN-Schutz aktivieren'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-3">
              {/* Full JSON Backup & Restore */}
              <div className="bg-white/95 rounded-xl border border-emerald-800 p-3.5 space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900">
                  Datenübertragbarkeit & Lokale Komplettsicherung (Art. 20 DSGVO)
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Sichere alle deine Messwerte, Medikamente, Laborwerte, Termine und Profileinstellungen
                  in einer Datei auf deinem Smartphone oder stelle sie bei einem Gerätewechsel
                  wieder her.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleBackupFileUpload}
                  className="hidden"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onExportFullBackup();
                      setStatusMsg({
                        type: 'success',
                        text: 'Vollständiges Backup (.json) wurde heruntergeladen.',
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Komplett-Backup herunterladen (.json)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Backup-Datei importieren (.json)</span>
                  </button>
                </div>
              </div>

              {/* Right to Erasure / Delete All Data (including Profile) */}
              <div className="bg-rose-50/90 rounded-xl border border-rose-700/80 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                  <Trash2 className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>Recht auf Löschung (Art. 17 DSGVO) – Alle App- & Profildaten löschen</span>
                </div>
                <p className="text-[11px] text-rose-900 leading-relaxed">
                  Hiermit werden sämtliche gespeicherten Gesundheitsdaten, Messwerte, Medikamente,
                  Termine, Protokolle sowie <strong>alle persönlichen Angaben im Profil</strong> (Name, Vorname, Geburtsdatum, Profilbild, E-Mail, Krankenkasse, Versicherungsnummer, Hausarzt und Spracheinstellung) vollständig gelöscht.
                </p>
                {!confirmDeleteStep ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteStep(true)}
                    className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Alle Gesundheits- & Profildaten löschen…</span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded-lg bg-white border border-rose-700 space-y-2">
                    <p className="text-[11px] font-bold text-rose-900">
                      Sicherheitsabfrage: Möchtest du wirklich alle lokal gespeicherten Einträge
                      und persönlichen Profildaten unwiderruflich löschen?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmDeleteAll}
                        className="px-3 py-1 rounded-md bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold cursor-pointer"
                      >
                        Ja, jetzt endgültig löschen
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteStep(false)}
                        className="px-3 py-1 rounded-md border border-slate-300 bg-slate-100 text-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 bg-emerald-100/80 border-t border-emerald-800 flex flex-wrap items-center justify-between gap-2 text-[10px] text-emerald-950">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-semibold">
              🔒 Offline-Architektur (DSGVO)
            </span>
            <span>·</span>
            <a
              href="mailto:info.Boudhan@web.de"
              className="font-semibold hover:underline"
            >
              Support: info.Boudhan@web.de
            </a>
            <span>·</span>
            <span className="font-bold">App Version V1.0 2026</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
