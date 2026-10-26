import React from 'react';
import { ShieldCheck, MessageCircle, Heart, Lock } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../types';

interface FooterProps {
  onNavClick: (tab: 'profiles' | 'how-it-works' | 'charter' | 'gmail' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-serif-islamic text-lg font-bold">
                ن
              </div>
              <span className="text-lg font-bold text-white font-serif-islamic">
                Le Chemin pour le Nikah
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-md leading-relaxed">
              Plateforme matrimoniale islamique dévouée à unir les cœurs croyants au Niger dans le respect de la charia, de la pudeur et des traditions familiales. Profils vérifiés avec 2 photos obligatoires et coordination administrative.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Paiements vérifiés par MyNita & Amanata</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavClick('profiles')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Profils célibataires au Niger
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('how-it-works')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Comment ça marche (MyNita & Amanata)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('charter')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Charte d'Éthique & Rôle du Wali
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('gmail')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>Messagerie Gmail</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('admin')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-stone-400"
                >
                  <Lock className="w-3 h-3 text-stone-500" />
                  <span>Espace Administrateur privé</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Official Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Contact Officiel
            </h3>
            <p className="text-xs text-stone-400">
              Pour préserver la sérénité et la vie privée, utilisez exclusivement notre numéro Business vérifié :
            </p>
            <a
              href={`https://wa.me/22799614098?text=${encodeURIComponent("Salam Alaykoum, je vous contacte au sujet de Le Chemin pour le Nikah.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-emerald-400 text-xs font-semibold border border-stone-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{OFFICIAL_WHATSAPP_NUMBER}</span>
            </a>
            <p className="text-[11px] text-stone-500">
              Villes couvertes : Niamey, Maradi, Zinder, Tahoua, Agadez, Dosso, Tillabéri, Diffa.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>© {new Date().getFullYear()} Le Chemin pour le Nikah · République du Niger. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            <span>Qu'Allah bénisse chaque union sincère.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
