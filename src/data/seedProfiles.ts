import { Profile, ContactRequest } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_banner_nikah_1793042176241.jpg';
export const PORTRAIT_MAN_BOUBOU = '/src/assets/images/portrait_man_boubou_1793042176466.jpg';
export const PORTRAIT_WOMAN_HIJAB = '/src/assets/images/portrait_woman_hijab_1793042177706.jpg';
export const PORTRAIT_ELDER_MAN = '/src/assets/images/portrait_elder_man_1793042177776.jpg';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'nikah-p-001',
    pseudonym: 'Amina',
    age: 25,
    city: 'Niamey',
    gender: 'femme',
    maritalStatus: 'celibataire',
    lookingFor: 'homme',
    profession: 'Enseignante en école primaire & Diplômée en Sciences de l\'Éducation',
    education: 'Licence universitaire & apprentissage coranique',
    religionPractice: 'Pratiquante assidue, port du voile décent, lectures hebdomadaires du Coran',
    presentation: 'Femme calme, réservée et attachée aux valeurs familiales islamiques. J\'aime les enfants, la cuisine traditionnelle nigérienne et les moments de partage en famille. Je recherche la sérénité et le respect mutuel.',
    criteria: 'Un homme pieux, responsable, craintif d\'Allah, résident de préférence à Niamey ou ouvert, ayant une situation stable et prêt à fonder un foyer basé sur la bienveillance (Mawaddah wa Rahmah).',
    photos: [
      PORTRAIT_WOMAN_HIJAB,
      PORTRAIT_WOMAN_HIJAB
    ],
    status: 'approved',
    submissionDate: '2026-10-20',
    contactInfo: {
      phone: '+227 96 12 34 56',
      whatsapp: '+227 96 12 34 56',
      waliContact: 'Père : El Hadj Moussa (+227 90 45 67 89)',
      neighborhood: 'Yantala, Niamey'
    }
  },
  {
    id: 'nikah-p-002',
    pseudonym: 'Ibrahim',
    age: 29,
    city: 'Niamey',
    gender: 'homme',
    maritalStatus: 'celibataire',
    lookingFor: 'femme',
    profession: 'Ingénieur en télécommunications et réseaux',
    education: 'Master Ingénierie (Niamey)',
    religionPractice: 'Prières quotidiennes à l\'heure, assiduité aux cours religieux du vendredi, respect des préceptes',
    presentation: 'Jeune homme équilibré, travailleur, issu d\'une famille respectueuse. J\'apprécie la simplicité, les discussions calmes et les projets d\'avenir constructifs.',
    criteria: 'Une sœur pieuse, pudique, instruite, attachée à sa religion et désireuse de bâtir une union durable selon la Sunnah de notre Prophète (PBSL).',
    photos: [
      PORTRAIT_MAN_BOUBOU,
      PORTRAIT_MAN_BOUBOU
    ],
    status: 'approved',
    submissionDate: '2026-10-22',
    contactInfo: {
      phone: '+227 91 88 77 66',
      whatsapp: '+227 91 88 77 66',
      waliContact: 'Famille directe à Dar-es-Salam',
      neighborhood: 'Plateau / Dar-es-Salam, Niamey'
    }
  },
  {
    id: 'nikah-p-003',
    pseudonym: 'Ousmane',
    age: 42,
    city: 'Maradi',
    gender: 'homme',
    maritalStatus: 'veuf',
    lookingFor: 'femme',
    profession: 'Commerçant import-export & Gestionnaire d\'exploitation agricole',
    education: 'Études secondaires et formation commerciale',
    religionPractice: 'Accomplissement du Hadj, engagé dans les œuvres de bienfaisance locales, vie rythmée par la foi',
    presentation: 'Père de deux enfants scolarisés, veuf depuis 3 ans. Homme d\'honneur, attentionné, financièrement indépendant et prêt à offrir un foyer digne et aimant à une épouse vertueuse.',
    criteria: 'Une femme mûre (entre 28 et 38 ans), patiente, douce et pieuse, célibataire ou divorcée/veuve, qui saura apprécier la vie de famille et la stabilité.',
    photos: [
      PORTRAIT_ELDER_MAN,
      PORTRAIT_ELDER_MAN
    ],
    status: 'approved',
    submissionDate: '2026-10-18',
    contactInfo: {
      phone: '+227 98 44 22 11',
      whatsapp: '+227 98 44 22 11',
      waliContact: 'Oncle aîné : Mallam Kabirou',
      neighborhood: 'Grand Marché, Maradi'
    }
  },
  {
    id: 'nikah-p-004',
    pseudonym: 'Hadiza',
    age: 27,
    city: 'Zinder',
    gender: 'femme',
    maritalStatus: 'celibataire',
    lookingFor: 'homme',
    profession: 'Infirmière diplômée d\'État',
    education: 'Diplôme d\'État en Soins Infirmiers',
    religionPractice: 'Voile islamique permanent, pratique sérieuse et amour des bonnes œuvres',
    presentation: 'Nature généreuse, respectueuse des aînés et dévouée. Je travaille dans le milieu de la santé à Zinder et recherche un compagnon de vie avec qui cheminer vers le paradis.',
    criteria: 'Un homme honnête, pieux, ayant le sens des responsabilités conjugales, respectueux de la belle-famille et aimant le dialogue.',
    photos: [
      PORTRAIT_WOMAN_HIJAB,
      PORTRAIT_WOMAN_HIJAB
    ],
    status: 'approved',
    submissionDate: '2026-10-23',
    contactInfo: {
      phone: '+227 92 33 55 77',
      whatsapp: '+227 92 33 55 77',
      waliContact: 'Tuteur légal (Grand frère) : Mamane (+227 94 00 11 22)',
      neighborhood: 'Birni, Zinder'
    }
  },
  {
    id: 'nikah-p-005',
    pseudonym: 'Abdoul-Razak',
    age: 33,
    city: 'Tahoua',
    gender: 'homme',
    maritalStatus: 'divorce',
    lookingFor: 'femme',
    profession: 'Cadre dans l\'administration publique territoriale',
    education: 'Diplôme Universitaire d\'Administration',
    religionPractice: 'Pratiquant régulier, fréquentation des assises de rappel',
    presentation: 'Divorcé sans enfants après une courte union il y a 4 ans. Calme, sincère, je souhaite repartir sur des bases saines selon la loi d\'Allah.',
    criteria: 'Une sœur compréhensive, discrète et respectueuse, pour bâtir une vie sereine.',
    photos: [
      PORTRAIT_MAN_BOUBOU,
      PORTRAIT_MAN_BOUBOU
    ],
    status: 'pending', // En attente de validation par l'administrateur !
    submissionDate: '2026-10-25',
    adminNotes: 'Profil récent vérifié par SMS. En attente de contrôle final des photos avant publication.',
    contactInfo: {
      phone: '+227 97 55 44 33',
      whatsapp: '+227 97 55 44 33',
      waliContact: 'Famille à Tahoua',
      neighborhood: 'Quartier Administratif, Tahoua'
    }
  },
  {
    id: 'nikah-p-006',
    pseudonym: 'Fatouma-Zahra',
    age: 23,
    city: 'Agadez',
    gender: 'femme',
    maritalStatus: 'celibataire',
    lookingFor: 'homme',
    profession: 'Étudiante en Droit islamique et français',
    education: 'Licence 3 en cours',
    religionPractice: 'Port du jilbab, attachée à la Sunnah, mémorisation du Coran en cours',
    presentation: 'Jeune femme posée, amoureuse des études religieuses, souhaitant fonder un foyer béni.',
    criteria: 'Un frère pieux, qui encourage l\'apprentissage de la religion et pratique la douceur envers son épouse.',
    photos: [
      PORTRAIT_WOMAN_HIJAB,
      PORTRAIT_WOMAN_HIJAB
    ],
    status: 'pending', // En attente de validation
    submissionDate: '2026-10-26',
    contactInfo: {
      phone: '+227 90 11 22 33',
      whatsapp: '+227 90 11 22 33',
      waliContact: 'Père : Imam Souleymane (+227 96 77 88 99)',
      neighborhood: 'Centre historique, Agadez'
    }
  },
  {
    id: 'nikah-p-007',
    pseudonym: 'Annonce_VIP_Express',
    age: 30,
    city: 'Niamey',
    gender: 'homme',
    maritalStatus: 'celibataire',
    lookingFor: 'femme',
    profession: 'Investisseur crypto international',
    education: 'Non précisé',
    religionPractice: 'Non précisé',
    presentation: 'Je cherche une fille belle et moderne rapidement, contactez-moi directement.',
    criteria: 'Fille mannequin.',
    photos: [
      PORTRAIT_MAN_BOUBOU,
      PORTRAIT_MAN_BOUBOU
    ],
    status: 'blocked',
    isSuspicious: true,
    suspiciousReason: 'Annonce suspecte non conforme à l\'éthique du Nikah (demande non sérieuse, propos déplacés). Bloqué par l\'admin.',
    submissionDate: '2026-10-24',
    contactInfo: {
      phone: '+227 80 00 00 00',
      neighborhood: 'Inconnu'
    }
  }
];

