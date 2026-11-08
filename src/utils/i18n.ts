import { useEffect } from 'react';
import { AppLanguage } from '../types/health';

export interface UILabels {
  appSubtitle: string;
  navOverview: string;
  navDashboard: string;
  navVitals: string;
  navMeds: string;
  navMedications: string;
  navMedicationsMobile: string;
  navPrevention: string;
  navDoctors: string;
  navCalendar: string;
  navReport: string;
  quickEntry: string;
  profileBtn: string;
  settingsProfileTitle: string;
  profileTitle: string;
  profileSubtitle: string;
  profilePictureLabel: string;
  uploadPhotoBtn: string;
  removePhotoBtn: string;
  nameLabel: string;
  firstNameLabel: string;
  birthDateLabel: string;
  ageLabel: string;
  ageUnit: string;
  emailLabel: string;
  healthInsuranceLabel: string;
  insuranceNumberLabel: string;
  familyDoctorLabel: string;
  languageSectionTitle: string;
  languageSectionHint: string;
  langDe: string;
  langEn: string;
  langEs: string;
  langFr: string;
  langAr: string;
  cancelBtn: string;
  saveBtn: string;
  footerPrivacy: string;
  footerTagline: string;
}

export const UI_LABELS: Record<AppLanguage, UILabels> = {
  de: {
    appSubtitle: 'Gesundheits-Begleiter 50+',
    navOverview: 'Übersicht',
    navDashboard: 'Übersicht',
    navVitals: 'Vitalwerte',
    navMeds: 'Medikamente',
    navMedications: 'Medikamente',
    navMedicationsMobile: 'Medikamente',
    navPrevention: 'Vorsorge & Ärzte',
    navDoctors: 'Vorsorge & Ärzte',
    navCalendar: 'Kalender',
    navReport: 'Arztbericht',
    quickEntry: 'Schnell-Eintrag',
    profileBtn: 'Profil',
    settingsProfileTitle: 'PROFIL INFO',
    profileTitle: 'PROFIL INFO',
    profileSubtitle: 'Persönliche Gesundheits- & Versicherungsdaten verwalten',
    profilePictureLabel: 'Profil Bild',
    uploadPhotoBtn: 'Bild wählen',
    removePhotoBtn: 'Entfernen',
    nameLabel: 'Name',
    firstNameLabel: 'Vorname',
    birthDateLabel: 'Geburtsdatum',
    ageLabel: 'Alt',
    ageUnit: 'Jahre',
    emailLabel: 'Email',
    healthInsuranceLabel: 'Krankenkasse',
    insuranceNumberLabel: 'Versicherungsnummer',
    familyDoctorLabel: 'Haus Arzt',
    languageSectionTitle: 'Sprache',
    languageSectionHint: 'Die gesamte App wird sofort in die gewählte Sprache übersetzt.',
    langDe: 'Deutsch',
    langEn: 'Englisch',
    langEs: 'Spanisch',
    langFr: 'Französisch',
    langAr: 'Arabisch',
    cancelBtn: 'Abbrechen',
    saveBtn: 'Profil speichern',
    footerPrivacy: 'Datenschutz: Alle Gesundheitsdaten bleiben 100 % lokal auf Ihrem Gerät gespeichert.',
    footerTagline: 'Prävention · Vitalwerte · Medikamenten-Sicherheit · Arztbericht',
  },
  en: {
    appSubtitle: 'Health Companion 50+',
    navOverview: 'Overview',
    navDashboard: 'Overview',
    navVitals: 'Body Values & Readings',
    navMeds: 'Medications',
    navMedications: 'Medications',
    navMedicationsMobile: 'Meds',
    navPrevention: 'Checkups & Doctors',
    navDoctors: 'Checkups & Doctors',
    navCalendar: 'Calendar',
    navReport: 'Medical Report',
    quickEntry: 'Quick Entry',
    profileBtn: 'Profile',
    settingsProfileTitle: 'PROFILE INFO',
    profileTitle: 'PROFILE INFO',
    profileSubtitle: 'Manage personal health & insurance information',
    profilePictureLabel: 'Profile Picture',
    uploadPhotoBtn: 'Choose photo',
    removePhotoBtn: 'Remove',
    nameLabel: 'Last Name',
    firstNameLabel: 'First Name',
    birthDateLabel: 'Date of Birth',
    ageLabel: 'Age',
    ageUnit: 'years',
    emailLabel: 'Email',
    healthInsuranceLabel: 'Health Insurance',
    insuranceNumberLabel: 'Insurance Number',
    familyDoctorLabel: 'Family Doctor',
    languageSectionTitle: 'Language',
    languageSectionHint: 'The entire app is immediately translated into the selected language.',
    langDe: 'German',
    langEn: 'English',
    langEs: 'Spanish',
    langFr: 'French',
    langAr: 'Arabic',
    cancelBtn: 'Cancel',
    saveBtn: 'Save Profile',
    footerPrivacy: 'Privacy: All health data remains stored 100% locally on your device.',
    footerTagline: 'Prevention · Vital Signs · Medication Safety · Medical Report',
  },
  es: {
    appSubtitle: 'Compañero de Salud 50+',
    navOverview: 'Resumen',
    navDashboard: 'Resumen',
    navVitals: 'Valores y Mediciones',
    navMeds: 'Medicamentos',
    navMedications: 'Medicamentos',
    navMedicationsMobile: 'Meds',
    navPrevention: 'Chequeos y Médicos',
    navDoctors: 'Chequeos y Médicos',
    navCalendar: 'Calendario',
    navReport: 'Informe Médico',
    quickEntry: 'Entrada Rápida',
    profileBtn: 'Perfil',
    settingsProfileTitle: 'INFO DE PERFIL',
    profileTitle: 'INFO DE PERFIL',
    profileSubtitle: 'Gestionar datos personales de salud y seguro',
    profilePictureLabel: 'Foto de Perfil',
    uploadPhotoBtn: 'Elegir foto',
    removePhotoBtn: 'Eliminar',
    nameLabel: 'Apellidos',
    firstNameLabel: 'Nombre',
    birthDateLabel: 'Fecha de nacimiento',
    ageLabel: 'Edad',
    ageUnit: 'años',
    emailLabel: 'Correo electrónico',
    healthInsuranceLabel: 'Seguro médico',
    insuranceNumberLabel: 'Número de seguro',
    familyDoctorLabel: 'Médico de cabecera',
    languageSectionTitle: 'Idioma',
    languageSectionHint: 'Toda la aplicación se traduce inmediatamente al idioma seleccionado.',
    langDe: 'Alemán',
    langEn: 'Inglés',
    langEs: 'Español',
    langFr: 'Francés',
    langAr: 'Árabe',
    cancelBtn: 'Cancelar',
    saveBtn: 'Guardar perfil',
    footerPrivacy: 'Privacidad: Todos los datos de salud se guardan 100 % localmente en su dispositivo.',
    footerTagline: 'Prevención · Signos Vitales · Seguridad de Medicamentos · Informe Médico',
  },
  fr: {
    appSubtitle: 'Compagnon Santé 50+',
    navOverview: 'Aperçu',
    navDashboard: 'Aperçu',
    navVitals: 'Valeurs & Mesures',
    navMeds: 'Médicaments',
    navMedications: 'Médicaments',
    navMedicationsMobile: 'Médic.',
    navPrevention: 'Bilans & Médecins',
    navDoctors: 'Bilans & Médecins',
    navCalendar: 'Calendrier',
    navReport: 'Rapport Médical',
    quickEntry: 'Saisie Rapide',
    profileBtn: 'Profil',
    settingsProfileTitle: 'INFOS PROFIL',
    profileTitle: 'INFOS PROFIL',
    profileSubtitle: 'Gérer les données personnelles de santé et d’assurance',
    profilePictureLabel: 'Photo de Profil',
    uploadPhotoBtn: 'Choisir photo',
    removePhotoBtn: 'Supprimer',
    nameLabel: 'Nom',
    firstNameLabel: 'Prénom',
    birthDateLabel: 'Date de naissance',
    ageLabel: 'Âge',
    ageUnit: 'ans',
    emailLabel: 'E-mail',
    healthInsuranceLabel: 'Assurance maladie',
    insuranceNumberLabel: 'Numéro d’assuré',
    familyDoctorLabel: 'Médecin traitant',
    languageSectionTitle: 'Langue',
    languageSectionHint: 'Toute l’application est immédiatement traduite dans la langue choisie.',
    langDe: 'Allemand',
    langEn: 'Anglais',
    langEs: 'Espagnol',
    langFr: 'Français',
    langAr: 'Arabe',
    cancelBtn: 'Annuler',
    saveBtn: 'Enregistrer le profil',
    footerPrivacy: 'Confidentialité : Toutes les données de santé restent stockées 100 % localement sur votre appareil.',
    footerTagline: 'Prévention · Signes Vitaux · Sécurité des Médicaments · Rapport Médical',
  },
  ar: {
    appSubtitle: 'رفيق الصحة +50',
    navOverview: 'نظرة عامة',
    navDashboard: 'نظرة عامة',
    navVitals: 'المؤشرات الحيوية',
    navMeds: 'الأدوية',
    navMedications: 'الأدوية',
    navMedicationsMobile: 'الأدوية',
    navPrevention: 'الوقاية والأطباء',
    navDoctors: 'الوقاية والأطباء',
    navCalendar: 'التقويم',
    navReport: 'التقرير الطبي',
    quickEntry: 'إدخال سريع',
    profileBtn: 'الملف الشخصي',
    settingsProfileTitle: 'معلومات الملف الشخصي',
    profileTitle: 'معلومات الملف الشخصي',
    profileSubtitle: 'إدارة البيانات الصحية وبيانات التأمين الشخصية',
    profilePictureLabel: 'صورة الملف الشخصي',
    uploadPhotoBtn: 'اختيار صورة',
    removePhotoBtn: 'إزالة',
    nameLabel: 'اللقب (الاسم العائلي)',
    firstNameLabel: 'الاسم الأول',
    birthDateLabel: 'تاريخ الميلاد',
    ageLabel: 'العمر',
    ageUnit: 'سنة',
    emailLabel: 'البريد الإلكتروني',
    healthInsuranceLabel: 'شركة التأمين الصحي',
    insuranceNumberLabel: 'رقم التأمين',
    familyDoctorLabel: 'طبيب العائلة',
    languageSectionTitle: 'اللغة',
    languageSectionHint: 'تتم ترجمة التطبيق بالكامل فوراً إلى اللغة المختارة.',
    langDe: 'الألمانية',
    langEn: 'الإنجليزية',
    langEs: 'الإسبانية',
    langFr: 'الفرنسية',
    langAr: 'العربية',
    cancelBtn: 'إلغاء',
    saveBtn: 'حفظ الملف الشخصي',
    footerPrivacy: 'الخصوصية: تظل جميع البيانات الصحية محفوظة محلياً بنسبة 100% على جهازك.',
    footerTagline: 'الوقاية · المؤشرات الحيوية · سلامة الأدوية · التقرير الطبي',
  },
};

type TranslatedPhrase = {
  en: string;
  ar: string;
  es?: string;
  fr?: string;
};

