import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  Eye, 
  Trash2, 
  Edit3, 
  Lock, 
  Unlock, 
  MessageCircle, 
  Check, 
  Search,
  Filter,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Phone,
  Settings,
  Mail
} from 'lucide-react';
import { 
  Profile, 
  ContactRequest, 
  OFFICIAL_WHATSAPP_NUMBER, 
  OFFICIAL_WHATSAPP_RAW, 
  NigerCity, 
  NIGER_CITIES,
  DEFAULT_CONTACT_FEE_FCFA
} from '../types';

interface AdminDashboardProps {
  profiles: Profile[];
  requests: ContactRequest[];
  onUpdateProfile: (updatedProfile: Profile) => void;
  onDeleteProfile: (profileId: string) => void;
  onUpdateProfileStatus: (profileId: string, status: Profile['status'], notes?: string) => void;
  onUpdateRequestStatus: (requestId: string, status: ContactRequest['status'], adminComment?: string) => void;
  onOpenPhotos: (profile: Profile, initialPhotoIndex: number) => void;
  onOpenGmailCompose?: (recipient: string, subject: string, body: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profiles,
  requests,
  onUpdateProfile,
  onDeleteProfile,
  onUpdateProfileStatus,
  onUpdateRequestStatus,
  onOpenPhotos,
  onOpenGmailCompose,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active admin tab
  const [activeAdminTab, setActiveAdminTab] = useState<'pending' | 'members' | 'requests' | 'suspicious' | 'stats'>('pending');

  // Search & Filters in admin
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  // Edit Profile modal state
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  // Authentication check
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '227nikah' || pinInput.trim() === '227') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Metrics computation
  const pendingProfiles = profiles.filter(p => p.status === 'pending');
  const approvedProfiles = profiles.filter(p => p.status === 'approved');
  const blockedProfiles = profiles.filter(p => p.status === 'blocked' || p.isSuspicious);
  const pendingRequests = requests.filter(r => r.status === 'pending_proof' || r.status === 'proof_sent');
  const authorizedRequests = requests.filter(r => r.status === 'contact_authorized' || r.status === 'payment_verified');
  const totalRevenue = authorizedRequests.reduce((acc, curr) => acc + (curr.amountFCFA || DEFAULT_CONTACT_FEE_FCFA), 0);

  // If not authenticated, show secure login prompt
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-serif-islamic">
              Accès Administration Privée
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Tableau de bord réservé à l'administrateur de « Le Chemin pour le Nikah »
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3 pt-2">
            <div>
              <input
                type="password"
                placeholder="Code secret admin (ex: 227nikah)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-center font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {pinError && (
                <p className="text-xs text-red-600 mt-1">Code incorrect. Code par défaut : 227nikah</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm transition-all"
            >
              Déverrouiller
            </button>

            <button
              type="button"
              onClick={() => {
                setPinInput('227nikah');
                setIsAuthenticated(true);
              }}
              className="text-xs text-stone-400 hover:text-emerald-700 underline block mx-auto"
            >
              Connexion rapide démo (227nikah)
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Top Header & Admin identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif-islamic">
              Tableau de Bord Administrateur
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              Connecté
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Modération des membres, contrôle des 2 photos obligatoires et gestion des paiements MyNita/Amanata.
          </p>
        </div>

