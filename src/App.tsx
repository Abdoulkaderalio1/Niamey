/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  getStoredProfiles, 
  saveStoredProfiles, 
  getStoredRequests, 
  saveStoredRequests 
} from './utils/storage';
import { 
  Profile, 
  ContactRequest, 
  NigerCity, 
  NIGER_CITIES, 
  OFFICIAL_WHATSAPP_NUMBER 
} from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProfileCard } from './components/ProfileCard';
import { ProfileDetailsModal } from './components/ProfileDetailsModal';
import { MobilePhotoViewerModal } from './components/MobilePhotoViewerModal';
import { RegistrationModal } from './components/RegistrationModal';
import { ContactPaymentModal } from './components/ContactPaymentModal';
import { AdminDashboard } from './components/AdminDashboard';
import { HowItWorks } from './components/HowItWorks';
import { CharterAndEthics } from './components/CharterAndEthics';
import { GmailManager } from './components/GmailManager';
import { Footer } from './components/Footer';
import { Filter, Search, RotateCcw, UserPlus, Heart, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  // Profiles and Contact Requests state (persisted in localStorage)
  const [profiles, setProfiles] = useState<Profile[]>(() => getStoredProfiles());
  const [requests, setRequests] = useState<ContactRequest[]>(() => getStoredRequests());

  // Save to storage whenever state changes
  useEffect(() => {
    saveStoredProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    saveStoredRequests(requests);
  }, [requests]);

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<'profiles' | 'how-it-works' | 'charter' | 'gmail' | 'admin'>('profiles');

  // Pre-filled data when navigating to Gmail from Admin
  const [gmailInitialData, setGmailInitialData] = useState<{
    recipient: string;
    subject: string;
    body: string;
  }>({
    recipient: '',
    subject: '',
    body: '',
  });

  // Search & Filtering states for Public Profiles
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedDetailsProfile, setSelectedDetailsProfile] = useState<Profile | null>(null);
  const [selectedContactProfile, setSelectedContactProfile] = useState<Profile | null>(null);

  // Mobile & Desktop Photo Viewer Lightbox state
  const [photoViewerState, setPhotoViewerState] = useState<{
    isOpen: boolean;
    photos: [string, string] | string[];
    candidateName: string;
    candidateCity: string;
    initialIndex: number;
  }>({
    isOpen: false,
    photos: [],
    candidateName: '',
    candidateCity: '',
    initialIndex: 0,
  });

  // Only approved profiles are shown to the public
  const publicProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Must be approved by administrator
      if (p.status !== 'approved') return false;

      // Filter by gender looking for
      if (selectedGender !== 'all' && p.gender !== selectedGender) return false;

      // Filter by city
      if (selectedCity !== 'all' && p.city !== selectedCity) return false;

      // Filter by marital status
      if (selectedMaritalStatus !== 'all' && p.maritalStatus !== selectedMaritalStatus) return false;

      // Filter by text search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesPseudo = p.pseudonym.toLowerCase().includes(query);
        const matchesCity = p.city.toLowerCase().includes(query);
        const matchesProfession = p.profession.toLowerCase().includes(query);
        const matchesPresentation = p.presentation.toLowerCase().includes(query);
        if (!matchesPseudo && !matchesCity && !matchesProfession && !matchesPresentation) {
          return false;
        }
      }

      return true;
    });
  }, [profiles, selectedGender, selectedCity, selectedMaritalStatus, searchQuery]);

  const pendingCount = useMemo(() => {
    return profiles.filter(p => p.status === 'pending').length;
  }, [profiles]);

  // Handlers for Photo Lightbox
  const handleOpenPhotos = (profile: Profile, initialIndex: number = 0) => {
    setPhotoViewerState({
      isOpen: true,
      photos: profile.photos,
      candidateName: profile.pseudonym,
      candidateCity: profile.city,
      initialIndex,
    });
  };

  const handleClosePhotos = () => {
    setPhotoViewerState((prev) => ({ ...prev, isOpen: false }));
  };

  // Handlers for Candidate Registration
  const handleSubmitNewProfile = (newProfileData: Omit<Profile, 'id' | 'status' | 'submissionDate'>) => {
    const newProfile: Profile = {
      ...newProfileData,
      id: `nikah-p-${Date.now().toString().slice(-6)}`,
      status: 'pending', // "Le profil reste en attente" as required
      submissionDate: new Date().toISOString().split('T')[0],
      adminNotes: 'Nouveau profil soumis en ligne. En attente de validation par l\'administrateur.',
    };

    setProfiles((prev) => [newProfile, ...prev]);
  };

  // Handlers for Admin actions
  const handleUpdateProfile = (updatedProfile: Profile) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
  };

  const handleDeleteProfile = (profileId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce profil ?')) {
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    }
  };

  const handleUpdateProfileStatus = (
    profileId: string, 
    status: Profile['status'], 
    notes?: string
  ) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return {
            ...p,
            status,
            adminNotes: notes || p.adminNotes,
            isSuspicious: status === 'blocked',
            suspiciousReason: status === 'blocked' ? (notes || 'Profil suspect ou fausse annonce') : undefined,
          };
        }
        return p;
      })
    );
  };

  // Handlers for Contact Requests
  const handleSubmitContactRequest = (requestData: Omit<ContactRequest, 'id' | 'createdAt'>) => {
    const newRequest: ContactRequest = {
      ...requestData,
      id: `req-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setRequests((prev) => [newRequest, ...prev]);
  };

  const handleUpdateRequestStatus = (
    requestId: string, 
    status: ContactRequest['status'], 
    adminComment?: string
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status,
            adminComment: adminComment || r.adminComment,
            authorizedAt: status === 'contact_authorized' 
              ? new Date().toLocaleString('fr-FR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : r.authorizedAt,
          };
        }
        return r;
      })
    );
  };

  const resetFilters = () => {
    setSelectedGender('all');
    setSelectedCity('all');
    setSelectedMaritalStatus('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800">
      
      {/* Top Navbar adhering to Top Bar contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegister={() => setIsRegisterOpen(true)}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: PUBLIC PROFILES DIRECTORY */}
        {activeTab === 'profiles' && (
          <div className="space-y-10 pb-16">
            
            {/* Hero Section */}
            <HeroSection
              onRegisterClick={() => setIsRegisterOpen(true)}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              totalValidatedCount={profiles.filter(p => p.status === 'approved').length}
            />

            {/* Public Directory Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              
              {/* Directory Filter Bar */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Text Search */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par prénom, ville, profession ou mots clés..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Filter Dropdowns (City & Marital status) */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">Toutes les villes</option>
                      {NIGER_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    <select
                      value={selectedMaritalStatus}
                      onChange={(e) => setSelectedMaritalStatus(e.target.value)}
                      className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">Toute situation</option>
                      <option value="celibataire">Célibataire</option>
                      <option value="divorce">Divorcé(e)</option>
                      <option value="veuf">Veuf / Veuve</option>
                    </select>

                    <button
                      onClick={resetFilters}
                      className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-500 text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Réinitialiser les filtres"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Réinitialiser</span>
                    </button>
                  </div>
                </div>

                {/* Filter info row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-800 tabular-nums">
                      {publicProfiles.length}
                    </span>
                    <span>profils validés disponibles</span>
                    {selectedGender !== 'all' && (
                      <span className="text-emerald-700 font-medium">· {selectedGender === 'femme' ? 'Sœurs' : 'Frères'} uniquement</span>
                    )}
                    {selectedCity !== 'all' && (
                      <span className="text-emerald-700 font-medium">· Ville : {selectedCity}</span>
                    )}
                  </div>

                  <span className="text-[11px] text-stone-400">
                    Cliquez sur les photos pour les ouvrir en plein écran sur votre téléphone
                  </span>
                </div>
              </div>

              {/* Profiles Grid */}
              {publicProfiles.length === 0 ? (
                <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 max-w-xl mx-auto my-8">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <Search className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif-islamic">
                    Aucun profil ne correspond à vos critères
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Essayez d'élargir votre recherche ou de sélectionner « Toutes les villes ».
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    Réinitialiser tous les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publicProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onOpenPhotos={handleOpenPhotos}
                      onOpenDetails={(p) => setSelectedDetailsProfile(p)}
                      onRequestContact={(p) => setSelectedContactProfile(p)}
                    />
                  ))}
                </div>
              )}

              {/* Islamic Matrimonial Advice Banner */}
              <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-stone-800">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                    Démarche Halal & Recommandée
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-islamic">
                    Vous souhaitez proposer votre profil pour le Nikah ?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                    Rejoignez les célibataires du Niger engagés dans une démarche sérieuse. Vos coordonnées restent protégées et vos 2 photos sont vérifiées avec bienveillance.
                  </p>
                </div>

                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-sm transition-all whitespace-nowrap shadow-lg shadow-emerald-950/40"
                >
                  Remplir mon formulaire d'inscription
                </button>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: HOW IT WORKS */}
        {activeTab === 'how-it-works' && (
          <HowItWorks onRegisterClick={() => setIsRegisterOpen(true)} />
        )}

        {/* VIEW 3: CHARTER & ETHICS */}
        {activeTab === 'charter' && (
          <CharterAndEthics />
        )}

        {/* VIEW 4: GMAIL WORKSPACE INTEGRATION */}
        {activeTab === 'gmail' && (
          <GmailManager
            initialRecipient={gmailInitialData.recipient}
            initialSubject={gmailInitialData.subject}
            initialBody={gmailInitialData.body}
          />
        )}

        {/* VIEW 5: PRIVATE ADMINISTRATOR DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard
            profiles={profiles}
            requests={requests}
            onUpdateProfile={handleUpdateProfile}
            onDeleteProfile={handleDeleteProfile}
            onUpdateProfileStatus={handleUpdateProfileStatus}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onOpenPhotos={handleOpenPhotos}
            onOpenGmailCompose={(recipient, subject, body) => {
              setGmailInitialData({ recipient, subject, body });
              setActiveTab('gmail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

      </main>

      {/* Footer */}
      <Footer onNavClick={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* MODAL 1: Registration with 2 mandatory photos */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmitProfile={handleSubmitNewProfile}
      />

      {/* MODAL 2: Full Profile Details */}
      <ProfileDetailsModal
        profile={selectedDetailsProfile}
        onClose={() => setSelectedDetailsProfile(null)}
        onOpenPhotos={handleOpenPhotos}
        onRequestContact={(p) => {
          setSelectedDetailsProfile(null);
          setSelectedContactProfile(p);
        }}
      />

      {/* MODAL 3: Paid Contact Request with MyNita / Amanata & WhatsApp proof */}
      <ContactPaymentModal
        profile={selectedContactProfile}
        isOpen={!!selectedContactProfile}
        onClose={() => setSelectedContactProfile(null)}
        onSubmitRequest={handleSubmitContactRequest}
      />

      {/* MODAL 4: Touch-friendly Mobile Photo Lightbox */}
      <MobilePhotoViewerModal
        isOpen={photoViewerState.isOpen}
        onClose={handleClosePhotos}
        photos={photoViewerState.photos}
        candidateName={photoViewerState.candidateName}
        candidateCity={photoViewerState.candidateCity}
        initialIndex={photoViewerState.initialIndex}
      />

    </div>
  );
}