// Comprehensive phrase dictionary covering every view, card, modal, table, and button
const PHRASE_MAP: Record<string, TranslatedPhrase> = {
  // App Shell & Footer
  '🔒 100 % lokale Datenspeicherung (DSGVO-konform)': {
    en: '🔒 100% local data storage (GDPR-compliant)',
    ar: '🔒 تخزين محلي للبيانات بنسبة 100% (متوافق مع حماية البيانات)',
  },
  'Kein Ersatz für ärztliche Diagnose (Notruf: 112)': {
    en: 'Not a substitute for medical diagnosis (Emergency: 112)',
    ar: 'ليس بديلاً عن التشخيص الطبي (الطوارئ: 112)',
  },
  'Datenschutzerklärung, PIN-Schutz & Datenlöschung': {
    en: 'Privacy Policy, PIN Protection & Data Deletion',
    ar: 'سياسة الخصوصية وحماية PIN وحذف البيانات',
  },
  'Datenschutz & Sicherheit bei Medical Compass (DSGVO)': {
    en: 'Privacy & Security in Medical Compass (GDPR)',
    ar: 'الخصوصية والأمان في Medical Compass',
  },
  'Deine Gesundheitsdaten bleiben zu 100 % lokal auf deinem Gerät gespeichert. Es gibt keine Cloud-Weitergabe und keine Werbe-Tracker. Die App dient der persönlichen Dokumentation und ersetzt keinen Arztbesuch.': {
    en: 'Your health data remains stored 100% locally on your device. There is no cloud sharing and no ad trackers. This app is for personal documentation and does not replace a doctor visit.',
    ar: 'تظل بياناتك الصحية محفوظة محلياً بنسبة 100% على جهازك. لا توجد مشاركة سحابية ولا أدوات تتبع إعلانية. التطبيق مخصص للتوثيق الشخصي ولا يغني عن زيارة الطبيب.',
  },
  'Details & PIN': { en: 'Details & PIN', ar: 'التفاصيل ورمز PIN' },
  'Verstanden & Zustimmen': { en: 'Accept & Continue', ar: 'موافق ومتابعة' },
  'Support: info.Boudhan@web.de': {
    en: 'Support: info.Boudhan@web.de',
    ar: 'الدعم الفني: info.Boudhan@web.de',
  },
  'App Version V1.0 2026': {
    en: 'App Version V1.0 2026',
    ar: 'إصدار التطبيق V1.0 2026',
  },
  'Wichtige Warnung: Bei vergessener PIN gehen alle Daten verloren!': {
    en: 'Important Warning: If you forget your PIN, all data will be lost!',
    ar: 'تحذير هام: في حال نسيان رمز PIN ستفقد جميع البيانات!',
  },
  'Da Medical Compass alle Daten zu 100 % lokal auf deinem Gerät speichert, kann eine vergessene PIN nicht wiederhergestellt werden. Wenn du deine PIN vergisst, verlierst du alle gespeicherten Gesundheits- und Profildaten.': {
    en: 'Since Medical Compass stores all data 100% locally on your device, a forgotten PIN cannot be recovered. If you forget your PIN, you will lose all saved health and profile data.',
    ar: 'نظراً لأن التطبيق يحفظ جميع البيانات محلياً بنسبة 100% على جهازك، لا يمكن استعادة رمز PIN المنسي. إذا نسيت رمز PIN الخاص بك، فستفقد جميع البيانات الصحية وبيانات الملف الشخصي المحفوظة.',
  },
  '⚠️ Warnung: PIN vergessen = Verlust aller Daten': {
    en: '⚠️ Warning: Forgotten PIN = Loss of all data',
    ar: '⚠️ تحذير: نسيان رمز PIN = فقدان جميع البيانات',
  },
  'Wenn du deine PIN vergisst, gehen alle gespeicherten Gesundheits- und Profildaten unwiderruflich verloren.': {
    en: 'If you forget your PIN, all saved health and profile data will be permanently lost.',
    ar: 'إذا نسيت رمز PIN الخاص بك، فستفقد جميع البيانات الصحية وبيانات الملف الشخصي نهائياً.',
  },
  'PIN vergessen? Alle Daten löschen & App zurücksetzen…': {
    en: 'Forgot PIN? Delete all data & reset app…',
    ar: 'نسيت رمز PIN؟ حذف جميع البيانات وإعادة ضبط التطبيق…',
  },
  'Wirklich alle Daten (inkl. Profil) unwiderruflich löschen, um die PIN-Sperre aufzuheben?': {
    en: 'Permanently delete all data (including profile) to remove the PIN lock?',
    ar: 'هل تريد حقاً حذف جميع البيانات (بما في ذلك الملف الشخصي) نهائياً لإلغاء قفل PIN؟',
  },
  'Ja, alle Daten löschen': {
    en: 'Yes, delete all data',
    ar: 'نعم، حذف جميع البيانات',
  },
  'Medical Compass ist gesperrt': {
    en: 'Medical Compass is locked',
    ar: 'تطبيق Medical Compass مقفل',
  },
  'Bitte gib deine 4-stellige Sicherheits-PIN ein, um auf deine Gesundheitsdaten zuzugreifen.': {
    en: 'Please enter your 4-digit security PIN to access your health data.',
    ar: 'يرجى إدخال رمز الحماية المكون من 4 أرقام للوصول إلى بياناتك الصحية.',
  },
  'Falsche PIN. Bitte erneut versuchen.': {
    en: 'Incorrect PIN. Please try again.',
    ar: 'رمز PIN غير صحيح. يرجى المحاولة مرة أخرى.',
  },
  'Entsperren': { en: 'Unlock', ar: 'إلغاء القفل' },
  '🔒 100 % lokale Gerätesicherheit · DSGVO-geschützt': {
    en: '🔒 100% local device security · GDPR-protected',
    ar: '🔒 أمان محلي 100% على الجهاز · محمي وفق معايير الخصوصية',
  },
  'Übersicht': { en: 'Overview', ar: 'نظرة عامة' },
  'Vitalwerte': { en: 'Body Values & Readings', ar: 'المؤشرات الحيوية' },
  'Medikamente': { en: 'Medications', ar: 'الأدوية' },
  'Vorsorge & Ärzte': { en: 'Checkups & Doctors', ar: 'الوقاية والأطباء' },
  'Vorsorge': { en: 'Checkups', ar: 'الوقاية' },
  'Kalender': { en: 'Calendar', ar: 'التقويم' },
  'Arztbericht': { en: 'Medical Report', ar: 'التقرير الطبي' },
  'Bericht': { en: 'Report', ar: 'التقرير' },
  'Schnell-Eintrag': { en: 'Quick Entry', ar: 'إدخال سريع' },
  'Eintrag': { en: 'Entry', ar: 'إدخال' },
  'Profil': { en: 'Profile', ar: 'الملف الشخصي' },
  'Gesundheits-Begleiter 50+': { en: 'Health Companion 50+', ar: 'رفيق الصحة +50' },
  'App installieren': { en: 'Install App', ar: 'تثبيت التطبيق' },
  'Als Smartphone-App installieren': {
    en: 'Install as smartphone app',
    ar: 'تثبيت كتطبيق للهاتف الذكي',
  },
  'Installieren': { en: 'Install', ar: 'تثبيت' },
  'App sperren (PIN)': { en: 'Lock App (PIN)', ar: 'قفل التطبيق (PIN)' },
  'Datenschutz & Sicherheit': { en: 'Privacy & Security', ar: 'الخصوصية والأمان' },
  'Datenschutz & PIN': { en: 'Privacy & PIN', ar: 'الخصوصية ورمز PIN' },
  'Öffnen': { en: 'Open', ar: 'فتح' },
  'Installations-Hilfe für Android & iPhone': {
    en: 'Installation guide for Android & iPhone',
    ar: 'دليل التثبيت لأندرويد وآيفون',
  },
  'Als Android-App auf dem Startbildschirm installieren': {
    en: 'Install as Android app on your home screen',
    ar: 'تثبيت كتطبيق أندرويد على الشاشة الرئيسية',
  },
  'Offline nutzbar, Vollbildmodus ohne Browser-Leiste und 100 % lokale Speicherung auf Ihrem Smartphone.': {
    en: 'Usable offline, full-screen mode without browser bar, and 100% local storage on your smartphone.',
    ar: 'يعمل بدون إنترنت، وضع ملء الشاشة بدون شريط المتصفح وتخزين محلي 100% على هاتفك.',
  },
  'Jetzt installieren': { en: 'Install now', ar: 'تثبيت الآن' },
  'Anleitung': { en: 'Instructions', ar: 'التعليمات' },

  // Greetings & Dashboard View
  'Guten Morgen': { en: 'Good morning', ar: 'صباح الخير' },
  'Guten Tag': { en: 'Good afternoon', ar: 'طاب يومك' },
  'Guten Abend': { en: 'Good evening', ar: 'مساء الخير' },
  'Dein persönlicher Gesundheitsüberblick': {
    en: 'Your personal health overview',
    ar: 'نظرة عامة على صحتك الشخصية',
  },
  'Tagesübersicht & Gesundheitscoach': {
    en: 'Daily Overview & Health Coach',
    ar: 'نظرة عامة يومية ومدرب الصحة',
  },
  'Wert eintragen': { en: 'Add reading', ar: 'إضافة قراءة' },
  'Arztbericht / PDF': { en: 'Medical Report / PDF', ar: 'التقرير الطبي / PDF' },
  'Blutdruck & Puls': { en: 'Blood Pressure & Pulse', ar: 'ضغط الدم والنبض' },
  'Blutdruck': { en: 'Blood Pressure', ar: 'ضغط الدم' },
  'Blutzucker': { en: 'Blood Sugar', ar: 'سكر الدم' },
  'Gewicht': { en: 'Weight', ar: 'الوزن' },
  'Gewicht & BMI': { en: 'Weight & BMI', ar: 'الوزن ومؤشر كتلة الجسم' },
  'Gewicht & Körperwerte': { en: 'Weight & Body Values', ar: 'الوزن وقياسات الجسم' },
  'Körperwerte': { en: 'Body values', ar: 'قياسات الجسم' },
  'Verlauf': { en: 'Trend', ar: 'المسار' },
  'Zielbereich': { en: 'Target range', ar: 'النطاق المستهدف' },
  'Messen': { en: 'Measure', ar: 'قياس' },
  'Eintragen': { en: 'Log', ar: 'تسجيل' },
  'Wiegen': { en: 'Weigh', ar: 'وزن' },
  '+ Medikament hinzufügen': { en: '+ Add medication', ar: '+ إضافة دواء' },
  'Medikament hinzufügen': { en: 'Add Medication', ar: 'إضافة دواء' },
  'Trinken & Bewegung': { en: 'Hydration & Exercise', ar: 'شرب الماء والحركة' },
  'Trinkziel & Bewegung': { en: 'Hydration & Exercise', ar: 'شرب الماء والحركة' },
  'Trinken/Sport': { en: 'Hydration/Sport', ar: 'الماء/الرياضة' },
  'Noch keine Messung': { en: 'No reading yet', ar: 'لا يوجد قياس بعد' },
  'Noch keine Messungen': { en: 'No readings yet', ar: 'لا توجد قياسات بعد' },
  'Noch keine Messwerte eingetragen.': {
    en: 'No readings logged yet.',
    ar: 'لم يتم إدخال قراءات بعد.',
  },
  'Noch keine Laborwerte eingetragen.': {
    en: 'No lab results logged yet.',
    ar: 'لم يتم إدخال نتائج مختبر بعد.',
  },
  'Noch keine Notiz': { en: 'No note yet', ar: 'لا توجد ملاحظة بعد' },
  'Optimal': { en: 'Optimal', ar: 'مثالي' },
  'Normal': { en: 'Normal', ar: 'طبيعي' },
  'Hoch': { en: 'High', ar: 'مرتفع' },
  'Hochnormal': { en: 'High-normal', ar: 'طبيعي مرتفع' },
  'Erhöht': { en: 'Elevated', ar: 'مرتفع' },
  'Niedrig': { en: 'Low', ar: 'منخفض' },
  'Auffällig': { en: 'Abnormal', ar: 'غير طبيعي' },
  'Im Zielbereich': { en: 'In target range', ar: 'ضمن النطاق المستهدف' },
  'Unter Zielbereich': { en: 'Below target range', ar: 'أقل من النطاق المستهدف' },
  'Leicht über Ziel': { en: 'Slightly above target', ar: 'أعلى قليلاً من المستهدف' },
  'Über Zielbereich': { en: 'Above target range', ar: 'أعلى من النطاق المستهدف' },
  'Leicht erhöht': { en: 'Slightly elevated', ar: 'مرتفع قليلاً' },
  'Untergewicht': { en: 'Underweight', ar: 'نقص الوزن' },
  'Normalgewicht': { en: 'Normal weight', ar: 'وزن طبيعي' },
  'Leichtes Übergewicht': { en: 'Slightly overweight', ar: 'زيادة طفيفة في الوزن' },
  'Adipositas': { en: 'Obesity', ar: 'سمنة' },
  '+250 ml Wasser': { en: '+250 ml Water', ar: '+250 مل ماء' },
  '+15 Min Bewegung': { en: '+15 min Exercise', ar: '+15 دقيقة حركة' },
  'Heutige Medikamente erinnerung': {
    en: "Today's Medication Reminders",
    ar: 'تذكيرات أدوية اليوم',
  },
  'Heutige Medikamente': {
    en: "Today's Medications",
    ar: 'أدوية اليوم',
  },
  'Vorratsberechnung aktiv': {
    en: 'Stock tracking active',
    ar: 'حساب المخزون نشط',
  },
  'Vorrat niedrig:': {
    en: 'Low stock:',
    ar: 'المخزون منخفض:',
  },
  'Vorrat': {
    en: 'Stock',
    ar: 'المخزون',
  },
  'Vorrat reicht für alle Medikamente > 7 Tage': {
    en: 'Stock sufficient for all medications (> 7 days)',
    ar: 'المخزون يكفي لجميع الأدوية لأكثر من 7 أيام',
  },
  'Alle Medikamente anzeigen': {
    en: 'View all medications',
    ar: 'عرض جميع الأدوية',
  },
  'Medikamentenplan verwalten': {
    en: 'Manage medication plan',
    ar: 'إدارة خطة الأدوية',
  },
  'Eingenommen': { en: 'Taken', ar: 'تم التناول' },
  'Verschoben': { en: 'Postponed', ar: 'مؤجل' },
  'Übersprungen': { en: 'Skipped', ar: 'تم التخطي' },
  'Später': { en: 'Later', ar: 'لاحقاً' },
  'Auslassen': { en: 'Skip', ar: 'تخطي' },
  'Jetzt einnehmen': { en: 'Take now', ar: 'تناول الآن' },
  'Letzte gespeicherte Messungen': {
    en: 'Recently Saved Readings',
    ar: 'آخر القراءات المحفوظة',
  },
  'Chronologisches Kurzprotokoll (Blutdruck & Blutzucker)': {
    en: 'Chronological quick log (Blood Pressure & Blood Sugar)',
    ar: 'سجل زمني مختصر (ضغط الدم وسكر الدم)',
  },
  'Vollständige Tabellen': {
    en: 'Full tables',
    ar: 'الجداول الكاملة',
  },
  'Blutdruckverlauf (Letzte Messungen)': {
    en: 'Blood Pressure Trend (Recent Readings)',
    ar: 'مسار ضغط الدم (آخر القراءات)',
  },
  'Zielbereich 50+: unter 135/85 mmHg bei Heimmessung': {
    en: 'Target 50+: below 135/85 mmHg for home measurement',
    ar: 'النطاق المستهدف +50: أقل من 135/85 ملم زئبق للقياس المنزلي',
  },
  'Details & Tabelle': { en: 'Details & Table', ar: 'التفاصيل والجدول' },
  'Systolisch': { en: 'Systolic', ar: 'الانقباضي' },
  'Diastolisch': { en: 'Diastolic', ar: 'الانبساطي' },
  'Sauerstoffsättigung (SpO₂)': {
    en: 'Oxygen Saturation (SpO₂)',
    ar: 'تشبع الأكسجين (SpO₂)',
  },
  'Sauerstoffsättigung': {
    en: 'Oxygen Saturation',
    ar: 'تشبع الأكسجين',
  },
  'Laborwerte': {
    en: 'Lab Results',
    ar: 'نتائج المختبر',
  },
  'Atemwegs- & Lungenkontrolle': {
    en: 'Respiratory & Lung Monitoring',
    ar: 'مراقبة الجهاز التنفسي والرئتين',
  },
  'Schlafdiagnostik': {
    en: 'Sleep Diagnostics',
    ar: 'تشخيص النوم',
  },
  'Letzte Nacht & Erholungsstatus': {
    en: 'Last Night & Recovery Status',
    ar: 'الليلة الماضية وحالة الاستشفاء',
  },
  'Schnarchen: Ja': { en: 'Snoring: Yes', ar: 'الشخير: نعم' },
  'Schnarchen: Nein': { en: 'Snoring: No', ar: 'الشخير: لا' },
  'Atemaussetzer: Ja': { en: 'Sleep Apnea: Yes', ar: 'انقطاع التنفس: نعم' },
  'Keine Atemaussetzer': { en: 'No Sleep Apnea', ar: 'لا يوجد انقطاع تنفس' },
  'Noch kein Schlafprotokoll vorhanden.': {
    en: 'No sleep log recorded yet.',
    ar: 'لا يوجد سجل نوم حتى الآن.',
  },
  'Anstehende Vorsorge & Termine': {
    en: 'Upcoming Checkups & Appointments',
    ar: 'الفحوصات والمواعيد القادمة',
  },
  'Alle anzeigen': { en: 'Show all', ar: 'عرض الكل' },
  'Überfällig / Empfohlen': {
    en: 'Overdue / Recommended',
    ar: 'متأخر / موصى به',
  },
  'Fragen für den nächsten Arztbesuch': {
    en: 'Questions for Next Doctor Visit',
    ar: 'أسئلة لزيارة الطبيب القادمة',
  },
  'Offene Fragen für Ihren Arzttermin:': {
    en: 'Open questions for your doctor appointment:',
    ar: 'أسئلة مفتوحة لموعد الطبيب:',
  },
  'Alle Fragen wurden bereits geklärt.': {
    en: 'All questions have already been answered.',
    ar: 'تمت الإجابة على جميع الأسئلة بالفعل.',
  },
  'Fragen verwalten & Arztbericht drucken': {
    en: 'Manage questions & print medical report',
    ar: 'إدارة الأسئلة وطباعة التقرير الطبي',
  },

  // Pain Tracker Card ("Schmerzen")
  'Schmerzen': { en: 'Pain Tracker', ar: 'الآلام' },
  'Schmerzstatus': { en: 'Pain status', ar: 'حالة الألم' },
  'Schmerz': { en: 'Pain', ar: 'ألم' },
  'Tägliche Schmerzdokumentation & Verlauf': {
    en: 'Daily pain documentation & trend',
    ar: 'توثيق الآلام اليومي والمسار',
  },
  'Ja': { en: 'Yes', ar: 'نعم' },
  'Nein': { en: 'No', ar: 'لا' },
  'Ja:': { en: 'Yes:', ar: 'نعم:' },
  'Nein:': { en: 'No:', ar: 'لا:' },
  'Ja ☑️': { en: 'Yes ☑️', ar: 'نعم ☑️' },
  'Nein ☑️': { en: 'No ☑️', ar: 'لا ☑️' },
  'Schmerzen Beschreibung': {
    en: 'Pain Description',
    ar: 'وصف الألم',
  },
  'Schmerzen Beschreibung (z. B. Rücken, Kopf, Gelenke)...': {
    en: 'Pain description (e.g. back, head, joints)...',
    ar: 'وصف الألم (مثل الظهر، الرأس، المفاصل)...',
  },
  'Schmerzen Beschreibung...': {
    en: 'Pain description...',
    ar: 'وصف الألم...',
  },
  'Schmerzen Stufe:': {
    en: 'Pain Intensity:',
    ar: 'درجة الألم:',
  },
  'Synchronisiert mit Bericht': {
    en: 'Synced with report',
    ar: 'متزامن مع التقرير',
  },
  'Stark': { en: 'Severe', ar: 'شديد' },
  'Leicht': { en: 'Mild', ar: 'خفيف' },
  'Kurz': { en: 'Brief', ar: 'قصير' },
  'Datum': { en: 'Date', ar: 'التاريخ' },
  'Uhrzeit': { en: 'Time', ar: 'الوقت' },
  'Tageszeit': { en: 'Time of day', ar: 'وقت اليوم' },
  'Schmerz-Eintrag speichern': {
    en: 'Save pain entry',
    ar: 'حفظ سجل الألم',
  },
  'Kein Schmerz': { en: 'No pain', ar: 'بدون ألم' },
  'Keine Schmerzen': { en: 'No pain', ar: 'بدون ألم' },
  'Eintrag löschen': { en: 'Delete entry', ar: 'حذف السجل' },
  'Eintrag bearbeiten': { en: 'Edit entry', ar: 'تعديل السجل' },
  'Eintrag ändern': { en: 'Edit entry', ar: 'تعديل السجل' },
  'Eintrag ändern / bearbeiten': { en: 'Edit entry', ar: 'تعديل السجل' },
  'Eintrag entfernen': { en: 'Remove entry', ar: 'إزالة السجل' },
  'Zeile löschen': { en: 'Delete row', ar: 'حذف السطر' },
  'Keine Schmerzen dokumentiert': {
    en: 'No pain documented',
    ar: 'لم يتم توثيق أي ألم',
  },
  'Beschreibung': { en: 'Description', ar: 'الوصف' },
  'Stufe': { en: 'Level', ar: 'الدرجة' },

  // Vitals View Sub-navigation & 1. Blood Pressure
  'Körperwerte & Messungen': {
    en: 'Body Values & Readings',
    ar: 'المؤشرات الحيوية والقياسات',
  },
  '1. Blutdruck & Puls': {
    en: '1. Blood Pressure & Pulse',
    ar: '1. ضغط الدم والنبض',
  },
  '2. Blutzucker': {
    en: '2. Blood Sugar',
    ar: '2. سكر الدم',
  },
  '3. Gewicht & BMI': {
    en: '3. Weight & BMI',
    ar: '3. الوزن ومؤشر كتلة الجسم',
  },
  '4. Trinken & Sport': {
    en: '4. Hydration & Sport',
    ar: '4. شرب الماء والرياضة',
  },
  '5. Sauerstoffsättigung': {
    en: '5. Oxygen Saturation',
    ar: '5. تشبع الأكسجين',
  },
  '6. Laborwerte': {
    en: '6. Lab Results',
    ar: '6. نتائج المختبر',
  },
  'Wasser & Sport': { en: 'Water & Exercise', ar: 'الماء والرياضة' },
  'Sauerstoff': { en: 'Oxygen', ar: 'الأكسجين' },
  'Blutwerte': { en: 'Lab Results', ar: 'تحاليل الدم' },
  'Schlaf': { en: 'Sleep', ar: 'النوم' },
  'Woche': { en: 'Week', ar: 'أسبوع' },
  'Monat': { en: 'Month', ar: 'شهر' },
  'Jahr': { en: 'Year', ar: 'سنة' },
  'Tag': { en: 'Day', ar: 'يوم' },
  'Tag / 48h': { en: 'Day / 48h', ar: 'يوم / 48 ساعة' },
  'Alle Zeiten': { en: 'All times', ar: 'جميع الأوقات' },
  'Alle Tageszeiten': { en: 'All times of day', ar: 'جميع أوقات اليوم' },
  'Morgens': { en: 'Morning', ar: 'صباحاً' },
  'Mittags': { en: 'Noon', ar: 'ظهراً' },
  'Abends': { en: 'Evening', ar: 'مساءً' },
  'Morgens (Ø)': { en: 'Morning (Avg)', ar: 'الصباح (متوسط)' },
  'Abends (Ø)': { en: 'Evening (Avg)', ar: 'المساء (متوسط)' },
  'Nur Morgens': { en: 'Morning only', ar: 'الصباح فقط' },
  'Nur Mittags': { en: 'Noon only', ar: 'الظهر فقط' },
  'Nur Abends': { en: 'Evening only', ar: 'المساء فقط' },
  '+ Messung eintragen': { en: '+ Log reading', ar: '+ تسجيل قياس' },
  'Morgen-Durchschnitt': { en: 'Morning Average', ar: 'متوسط الصباح' },
  'Abend-Durchschnitt': { en: 'Evening Average', ar: 'متوسط المساء' },
  'Zielkorridor (Normbereich)': { en: 'Target Range (Normal)', ar: 'النطاق المستهدف (الطبيعي)' },
  'Unter 135 / 85 mmHg': { en: 'Below 135 / 85 mmHg', ar: 'أقل من 135 / 85 ملم زئبق' },
  'Leitlinien-Empfehlung für Heimblutdruckmessung': {
    en: 'Guideline recommendation for home blood pressure monitoring',
    ar: 'التوصيات الطبية لقياس ضغط الدم المنزلي',
  },
  'Blutdruck- und Pulsverlauf': {
    en: 'Blood Pressure & Pulse Trend',
    ar: 'مسار ضغط الدم والنبض',
  },
  'Systolisch (oben) · Diastolisch (unten) · Puls in Schlägen pro Minute': {
    en: 'Systolic (upper) · Diastolic (lower) · Pulse in beats per minute',
    ar: 'الانقباضي (الأعلى) · الانبساطي (الأدنى) · النبض (نبضة في الدقيقة)',
  },
  'Keine Blutdruckmessungen für diesen Filter vorhanden.': {
    en: 'No blood pressure readings available for this filter.',
    ar: 'لا توجد قياسات ضغط دم متاحة لهذا الفلتر.',
  },
  'Erste Blutdruckmessung eintragen': {
    en: 'Log first blood pressure reading',
    ar: 'تسجيل أول قياس لضغط الدم',
  },
  'erste Blutdruckmessung eintragen': {
    en: 'Log first blood pressure reading',
    ar: 'تسجيل أول قياس لضغط الدم',
  },
  'Gespeicherte Blutdruck- und Pulswerte': {
    en: 'Saved Blood Pressure & Pulse Readings',
    ar: 'قراءات ضغط الدم والنبض المحفوظة',
  },
  'Legende: Dunkelgrün = Systolisch (mmHg) · Blau = Diastolisch (mmHg) · Grau = Puls (bpm)': {
    en: 'Legend: Dark green = Systolic (mmHg) · Blue = Diastolic (mmHg) · Gray = Pulse (bpm)',
    ar: ' المفتاح: أخضر داكن = الانقباضي · أزرق = الانبساطي · رمادي = النبض',
  },
  'Gestrichelte Linien: Zielkorridor 135/85 mmHg': {
    en: 'Dashed lines: Target corridor 135/85 mmHg',
    ar: 'الخطوط المتقطعة: النطاق المستهدف 135/85 ملم زئبق',
  },
  'Blutdruck-Verlauf': { en: 'Blood Pressure Trend', ar: 'مسار ضغط الدم' },
  'Blutdruck & Puls Messprotokoll': {
    en: 'Blood Pressure & Pulse Log',
    ar: 'سجل قياس ضغط الدم والنبض',
  },
  'Blutdruck-Verlaufskurve': {
    en: 'Blood Pressure Trend Chart',
    ar: 'منحنى مسار ضغط الدم',
  },
  'Gespeicherte Blutdruckmessungen': {
    en: 'Saved Blood Pressure Readings',
    ar: 'قياسات ضغط الدم المحفوظة',
  },
  'Für diesen Filterzeitraum liegen noch keine Messungen vor.': {
    en: 'No readings available for this filter period yet.',
    ar: 'لا توجد قياسات متاحة لهذه الفترة الزمنية بعد.',
  },
  'Klassifikation nach ESC / DHL-Leitlinie': {
    en: 'Classification according to ESC / DHL guidelines',
    ar: 'التصنيف وفق إرشادات الجمعية الأوروبية لأمراض القلب',
  },
  'Neue Blutdruckmessung eintragen': {
    en: 'Add New Blood Pressure Reading',
    ar: 'إضافة قياس ضغط دم جديد',
  },
  'Neue Messung eintragen': {
    en: 'Add New Reading',
    ar: 'إضافة قياس جديد',
  },
  'Datum und Uhrzeit werden automatisch vorgeschlagen': {
    en: 'Date and time are suggested automatically',
    ar: 'يتم اقتراح التاريخ والوقت تلقائياً',
  },
  'Systolisch (mmHg)': { en: 'Systolic (mmHg)', ar: 'الانقباضي (ملم زئبق)' },
  'Diastolisch (mmHg)': { en: 'Diastolic (mmHg)', ar: 'الانبساطي (ملم زئبق)' },
  'Systolisch (oberer Wert)': {
    en: 'Systolic (upper value)',
    ar: 'الانقباضي (القيمة العليا)',
  },
  'Diastolisch (unterer Wert)': {
    en: 'Diastolic (lower value)',
    ar: 'الانبساطي (القيمة السفلى)',
  },
  'Puls (Schläge/Min)': {
    en: 'Pulse (beats/min)',
    ar: 'النبض (نبضة/دقيقة)',
  },
  'Puls': { en: 'Pulse', ar: 'النبض' },
  'Notiz / Befinden (optional)': {
    en: 'Note / Condition (optional)',
    ar: 'ملاحظة / الحالة (اختياري)',
  },
  'Ergänzende Notiz (optional)': {
    en: 'Additional note (optional)',
    ar: 'ملاحظة إضافية (اختياري)',
  },
  'z. B. Linker Oberarm nach 5 Min. Sitzen': {
    en: 'e.g. Left upper arm after 5 min sitting',
    ar: 'مثال: الذراع الأيسر بعد 5 دقائق من الجلوس',
  },
  'Blutdruck & Puls speichern': {
    en: 'Save blood pressure & pulse',
    ar: 'حفظ ضغط الدم والنبض',
  },
  'Messung speichern': {
    en: 'Save reading',
    ar: 'حفظ القياس',
  },
  'Messung gespeichert': {
    en: 'Reading saved',
    ar: 'تم حفظ القياس',
  },
  'Datum & Uhrzeit': { en: 'Date & Time', ar: 'التاريخ والوقت' },
  'Bewertung': { en: 'Assessment', ar: 'التقييم' },
  'Notiz': { en: 'Note', ar: 'ملاحظة' },
  'Aktion': { en: 'Action', ar: 'إجراء' },
  'Löschen': { en: 'Delete', ar: 'حذف' },
  'Entfernen': { en: 'Remove', ar: 'إزالة' },

  // Context tags
  'Vor der Tablette': { en: 'Before medication', ar: 'قبل الدواء' },
  'Nach der Tablette': { en: 'After medication', ar: 'بعد الدواء' },
  'Nach dem Sport': { en: 'After exercise', ar: 'بعد الرياضة' },
  'Nach dem Aufstehen': { en: 'After waking up', ar: 'بعد الاستيقاظ' },
  'Stress / Anspannung': { en: 'Stress / Tension', ar: 'توتر / إجهاد' },

  // Blood Sugar (2. Blutzucker)
  'Persönliche Blutzucker-Zielbereiche nach ärztlicher Vorgabe': {
    en: 'Personal Blood Sugar Target Ranges (per medical advice)',
    ar: 'النطاقات المستهدفة الشخصية لسكر الدم حسب توجيهات الطبيب',
  },
  'Nüchtern-Zielbereich:': {
    en: 'Fasting target range:',
    ar: 'النطاق المستهدف صائماً:',
  },
  'Nüchtern-Zielbereich': {
    en: 'Fasting target range',
    ar: 'النطاق المستهدف صائماً',
  },
  'Nach dem Essen (Postprandial):': {
    en: 'After meal (postprandial):',
    ar: 'بعد الأكل (بعد الوجبة):',
  },
  'Nach dem Essen (Postprandial)': {
    en: 'After meal (postprandial)',
    ar: 'بعد الأكل (بعد الوجبة)',
  },
  'unter': { en: 'below', ar: 'أقل من' },
  '+Neu eintragen': { en: '+ Add new', ar: '+ إضافة جديد' },
  '+ Neu eintragen': { en: '+ Add new', ar: '+ إضافة جديد' },
  'Maximalwert 2 Std. nach Mahlzeit (mg/dl)': {
    en: 'Max. value 2 hrs after meal (mg/dL)',
    ar: 'الحد الأقصى بعد ساعتين من الوجبة (ملغ/ديسيلتر)',
  },
  'Blutzuckerverlauf (mg/dl)': {
    en: 'Blood Sugar Trend (mg/dL)',
    ar: 'مسار سكر الدم (ملغ/ديسيلتر)',
  },
  'Blutzuckerverlauf (mmol/l)': {
    en: 'Blood Sugar Trend (mmol/L)',
    ar: 'مسار سكر الدم (مليمول/لتر)',
  },
  'Blutzuckerverlauf': {
    en: 'Blood Sugar Trend',
    ar: 'مسار سكر الدم',
  },
  'Nüchternmessungen & Messungen nach den Mahlzeiten im Zeitverlauf': {
    en: 'Fasting readings & post-meal readings over time',
    ar: 'قياسات الصيام والقياسات بعد الوجبات عبر الوقت',
  },
  '= Nüchternmessung': {
    en: '= Fasting reading',
    ar: '= قياس صائم',
  },
  '= Nach dem Essen': {
    en: '= After meal',
    ar: '= بعد الأكل',
  },
  'Keine Blutzucker-Einträge für diesen Zeitraum vorhanden.': {
    en: 'No blood sugar entries available for this period.',
    ar: 'لا توجد سجلات لسكر الدم لهذه الفترة.',
  },
  'Blutzucker-Protokoll mit Mahlzeiten & Wohlbefinden': {
    en: 'Blood Sugar Log with Meals & Wellbeing',
    ar: 'سجل سكر الدم مع الوجبات والحالة العامة',
  },
  'Essen:': { en: 'Food:', ar: 'الطعام:' },
  'Einheit:': { en: 'Unit:', ar: 'الوحدة:' },
  'Zielbereich anpassen': { en: 'Adjust target range', ar: 'تعديل النطاق المستهدف' },
  '+ Blutzucker eintragen': { en: '+ Log blood sugar', ar: '+ تسجيل سكر الدم' },
  'Persönliche Blutzucker-Zielwerte (in mg/dl)': {
    en: 'Personal Blood Sugar Target Range (in mg/dL)',
    ar: 'النطاق المستهدف الشخصي لسكر الدم (ملغ/ديسيلتر)',
  },
  'Nüchtern Minimum (mg/dl)': { en: 'Fasting Minimum (mg/dL)', ar: 'الحد الأدنى صائماً (ملغ/ديسيلتر)' },
  'Nüchtern Maximum (mg/dl)': { en: 'Fasting Maximum (mg/dL)', ar: 'الحد الأقصى صائماً (ملغ/ديسيلتر)' },
  'Max. nach dem Essen (mg/dl)': { en: 'Max. after meal (mg/dL)', ar: 'الحد الأقصى بعد الأكل (ملغ/ديسيلتر)' },
  'Blutzucker-Verlauf': { en: 'Blood Sugar Trend', ar: 'مسار سكر الدم' },
  'Blutzucker-Verlauf (mg/dl)': {
    en: 'Blood Sugar Trend (mg/dL)',
    ar: 'مسار سكر الدم (ملغ/ديسيلتر)',
  },
  'Gespeicherte Blutzuckerwerte': {
    en: 'Saved Blood Sugar Readings',
    ar: 'قراءات سكر الدم المحفوظة',
  },
  'Nüchtern-Zielbereich: 70–100 mg/dl · 2h nach Mahlzeit: < 140 mg/dl': {
    en: 'Fasting target: 70–100 mg/dL · 2h after meal: < 140 mg/dL',
    ar: 'المستهدف صائماً: 70–100 ملغ/ديسيلتر · ساعتان بعد الأكل: < 140 ملغ/ديسيلتر',
  },
  'Neuen Blutzuckerwert eintragen': {
    en: 'Add New Blood Sugar Reading',
    ar: 'إضافة قراءة سكر دم جديدة',
  },
  'Blutzuckerwert speichern': {
    en: 'Save blood sugar reading',
    ar: 'حفظ قراءة سكر الدم',
  },
  'Blutzuckerwert (mg/dl)': {
    en: 'Blood Sugar Value (mg/dL)',
    ar: 'قيمة سكر الدم (ملغ/ديسيلتر)',
  },
  'Blutzuckerwert (mmol/l)': {
    en: 'Blood Sugar Value (mmol/L)',
    ar: 'قيمة سكر الدم (مليمول/لتر)',
  },
  'Blutzuckerwert': {
    en: 'Blood Sugar Value',
    ar: 'قيمة سكر الدم',
  },
  'Blutzucker (mg/dl)': {
    en: 'Blood Sugar (mg/dL)',
    ar: 'سكر الدم (ملغ/ديسيلتر)',
  },
  'Messzeitpunkt': {
    en: 'Measurement Context',
    ar: 'وقت القياس',
  },
  'Nüchternmessung': { en: 'Fasting reading', ar: 'قياس صائم' },
  'Nüchtern (morgens)': { en: 'Fasting (morning)', ar: 'صائم (صباحاً)' },
  'Nüchtern (> 8 Std.)': { en: 'Fasting (> 8 hrs)', ar: 'صائم (> 8 ساعات)' },
  'Direkt vor Mahlzeit': { en: 'Right before meal', ar: 'مباشرة قبل الوجبة' },
  'Vor dem Essen': { en: 'Before meal', ar: 'قبل الأكل' },
  'Nach dem Essen (1 Std.)': { en: 'After meal (1 hr)', ar: 'بعد الأكل (ساعة)' },
  'Nach dem Essen (2 Std.)': { en: 'After meal (2 hrs)', ar: 'بعد الأكل (ساعتان)' },
  '1 Std. nach dem Essen': { en: '1 hr after meal', ar: 'ساعة بعد الأكل' },
  '2 Std. nach dem Essen': { en: '2 hrs after meal', ar: 'ساعتان بعد الأكل' },
  '1 Std. nach Mahlzeit': { en: '1 hr after meal', ar: 'ساعة بعد الوجبة' },
  '2 Std. nach Mahlzeit': { en: '2 hrs after meal', ar: 'ساعتان بعد الوجبة' },
  'Vor dem Schlafen': { en: 'Before sleep', ar: 'قبل النوم' },
  'Nüchtern': { en: 'Fasting', ar: 'صائم' },
  'Nach Mahlzeit': { en: 'After meal', ar: 'بعد الوجبة' },
  'Vor Mahlzeit': { en: 'Before meal', ar: 'قبل الوجبة' },
  'Wohlbefinden': { en: 'Wellbeing', ar: 'الحالة العامة' },
  'Sehr gut': { en: 'Very good', ar: 'ممتاز' },
  'Gut': { en: 'Good', ar: 'جيد' },
  'Neutral': { en: 'Neutral', ar: 'عادي' },
  'Müde': { en: 'Tired', ar: 'متعب' },
  'Unwohl': { en: 'Unwell', ar: 'غير مرتاح' },
  'Notiz zu Essen / Mahlzeit': { en: 'Food / Meal Note', ar: 'ملاحظة الطعام / الوجبة' },
  'z. B. Haferflocken mit Beeren': { en: 'e.g. Oatmeal with berries', ar: 'مثال: شوفان بالتوت' },
  'Notiz zu Bewegung': { en: 'Exercise Note', ar: 'ملاحظة الحركة' },
  'z. B. 20 Min. Spaziergang': { en: 'e.g. 20 min walk', ar: 'مثال: 20 دقيقة مشي' },
  'Notiz (optional)': {
    en: 'Note (optional)',
    ar: 'ملاحظة (اختياري)',
  },
  'Wert': { en: 'Value', ar: 'القيمة' },
  'Kontext': { en: 'Context', ar: 'السياق' },
  'Einordnung': { en: 'Status', ar: 'التصنيف' },

  // Weight & BMI (3. Gewicht & BMI)
  'Aktuelles Gewicht': { en: 'Current Weight', ar: 'الوزن الحالي' },
  'Größe & Body-Mass-Index (BMI)': {
    en: 'Height & Body Mass Index (BMI)',
    ar: 'الطول ومؤشر كتلة الجسم (BMI)',
  },
  'Einstufung:': { en: 'Classification:', ar: 'التصنيف:' },
  'Einstufung': { en: 'Classification', ar: 'التصنيف' },
  'Persönliches Wunschgewicht': {
    en: 'Personal Target Weight',
    ar: 'الوزن الشخصي المستهدف',
  },
  'Persönliches Zielgewicht': {
    en: 'Personal Target Weight',
    ar: 'الوزن الشخصي المستهدف',
  },
  'Ziel erreicht': { en: 'Goal reached', ar: 'تم تحقيق الهدف' },
  'Zielgewicht erreicht': { en: 'Target weight reached', ar: 'تم الوصول للوزن المستهدف' },
  'Zielwert': { en: 'Target value', ar: 'القيمة المستهدفة' },
  'Wunschgewicht:': { en: 'Target weight:', ar: 'الوزن المستهدف:' },
  'Wunschgewicht': { en: 'Target weight', ar: 'الوزن المستهدف' },
  'Bauchumfang & Körperfett': {
    en: 'Waist Circumference & Body Fat',
    ar: 'محيط الخصر ودهون الجسم',
  },
  'Körperzusammensetzung': {
    en: 'Body composition',
    ar: 'تكوين الجسم',
  },
  'Gewichtsverlauf & Wunschgewicht-Ziellinie': {
    en: 'Weight Trend & Target Weight Line',
    ar: 'مسار الوزن وخط الوزن المستهدف',
  },
  'Gewichtsverlauf & Wunschgewicht Ziellinie': {
    en: 'Weight Trend & Target Weight Line',
    ar: 'مسار الوزن وخط الوزن المستهدف',
  },
  'Kontinuierliche Entwicklung in kg inklusive persönlichem Zielwert': {
    en: 'Continuous trend in kg including personal target weight',
    ar: 'التطور المستمر بالكيلوغرام شاملاً الوزن الشخصي المستهدف',
  },
  'Veränderung:': { en: 'Change:', ar: 'التغير:' },
  'Veränderung': { en: 'Change', ar: 'التغير' },
  'Start- und Zielgewicht vergleichen': {
    en: 'Compare starting and target weight',
    ar: 'مقارنة وزن البداية والوزن المستهدف',
  },
  'Langfristige Gewichtsentwicklung': {
    en: 'Long-Term Weight Trend',
    ar: 'تطور الوزن على المدى الطويل',
  },
  'Sanfte Kurve mit persönlichem Zielgewicht': {
    en: 'Smooth trend curve with personal target weight',
    ar: 'منحنى المسار مع الوزن الشخصي المستهدف',
  },
  '+ Gewicht eintragen': { en: '+ Log weight', ar: '+ تسجيل الوزن' },
  'Messverlauf Gewicht, BMI, Bauchumfang & Körperfett': {
    en: 'History of Weight, BMI, Waist & Body Fat',
    ar: 'سجل الوزن ومؤشر كتلة الجسم ومحيط الخصر ونسبة الدهون',
  },
  'Gewichts- & Bauchumfangsverlauf': {
    en: 'Weight & Waist Circumference Trend',
    ar: 'مسار الوزن ومحيط الخصر',
  },
  'Gewicht eintragen': {
    en: 'Log Weight',
    ar: 'إضافة الوزن',
  },
  'Gewicht (kg)': { en: 'Weight (kg)', ar: 'الوزن (كغ)' },
  'Bauchumfang (cm)': { en: 'Waist circumference (cm)', ar: 'محيط الخصر (سم)' },
  'Bauchumfang (cm, optional)': {
    en: 'Waist circumference (cm, optional)',
    ar: 'محيط الخصر (سم، اختياري)',
  },
  'Bauchumfang': { en: 'Waist circumference', ar: 'محيط الخصر' },
  'Körperfett (%)': { en: 'Body fat (%)', ar: 'نسبة الدهون (%)' },
  'Körperfett': { en: 'Body fat', ar: 'دهون الجسم' },
  'z. B. Morgens nüchtern gewogen': {
    en: 'e.g. Weighed fasting in the morning',
    ar: 'مثال: تم الوزن صباحاً على الريق',
  },
  'Gewicht & Körperwerte speichern': {
    en: 'Save weight & body values',
    ar: 'حفظ الوزن وقياسات الجسم',
  },
  'Gewicht speichern': {
    en: 'Save weight',
    ar: 'حفظ الوزن',
  },

  // 4. Trinken & Sport (Hydration, Exercise & Sleep Diagnostics)
  'Heutiges Trinkziel & Flüssigkeitsbilanz': {
    en: "Today's Hydration Goal & Fluid Balance",
    ar: 'هدف شرب الماء وتوازن السوائل اليوم',
  },
  'Wassermenge mit einem Klick eintragen': {
    en: 'Log water intake with one click',
    ar: 'سجّل كمية الماء بنقرة واحدة',
  },
  'Wassermenge mit einem Klick eintragen:': {
    en: 'Log water intake with one click:',
    ar: 'سجّل كمية الماء بنقرة واحدة:',
  },
  'Kleines Glas': { en: 'Small Glass', ar: 'كوب صغير' },
  'Großes Glas': { en: 'Large Glass', ar: 'كوب كبير' },
  'grosses Glas': { en: 'Large Glass', ar: 'كوب كبير' },
  'Flasche': { en: 'Bottle', ar: 'زجاجة' },
  'Karaffe': { en: 'Carafe', ar: 'إبريق' },
  'Becher': { en: 'Mug', ar: 'قدح' },
  'Glas Wasser': { en: 'Glass of Water', ar: 'كوب ماء' },
  'Wasser': { en: 'Water', ar: 'ماء' },
  'Tägliches Trinkziel auswählen oder selbst eintragen:': {
    en: 'Select or enter your daily hydration goal:',
    ar: 'اختر هدف شرب الماء اليومي أو أدخله بنفسك:',
  },
  'Tägliches Trinkziel auswählen': {
    en: 'Select daily hydration goal',
    ar: 'اختر هدف شرب الماء اليومي',
  },
  'Individuelles tägliches Trinkziel selbst eintragen (ml)': {
    en: 'Enter custom daily hydration goal (ml)',
    ar: 'أدخل هدف شرب الماء اليومي المخصص (مل)',
  },
  'Selbst eintragen…': { en: 'Custom goal…', ar: 'إدخال مخصص…' },
  'Selbst:': { en: 'Custom:', ar: 'مخصص:' },
  'Selbst': { en: 'Custom', ar: 'مخصص' },
  'Ziel': { en: 'Goal', ar: 'الهدف' },
  'Summe': { en: 'Total', ar: 'المجموع' },
  'Ziel 1500 ml': { en: 'Goal 1500 ml', ar: 'الهدف 1500 مل' },
  'Ziel 1800 ml': { en: 'Goal 1800 ml', ar: 'الهدف 1800 مل' },
  'Ziel 2000 ml': { en: 'Goal 2000 ml', ar: 'الهدف 2000 مل' },
  'Ziel 2250 ml': { en: 'Goal 2250 ml', ar: 'الهدف 2250 مل' },
  'Ziel 2500 ml': { en: 'Goal 2500 ml', ar: 'الهدف 2500 مل' },
  'Ziel 3000 ml': { en: 'Goal 3000 ml', ar: 'الهدف 3000 مل' },
  'Trink-Erinnerungen (Frei wählbare Uhrzeiten)': {
    en: 'Hydration Reminders (Custom Times)',
    ar: 'تذكيرات شرب الماء (أوقات مخصصة)',
  },
  'Medical Compass erinnert dich zu diesen Uhrzeiten automatisch an ein Glas Wasser.': {
    en: 'Medical Compass automatically reminds you to drink a glass of water at these times.',
    ar: 'يذكرك Medical Compass تلقائياً بشرب كوب من الماء في هذه الأوقات.',
  },
  '+ Uhrzeit hinzufügen': {
    en: '+ Add reminder time',
    ar: '+ إضافة وقت تذكير',
  },
  'Uhrzeit hinzufügen': {
    en: 'Add reminder time',
    ar: 'إضافة وقت تذكير',
  },
  'Uhrzeit entfernen': {
    en: 'Remove time',
    ar: 'إزالة الوقت',
  },
  'Tägliche Bewegung & Schritte': {
    en: 'Daily Movement & Steps',
    ar: 'الحركة والخطوات اليومية',
  },
  'Tägliche Bewegung & Schritte bearbeiten': {
    en: 'Edit daily movement & steps',
    ar: 'تعديل الحركة والخطوات اليومية',
  },
  'Klicken, um Aktivität und Werte zu ändern': {
    en: 'Click to edit activity and values',
    ar: 'انقر لتعديل النشاط والقيم',
  },
  'Letzte Aktivität & Werte ändern': {
    en: 'Edit last activity & values',
    ar: 'تعديل آخر نشاط والقيم',
  },
  'Letzte Aktivität:': {
    en: 'Last activity:',
    ar: 'آخر نشاط:',
  },
  'Ändern': { en: 'Edit', ar: 'تعديل' },
  'Schritte heute': { en: 'Steps today', ar: 'خطوات اليوم' },
  'Schritte Tagesziel': { en: 'Daily steps goal', ar: 'هدف الخطوات اليومي' },
  'Aktive Min. heute': { en: 'Active min today', ar: 'الدقائق النشطة اليوم' },
  'Min. Tagesziel': { en: 'Daily min goal', ar: 'هدف الدقائق اليومي' },
  'Letzte Aktivität (ändert Notiz & Werte, z. B. „20 Min. Spaziergang, 2000 Schritte“)': {
    en: 'Last activity (updates note & values, e.g. "20 min walk, 2000 steps")',
    ar: 'آخر نشاط (يحدث الملاحظة والقيم، مثل: 20 دقيقة مشي، 2000 خطوة)',
  },
  'z. B. 20 Min. Spaziergang (2000 Schritte)': {
    en: 'e.g. 20 min walk (2000 steps)',
    ar: 'مثال: 20 دقيقة مشي (2000 خطوة)',
  },
  'Werte speichern': { en: 'Save values', ar: 'حفظ القيم' },
  '+1.000 Schritte (10 Min.)': { en: '+1,000 steps (10 min)', ar: '+1000 خطوة (10 دقائق)' },
  '+2.500 Schritte (25 Min.)': { en: '+2,500 steps (25 min)', ar: '+2500 خطوة (25 دقيقة)' },
  'Training & Sportart auswählen (Mehrfachauswahl):': {
    en: 'Select training & sport (multiple choice):',
    ar: 'اختر التدريب ونوع الرياضة (اختيار متعدد):',
  },
  'Laufband': { en: 'Treadmill', ar: 'جهاز المشي' },
  'Fahrrad': { en: 'Cycling', ar: 'الدراجة' },
  'Gymnastik': { en: 'Gymnastics', ar: 'تمارين / جمباز' },
  'Laufband – Aktivität eintragen': {
    en: 'Treadmill – Log activity',
    ar: 'جهاز المشي – تسجيل نشاط',
  },
  'Fahrrad – Aktivität eintragen': {
    en: 'Cycling – Log activity',
    ar: 'الدراجة – تسجيل نشاط',
  },
  'Gymnastik – Aktivität eintragen': {
    en: 'Gymnastics – Log activity',
    ar: 'تمارين – تسجيل نشاط',
  },
  'Laufband bearbeiten': { en: 'Edit Treadmill', ar: 'تعديل جهاز المشي' },
  'Fahrrad bearbeiten': { en: 'Edit Cycling', ar: 'تعديل الدراجة' },
  'Gymnastik bearbeiten': { en: 'Edit Gymnastics', ar: 'تعديل التمارين' },
  'Laufband: Minuten': { en: 'Treadmill: Minutes', ar: 'جهاز المشي: دقائق' },
  'Fahrrad: Minuten': { en: 'Cycling: Minutes', ar: 'الدراجة: دقائق' },
  'Gymnastik: Minuten': { en: 'Gymnastics: Minutes', ar: 'تمارين: دقائق' },
  'Minuten': { en: 'Minutes', ar: 'الدقائق' },
  'Kalorien (kcal)': { en: 'Calories (kcal)', ar: 'السعرات الحرارية (سعرة)' },
  'Km': { en: 'km', ar: 'كم' },
  'Aktivitäts-Kategorie': { en: 'Activity Category', ar: 'فئة النشاط' },
  'Kategorie': { en: 'Category', ar: 'الفئة' },
  'Mobilisation & Aufwärmen': { en: 'Mobility & Warm-up', ar: 'إحماء ومرونة' },
  'Kräftigung': { en: 'Strength', ar: 'تقوية العضلات' },
  'Dehnen': { en: 'Stretching', ar: 'إطالة' },
  'Koordination & Gleichgewicht': { en: 'Coordination & Balance', ar: 'توازن وتناسق' },
  'Schlafdiagnostik (Tägliche Eintragung)': {
    en: 'Sleep Diagnostics (Daily Log)',
    ar: 'تشخيص النوم (تسجيل يومي)',
  },
  'Befund / Notiz': { en: 'Finding / Note', ar: 'النتيجة / ملاحظة' },
  'z. B. Ruhige Atmung': { en: 'e.g. Calm breathing', ar: 'مثال: تنفس هادئ' },
  'Schlafdauer (Std.)': { en: 'Sleep Duration (hrs)', ar: 'مدة النوم (ساعات)' },
  'Schlafdauer (Std.):': { en: 'Sleep Duration (hrs):', ar: 'مدة النوم (ساعات):' },
  'Schlafqualität auswählen (Mehrfachauswahl):': {
    en: 'Select sleep quality (multiple choice):',
    ar: 'اختر جودة النوم (اختيار متعدد):',
  },
  'Schlafqualität (Mehrfachauswahl):': {
    en: 'Sleep Quality (multiple choice):',
    ar: 'جودة النوم (اختيار متعدد):',
  },
  'Gespeicherte Schlafdiagnostik': {
    en: 'Saved Sleep Diagnostics',
    ar: 'سجلات تشخيص النوم المحفوظة',
  },
  'Gespeicherte Trainings-Aktivitäten': {
    en: 'Saved Training Activities',
    ar: 'أنشطة التدريب المحفوظة',
  },
  'Erholsamer Schlaf': { en: 'Restful sleep', ar: 'نوم مريح' },
  'Unruhiger Schlaf': { en: 'Restless sleep', ar: 'نوم مضطرب' },
  'Durchschlafstörung': { en: 'Sleep maintenance insomnia', ar: 'اضطراب استمرارية النوم' },
  'Schnarchen / Apnoe-Hinweis': { en: 'Snoring / Apnea sign', ar: 'شخير / مؤشر انقطاع التنفس' },
  'Schlaf-Eintrag bearbeiten': { en: 'Edit sleep entry', ar: 'تعديل سجل النوم' },
  'Max. 3 Monate (90 Tage) · Ältere Monate werden automatisch gelöscht': {
    en: 'Max. 3 months (90 days) · Older months are deleted automatically',
    ar: 'بحد أقصى 3 أشهر (90 يوماً) · يتم حذف الأشهر الأقدم تلقائياً',
  },
  'Ältere Monate werden automatisch gelöscht': {
    en: 'Older months are deleted automatically',
    ar: 'يتم حذف الأشهر الأقدم تلقائياً',
  },
  'Schnellauswahl Trinkmenge': {
    en: 'Quick Select Water Amount',
    ar: 'اختيار سريع لكمية الماء',
  },
  'Wassermenge (ml)': { en: 'Water amount (ml)', ar: 'كمية الماء (مل)' },
  'Getränk / Bezeichnung': { en: 'Drink / Label', ar: 'المشروب / الوصف' },
  'Tägliche Bewegung ergänzen (optional)': {
    en: 'Add daily exercise (optional)',
    ar: 'إضافة حركة يومية (اختياري)',
  },
  'Zusätzliche Schritte': { en: 'Additional steps', ar: 'خطوات إضافية' },
  'Aktive Minuten': { en: 'Active minutes', ar: 'دقائق نشطة' },
  'Art der Bewegung': { en: 'Type of exercise', ar: 'نوع الحركة' },
  'Trinkmenge & Bewegung eintragen': {
    en: 'Log water & exercise',
    ar: 'تسجيل شرب الماء والحركة',
  },
  'Aktiv': { en: 'Active', ar: 'نشط' },
  'Aus': { en: 'Off', ar: 'إيقاف' },

  // 5. Sauerstoffsättigung (SpO2)
  'Aktuelle Sauerstoffsättigung': {
    en: 'Current Oxygen Saturation',
    ar: 'تشبع الأكسجين الحالي',
  },
  '+ Sauerstoffsättigung eintragen': {
    en: '+ Log oxygen saturation',
    ar: '+ تسجيل تشبع الأكسجين',
  },
  'Sauerstoffsättigung (%)': {
    en: 'Oxygen Saturation (%)',
    ar: 'تشبع الأكسجين (%)',
  },
  'Normal (95–100 %)': {
    en: 'Normal (95–100%)',
    ar: 'طبيعي (95–100%)',
  },
  'Leicht erniedrigt (90–94 %)': {
    en: 'Slightly low (90–94%)',
    ar: 'منخفض قليلاً (90–94%)',
  },
  'Niedrig (< 90 %)': {
    en: 'Low (< 90%)',
    ar: 'منخفض (< 90%)',
  },
  'Durchschnitt (Ø O₂)': {
    en: 'Average (Ø O₂)',
    ar: 'المتوسط (Ø O₂)',
  },
  'Durchschnitt': {
    en: 'Average',
    ar: 'المتوسط',
  },
  'Puls bei letzter Messung:': {
    en: 'Pulse at last reading:',
    ar: 'النبض في آخر قياس:',
  },
  'Puls bei letzter Messung': {
    en: 'Pulse at last reading',
    ar: 'النبض في آخر قياس',
  },
  'Referenz- & Zielbereich': {
    en: 'Reference & Target Range',
    ar: 'النطاق المرجعي والمستهدف',
  },
  'Optimaler Bereich für Erwachsene': {
    en: 'Optimal range for adults',
    ar: 'النطاق المثالي للبالغين',
  },
  'Sauerstoffsättigung im Verlauf': {
    en: 'Oxygen Saturation Over Time',
    ar: 'مسار تشبع الأكسجين',
  },
  'Blutsauerstoffgehalt in Prozent (%) · Grüner Zielkorridor: 95 % bis 100 %': {
    en: 'Blood oxygen level in percent (%) · Green target range: 95% to 100%',
    ar: 'نسبة الأكسجين في الدم (%) · النطاق الأخضر المستهدف: 95% إلى 100%',
  },
  '+ SpO₂-Messung eintragen': {
    en: '+ Log SpO₂ reading',
    ar: '+ تسجيل قياس SpO₂',
  },
  'Sauerstoffsättigung O₂ (%)': {
    en: 'Oxygen Saturation O₂ (%)',
    ar: 'تشبع الأكسجين O₂ (%)',
  },
  'Messsituation auswählen (Mehrfachauswahl möglich)': {
    en: 'Select measurement context (multiple choice)',
    ar: 'اختر حالة القياس (يمكن اختيار أكثر من خيار)',
  },
  'Morgens in Ruhe': { en: 'Morning at rest', ar: 'صباحاً في الراحة' },
  'In Ruhe': { en: 'At rest', ar: 'في حالة راحة' },
  'Nach Bewegung / Sport': { en: 'After exercise / sport', ar: 'بعد الحركة / الرياضة' },
  'Nach Spaziergang': { en: 'After a walk', ar: 'بعد المشي' },
  'Abends in Ruhe': { en: 'Evening at rest', ar: 'مساءً في الراحة' },
  'Sport & Aktivität': { en: 'Sport & Activity', ar: 'الرياضة والنشاط' },
  'Messprotokoll Sauerstoffsättigung': {
    en: 'Oxygen Saturation Log',
    ar: 'سجل قياس تشبع الأكسجين',
  },
  'Normalbereich': { en: 'Normal range', ar: 'النطاق الطبيعي' },
  'Kontrollbedürftig': { en: 'Check required', ar: 'يتطلب متابعة' },
  'Niedrig (Arztkontakt empfohlen)': {
    en: 'Low (doctor contact recommended)',
    ar: 'منخفض (ينصح بمراجعة الطبيب)',
  },

  // 6. Laborwerte (Lab Results)
  'Laborwerte & Befunde': {
    en: 'Lab Results & Findings',
    ar: 'نتائج وتحاليل المختبر',
  },
  '+Hinzufügen': { en: '+ Add', ar: '+ إضافة' },
  '+ Hinzufügen': { en: '+ Add', ar: '+ إضافة' },
  'Hinzufügen': { en: 'Add', ar: 'إضافة' },
  'Untersuchung': { en: 'Test / Parameter', ar: 'الفحص / التحليل' },
  'Resultat': { en: 'Result', ar: 'النتيجة' },
  'Referenzwerte': { en: 'Reference Values', ar: 'القيم المرجعية' },
  'Untersuchung (z. B. TSH)': { en: 'Test / Parameter (e.g. TSH)', ar: 'الفحص (مثل TSH)' },
  'Resultat (z. B. 1,9 mU/l)': { en: 'Result (e.g. 1.9 mU/L)', ar: 'النتيجة (مثل 1.9)' },
  'Referenzwerte (z. B. 0,4 – 4,0)': {
    en: 'Reference values (e.g. 0.4 – 4.0)',
    ar: 'القيم المرجعية (مثل 0.4 – 4.0)',
  },
  'Resultat...': { en: 'Result...', ar: 'النتيجة...' },
  'Referenzwerte...': { en: 'Reference values...', ar: 'القيم المرجعية...' },
  'Harnsäure': { en: 'Uric Acid', ar: 'حمض اليوريك' },

  // Medications View
  'Medikamenten-Protokoll': {
    en: 'Medication Log',
    ar: 'سجل الأدوية',
  },
  'Medikamente & Einnahme-Sicherheit': {
    en: 'Medications & Intake Safety',
    ar: 'الأدوية وسلامة التناول',
  },
  'Täglicher Einnahmeplan · Erinnerungen per Handy-Benachrichtigung · Vorratskontrolle & Folgerezepte': {
    en: 'Daily intake schedule · Mobile notification reminders · Stock monitoring & refill prescriptions',
    ar: 'جدول التناول اليومي · تذكيرات عبر إشعارات الهاتف · مراقبة المخزون والوصفات الطبية',
  },
  'Handy-Erinnerung testen': {
    en: 'Test mobile reminder',
    ar: 'تجربة تذكير الهاتف',
  },
  'Formular schließen': {
    en: 'Close form',
    ar: 'إغلاق النموذج',
  },
  'Hinweis auf niedrigen Tablettenvorrat & Folgerezept-Erinnerung': {
    en: 'Low Tablet Stock Alert & Refill Prescription Reminder',
    ar: 'تنبيه انخفاض مخزون الأقراص وتذكير تجديد الوصفة',
  },
  'Neues Medikament mit individueller Erinnerung anlegen': {
    en: 'Add new medication with custom reminder',
    ar: 'إضافة دواء جديد مع تذكير مخصص',
  },
  'Neues Medikament': {
    en: 'New Medication',
    ar: 'دواء جديد',
  },
  'Neues Medikament zum Plan hinzufügen': {
    en: 'Add New Medication to Plan',
    ar: 'إضافة دواء جديد إلى الخطة',
  },
  'Medikamentenname': { en: 'Medication Name', ar: 'اسم الدواء' },
  'z. B. Ramipril, Metformin, Vitamin D3': {
    en: 'e.g. Ramipril, Metformin, Vitamin D3',
    ar: 'مثال: راميبريل، ميتفورمين، فيتامين د3',
  },
  'Dosierung': { en: 'Dosage', ar: 'الجرعة' },
  'z. B. 5 mg / 1 Tablette': {
    en: 'e.g. 5 mg / 1 tablet',
    ar: 'مثال: 5 ملغ / قرص واحد',
  },
  'Darreichungsform': { en: 'Dosage Form', ar: 'الشكل الدوائي' },
  'Tablette': { en: 'Tablet', ar: 'قرص' },
  'Kapsel': { en: 'Capsule', ar: 'كبسولة' },
  'Tropfen': { en: 'Drops', ar: 'قطرات' },
  'Injektion': { en: 'Injection', ar: 'حقنة' },
  'Salbe': { en: 'Ointment', ar: 'مرهم' },
  '1. Uhrzeit': { en: '1st Time', ar: 'الوقت الأول' },
  '2. Uhrzeit (optional)': { en: '2nd Time (optional)', ar: 'الوقت الثاني (اختياري)' },
  'Uhrzeit (Erinnerung)': { en: 'Time (Reminder)', ar: 'الوقت (تذكير)' },
  'Aktueller Vorrat (Stück)': { en: 'Current Stock (pieces)', ar: 'المخزون الحالي (حبة)' },
  'Warnung ab Vorrat ≤': { en: 'Low stock alert at ≤', ar: 'تنبيه عند المخزون ≤' },
  'Warnung bei Vorrat unter': { en: 'Low stock alert below', ar: 'تنبيه عند انخفاض المخزون عن' },
  'Wochentage der Einnahme': {
    en: 'Days of the week for intake',
    ar: 'أيام الأسبوع للتناول',
  },
  'Optionale Erinnerung an Rezept / Arzttermin': {
    en: 'Optional reminder for prescription / doctor appointment',
    ar: 'تذكير اختياري للوصفة الطبية / موعد الطبيب',
  },
  'z. B. Neues Rezept bei Hausarzt anfordern / Blutbild vor Folgerezept': {
    en: 'e.g. Request new prescription from family doctor / blood test before refill',
    ar: 'مثال: طلب وصفة جديدة من طبيب العائلة / تحليل دم قبل التجديد',
  },
  'Einnahmehinweis (z. B. Vor dem Frühstück mit Wasser)': {
    en: 'Intake instructions (e.g. Before breakfast with water)',
    ar: 'إرشادات التناول (مثل قبل الإفطار مع الماء)',
  },
  'Morgens 30 Min. vor dem Essen': {
    en: 'Morning 30 min before meal',
    ar: 'صباحاً قبل الأكل بـ 30 دقيقة',
  },
  'Einnahmehinweis (z. B. vor dem Essen, mit viel Wasser)': {
    en: 'Intake instructions (e.g. before meal, with plenty of water)',
    ar: 'إرشادات التناول (مثل قبل الأكل، مع الكثير من الماء)',
  },
  'Medikament mit Erinnerung speichern': {
    en: 'Save medication with reminder',
    ar: 'حفظ الدواء مع التذكير',
  },
  'Medikament speichern': { en: 'Save medication', ar: 'حفظ الدواء' },
  'Heutiger Einnahmeplan': {
    en: "Today's Intake Schedule",
    ar: 'جدول التناول اليومي',
  },
  'Noch keine Medikamente im Plan eingetragen.': {
    en: 'No medications added to the schedule yet.',
    ar: 'لم تتم إضافة أدوية إلى الخطة بعد.',
  },
  'Uhrzeiten:': { en: 'Times:', ar: 'الأوقات:' },
  'Tage:': { en: 'Days:', ar: 'الأيام:' },
  'Täglich (Mo–So)': { en: 'Daily (Mon–Sun)', ar: 'يومياً (الإثنين–الأحد)' },
  'Tage/Woche': { en: 'days/week', ar: 'أيام/أسبوع' },
  'Tablettenvorrat:': { en: 'Tablet stock:', ar: 'مخزون الأقراص:' },
  '(Niedriger Vorrat!)': { en: '(Low stock!)', ar: '(مخزون منخفض!)' },
  'Rezept-/Arzthinweis:': { en: 'Prescription / doctor note:', ar: 'ملاحظة الوصفة / الطبيب:' },
  'Rezept-Erinnerung:': { en: 'Prescription reminder:', ar: 'تذكير الوصفة:' },
  '+ Nachfüllen (+30)': { en: '+ Refill (+30)', ar: '+ إعادة تعبئة (+30)' },
  'Einnahmehistorie': {
    en: 'Intake History',
    ar: 'تاريخ التناول',
  },
  'Einnahme-Historie & Protokoll': {
    en: 'Intake History & Log',
    ar: 'سجل وتاريخ تناول الأدوية',
  },
  'Chronologisches Protokoll aller dokumentierten Einnahmen': {
    en: 'Chronological log of all documented intakes',
    ar: 'سجل زمني لجميع الجرعات الموثقة',
  },
  'Alle löschen': { en: 'Clear all', ar: 'حذف الكل' },
  'Keine Einträge vorhanden — Protokollliste ist frei.': {
    en: 'No entries available — log list is empty.',
    ar: 'لا توجد سجلات — قائمة السجل فارغة.',
  },
  'Erfasst': { en: 'Logged', ar: 'مسجل' },
  'Ausgelassen': { en: 'Skipped', ar: 'تم التخطي' },
  'Erinnerung: Medikament jetzt einnehmen': {
    en: 'Reminder: Take medication now',
    ar: 'تذكير: تناول الدواء الآن',
  },

  // Preventive & Doctors View
  'Notizen': { en: 'Notes', ar: 'ملاحظات' },
  '+Neu': { en: '+ New', ar: '+ جديد' },
  '+ Neu': { en: '+ New', ar: '+ جديد' },
  '+ Frage merken': { en: '+ Save question', ar: '+ حفظ السؤال' },
  'Neue Frage an den Arzt eingeben...': {
    en: 'Enter a new question for your doctor...',
    ar: 'أدخل سؤالاً جديداً للطبيب...',
  },
  'Neuen Vorsorge- oder Notiz-Eintrag hinzufügen': {
    en: 'Add new checkup or note entry',
    ar: 'إضافة فحص وقائي أو ملاحظة جديدة',
  },
  'Titel / Vorsorge-Eintrag': {
    en: 'Title / Checkup Entry',
    ar: 'العنوان / الفحص الوقائي',
  },
  'z. B. Hautkrebs-Screening, Augenarzt, Blutbild...': {
    en: 'e.g. Skin cancer screening, eye doctor, blood test...',
    ar: 'مثال: فحص الجلد، طبيب العيون، تحليل الدم...',
  },
  'Blutuntersuchung': { en: 'Blood Test', ar: 'تحليل دم' },
  'Vorsorgeuntersuchung': { en: 'Preventive Checkup', ar: 'فحص وقائي' },
  'Intervall': { en: 'Interval', ar: 'الفترة الدورية' },
  'z. B. Jährlich, Alle 2 Jahre': {
    en: 'e.g. Yearly, Every 2 years',
    ar: 'مثال: سنوياً، كل سنتين',
  },
  'Status': { en: 'Status', ar: 'الحالة' },
  'Aktuell / Erledigt': { en: 'Up to date / Completed', ar: 'محدث / مكتمل' },
  'Demnächst fällig': { en: 'Due soon', ar: 'مستحق قريباً' },
  'Überfällig': { en: 'Overdue', ar: 'متأخر' },
  'Zuletzt durchgeführt': { en: 'Last performed', ar: 'آخر إجراء' },
  'Nächster Termin / Fällig am': { en: 'Next appointment / Due on', ar: 'الموعد القادم / مستحق في' },
  'Notiz / Hinweis': { en: 'Note / Hint', ar: 'ملاحظة / إرشاد' },
  'Persönliche Notiz oder ärztlicher Hinweis...': {
    en: 'Personal note or medical advice...',
    ar: 'ملاحظة شخصية أو توجيه طبي...',
  },
  'Noch keine Vorsorge-Notizen vorhanden. Klicke oben auf „+Neu“, um einen Eintrag anzulegen.': {
    en: 'No checkup notes available yet. Click "+ New" above to create an entry.',
    ar: 'لا توجد ملاحظات فحوصات بعد. انقر على "+ جديد" أعلاه لإضافة سجل.',
  },
  'Aktuell geschützt / erledigt': {
    en: 'Up to date / completed',
    ar: 'محدث / مكتمل',
  },
  'Überfällig – bitte Termin vereinbaren': {
    en: 'Overdue – please schedule an appointment',
    ar: 'متأخر – يرجى تحديد موعد',
  },
  'Zuletzt:': { en: 'Last:', ar: 'آخر مرة:' },
  'Fällig:': { en: 'Due:', ar: 'مستحق:' },
  'Heute erledigt': { en: 'Done today', ar: 'تم اليوم' },
  'Besprochen': { en: 'Discussed', ar: 'تمت مناقشته' },
  'Offen': { en: 'Open', ar: 'مفتوح' },
  'Antwort:': { en: 'Answer:', ar: 'الإجابة:' },
  'Noch keine offenen Fragen notiert.': {
    en: 'No open questions saved yet.',
    ar: 'لم يتم تدوين أسئلة مفتوحة بعد.',
  },
  'Arzt-Antwort bearbeiten': {
    en: 'Edit doctor answer',
    ar: 'تعديل إجابة الطبيب',
  },
  '+ Antwort vom Arzt notieren': {
    en: '+ Record doctor answer',
    ar: '+ تدوين إجابة الطبيب',
  },
  'Antwort des Arztes notieren...': {
    en: 'Record the doctor’s answer...',
    ar: 'تدوين إجابة الطبيب...',
  },
  'Als offen markieren': { en: 'Mark as open', ar: 'تحديد كمفتوح' },
  'Frage löschen': { en: 'Delete question', ar: 'حذف السؤال' },
  'Erklärung schließen': { en: 'Close explanation', ar: 'إغلاق الشرح' },
  'Vorsorge, Laborwerte & Arztgespräch': {
    en: 'Checkups, Lab Results & Doctor Visit',
    ar: 'الفحوصات الوقائية والمختبر وزيارة الطبيب',
  },
  'Empfohlene Check-ups für 50+, verständliche Labor-Erklärungen und deine persönliche Fragen-Checkliste': {
    en: 'Recommended checkups for 50+, clear lab explanations, and your personal question checklist',
    ar: 'الفحوصات الموصى بها لسن +50، شرح مبسط للتحاليل وقائمة أسئلتك الشخصية',
  },
  'Vorsorge & Laborwerte': {
    en: 'Checkups & Lab Values',
    ar: 'الفحوصات والتحاليل',
  },
  'Fragen-Liste für den Arzt': {
    en: 'Question List for the Doctor',
    ar: 'قائمة الأسئلة للطبيب',
  },
  'Empfohlene Vorsorge-Untersuchungen (50+)': {
    en: 'Recommended Preventive Checkups (50+)',
    ar: 'الفحوصات الوقائية الموصى بها (+50)',
  },
  'Alle Kategorien': { en: 'All Categories', ar: 'جميع الفئات' },
  'Herz & Kreislauf': { en: 'Heart & Circulation', ar: 'القلب والدورة الدموية' },
  'Stoffwechsel': { en: 'Metabolism', ar: 'الأيض والتمثيل الغذائي' },
  'Krebsvorsorge': { en: 'Cancer Screening', ar: 'فحص الأورام المبكر' },
  'Impfungen': { en: 'Vaccinations', ar: 'التطعيمات' },
  'Augen & Ohren': { en: 'Eyes & Ears', ar: 'العيون والأذن' },
  'Erledigt': { en: 'Completed', ar: 'مكتمل' },
  'Geplant': { en: 'Scheduled', ar: 'مجدول' },
  'Fällig': { en: 'Due', ar: 'مستحق' },
  'Als erledigt markieren': { en: 'Mark as completed', ar: 'تحديد كمكتمل' },
  'Auf fällig setzen': { en: 'Set as due', ar: 'تعيين كمستحق' },
  'Laborwerte einfach erklärt (HbA1c, Cholesterin & Nieren)': {
    en: 'Lab Values Explained Simply (HbA1c, Cholesterol & Kidneys)',
    ar: 'شرح مبسط لنتائج المختبر (السكر التراكمي، الكوليسترول والكلى)',
  },
  'Klicke auf einen Wert, um die medizinische Bedeutung verständlich zu lesen': {
    en: 'Click on a parameter to read a clear explanation of its medical meaning',
    ar: 'انقر على أي مؤشر لقراءة شرح واضح لمعناه الطبي',
  },
  'Notiere dir Fragen im Alltag sofort, damit beim Arzttermin nichts vergessen wird.': {
    en: 'Write down questions in everyday life right away so nothing is forgotten during your doctor appointment.',
    ar: 'دوّن أسئلتك في الحياة اليومية فوراً حتى لا تنسى شيئاً في موعد الطبيب.',
  },
  'Für Hausarzt': { en: 'For Family Doctor', ar: 'لطبيب العائلة' },
  'Für Kardiologie': { en: 'For Cardiology', ar: 'لطب القلب' },
  'Für Diabetologie': { en: 'For Diabetology', ar: 'لطب السكري' },
  'Für Apotheke / Allgemein': { en: 'For Pharmacy / General', ar: 'للصيدلية / عام' },
  'Hausarzt': { en: 'Family Doctor', ar: 'طبيب العائلة' },
  'Kardiologie': { en: 'Cardiology', ar: 'طب القلب' },
  'Diabetologie': { en: 'Diabetology', ar: 'طب السكري' },
  'Allgemein': { en: 'General', ar: 'عام' },
  'Frage hinzufügen': { en: 'Add question', ar: 'إضافة سؤال' },
  'Bereits im Arztgespräch geklärt': {
    en: 'Already discussed with doctor',
    ar: 'تمت مناقشته مع الطبيب',
  },
  'Noch offen': { en: 'Still open', ar: 'لا يزال مفتوحاً' },

  // Calendar View
  'Zurück': { en: 'Back', ar: 'السابق' },
  'Weiter': { en: 'Next', ar: 'التالي' },
  'Ausgewählt:': { en: 'Selected:', ar: 'المحدد:' },
  'Ausgewählt': { en: 'Selected', ar: 'المحدد' },
  'Arzttermine, Vorsorge & tägliche Messungen im Überblick': {
    en: 'Doctor appointments, checkups & daily readings at a glance',
    ar: 'مواعيد الأطباء والفحوصات والقياسات اليومية في نظرة عامة',
  },
  'Arzttermin / Planen': {
    en: 'Schedule Doctor Appointment',
    ar: 'تحديد موعد طبيب',
  },
  'Neuen Arzttermin oder Untersuchung planen': {
    en: 'Schedule new doctor appointment or checkup',
    ar: 'تخطيط موعد طبيب أو فحص جديد',
  },
  'Arzt / Praxis': { en: 'Doctor / Practice', ar: 'الطبيب / العيادة' },
  'Fachrichtung': { en: 'Specialty', ar: 'التخصص' },
  'Untersuchungsgrund': { en: 'Reason for visit', ar: 'سبب الفحص' },
  'Ort / Adresse': { en: 'Location / Address', ar: 'الموقع / العنوان' },
  'Vorbereitungs-Notiz (optional)': {
    en: 'Preparation note (optional)',
    ar: 'ملاحظة تحضيرية (اختياري)',
  },
  'Blutuntersuchung geplant (Erinnerung: Nüchtern zum Termin erscheinen)': {
    en: 'Blood test scheduled (Reminder: Come fasting to the appointment)',
    ar: 'تحليل دم مجدول (تذكير: الحضور صائماً للموعد)',
  },
  'Blutuntersuchung geplant': {
    en: 'Blood test scheduled',
    ar: 'تحليل دم مجدول',
  },
  'WICHTIG: Bitte nüchtern erscheinen!': {
    en: 'IMPORTANT: Please come fasting!',
    ar: 'هام: يرجى الحضور صائماً!',
  },
  'Hinweis:': { en: 'Note:', ar: 'ملاحظة:' },
  'Ort:': { en: 'Location:', ar: 'الموقع:' },
  'Vorsorge & Fragen': { en: 'Checkups & Questions', ar: 'الفحوصات والأسئلة' },
  'Zu den Fragen': { en: 'Go to questions', ar: 'الانتقال إلى الأسئلة' },
  'Am ausgewählten Tag sind noch keine Termine oder Messungen eingetragen.': {
    en: 'No appointments or readings logged on the selected day yet.',
    ar: 'لا توجد مواعيد أو قياسات مسجلة في اليوم المحدد بعد.',
  },
  'Frage an den Arzt (für diesen Termin vorgemerkt):': {
    en: 'Question for the doctor (saved for this appointment):',
    ar: 'سؤال للطبيب (محفوظ لهذا الموعد):',
  },
  'Noch keine Frage für diesen Termin notiert.': {
    en: 'No question saved for this appointment yet.',
    ar: 'لم يتم حفظ سؤال لهذا الموعد بعد.',
  },
  'Direkt eine Frage für diesen Termin hinzufügen...': {
    en: 'Add a question directly for this appointment...',
    ar: 'أضف سؤالاً مباشرة لهذا الموعد...',
  },
  'Januar': { en: 'January', ar: 'يناير' },
  'Februar': { en: 'February', ar: 'فبراير' },
  'März': { en: 'March', ar: 'مارس' },
  'April': { en: 'April', ar: 'أبريل' },
  'Mai': { en: 'May', ar: 'مايو' },
  'Juni': { en: 'June', ar: 'يونيو' },
  'Juli': { en: 'July', ar: 'يوليو' },
  'August': { en: 'August', ar: 'أغسطس' },
  'September': { en: 'September', ar: 'سبتمبر' },
  'Oktober': { en: 'October', ar: 'أكتوبر' },
  'November': { en: 'November', ar: 'نوفمبر' },
  'Dezember': { en: 'December', ar: 'ديسمبر' },
  'Mo': { en: 'Mon', ar: 'إث' },
  'Di': { en: 'Tue', ar: 'ثل' },
  'Mi': { en: 'Wed', ar: 'أر' },
  'Do': { en: 'Thu', ar: 'خم' },
  'Fr': { en: 'Fri', ar: 'جم' },
  'Sa': { en: 'Sat', ar: 'سب' },
  'So': { en: 'Sun', ar: 'أح' },
  'Vorheriger Monat': { en: 'Previous month', ar: 'الشهر السابق' },
  'Nächster Monat': { en: 'Next month', ar: 'الشهر التالي' },
  'Heute': { en: 'Today', ar: 'اليوم' },
  '+ Termin': { en: '+ Appointment', ar: '+ موعد' },
  'Arzttermin': { en: 'Doctor Appointment', ar: 'موعد طبيب' },
  'Termine': { en: 'Appointments', ar: 'المواعيد' },
  'Kein anstehender Termin eingetragen.': {
    en: 'No upcoming appointment scheduled.',
    ar: 'لا يوجد موعد قادم مسجل.',
  },
  'Tagesdetails': { en: 'Day Details', ar: 'تفاصيل اليوم' },
  'Heute markiert': { en: 'Marked as today', ar: 'محدد كاليوم' },
  'Für diesen Tag liegen keine Einträge vor.': {
    en: 'No entries recorded for this day.',
    ar: 'لا توجد سجلات لهذا اليوم.',
  },
  'Neuen Arzttermin eintragen': {
    en: 'Schedule New Doctor Appointment',
    ar: 'إضافة موعد طبيب جديد',
  },
  'Arzt / Praxisname': { en: 'Doctor / Clinic Name', ar: 'اسم الطبيب / العيادة' },
  'Fachrichtung / Anlass': { en: 'Specialty / Reason', ar: 'التخصص / السبب' },
  'Adresse / Ort': { en: 'Address / Location', ar: 'العنوان / الموقع' },
  'Erinnerungs-Notiz (z. B. Nüchtern erscheinen, Versichertenkarte)': {
    en: 'Reminder note (e.g. come fasting, insurance card)',
    ar: 'ملاحظة تذكيرية (مثل الحضور صائماً، بطاقة التأمين)',
  },
  'Termin speichern': {
    en: 'Save appointment',
    ar: 'حفظ الموعد',
  },
  'Termin löschen': { en: 'Delete appointment', ar: 'حذف الموعد' },

  // Health Report View ("Gesundheitsbericht")
  'Gesundheitsbericht': {
    en: 'Medical Report',
    ar: 'التقرير الطبي',
  },
  'Medizinischer Gesundheitsbericht': {
    en: 'Medical Health Report',
    ar: 'التقرير الصحي الطبي',
  },
  'Ø Blutdruck': {
    en: 'Avg Blood Pressure',
    ar: 'متوسط ضغط الدم',
  },
  'Ø Blutzucker': {
    en: 'Avg Blood Sugar',
    ar: 'متوسط سكر الدم',
  },
  'Ø Puls:': {
    en: 'Avg Pulse:',
    ar: 'متوسط النبض:',
  },
  'Therapietreue': {
    en: 'Adherence',
    ar: 'الالتزام بالعلاج',
  },
  'Einnahmen': {
    en: 'intakes',
    ar: 'جرعات',
  },
  'Schmerzen Liniendiagramm – Tägliche Analyse': {
    en: 'Pain Trend Line Chart – Daily Analysis',
    ar: 'الرسم البياني الخطي للآلام – التحليل اليومي',
  },
  'Tägliche Analyse von Schmerzstatus (Ja / Nein), Schmerzen Stufe (Stark, Leicht, Kurz) & Beschreibung': {
    en: 'Daily analysis of pain status (Yes / No), pain intensity (Severe, Mild, Brief) & description',
    ar: 'التحليل اليومي لحالة الألم (نعم / لا)، درجة الألم (شديد، خفيف، قصير) والوصف',
  },
  'Tägliche Analyse – Schmerzen Protokoll': {
    en: 'Daily Analysis – Pain Log',
    ar: 'التحليل اليومي – سجل الآلام',
  },
  'Rot = Ja · Grün = Nein': {
    en: 'Red = Yes · Green = No',
    ar: 'أحمر = نعم · أخضر = لا',
  },
  'Inhalt des ausgedruckten Reports (PDF & CSV): Abschnitte 1 bis 7': {
    en: 'Contents of the Printed Report (PDF & CSV): Sections 1 to 7',
    ar: 'محتويات التقرير المطبوع (PDF و CSV): الأقسام 1 إلى 7',
  },
  'Alle 7 Hauptbereiche werden beim Drucken und im PDF-Bericht vollständig ausgegeben': {
    en: 'All 7 main sections are included in full when printing and in the PDF report',
    ar: 'يتم تضمين جميع الأقسام السبعة الرئيسية بالكامل عند الطباعة وفي تقرير PDF',
  },
  'Patienten-Stammdaten': {
    en: 'Patient Master Data',
    ar: 'البيانات الأساسية للمريض',
  },
  'Name, Geburtsdatum, Krankenkasse, Vers.-Nr. & Hausarzt': {
    en: 'Name, date of birth, health insurance, ins. no. & family doctor',
    ar: 'الاسم، تاريخ الميلاد، التأمين الصحي، رقم التأمين وطبيب العائلة',
  },
  '1. Blutdruck & Puls · 2. Blutzucker · 3. Gewicht & BMI': {
    en: '1. Blood Pressure & Pulse · 2. Blood Sugar · 3. Weight & BMI',
    ar: '1. ضغط الدم والنبض · 2. سكر الدم · 3. الوزن ومؤشر كتلة الجسم',
  },
  'Alle Messwerte, Zielbereiche, Durchschnitte & Verlaufsdiagramme': {
    en: 'All readings, target ranges, averages & trend charts',
    ar: 'جميع القراءات والنطاقات المستهدفة والمتوسطات والرسوم البيانية',
  },
  '4. Trinken & Sport · 5. Sauerstoffsättigung · 6. Laborwerte': {
    en: '4. Hydration & Sport · 5. Oxygen Saturation · 6. Lab Results',
    ar: '4. شرب الماء والرياضة · 5. تشبع الأكسجين · 6. نتائج المختبر',
  },
  'Flüssigkeitsbilanz, Trainings-Aktivitäten, Schlafdiagnostik, SpO₂ & Laborbefunde': {
    en: 'Fluid balance, training activities, sleep diagnostics, SpO₂ & lab findings',
    ar: 'توازن السوائل، أنشطة التدريب، تشخيص النوم، تشبع الأكسجين ونتائج المختبر',
  },
  '7. Medikamente, Vorsorge, Arzt-Fragen & Schmerz-Analyse': {
    en: '7. Medications, Checkups, Doctor Questions & Pain Analysis',
    ar: '7. الأدوية، الفحوصات الوقائية، أسئلة الطبيب وتحليل الآلام',
  },
  'Medikamentenplan, Einnahmetreue, Termine, offene Fragen & tägliches Schmerzprotokoll': {
    en: 'Medication plan, adherence, appointments, open questions & daily pain log',
    ar: 'خطة الأدوية، الالتزام بالتناول، المواعيد، الأسئلة المفتوحة وسجل الألم اليومي',
  },
  'Backup & Löschung': {
    en: 'Backup & Reset',
    ar: 'النسخ الاحتياطي والحذف',
  },
  'Wochen- & Monatsvergleich (Durchschnittswerte)': {
    en: 'Weekly & Monthly Comparison (Averages)',
    ar: 'مقارنة أسبوعية وشهرية (المتوسطات)',
  },
  'Gegenüberstellung deiner Messwerte für das Arztgespräch': {
    en: 'Comparison of your readings for your doctor consultation',
    ar: 'مقارنة قراءاتك لمناقشتها مع الطبيب',
  },
  'Kennzahl': { en: 'Metric', ar: 'المؤشر' },
  'Tendenz': { en: 'Trend', ar: 'الاتجاه' },
  'Stabil / Zielbereich': { en: 'Stable / Target range', ar: 'مستقر / ضمن المستهدف' },
  'Konstant': { en: 'Constant', ar: 'ثابت' },
  'Verbessert': { en: 'Improved', ar: 'تحسن' },
  'Mehr Bewegung': { en: 'More activity', ar: 'حركة أكثر' },
  'Weniger Bewegung': { en: 'Less activity', ar: 'حركة أقل' },
  'Übersicht aller Messungen · Wochen- & Monatsvergleich · PDF-Druck & CSV-Export': {
    en: 'Overview of all readings · Weekly & monthly comparison · PDF print & CSV export',
    ar: 'نظرة عامة على جميع القياسات · مقارنة أسبوعية وشهرية · طباعة PDF وتصدير CSV',
  },
  'CSV Export': { en: 'CSV Export', ar: 'تصدير CSV' },
  'Als PDF speichern': { en: 'Save as PDF', ar: 'حفظ كملف PDF' },
  'Bericht drucken': { en: 'Print report', ar: 'طباعة التقرير' },
  'Vergleich Wochen & Monaten': {
    en: 'Weekly & Monthly Comparison',
    ar: 'مقارنة الأسابيع والأشهر',
  },
  'Wochenvergleich': { en: 'Weekly Comparison', ar: 'مقارنة أسبوعية' },
  'Monatsvergleich': { en: 'Monthly Comparison', ar: 'مقارنة شهرية' },
  'Aktuelle Woche (7T)': { en: 'Current Week (7d)', ar: 'الأسبوع الحالي (7 أيام)' },
  'Vorwoche': { en: 'Previous Week', ar: 'الأسبوع السابق' },
  'Aktueller Monat (30T)': { en: 'Current Month (30d)', ar: 'الشهر الحالي (30 يوماً)' },
  'Vormonat': { en: 'Previous Month', ar: 'الشهر السابق' },
  'Schlafdiagnostik – Liniendiagramm': {
    en: 'Sleep Diagnostics – Line Chart',
    ar: 'تشخيص النوم – رسم بياني خطي',
  },
  'Schlafdauer (Std.) & Qualität im Verlauf': {
    en: 'Sleep duration (hrs) & quality over time',
    ar: 'مدة النوم (ساعات) والجودة عبر الوقت',
  },
  'Noch keine Schlafdiagnostik-Einträge in den letzten 3 Monaten vorhanden.': {
    en: 'No sleep diagnostic entries available in the last 3 months.',
    ar: 'لا توجد سجلات لتشخيص النوم في آخر 3 أشهر.',
  },
  'Wasser trinken – Balkendiagramm': {
    en: 'Water Intake – Bar Chart',
    ar: 'شرب الماء – رسم بياني شريطي',
  },
  'Schmerzen Liniendiagramm': {
    en: 'Pain Trend Line Chart',
    ar: 'الرسم البياني الخطي للآلام',
  },
  'Tägliche Analyse': {
    en: 'Daily Analysis',
    ar: 'التحليل اليومي',
  },
  'Kein (0)': { en: 'None (0)', ar: 'لا يوجد (0)' },
  'Kurz (1)': { en: 'Brief (1)', ar: 'قصير (1)' },
  'Leicht (2)': { en: 'Mild (2)', ar: 'خفيف (2)' },
  'Stark (3)': { en: 'Severe (3)', ar: 'شديد (3)' },
  'Stufe 0: Kein': { en: 'Level 0: None', ar: 'الدرجة 0: لا يوجد' },
  'Stufe 1: Kurz': { en: 'Level 1: Brief', ar: 'الدرجة 1: قصير' },
  'Stufe 2: Leicht': { en: 'Level 2: Mild', ar: 'الدرجة 2: خفيف' },
  'Stufe 3: Stark': { en: 'Level 3: Severe', ar: 'الدرجة 3: شديد' },
  'Noch keine Schmerzen-Einträge für die tägliche Analyse vorhanden.': {
    en: 'No pain entries available for daily analysis yet.',
    ar: 'لا توجد سجلات ألم للتحليل اليومي بعد.',
  },
  'Sport & Training Übersicht (Woche / Monat)': {
    en: 'Sport & Training Overview (Week / Month)',
    ar: 'نظرة عامة على الرياضة والتدريب (أسبوع / شهر)',
  },
  '🚴 Fahrrad – Gesamtstunden & Km': {
    en: '🚴 Cycling – Total Hours & km',
    ar: '🚴 الدراجة – إجمالي الساعات والكيلومترات',
  },
  'Fahrrad – Gesamtstunden & Km': {
    en: 'Cycling – Total Hours & km',
    ar: 'الدراجة – إجمالي الساعات والكيلومترات',
  },
  '🏃 Laufband – Gesamtstunden & Kalorien': {
    en: '🏃 Treadmill – Total Hours & Calories',
    ar: '🏃 جهاز المشي – إجمالي الساعات والسعرات',
  },
  'Laufband – Gesamtstunden & Kalorien': {
    en: 'Treadmill – Total Hours & Calories',
    ar: 'جهاز المشي – إجمالي الساعات والسعرات',
  },
  '👣 Gesamtschritte': {
    en: '👣 Total Steps',
    ar: '👣 إجمالي الخطوات',
  },
  'Gesamtschritte': {
    en: 'Total Steps',
    ar: 'إجمالي الخطوات',
  },
  'Woche / Monat': {
    en: 'Week / Month',
    ar: 'أسبوع / شهر',
  },
  'Pro Woche (7 Tage)': {
    en: 'Per Week (7 days)',
    ar: 'في الأسبوع (7 أيام)',
  },
  'Pro Monat (30 Tage)': {
    en: 'Per Month (30 days)',
    ar: 'في الشهر (30 يوماً)',
  },
  'Gesamtstunden:': {
    en: 'Total hours:',
    ar: 'إجمالي الساعات:',
  },
  'Strecke:': {
    en: 'Distance:',
    ar: 'المسافة:',
  },
  'Kalorien:': {
    en: 'Calories:',
    ar: 'السعرات الحرارية:',
  },
  'Gesamt:': {
    en: 'Total:',
    ar: 'الإجمالي:',
  },
  'Ø Tag:': {
    en: 'Daily Avg:',
    ar: 'متوسط اليوم:',
  },
  'Schritte': {
    en: 'steps',
    ar: 'خطوة',
  },

  // Common Buttons & Modals
  'Abbrechen': { en: 'Cancel', ar: 'إلغاء' },
  'Schließen': { en: 'Close', ar: 'إغلاق' },
  'Speichern': { en: 'Save', ar: 'حفظ' },
  'Bearbeiten': { en: 'Edit', ar: 'تعديل' },
};

