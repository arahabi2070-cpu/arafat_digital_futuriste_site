export type Locale = 'fr' | 'en'

export const CONTACT = {
  phoneDisplay: '+237 695 928 319',
  phoneRaw: '+237695928319',
  whatsapp: '237695928319',
  city: 'Garoua, Cameroun',
  ceo: 'Arafat Garga',
  company: 'ADF — Arafat Digital Futuriste',
}

export function waLink(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
}

type Dict = typeof fr

export const fr = {
  nav: {
    home: 'Accueil',
    services: 'Services',
    portfolio: 'Portfolio',
    training: 'Formation & Ebooks',
    contact: 'Contact',
    quote: 'Demander un devis',
  },
  common: {
    whatsapp: 'WhatsApp',
    call: 'Appeler',
    from: 'À partir de',
    fcfa: 'FCFA',
    getQuote: 'Demander un devis',
    orderNow: 'Commander maintenant',
    seeWork: 'Voir mes réalisations',
    langLabel: 'EN',
  },
  hero: {
    badge: 'Studio de design · Garoua, Cameroun',
    title: 'Des visuels qui font vendre.',
    titleAccent: 'Design & vidéo haut de gamme.',
    subtitle:
      "Logos, identité visuelle, affiches, cartes de visite, vidéos publicitaires cinématographiques, formations et ebooks. Un rendu ultra professionnel, livré rapidement, à des prix justes en FCFA.",
    ctaPrimary: 'Discuter de mon projet sur WhatsApp',
    ctaSecondary: 'Voir mes réalisations',
    trust1: 'Livraison numérique rapide',
    trust2: 'Devis gratuit en quelques minutes',
    trust3: 'Paiement mobile accepté',
  },
  stats: {
    delivery: 'Livraison numérique',
    deliveryValue: '24-72h',
    revisions: 'Révisions incluses',
    revisionsValue: 'Jusqu’à satisfaction',
    price: 'Tarifs',
    priceValue: 'Justes en FCFA',
    support: 'Réponse WhatsApp',
    supportValue: 'Rapide',
  },
  servicesSection: {
    kicker: 'Ce que je crée pour vous',
    title: 'Un studio complet pour votre image de marque',
    subtitle:
      'De la première idée au fichier final prêt à imprimer ou à publier. Chaque projet est traité avec un soin professionnel du détail.',
  },
  services: {
    logo: {
      name: 'Logos & identité visuelle',
      desc: "Un logo mémorable et une charte cohérente : couleurs, typographies et déclinaisons pour tous vos supports.",
      price: '15 000',
      features: ['Logo en haute résolution', 'Fichiers vectoriels', 'Charte de couleurs', 'Déclinaisons réseaux'],
    },
    social: {
      name: 'Affiches & visuels réseaux',
      desc: 'Des affiches et publications qui attirent le regard et déclenchent le clic sur Facebook, WhatsApp et Instagram.',
      price: '3 000',
      features: ['Formats adaptés à chaque réseau', 'Textes accrocheurs inclus', 'Fichiers prêts à publier'],
    },
    print: {
      name: 'Cartes de visite & print',
      desc: 'Cartes de visite, flyers, banderoles et tout support imprimé, conçus pour un rendu impeccable.',
      price: '5 000',
      features: ['Fichiers prêts pour impression', 'Recto / verso', 'Conseils d’impression'],
    },
    video: {
      name: 'Vidéos publicitaires & montage',
      desc: 'Publicités et annonces vidéo cinématographiques, ultra-réalistes, montées ou générées pour marquer les esprits.',
      price: '25 000',
      features: ['Montage professionnel', 'Rendu cinématographique', 'Musique & voix off', 'Formats réseaux & TV'],
    },
    training: {
      name: 'Formation design & vidéo',
      desc: 'Apprenez à créer vos propres visuels et vidéos, étape par étape, avec un accompagnement personnalisé.',
      price: '20 000',
      features: ['Sessions pratiques', 'Support de cours', 'Suivi personnalisé', 'Certificat de fin'],
    },
    ebooks: {
      name: 'Ebooks',
      desc: 'Des ebooks professionnels pour apprendre le design et la vidéo, à télécharger immédiatement.',
      price: '2 000',
      features: ['Téléchargement immédiat', 'Contenu clair et illustré', 'Mises à jour incluses'],
    },
  },
  process: {
    kicker: 'Simple et transparent',
    title: 'Comment ça se passe',
    steps: [
      { title: 'Vous me contactez', desc: 'Un message WhatsApp ou un appel suffit pour décrire votre besoin.' },
      { title: 'Devis gratuit', desc: 'Je vous envoie un prix clair en FCFA et le délai de livraison.' },
      { title: 'Je crée', desc: 'Je réalise votre projet avec des révisions jusqu’à votre satisfaction.' },
      { title: 'Livraison', desc: 'Vous recevez vos fichiers numériques, prêts à l’emploi.' },
    ],
  },
  delivery: {
    kicker: 'Livraison',
    title: 'Comment vous recevez votre travail',
    digital: {
      title: 'Support numérique',
      desc: 'Tous les fichiers (logos, visuels, vidéos, ebooks) sont livrés numériquement, où que vous soyez.',
    },
    physical: {
      title: 'Supports physiques',
      desc: 'Cartes de visite et autres supports imprimés livrés dans toutes les villes du Cameroun, sous la responsabilité du client.',
    },
    free: {
      title: 'Livraison gratuite',
      desc: 'Livraison offerte au centre-ville de Garoua uniquement.',
    },
  },
  finalCta: {
    title: 'Prêt à faire passer votre image au niveau supérieur ?',
    subtitle: 'Envoyez-moi un message maintenant. Réponse rapide, devis gratuit, sans engagement.',
    button: 'Démarrer mon projet sur WhatsApp',
  },
  portfolio: {
    kicker: 'Mes réalisations',
    title: 'Portfolio',
    subtitle: 'Un aperçu de mes créations : logos, affiches, print et vidéos.',
    empty: 'Les réalisations arrivent bientôt. En attendant, contactez-moi pour discuter de votre projet.',
    all: 'Tout',
  },
  trainingPage: {
    kicker: 'Montez en compétences',
    title: 'Formations & Ebooks',
    subtitle: 'Apprenez à créer des visuels et des vidéos de qualité professionnelle, à votre rythme.',
    formationTitle: 'Formations personnalisées',
    ebookTitle: 'Ebooks à télécharger',
    enroll: "S'inscrire sur WhatsApp",
    buy: 'Acheter sur WhatsApp',
  },
  contactPage: {
    kicker: 'Parlons de votre projet',
    title: 'Contact',
    subtitle: 'Le moyen le plus rapide : WhatsApp. Je réponds vite et le devis est gratuit.',
    formName: 'Votre nom',
    formService: 'Service souhaité',
    formBudget: 'Budget approximatif (FCFA)',
    formMessage: 'Décrivez votre projet',
    formSubmit: 'Envoyer via WhatsApp',
    infoTitle: 'Coordonnées',
    hoursTitle: 'Disponibilité',
    hours: 'Tous les jours · réponse rapide sur WhatsApp',
    selectService: 'Choisir un service',
  },
  footer: {
    tagline: 'Studio de design graphique & vidéo. Votre image, notre priorité.',
    services: 'Services',
    company: 'Entreprise',
    contact: 'Contact',
    rights: 'Tous droits réservés.',
    admin: 'Espace administrateur',
  },
}

