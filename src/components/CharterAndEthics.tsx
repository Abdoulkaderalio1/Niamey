import React from 'react';
import { ShieldCheck, HeartHandshake, EyeOff, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../types';

export const CharterAndEthics: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Fidélité aux valeurs islamiques et nigériennes</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif-islamic">
          Charte d'Éthique & Respect du Nikah
        </h1>
        <p className="text-stone-600 text-sm max-w-xl mx-auto leading-relaxed">
          « Et parmi Ses signes Il a créé de vous, pour vous, des épouses pour que vous viviez en tranquillité avec elles et Il a mis entre vous de l'affection et de la bonté. » (Sourate Ar-Rum, 21)
        </p>
      </div>

      {/* 4 Pillars of the Charter */}
      <div className="space-y-6">
        
        {/* Pillar 1 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Intention sincère (An-Niyyah) pour le mariage licite
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-13">
            Toute inscription sur « Le Chemin pour le Nikah » doit être animée par la recherche exclusive d'un mariage religieux honorable et durable. Notre plateforme n'est ni un réseau social de flirt, ni un lieu de rencontres éphémères. Tout comportement contraire entraîne la suppression immédiate et définitive.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Préservation de la Pudeur (Al-Hayaa) & Coordonnées Protégées
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-13">
            Les numéros de téléphone personnels et adresses de domicile ne sont jamais divulgués en public. Les photos requises doivent être sobres, décentes et conformes à l'éthique musulmane. L'administrateur veille scrupuleusement au respect de la dignité de chacun.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Implication du Tuteur Légal (Al-Wali)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-13">
            Selon la Sunnah prophétique et les coutumes nigériennes, le tuteur légal (père, frère aîné ou représentant légitime de la famille) est au cœur de la démarche pour la femme. Lors de la mise en relation, les coordonnées du tuteur sont prioritaires pour préserver le cadre licite.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Contrôle strict des fausses annonces & Bannissement
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-13">
            L'administrateur dispose du plein pouvoir de refuser, suspendre ou supprimer tout profil suspect, mensonger ou irrespectueux. Les frais de mise en contact payés par MyNita ou Amanata constituent également un filtre naturel garantissant le sérieux des candidats.
          </p>
        </div>
      </div>

      {/* Closing notice */}
      <div className="p-6 rounded-2xl bg-stone-100 border border-stone-300 text-center space-y-2">
        <p className="text-xs text-stone-600">
          Pour tout signalement ou question relative à l'éthique de la plateforme, écrivez directement à notre administration sur WhatsApp Business :
        </p>
        <p className="text-sm font-bold text-emerald-800 font-mono">
          {OFFICIAL_WHATSAPP_NUMBER}
        </p>
      </div>
    </div>
  );
};