        {/* WhatsApp Business contact reminder */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-stone-400 block">Contact WhatsApp Business officiel</span>
            <span className="text-xs font-bold text-emerald-800">{OFFICIAL_WHATSAPP_NUMBER}</span>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-600 hover:bg-stone-100 transition-colors"
          >
            Verrouiller
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">À valider</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {pendingProfiles.length}
          </p>
          <span className="text-[10px] text-stone-400">profils en attente</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">Membres validés</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-1 tabular-nums">
            {approvedProfiles.length}
          </p>
          <span className="text-[10px] text-stone-400">visibles en ligne</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">Demandes contact</span>
            <MessageCircle className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-1 tabular-nums">
            {requests.length}
          </p>
          <span className="text-[10px] text-amber-600">{pendingRequests.length} à vérifier</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">Frais collectés</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
            {totalRevenue.toLocaleString('fr-FR')} <span className="text-xs font-normal">FCFA</span>
          </p>
          <span className="text-[10px] text-stone-400">MyNita / Amanata</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">Suspects / Faux</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1 tabular-nums">
            {blockedProfiles.length}
          </p>
          <span className="text-[10px] text-stone-400">bloqués / écartés</span>
        </div>
      </div>

      {/* Navigation tabs in Admin */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-stone-200 overflow-x-auto pb-1 hide-scrollbar">
        <button
          onClick={() => setActiveAdminTab('pending')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-lg transition-colors flex items-center gap-2 ${
            activeAdminTab === 'pending'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Profils en attente</span>
          {pendingProfiles.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-stone-950 font-bold text-[10px] rounded-full">
              {pendingProfiles.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('members')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-lg transition-colors flex items-center gap-2 ${
            activeAdminTab === 'members'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tous les profils validés ({approvedProfiles.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('requests')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-lg transition-colors flex items-center gap-2 ${
            activeAdminTab === 'requests'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Paiements & Mises en contact ({requests.length})</span>
          {pendingRequests.length > 0 && (
            <span className="px-1.5 py-0.2 bg-emerald-500 text-white font-bold text-[10px] rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('suspicious')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-lg transition-colors flex items-center gap-2 ${
            activeAdminTab === 'suspicious'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Fausses annonces & Bloqués ({blockedProfiles.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('stats')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-lg transition-colors flex items-center gap-2 ${
            activeAdminTab === 'stats'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistiques & Bilan</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PROFILES IN PENDING VALIDATION */}
      {/* ========================================================================= */}
      {activeAdminTab === 'pending' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Profils à valider ({pendingProfiles.length})
              </h2>
              <p className="text-xs text-stone-500">
                Vérifiez la conformité des textes, la sincérité de la démarche et la décence des 2 photos obligatoires avant d'autoriser la mise en ligne.
              </p>
            </div>
          </div>

          {pendingProfiles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-semibold text-stone-900">Aucun profil en attente</h3>
              <p className="text-xs text-stone-500">
                Tous les profils ont été traités avec succès par l'administrateur.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProfiles.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-amber-200 p-5 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    {/* Left: 2 Photos preview with trigger to open full screen */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div
                        onClick={() => onOpenPhotos(p, 0)}
                        className="relative w-24 h-28 rounded-xl overflow-hidden cursor-pointer group bg-stone-100 border border-stone-300"
                        title="Toucher pour ouvrir en grand"
                      >
                        <img
                          src={p.photos[0]}
                          alt="Photo 1"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 inset-x-1 text-center bg-stone-900/80 text-white text-[9px] py-0.5 rounded">
                          Photo 1
                        </span>
                      </div>

                      <div
                        onClick={() => onOpenPhotos(p, 1)}
                        className="relative w-24 h-28 rounded-xl overflow-hidden cursor-pointer group bg-stone-100 border border-stone-300"
                        title="Toucher pour ouvrir en grand"
                      >
                        <img
                          src={p.photos[1]}
                          alt="Photo 2"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 inset-x-1 text-center bg-stone-900/80 text-white text-[9px] py-0.5 rounded">
                          Photo 2
                        </span>
                      </div>
                    </div>

                    {/* Middle: Candidate info and presentation */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-bold text-stone-900">{p.pseudonym}</span>
                        <span className="text-xs text-stone-500 font-semibold">{p.age} ans · {p.city}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
                          En attente de validation
                        </span>
                        <span className="text-xs text-stone-400">Soumis le {p.submissionDate}</span>
                      </div>

                      <p className="text-xs text-stone-600">
                        <strong>Profession :</strong> {p.profession} · <strong>Pratique :</strong> {p.religionPractice}
                      </p>

                      <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <strong>Présentation :</strong> {p.presentation}
                      </p>

                      <p className="text-xs text-stone-600">
                        <strong>Critères recherchés :</strong> {p.criteria}
                      </p>

                      {/* Confidential details for admin only */}
                      <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-950 flex flex-wrap items-center gap-3">
                        <span className="font-semibold">Coordonnées privées :</span>
                        <span>Tél/WhatsApp : <strong>{p.contactInfo.phone}</strong></span>
                        {p.contactInfo.waliContact && (
                          <span>Tuteur/Wali : <strong>{p.contactInfo.waliContact}</strong></span>
                        )}
                        {p.contactInfo.neighborhood && (
                          <span>Quartier : <strong>{p.contactInfo.neighborhood}</strong></span>
                        )}
                      </div>
                    </div>

                    {/* Right: Validation & Moderation action buttons */}
                    <div className="flex md:flex-col gap-2 shrink-0 justify-end">
                      <button
                        onClick={() => onUpdateProfileStatus(p.id, 'approved')}
                        className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Valider & Publier</span>
                      </button>

                      <button
                        onClick={() => setEditingProfile(p)}
                        className="px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </button>

                      <button
                        onClick={() => onUpdateProfileStatus(p.id, 'blocked', 'Profil suspect non validé')}
                        className="px-3 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Fausse annonce / Bloquer</span>
                      </button>

                      <button
                        onClick={() => onDeleteProfile(p.id)}
                        className="px-3 py-2 rounded-xl text-stone-400 hover:text-red-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ALL APPROVED MEMBERS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'members' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Profils Actifs et Validés ({approvedProfiles.length})
              </h2>
              <p className="text-xs text-stone-500">
                Gérez les profils actuellement visibles par les membres sur le site.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Rechercher par prénom/ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Photos (2)</th>
                    <th className="py-3 px-4">Membre</th>
                    <th className="py-3 px-4">Ville</th>
                    <th className="py-3 px-4">Profession</th>
                    <th className="py-3 px-4">Contact privé</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {approvedProfiles
                    .filter(p => !searchQuery || p.pseudonym.toLowerCase().includes(searchQuery.toLowerCase()) || p.city.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onOpenPhotos(p, 0)}
                              className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200"
                              title="Voir photo 1"
                            >
                              <img src={p.photos[0]} alt="P1" className="w-full h-full object-cover" />
                            </button>
                            <button
                              onClick={() => onOpenPhotos(p, 1)}
                              className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200"
                              title="Voir photo 2"
                            >
                              <img src={p.photos[1]} alt="P2" className="w-full h-full object-cover" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-900">
                          {p.pseudonym}
                          <span className="block text-[11px] font-normal text-stone-500">
                            {p.age} ans · {p.gender === 'femme' ? 'Sœur' : 'Frère'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-700">{p.city}</td>
                        <td className="py-3 px-4 text-stone-600 max-w-xs truncate">{p.profession}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-stone-700">
                          {p.contactInfo.phone}
                          {p.contactInfo.waliContact && (
                            <span className="block text-[10px] text-stone-400">Wali: {p.contactInfo.waliContact}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            En ligne
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProfile(p)}
                              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100"
                              title="Modifier les données"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onUpdateProfileStatus(p.id, 'blocked', 'Suspendu par l\'administrateur')}
                              className="p-1.5 text-amber-600 hover:text-amber-800 rounded-md hover:bg-amber-50"
                              title="Suspendre"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteProfile(p.id)}
                              className="p-1.5 text-red-500 hover:text-red-800 rounded-md hover:bg-red-50"
                              title="Supprimer définitivement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CONTACT REQUESTS & PAYMENTS (MyNita & Amanata) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Paiements & Demandes de mise en contact ({requests.length})
              </h2>
              <p className="text-xs text-stone-500">
                Vérifiez le reçu MyNita ou Amanata reçu sur WhatsApp Business (+227 99 61 40 98), puis autorisez la mise en contact.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-stone-900">{req.referenceCode}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      req.status === 'contact_authorized'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'proof_sent'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {req.status === 'contact_authorized'
                        ? 'Contact Autorisé'
                        : req.status === 'proof_sent'
                        ? 'Preuve WhatsApp Reçue'
                        : 'En attente de preuve'}
                    </span>
                    <span className="text-xs text-stone-400">{req.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-semibold">
                      Mode : {req.paymentMethod}
                    </span>
                    <span className="font-bold text-sm text-emerald-700 tabular-nums">
                      {req.amountFCFA.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-stone-400 block uppercase tracking-wider text-[10px]">Demandeur</span>
                    <p className="text-stone-900 font-semibold">{req.requesterPseudo} ({req.requesterGender})</p>
                    <p className="text-stone-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{req.requesterPhone}</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-stone-400 block uppercase tracking-wider text-[10px]">Profil demandé</span>
                    <p className="text-stone-900 font-semibold">{req.targetProfilePseudo} ({req.targetProfileCity})</p>
                    <p className="text-stone-500 font-mono text-[11px]">ID : {req.targetProfileId}</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1 text-stone-700">
                  <div className="flex items-center justify-between">
                    <span><strong>Réf / Billet de paiement :</strong> <code className="font-mono bg-stone-200 px-1 py-0.5 rounded">{req.paymentProofReference}</code></span>
                    {req.authorizedAt && <span className="text-emerald-700 text-[11px]">Autorisé le {req.authorizedAt}</span>}
                  </div>
                  {req.adminComment && (
                    <p className="text-stone-500 italic">Note admin : {req.adminComment}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  {/* WhatsApp verification link */}
                  <a
                    href={`https://wa.me/${OFFICIAL_WHATSAPP_RAW}?text=${encodeURIComponent(`Salam, vérification de la demande ${req.referenceCode} pour ${req.targetProfilePseudo}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ouvrir WhatsApp Business</span>
                  </a>

                  {onOpenGmailCompose && (
                    <button
                      onClick={() => {
                        const targetProfile = profiles.find(p => p.id === req.targetProfileId);
                        const waliInfo = targetProfile?.contactInfo?.waliContact || 'Contact tuteur familial';
                        const phoneInfo = targetProfile?.contactInfo?.phone || '';
                        onOpenGmailCompose(
                          '',
                          `Le Chemin pour le Nikah · Mise en relation ${req.referenceCode}`,
                          `Salam Alaykoum ${req.requesterPseudo},\n\nSuite à la validation de votre paiement par MyNita / Amanata, voici les coordonnées encadrées pour votre demande (${req.referenceCode}) concernant le profil de ${req.targetProfilePseudo} (${req.targetProfileCity}) :\n\n- Téléphone / WhatsApp : ${phoneInfo}\n- Contact du Tuteur Légal (Wali) : ${waliInfo}\n\nNous vous rappelons que toute prise de contact doit être effectuée avec respect, pudeur et dans la seule intention d'un mariage licite.\n\nQu'Allah bénisse votre démarche.\n\nL'Administration · Le Chemin pour le Nikah\nWhatsApp Business : ${OFFICIAL_WHATSAPP_NUMBER}`
                        );
                      }}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium flex items-center gap-1.5"
                      title="Rédiger une notification via Gmail"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-600" />
                      <span>Notifier via Gmail</span>
                    </button>
                  )}

                  {req.status !== 'contact_authorized' && (
                    <button
                      onClick={() => onUpdateRequestStatus(req.id, 'contact_authorized', 'Paiement vérifié sur compte officiel. Mise en relation autorisée.')}
                      className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirmer paiement & Autoriser la mise en contact</span>
                    </button>
                  )}

                  {req.status === 'contact_authorized' && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Contact délivré avec succès
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SUSPICIOUS & BLOCKED PROFILES */}
      {/* ========================================================================= */}
      {activeAdminTab === 'suspicious' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Fausses annonces et profils suspects ({blockedProfiles.length})
            </h2>
            <p className="text-xs text-stone-500">
              Ces profils ont été écartés pour protéger la communauté, la pudeur et prévenir toute tentative d'arnaque.
            </p>
          </div>

          {blockedProfiles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-semibold text-stone-900 mt-2">Aucun profil suspect enregistré</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedProfiles.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-red-200 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900">{p.pseudonym}</span>
                      <span className="text-xs text-stone-500 ml-2">{p.city} · {p.age} ans</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                      Bloqué / Écarté
                    </span>
                  </div>

                  <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    <strong>Motif de suspension :</strong> {p.suspiciousReason || 'Non respect de la charte de pudeur ou profil non sérieux'}
                  </p>

                  <p className="text-xs text-stone-600 line-clamp-2">
                    {p.presentation}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => onUpdateProfileStatus(p.id, 'approved', 'Réhabilité par l\'admin')}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium"
                    >
                      Réhabiliter et publier
                    </button>
                    <button
                      onClick={() => onDeleteProfile(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer définitivement</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: STATS & ANALYTICS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'stats' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Statistiques & Répartition des Membres
            </h2>
            <p className="text-xs text-stone-500">
              Indicateurs de performance de la plateforme au Niger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* By City breakdown */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <h3 className="text-sm font-bold text-stone-900">Répartition par ville au Niger</h3>
              <div className="space-y-2">
                {NIGER_CITIES.map((city) => {
                  const count = profiles.filter(p => p.city === city && p.status === 'approved').length;
                  const pct = approvedProfiles.length > 0 ? (count / approvedProfiles.length) * 100 : 0;
                  return (
                    <div key={city} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-stone-700">{city}</span>
                        <span className="text-stone-500 tabular-nums">{count} profils ({Math.round(pct)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial & Contact request recap */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <h3 className="text-sm font-bold text-stone-900">Bilan Financier & Canaux de Paiement</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                  <span className="text-stone-600">Total Demandes de contact</span>
                  <span className="font-bold text-stone-900">{requests.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-950">
                  <span className="font-medium">Paiements validés (MyNita & Amanata)</span>
                  <span className="font-bold">{authorizedRequests.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-100/70 text-emerald-950">
                  <span className="font-semibold">Revenu total collecté</span>
                  <span className="font-extrabold text-sm">{totalRevenue.toLocaleString('fr-FR')} FCFA</span>
                </div>

                <div className="pt-2 text-[11px] text-stone-500 leading-normal">
                  Les fonds perçus contribuent à la maintenance, à la modération continue des annonces et au respect strict des traditions matrimoniales du Niger.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT PROFILE MODAL */}
      {/* ========================================================================= */}
      {editingProfile && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-stone-900">Modifier le profil : {editingProfile.pseudonym}</h3>
              <button
                onClick={() => setEditingProfile(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Prénom / Pseudo</label>
                <input
                  type="text"
                  value={editingProfile.pseudonym}
                  onChange={(e) => setEditingProfile({ ...editingProfile, pseudonym: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Âge</label>
                  <input
                    type="number"
                    value={editingProfile.age}
                    onChange={(e) => setEditingProfile({ ...editingProfile, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Ville</label>
                  <select
                    value={editingProfile.city}
                    onChange={(e) => setEditingProfile({ ...editingProfile, city: e.target.value as NigerCity })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {NIGER_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Profession</label>
                <input
                  type="text"
                  value={editingProfile.profession}
                  onChange={(e) => setEditingProfile({ ...editingProfile, profession: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Présentation</label>
                <textarea
                  rows={3}
                  value={editingProfile.presentation}
                  onChange={(e) => setEditingProfile({ ...editingProfile, presentation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes internes admin</label>
                <input
                  type="text"
                  value={editingProfile.adminNotes || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, adminNotes: e.target.value })}
                  placeholder="Notes de vérification..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="px-4 py-2 border rounded-lg text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateProfile(editingProfile);
                  setEditingProfile(null);
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
