import {
  BloodPressureEntry,
  BloodSugarEntry,
  DoctorAppointment,
  DoctorQuestion,
  GlucoseMeasurementType,
  GlucoseUnit,
  MedicationIntakeLog,
  MedicationItem,
  PainEntry,
  SleepDiagnosticEntry,
  UserHealthProfile,
  WeightBodyEntry,
} from '../types/health';

export function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getCurrentTimeHm(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function getDaysAgoIso(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getDaysInFutureIso(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatGermanDate(isoDate: string): string {
  if (!isoDate) return '';
  const today = getTodayIso();
  const yesterday = getDaysAgoIso(1);
  const [y, m, d] = isoDate.split('-');
  if (isoDate === today) return `Heute (${d}.${m}.)`;
  if (isoDate === yesterday) return `Gestern (${d}.${m}.)`;
  return `${d}.${m}.${y}`;
}

export function formatShortGermanDate(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length < 3) return isoDate;
  return `${parts[2]}.${parts[1]}.`;
}

export function classifyBloodPressure(sys: number, dia: number): {
  label: 'Normal' | 'Hoch' | 'Niedrig';
  tone: 'emerald' | 'teal' | 'amber' | 'rose';
} {
  if (sys < 100 || dia < 60) {
    return { label: 'Niedrig', tone: 'rose' };
  }
  if (sys < 135 && dia < 85) {
    return { label: 'Normal', tone: 'emerald' };
  }
  return { label: 'Hoch', tone: 'rose' };
}

export function formatGlucose(valueMgDl: number, unit: GlucoseUnit): string {
  if (unit === 'mmol/l') {
    return (valueMgDl / 18.0182).toFixed(1);
  }
  return String(Math.round(valueMgDl));
}

export function parseGlucoseInputToMgDl(raw: number, unit: GlucoseUnit): number {
  if (unit === 'mmol/l') {
    return Math.round(raw * 18.0182);
  }
  return Math.round(raw);
}

export function getGlucoseTypeLabel(type: GlucoseMeasurementType): string {
  switch (type) {
    case 'nuechtern':
      return 'Nüchtern';
    case 'vor_essen':
      return 'Vor dem Essen';
    case 'nach_essen_1h':
      return '1 Std. nach dem Essen';
    case 'nach_essen_2h':
      return '2 Std. nach dem Essen';
    case 'vor_schlafen':
      return 'Vor dem Schlafen';
  }
}

export function evaluateGlucoseStatus(
  entry: Pick<BloodSugarEntry, 'valueMgDl' | 'measurementType'>,
  profile: UserHealthProfile
): { label: string; tone: 'emerald' | 'amber' | 'rose' } {
  const val = entry.valueMgDl;
  if (val < profile.glucoseTargetFastingMin) {
    return { label: 'Unter Zielbereich', tone: 'rose' };
  }
  const isFastingOrPre =
    entry.measurementType === 'nuechtern' || entry.measurementType === 'vor_essen';
  const maxAllowed = isFastingOrPre
    ? profile.glucoseTargetFastingMax
    : profile.glucoseTargetPostMealMax;

  if (val <= maxAllowed) {
    return { label: 'Im Zielbereich', tone: 'emerald' };
  }
  if (val <= maxAllowed + 25) {
    return { label: 'Leicht über Ziel', tone: 'amber' };
  }
  return { label: 'Über Zielbereich', tone: 'rose' };
}

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (!heightCm || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

export function classifyBmi(bmi: number): {
  label: string;
  tone: 'emerald' | 'amber' | 'rose';
} {
  if (bmi < 18.5) return { label: 'Untergewicht', tone: 'amber' };
  if (bmi < 25) return { label: 'Normalgewicht', tone: 'emerald' };
  if (bmi < 30) return { label: 'Leichtes Übergewicht', tone: 'amber' };
  return { label: 'Adipositas', tone: 'rose' };
}

export function exportHealthDataAsCsv(
  bpEntries: BloodPressureEntry[],
  sugarEntries: BloodSugarEntry[],
  weightEntries: WeightBodyEntry[],
  medLogs: MedicationIntakeLog[],
  profile: UserHealthProfile,
  extra?: {
    medications?: MedicationItem[];
    doctorQuestions?: DoctorQuestion[];
    sleepLogs?: SleepDiagnosticEntry[];
    painEntries?: PainEntry[];
  }
): void {
  const rows: string[][] = [
    [
      'Kategorie',
      'Datum',
      'Uhrzeit',
      'Tageszeit / Kontext',
      'Hauptwert 1',
      'Hauptwert 2',
      'Zusatzwert',
      'Bewertung / Status',
      'Notiz / Beschreibung',
    ],
  ];

  // 1. Letzte Blutdruck- & Pulsmessungen
  bpEntries.forEach((bp) => {
    const status = classifyBloodPressure(bp.systolic, bp.diastolic).label;
    rows.push([
      '1. Letzte Blutdruck- & Pulsmessungen',
      bp.date,
      bp.time,
      `${bp.period} (${bp.contextTag})`,
      `${bp.systolic} mmHg (Sys)`,
      `${bp.diastolic} mmHg (Dia)`,
      `${bp.pulse} bpm (Puls)`,
      status,
      bp.note || '',
    ]);
  });

  // 2. Letzte Blutzuckerwerte
  sugarEntries.forEach((bs) => {
    const status = evaluateGlucoseStatus(bs, profile).label;
    rows.push([
      `2. Letzte Blutzuckerwerte (${profile.glucoseUnit})`,
      bs.date,
      bs.time,
      `${getGlucoseTypeLabel(bs.measurementType)} (${bs.mealDistance})`,
      `${bs.valueMgDl} mg/dl`,
      `${(bs.valueMgDl / 18.0182).toFixed(1)} mmol/l`,
      `Wohlbefinden: ${bs.wellbeing}`,
      status,
      [bs.foodNote, bs.activityNote].filter(Boolean).join(' | '),
    ]);
  });

  // 3. Gewicht & BMI
  weightEntries.forEach((w) => {
    const bmi = calculateBmi(w.weightKg, profile.heightCm);
    rows.push([
      '3. Gewicht & BMI',
      w.date,
      w.time,
      'Körpermessung',
      `${w.weightKg.toFixed(1)} kg`,
      `BMI ${bmi}`,
      w.waistCm ? `Bauchumfang: ${w.waistCm} cm / KFA: ${w.bodyFatPercent ?? '-'}%` : '',
      classifyBmi(bmi).label,
      w.note || '',
    ]);
  });

  // 4. Aktueller Medikamentenplan & Einnahmen
  if (extra?.medications && extra.medications.length > 0) {
    extra.medications.forEach((m) => {
      rows.push([
        '4. Aktueller Medikamentenplan',
        getTodayIso(),
        m.times.join(', '),
        m.form,
        m.name,
        m.dosage,
        `Vorrat: ${m.stockCount} Stück`,
        'Aktiv',
        m.instructions || '',
      ]);
    });
  }

  medLogs.forEach((m) => {
    rows.push([
      '4. Medikamenteneinnahme (Protokoll)',
      m.date,
      m.actionTime,
      `Geplant: ${m.scheduledTime}`,
      m.medicationName,
      m.dosage,
      '',
      m.status.toUpperCase(),
      m.postponedTo ? `Verschoben auf ${m.postponedTo}` : '',
    ]);
  });

  // 5. Offene Fragen für das Arztgespräch
  const openQuestions = (extra?.doctorQuestions || []).filter((q) => !q.asked);
  openQuestions.forEach((q, idx) => {
    rows.push([
      '5. Offene Fragen für das Arztgespräch',
      q.createdAt,
      '',
      q.specialty,
      `Frage ${idx + 1}`,
      '',
      '',
      'Offen',
      q.question,
    ]);
  });

  // 6. Schlafdiagnostik
  (extra?.sleepLogs || []).forEach((s) => {
    rows.push([
      '6. Schlafdiagnostik',
      s.date,
      '',
      'Schlafanalyse',
      `${s.durationHours} Std.`,
      s.qualityTags.join(', '),
      '',
      s.durationHours >= 7 ? 'Erholsam' : 'Verkürzt',
      s.note || '',
    ]);
  });

  // 7. Schmerzen Protokoll
  (extra?.painEntries || []).forEach((p) => {
    rows.push([
      '7. Schmerzen Protokoll',
      p.date,
      p.time,
      p.hasPain ? 'Schmerzen: Ja' : 'Schmerzen: Nein',
      p.hasPain ? 'Ja' : 'Nein',
      p.hasPain ? `Stufe: ${p.level || 'Leicht'}` : 'Keine Schmerzen',
      '',
      p.hasPain ? (p.level || 'Ja') : 'Schmerzfrei',
      p.description || '',
    ]);
  });

  const csvContent =
    '\uFEFF' +
    rows
      .map((row) =>
        row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(';')
      )
      .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Medical_Assistent_pro_Gesundheitsbericht_${getTodayIso()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadApkBuildScript(): void {
  const scriptContent = `#!/usr/bin/env bash
# ==============================================================================
# Medical Compass – Automatisiertes Android APK Build-Skript (Capacitor)
# ==============================================================================
set -e

echo "1. Installiere Capacitor Android-Abhängigkeiten..."
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/local-notifications

echo "2. Erstelle Produktions-Build der Medical Compass Web-App..."
npm run build

echo "3. Initialisiere Android-Plattform (falls noch nicht vorhanden)..."
if [ ! -d "android" ]; then
  npx cap add android
fi

echo "4. Synchronisiere Web-Assets und Plugins nach Android..."
npx cap sync android

echo "5. Kompiliere installierbare Android APK-Datei (Debug/Preview APK)..."
if [ -d "android" ]; then
  (cd android && ./gradlew assembleDebug)
  echo "Fertig! Deine APK-Datei liegt unter: android/app/build/outputs/apk/debug/app-debug.apk"
fi
`;

  const blob = new Blob([scriptContent], { type: 'text/x-shellscript;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'build-medical-assistent-pro-apk.sh';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapePdfText(input: string): string {
  const normalized = input
    .replace(/–|—/g, '-')
    .replace(/•/g, '\xb7')
    .replace(/„|“|”/g, '"');
  let out = '';
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i);
    if (code === 40 || code === 41 || code === 92) {
      out += '\\' + normalized[i];
    } else if (code >= 32 && code <= 126) {
      out += normalized[i];
    } else if (code >= 160 && code <= 255) {
      out += '\\' + code.toString(8).padStart(3, '0');
    } else {
      out += ' ';
    }
  }
  return out;
}

export function exportHealthReportAsPdf(params: {
  profile: UserHealthProfile;
  bpEntries: BloodPressureEntry[];
  sugarEntries: BloodSugarEntry[];
  weightEntries: WeightBodyEntry[];
  medications: MedicationItem[];
  doctorQuestions: DoctorQuestion[];
  sleepLogs?: SleepDiagnosticEntry[];
  painEntries?: PainEntry[];
  selectedAppointment?: DoctorAppointment;
  patientSummaryNote?: string;
  filenamePrefix?: string;
}): void {
  const {
    profile,
    bpEntries,
    sugarEntries,
    weightEntries,
    medications,
    doctorQuestions,
    sleepLogs = [],
    painEntries = [],
    selectedAppointment,
    patientSummaryNote,
    filenamePrefix = 'Medical_Compass_Arztbericht',
  } = params;

  const lines: Array<{ text: string; bold?: boolean; size?: number; gapBefore?: number }> = [
    { text: 'Medical Compass - Ärztlicher Gesundheitsbericht', bold: true, size: 15 },
    {
      text: `Patient: ${profile.fullName} (Jahrgang ${profile.birthYear}) · Größe: ${profile.heightCm} cm · Hausarzt: ${profile.primaryDoctorName}`,
      size: 10,
      gapBefore: 4,
    },
    {
      text: `Erstellt am: ${formatGermanDate(getTodayIso())} · Wunschgewicht: ${profile.targetWeightKg.toFixed(1)} kg`,
      size: 10,
    },
  ];

  if (selectedAppointment) {
    lines.push({
      text: `Vorbereitet für Termin: ${selectedAppointment.doctorName} (${selectedAppointment.specialty}) am ${formatGermanDate(selectedAppointment.date)} um ${selectedAppointment.time} Uhr`,
      bold: true,
      size: 10,
      gapBefore: 6,
    });
  }

  if (patientSummaryNote?.trim()) {
    lines.push({
      text: 'Eigene Zusammenfassung / Befinden:',
      bold: true,
      size: 11,
      gapBefore: 8,
    });
    lines.push({
      text: patientSummaryNote.trim().slice(0, 110),
      size: 10,
    });
  }

  // 1. Letzte Blutdruck- & Pulsmessungen
  lines.push({
    text: '1. Letzte Blutdruck- & Pulsmessungen',
    bold: true,
    size: 11,
    gapBefore: 9,
  });
  if (bpEntries.length > 0) {
    bpEntries.slice(0, 7).forEach((bp) => {
      const status = classifyBloodPressure(bp.systolic, bp.diastolic).label;
      lines.push({
        text: `• ${formatGermanDate(bp.date)} (${bp.time} Uhr): ${bp.systolic}/${bp.diastolic} mmHg · Puls ${bp.pulse} bpm · ${status} (${bp.contextTag})`,
        size: 9.5,
      });
    });
  } else {
    lines.push({ text: '• Keine Einträge vorhanden.', size: 9.5 });
  }

  // 2. Letzte Blutzuckerwerte (mg/dl)
  lines.push({
    text: `2. Letzte Blutzuckerwerte (${profile.glucoseUnit})`,
    bold: true,
    size: 11,
    gapBefore: 9,
  });
  if (sugarEntries.length > 0) {
    sugarEntries.slice(0, 7).forEach((bs) => {
      const status = evaluateGlucoseStatus(bs, profile).label;
      lines.push({
        text: `• ${formatGermanDate(bs.date)} (${bs.time} Uhr): ${formatGlucose(bs.valueMgDl, profile.glucoseUnit)} ${profile.glucoseUnit} · ${getGlucoseTypeLabel(bs.measurementType)} · ${status}`,
        size: 9.5,
      });
    });
  } else {
    lines.push({ text: '• Keine Einträge vorhanden.', size: 9.5 });
  }

  // 3. Gewicht & BMI
  lines.push({
    text: '3. Gewicht & BMI',
    bold: true,
    size: 11,
    gapBefore: 9,
  });
  if (weightEntries.length > 0) {
    weightEntries.slice(0, 5).forEach((w) => {
      const bmi = calculateBmi(w.weightKg, profile.heightCm);
      lines.push({
        text: `• ${formatGermanDate(w.date)} (${w.time} Uhr): ${w.weightKg.toFixed(1)} kg · BMI ${bmi}${w.waistCm ? ` · Bauchumfang ${w.waistCm} cm` : ''}`,
        size: 9.5,
      });
    });
  } else {
    lines.push({ text: '• Keine Einträge vorhanden.', size: 9.5 });
  }

  // 4. Aktueller Medikamentenplan
  lines.push({
    text: '4. Aktueller Medikamentenplan',
    bold: true,
    size: 11,
    gapBefore: 9,
  });
  if (medications.length > 0) {
    medications.forEach((m) => {
      lines.push({
        text: `• ${m.name} ${m.dosage} (${m.form}) · Einnahme: ${m.times.join(', ')} Uhr · Vorrat: ${m.stockCount} Stück`,
        size: 9.5,
      });
    });
  } else {
    lines.push({ text: '• Keine Medikamente eingetragen.', size: 9.5 });
  }

  // 5. Offene Fragen für das Arztgespräch
  const openQs = doctorQuestions.filter((q) => !q.asked);
  lines.push({
    text: '5. Offene Fragen für das Arztgespräch',
    bold: true,
    size: 11,
    gapBefore: 9,
  });
  if (openQs.length > 0) {
    openQs.slice(0, 6).forEach((q, idx) => {
      lines.push({
        text: `${idx + 1}. ${q.question} (${q.specialty})`,
        size: 9.5,
      });
    });
  } else {
    lines.push({ text: '• Keine offenen Fragen eingetragen.', size: 9.5 });
  }

  // 6. Schlafdiagnostik
  lines.push({
    text: '6. Schlafdiagnostik',
    bold: true,
    size: 11,
    gapBefore: 9,
  });
  if (sleepLogs.length > 0) {
    sleepLogs.slice(0, 7).forEach((s) => {
      lines.push({
        text: `• ${formatGermanDate(s.date)}: Schlafdauer ${s.durationHours} Std. · ${s.qualityTags.join(', ')}${s.note ? ` · ${s.note}` : ''}`,
        size: 9.5,
      });
    });
  } else {
    lines.push({ text: '• Keine Schlafdiagnostik-Einträge vorhanden.', size: 9.5 });
  }

  // 7. Schmerzen Protokoll
  lines.push({
    text: '7. Schmerzen Protokoll',
    bold: true,
    size: 11,
    gapBefore: 9,
  });
  if (painEntries.length > 0) {
    painEntries.slice(0, 7).forEach((p) => {
      const statusText = p.hasPain
        ? `Ja (Stufe: ${p.level || 'Leicht'})`
        : 'Nein (Schmerzfrei)';
      lines.push({
        text: `• ${formatGermanDate(p.date)} (${p.time} Uhr): ${statusText} · ${p.description}`,
        size: 9.5,
      });
    });
  } else {
    lines.push({ text: '• Keine Schmerzen-Einträge vorhanden.', size: 9.5 });
  }

  // Build multi-page PDF content streams so all 7 sections are guaranteed to be included
  const pageStreams: string[] = [];
  let currentOps: string[] = [
    '0.04 0.46 0.43 rg',
    '45 815 505 2 re f',
    '0 0 0 rg',
  ];
  let y = 805;

  for (const item of lines) {
    const fontSize = item.size ?? 10;
    const needed = (item.gapBefore ?? 0) + fontSize + 3.5;
    if (y - needed < 42) {
      pageStreams.push(currentOps.join('\n'));
      currentOps = [
        '0.04 0.46 0.43 rg',
        '45 815 505 2 re f',
        '0 0 0 rg',
      ];
      y = 800;
    }
    y -= needed;
    const fontKey = item.bold ? '/F2' : '/F1';
    currentOps.push(
      `BT ${fontKey} ${fontSize} Tf 45 ${y.toFixed(1)} Td (${escapePdfText(item.text)}) Tj ET`
    );
  }
  if (currentOps.length > 0) {
    pageStreams.push(currentOps.join('\n'));
  }

  // Object 1: Catalog, Object 2: Pages, Object 3: Font F1, Object 4: Font F2
  // Page i uses Object (5 + i*2) for Page and Object (6 + i*2) for Contents
  const pageObjNums = pageStreams.map((_, idx) => 5 + idx * 2);
  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    `2 0 obj\n<< /Type /Pages /Kids [${pageObjNums.map((n) => `${n} 0 R`).join(' ')}] /Count ${pageStreams.length} >>\nendobj\n`,
    '3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n',
  ];

  pageStreams.forEach((streamContent, idx) => {
    const pageObjNum = 5 + idx * 2;
    const contentObjNum = 6 + idx * 2;
    objects.push(
      `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjNum} 0 R >>\nendobj\n`
    );
    objects.push(
      `${contentObjNum} 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`
    );
  });

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filenamePrefix}_${getTodayIso()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


