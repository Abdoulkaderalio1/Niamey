import React from 'react';
import { ShieldCheck, MessageCircle, HeartHandshake, Eye, MapPin, CheckCircle2 } from 'lucide-react';
import { HERO_IMAGE } from '../data/seedProfiles';
import { OFFICIAL_WHATSAPP_NUMBER, NIGER_CITIES, NigerCity } from '../types';

interface HeroSectionProps {
  onRegisterClick: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  totalValidatedCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRegisterClick,
  selectedCity,
  setSelectedCity,
  selectedGender,
  setSelectedGender,
  totalValidatedCount,
}) => {
  return (
    <section className="relative bg-stone-900 text-white overflow-hidden border-b border-stone-800">
      {/* Background Image with carefully calibrated contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Architecture sahélienne et sérénité au Niger"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/85 to-stone-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Hero Copy (Col 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Plateforme matrimoniale islamique vérifiée au Niger</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-serif-islamic text-balance">
              Le Chemin vers un Foyer Musulman Béni au Niger
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Fondez votre mariage (Nikah) en toute quiétude. Profils vérifiés avec 2 photos obligatoires, respect strict de la pudeur (Hayaa), coordonnées protégées et mise en relation encadrée via MyNita et Amanata.
            </p>

            {/* Trust markers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-stone-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Validation par l'administrateur</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Photos décentes 100% vérifiées</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>MyNita & Amanata acceptés</span>
              </div>
            </div>

            {/* Official WhatsApp Business Protection Banner */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onRegisterClick}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-900/30 whitespace-nowrap"
              >
                Créer mon profil pour le Nikah
              </button>

              <a
                href={`https://wa.me/22799614098?text=${encodeURIComponent("Salam Alaykoum, j'ai une question concernant la plateforme Le Chemin pour le Nikah.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-stone-800/90 hover:bg-stone-750 text-stone-200 hover:text-white border border-stone-700 text-xs sm:text-sm font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Business officiel : {OFFICIAL_WHATSAPP_NUMBER}</span>
              </a>
            </div>
          </div>

          {/* Search & Filter Anchor Box (Col 8-12) */}
          <div className="lg:col-span-5">
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <span className="text-sm font-semibold text-white">Rechercher parmi les célibataires</span>
                <span className="text-xs text-emerald-400 font-medium">
                  {totalValidatedCount} profils validés
                </span>
              </div>

              {/* Gender selector */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Je recherche
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-stone-950 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setSelectedGender('all')}
                    className={`py-2 text-xs font-medium rounded-md transition-colors ${
                      selectedGender === 'all'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGender('femme')}
                    className={`py-2 text-xs font-medium rounded-md transition-colors ${
                      selectedGender === 'femme'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Une sœur
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGender('homme')}
                    className={`py-2 text-xs font-medium rounded-md transition-colors ${
                      selectedGender === 'homme'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Un frère
                  </button>
                </div>
              </div>

              {/* City selector */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Ville au Niger
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Toutes les villes du Niger</option>
                    {NIGER_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-stone-400 leading-normal">
                  Seuls les profils validés avec 2 photos décentes approuvées par l'administrateur sont répertoriés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