// Ordered substring replacements for composite strings containing numbers, names, or dynamic counts
const SUBSTRING_REPLACEMENTS: Array<{
  de: string;
  en: string;
  ar: string;
}> = [
  // Long composite phrases first
  {
    de: 'Dein persönlicher Gesundheitsüberblick',
    en: 'Your personal health overview',
    ar: 'نظرة عامة على صحتك الشخصية',
  },
  {
    de: 'Übersicht aller Messungen · Wochen- & Monatsvergleich · PDF-Druck & CSV-Export',
    en: 'Overview of all readings · Weekly & monthly comparison · PDF print & CSV export',
    ar: 'نظرة عامة على جميع القياسات · مقارنة أسبوعية وشهرية · طباعة PDF وتصدير CSV',
  },
  {
    de: 'Übersicht aller Messungen · Wochen- & Monatsvergleich',
    en: 'Overview of all readings · Weekly & monthly comparison',
    ar: 'نظرة عامة على جميع القياسات · مقارنة أسبوعية وشهرية',
  },
  {
    de: 'Täglicher Einnahmeplan · Erinnerungen per Handy-Benachrichtigung · Vorratskontrolle & Folgerezepte',
    en: 'Daily intake schedule · Mobile notification reminders · Stock monitoring & refill prescriptions',
    ar: 'جدول التناول اليومي · تذكيرات عبر إشعارات الهاتف · مراقبة المخزون والوصفات الطبية',
  },
  {
    de: 'Tägliche Analyse von Schmerzstatus (Ja / Nein), Schmerzen Stufe (Stark, Leicht, Kurz) & Beschreibung',
    en: 'Daily analysis of pain status (Yes / No), pain intensity (Severe, Mild, Brief) & description',
    ar: 'التحليل اليومي لحالة الألم (نعم / لا)، درجة الألم (شديد، خفيف، قصير) والوصف',
  },
  {
    de: 'Schmerzen Liniendiagramm – Tägliche Analyse',
    en: 'Pain Trend Line Chart – Daily Analysis',
    ar: 'الرسم البياني الخطي للآلام – التحليل اليومي',
  },
  {
    de: 'Tägliche Analyse – Schmerzen Protokoll',
    en: 'Daily Analysis – Pain Log',
    ar: 'التحليل اليومي – سجل الآلام',
  },
  {
    de: 'Rot = Ja · Grün = Nein',
    en: 'Red = Yes · Green = No',
    ar: 'أحمر = نعم · أخضر = لا',
  },
  {
    de: 'Systolisch (oben) · Diastolisch (unten) · Puls in Schlägen pro Minute',
    en: 'Systolic (upper) · Diastolic (lower) · Pulse in beats per minute',
    ar: 'الانقباضي (الأعلى) · الانبساطي (الأدنى) · النبض (نبضة في الدقيقة)',
  },
  {
    de: 'Persönliche Blutzucker-Zielbereiche nach ärztlicher Vorgabe',
    en: 'Personal Blood Sugar Target Ranges (per medical advice)',
    ar: 'النطاقات المستهدفة الشخصية لسكر الدم حسب توجيهات الطبيب',
  },
  {
    de: 'Nüchternmessungen & Messungen nach den Mahlzeiten im Zeitverlauf',
    en: 'Fasting readings & post-meal readings over time',
    ar: 'قياسات الصيام والقياسات بعد الوجبات عبر الوقت',
  },
  {
    de: 'Keine Blutzucker-Einträge für diesen Zeitraum vorhanden.',
    en: 'No blood sugar entries available for this period.',
    ar: 'لا توجد سجلات لسكر الدم لهذه الفترة.',
  },
  {
    de: 'Keine Blutdruckmessungen für diesen Filter vorhanden.',
    en: 'No blood pressure readings available for this filter.',
    ar: 'لا توجد قياسات ضغط دم متاحة لهذا الفلتر.',
  },
  {
    de: 'Kontinuierliche Entwicklung in kg inklusive persönlichem Zielwert',
    en: 'Continuous trend in kg including personal target weight',
    ar: 'التطور المستمر بالكيلوغرام شاملاً الوزن الشخصي المستهدف',
  },
  {
    de: 'Gewichtsverlauf & Wunschgewicht-Ziellinie',
    en: 'Weight Trend & Target Weight Line',
    ar: 'مسار الوزن وخط الوزن المستهدف',
  },
  {
    de: 'Gewichtsverlauf & Wunschgewicht Ziellinie',
    en: 'Weight Trend & Target Weight Line',
    ar: 'مسار الوزن وخط الوزن المستهدف',
  },
  {
    de: 'Blutdruck- und Pulsverlauf',
    en: 'Blood Pressure & Pulse Trend',
    ar: 'مسار ضغط الدم والنبض',
  },
  {
    de: 'Gespeicherte Blutdruck- und Pulswerte',
    en: 'Saved Blood Pressure & Pulse Readings',
    ar: 'قراءات ضغط الدم والنبض المحفوظة',
  },
  {
    de: 'Blutzucker-Protokoll mit Mahlzeiten & Wohlbefinden',
    en: 'Blood Sugar Log with Meals & Wellbeing',
    ar: 'سجل سكر الدم مع الوجبات والحالة العامة',
  },
  {
    de: 'Größe & Body-Mass-Index (BMI)',
    en: 'Height & Body Mass Index (BMI)',
    ar: 'الطول ومؤشر كتلة الجسم (BMI)',
  },
  {
    de: 'Persönliches Wunschgewicht',
    en: 'Personal Target Weight',
    ar: 'الوزن الشخصي المستهدف',
  },
  {
    de: 'Schlafqualität auswählen (Mehrfachauswahl):',
    en: 'Select sleep quality (multiple choice):',
    ar: 'اختر جودة النوم (اختيار متعدد):',
  },
  {
    de: 'Blutsauerstoffgehalt in Prozent (%) · Grüner Zielkorridor: 95 % bis 100 %',
    en: 'Blood oxygen level in percent (%) · Green target range: 95% to 100%',
    ar: 'نسبة الأكسجين في الدم (%) · النطاق الأخضر المستهدف: 95% إلى 100%',
  },
  {
    de: 'Medical Compass erinnert dich zu diesen Uhrzeiten automatisch an ein Glas Wasser.',
    en: 'Medical Compass automatically reminds you to drink a glass of water at these times.',
    ar: 'يذكرك Medical Compass تلقائياً بشرب كوب من الماء في هذه الأوقات.',
  },
  {
    de: 'Notiere dir Fragen im Alltag sofort, damit beim Arzttermin nichts vergessen wird.',
    en: 'Write down questions in everyday life right away so nothing is forgotten during your doctor appointment.',
    ar: 'دوّن أسئلتك في الحياة اليومية فوراً حتى لا تنسى شيئاً في موعد الطبيب.',
  },
  {
    de: 'Max. 3 Monate (90 Tage) · Ältere Monate werden automatisch gelöscht',
    en: 'Max. 3 months (90 days) · Older months are deleted automatically',
    ar: 'بحد أقصى 3 أشهر (90 يوماً) · يتم حذف الأشهر الأقدم تلقائياً',
  },
  {
    de: 'Noch keine Schlafdiagnostik-Einträge in den letzten 3 Monaten vorhanden.',
    en: 'No sleep diagnostic entries available in the last 3 months.',
    ar: 'لا توجد سجلات لتشخيص النوم في آخر 3 أشهر.',
  },
  {
    de: 'Noch keine Schmerzen-Einträge für die tägliche Analyse vorhanden.',
    en: 'No pain entries available for daily analysis yet.',
    ar: 'لا توجد سجلات ألم للتحليل اليومي بعد.',
  },
  {
    de: 'Keine Einträge vorhanden — Protokollliste ist frei.',
    en: 'No entries available — log list is empty.',
    ar: 'لا توجد سجلات — قائمة السجل فارغة.',
  },
  {
    de: 'Tägliche Trinkmenge (ml) der letzten 7 Tage · Ziel:',
    en: 'Daily water intake (ml) for the last 7 days · Goal:',
    ar: 'كمية شرب الماء اليومية (مل) لآخر 7 أيام · الهدف:',
  },
  {
    de: 'Gespeicherte Trainings-Aktivitäten',
    en: 'Saved Training Activities',
    ar: 'أنشطة التدريب المحفوظة',
  },
  {
    de: 'Gespeicherte Schlafdiagnostik-Einträge',
    en: 'Saved Sleep Diagnostic Entries',
    ar: 'سجلات تشخيص النوم المحفوظة',
  },
  {
    de: 'Gespeicherte Schlafdiagnostik',
    en: 'Saved Sleep Diagnostics',
    ar: 'سجلات تشخيص النوم المحفوظة',
  },
  {
    de: 'Gespeicherte Schmerzen-Einträge',
    en: 'Saved Pain Entries',
    ar: 'سجلات الألم المحفوظة',
  },
  {
    de: 'Heutige Getränke-Einträge',
    en: "Today's Drink Entries",
    ar: 'سجلات المشروبات اليوم',
  },
  {
    de: 'Laufband – Aktivität eintragen',
    en: 'Treadmill – Log activity',
    ar: 'جهاز المشي – تسجيل نشاط',
  },
  {
    de: 'Fahrrad – Aktivität eintragen',
    en: 'Cycling – Log activity',
    ar: 'الدراجة – تسجيل نشاط',
  },
  {
    de: 'Gymnastik – Aktivität eintragen',
    en: 'Gymnastics – Log activity',
    ar: 'تمارين – تسجيل نشاط',
  },
  {
    de: 'Letzte gespeicherte Messungen',
    en: 'Recently Saved Readings',
    ar: 'آخر القراءات المحفوظة',
  },
  {
    de: 'Körperwerte & Messungen',
    en: 'Body Values & Readings',
    ar: 'المؤشرات الحيوية والقياسات',
  },
  {
    de: 'Gewicht & Körperwerte',
    en: 'Weight & Body Values',
    ar: 'الوزن وقياسات الجسم',
  },
  {
    de: 'Vorsorge & Laborwerte',
    en: 'Checkups & Lab Values',
    ar: 'الفحوصات والتحاليل',
  },
  {
    de: 'Aktuelle Sauerstoffsättigung',
    en: 'Current Oxygen Saturation',
    ar: 'تشبع الأكسجين الحالي',
  },
  {
    de: '+ Sauerstoffsättigung eintragen',
    en: '+ Log oxygen saturation',
    ar: '+ تسجيل تشبع الأكسجين',
  },
  {
    de: 'Sauerstoffsättigung im Verlauf',
    en: 'Oxygen Saturation Over Time',
    ar: 'مسار تشبع الأكسجين',
  },
  {
    de: 'Messprotokoll Sauerstoffsättigung',
    en: 'Oxygen Saturation Log',
    ar: 'سجل قياس تشبع الأكسجين',
  },
  {
    de: 'Referenz- & Zielbereich',
    en: 'Reference & Target Range',
    ar: 'النطاق المرجعي والمستهدف',
  },
  {
    de: 'Nüchtern-Zielbereich:',
    en: 'Fasting target range:',
    ar: 'النطاق المستهدف صائماً:',
  },
  {
    de: 'Nüchtern-Zielbereich',
    en: 'Fasting target range',
    ar: 'النطاق المستهدف صائماً',
  },
  {
    de: 'Nach dem Essen (Postprandial):',
    en: 'After meal (postprandial):',
    ar: 'بعد الأكل (بعد الوجبة):',
  },
  {
    de: 'Puls bei letzter Messung:',
    en: 'Pulse at last reading:',
    ar: 'النبض في آخر قياس:',
  },
  {
    de: 'Puls bei letzter Messung',
    en: 'Pulse at last reading',
    ar: 'النبض في آخر قياس',
  },
  {
    de: 'Medikamenten-Protokoll',
    en: 'Medication Log',
    ar: 'سجل الأدوية',
  },
  {
    de: '+ Medikament hinzufügen',
    en: '+ Add medication',
    ar: '+ إضافة دواء',
  },
  {
    de: 'Medikament hinzufügen',
    en: 'Add Medication',
    ar: 'إضافة دواء',
  },
  {
    de: 'Einnahmehistorie',
    en: 'Intake History',
    ar: 'تاريخ التناول',
  },
  {
    de: '+Neu eintragen',
    en: '+ Add new',
    ar: '+ إضافة جديد',
  },
  {
    de: '+ Frage merken',
    en: '+ Save question',
    ar: '+ حفظ السؤال',
  },
  {
    de: '+Neu',
    en: '+ New',
    ar: '+ جديد',
  },
  {
    de: 'Blutzuckerverlauf',
    en: 'Blood Sugar Trend',
    ar: 'مسار سكر الدم',
  },
  {
    de: 'Blutzuckerwert',
    en: 'Blood Sugar Value',
    ar: 'قيمة سكر الدم',
  },
  {
    de: 'Ziel erreicht',
    en: 'Goal reached',
    ar: 'تم تحقيق الهدف',
  },
  {
    de: 'Wunschgewicht erreicht! Aktuell ',
    en: 'Target weight reached! Currently ',
    ar: 'تم تحقيق الوزن المستهدف! حالياً ',
  },
  {
    de: 'kg bis zum persönlichen Wunschgewicht.',
    en: 'kg to your personal target weight.',
    ar: 'كغ للوصول إلى وزنك الشخصي المستهدف.',
  },
  {
    de: 'Wunschgewicht:',
    en: 'Target weight:',
    ar: 'الوزن المستهدف:',
  },
  {
    de: 'Wunschgewicht',
    en: 'Target weight',
    ar: 'الوزن المستهدف',
  },
  {
    de: 'Körperzusammensetzung',
    en: 'Body composition',
    ar: 'تكوين الجسم',
  },
  {
    de: 'Körperwerte',
    en: 'Body values',
    ar: 'قياسات الجسم',
  },
  {
    de: 'Einstufung:',
    en: 'Classification:',
    ar: 'التصنيف:',
  },
  {
    de: 'Ausgewählt:',
    en: 'Selected:',
    ar: 'المحدد:',
  },
  {
    de: 'Veränderung:',
    en: 'Change:',
    ar: 'التغير:',
  },
  {
    de: 'kg seit Start',
    en: 'kg since start',
    ar: 'كغ منذ البداية',
  },
  {
    de: 'Status: Eingenommen um',
    en: 'Status: Taken at',
    ar: 'الحالة: تم التناول في',
  },
  {
    de: 'Status: Heute übersprungen',
    en: 'Status: Skipped today',
    ar: 'الحالة: تم التخطي اليوم',
  },
  {
    de: 'Status: Verschoben auf',
    en: 'Status: Postponed to',
    ar: 'الحالة: مؤجل إلى',
  },
  {
    de: 'Verschoben auf',
    en: 'Postponed to',
    ar: 'مؤجل إلى',
  },
  {
    de: 'Tage Vorrat (Rezept rechtzeitig anfordern)',
    en: 'days of stock left (request refill on time)',
    ar: 'أيام متبقية من المخزون (اطلب التجديد في الوقت المناسب)',
  },
  {
    de: 'Rezept-Erinnerung:',
    en: 'Prescription reminder:',
    ar: 'تذكير الوصفة:',
  },
  {
    de: 'Tablettenvorrat:',
    en: 'Tablet stock:',
    ar: 'مخزون الأقراص:',
  },
  {
    de: '(Niedriger Vorrat!)',
    en: '(Low stock!)',
    ar: '(مخزون منخفض!)',
  },
  {
    de: 'Rezept-/Arzthinweis:',
    en: 'Prescription / doctor note:',
    ar: 'ملاحظة الوصفة / الطبيب:',
  },
  {
    de: 'gespeicherten Messungen',
    en: 'saved readings',
    ar: 'قراءات محفوظة',
  },
  {
    de: 'Aus ',
    en: 'From ',
    ar: 'من ',
  },
  {
    de: 'unter ',
    en: 'below ',
    ar: 'أقل من ',
  },
  {
    de: 'noch ',
    en: 'still ',
    ar: 'متبقي ',
  },
  {
    de: '+ Uhrzeit hinzufügen',
    en: '+ Add reminder time',
    ar: '+ إضافة وقت تذكير',
  },
  {
    de: 'Uhrzeit hinzufügen',
    en: 'Add reminder time',
    ar: 'إضافة وقت تذكير',
  },
  {
    de: 'Pro Woche (7 Tage)',
    en: 'Per Week (7 days)',
    ar: 'في الأسبوع (7 أيام)',
  },
  {
    de: 'Pro Monat (30 Tage)',
    en: 'Per Month (30 days)',
    ar: 'في الشهر (30 يوماً)',
  },
  {
    de: 'Pro Woche',
    en: 'Per Week',
    ar: 'في الأسبوع',
  },
  {
    de: 'Pro Monat',
    en: 'Per Month',
    ar: 'في الشهر',
  },
  {
    de: 'Gesamtstunden:',
    en: 'Total hours:',
    ar: 'إجمالي الساعات:',
  },
  {
    de: 'Strecke:',
    en: 'Distance:',
    ar: 'المسافة:',
  },
  {
    de: 'Kalorien:',
    en: 'Calories:',
    ar: 'السعرات الحرارية:',
  },
  {
    de: 'Gesamt:',
    en: 'Total:',
    ar: 'الإجمالي:',
  },
  {
    de: 'Ø Tag:',
    en: 'Daily Avg:',
    ar: 'متوسط اليوم:',
  },
  {
    de: 'Ø Puls:',
    en: 'Avg Pulse:',
    ar: 'متوسط النبض:',
  },
  {
    de: 'Ø Blutdruck',
    en: 'Avg Blood Pressure',
    ar: 'متوسط ضغط الدم',
  },
  {
    de: 'Ø Blutzucker',
    en: 'Avg Blood Sugar',
    ar: 'متوسط سكر الدم',
  },
  {
    de: 'Summe:',
    en: 'Total:',
    ar: 'المجموع:',
  },
  {
    de: 'Kategorie:',
    en: 'Category:',
    ar: 'الفئة:',
  },
  {
    de: 'Essen:',
    en: 'Food:',
    ar: 'الطعام:',
  },
  {
    de: 'Zuletzt:',
    en: 'Last:',
    ar: 'آخر مرة:',
  },
  {
    de: 'Fällig:',
    en: 'Due:',
    ar: 'مستحق:',
  },
  {
    de: 'Antwort:',
    en: 'Answer:',
    ar: 'الإجابة:',
  },
  {
    de: 'Hinweis:',
    en: 'Note:',
    ar: 'ملاحظة:',
  },
  {
    de: 'Ort:',
    en: 'Location:',
    ar: 'الموقع:',
  },
  {
    de: 'Ja (',
    en: 'Yes (',
    ar: 'نعم (',
  },
  {
    de: 'Ja:',
    en: 'Yes:',
    ar: 'نعم:',
  },
  {
    de: 'Nein:',
    en: 'No:',
    ar: 'لا:',
  },
  {
    de: 'Einnahmen',
    en: 'intakes',
    ar: 'جرعات',
  },
  {
    de: 'Geplant um ',
    en: 'Scheduled at ',
    ar: 'مجدول في ',
  },
  {
    de: 'Verbleibender Vorrat:',
    en: 'Remaining stock:',
    ar: 'المخزون المتبقي:',
  },
  {
    de: 'Nachbestellung nötig:',
    en: 'Refill needed:',
    ar: 'يلزم إعادة الطلب:',
  },
  {
    de: 'Stück übrig',
    en: 'left',
    ar: 'متبقية',
  },
  {
    de: 'Stück',
    en: 'pcs',
    ar: 'حبة',
  },
  {
    de: 'erledigt',
    en: 'completed',
    ar: 'مكتمل',
  },
  {
    de: 'Min. aktiv',
    en: 'min active',
    ar: 'دقيقة نشطة',
  },
  {
    de: 'Heute (',
    en: 'Today (',
    ar: 'اليوم (',
  },
  {
    de: 'Gestern (',
    en: 'Yesterday (',
    ar: 'أمس (',
  },
  {
    de: 'Heute:',
    en: 'Today:',
    ar: 'اليوم:',
  },
  {
    de: 'Trink-Erinnerung aktiv',
    en: 'Hydration reminder active',
    ar: 'تذكير شرب الماء نشط',
  },
  {
    de: 'Nächste Trink-Erinnerung:',
    en: 'Next hydration reminder:',
    ar: 'تذكير شرب الماء القادم:',
  },
  {
    de: 'Heute bereits erreicht',
    en: 'Already reached today',
    ar: 'تم تحقيقه اليوم بالفعل',
  },
  {
    de: 'Morgen früh um',
    en: 'Tomorrow morning at',
    ar: 'غداً صباحاً الساعة',
  },
  {
    de: 'keine aktive Erinnerung',
    en: 'no active reminder',
    ar: 'لا يوجد تذكير نشط',
  },
  {
    de: 'Letzte Messung:',
    en: 'Last reading:',
    ar: 'آخر قياس:',
  },
  {
    de: 'Messwert:',
    en: 'Reading:',
    ar: 'القراءة:',
  },
  {
    de: 'Erstellt am',
    en: 'Created on',
    ar: 'تم الإنشاء في',
  },
  {
    de: 'Geburtsdatum:',
    en: 'Date of Birth:',
    ar: 'تاريخ الميلاد:',
  },
  {
    de: 'Geburtsjahr:',
    en: 'Birth Year:',
    ar: 'سنة الميلاد:',
  },
  {
    de: 'Körpergröße:',
    en: 'Height:',
    ar: 'الطول:',
  },
  {
    de: 'Krankenkasse:',
    en: 'Insurance:',
    ar: 'التأمين الصحي:',
  },
  {
    de: 'Vers.-Nr.:',
    en: 'Ins. No.:',
    ar: 'رقم التأمين:',
  },
  {
    de: 'Hausarzt:',
    en: 'Family Doctor:',
    ar: 'طبيب العائلة:',
  },
  {
    de: 'Zielgewicht:',
    en: 'Target weight:',
    ar: 'الوزن المستهدف:',
  },
  {
    de: 'Blutdruck:',
    en: 'Blood Pressure:',
    ar: 'ضغط الدم:',
  },
  {
    de: 'Blutzucker:',
    en: 'Blood Sugar:',
    ar: 'سكر الدم:',
  },
  {
    de: 'Gewicht:',
    en: 'Weight:',
    ar: 'الوزن:',
  },
  {
    de: 'Noch+',
    en: '+',
    ar: '+',
  },
  {
    de: 'bis Ziel',
    en: 'to goal',
    ar: 'إلى الهدف',
  },
  {
    de: 'Gesamtveränderung:',
    en: 'Total change:',
    ar: 'التغير الإجمالي:',
  },
  {
    de: 'Bauchumfang:',
    en: 'Waist:',
    ar: 'محيط الخصر:',
  },
  {
    de: 'Bauchumfang',
    en: 'Waist',
    ar: 'محيط الخصر',
  },
  {
    de: 'Körperfett:',
    en: 'Body fat:',
    ar: 'دهون الجسم:',
  },
  {
    de: 'Körperfett',
    en: 'Body fat',
    ar: 'دهون الجسم',
  },
  {
    de: 'KFA',
    en: 'BF',
    ar: 'دهون',
  },
  {
    de: 'Bewegung:',
    en: 'Exercise:',
    ar: 'الحركة:',
  },
  {
    de: 'Noch offen:',
    en: 'Still due:',
    ar: 'متبقي اليوم:',
  },
  {
    de: 'Guten Morgen,',
    en: 'Good morning,',
    ar: 'صباح الخير،',
  },
  {
    de: 'Guten Tag,',
    en: 'Good afternoon,',
    ar: 'طاب يومك،',
  },
  {
    de: 'Guten Abend,',
    en: 'Good evening,',
    ar: 'مساء الخير،',
  },
  {
    de: 'Guten Morgen',
    en: 'Good morning',
    ar: 'صباح الخير',
  },
  {
    de: 'Guten Tag',
    en: 'Good afternoon',
    ar: 'طاب يومك',
  },
  {
    de: 'Guten Abend',
    en: 'Good evening',
    ar: 'مساء الخير',
  },
  {
    de: 'Messungen im Verlauf',
    en: 'readings in history',
    ar: 'قراءات في السجل',
  },
  {
    de: 'offene Fragen',
    en: 'open questions',
    ar: 'أسئلة مفتوحة',
  },
  {
    de: 'Letzte Einträge',
    en: 'Recent entries',
    ar: 'آخر السجلات',
  },
  {
    de: 'Letzte 7 Einträge',
    en: 'Last 7 entries',
    ar: 'آخر 7 سجلات',
  },
  {
    de: 'Präparate',
    en: 'medications',
    ar: 'أدوية',
  },
  {
    de: 'Einträge',
    en: 'entries',
    ar: 'سجلات',
  },
  {
    de: 'Messungen',
    en: 'readings',
    ar: 'قراءات',
  },
  {
    de: 'eingenommen',
    en: 'taken',
    ar: 'تم التناول',
  },
  {
    de: 'Tabletten übrig',
    en: 'tablets left',
    ar: 'أقراص متبقية',
  },
  {
    de: 'Vorrat niedrig:',
    en: 'Low stock:',
    ar: 'المخزون منخفض:',
  },
  {
    de: 'Vorrat:',
    en: 'Stock:',
    ar: 'المخزون:',
  },
  {
    de: 'Tabletten',
    en: 'tablets',
    ar: 'أقراص',
  },
  {
    de: 'Min. Bewegung',
    en: 'min exercise',
    ar: 'دقيقة حركة',
  },
  {
    de: 'Min Bewegung',
    en: 'min exercise',
    ar: 'دقيقة حركة',
  },
  {
    de: 'Minuten',
    en: 'minutes',
    ar: 'دقيقة',
  },
  {
    de: 'Min.',
    en: 'min',
    ar: 'دقيقة',
  },
  {
    de: 'Stunden',
    en: 'hours',
    ar: 'ساعات',
  },
  {
    de: 'Std. Schlaf',
    en: 'hrs sleep',
    ar: 'ساعات نوم',
  },
  {
    de: 'Std.',
    en: 'hrs',
    ar: 'ساعة',
  },
  {
    de: 'Tage/Woche',
    en: 'days/week',
    ar: 'أيام/أسبوع',
  },
  {
    de: 'Tage',
    en: 'days',
    ar: 'أيام',
  },
  {
    de: 'Schritte',
    en: 'steps',
    ar: 'خطوة',
  },
  {
    de: 'Schläge/Min',
    en: 'bpm',
    ar: 'نبضة/دقيقة',
  },
  {
    de: 'Ziel:',
    en: 'Goal:',
    ar: 'الهدف:',
  },
  {
    de: 'Bauch:',
    en: 'Waist:',
    ar: 'الخصر:',
  },
  {
    de: 'Puls:',
    en: 'Pulse:',
    ar: 'النبض:',
  },
  {
    de: 'Puls ',
    en: 'Pulse ',
    ar: 'النبض ',
  },
  {
    de: 'offen',
    en: 'remaining',
    ar: 'متبقي',
  },
  {
    de: ' U/l',
    en: ' U/L',
    ar: ' وحدة/لتر',
  },
  {
    de: ' Uhr',
    en: '',
    ar: '',
  },
  {
    de: ' um ',
    en: ' at ',
    ar: ' في ',
  },
  {
    de: 'Jahre',
    en: 'years',
    ar: 'سنة',
  },
];

