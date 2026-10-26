import React, { useState } from 'react';
import { X, Upload, Camera, ShieldCheck, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { Profile, NigerCity, NIGER_CITIES, Gender, MaritalStatus } from '../types';
import { PORTRAIT_MAN_BOUBOU, PORTRAIT_WOMAN_HIJAB, PORTRAIT_ELDER_MAN } from '../data/seedProfiles';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProfile: (newProfile: Omit<Profile, 'id' | 'status' | 'submissionDate'>) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmitProfile,
}) => {
  const [pseudonym, setPseudonym] = useState('');
  const [age, setAge] = useState<number>(24);
  const [city, setCity] = useState<NigerCity>('Niamey');
  const [gender, setGender] = useState<Gender>('femme');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('celibataire');
  const [lookingFor, setLookingFor] = useState<Gender>('homme');
  const [profession, setProfession] = useState('');
  const [education, setEducation] = useState('');
  const [religionPractice, setReligionPractice] = useState('');
  const [presentation, setPresentation] = useState('');
  const [criteria, setCriteria] = useState('');
  
  // 2 Mandatory photos
  const [photo1, setPhoto1] = useState<string>(PORTRAIT_WOMAN_HIJAB);
  const [photo2, setPhoto2] = useState<string>(PORTRAIT_WOMAN_HIJAB);
  
  // Private contact for Admin only
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [waliContact, setWaliContact] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  // Submit state
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, photoIndex: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (photoIndex === 1) setPhoto1(reader.result);
          else setPhoto2(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickPreset = (presetGender: 'homme' | 'femme' | 'elder') => {
    if (presetGender === 'homme') {
      setPhoto1(PORTRAIT_MAN_BOUBOU);
      setPhoto2(PORTRAIT_MAN_BOUBOU);
    } else if (presetGender === 'femme') {
      setPhoto1(PORTRAIT_WOMAN_HIJAB);
      setPhoto2(PORTRAIT_WOMAN_HIJAB);
    } else {
      setPhoto1(PORTRAIT_ELDER_MAN);
      setPhoto2(PORTRAIT_ELDER_MAN);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!pseudonym.trim()) {
      setErrorMsg('Veuillez renseigner un prénom ou pseudo.');
      return;
    }
    if (age < 18 || age > 85) {
      setErrorMsg('L\'âge doit être compris entre 18 et 85 ans.');
      return;
    }
    if (!presentation.trim() || presentation.trim().length < 25) {
      setErrorMsg('Veuillez fournir une présentation détaillée d\'au moins 25 caractères.');
      return;
    }
    if (!criteria.trim()) {
      setErrorMsg('Veuillez spécifier vos critères pour le futur conjoint.');
      return;
    }
    if (!photo1 || !photo2) {
      setErrorMsg('Les 2 photos sont strictement obligatoires pour garantir l\'authenticité.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Votre numéro de téléphone (confidentiel) est obligatoire pour l\'administrateur.');
      return;
    }

    onSubmitProfile({
      pseudonym: pseudonym.trim(),
      age: Number(age),
      city,
      gender,
      maritalStatus,
      lookingFor,
      profession: profession.trim() || 'Non renseigné',
      education: education.trim() || 'Enseignement secondaire / supérieur',
      religionPractice: religionPractice.trim() || 'Pratiquant(e) régulier(e)',
      presentation: presentation.trim(),
      criteria: criteria.trim(),
      photos: [photo1, photo2],
      contactInfo: {
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        waliContact: waliContact.trim() || 'Non renseigné',
        neighborhood: neighborhood.trim() || city,
      },
    });

    setIsSuccess(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-stone-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-emerald-950 text-white">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-serif-islamic text-white">
              Inscription · Le Chemin pour le Nikah
            </h2>
            <p className="text-xs text-emerald-300">
              Formulaire sérieux · Validation obligatoire par l'administrateur
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold text-stone-900 font-serif-islamic">
              Profil soumis avec succès !
            </h3>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm text-left space-y-2">
              <p className="font-semibold flex items-center gap-1.5 text-amber-950">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                Statut : En attente de validation par l'administrateur
              </p>
              <p className="text-amber-800">
                Conformément à nos règles de sécurité et de respect de la charte islamique, votre profil ainsi que vos 2 photos vont être vérifiés par l'administrateur avant toute mise en ligne publique.
              </p>
              <p className="text-amber-800">
                Vos coordonnées personnelles (téléphone et wali) restent <strong>strictement confidentielles</strong> et ne seront jamais affichées publiquement.
              </p>
            </div>

            <p className="text-xs text-stone-500">
              Vous pouvez suivre l'avancée ou contacter l'administration directement sur WhatsApp Business au <strong className="text-stone-800">+227 99 61 40 98</strong>.
            </p>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md"
              >
                Retour aux profils
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 border-b pb-1">
                1. Identité & État civil
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Prénom ou Pseudo *
                  </label>
                  <input
                    type="text"
                    required
                    value={pseudonym}
                    onChange={(e) => setPseudonym(e.target.value)}
                    placeholder="Ex: Ibrahim, Amina, Moussa..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Âge *
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="85"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ville au Niger *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as NigerCity)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {NIGER_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sexe *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => {
                      const g = e.target.value as Gender;
                      setGender(g);
                      setLookingFor(g === 'homme' ? 'femme' : 'homme');
                      handleQuickPreset(g === 'homme' ? 'homme' : 'femme');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="femme">Femme</option>
                    <option value="homme">Homme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Situation matrimoniale *
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="celibataire">Célibataire (Jamais marié)</option>
                    <option value="divorce">Divorcé(e)</option>
                    <option value="veuf">Veuf / Veuve</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Profession & Religious practice */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 border-b pb-1">
                2. Profession, Éducation & Pratique Religieuse
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Profession / Activité
                  </label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="Ex: Enseignant, Commerçant, Santé, Informatique..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Niveau d'études
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="Ex: Licence, Baccalauréat, Études religieuses..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pratique religieuse & Spiritualité
                </label>
                <input
                  type="text"
                  value={religionPractice}
                  onChange={(e) => setReligionPractice(e.target.value)}
                  placeholder="Ex: Prières assidues à la mosquée, port du voile/jilbab, récitation coranique..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Presentation and spousal criteria */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 border-b pb-1">
                3. Présentation & Critères pour le Nikah
              </h3>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Présentation personnelle * (Caractère, vision du couple, valeurs)
                </label>
                <textarea
                  rows={3}
                  required
                  value={presentation}
                  onChange={(e) => setPresentation(e.target.value)}
                  placeholder="Présentez-vous en quelques lignes avec sincérité et modestie..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Critères recherchés chez le futur conjoint *
                </label>
                <textarea
                  rows={2}
                  required
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  placeholder="Qualités humaines et religieuses que vous espérez trouver..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 2 Mandatory Photos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  4. Deux photos obligatoires (Portrait & Tenue Décente)
                </h3>
                <span className="text-xs text-emerald-700 font-semibold">Exigence stricte</span>
              </div>

              <p className="text-xs text-stone-600">
                Afin de garantir le sérieux et d'éviter les fausses annonces, 2 photos décentes sont requises. Elles seront inspectées par l'administrateur avant validation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo 1 */}
                <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                  <span className="text-xs font-semibold text-stone-800 block">
                    Photo 1 : Portrait sobre / visage décent
                  </span>
                  <div className="relative h-44 rounded-lg overflow-hidden bg-stone-200 border border-stone-300">
                    <img
                      src={photo1}
                      alt="Aperçu Photo 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Téléverser Photo 1</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 1)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Photo 2 */}
                <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                  <span className="text-xs font-semibold text-stone-800 block">
                    Photo 2 : Tenue décente traditionnelle / modeste
                  </span>
                  <div className="relative h-44 rounded-lg overflow-hidden bg-stone-200 border border-stone-300">
                    <img
                      src={photo2}
                      alt="Aperçu Photo 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Téléverser Photo 2</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 2)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Demo Photos Quick Selector for Testing */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-500">
                <span className="text-[11px]">Pour tester rapidement :</span>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('femme')}
                  className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs"
                >
                  Photos Sœur (Hijab)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('homme')}
                  className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs"
                >
                  Photos Frère (Boubou)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('elder')}
                  className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs"
                >
                  Photos Frère mûr
                </button>
              </div>
            </div>

            {/* Confidential contact info for Admin only */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  5. Coordonnées privées (Strictement confidentielles pour l'Admin)
                </h3>
                <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Jamais affiché publiquement
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Numéro de téléphone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +227 90 12 34 56"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact du Tuteur (Wali) ou référent familial
                  </label>
                  <input
                    type="text"
                    value={waliContact}
                    onChange={(e) => setWaliContact(e.target.value)}
                    placeholder="Ex: Père : El Hadj... (+227 96 ...)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Quartier / Précision de résidence
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Yantala, Koira Kano, Dan Zange, Birni..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Honor Commitment */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <p className="font-semibold">Engagement sur l'honneur (Niyyah) :</p>
              <p>
                Je certifie devant Allah que mon intention est exclusivement orientée vers le mariage licite (Nikah) et que toutes les informations et photos fournies sont authentiques.
              </p>
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-98"
              >
                Soumettre pour validation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
