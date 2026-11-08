import React, { useRef, useState, useEffect } from 'react';
import { User, Camera, Trash2, X, Globe, ShieldCheck } from 'lucide-react';
import { AppLanguage, UserHealthProfile } from '../types/health';
import { UI_LABELS } from '../utils/i18n';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserHealthProfile;
  onUpdateProfile: (updated: UserHealthProfile) => void;
  onOpenPrivacyModal?: () => void;
}

const deriveFirstAndLastName = (profile: UserHealthProfile) => {
  if (profile.firstName !== undefined || profile.lastName !== undefined) {
    return {
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
    };
  }
  const rawFull = (profile.fullName ?? '').trim();
  if (!rawFull) {
    return { firstName: '', lastName: '' };
  }
  const parts = rawFull.split(/\s+/);
  if (parts.length >= 2) {
    return {
      firstName: parts.slice(0, -1).join(' '),
      lastName: parts[parts.length - 1],
    };
  }
  return {
    firstName: parts[0] || '',
    lastName: '',
  };
};

const formatGermanDate = (isoDate: string) => {
  if (!isoDate) return '—';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return isoDate;
};

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenPrivacyModal,
}) => {
  const currentLang: AppLanguage =
    profile.language === 'en' ||
    profile.language === 'es' ||
    profile.language === 'fr' ||
    profile.language === 'ar'
      ? profile.language
      : 'de';
  const initialNames = deriveFirstAndLastName(profile);
  const initialBirthDate =
    profile.birthDate !== undefined
      ? profile.birthDate
      : profile.birthYear
      ? `${profile.birthYear}-05-15`
      : '';

  const [lastName, setLastName] = useState(initialNames.lastName);
  const [firstName, setFirstName] = useState(initialNames.firstName);
  const [birthDate, setBirthDate] = useState(initialBirthDate);
  const [email, setEmail] = useState(profile.email ?? '');
  const [healthInsurance, setHealthInsurance] = useState(
    profile.healthInsurance ?? ''
  );
  const [insuranceNumber, setInsuranceNumber] = useState(
    profile.insuranceNumber ?? ''
  );
  const [familyDoctor, setFamilyDoctor] = useState(
    profile.familyDoctor ?? profile.primaryDoctorName ?? ''
  );
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [language, setLanguage] = useState<AppLanguage>(currentLang);
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const names = deriveFirstAndLastName(profile);
      setLastName(names.lastName);
      setFirstName(names.firstName);
      setBirthDate(
        profile.birthDate !== undefined
          ? profile.birthDate
          : profile.birthYear
          ? `${profile.birthYear}-05-15`
          : ''
      );
      setEmail(profile.email ?? '');
      setHealthInsurance(profile.healthInsurance ?? '');
      setInsuranceNumber(profile.insuranceNumber ?? '');
      setFamilyDoctor(profile.familyDoctor ?? profile.primaryDoctorName ?? '');
      setAvatarUrl(profile.avatarUrl || '');
      setLanguage(
        profile.language === 'en' ||
          profile.language === 'es' ||
          profile.language === 'fr' ||
          profile.language === 'ar'
          ? profile.language
          : 'de'
      );
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const activeLabels = UI_LABELS[language];
  const combinedFullName =
    `${firstName.trim()} ${lastName.trim()}`.trim() || '—';

  const saveChanges = (
    nextAvatar = avatarUrl,
    nextLang = language,
    nextLastName = lastName,
    nextFirstName = firstName,
    nextBirthDate = birthDate,
    nextEmail = email,
    nextInsurance = healthInsurance,
    nextInsuranceNum = insuranceNumber,
    nextDoc = familyDoctor
  ) => {
    const cleanFirst = nextFirstName.trim();
    const cleanLast = nextLastName.trim();
    const cleanFull = `${cleanFirst} ${cleanLast}`.trim();
    const currentYear = new Date().getFullYear();
    const parsedYear = nextBirthDate
      ? parseInt(nextBirthDate.split('-')[0], 10) || 0
      : 0;
    const computedAge = parsedYear ? Math.max(0, currentYear - parsedYear) : 0;
    const cleanDoc = nextDoc.trim();

    onUpdateProfile({
      ...profile,
      fullName: cleanFull,
      lastName: cleanLast,
      firstName: cleanFirst,
      birthDate: nextBirthDate,
      birthYear: parsedYear,
      age: computedAge,
      email: nextEmail.trim(),
      healthInsurance: nextInsurance.trim(),
      insuranceNumber: nextInsuranceNum.trim(),
      familyDoctor: cleanDoc,
      primaryDoctorName: cleanDoc,
      avatarUrl: nextAvatar,
      language: nextLang,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        saveChanges(reader.result, language);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    saveChanges('', language);
  };

  const handleLanguageSelect = (newLang: AppLanguage) => {
    setLanguage(newLang);
    saveChanges(avatarUrl, newLang);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    saveChanges();
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end sm:p-4 p-2 bg-slate-900/30 backdrop-blur-[1px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-card-title"
    >
      {/* Compact Green "Profil Card" anchored below the top-right Profil icon */}
      <div
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
        className="mt-24 sm:mt-14 sm:mr-4 w-full max-w-sm rounded-2xl bg-emerald-50 border-2 border-emerald-800 shadow-2xl overflow-hidden"
      >
        {/* Card Header */}
        <div className="px-3 py-2 bg-emerald-100/80 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5" />
            </span>
            <h2
              id="profile-card-title"
              className="text-xs font-bold text-slate-900 tracking-tight"
            >
              {activeLabels.profileBtn}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  saveChanges();
                  setIsEditing(false);
                } else {
                  setIsEditing(true);
                }
              }}
              className="px-2.5 py-0.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-semibold transition-colors cursor-pointer"
            >
              {isEditing
                ? language === 'en'
                  ? 'Save'
                  : language === 'es'
                  ? 'Guardar'
                  : language === 'fr'
                  ? 'Enregistrer'
                  : language === 'ar'
                  ? 'حفظ'
                  : 'Speichern'
                : language === 'en'
                ? 'Edit'
                : language === 'es'
                ? 'Editar'
                : language === 'fr'
                ? 'Modifier'
                : language === 'ar'
                ? 'تعديل'
                : 'Bearbeiten'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-emerald-950 hover:bg-emerald-200/70 transition-colors cursor-pointer"
              aria-label="Schließen"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hidden File Input for Profil Bild */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* PROFIL INFO ROWS (with dark green dividers like the other cards) */}
        <form onSubmit={handleSaveForm} className="divide-y divide-emerald-800">
          {/* 1. Profil Bild + Compact Visitenkarte */}
          <div className="px-3 py-2.5 flex items-center gap-3 bg-emerald-50/90">
            <div className="relative shrink-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                title={activeLabels.uploadPhotoBtn}
                className="w-12 h-12 rounded-full border-2 border-emerald-800 bg-emerald-100 flex items-center justify-center overflow-hidden cursor-pointer shadow-xs"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={combinedFullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-emerald-800" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title={activeLabels.uploadPhotoBtn}
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white border border-white flex items-center justify-center shadow-xs cursor-pointer"
              >
                <Camera className="w-2.5 h-2.5" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                {activeLabels.profilePictureLabel}
              </p>
              <p className="text-xs font-bold text-slate-900 truncate">
                {combinedFullName}
              </p>
              <div className="flex flex-wrap items-center gap-1 mt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-0.5 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  {activeLabels.uploadPhotoBtn}
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    {activeLabels.removePhotoBtn}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. Name (Nachname) */}
          <div className="px-3 py-1.5 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-emerald-950 shrink-0 w-36">
              {activeLabels.nameLabel}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex-1 px-2 py-0.5 rounded-md border border-emerald-800 bg-white text-[11px] font-semibold text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            ) : (
              <span
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-semibold text-slate-900 text-right truncate cursor-pointer hover:underline"
              >
                {lastName || '—'}
              </span>
            )}
          </div>

          {/* 3. Vorname */}
          <div className="px-3 py-1.5 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-emerald-950 shrink-0 w-36">
              {activeLabels.firstNameLabel}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 px-2 py-0.5 rounded-md border border-emerald-800 bg-white text-[11px] font-semibold text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            ) : (
              <span
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-semibold text-slate-900 text-right truncate cursor-pointer hover:underline"
              >
                {firstName || '—'}
              </span>
            )}
          </div>

          {/* 4. Geburtsdatum (replaces Alt) */}
          <div className="px-3 py-1.5 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-emerald-950 shrink-0 w-36">
              {activeLabels.birthDateLabel}
            </span>
            {isEditing ? (
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="flex-1 px-2 py-0.5 rounded-md border border-emerald-800 bg-white text-[11px] font-semibold text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            ) : (
              <span
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-semibold text-slate-900 text-right cursor-pointer hover:underline"
              >
                {formatGermanDate(birthDate)}
              </span>
            )}
          </div>

          {/* 5. Email */}
          <div className="px-3 py-1.5 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-emerald-950 shrink-0 w-28">
              {activeLabels.emailLabel}
            </span>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-2 py-0.5 rounded-md border border-emerald-800 bg-white text-[11px] font-semibold text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            ) : (
              <span
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-semibold text-slate-900 text-right truncate cursor-pointer hover:underline"
              >
                {email || '—'}
              </span>
            )}
          </div>

          {/* 6. Krankenkasse */}
          <div className="px-3 py-1.5 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-emerald-950 shrink-0 w-36">
              {activeLabels.healthInsuranceLabel}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={healthInsurance}
                onChange={(e) => setHealthInsurance(e.target.value)}
                className="flex-1 px-2 py-0.5 rounded-md border border-emerald-800 bg-white text-[11px] font-semibold text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            ) : (
              <span
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-semibold text-slate-900 text-right truncate cursor-pointer hover:underline"
              >
                {healthInsurance || '—'}
              </span>
            )}
          </div>

          {/* 7. Versicherungsnummer */}
          <div className="px-3 py-1.5 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-emerald-950 shrink-0 w-36">
              {activeLabels.insuranceNumberLabel}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={insuranceNumber}
                onChange={(e) => setInsuranceNumber(e.target.value)}
                className="flex-1 px-2 py-0.5 rounded-md border border-emerald-800 bg-white text-[11px] font-semibold text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            ) : (
              <span
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-semibold text-slate-900 text-right truncate cursor-pointer hover:underline"
              >
                {insuranceNumber || '—'}
              </span>
            )}
          </div>

          {/* 8. Haus Arzt */}
          <div className="px-3 py-1.5 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-emerald-950 shrink-0 w-28">
              {activeLabels.familyDoctorLabel}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={familyDoctor}
                onChange={(e) => setFamilyDoctor(e.target.value)}
                className="flex-1 px-2 py-0.5 rounded-md border border-emerald-800 bg-white text-[11px] font-semibold text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            ) : (
              <span
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-semibold text-slate-900 text-right truncate cursor-pointer hover:underline"
              >
                {familyDoctor || '—'}
              </span>
            )}
          </div>

          {/* 9. Sprache: Compact space-saving dropdown list */}
          <div className="px-3 py-1.5 bg-emerald-100/60 flex items-center justify-between gap-2">
            <label
              htmlFor="profile-language-select"
              className="text-[11px] font-bold text-emerald-950 flex items-center gap-1 shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-800" />
              {activeLabels.languageSectionTitle}
            </label>
            <select
              id="profile-language-select"
              value={language}
              onChange={(e) => handleLanguageSelect(e.target.value as AppLanguage)}
              className="px-2.5 py-1 rounded-md border border-emerald-800 bg-white text-[11px] font-bold text-emerald-950 shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-800 cursor-pointer"
            >
              <option value="de">{activeLabels.langDe}</option>
              <option value="en">{activeLabels.langEn}</option>
              <option value="es">{activeLabels.langEs}</option>
              <option value="fr">{activeLabels.langFr}</option>
              <option value="ar">{activeLabels.langAr}</option>
            </select>
          </div>

          {/* 10. Datenschutz & App-Sicherheit (DSGVO / Play Store) */}
          {onOpenPrivacyModal && (
            <div className="px-3 py-2 bg-emerald-100/90 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Datenschutz & PIN</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPrivacyModal();
                }}
                className="px-2.5 py-0.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-bold transition-colors cursor-pointer"
              >
                DSGVO & Sicherheit öffnen
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