const DE_TO_ES: Record<string, string> = {
  '🔒 100 % lokale Datenspeicherung (DSGVO-konform)': '🔒 Almacenamiento 100 % local (conforme al RGPD)',
  'Kein Ersatz für ärztliche Diagnose (Notruf: 112)': 'No sustituye el diagnóstico médico (Emergencias: 112)',
  'Datenschutzerklärung, PIN-Schutz & Datenlöschung': 'Política de privacidad, protección PIN y borrado de datos',
  'Datenschutz & Sicherheit bei Medical Compass (DSGVO)': 'Privacidad y seguridad en Medical Compass (RGPD)',
  'Details & PIN': 'Detalles y PIN',
  'Verstanden & Zustimmen': 'Aceptar y continuar',
  'Wichtige Warnung: Bei vergessener PIN gehen alle Daten verloren!': '¡Advertencia importante: Si olvida su PIN, se perderán todos los datos!',
  '⚠️ Warnung: PIN vergessen = Verlust aller Daten': '⚠️ Advertencia: Olvidar el PIN = Pérdida de todos los datos',
  'PIN vergessen? Alle Daten löschen & App zurücksetzen…': '¿Olvidó su PIN? Borrar todos los datos y restablecer la app…',
  'Übersicht': 'Resumen',
  'Vitalwerte': 'Valores y Mediciones',
  'Medikamente': 'Medicamentos',
  'Vorsorge & Ärzte': 'Chequeos y Médicos',
  'Vorsorge': 'Chequeos',
  'Kalender': 'Calendario',
  'Arztbericht': 'Informe Médico',
  'Bericht': 'Informe',
  'Schnell-Eintrag': 'Entrada Rápida',
  'Profil': 'Perfil',
  'Guten Morgen': 'Buenos días',
  'Guten Tag': 'Buenas tardes',
  'Guten Abend': 'Buenas noches',
  'Dein persönlicher Gesundheitsüberblick': 'Tu resumen personal de salud',
  'Wert eintragen': 'Añadir medición',
  'Arztbericht / PDF': 'Informe Médico / PDF',
  'Blutdruck & Puls': 'Presión Arterial y Pulso',
  'Blutdruck': 'Presión Arterial',
  'Blutzucker': 'Glucosa en Sangre',
  'Gewicht': 'Peso',
  'Gewicht & BMI': 'Peso e IMC',
  'Gewicht & Körperwerte': 'Peso y Valores Corporales',
  'Körperwerte': 'Valores corporales',
  'Verlauf': 'Tendencia',
  'Zielbereich': 'Rango objetivo',
  'Messen': 'Medir',
  'Eintragen': 'Registrar',
  'Wiegen': 'Pesar',
  '+ Medikament hinzufügen': '+ Añadir medicamento',
  'Medikament hinzufügen': 'Añadir Medicamento',
  'Trinken & Bewegung': 'Hidratación y Ejercicio',
  'Trinkziel & Bewegung': 'Hidratación y Ejercicio',
  'Trinken/Sport': 'Agua/Deporte',
  'Noch keine Messung': 'Sin mediciones aún',
  'Noch keine Messungen': 'Sin mediciones aún',
  'Optimal': 'Óptimo',
  'Normal': 'Normal',
  'Hoch': 'Alto',
  'Hochnormal': 'Normal-alto',
  'Erhöht': 'Elevado',
  'Niedrig': 'Bajo',
  'Auffällig': 'Anormal',
  'Im Zielbereich': 'En rango objetivo',
  'Untergewicht': 'Bajo peso',
  'Normalgewicht': 'Peso normal',
  'Leichtes Übergewicht': 'Sobrepeso leve',
  'Adipositas': 'Obesidad',
  'Heutige Medikamente erinnerung': 'Recordatorios de Medicamentos de Hoy',
  'Heutige Medikamente': 'Medicamentos de Hoy',
  'Vorratsberechnung aktiv': 'Control de stock activo',
  'Eingenommen': 'Tomado',
  'Verschoben': 'Pospuesto',
  'Übersprungen': 'Omitido',
  'Später': 'Más tarde',
  'Auslassen': 'Omitir',
  'Jetzt einnehmen': 'Tomar ahora',
  'Letzte gespeicherte Messungen': 'Últimas Mediciones Guardadas',
  'Vollständige Tabellen': 'Tablas completas',
  'Details & Tabelle': 'Detalles y Tabla',
  'Systolisch': 'Sistólica',
  'Diastolisch': 'Diastólica',
  'Puls': 'Pulso',
  'Sauerstoffsättigung (SpO₂)': 'Saturación de Oxígeno (SpO₂)',
  'Sauerstoffsättigung': 'Saturación de Oxígeno',
  'Laborwerte': 'Resultados de Laboratorio',
  'Schlafdiagnostik': 'Diagnóstico del Sueño',
  'Schmerzen': 'Control del Dolor',
  'Tägliche Schmerzdokumentation & Verlauf': 'Registro diario del dolor y evolución',
  'Ja': 'Sí',
  'Nein': 'No',
  'Ja:': 'Sí:',
  'Nein:': 'No:',
  'Stark': 'Fuerte',
  'Leicht': 'Leve',
  'Kurz': 'Breve',
  'Datum': 'Fecha',
  'Uhrzeit': 'Hora',
  'Beschreibung': 'Descripción',
  'Stufe': 'Nivel',
  'Körperwerte & Messungen': 'Valores Corporales y Mediciones',
  '1. Blutdruck & Puls': '1. Presión Arterial y Pulso',
  '2. Blutzucker': '2. Glucosa en Sangre',
  '3. Gewicht & BMI': '3. Peso e IMC',
  '4. Trinken & Sport': '4. Hidratación y Deporte',
  '5. Sauerstoffsättigung': '5. Saturación de Oxígeno',
  '6. Laborwerte': '6. Laboratorio',
  'Woche': 'Semana',
  'Monat': 'Mes',
  'Jahr': 'Año',
  'Tag': 'Día',
  'Alle Zeiten': 'Todas las horas',
  'Morgens': 'Mañana',
  'Mittags': 'Mediodía',
  'Abends': 'Noche',
  '+ Messung eintragen': '+ Registrar medición',
  'Blutdruck- und Pulsverlauf': 'Evolución de Presión Arterial y Pulso',
  'Systolisch (oben) · Diastolisch (unten) · Puls in Schlägen pro Minute': 'Sistólica (alta) · Diastólica (baja) · Pulso en latidos por minuto',
  'Keine Blutdruckmessungen für diesen Filter vorhanden.': 'No hay mediciones de presión arterial para este filtro.',
  'Erste Blutdruckmessung eintragen': 'Registrar primera medición de presión arterial',
  'erste Blutdruckmessung eintragen': 'Registrar primera medición de presión arterial',
  'Gespeicherte Blutdruck- und Pulswerte': 'Mediciones Guardadas de Presión Arterial y Pulso',
  'Persönliche Blutzucker-Zielbereiche nach ärztlicher Vorgabe': 'Rangos Objetivo Personales de Glucosa (según indicación médica)',
  'Nüchtern-Zielbereich:': 'Rango objetivo en ayunas:',
  'Nach dem Essen (Postprandial):': 'Después de comer (posprandial):',
  'unter': 'menos de',
  '+Neu eintragen': '+ Añadir nuevo',
  'Blutzuckerverlauf (mg/dl)': 'Evolución de Glucosa (mg/dL)',
  'Blutzuckerverlauf': 'Evolución de Glucosa',
  'Nüchternmessungen & Messungen nach den Mahlzeiten im Zeitverlauf': 'Mediciones en ayunas y después de las comidas a lo largo del tiempo',
  'Keine Blutzucker-Einträge für diesen Zeitraum vorhanden.': 'No hay registros de glucosa para este período.',
  'Größe & Body-Mass-Index (BMI)': 'Altura e Índice de Masa Corporal (IMC)',
  'Einstufung:': 'Clasificación:',
  'Einstufung': 'Clasificación',
  'Persönliches Wunschgewicht': 'Peso Objetivo Personal',
  'Ziel erreicht': 'Objetivo alcanzado',
  'Körperzusammensetzung': 'Composición corporal',
  'Gewichtsverlauf & Wunschgewicht-Ziellinie': 'Evolución del Peso y Línea de Peso Objetivo',
  'Kontinuierliche Entwicklung in kg inklusive persönlichem Zielwert': 'Evolución continua en kg incluyendo el peso objetivo personal',
  'Heutiges Trinkziel & Flüssigkeitsbilanz': 'Objetivo de Hidratación y Balance de Líquidos de Hoy',
  'Wassermenge mit einem Klick eintragen': 'Registrar cantidad de agua con un clic',
  'Kleines Glas': 'Vaso pequeño',
  'Großes Glas': 'Vaso grande',
  'grosses Glas': 'Vaso grande',
  'Flasche': 'Botella',
  'Selbst': 'Personalizado',
  'Ziel': 'Objetivo',
  'Summe': 'Total',
  'Tägliche Bewegung & Schritte': 'Movimiento y Pasos Diarios',
  'Laufband': 'Cinta de correr',
  'Fahrrad': 'Bicicleta',
  'Gymnastik': 'Gimnasia',
  'Schlafqualität auswählen (Mehrfachauswahl):': 'Seleccionar calidad del sueño (selección múltiple):',
  'Gespeicherte Schlafdiagnostik': 'Diagnósticos del Sueño Guardados',
  '+ Sauerstoffsättigung eintragen': '+ Registrar saturación de oxígeno',
  'Aktuelle Sauerstoffsättigung': 'Saturación de Oxígeno Actual',
  'Durchschnitt': 'Promedio',
  'Referenz- & Zielbereich': 'Rango de Referencia y Objetivo',
  'Laborwerte & Befunde': 'Resultados de Laboratorio e Informes',
  '+Hinzufügen': '+ Añadir',
  '+ Hinzufügen': '+ Añadir',
  'Untersuchung': 'Análisis / Parámetro',
  'Resultat': 'Resultado',
  'Referenzwerte': 'Valores de Referencia',
  'Medikamenten-Protokoll': 'Registro de Medicamentos',
  'Heutiger Einnahmeplan': 'Plan de Tomas de Hoy',
  'Einnahmehistorie': 'Historial de Tomas',
  'Vorsorge & Laborwerte': 'Chequeos y Laboratorio',
  'Fragen-Liste für den Arzt': 'Lista de Preguntas para el Médico',
  'Notizen': 'Notas',
  '+Neu': '+ Nuevo',
  '+ Neu': '+ Nuevo',
  '+ Frage merken': '+ Guardar pregunta',
  'Zurück': 'Atrás',
  'Weiter': 'Siguiente',
  'Heute': 'Hoy',
  'Ausgewählt:': 'Seleccionado:',
  'Ausgewählt': 'Seleccionado',
  'Termine': 'Citas',
  'Gesundheitsbericht': 'Informe Médico',
  'Bericht drucken': 'Imprimir informe',
  'Als PDF speichern': 'Guardar como PDF',
  'Wochenvergleich': 'Comparación Semanal',
  'Monatsvergleich': 'Comparación Mensual',
  'Therapietreue': 'Adherencia',
  'Einnahmen': 'tomas',
  'Abbrechen': 'Cancelar',
  'Schließen': 'Cerrar',
  'Speichern': 'Guardar',
  'Bearbeiten': 'Editar',
  'Löschen': 'Eliminar',
};

