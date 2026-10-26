import React from 'react';
import { MapPin, Briefcase, Heart, Eye, Lock, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
  onOpenPhotos: (profile: Profile, initialPhotoIndex: number) => void;
  onOpenDetails: (profile: Profile) => void;
  onRequestContact: (profile: Profile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onOpenPhotos,
  onOpenDetails,
  onRequestContact,
}) => {
  const getMaritalStatusLabel = (status: string, gender: string) => {
    if (status === 'celibataire') return gender === 'femme' ? 'Célibataire' : 'Célibataire';
    if (status === 'divorce') return gender === 'femme' ? 'Divorcée' : 'Divorcé';
    if (status === 'veuf') return gender === 'femme' ? 'Veuve' : 'Veuf';
    return status;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      
      {/* 2-Photo Split / Showcase Touch Area */}
      <div className="relative bg-stone-100 group">
        <div className="grid grid-cols-2 gap-1 p-1 h-64 sm:h-72">
          {/* Photo 1 */}
          <div
            onClick={() => onOpenPhotos(profile, 0)}
            className="relative cursor-pointer overflow-hidden rounded-lg bg-stone-200 h-full"
            role="button"
            tabIndex={0}
            aria-label={`Agrandir la photo 1 de ${profile.pseudonym}`}
            onKeyDown={(e) => e.key === 'Enter' && onOpenPhotos(profile, 0)}
          >
            <img
              src={profile.photos[0]}
              alt={`Photo 1 de ${profile.pseudonym}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-stone-900/70 text-white text-[10px] font-medium backdrop-blur-xs">
              Photo 1
            </span>
          </div>

          {/* Photo 2 */}
          <div
            onClick={() => onOpenPhotos(profile, 1)}
            className="relative cursor-pointer overflow-hidden rounded-lg bg-stone-200 h-full"
            role="button"
            tabIndex={0}
            aria-label={`Agrandir la photo 2 de ${profile.pseudonym}`}
            onKeyDown={(e) => e.key === 'Enter' && onOpenPhotos(profile, 1)}
          >
            <img
              src={profile.photos[1]}
              alt={`Photo 2 de ${profile.pseudonym}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-stone-900/70 text-white text-[10px] font-medium backdrop-blur-xs">
              Photo 2
            </span>
          </div>
        </div>

        {/* Mobile tap badge to open full screen photo viewer */}
        <button
          onClick={() => onOpenPhotos(profile, 0)}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-950/80 hover:bg-stone-900 text-white text-xs font-medium backdrop-blur-xs shadow-sm transition-transform active:scale-95"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Agrandir photos</span>
        </button>

        {/* City tag on photo */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-stone-900 text-xs font-semibold backdrop-blur-xs shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>{profile.city}</span>
        </div>
      </div>

      {/* Profile Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title & Metadata (Clean zero-pill layout with dot separators) */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-stone-900 truncate">
              {profile.pseudonym}
            </h3>
            <span className="text-base font-semibold text-emerald-700 tabular-nums shrink-0">
              {profile.age} ans
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
            <span>{getMaritalStatusLabel(profile.maritalStatus, profile.gender)}</span>
            <span aria-hidden="true">·</span>
            <span>Cherche {profile.lookingFor === 'femme' ? 'une femme' : 'un homme'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Validé</span>
          </div>

          {/* Profession */}
          <div className="flex items-center gap-1.5 text-xs text-stone-700 mt-2 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{profile.profession}</span>
          </div>

          {/* Presentation snippet */}
          <p className="text-sm text-stone-600 line-clamp-3 mt-3 leading-relaxed">
            {profile.presentation}
          </p>
        </div>

        {/* Strict Modesty & Protected Contact Notice */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 bg-stone-50/70 p-2.5 rounded-lg">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[11px] leading-tight">
              Numéro personnel confidentiel
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-mono">
            ID: {profile.id.replace('nikah-p-', '#')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onOpenDetails(profile)}
            className="w-full py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Voir profil</span>
          </button>

          <button
            onClick={() => onRequestContact(profile)}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Mise en contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};