export const INITIAL_REQUESTS: ContactRequest[] = [
  {
    id: 'req-001',
    referenceCode: 'NIK-227-4819',
    targetProfileId: 'nikah-p-001',
    targetProfilePseudo: 'Amina',
    targetProfileCity: 'Niamey',
    requesterPseudo: 'Mouhamadou',
    requesterPhone: '+227 90 44 88 12',
    requesterGender: 'homme',
    paymentMethod: 'MyNita',
    amountFCFA: 3000,
    paymentProofReference: 'MYNITA-TX-8839219',
    proofNotes: 'Virement de 3 000 FCFA effectué ce matin par MyNita Agence Yantala',
    status: 'proof_sent',
    createdAt: '2026-10-26 09:30',
    adminComment: 'Preuve reçue sur WhatsApp Business (+227 99 61 40 98). En attente de validation du virement.'
  },
  {
    id: 'req-002',
    referenceCode: 'NIK-227-3920',
    targetProfileId: 'nikah-p-002',
    targetProfilePseudo: 'Ibrahim',
    targetProfileCity: 'Niamey',
    requesterPseudo: 'Maimouna',
    requesterPhone: '+227 96 55 12 89',
    requesterGender: 'femme',
    paymentMethod: 'Amanata',
    amountFCFA: 3000,
    paymentProofReference: 'AMANATA-BORD-109283',
    proofNotes: 'Bordereau Amanata envoyé par capture d\'écran',
    status: 'contact_authorized',
    createdAt: '2026-10-25 15:40',
    authorizedAt: '2026-10-25 17:15',
    adminComment: 'Paiement Amanata vérifié avec succès. Mise en contact autorisée et transmise au tuteur de la sœur.'
  }
];