const DE_TO_FR: Record<string, string> = {
  '🔒 100 % lokale Datenspeicherung (DSGVO-konform)': '🔒 Stockage 100 % local des données (conforme au RGPD)',
  'Kein Ersatz für ärztliche Diagnose (Notruf: 112)': 'Ne remplace pas un diagnostic médical (Urgences : 112)',
  'Datenschutzerklärung, PIN-Schutz & Datenlöschung': 'Politique de confidentialité, protection PIN et suppression des données',
  'Datenschutz & Sicherheit bei Medical Compass (DSGVO)': 'Confidentialité et sécurité dans Medical Compass (RGPD)',
  'Details & PIN': 'Détails & PIN',
  'Verstanden & Zustimmen': 'Accepter et continuer',
  'Wichtige Warnung: Bei vergessener PIN gehen alle Daten verloren!': 'Avertissement important : En cas d’oubli du code PIN, toutes les données seront perdues !',
  '⚠️ Warnung: PIN vergessen = Verlust aller Daten': '⚠️ Attention : Code PIN oublié = Perte de toutes les données',
  'PIN vergessen? Alle Daten löschen & App zurücksetzen…': 'Code PIN oublié ? Supprimer toutes les données et réinitialiser…',
  'Übersicht': 'Aperçu',
  'Vitalwerte': 'Valeurs & Mesures',
  'Medikamente': 'Médicaments',
  'Vorsorge & Ärzte': 'Bilans & Médecins',
  'Vorsorge': 'Bilans',
  'Kalender': 'Calendrier',
  'Arztbericht': 'Rapport Médical',
  'Bericht': 'Rapport',
  'Schnell-Eintrag': 'Saisie Rapide',
  'Profil': 'Profil',
  'Guten Morgen': 'Bonjour',
  'Guten Tag': 'Bon après-midi',
  'Guten Abend': 'Bonsoir',
  'Dein persönlicher Gesundheitsüberblick': 'Votre aperçu personnel de santé',
  'Wert eintragen': 'Ajouter une mesure',
  'Arztbericht / PDF': 'Rapport Médical / PDF',
  'Blutdruck & Puls': 'Tension Artérielle & Pouls',
  'Blutdruck': 'Tension Artérielle',
  'Blutzucker': 'Glycémie',
  'Gewicht': 'Poids',
  'Gewicht & BMI': 'Poids & IMC',
  'Gewicht & Körperwerte': 'Poids & Valeurs Corporelles',
  'Körperwerte': 'Valeurs corporelles',
  'Verlauf': 'Courbe',
  'Zielbereich': 'Plage cible',
  'Messen': 'Mesurer',
  'Eintragen': 'Saisir',
  'Wiegen': 'Peser',
  '+ Medikament hinzufügen': '+ Ajouter un médicament',
  'Medikament hinzufügen': 'Ajouter un Médicament',
  'Trinken & Bewegung': 'Hydratation & Activité',
  'Trinkziel & Bewegung': 'Hydratation & Activité',
  'Trinken/Sport': 'Eau/Sport',
  'Noch keine Messung': 'Aucune mesure',
  'Noch keine Messungen': 'Aucune mesure',
  'Optimal': 'Optimal',
  'Normal': 'Normal',
  'Hoch': 'Élevé',
  'Hochnormal': 'Normal-élevé',
  'Erhöht': 'Élevé',
  'Niedrig': 'Bas',
  'Auffällig': 'Anormal',
  'Im Zielbereich': 'Dans la cible',
  'Untergewicht': 'Insuffisance pondérale',
  'Normalgewicht': 'Poids normal',
  'Leichtes Übergewicht': 'Léger surpoids',
  'Adipositas': 'Obésité',
  'Heutige Medikamente erinnerung': 'Rappels de Médicaments d’Aujourd’hui',
  'Heutige Medikamente': 'Médicaments d’Aujourd’hui',
  'Vorratsberechnung aktiv': 'Suivi du stock actif',
  'Eingenommen': 'Pris',
  'Verschoben': 'Reporté',
  'Übersprungen': 'Ignoré',
  'Später': 'Plus tard',
  'Auslassen': 'Ignorer',
  'Jetzt einnehmen': 'Prendre maintenant',
  'Letzte gespeicherte Messungen': 'Dernières Mesures Enregistrées',
  'Vollständige Tabellen': 'Tableaux complets',
  'Details & Tabelle': 'Détails & Tableau',
  'Systolisch': 'Systolique',
  'Diastolisch': 'Diastolique',
  'Puls': 'Pouls',
  'Sauerstoffsättigung (SpO₂)': 'Saturation en Oxygène (SpO₂)',
  'Sauerstoffsättigung': 'Saturation en Oxygène',
  'Laborwerte': 'Résultats de Laboratoire',
  'Schlafdiagnostik': 'Diagnostic du Sommeil',
  'Schmerzen': 'Suivi de la Douleur',
  'Tägliche Schmerzdokumentation & Verlauf': 'Suivi quotidien de la douleur et évolution',
  'Ja': 'Oui',
  'Nein': 'Non',
  'Ja:': 'Oui :',
  'Nein:': 'Non :',
  'Stark': 'Forte',
  'Leicht': 'Légère',
  'Kurz': 'Brève',
  'Datum': 'Date',
  'Uhrzeit': 'Heure',
  'Beschreibung': 'Description',
  'Stufe': 'Niveau',
  'Körperwerte & Messungen': 'Valeurs Corporelles & Mesures',
  '1. Blutdruck & Puls': '1. Tension Artérielle & Pouls',
  '2. Blutzucker': '2. Glycémie',
  '3. Gewicht & BMI': '3. Poids & IMC',
  '4. Trinken & Sport': '4. Hydratation & Sport',
  '5. Sauerstoffsättigung': '5. Saturation en Oxygène',
  '6. Laborwerte': '6. Résultats Labo',
  'Woche': 'Semaine',
  'Monat': 'Mois',
  'Jahr': 'Année',
  'Tag': 'Jour',
  'Alle Zeiten': 'Toutes les heures',
  'Morgens': 'Matin',
  'Mittags': 'Midi',
  'Abends': 'Soir',
  '+ Messung eintragen': '+ Saisir une mesure',
  'Blutdruck- und Pulsverlauf': 'Courbe de Tension Artérielle et Pouls',
  'Systolisch (oben) · Diastolisch (unten) · Puls in Schlägen pro Minute': 'Systolique (haut) · Diastolique (bas) · Pouls en battements par minute',
  'Keine Blutdruckmessungen für diesen Filter vorhanden.': 'Aucune mesure de tension artérielle disponible pour ce filtre.',
  'Erste Blutdruckmessung eintragen': 'Saisir la première mesure de tension artérielle',
  'erste Blutdruckmessung eintragen': 'Saisir la première mesure de tension artérielle',
  'Gespeicherte Blutdruck- und Pulswerte': 'Mesures Enregistrées de Tension et Pouls',
  'Persönliche Blutzucker-Zielbereiche nach ärztlicher Vorgabe': 'Plages Cibles Personnelles de Glycémie (selon avis médical)',
  'Nüchtern-Zielbereich:': 'Plage cible à jeun :',
  'Nach dem Essen (Postprandial):': 'Après le repas (postprandial) :',
  'unter': 'inférieur à',
  '+Neu eintragen': '+ Ajouter',
  'Blutzuckerverlauf (mg/dl)': 'Courbe de Glycémie (mg/dL)',
  'Blutzuckerverlauf': 'Courbe de Glycémie',
  'Nüchternmessungen & Messungen nach den Mahlzeiten im Zeitverlauf': 'Mesures à jeun et après les repas au fil du temps',
  'Keine Blutzucker-Einträge für diesen Zeitraum vorhanden.': 'Aucune mesure de glycémie disponible pour cette période.',
  'Größe & Body-Mass-Index (BMI)': 'Taille & Indice de Masse Corporelle (IMC)',
  'Einstufung:': 'Classification :',
  'Einstufung': 'Classification',
  'Persönliches Wunschgewicht': 'Poids Cible Personnel',
  'Ziel erreicht': 'Objectif atteint',
  'Körperzusammensetzung': 'Composition corporelle',
  'Gewichtsverlauf & Wunschgewicht-Ziellinie': 'Courbe de Poids & Ligne d’Objectif',
  'Kontinuierliche Entwicklung in kg inklusive persönlichem Zielwert': 'Évolution continue en kg incluant le poids cible personnel',
  'Heutiges Trinkziel & Flüssigkeitsbilanz': 'Objectif d’Hydratation & Bilan Hydrique du Jour',
  'Wassermenge mit einem Klick eintragen': 'Enregistrer la quantité d’eau en un clic',
  'Kleines Glas': 'Petit verre',
  'Großes Glas': 'Grand verre',
  'grosses Glas': 'Grand verre',
  'Flasche': 'Bouteille',
  'Selbst': 'Personnalisé',
  'Ziel': 'Objectif',
  'Summe': 'Total',
  'Tägliche Bewegung & Schritte': 'Activité & Pas Quotidiens',
  'Laufband': 'Tapis de course',
  'Fahrrad': 'Vélo',
  'Gymnastik': 'Gymnastique',
  'Schlafqualität auswählen (Mehrfachauswahl):': 'Sélectionner la qualité du sommeil (choix multiple) :',
  'Gespeicherte Schlafdiagnostik': 'Diagnostics du Sommeil Enregistrés',
  '+ Sauerstoffsättigung eintragen': '+ Saisir la saturation en oxygène',
  'Aktuelle Sauerstoffsättigung': 'Saturation en Oxygène Actuelle',
  'Durchschnitt': 'Moyenne',
  'Referenz- & Zielbereich': 'Plage de Référence & Cible',
  'Laborwerte & Befunde': 'Résultats de Laboratoire & Bilans',
  '+Hinzufügen': '+ Ajouter',
  '+ Hinzufügen': '+ Ajouter',
  'Untersuchung': 'Analyse / Paramètre',
  'Resultat': 'Résultat',
  'Referenzwerte': 'Valeurs de Référence',
  'Medikamenten-Protokoll': 'Journal des Médicaments',
  'Heutiger Einnahmeplan': 'Programme de Prise du Jour',
  'Einnahmehistorie': 'Historique des Prises',
  'Vorsorge & Laborwerte': 'Bilans & Laboratoire',
  'Fragen-Liste für den Arzt': 'Liste de Questions pour le Médecin',
  'Notizen': 'Notes',
  '+Neu': '+ Nouveau',
  '+ Neu': '+ Nouveau',
  '+ Frage merken': '+ Noter la question',
  'Zurück': 'Précédent',
  'Weiter': 'Suivant',
  'Heute': 'Aujourd’hui',
  'Ausgewählt:': 'Sélectionné :',
  'Ausgewählt': 'Sélectionné',
  'Termine': 'Rendez-vous',
  'Gesundheitsbericht': 'Rapport Médical',
  'Bericht drucken': 'Imprimer le rapport',
  'Als PDF speichern': 'Enregistrer en PDF',
  'Wochenvergleich': 'Comparaison Hebdomadaire',
  'Monatsvergleich': 'Comparaison Mensuelle',
  'Therapietreue': 'Observance',
  'Einnahmen': 'prises',
  'Abbrechen': 'Annuler',
  'Schließen': 'Fermer',
  'Speichern': 'Enregistrer',
  'Bearbeiten': 'Modifier',
  'Löschen': 'Supprimer',
};

