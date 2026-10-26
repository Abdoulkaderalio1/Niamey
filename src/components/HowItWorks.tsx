import React from 'react';
import { UserCheck, Camera, ShieldCheck, CreditCard, MessageCircle, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER, DEFAULT_CONTACT_FEE_FCFA } from '../types';

interface HowItWorksProps {
  onRegisterClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onRegisterClick }) => {
  const steps = [
    {
      num: '01',
      title: 'Inscription & 2 photos obligatoires',
      desc: 'Renseignez votre prénom/pseudo, âge, ville au Niger, situation matrimoniale et vos critères. Deux photos décentes (portrait sobre et tenue traditionnelle) sont rigoureusement requises pour éviter les faux profils.',
      icon: Camera,
    },
    {
      num: '02',
      title: 'Validation par l\'administrateur',
      desc: 'Votre profil reste en attente. L\'administrateur examine les photos et le sérieux de l\'annonce. Seules les personnes respectant la charte éthique sont validées et rendues visibles.',
      icon: ShieldCheck,
    },
    {
      num: '03',
      title: 'Consultation avec pudeur préservée',
      desc: 'Les membres parcourent les profils validés. Aucune coordonnée personnelle (ni numéro de téléphone, ni quartier exact) n\'est affichée publiquement afin de protéger l\'honneur des familles.',
      icon: UserCheck,
    },
    {
      num: '04',
      title: 'Mise en contact payante (MyNita ou Amanata)',
      desc: `La personne intéressée initie sa demande. Les frais de mise en contact (${DEFAULT_CONTACT_FEE_FCFA.toLocaleString('fr-FR')} FCFA) sont réglés en toute simplicité par les opérateurs MyNita ou Amanata.`,
      icon: CreditCard,
    },
    {
      num: '05',
      title: 'Envoi de la preuve sur WhatsApp Business',
      desc: `Le demandeur envoie le reçu ou bordereau sur le compte WhatsApp Business officiel : ${OFFICIAL_WHATSAPP_NUMBER}. Cela garantit la sécurité et protège la vie privée de l'administrateur.`,
      icon: MessageCircle,
    },
    {
      num: '06',
      title: 'Vérification & Autorisation encadrée',
      desc: 'Dès validation du paiement, l\'administrateur autorise la mise en relation et transmet les coordonnées avec implication du tuteur légal (Wali) pour une démarche pieuse et licite.',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">
          Procédure Transparente & Conforme
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif-islamic">
          Comment fonctionne Le Chemin pour le Nikah ?
        </h1>
        <p className="text-stone-600 text-sm leading-relaxed">
          Un cadre structuré au Niger pour faciliter le mariage islamique dans le respect strict des traditions et de la loi coranique.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3 relative hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-serif-islamic text-stone-300">
                  {s.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <h2 className="text-base font-bold text-stone-900">
                {s.title}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Official Reminder */}
      <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-serif-islamic text-white">
              Contact Officiel WhatsApp Business
            </h2>
            <p className="text-xs text-emerald-300 max-w-xl">
              Pour préserver la sérénité et la vie privée, toutes les communications et transmissions de preuves de paiement transitent par notre numéro officiel vérifié.
            </p>
          </div>

          <a
            href={`https://wa.me/22799614098?text=${encodeURIComponent("Salam Alaykoum, je souhaite des informations sur le fonctionnement de la plateforme.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-colors shrink-0 shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{OFFICIAL_WHATSAPP_NUMBER}</span>
          </a>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onRegisterClick}
          className="px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-semibold text-sm transition-all shadow-md"
        >
          Commencer mon inscription pour le Nikah
        </button>
      </div>
    </div>
  );
};
