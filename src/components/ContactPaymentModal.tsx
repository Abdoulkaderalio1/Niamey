import React, { useState } from 'react';
import { X, ShieldCheck, MessageCircle, CheckCircle2, ArrowRight, Copy, Check, AlertCircle, Phone, Heart } from 'lucide-react';
import { Profile, PaymentMethod, ContactRequest, OFFICIAL_WHATSAPP_NUMBER, OFFICIAL_WHATSAPP_RAW, DEFAULT_CONTACT_FEE_FCFA } from '../types';

interface ContactPaymentModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (requestData: Omit<ContactRequest, 'id' | 'createdAt'>) => void;
}

export const ContactPaymentModal: React.FC<ContactPaymentModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSubmitRequest,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MyNita');
  const [requesterPseudo, setRequesterPseudo] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [requesterGender, setRequesterGender] = useState<'homme' | 'femme'>('homme');
  const [paymentProofReference, setPaymentProofReference] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate a unique reference code for this request
  const [refCode] = useState(() => `NIK-227-${Math.floor(1000 + Math.random() * 9000)}`);

  if (!isOpen || !profile) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsAppMessage = `Salam Alaykoum l'Administration de Le Chemin pour le Nikah.
Voici ma preuve de paiement pour la mise en contact :
- Référence : ${refCode}
- Profil demandé : ${profile.pseudonym} (${profile.city}, ID #${profile.id.replace('nikah-p-', '')})
- Mon pseudo : ${requesterPseudo || 'Demandeur'}
- Mon numéro : ${requesterPhone || 'Non précisé'}
- Mode de paiement : ${paymentMethod}
- Montant : ${DEFAULT_CONTACT_FEE_FCFA.toLocaleString('fr-FR')} FCFA
- Réf transaction / reçu : ${paymentProofReference || 'En pièce jointe'}

Merci de bien vouloir vérifier et autoriser la mise en relation avec le tuteur/wali.`;

  const whatsAppUrl = `https://wa.me/${OFFICIAL_WHATSAPP_RAW}?text=${encodeURIComponent(whatsAppMessage)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterPseudo.trim() || !requesterPhone.trim()) {
      alert('Veuillez renseigner votre prénom/pseudo et votre numéro de téléphone.');
      return;
    }

    onSubmitRequest({
      referenceCode: refCode,
      targetProfileId: profile.id,
      targetProfilePseudo: profile.pseudonym,
      targetProfileCity: profile.city,
      requesterPseudo: requesterPseudo.trim(),
      requesterPhone: requesterPhone.trim(),
      requesterGender,
      paymentMethod,
      amountFCFA: DEFAULT_CONTACT_FEE_FCFA,
      paymentProofReference: paymentProofReference.trim() || `RÉF-DEMANDE-${refCode}`,
      proofNotes: proofNotes.trim(),
      status: paymentProofReference.trim() ? 'proof_sent' : 'pending_proof',
    });

    setIsSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-stone-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-300 fill-emerald-300" />
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-islamic text-white">
                Mise en contact pour le Nikah
              </h2>
              <p className="text-xs text-emerald-200">
                Profil cible : {profile.pseudonym} · {profile.city}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-900 font-serif-islamic">
                Demande de contact enregistrée !
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Code de suivi : <span className="font-mono font-bold text-stone-800">{refCode}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left text-xs sm:text-sm text-emerald-950 space-y-2">
              <p className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Étape suivante : Envoyer la preuve sur WhatsApp Business
              </p>
              <p className="text-emerald-800">
                Pour finaliser et accélérer l'autorisation, transmettez votre preuve de paiement par message au numéro officiel : <strong>{OFFICIAL_WHATSAPP_NUMBER}</strong>.
              </p>
            </div>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all active:scale-98"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Ouvrir WhatsApp Business (+227 99 61 40 98)</span>
            </a>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Fermer et retourner aux profils
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            
            {/* Step Explanation Banner */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>Frais de mise en relation : {DEFAULT_CONTACT_FEE_FCFA.toLocaleString('fr-FR')} FCFA</span>
                <span className="font-mono text-emerald-700">{refCode}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Ces frais couvrent la vérification administrative, la protection de la pudeur et la mise en contact encadrée avec le tuteur légal (Wali).
              </p>
            </div>

            {/* Requester Identity */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                1. Vos coordonnées (Demandeur)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Votre Prénom / Pseudo *
                  </label>
                  <input
                    type="text"
                    required
                    value={requesterPseudo}
                    onChange={(e) => setRequesterPseudo(e.target.value)}
                    placeholder="Ex: Oumarou, Aïchatou..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Votre Numéro WhatsApp / Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={requesterPhone}
                    onChange={(e) => setRequesterPhone(e.target.value)}
                    placeholder="+227 90 00 00 00"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector: MyNita vs Amanata */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                2. Choisissez votre moyen de paiement au Niger
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MyNita')}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === 'MyNita'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900">MyNita</span>
                    {paymentMethod === 'MyNita' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Transfert compte à compte ou en agence MyNita partout au Niger.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Amanata')}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === 'Amanata'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900">Amanata</span>
                    {paymentMethod === 'Amanata' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Amana Transfert / Amanata guichet ou mobile.
                  </p>
                </button>
              </div>

              {/* Instructions for Selected Method */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-2">
                <p className="font-semibold text-amber-900">
                  Instructions pour {paymentMethod} :
                </p>
                <div className="space-y-1 text-stone-700">
                  <p>1. Effectuez le versement de <strong>3 000 FCFA</strong> au compte officiel du service.</p>
                  <p>2. Numéro du compte officiel : <strong className="text-stone-900">{OFFICIAL_WHATSAPP_NUMBER}</strong></p>
                  <p>3. Précisez en motif votre code : <strong className="font-mono text-emerald-800">{refCode}</strong></p>
                  <p>4. Prenez en photo le reçu ou notez le code de transaction.</p>
                </div>
              </div>
            </div>

            {/* Proof Reference Input */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                3. Preuve & Référence de paiement
              </h3>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Code ou Référence du reçu {paymentMethod}
                </label>
                <input
                  type="text"
                  value={paymentProofReference}
                  onChange={(e) => setPaymentProofReference(e.target.value)}
                  placeholder="Ex: MN-984920 ou Bordereau AM-1928"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Direct WhatsApp send CTA */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-emerald-950">
                  <span className="font-semibold block">Envoyez la capture du reçu :</span>
                  <span className="text-[11px] text-emerald-800">
                    Sur WhatsApp Business officiel : {OFFICIAL_WHATSAPP_NUMBER}
                  </span>
                </div>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Envoyer la preuve WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-98"
              >
                Confirmer ma demande
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