const EN_WORDS_TO_ES: Array<[RegExp, string]> = [
  [/\bBlood Pressure & Pulse\b/gi, 'Presión Arterial y Pulso'],
  [/\bBlood Pressure\b/gi, 'Presión Arterial'],
  [/\bBlood Sugar\b/gi, 'Glucosa en Sangre'],
  [/\bOxygen Saturation\b/gi, 'Saturación de Oxígeno'],
  [/\bSleep Diagnostics\b/gi, 'Diagnóstico del Sueño'],
  [/\bPain Tracker\b/gi, 'Control del Dolor'],
  [/\bBody Values & Readings\b/gi, 'Valores Corporales y Mediciones'],
  [/\bCheckups & Doctors\b/gi, 'Chequeos y Médicos'],
  [/\bMedical Report\b/gi, 'Informe Médico'],
  [/\bDoctor Appointment\b/gi, 'Cita Médica'],
  [/\bFamily Doctor\b/gi, 'Médico de Cabecera'],
  [/\bCardiology\b/gi, 'Cardiología'],
  [/\bDiabetology\b/gi, 'Diabetología'],
  [/\bGeneral\b/gi, 'General'],
  [/\bToday\b/g, 'Hoy'],
  [/\bYesterday\b/g, 'Ayer'],
  [/\bWeek\b/g, 'Semana'],
  [/\bMonth\b/g, 'Mes'],
  [/\bYear\b/g, 'Año'],
  [/\bDay\b/g, 'Día'],
  [/\bMorning\b/g, 'Mañana'],
  [/\bNoon\b/g, 'Mediodía'],
  [/\bEvening\b/g, 'Noche'],
  [/\bAverage\b/g, 'Promedio'],
  [/\bTarget range\b/gi, 'Rango objetivo'],
  [/\bGoal\b/g, 'Objetivo'],
  [/\bTotal\b/g, 'Total'],
  [/\bSaved\b/g, 'Guardados'],
  [/\breadings\b/g, 'mediciones'],
  [/\breading\b/g, 'medición'],
  [/\bentries\b/g, 'registros'],
  [/\bentry\b/g, 'registro'],
  [/\bsteps\b/g, 'pasos'],
  [/\btablets\b/g, 'comprimidos'],
  [/\bcompleted\b/g, 'completado'],
  [/\bremaining\b/g, 'pendiente'],
  [/\bhrs\b/g, 'h'],
  [/\bmin\b/g, 'min'],
  [/\bdays\b/g, 'días'],
  [/\byears\b/g, 'años'],
];