export const en: Dict = {
  nav: {
    home: 'Home',
    services: 'Services',
    portfolio: 'Portfolio',
    training: 'Training & Ebooks',
    contact: 'Contact',
    quote: 'Get a quote',
  },
  common: {
    whatsapp: 'WhatsApp',
    call: 'Call',
    from: 'From',
    fcfa: 'FCFA',
    getQuote: 'Get a quote',
    orderNow: 'Order now',
    seeWork: 'See my work',
    langLabel: 'FR',
  },
  hero: {
    badge: 'Design studio · Garoua, Cameroon',
    title: 'Visuals that sell.',
    titleAccent: 'Premium design & video.',
    subtitle:
      'Logos, brand identity, posters, business cards, cinematic advertising videos, training and ebooks. Ultra professional results, delivered fast, at fair prices in FCFA.',
    ctaPrimary: 'Chat about my project on WhatsApp',
    ctaSecondary: 'See my work',
    trust1: 'Fast digital delivery',
    trust2: 'Free quote in minutes',
    trust3: 'Mobile money accepted',
  },
  stats: {
    delivery: 'Digital delivery',
    deliveryValue: '24-72h',
    revisions: 'Revisions included',
    revisionsValue: 'Until you’re happy',
    price: 'Pricing',
    priceValue: 'Fair, in FCFA',
    support: 'WhatsApp reply',
    supportValue: 'Fast',
  },
  servicesSection: {
    kicker: 'What I create for you',
    title: 'A complete studio for your brand',
    subtitle:
      'From the first idea to the final file, ready to print or publish. Every project gets professional attention to detail.',
  },
  services: {
    logo: {
      name: 'Logos & brand identity',
      desc: 'A memorable logo and a consistent identity: colors, typography and variations for all your materials.',
      price: '15 000',
      features: ['High-resolution logo', 'Vector files', 'Color palette', 'Social media versions'],
    },
    social: {
      name: 'Posters & social media visuals',
      desc: 'Posters and posts that grab attention and drive clicks on Facebook, WhatsApp and Instagram.',
      price: '3 000',
      features: ['Formats for each platform', 'Catchy copy included', 'Ready-to-publish files'],
    },
    print: {
      name: 'Business cards & print',
      desc: 'Business cards, flyers, banners and any printed material, designed for a flawless result.',
      price: '5 000',
      features: ['Print-ready files', 'Front / back', 'Printing advice'],
    },
    video: {
      name: 'Advertising videos & editing',
      desc: 'Cinematic, ultra-realistic video ads and announcements, edited or generated to make an impact.',
      price: '25 000',
      features: ['Professional editing', 'Cinematic look', 'Music & voice-over', 'Social & TV formats'],
    },
    training: {
      name: 'Design & video training',
      desc: 'Learn to create your own visuals and videos, step by step, with personalized guidance.',
      price: '20 000',
      features: ['Hands-on sessions', 'Course materials', 'Personalized follow-up', 'Completion certificate'],
    },
    ebooks: {
      name: 'Ebooks',
      desc: 'Professional ebooks to learn design and video, available for instant download.',
      price: '2 000',
      features: ['Instant download', 'Clear, illustrated content', 'Free updates'],
    },
  },
  process: {
    kicker: 'Simple and transparent',
    title: 'How it works',
    steps: [
      { title: 'You reach out', desc: 'A WhatsApp message or a call is enough to describe your need.' },
      { title: 'Free quote', desc: 'I send you a clear price in FCFA and the delivery time.' },
      { title: 'I create', desc: 'I build your project with revisions until you are satisfied.' },
      { title: 'Delivery', desc: 'You receive your digital files, ready to use.' },
    ],
  },
  delivery: {
    kicker: 'Delivery',
    title: 'How you receive your work',
    digital: {
      title: 'Digital delivery',
      desc: 'All files (logos, visuals, videos, ebooks) are delivered digitally, wherever you are.',
    },
    physical: {
      title: 'Physical items',
      desc: 'Business cards and other printed materials delivered to all cities in Cameroon, under the client’s responsibility.',
    },
    free: {
      title: 'Free delivery',
      desc: 'Free delivery within Garoua city center only.',
    },
  },
  finalCta: {
    title: 'Ready to take your brand to the next level?',
    subtitle: 'Send me a message now. Fast reply, free quote, no commitment.',
    button: 'Start my project on WhatsApp',
  },
  portfolio: {
    kicker: 'My work',
    title: 'Portfolio',
    subtitle: 'A glimpse of my creations: logos, posters, print and videos.',
    empty: 'Work samples are coming soon. In the meantime, contact me to discuss your project.',
    all: 'All',
  },
  trainingPage: {
    kicker: 'Level up your skills',
    title: 'Training & Ebooks',
    subtitle: 'Learn to create professional-quality visuals and videos, at your own pace.',
    formationTitle: 'Personalized training',
    ebookTitle: 'Downloadable ebooks',
    enroll: 'Enroll on WhatsApp',
    buy: 'Buy on WhatsApp',
  },
  contactPage: {
    kicker: 'Let’s talk about your project',
    title: 'Contact',
    subtitle: 'The fastest way: WhatsApp. I reply quickly and the quote is free.',
    formName: 'Your name',
    formService: 'Desired service',
    formBudget: 'Approximate budget (FCFA)',
    formMessage: 'Describe your project',
    formSubmit: 'Send via WhatsApp',
    infoTitle: 'Contact details',
    hoursTitle: 'Availability',
    hours: 'Every day · fast reply on WhatsApp',
    selectService: 'Choose a service',
  },
  footer: {
    tagline: 'Graphic design & video studio. Your image is our priority.',
    services: 'Services',
    company: 'Company',
    contact: 'Contact',
    rights: 'All rights reserved.',
    admin: 'Admin area',
  },
}

export const dictionaries: Record<Locale, Dict> = { fr, en }

export const SERVICE_KEYS = ['logo', 'social', 'print', 'video', 'training', 'ebooks'] as const
export type ServiceKey = (typeof SERVICE_KEYS)[number]
