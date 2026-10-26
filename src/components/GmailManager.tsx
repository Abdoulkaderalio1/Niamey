import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Inbox, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  LogOut, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  Search,
  MessageSquare,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken, 
  initAuth 
} from '../services/googleAuth';
import { 
  getGmailProfile, 
  listGmailMessages, 
  sendGmailEmail, 
  GmailProfile, 
  GmailMessageItem 
} from '../services/gmailService';
import { OFFICIAL_WHATSAPP_NUMBER } from '../types';

interface GmailManagerProps {
  initialRecipient?: string;
  initialSubject?: string;
  initialBody?: string;
}

export const GmailManager: React.FC<GmailManagerProps> = ({
  initialRecipient = '',
  initialSubject = '',
  initialBody = '',
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [messages, setMessages] = useState<GmailMessageItem[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Active view inside Gmail manager
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');

  // Compose state
  const [toEmail, setToEmail] = useState(initialRecipient);
  const [subject, setSubject] = useState(initialSubject);
  const [bodyText, setBodyText] = useState(initialBody);
  const [selectedTemplate, setSelectedTemplate] = useState<'none' | 'profile_approved' | 'contact_authorized' | 'payment_reminder'>('none');

  // Confirmation dialog state (MANDATORY per Workspace Integration Guidelines)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, cachedToken) => {
        setCurrentUser(user);
        setToken(cachedToken);
      },
      () => {
        setCurrentUser(null);
        setToken(null);
        setProfile(null);
        setMessages([]);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch profile and messages when token becomes available
  useEffect(() => {
    if (token) {
      loadGmailData(token);
    }
  }, [token]);

  const loadGmailData = async (accessToken: string) => {
    setIsLoadingMessages(true);
    setErrorMessage(null);
    try {
      const [prof, msgs] = await Promise.all([
        getGmailProfile(accessToken),
        listGmailMessages(accessToken, searchQuery, 15),
      ]);
      setProfile(prof);
      setMessages(msgs);
    } catch (err: any) {
      console.error('Error loading Gmail data', err);
      setErrorMessage(err.message || 'Impossible de charger les données Gmail.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setToken(result.accessToken);
        await loadGmailData(result.accessToken);
      }
    } catch (err: any) {
      console.error('Login error', err);
      setErrorMessage('Connexion à Google interrompue ou refusée.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setToken(null);
    setProfile(null);
    setMessages([]);
  };

  // Pre-filled template applicator
  const applyTemplate = (type: 'profile_approved' | 'contact_authorized' | 'payment_reminder') => {
    setSelectedTemplate(type);
    if (type === 'profile_approved') {
      setSubject('Le Chemin pour le Nikah · Félicitations, votre profil est validé !');
      setBodyText(
`Salam Alaykoum,

Nous avons le plaisir de vous informer que votre profil sur « Le Chemin pour le Nikah » a été examiné et validé avec succès par l'administrateur.

Vos 2 photos respectent nos critères de pudeur et votre présentation est désormais consultable par les célibataires du Niger.

Rappel : Vos coordonnées personnelles (téléphone et tuteur/wali) restent strictement confidentielles et ne seront jamais affichées publiquement.

Qu'Allah bénisse votre démarche matrimoniale et facilite votre union licite.

Fraternellement,
L'Administration · Le Chemin pour le Nikah
WhatsApp Business : ${OFFICIAL_WHATSAPP_NUMBER}`
      );
    } else if (type === 'contact_authorized') {
      setSubject('Le Chemin pour le Nikah · Mise en contact autorisée pour le Nikah');
      setBodyText(
`Salam Alaykoum,

Votre paiement de frais de mise en relation a bien été vérifié par notre administration sur MyNita / Amanata.

Conformément aux préceptes du Nikah, voici les coordonnées encadrées pour initier la démarche avec le respect des convenances :

- Profil concerné : [Nom du profil]
- Ville au Niger : [Ville]
- Contact du Tuteur légal (Wali) : [Contact du tuteur]
- Téléphone / WhatsApp : [Numéro]

Nous vous rappelons que tout échange doit être mené dans la pureté de l'intention (An-Niyyah) en vue exclusive d'un mariage licite.

Qu'Allah vous accorde la réussite et l'harmonie dans votre projet.

Fraternellement,
L'Administration · Le Chemin pour le Nikah
WhatsApp Business : ${OFFICIAL_WHATSAPP_NUMBER}`
      );
    } else if (type === 'payment_reminder') {
      setSubject('Le Chemin pour le Nikah · Rappel : Preuve de paiement MyNita / Amanata');
      setBodyText(
`Salam Alaykoum,

Vous avez initié une demande de mise en contact sur « Le Chemin pour le Nikah ».

Afin de permettre à l'administrateur de valider votre demande et de vous transmettre les coordonnées du tuteur/wali, merci de bien vouloir envoyer votre preuve de paiement (3 000 FCFA par MyNita ou Amanata) sur notre compte WhatsApp Business officiel :

WhatsApp Business : ${OFFICIAL_WHATSAPP_NUMBER}

En précisant votre code de référence de demande.

Barakallahu fikoum,
L'Administration · Le Chemin pour le Nikah`
      );
    }
  };

  // Step 1: User clicks "Envoyer", we show explicit confirmation modal
  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSendSuccessMessage(null);

    if (!toEmail.trim() || !subject.trim() || !bodyText.trim()) {
      setErrorMessage('Veuillez remplir le destinataire, l\'objet et le corps du message.');
      return;
    }

    setShowConfirmModal(true);
  };

  // Step 2: User explicitly confirms the send operation in the modal
  const handleConfirmSend = async () => {
    setShowConfirmModal(false);
    setIsSending(true);
    setErrorMessage(null);

    try {
      const activeAccessToken = token || (await getAccessToken());
      if (!activeAccessToken) {
        throw new Error('Session expirée. Veuillez vous reconnecter à votre compte Google.');
      }

      await sendGmailEmail(activeAccessToken, {
        to: toEmail.trim(),
        subject: subject.trim(),
        bodyText: bodyText.trim(),
      });

      setSendSuccessMessage(`E-mail envoyé avec succès à ${toEmail} via votre compte Gmail !`);
      setToEmail('');
      setSubject('');
      setBodyText('');
      setSelectedTemplate('none');
      // Refresh messages
      loadGmailData(activeAccessToken);
    } catch (err: any) {
      console.error('Send email error', err);
      setErrorMessage(err.message || 'Échec de l\'envoi de l\'e-mail.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-islamic">
                  Messagerie Gmail Officielle
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                  Intégration Google Workspace
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Envoyez les attestations de validation, notifications aux tuteurs (Wali) et suivez les échanges par e-mail.
              </p>
            </div>
          </div>

          {/* Google Sign in / Sign out controls */}
          <div>
            {!token ? (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition-all active:scale-98 disabled:opacity-50"
              >
                {/* Official Google 'G' icon */}
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>{isLoggingIn ? 'Connexion en cours...' : 'Se connecter avec Google'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-right text-xs">
                  <span className="font-semibold text-stone-900 block truncate max-w-[200px]">
                    {profile?.emailAddress || currentUser?.email}
                  </span>
                  <span className="text-stone-400 text-[10px]">
                    {profile ? `${profile.messagesTotal.toLocaleString()} e-mails` : 'Connecté'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {sendSuccessMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{sendSuccessMessage}</span>
          </div>
        )}
      </div>

      {!token ? (
        /* Not logged in placeholder */
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-red-500 flex items-center justify-center mx-auto shadow-inner">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 font-serif-islamic">
            Connectez votre compte Gmail
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Pour envoyer des e-mails officiels de confirmation aux candidats et tuteurs ou pour lire vos messages reçus, connectez votre compte Google en un clic.
          </p>
          <div className="pt-2">
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-3 shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>Se connecter avec Google (Gmail)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Authenticated Gmail Interface */
        <div className="space-y-6">
          
          {/* Internal Tab switcher */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 ${
                activeTab === 'inbox'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Boîte de réception ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('compose')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 ${
                activeTab === 'compose'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Rédiger un e-mail officiel</span>
            </button>
          </div>

          {/* TAB 1: INBOX */}
          {activeTab === 'inbox' && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs space-y-4 p-5">
              
              {/* Search & Refresh bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Filtrer vos e-mails Gmail..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadGmailData(token)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadGmailData(token)}
                    disabled={isLoadingMessages}
                    className="px-3 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                    <span>Actualiser</span>
                  </button>
                </div>
              </div>

              {/* Messages list */}
              {isLoadingMessages ? (
                <div className="p-8 text-center text-xs text-stone-400">
                  Chargement des messages Gmail en cours...
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500">
                  Aucun message trouvé dans votre boîte Gmail pour cette recherche.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 hover:bg-stone-50 transition-colors rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        msg.unread ? 'bg-emerald-50/30 font-semibold' : ''
                      }`}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-900 truncate max-w-xs">{msg.from || 'Expéditeur inconnu'}</span>
                          {msg.unread && (
                            <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] rounded-full">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs text-stone-800 font-medium truncate">{msg.subject}</h4>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{msg.snippet}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-stone-400 block">{msg.date}</span>
                        <button
                          onClick={() => {
                            // Extract email if possible
                            const match = msg.from.match(/<([^>]+)>/);
                            const senderEmail = match ? match[1] : msg.from;
                            setToEmail(senderEmail);
                            setSubject(`Re: ${msg.subject}`);
                            setActiveTab('compose');
                          }}
                          className="text-xs text-emerald-700 hover:underline mt-1 inline-block"
                        >
                          Répondre
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPOSE */}
          {activeTab === 'compose' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5">
              
              {/* Quick Template Selector */}
              <div>
                <span className="text-xs font-semibold text-stone-700 block mb-2">
                  Modèles d'e-mails prédéfinis pour « Le Chemin pour le Nikah » :
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyTemplate('profile_approved')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedTemplate === 'profile_approved'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    Félicitations · Profil validé
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate('contact_authorized')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedTemplate === 'contact_authorized'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    Mise en relation autorisée (Wali)
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate('payment_reminder')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedTemplate === 'payment_reminder'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    Rappel preuve MyNita / Amanata
                  </button>
                </div>
              </div>

              {/* Compose Form */}
              <form onSubmit={handleInitiateSend} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Destinataire (E-mail) *
                  </label>
                  <input
                    type="email"
                    required
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    placeholder="ex: candidat@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Objet du message *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Objet de la communication matrimoniale..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Corps de l'e-mail *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    placeholder="Rédigez votre message..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                  />
                </div>

                {/* Sender account notice */}
                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t">
                  <span>
                    Envoyé depuis votre adresse : <strong className="text-stone-800">{profile?.emailAddress || currentUser?.email}</strong>
                  </span>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSending ? 'Envoi en cours...' : 'Envoyer via Gmail'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* MANDATORY USER CONFIRMATION MODAL BEFORE MUTATING/SENDING VIA WORKSPACE API */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center gap-3 text-emerald-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Confirmer l'envoi de l'e-mail ?
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Vous êtes sur le point d'envoyer un e-mail officiel depuis votre compte Gmail <strong>{profile?.emailAddress || currentUser?.email}</strong>.
            </p>

            <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1 text-stone-700 border border-stone-200">
              <p><strong>Destinataire :</strong> {toEmail}</p>
              <p><strong>Objet :</strong> {subject}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleConfirmSend}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-all shadow-xs"
              >
                Confirmer et Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