const EN_WORDS_TO_FR: Array<[RegExp, string]> = [
  [/\bBlood Pressure & Pulse\b/gi, 'Tension Artérielle & Pouls'],
  [/\bBlood Pressure\b/gi, 'Tension Artérielle'],
  [/\bBlood Sugar\b/gi, 'Glycémie'],
  [/\bOxygen Saturation\b/gi, 'Saturation en Oxygène'],
  [/\bSleep Diagnostics\b/gi, 'Diagnostic du Sommeil'],
  [/\bPain Tracker\b/gi, 'Suivi de la Douleur'],
  [/\bBody Values & Readings\b/gi, 'Valeurs Corporelles & Mesures'],
  [/\bCheckups & Doctors\b/gi, 'Bilans & Médecins'],
  [/\bMedical Report\b/gi, 'Rapport Médical'],
  [/\bDoctor Appointment\b/gi, 'Rendez-vous Médical'],
  [/\bFamily Doctor\b/gi, 'Médecin Traitant'],
  [/\bCardiology\b/gi, 'Cardiologie'],
  [/\bDiabetology\b/gi, 'Diabétologie'],
  [/\bGeneral\b/gi, 'Général'],
  [/\bToday\b/g, 'Aujourd’hui'],
  [/\bYesterday\b/g, 'Hier'],
  [/\bWeek\b/g, 'Semaine'],
  [/\bMonth\b/g, 'Mois'],
  [/\bYear\b/g, 'Année'],
  [/\bDay\b/g, 'Jour'],
  [/\bMorning\b/g, 'Matin'],
  [/\bNoon\b/g, 'Midi'],
  [/\bEvening\b/g, 'Soir'],
  [/\bAverage\b/g, 'Moyenne'],
  [/\bTarget range\b/gi, 'Plage cible'],
  [/\bGoal\b/g, 'Objectif'],
  [/\bTotal\b/g, 'Total'],
  [/\bSaved\b/g, 'Enregistrés'],
  [/\breadings\b/g, 'mesures'],
  [/\breading\b/g, 'mesure'],
  [/\bentries\b/g, 'entrées'],
  [/\bentry\b/g, 'entrée'],
  [/\bsteps\b/g, 'pas'],
  [/\btablets\b/g, 'comprimés'],
  [/\bcompleted\b/g, 'terminé'],
  [/\bremaining\b/g, 'restant'],
  [/\bhrs\b/g, 'h'],
  [/\bmin\b/g, 'min'],
  [/\bdays\b/g, 'jours'],
  [/\byears\b/g, 'ans'],
];

