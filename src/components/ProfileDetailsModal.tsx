import React from 'react';
import { X, MapPin, Briefcase, GraduationCap, Heart, ShieldCheck, Lock, Sparkles, BookOpen, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Profile } from '../types';

interface ProfileDetailsModalProps {
  profile: Profile | null;
  onClose: () => void;
  onOpenPhotos: (profile: Profile, initialPhotoIndex: number) => void;
  onRequestContact: (profile: Profile) => void;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  profile,
  onClose,
  onOpenPhotos,
  onRequestContact,
}) => {
  if (!profile) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-stone-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              Profil de {profile.pseudonym}
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              (ID: {profile.id.replace('nikah-p-', '#')})
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Photo Gallery Grid - Clickable for mobile full screen */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                2 photos obligatoires (Toucher pour agrandir en plein écran)
              </span>
              <button
                onClick={() => onOpenPhotos(profile, 0)}
                className="text-xs font-medium text-emerald-700 hover:underline flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Plein écran</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => onOpenPhotos(profile, 0)}
                className="relative h-56 sm:h-64 rounded-xl overflow-hidden cursor-pointer group bg-stone-100 border border-stone-200"
              >
                <img
                  src={profile.photos[0]}
                  alt={`Photo 1 de ${profile.pseudonym}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-stone-950/75 text-white text-xs font-medium">
                  Photo 1 (Portrait)
                </span>
              </div>

              <div
                onClick={() => onOpenPhotos(profile, 1)}
                className="relative h-56 sm:h-64 rounded-xl overflow-hidden cursor-pointer group bg-stone-100 border border-stone-200"
              >
                <img
                  src={profile.photos[1]}
                  alt={`Photo 2 de ${profile.pseudonym}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-stone-950/75 text-white text-xs font-medium">
                  Photo 2 (Tenue décente)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Key Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
            <div>
              <span className="text-stone-400 block">Âge</span>
              <span className="font-semibold text-stone-900 text-sm tabular-nums">{profile.age} ans</span>
            </div>
            <div>
              <span className="text-stone-400 block">Ville au Niger</span>
              <span className="font-semibold text-stone-900 text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {profile.city}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block">Situation</span>
              <span className="font-semibold text-stone-900 text-sm capitalize">
                {profile.maritalStatus === 'celibataire' ? 'Célibataire' : profile.maritalStatus}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block">Recherche</span>
              <span className="font-semibold text-stone-900 text-sm">
                {profile.lookingFor === 'femme' ? 'Une femme' : 'Un homme'}
              </span>
            </div>
          </div>

          {/* Profession & Education */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-500 uppercase">Activité & Profession</h4>
                <p className="text-sm font-medium text-stone-800">{profile.profession}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-500 uppercase">Niveau d'études & Enseignement</h4>
                <p className="text-sm font-medium text-stone-800">{profile.education}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-500 uppercase">Pratique religieuse & Spiritualité</h4>
                <p className="text-sm font-medium text-stone-800">{profile.religionPractice}</p>
              </div>
            </div>
          </div>

          {/* Presentation */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-stone-500 uppercase">Présentation personnelle</h4>
            <p className="text-sm text-stone-700 leading-relaxed bg-stone-50/70 p-4 rounded-xl border border-stone-200">
              {profile.presentation}
            </p>
          </div>

          {/* Spousal Criteria */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-stone-500 uppercase">Critères recherchés pour le Nikah</h4>
            <p className="text-sm text-stone-700 leading-relaxed bg-stone-50/70 p-4 rounded-xl border border-stone-200">
              {profile.criteria}
            </p>
          </div>

          {/* Protected Contact Policy Notice */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Protection stricte des coordonnées</p>
              <p className="text-amber-800 mt-0.5">
                Conformément aux préceptes de pudeur du Nikah, le numéro personnel et le contact du tuteur (Wali) ne sont jamais publics. Ils vous seront transmis de manière encadrée après vérification du paiement par MyNita ou Amanata.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer with Primary CTA */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors"
          >
            Fermer
          </button>

          <button
            onClick={() => {
              onClose();
              onRequestContact(profile);
            }}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Demander la mise en contact (3 000 FCFA)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
