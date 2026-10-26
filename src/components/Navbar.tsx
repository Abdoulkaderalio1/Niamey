import React, { useState } from 'react';
import { Menu, X, ShieldCheck, HeartHandshake, UserPlus, Lock } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../types';

interface NavbarProps {
  activeTab: 'profiles' | 'how-it-works' | 'charter' | 'gmail' | 'admin';
  setActiveTab: (tab: 'profiles' | 'how-it-works' | 'charter' | 'gmail' | 'admin') => void;
  onOpenRegister: () => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenRegister,
  pendingCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'profiles' | 'how-it-works' | 'charter' | 'gmail' | 'admin') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single element Brand Wordmark */}
          <button
            onClick={() => handleNavClick('profiles')}
            className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-95 shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-inner font-serif-islamic text-xl">
              ن
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
                Le Chemin pour le Nikah
              </span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wide">
                Niger · Mariage Islamique
              </span>
            </div>
          </button>

          {/* Zone 2: Concise single-line navigation links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
            <button
              onClick={() => handleNavClick('profiles')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'profiles' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500' : ''
              }`}
            >
              Profils célibataires
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'how-it-works' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500' : ''
              }`}
            >
              Comment ça marche
            </button>
            <button
              onClick={() => handleNavClick('charter')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'charter' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500' : ''
              }`}
            >
              Charte & Éthique
            </button>
            <button
              onClick={() => handleNavClick('gmail')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 ${
                activeTab === 'gmail' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500' : ''
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Gmail</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 ${
                activeTab === 'admin' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500' : ''
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Administration</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-stone-950 font-bold text-[10px] rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Primary CTA action (Register button) & mobile menu toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 active:scale-95 transition-all shadow-sm whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>S'inscrire</span>
            </button>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Ouvrir le menu mobile"
              className="md:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-800 bg-stone-900 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-3">
          <button
            onClick={() => handleNavClick('profiles')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'profiles' ? 'bg-emerald-900/40 text-emerald-300' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            Profils célibataires au Niger
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'how-it-works' ? 'bg-emerald-900/40 text-emerald-300' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            Comment ça marche (MyNita & Amanata)
          </button>
          <button
            onClick={() => handleNavClick('charter')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'charter' ? 'bg-emerald-900/40 text-emerald-300' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            Charte de pudeur & Rôle du Wali
          </button>
          <button
            onClick={() => handleNavClick('gmail')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'gmail' ? 'bg-emerald-900/40 text-emerald-300' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Messagerie Gmail</span>
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'admin' ? 'bg-emerald-900/40 text-emerald-300' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Tableau de bord Administrateur
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 bg-amber-500 text-stone-950 font-bold text-xs rounded-full">
                {pendingCount} en attente
              </span>
            )}
          </button>

          <div className="pt-2 border-t border-stone-800/80">
            <a
              href={`https://wa.me/22799614098?text=${encodeURIComponent("Salam Alaykoum, je vous contacte depuis la plateforme Le Chemin pour le Nikah.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-emerald-400 transition-colors"
            >
              <span>Contact Officiel WhatsApp : {OFFICIAL_WHATSAPP_NUMBER}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