function resolveLocalizedPhrase(
  dePhrase: string,
  translations: TranslatedPhrase,
  lang: Exclude<AppLanguage, 'de'>
): string {
  if (lang === 'en') return translations.en;
  if (lang === 'ar') return translations.ar;
  if (lang === 'es') {
    if (translations.es) return translations.es;
    if (DE_TO_ES[dePhrase]) return DE_TO_ES[dePhrase];
    let esText = translations.en;
    for (const [pattern, rep] of EN_WORDS_TO_ES) {
      esText = esText.replace(pattern, rep);
    }
    return esText;
  }
  if (translations.fr) return translations.fr;
  if (DE_TO_FR[dePhrase]) return DE_TO_FR[dePhrase];
  let frText = translations.en;
  for (const [pattern, rep] of EN_WORDS_TO_FR) {
    frText = frText.replace(pattern, rep);
  }
  return frText;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildSafePhraseRegex(phrase: string): RegExp {
  const escaped = escapeRegExp(phrase);
  const startsWithWordChar = /^[A-Za-zÄÖÜäöüß0-9]/.test(phrase);
  const endsWithWordChar = /[A-Za-zÄÖÜäöüß0-9]$/.test(phrase);
  const prefix = startsWithWordChar ? '(?<![A-Za-zÄÖÜäöüß])' : '';
  const suffix = endsWithWordChar ? '(?![A-Za-zÄÖÜäöüß])' : '';
  return new RegExp(`${prefix}${escaped}${suffix}`, 'g');
}

// Pre-sort PHRASE_MAP keys by descending length and compile word-boundary regexes
// so shorter words like "Aktiv", "Sauerstoff", "Referenz", or "Uhr" NEVER split compound German words!
const SORTED_PHRASE_ENTRIES = Object.entries(PHRASE_MAP)
  .filter(([deKey]) => deKey.length >= 4)
  .sort((a, b) => b[0].length - a[0].length)
  .map(([dePhrase, translations]) => ({
    dePhrase,
    regex: buildSafePhraseRegex(dePhrase),
    translations,
  }));

const COMPILED_SUBSTRING_REPLACEMENTS = SUBSTRING_REPLACEMENTS.map((item) => ({
  ...item,
  regex: buildSafePhraseRegex(item.de),
}));

function translateTextValue(rawText: string, lang: AppLanguage): string {
  if (lang === 'de') return rawText;
  const trimmed = rawText.trim();
  if (!trimmed) return rawText;

  // 1. Exact phrase match
  const exact = PHRASE_MAP[trimmed];
  if (exact) {
    const leadingSpaces = rawText.match(/^\s*/)?.[0] ?? '';
    const trailingSpaces = rawText.match(/\s*$/)?.[0] ?? '';
    return `${leadingSpaces}${resolveLocalizedPhrase(trimmed, exact, lang)}${trailingSpaces}`;
  }

  // 1b. Exact phrase match when wrapped in punctuation or JSX separators (e.g. "Einnahmehistorie (", "— Körperwerte & Messungen", "Einstufung:")
  const wrapperMatch = rawText.match(/^([\s—–·•:()[\]/,+-]*)(.+?)([\s—–·•:()[\]/,+-]*)$/);
  if (wrapperMatch) {
    const [, leadingWrap, coreText, trailingWrap] = wrapperMatch;
    const coreExact = PHRASE_MAP[coreText];
    if (coreExact) {
      return `${leadingWrap}${resolveLocalizedPhrase(coreText, coreExact, lang)}${trailingWrap}`;
    }
  }

  // 2. Composite / dynamic text replacement using word-boundary-safe patterns
  let result = rawText;

  for (const item of COMPILED_SUBSTRING_REPLACEMENTS) {
    if (result.includes(item.de)) {
      result = result.replace(
        item.regex,
        resolveLocalizedPhrase(item.de, item, lang)
      );
    }
  }

  for (const entry of SORTED_PHRASE_ENTRIES) {
    if (result.includes(entry.dePhrase)) {
      result = result.replace(
        entry.regex,
        resolveLocalizedPhrase(entry.dePhrase, entry.translations, lang)
      );
    }
  }

  return result;
}

interface TextNodeTranslationRecord {
  baseDe: string;
  lastTranslated: string;
}

const textNodeRecords = new WeakMap<Text, TextNodeTranslationRecord>();
const attrRecords = new WeakMap<Element, Record<string, TextNodeTranslationRecord>>();

/**
 * Automatically translates all rendered text nodes and input attributes across the app
 * whenever the user switches between Deutsch ('de'), Englisch ('en'), and Arabisch ('ar').
 */
export function useAutoTranslateDOM(lang: AppLanguage) {
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    let isApplying = false;

    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textNode = node as Text;
        const parentTag = textNode.parentElement?.tagName;
        if (parentTag === 'SCRIPT' || parentTag === 'STYLE') return;

        const currentVal = textNode.nodeValue ?? '';
        let record = textNodeRecords.get(textNode);

        if (!record) {
          record = { baseDe: currentVal, lastTranslated: currentVal };
          textNodeRecords.set(textNode, record);
        } else if (currentVal !== record.lastTranslated && currentVal !== record.baseDe) {
          // React dynamically updated this text node (e.g. counter, tab, or status changed)
          record.baseDe = currentVal;
        }

        const nextVal = lang === 'de' ? record.baseDe : translateTextValue(record.baseDe, lang);
        record.lastTranslated = nextVal;

        if (textNode.nodeValue !== nextVal) {
          textNode.nodeValue = nextVal;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        let elAttrMap = attrRecords.get(el);
        if (!elAttrMap) {
          elAttrMap = {};
          attrRecords.set(el, elAttrMap);
        }

        for (const attrName of ['placeholder', 'title', 'aria-label']) {
          const currentAttr = el.getAttribute(attrName);
          if (currentAttr) {
            let rec = elAttrMap[attrName];
            if (!rec) {
              rec = { baseDe: currentAttr, lastTranslated: currentAttr };
              elAttrMap[attrName] = rec;
            } else if (currentAttr !== rec.lastTranslated && currentAttr !== rec.baseDe) {
              rec.baseDe = currentAttr;
            }
            const nextAttr = lang === 'de' ? rec.baseDe : translateTextValue(rec.baseDe, lang);
            rec.lastTranslated = nextAttr;
            if (currentAttr !== nextAttr) {
              el.setAttribute(attrName, nextAttr);
            }
          }
        }

        node.childNodes.forEach(processNode);
      }
    };

    const runTranslationPass = () => {
      if (isApplying) return;
      isApplying = true;
      try {
        processNode(root);
      } finally {
        isApplying = false;
      }
    };

    runTranslationPass();

    const observer = new MutationObserver(() => {
      runTranslationPass();
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [lang]);
}
