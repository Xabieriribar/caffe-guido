import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  Utensils,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle2,
  X,
  Menu as MenuIcon,
  ArrowRight,
  Sparkles,
  Heart,
  Briefcase
} from 'lucide-react';
import caffeData from './data/caffeData.json';

// Local SVG component to prevent Lucide version discrepancies
const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const categoryTranslations = {
  fr: {
    "Café / Drinks": "Café & Boissons",
    "Pâtisseries / Dolci": "Pâtisseries & Dolci",
    "Desserts / Dolci": "Desserts & Dolci",
    "Boissons / Teas": "Thés & Infusions"
  },
  en: {
    "Café / Drinks": "Coffee & Drinks",
    "Pâtisseries / Dolci": "Pastries & Dolci",
    "Desserts / Dolci": "Desserts & Dolci",
    "Boissons / Teas": "Teas & Infusions"
  },
  it: {
    "Café / Drinks": "Caffè e Bevande",
    "Pâtisseries / Dolci": "Pasticceria e Dolci",
    "Desserts / Dolci": "Dolci e Dessert",
    "Boissons / Teas": "Tè e Infusi"
  }
};

const itemTranslations = {
  fr: {
    "item-sfogliatella": {
      name: "Sfogliatella",
      description: "Pâtisserie napolitaine croustillante en forme de coquillage, garnie de ricotta douce et d'écorces d'orange confites."
    },
    "item-bombolone": {
      name: "Bombolone Pistache",
      description: "Beignet italien saupoudré de sucre, généreusement fourré d'une crème onctueuse aux pistaches vertes de Bronte."
    },
    "item-tiramisu": {
      name: "Tiramisu Spéculoos",
      description: "Une version artisanale du classique italien avec des couches de biscuits spéculoos imbibés d'espresso et crème mascarpone légère."
    },
    "item-macchiato": {
      name: "Caramel Macchiato",
      description: "Espresso de spécialité extrait au feu de bois, lait soyeux et nappage quadrillé de caramel fondant."
    },
    "item-mocchaccino": {
      name: "Mocchaccino",
      description: "Fusion gourmande de notre cacao noir artisanal et d'un double espresso, surmontée d'une mousse de lait fine et poudre de cacao."
    },
    "item-ginseng": {
      name: "Café au Ginseng",
      description: "Une boisson énergisante traditionnelle italienne associant l'espresso à l'extrait de ginseng pour une note douce et terreuse."
    },
    "item-americano": {
      name: "Americano",
      description: "Double espresso signature torréfié au feu de bois à Naples, allongé d'eau chaude pour préserver son corps intense et sa crema."
    },
    "item-the": {
      name: "Thé Chaud Bio",
      description: "Sélection rigoureuse de thés et infusions biologiques, servie dans une théière artisanale pour une pause relaxante."
    }
  },
  en: {
    "item-sfogliatella": {
      name: "Sfogliatella",
      description: "Classic shell-shaped Neapolitan pastry with crisp, flaky layers of laminated dough, filled with sweet ricotta and candied orange peel."
    },
    "item-bombolone": {
      name: "Pistachio Bombolone",
      description: "Sugar-dusted Italian donut filled with a luscious, velvety cream made from authentic Bronte green pistachios."
    },
    "item-tiramisu": {
      name: "Speculoos Tiramisu",
      description: "An artisanal twist on the classic Italian dessert with layers of speculoos biscuits, premium espresso soak, and light mascarpone cream."
    },
    "item-macchiato": {
      name: "Caramel Macchiato",
      description: "Freshly pulled wood-fired espresso layered with velvety steamed milk and a signature crosshatch drizzle of sweet caramel."
    },
    "item-mocchaccino": {
      name: "Mocchaccino",
      description: "A rich fusion of our dark chocolate cocoa base and double-shot espresso, topped with silky microfoam and a dusting of pure cocoa."
    },
    "item-ginseng": {
      name: "Caffè Al Ginseng",
      description: "An energizing, traditional Italian favorite featuring rich espresso infused with aromatic ginseng root extract for a sweet, earthy finish."
    },
    "item-americano": {
      name: "Americano",
      description: "Double shot of our Napoli slow-roasted signature espresso, diluted with hot water to preserve the smooth crema and intense body."
    },
    "item-the": {
      name: "Hot Organic Tea",
      description: "A curated selection of premium organic herbal and black teas, served in an artisanal infusion pot for the ultimate relaxing brew."
    }
  },
  it: {
    "item-sfogliatella": {
      name: "Sfogliatella Napoletana",
      description: "Classico dolce napoletano a forma di conchiglia con sfoglia croccante e sottile, ripieno di ricotta dolce e scorzette d'arancia candite."
    },
    "item-bombolone": {
      name: "Bombolone al Pistacchio",
      description: "Soffice bombolone italiano fritto e zuccherato, farcito con una golosa e vellutata crema al pistacchio verde di Bronte."
    },
    "item-tiramisu": {
      name: "Tiramisù ai Speculoos",
      description: "Una variante artigianale del classico tiramisù con strati di biscotti speculoos inzuppati nel caffè e crema al mascarpone."
    },
    "item-macchiato": {
      name: "Caramel Macchiato",
      description: "Espresso speciale estratto a legna abbinato a latte vellutato e decorato con caramello cremoso."
    },
    "item-mocchaccino": {
      name: "Mocaccino",
      description: "Unione perfetta tra la nostra base al cacao fondente e un doppio espresso, con schiuma di latte e spolverata di cacao."
    },
    "item-ginseng": {
      name: "Caffè al Ginseng",
      description: "Caffè speciale aromatizzato al ginseng, dolce ed energizzante, perfetto per una ricarica di gusto."
    },
    "item-americano": {
      name: "Caffè Americano",
      description: "Doppio espresso napoletano estratto a legna, allungato con acqua calda per mantenere un corpo morbido ed equilibrato."
    },
    "item-the": {
      name: "Tè Caldo Biologico",
      description: "Pregiata selezione di tè e infusi biologici serviti caldi in teiera artigianale, ideali per un momento di relax."
    }
  }
};

const translations = {
  fr: {
    menu: "Menu",
    coffeeCraft: "L'Art du Café",
    heritage: "Notre Histoire",
    liveFeed: "Flux Instagram",
    visit: "Nous Visiter",
    bookingBtn: "Réserver une Table",
    aperto: "Ouvert",
    chiuso: "Fermé",
    hiringBtn: "Nous Recrutons",
    heroTagline: "Bar à Espresso & Cuisine Italienne Authentique",
    heroTitle: "Dégustez la Vraie",
    heroTitleAccent: "Âme Italienne",
    heroDesc: "Un café de quartier à Lausanne inspiré de la culture italienne. Café de spécialité torréfié au feu de bois, pâtisseries artisanales et paninis frais préparés chaque matin.",
    heroMenuBtn: "Découvrir la Carte",
    heroBookBtn: "Réserver un Table",
    heroNaples: "100% Napolitain",
    heroNaplesSub: "Torréfié avec passion",
    coffeeLabel: "L'Extraction d'Or",
    coffeeTitle: "Café de Spécialité,",
    coffeeTitleAccent: "Culture Italienne.",
    coffeeDesc1: "Chez Guido Caffè, le café n'est pas une simple routine, c'est un véritable rituel. Nos mélanges sur mesure sont torréfiés lentement dans des fours à bois traditionnels près de Naples, capturant une texture ronde et des nuances de chocolat noir persistant en bouche.",
    coffeeDesc2: "Chaque espresso, macchiato et flat white est extrait avec précision en contrôlant la pression et en utilisant du lait frais sélectionné, pour une crème noisette dense et persistante sans sucre ajouté.",
    coffeeSpec1: "Monorigine",
    coffeeSpec1Sub: "Sourcing éthique",
    coffeeSpec2: "Crème Intense",
    coffeeSpec2Sub: "Profil de Naples",
    menuLabel: "Notre Carte",
    menuTitle: "Nos Spécialités",
    menuDesc: "Paninis pressés à la main, espressos fraîchement extraits et pâtisseries siciliennes authentiques assemblées chaque matin.",
    menuNoticeTitle: "Restrictions alimentaires ou Allergies ?",
    menuNoticeDesc: "Notre cuisine traite les ingrédients avec des protocoles de sécurité stricts. Veuillez informer notre équipe chaleureuse de toute sensibilité au gluten, produits laitiers ou fruits à coque !",
    menuNoticeBtn: "Demander au Barista",
    menuOrderBtn: "Commander",
    heritageLabel: "Notre Fondateur",
    heritageTitle: "Héritage, Passion &",
    heritageTitleAccent: "L'Esprit Trattoria.",
    heritageOwnerTitle: "Guido Caffè",
    heritageOwnerSub: "L'Âme de Lausanne • Depuis 2024",
    badgeArtisan: "Moutures Artisanales",
    badgeArtisanSub: "Cafés lents torréfiés au feu de bois.",
    badgeCucina: "Cuisine Napolitaine",
    badgeCucinaSub: "Pâtisseries et paninis croustillants faits maison.",
    instaLabel: "Rejoignez @guidocaffe",
    instaTitle: "Notre Story Instagram",
    instaDesc: "Découvrez nos créations quotidiennes et notre communauté chaleureuse. Partagez votre expérience avec le hashtag",
    instaFollow: "Suivre @guidocaffe",
    visitLabel: "À Bientôt !",
    visitTitle: "Venez Nous Voir",
    visitDesc: "Situé dans le charmant quartier commerçant de Lausanne. Suivez l'arôme du café fraîchement moulu !",
    visitLoc: "Adresse",
    visitDirections: "Itinéraire →",
    visitHours: "Horaires d'Ouverture",
    visitWeekdays: "Semaine :",
    visitWeekends: "Week-end :",
    visitContact: "Contact & Réservations",
    visitCardTitle: "La Trattoria Lausanne",
    visitCardDesc: "Situé directement au Av. du Chablais 53. Sièges de bistrot traditionnels, éclairage chaleureux et hospitalité napolitaine.",
    footerDesc: "Torréfaction de style napolitain, pâtisseries traditionnelles artisanales et espaces communautaires chaleureux pour illuminer votre journée.",
    footerNav: "Navigation",
    footerHours: "Horaires",
    footerNewsletter: "Newsletter",
    footerNewsletterDesc: "Abonnez-vous pour être informé des cafés spéciaux, des paninis du chef et des soirées musicales italiennes !",
    footerJoin: "S'abonner",
    footerCopy: "Tous droits réservés.",
    footerCrafted: "Fait avec amour à Lausanne",
    resLabel: "Table Chaude",
    resTitle: "Réserver une Table",
    resDesc: "Choisissez la date, le nombre de personnes et l'heure. Notre équipe confirmera votre table sous 15 minutes !",
    resName: "Votre Nom",
    resEmail: "Adresse E-mail",
    resDate: "Date",
    resHour: "Heure",
    resGuests: "Personnes",
    resNotes: "Notes de régime / Préférences",
    resSubmit: "Confirmer la Réservation",
    resSuccessTitle: "Grazie Mille !",
    resSuccessDesc: "Votre table a été réservée avec succès.",
    resSuccessMail: "Un e-mail de confirmation vous a été envoyé. À bientôt à Lausanne !",
    hireLabel: "Rejoignez l'équipe",
    hireTitle: "Nous Recrutons !",
    hireDesc: "Vous êtes passionné de café de spécialité et de service client chaleureux ? Découvrez nos opportunités et postulez dès aujourd'hui !",
    hirePositions: "Postes Ouverts",
    hireRole: "Poste recherché",
    hireMessage: "Pourquoi vous ? (Message)",
    hireSubmit: "Envoyer ma candidature",
    hireSuccessTitle: "Candidature Envoyée !",
    hireSuccessDesc: "Grazie mille pour votre intérêt !",
    hireSuccessSub: "Notre équipe analysera votre profil et vous répondra sous 48 heures. À bientôt !",
    roleBarista: "Barista (Temps plein)",
    roleManager: "Manager (Temps plein)",
    roleAssistant: "Assistant rush de midi (Temps partiel)",
    menuBadge: "Recette Authentique",
    resNotesPlaceholder: "Sensibilités alimentaires, anniversaire, table en terrasse...",
    hireApplyToday: "Postuler Aujourd'hui",
    hireMessagePlaceholder: "Racontez-nous votre expérience de barista ou de manager...",
    footerEmailPlaceholder: "Adresse e-mail",
    coffeeSpecLabel: "Sélection Traditionnelle de Torréfaction Lente",
    serviceStatus: "Mode de Service",
    serviceDineIn: "Sur place",
    serviceTakeaway: "À emporter",
    serviceDelivery: "Livraison"
  },
  en: {
    menu: "Menu",
    coffeeCraft: "Coffee Craft",
    heritage: "Our Story",
    liveFeed: "Instagram Feed",
    visit: "Visit",
    bookingBtn: "Book a Table",
    aperto: "Open",
    chiuso: "Closed",
    hiringBtn: "We Are Hiring",
    heroTagline: "Authentic Espresso Bar & Italian Kitchen",
    heroTitle: "Taste the True",
    heroTitleAccent: "Italian Soul",
    heroDesc: "A cozy neighborhood coffee shop in Lausanne inspired by Italian culture. Wood-fired specialty coffee, handmade pastries, and fresh paninis assembled daily.",
    heroMenuBtn: "Browse Menu",
    heroBookBtn: "Book a Table",
    heroNaples: "100% Napoletano",
    heroNaplesSub: "Roasted with pure passion",
    coffeeLabel: "The Golden Extraction",
    coffeeTitle: "Specialty Coffee,",
    coffeeTitleAccent: "Italian Culture.",
    coffeeDesc1: "At Guido Caffè, coffee is not just a routine—it's an absolute ritual. Our custom-curated blends are slow-roasted in traditional wood-fired ovens near Naples, capturing a smooth, heavy-bodied texture and dark chocolate undertones.",
    coffeeDesc2: "Every espresso, macchiato, and flat white is drawn programmatically using strictly monitored pressure extractions and hand-selected raw milk, resulting in a dense, persistent crema.",
    coffeeSpec1: "Single Origin",
    coffeeSpec1Sub: "Ethical Sourcing",
    coffeeSpec2: "Crema Intensa",
    coffeeSpec2Sub: "Naples Profile",
    menuLabel: "Our Menu",
    menuTitle: "Authentic Offerings",
    menuDesc: "Hand-pressed paninis, freshly pulled espressos, and authentic Sicilian pastries assembled fresh every morning.",
    menuNoticeTitle: "Dietary restrictions or Allergens?",
    menuNoticeDesc: "Our kitchen treats raw ingredients with strict safety protocols. Please tell our warm waitstaff about any dairy, gluten, or nut sensitivities so we can accommodate you!",
    menuNoticeBtn: "Ask the Barista",
    menuOrderBtn: "Order Now",
    heritageLabel: "Our Founder",
    heritageTitle: "Heritage, Passion &",
    heritageTitleAccent: "The Cozy Trattoria.",
    heritageOwnerTitle: "Guido Caffe",
    heritageOwnerSub: "L'Anima di Losanna • Since 2024",
    badgeArtisan: "Artisan Grinds",
    badgeArtisanSub: "Slow wood-fired dark chocolate Naples profiles.",
    badgeCucina: "Napoli Cucina",
    badgeCucinaSub: "Daily handcrafted Dolci & rustic crusty Paninis.",
    instaLabel: "Join @guidocaffe",
    instaTitle: "Our Instagram Story",
    instaDesc: "Explore our real daily creations and cozy community feed. Share your experience with hashtag",
    instaFollow: "Follow @guidocaffe",
    visitLabel: "See You Soon!",
    visitTitle: "Come Visit Us",
    visitDesc: "Located in the beautiful neighborhood shopping district of Lausanne. Follow the aroma of slow-roast espresso grinds!",
    visitLoc: "Location",
    visitDirections: "Get Directions →",
    visitHours: "Hours of Operation",
    visitWeekdays: "Weekdays:",
    visitWeekends: "Weekends:",
    visitContact: "Contact & Bookings",
    visitCardTitle: "La Trattoria Lausanne",
    visitCardDesc: "Positioned directly on Av. du Chablais 53. Featuring traditional bistro seating, warm lighting, and Napoletano hospitality.",
    footerDesc: "Sourcing Napoletano-style grinds, assembling traditional dolci, and constructing warm community spaces to brighten your day.",
    footerNav: "Navigation",
    footerHours: "Hours",
    footerNewsletter: "Newsletter",
    footerNewsletterDesc: "Subscribe to stay updated on special roasts, chef paninis, and live Italian music events!",
    footerJoin: "Join",
    footerCopy: "All Rights Reserved.",
    footerCrafted: "Crafted with love in Lausanne",
    resLabel: "Cozy Table",
    resTitle: "Book A Table",
    resDesc: "Select date, guests, and hour preference. Our warm staff will lock your table within 15 minutes!",
    resName: "Your Name",
    resEmail: "Email Address",
    resDate: "Date",
    resHour: "Hour",
    resGuests: "Guests",
    resNotes: "Dietary Notes / Preferences",
    resSubmit: "Confirm Booking",
    resSuccessTitle: "Grazie Mille!",
    resSuccessDesc: "Your reservation has been locked successfully.",
    resSuccessMail: "A confirmation email has been dispatched. See you in Lausanne!",
    hireLabel: "Join our team",
    hireTitle: "We Are Hiring!",
    hireDesc: "Are you passionate about specialty coffee and warm hospitality? Explore our openings and apply today!",
    hirePositions: "Open Positions",
    hireRole: "Target Role",
    hireMessage: "Why you? (Message)",
    hireSubmit: "Submit Application",
    hireSuccessTitle: "Application Submitted!",
    hireSuccessDesc: "Grazie mille for your interest!",
    hireSuccessSub: "Our team will review your application and respond within 48 hours. See you soon!",
    roleBarista: "Barista (Full-time)",
    roleManager: "Cafe Manager (Full-time)",
    roleAssistant: "Midday Rush Assistant (Part-time)",
    menuBadge: "Authentic Recipe",
    resNotesPlaceholder: "Dietary restrictions, birthday surprise, outdoor terrace table...",
    hireApplyToday: "Apply Today",
    hireMessagePlaceholder: "Tell us about your barista or management experience...",
    footerEmailPlaceholder: "Email address",
    coffeeSpecLabel: "Slow-Roasted Heritage Selection",
    serviceStatus: "Service Options",
    serviceDineIn: "Dine-in",
    serviceTakeaway: "Takeaway",
    serviceDelivery: "Delivery"
  },
  it: {
    menu: "Menu",
    coffeeCraft: "L'Arte del Caffè",
    heritage: "La Nostra Storia",
    liveFeed: "Feed Instagram",
    visit: "Vieni a Trovarci",
    bookingBtn: "Prenota un Tavolo",
    aperto: "Aperto",
    chiuso: "Chiuso",
    hiringBtn: "Lavora con Noi",
    heroTagline: "Espresso Bar & Cucina Italiana Autentica",
    heroTitle: "Assapora la Vera",
    heroTitleAccent: "Anima Italiana",
    heroDesc: "Una caffetteria di quartiere a Losanna ispirata alla cultura italiana. Caffè speciale tostato a legna, dolci artigianali e panini freschi preparati ogni mattina.",
    heroMenuBtn: "Sfoglia il Menu",
    heroBookBtn: "Prenota un Tavolo",
    heroNaples: "100% Napoletano",
    heroNaplesSub: "Tostato con pura passione",
    coffeeLabel: "L'Estrazione d'Oro",
    coffeeTitle: "Specialty Coffee,",
    coffeeTitleAccent: "Cultura Italiana.",
    coffeeDesc1: "Da Guido Caffè, il caffè non è una semplice routine, è un vero e proprio rito. Le nostre miscele personalizzate sono tostate lentamente in tradizionali forni a legna vicino a Napoli, catturando una consistenza rotonda e sfumature persistenti di cioccolato fondente.",
    coffeeDesc2: "Ogni espresso, macchiato e flat white viene estratto con precisione controllando la pressione e utilizzando latte fresco selezionato, per una crema densa color nocciola senza zuccheri aggiunti.",
    coffeeSpec1: "Monorigine",
    coffeeSpec1Sub: "Sourcing etico",
    coffeeSpec2: "Crema Intensa",
    coffeeSpec2Sub: "Profilo Napoletano",
    menuLabel: "Il Nostro Menu",
    menuTitle: "Specialità Autentiche",
    menuDesc: "Panini pressati a mano, espressi appena estratti e autentici dolci siciliani assemblati freschi ogni mattina.",
    menuNoticeTitle: "Intolleranze alimentari o Allergie?",
    menuNoticeDesc: "La nostra cucina tratta gli ingredienti con rigidi protocolli di sicurezza. Ti preghiamo di segnalare al nostro staff eventuali sensibilità a glutine, latticini o frutta a guscio!",
    menuNoticeBtn: "Chieidi al Barista",
    menuOrderBtn: "Ordina Ora",
    heritageLabel: "Il Fondatore",
    heritageTitle: "Eredità, Passione &",
    heritageTitleAccent: "Lo Spirito di Trattoria.",
    heritageOwnerTitle: "Guido Caffè",
    heritageOwnerSub: "L'Anima di Losanna • Dal 2024",
    badgeArtisan: "Macinatura Artigianale",
    badgeArtisanSub: "Caffè a tostatura lenta a legna dal profilo napoletano.",
    badgeCucina: "Cucina Napoletana",
    badgeCucinaSub: "Dolci fatti a mano giornalmente e panini rustici croccanti.",
    instaLabel: "Segui @guidocaffe",
    instaTitle: "La Nostra Storia su Instagram",
    instaDesc: "Esplora le nostre creazioni quotidiane e la nostra calda community. Condividi la tua esperienza con l'hashtag",
    instaFollow: "Segui @guidocaffe",
    visitLabel: "A Presto!",
    visitTitle: "Vieni a Trovarci",
    visitDesc: "Situato nel bellissimo quartiere commerciale di Losanna. Segui l'aroma del caffè tostato a legna!",
    visitLoc: "Direzione",
    visitDirections: "Ottieni Indicazioni →",
    visitHours: "Orari di Apertura",
    visitWeekdays: "Feriali:",
    visitWeekends: "Fine Settimana:",
    visitContact: "Contatti & Prenotazioni",
    visitCardTitle: "La Trattoria Losanna",
    visitCardDesc: "Situato direttamente in Av. du Chablais 53. Caratterizzato da sedute bistrot tradizionali, illuminazione calda e ospitalità napoletana.",
    footerDesc: "Miscela in stile napoletano, dolci artigianali tradizionali e caldi spazi comunitari per illuminare la tua giornata.",
    footerNav: "Navigazione",
    footerHours: "Orari",
    footerNewsletter: "Newsletter",
    footerNewsletterDesc: "Iscriviti per rimanere aggiornato su tostature speciali, panini dello chef ed eventi di musica italiana dal vivo!",
    footerJoin: "Iscriviti",
    footerCopy: "Tutti i Diritti Riservati.",
    footerCrafted: "Realizzato con amore a Losanna",
    resLabel: "Tavolo Caldo",
    resTitle: "Prenota un Tavolo",
    resDesc: "Scegli data, ospiti e ora. Il nostro staff confermerà il tuo tavolo entro 15 minuti!",
    resName: "Il Tuo Nome",
    resEmail: "Indirizzo E-mail",
    resDate: "Data",
    resHour: "Ora",
    resGuests: "Persone",
    resNotes: "Note dietetiche / Preferenze",
    resSubmit: "Conferma Prenotazione",
    resSuccessTitle: "Grazie Mille!",
    resSuccessDesc: "La tua prenotazione è stata bloccata con successo.",
    resSuccessMail: "È stata inviata un'e-mail di conferma. Ci vediamo a Losanna!",
    hireLabel: "Lavora con noi",
    hireTitle: "Posizioni Aperte!",
    hireDesc: "Sei appassionato di caffè speciale e ospitalità calorosa? Esplora le nostre posizioni e candidati oggi stesso!",
    hirePositions: "Ruoli Disponibili",
    hireRole: "Ruolo di Interesse",
    hireMessage: "Perché tu? (Messaggio)",
    hireSubmit: "Invia Candidatura",
    hireSuccessTitle: "Candidatura Inviata!",
    hireSuccessDesc: "Grazie mille per l'interesse!",
    hireSuccessSub: "Il nostro team valuterà il tuo profilo e ti risponderà entro 48 ore. A presto!",
    roleBarista: "Barista (Tempo pieno)",
    roleManager: "Gestore Caffè (Tempo pieno)",
    roleAssistant: "Assistente rush di mezzogiorno (Part-time)",
    menuBadge: "Ricetta Autentica",
    resNotesPlaceholder: "Restrizioni alimentari, compleanno, tavolo in terrazza...",
    hireApplyToday: "Candidati Oggi",
    hireMessagePlaceholder: "Raccontaci la tua esperienza come barista o manager...",
    footerEmailPlaceholder: "Indirizzo e-mail",
    coffeeSpecLabel: "Selezione Tradizionale a Tostatura Lenta",
    serviceStatus: "Opzioni di Servizio",
    serviceDineIn: "Consumazione sul posto",
    serviceTakeaway: "Da asporto",
    serviceDelivery: "Consegna a domicilio"
  }
};

export default function App() {
  const [lang, setLang] = useState('fr'); // Default to French
  const [activeCategory, setActiveCategory] = useState(caffeData.menu.categories[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [hiringSuccess, setHiringSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);
  
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    notes: ''
  });

  const [hiringForm, setHiringForm] = useState({
    name: '',
    email: '',
    role: 'barista',
    message: ''
  });

  const t = translations[lang];

  // Opening Hours Status Checker
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay();
      
      const isWeekend = currentDay === 0 || currentDay === 6;
      if (isWeekend) {
        setIsOpenNow(currentHour >= 9 && currentHour < 17);
      } else {
        setIsOpenNow(currentHour >= 8 && currentHour < 18);
      }
    };
    
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard Escape Keydown Handler for Accessible Modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsHiringModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Curation / Filtering Pipeline: Excludes text promotional flyers from standard visuals
  const isPromoOrHiringPost = (post) => {
    const captionLower = (post.caption || "").toLowerCase();
    const isRecrutement = captionLower.includes("recrutons") || 
                          captionLower.includes("hiring") || 
                          captionLower.includes("cdi") || 
                          captionLower.includes("recrute") || 
                          captionLower.includes("barista senior") ||
                          captionLower.includes("rejoignez");
    const isHiringFile = post.imageUrl.includes("storefront.jpg") || 
                         post.imageUrl.includes("coffee.jpg") || 
                         post.imageUrl.includes("pastry.jpg");
    return isRecrutement || isHiringFile;
  };

  const promoPosts = caffeData.instagramPosts.filter(post => isPromoOrHiringPost(post));
  const productPosts = caffeData.instagramPosts.filter(post => !isPromoOrHiringPost(post));

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setBookingSuccess(false);
      setBookingForm({ name: '', email: '', date: '', time: '', guests: '2', notes: '' });
    }, 3000);
  };

  const handleHiringSubmit = (e) => {
    e.preventDefault();
    setHiringSuccess(true);
    setTimeout(() => {
      setIsHiringModalOpen(false);
      setHiringSuccess(false);
      setHiringForm({ name: '', email: '', role: 'barista', message: '' });
    }, 3500);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleHiringChange = (e) => {
    const { name, value } = e.target;
    setHiringForm(prev => ({ ...prev, [name]: value }));
  };

  const filteredMenuItems = caffeData.menu.items.filter(
    item => item.category === activeCategory
  );

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#111111] font-sans selection:bg-cafe-crimson selection:text-white">
      
      {/* 1. Header & Navigation Component */}
      <header className="sticky top-0 z-40 w-full glassmorphism transition-all duration-300">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo / Branding block */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cafe-crimson flex items-center justify-center text-white border-2 border-white shadow-md transform -rotate-3 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-2xl font-black tracking-tight text-cafe-crimson uppercase whitespace-nowrap">
                GUIDO CAFFÈ
              </span>
              <span className="block text-[8px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.25em] uppercase text-cafe-olive font-extrabold -mt-1 whitespace-nowrap">
                Lausanne • Bar &amp; Cucina
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-6 font-bold text-xs tracking-wide text-neutral-800 uppercase" aria-label="Desktop navigation">
            <button onClick={() => scrollToSection('menu')} className="hover:text-cafe-crimson transition-colors duration-200 cursor-pointer">{t.menu}</button>
            <button onClick={() => scrollToSection('coffee-craft')} className="hover:text-cafe-crimson transition-colors duration-200 cursor-pointer">{t.coffeeCraft}</button>
            <button onClick={() => scrollToSection('heritage')} className="hover:text-cafe-crimson transition-colors duration-200 cursor-pointer">{t.heritage}</button>
            <button onClick={() => scrollToSection('gallery')} className="hover:text-cafe-crimson transition-colors duration-200 cursor-pointer">{t.liveFeed}</button>
            <button onClick={() => scrollToSection('visit')} className="hover:text-cafe-crimson transition-colors duration-200 cursor-pointer">{t.visit}</button>
          </nav>

          {/* Language Switcher Buttons with Safe Contrast and Outlines */}
          <div className="flex items-center space-x-0.5 bg-neutral-100/80 border border-neutral-200 p-0.5 rounded-full shadow-inner whitespace-nowrap" aria-label="Language selector">
            {['fr', 'en', 'it'].map((langCode) => (
              <button
                key={langCode}
                onClick={() => setLang(langCode)}
                aria-label={`Switch to ${langCode === 'fr' ? 'French' : langCode === 'it' ? 'Italian' : 'English'}`}
                className={`px-3 py-1.5 text-[9px] font-black uppercase transition-all duration-200 cursor-pointer rounded-full focus:outline-none focus:ring-1 focus:ring-cafe-crimson/50 ${
                  lang === langCode 
                    ? 'bg-cafe-crimson text-white shadow-md' 
                    : 'text-neutral-700 hover:text-cafe-crimson hover:bg-cafe-crimson/5'
                }`}
              >
                {langCode}
              </button>
            ))}
          </div>

          {/* Right Action Menu */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setIsHiringModalOpen(true)}
              aria-label={t.hiringBtn}
              className="px-4 py-2 rounded-full border border-cafe-crimson/40 hover:border-cafe-crimson hover:bg-cafe-crimson/5 text-cafe-crimson text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center space-x-1.5 focus:ring-2 focus:ring-cafe-crimson focus:outline-none"
            >
              <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.hiringBtn}</span>
            </button>

            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wide shadow-sm whitespace-nowrap ${
              isOpenNow 
                ? 'border-cafe-olive/30 bg-cafe-olive/5 text-cafe-olive' 
                : 'border-cafe-crimson/30 bg-cafe-crimson/5 text-cafe-crimson'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-cafe-olive animate-pulse' : 'bg-cafe-crimson'}`} />
              <span>{isOpenNow ? t.aperto : t.chiuso}</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 rounded-full bg-cafe-crimson hover:bg-cafe-dark hover:text-white border border-cafe-crimson text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md whitespace-nowrap cursor-pointer focus:ring-2 focus:ring-cafe-crimson focus:outline-none"
            >
              {t.bookingBtn}
            </button>
          </div>

          {/* Mobile Menu Action Elements */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setIsHiringModalOpen(true)}
              className="p-2 rounded-full border border-cafe-crimson/40 text-cafe-crimson hover:bg-cafe-crimson/5 cursor-pointer focus:ring-2 focus:ring-cafe-crimson focus:outline-none"
              title="We Are Hiring"
              aria-label="View openings"
            >
              <Briefcase className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-cafe-crimson text-white border border-cafe-crimson cursor-pointer focus:ring-2 focus:ring-cafe-crimson focus:outline-none"
              aria-label="Toggle menu"
            >
              <MenuIcon className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-0 w-full bg-[#fafaf9] border-b-2 border-cafe-crimson shadow-xl px-6 py-6 flex flex-col space-y-4 lg:hidden z-30"
            >
              <button onClick={() => scrollToSection('menu')} className="text-left py-2 font-black uppercase text-sm tracking-wider border-b border-neutral-200 cursor-pointer">{t.menu}</button>
              <button onClick={() => scrollToSection('coffee-craft')} className="text-left py-2 font-black uppercase text-sm tracking-wider border-b border-neutral-200 cursor-pointer">{t.coffeeCraft}</button>
              <button onClick={() => scrollToSection('heritage')} className="text-left py-2 font-black uppercase text-sm tracking-wider border-b border-neutral-200 cursor-pointer">{t.heritage}</button>
              <button onClick={() => scrollToSection('gallery')} className="text-left py-2 font-black uppercase text-sm tracking-wider border-b border-neutral-200 cursor-pointer">{t.liveFeed}</button>
              <button onClick={() => scrollToSection('visit')} className="text-left py-2 font-black uppercase text-sm tracking-wider border-b border-neutral-200 cursor-pointer">{t.visit}</button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full py-3 rounded-md bg-cafe-crimson hover:bg-cafe-dark text-white font-black uppercase tracking-wider text-center mt-2 transition-all duration-300 border-2 border-cafe-crimson cursor-pointer"
              >
                {t.bookingBtn}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Structural Layout Wrapper */}
      <main>

        {/* 2. Hero Component Banner */}
        <section className="relative bg-[#fafaf9] border-b-2 border-cafe-crimson overflow-hidden">
          {/* Decorative Checkered Side Panel */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-checkered-light opacity-60 z-0 pointer-events-none hidden lg:block border-l-2 border-dashed border-cafe-crimson/30" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Copy (7 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-cafe-crimson text-white text-xs font-black uppercase tracking-wider border border-cafe-crimson shadow-sm">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.heroTagline}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-none text-cafe-dark uppercase">
                {t.heroTitle} <br />
                <span className="text-cafe-crimson decoration-cafe-olive underline decoration-wavy underline-offset-4 sm:underline-offset-8">
                  {t.heroTitleAccent}
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-neutral-700 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t.heroDesc}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  onClick={() => scrollToSection('menu')}
                  className="w-full sm:w-auto px-8 py-4 rounded-md bg-cafe-crimson hover:bg-cafe-dark border-2 border-cafe-crimson hover:border-cafe-dark text-white font-black uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer group focus:ring-2 focus:ring-cafe-crimson focus:outline-none"
                >
                  <span>{t.heroMenuBtn}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-md border-2 border-cafe-crimson hover:bg-cafe-crimson/5 text-cafe-crimson font-black uppercase tracking-wider transition-all duration-300 cursor-pointer bg-white focus:ring-2 focus:ring-cafe-crimson focus:outline-none"
                >
                  {t.heroBookBtn}
                </button>
              </div>
            </motion.div>

            {/* Hero Visual: Aspect-ratio object-fitting and zero flat text banners */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md aspect-[4/5] storefront-sketch bg-white p-3">
                {/* Main Image: Replaced storefront flyer with cinematic barista art closeup */}
                <div className="w-full h-full overflow-hidden border-2 border-cafe-crimson bg-neutral-100">
                  <img
                    src="/assets/instagram/barista.jpg"
                    alt="Barista pouring a perfect espresso shot showcasing rich crema"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Floating Italian Checkered Badge */}
                <div className="absolute -bottom-4 left-4 sm:-bottom-6 sm:-left-6 z-20 bg-checkered-light border-2 border-cafe-crimson p-3 sm:p-4 rounded shadow-xl max-w-xs flex items-center space-x-3 whitespace-nowrap">
                  <div className="p-2 bg-cafe-crimson text-white rounded">
                    <Coffee className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block font-serif text-sm font-black text-cafe-crimson uppercase">{t.heroNaples}</span>
                    <span className="block text-[9px] text-neutral-700 font-black uppercase">{t.heroNaplesSub}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Bold Checkered Divider (Traditional Italian table runner vibe) */}
        <div className="bg-checkered-divider w-full" />

        {/* 4. Specialty Coffee Section */}
        <section id="coffee-craft" className="py-20 lg:py-28 bg-white border-b-2 border-cafe-crimson relative overflow-hidden">
          {/* Subtle Checkered Accent Grid on the left */}
          <div className="absolute top-1/4 left-0 w-32 h-1/2 bg-checkered-light opacity-40 z-0 pointer-events-none border-r-2 border-dashed border-cafe-crimson/20" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Visual extraction pour banner (6 cols) */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                
                {/* Box 1: Coffee Extract */}
                <div className="storefront-sketch p-2 bg-white transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-square w-full overflow-hidden border border-cafe-crimson bg-neutral-100">
                    <img
                      src="/assets/instagram/post_11.jpg"
                      alt="Double shot espresso showing rich chocolate brown crema"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="block text-[10px] uppercase font-black tracking-wider text-center mt-2 text-cafe-crimson">
                    La Crema Perfetta
                  </span>
                </div>

                {/* Box 2: Barista Craft */}
                <div className="storefront-sketch p-2 bg-white transform rotate-3 hover:rotate-0 transition-transform duration-300 mt-6">
                  <div className="aspect-square w-full overflow-hidden border border-cafe-crimson bg-neutral-100">
                    <img
                      src="/assets/instagram/barista.jpg"
                      alt="Barista steam milking for artisanal cappuccino"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="block text-[10px] uppercase font-black tracking-wider text-center mt-2 text-cafe-crimson">
                    L'Arte Del Caffè
                  </span>
                </div>

                {/* Box 3: Pistachio Croissants closeup */}
                <div className="col-span-2 storefront-sketch p-2 bg-white mt-2">
                  <div className="h-48 w-full overflow-hidden border border-cafe-crimson bg-neutral-100">
                    <img
                      src="/assets/instagram/details.jpg"
                      alt="Close up of wood-fired roasted Guido coffee beans"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="block text-[10px] uppercase font-black tracking-wider text-center mt-2 text-cafe-crimson">
                    {t.coffeeSpecLabel}
                  </span>
                </div>
              </div>

              {/* Right Column: Copywriting (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest font-black text-cafe-crimson block">
                    {t.coffeeLabel}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-cafe-dark leading-none uppercase">
                    {t.coffeeTitle} <br />
                    <span className="text-cafe-crimson">{t.coffeeTitleAccent}</span>
                  </h2>
                </div>
                
                <div className="w-20 h-1.5 bg-cafe-crimson rounded-full" />
                
                <p className="text-neutral-700 text-lg leading-relaxed font-medium">
                  {t.coffeeDesc1}
                </p>
                
                <p className="text-neutral-600 leading-relaxed">
                  {t.coffeeDesc2}
                </p>

                {/* Coffee Spec Grid */}
                <div className="grid grid-cols-2 gap-4 border-2 border-cafe-crimson p-5 bg-[#fafaf9] relative overflow-hidden">
                  <div className="absolute inset-0 bg-checkered-light opacity-20 pointer-events-none" />
                  <div className="relative z-10 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-cafe-crimson text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <span className="block font-black text-xs uppercase text-cafe-crimson">{t.coffeeSpec1}</span>
                      <span className="block text-[10px] text-neutral-500 font-extrabold uppercase">{t.coffeeSpec1Sub}</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-cafe-crimson text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <span className="block font-black text-xs uppercase text-cafe-crimson">{t.coffeeSpec2}</span>
                      <span className="block text-[10px] text-neutral-500 font-extrabold uppercase">{t.coffeeSpec2Sub}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Checkered Divider */}
        <div className="bg-checkered-divider w-full" />

        {/* 6. Digital Interactive Menu Section */}
        <section id="menu" className="py-20 lg:py-28 bg-[#fafaf9] border-b-2 border-cafe-crimson relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-cafe-crimson hidden lg:block" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Menu Title Block */}
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest font-black text-white inline-block px-4 py-1.5 bg-cafe-crimson border-2 border-white shadow-md transform -rotate-1">
                {t.menuLabel}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-cafe-dark uppercase">
                {t.menuTitle}
              </h2>
              <p className="text-neutral-700 font-bold leading-relaxed">
                {t.menuDesc}
              </p>
            </div>

            {/* Interactive Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12 border-b-2 border-cafe-crimson pb-6">
              {caffeData.menu.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 border-2 font-black uppercase text-xs tracking-wider transition-all duration-350 cursor-pointer focus:ring-2 focus:ring-cafe-crimson focus:outline-none ${
                    activeCategory === category
                      ? 'bg-cafe-crimson text-white border-cafe-crimson shadow-md transform -translate-y-1'
                      : 'bg-white text-neutral-800 hover:bg-cafe-crimson/5 border-cafe-crimson'
                  }`}
                >
                  {categoryTranslations[lang]?.[category] || category}
                </button>
              ))}
            </div>

            {/* Interactive Grid with Uniform Heights */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredMenuItems.map((item) => {
                  const details = itemTranslations[lang]?.[item.id] || { name: item.name, description: item.description };
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={item.id}
                      className="bg-white border-2 border-cafe-crimson shadow-sm flex flex-col justify-between hover-lift relative overflow-hidden group h-full"
                    >
                      
                      {/* Menu Item Image (Guaranteed 100% flat text-free!) */}
                      {item.imageUrl && (
                        <div className="h-52 w-full overflow-hidden bg-neutral-100 relative border-b-2 border-cafe-crimson">
                          <img
                            src={item.imageUrl}
                            alt={`Authentic preparation of our ${details.name}`}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3 bg-white border border-cafe-crimson px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-cafe-crimson shadow-md">
                            {t.menuBadge}
                          </div>
                        </div>
                      )}

                      {/* Body Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          {/* Header: Name, Price, Tags */}
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-lg font-black text-cafe-dark group-hover:text-cafe-crimson transition-colors duration-200 uppercase leading-tight">
                              {details.name}
                            </h3>
                            <span className="font-serif text-base font-black text-white bg-cafe-crimson border border-cafe-crimson px-2.5 py-0.5 shadow-sm">
                              {item.price}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-neutral-600 font-medium text-xs leading-relaxed">
                            {details.description}
                          </p>
                        </div>

                        {/* Footing: Tags & Button */}
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-dashed border-cafe-crimson/30">
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <span key={tag} className="text-[8px] uppercase font-black tracking-widest px-2 py-0.5 bg-cafe-crimson/10 text-cafe-crimson border border-cafe-crimson/20 rounded-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-[10px] uppercase font-black tracking-wider text-cafe-crimson hover:text-cafe-dark flex items-center space-x-1 cursor-pointer transition-colors focus:outline-none focus:underline"
                          >
                            <span>{t.menuOrderBtn}</span>
                            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Quick Notice Card styled with traditional linen background */}
            <div className="mt-16 bg-[#ffffff] border-2 border-cafe-crimson p-8 lg:p-12 text-cafe-dark relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-xl">
              <div className="absolute inset-0 bg-checkered-light opacity-30 pointer-events-none" />
              <div className="space-y-2 text-center md:text-left max-w-xl z-10 relative">
                <h3 className="font-serif text-2xl lg:text-3xl font-black text-cafe-crimson uppercase">{t.menuNoticeTitle}</h3>
                <p className="text-neutral-700 font-bold text-sm sm:text-base leading-relaxed">
                  {t.menuNoticeDesc}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 md:mt-0 px-8 py-4 bg-cafe-crimson hover:bg-cafe-dark hover:text-white border-2 border-cafe-crimson text-white font-black uppercase text-xs tracking-widest transition-all duration-300 shadow-md shrink-0 z-10 cursor-pointer focus:ring-2 focus:ring-white focus:outline-none"
              >
                {t.menuNoticeBtn}
              </button>
            </div>
          </div>
        </section>

        {/* 7. Checkered Divider */}
        <div className="bg-checkered-divider w-full" />

        {/* 8. Heritage / About Us Section */}
        <section id="heritage" className="py-20 lg:py-28 bg-[#fafaf9] border-b-2 border-cafe-crimson relative overflow-hidden">
          {/* Accent Gingham Checkered Panel on right side */}
          <div className="absolute top-0 right-0 w-1/4 h-full bg-checkered-light opacity-50 z-0 pointer-events-none border-l-2 border-dashed border-cafe-crimson/30 hidden lg:block" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Copywriting (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest font-black text-cafe-crimson block">
                    {t.heritageLabel}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-cafe-dark leading-none uppercase">
                    {t.heritageTitle} <br />
                    <span className="text-cafe-crimson">{t.heritageTitleAccent}</span>
                  </h2>
                </div>
                
                <div className="w-20 h-1.5 bg-cafe-crimson rounded-full" />
                
                <div className="space-y-4 text-neutral-700 text-lg leading-relaxed font-medium">
                  {caffeData.story.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Italian Credibility Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 border-2 border-cafe-crimson bg-white flex items-center justify-center text-cafe-crimson shadow transform -rotate-3">
                      <Coffee className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-serif font-black text-lg text-cafe-crimson uppercase">{t.badgeArtisan}</h3>
                      <p className="text-xs text-neutral-600 font-bold">{t.badgeArtisanSub}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 border-2 border-cafe-crimson bg-white flex items-center justify-center text-cafe-crimson shadow transform rotate-3">
                      <Utensils className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-serif font-black text-lg text-cafe-crimson uppercase">{t.badgeCucina}</h3>
                      <p className="text-xs text-neutral-600 font-bold">{t.badgeCucinaSub}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Polaroid-style Owner Portrait */}
              <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                <div className="w-full max-w-sm storefront-sketch p-4 bg-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-square w-full overflow-hidden border border-cafe-crimson bg-neutral-100 relative">
                    <img
                      src="/assets/instagram/owner.jpg"
                      alt="Portrait of the founder of Guido Caffe smiling in the traditional coffee bar storefront"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 border-2 border-white/20 pointer-events-none" />
                  </div>
                  
                  {/* Vintage Polaroid Signature Block */}
                  <div className="pt-4 text-center space-y-1">
                    <span className="block font-serif text-xl font-bold tracking-tight text-cafe-crimson">
                      {t.heritageOwnerTitle}
                    </span>
                    <span className="block text-[8px] uppercase tracking-widest text-cafe-olive font-black">
                      {t.heritageOwnerSub}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 9. Checkered Divider */}
        <div className="bg-checkered-divider w-full" />

        {/* 10. Instagram Live Feed Grid (displays curated 100% clean product posts) */}
        <section id="gallery" className="py-20 lg:py-28 bg-white border-b-2 border-cafe-crimson">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Gallery Title */}
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest font-black text-white inline-flex items-center space-x-1.5 px-3 py-1 bg-cafe-crimson border border-white shadow-sm">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@guidocaffe</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-cafe-dark uppercase">
                {t.instaTitle}
              </h2>
              <p className="text-neutral-700 font-bold leading-relaxed">
                {t.instaDesc} <span className="text-cafe-crimson font-black uppercase">#GuidoCaffe</span>.
              </p>
            </div>

            {/* Curated Product Gallery Grid with Screen-Reader Descriptive Alt Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productPosts.slice(0, 12).map((post) => (
                <div
                  key={post.id}
                  className="group relative bg-white border-2 border-cafe-crimson overflow-hidden shadow-sm aspect-square hover-lift cursor-pointer"
                  onClick={() => window.open(post.url, '_blank')}
                  role="link"
                  aria-label={`Open Instagram post: ${post.caption.substring(0, 80)}...`}
                >
                  {/* Image */}
                  <img
                    src={post.imageUrl}
                    alt={post.caption ? `Guido Caffe: ${post.caption.substring(0, 120)}...` : "Guido Caffe: Instagram product post"}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Dark Hover Mask */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white z-10">
                    <div className="flex justify-end">
                      <InstagramIcon className="w-5 h-5 text-cafe-crimson" />
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-xs font-bold leading-relaxed line-clamp-4">
                        {post.caption || "Taste Italian tradition at Guido Caffe."}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-wider text-neutral-300">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-cafe-crimson fill-cafe-crimson" aria-hidden="true" />
                          <span>{post.likesCount || 0} Likes</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Utensils className="w-4 h-4 text-cafe-olive" aria-hidden="true" />
                          <span>{post.commentsCount || 0} Comments</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Call To Action */}
            <div className="text-center mt-12">
              <a
                href={caffeData.contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-cafe-crimson hover:bg-cafe-crimson hover:text-white text-cafe-crimson font-black uppercase text-xs tracking-widest transition-all duration-350 bg-white shadow-md cursor-pointer focus:ring-2 focus:ring-cafe-crimson focus:outline-none"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>{t.instaFollow}</span>
              </a>
            </div>
          </div>
        </section>

        {/* 11. Checkered Divider */}
        <div className="bg-checkered-divider w-full" />

        {/* 12. Visit Us & Operating Details */}
        <section id="visit" className="py-20 lg:py-28 bg-[#fafaf9] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Copywriting: Hours & Contact Info */}
              <div className="lg:col-span-6 space-y-8">
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest font-black text-cafe-crimson block">
                    {t.visitLabel}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-cafe-dark leading-none uppercase">
                    {t.visitTitle}
                  </h2>
                  <p className="text-neutral-700 font-bold text-base sm:text-lg">
                    {t.visitDesc}
                  </p>
                </div>

                <div className="w-16 h-1 bg-cafe-crimson" />

                {/* Info Blocks with custom line designs */}
                <div className="space-y-6">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 border-2 border-cafe-crimson bg-white flex items-center justify-center text-cafe-crimson shadow transform -rotate-2">
                      <MapPin className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-lg text-cafe-dark uppercase">{t.visitLoc}</h4>
                      <p className="text-neutral-700 font-medium text-sm">{caffeData.location.address}</p>
                      <a
                        href={caffeData.location.googleMapsLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cafe-crimson hover:text-cafe-dark underline text-xs font-black uppercase tracking-wider mt-1.5 inline-block focus:outline-none focus:text-cafe-dark"
                      >
                        {t.visitDirections}
                      </a>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 border-2 border-cafe-crimson bg-white flex items-center justify-center text-cafe-crimson shadow transform rotate-3">
                      <Clock className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-lg text-cafe-dark uppercase">{t.visitHours}</h4>
                      <p className="text-neutral-750 font-bold text-xs">
                        <span className="text-cafe-crimson uppercase">{t.visitWeekdays}</span> {caffeData.hours.weekdays}
                      </p>
                      <p className="text-neutral-755 font-bold text-xs mt-1">
                        <span className="text-cafe-crimson uppercase">{t.visitWeekends}</span> {caffeData.hours.weekends}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 border-2 border-cafe-crimson bg-white flex items-center justify-center text-cafe-crimson shadow transform -rotate-1">
                      <Phone className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-lg text-cafe-dark uppercase">{t.visitContact}</h4>
                      <p className="text-neutral-700 font-medium text-xs">
                        <span className="text-cafe-crimson uppercase font-black">Phone:</span> {caffeData.contact.phone}
                      </p>
                      <p className="text-neutral-700 font-medium text-xs mt-1">
                        <span className="text-cafe-crimson uppercase font-black">Email:</span> {caffeData.contact.email}
                      </p>
                    </div>
                  </div>

                  {/* Service Badges explicitly showing Dine-in / Takeaway availability and Delivery unavailability */}
                  <div className="pt-6 border-t border-dashed border-cafe-crimson/30 space-y-2.5 mt-6">
                    <span className="block text-[10px] uppercase font-black tracking-widest text-cafe-crimson">{t.serviceStatus}</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 border-2 border-cafe-crimson bg-white text-cafe-dark text-[10px] font-black uppercase shadow-sm rounded-sm">
                        <span className="w-2 h-2 rounded-full bg-cafe-olive animate-pulse" />
                        <span>{t.serviceDineIn}</span>
                      </span>
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 border-2 border-cafe-crimson bg-white text-cafe-dark text-[10px] font-black uppercase shadow-sm rounded-sm">
                        <span className="w-2 h-2 rounded-full bg-cafe-olive animate-pulse" />
                        <span>{t.serviceTakeaway}</span>
                      </span>
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 border-2 border-neutral-300 bg-neutral-100 text-neutral-400 text-[10px] font-black uppercase rounded-sm line-through decoration-cafe-crimson decoration-2">
                        <span className="w-2 h-2 rounded-full bg-cafe-crimson" />
                        <span>{t.serviceDelivery}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual: Cozy People/Cafe Closeup to represent Lausanne hospitality */}
              <div className="lg:col-span-6 relative">
                <div className="w-full aspect-[4/3] storefront-sketch bg-white p-3">
                  <div className="w-full h-full overflow-hidden border border-cafe-crimson relative bg-neutral-200">
                    <img
                      src="/assets/instagram/people.jpg"
                      alt="Cozy neighborhood gathering inside the warm Guido Caffe lighting"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Embedded Trattoria card */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white border-2 border-cafe-crimson p-4 text-cafe-dark shadow-xl z-10">
                      <div className="absolute inset-0 bg-checkered-light opacity-20 pointer-events-none" />
                      <div className="flex items-center space-x-2.5 mb-1 relative z-10">
                        <Coffee className="w-4 h-4 text-cafe-crimson" aria-hidden="true" />
                        <span className="font-serif text-base font-black uppercase text-cafe-crimson">{t.visitCardTitle}</span>
                      </div>
                      <p className="text-[10px] text-neutral-600 font-bold uppercase leading-relaxed relative z-10">
                        {t.visitCardDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 13. Checkered Divider */}
      <div className="bg-checkered-divider w-full" />

      {/* 14. Footer Section */}
      <footer className="bg-cafe-dark text-white pt-20 pb-10 border-t-2 border-cafe-crimson">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-800">
          
          {/* Col 1: Brand details (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-md bg-cafe-crimson flex items-center justify-center text-white border-2 border-white shadow-md transform -rotate-3">
                <Coffee className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-serif text-2xl font-black tracking-tight text-white uppercase">{caffeData.brand.name}</span>
            </div>
            <p className="text-neutral-400 font-medium text-xs leading-relaxed max-w-sm">
              {t.footerDesc}
            </p>
            <div className="flex items-center space-x-3">
              <a href={caffeData.contact.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 border border-neutral-700 hover:bg-cafe-crimson flex items-center justify-center text-white transition-all duration-300 focus:outline-none focus:border-cafe-crimson" aria-label="Visit Instagram page">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="mailto:ciao@guidocaffe.be" className="w-9 h-9 border border-neutral-700 hover:bg-cafe-crimson flex items-center justify-center text-white transition-all duration-300 focus:outline-none focus:border-cafe-crimson" aria-label="Send email inquiry">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif font-black text-base tracking-wide uppercase text-cafe-crimson">{t.footerNav}</h4>
            <ul className="space-y-2.5 text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
              <li><button onClick={() => scrollToSection('menu')} className="hover:text-cafe-crimson transition-colors cursor-pointer focus:outline-none">{t.menu}</button></li>
              <li><button onClick={() => scrollToSection('coffee-craft')} className="hover:text-cafe-crimson transition-colors cursor-pointer focus:outline-none">{t.coffeeCraft}</button></li>
              <li><button onClick={() => scrollToSection('heritage')} className="hover:text-cafe-crimson transition-colors cursor-pointer focus:outline-none">{t.heritage}</button></li>
              <li><button onClick={() => scrollToSection('gallery')} className="hover:text-cafe-crimson transition-colors cursor-pointer focus:outline-none">{t.liveFeed}</button></li>
              <li><button onClick={() => scrollToSection('visit')} className="hover:text-cafe-crimson transition-colors cursor-pointer focus:outline-none">{t.visit}</button></li>
            </ul>
          </div>

          {/* Col 3: Hours Summary (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-serif font-black text-base tracking-wide uppercase text-cafe-crimson">{t.footerHours}</h4>
            <div className="text-neutral-400 font-medium text-xs space-y-2">
              <p><span className="block font-black text-white uppercase text-[10px]">{t.visitWeekdays}</span> {caffeData.hours.weekdays}</p>
              <p><span className="block font-black text-white uppercase text-[10px]">{t.visitWeekends}</span> {caffeData.hours.weekends}</p>
            </div>
          </div>

          {/* Col 4: Newsletter (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif font-black text-base tracking-wide uppercase text-cafe-crimson">{t.footerNewsletter}</h4>
            <p className="text-neutral-400 font-medium text-xs">
              {t.footerNewsletterDesc}
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder={t.footerEmailPlaceholder}
                aria-label="Newsletter email address"
                className="w-full bg-neutral-900 text-white border-2 border-neutral-700 px-4 py-2.5 text-xs focus:outline-none focus:border-cafe-crimson focus:ring-1 focus:ring-cafe-crimson"
              />
              <button className="px-4 py-2.5 bg-cafe-crimson hover:bg-white hover:text-cafe-dark border-2 border-cafe-crimson hover:border-white text-white font-black uppercase text-xs transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-white focus:outline-none">
                {t.footerJoin}
              </button>
            </div>
          </div>

        </div>

        {/* Final Copyright banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[10px] font-black uppercase tracking-widest space-y-4 sm:space-y-0">
          <p>&copy; {new Date().getFullYear()} {caffeData.brand.name}. {t.footerCopy}</p>
          <p className="flex items-center space-x-1">
            <span>{t.footerCrafted}</span>
            <Heart className="w-3.5 h-3.5 text-cafe-crimson fill-cafe-crimson animate-pulse" aria-hidden="true" />
          </p>
        </div>
      </footer>

      {/* 15. Booking & Reservation Accessible Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              tabIndex="-1"
              role="dialog"
              aria-modal="true"
              autoFocus
              className="relative w-full max-w-lg bg-[#fafaf9] border-2 border-cafe-crimson overflow-hidden shadow-2xl z-10 p-8 sm:p-10 outline-none"
            >
              <div className="absolute inset-0 bg-checkered-light opacity-20 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white border border-cafe-crimson hover:bg-cafe-crimson hover:text-white text-cafe-crimson transition-all cursor-pointer shadow-md rounded focus:ring-2 focus:ring-cafe-crimson focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <AnimatePresence mode="wait">
                {!bookingSuccess ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 relative z-10"
                  >
                    {/* Header */}
                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-widest font-black text-cafe-crimson block">
                        {t.resLabel}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-black text-cafe-dark uppercase">
                        {t.resTitle}
                      </h3>
                      <p className="text-xs text-neutral-600 font-bold uppercase">
                        {t.resDesc}
                      </p>
                    </div>

                    {/* Form fields */}
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-cafe-crimson block">{t.resName}</label>
                          <input
                            type="text"
                            required
                            name="name"
                            value={bookingForm.name}
                            onChange={handleBookingChange}
                            placeholder="Gianni"
                            className="w-full bg-white border-2 border-cafe-crimson px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-cafe-crimson focus:border-cafe-crimson outline-none text-cafe-dark"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-cafe-crimson block">{t.resEmail}</label>
                          <input
                            type="email"
                            required
                            name="email"
                            value={bookingForm.email}
                            onChange={handleBookingChange}
                            placeholder="gianni@caffe.it"
                            className="w-full bg-white border-2 border-cafe-crimson px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-cafe-crimson focus:border-cafe-crimson outline-none text-cafe-dark"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-cafe-crimson block">{t.resDate}</label>
                          <input
                            type="date"
                            required
                            name="date"
                            value={bookingForm.date}
                            onChange={handleBookingChange}
                            className="w-full bg-white border-2 border-cafe-crimson px-2.5 py-2.5 text-xs font-bold focus:ring-2 focus:ring-cafe-crimson focus:border-cafe-crimson outline-none text-cafe-dark"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-cafe-crimson block">{t.resHour}</label>
                          <input
                            type="time"
                            required
                            name="time"
                            value={bookingForm.time}
                            onChange={handleBookingChange}
                            className="w-full bg-white border-2 border-cafe-crimson px-2.5 py-2.5 text-xs font-bold focus:ring-2 focus:ring-cafe-crimson focus:border-cafe-crimson outline-none text-cafe-dark"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-cafe-crimson block">{t.resGuests}</label>
                          <select
                            name="guests"
                            value={bookingForm.guests}
                            onChange={handleBookingChange}
                            className="w-full bg-white border-2 border-cafe-crimson px-2.5 py-2.5 text-xs font-bold focus:ring-2 focus:ring-cafe-crimson focus:border-cafe-crimson outline-none text-cafe-dark"
                          >
                            <option value="1">1 {lang === 'fr' ? 'Personne' : lang === 'it' ? 'Persona' : 'Person'}</option>
                            <option value="2">2 {lang === 'fr' ? 'Personnes' : lang === 'it' ? 'Persone' : 'People'}</option>
                            <option value="3">3 {lang === 'fr' ? 'Personnes' : lang === 'it' ? 'Persone' : 'People'}</option>
                            <option value="4">4 {lang === 'fr' ? 'Personnes' : lang === 'it' ? 'Persone' : 'People'}</option>
                            <option value="5">5+ {lang === 'fr' ? 'Personnes' : lang === 'it' ? 'Persone' : 'People'}</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black tracking-wider text-cafe-crimson block">{t.resNotes}</label>
                        <textarea
                          rows="2"
                          name="notes"
                          value={bookingForm.notes}
                          onChange={handleBookingChange}
                          placeholder={t.resNotesPlaceholder}
                          className="w-full bg-white border-2 border-cafe-crimson px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-cafe-crimson focus:border-cafe-crimson outline-none text-cafe-dark"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-cafe-crimson hover:bg-cafe-dark hover:border-cafe-dark border-2 border-cafe-crimson text-white font-black uppercase text-xs tracking-widest transition-all duration-350 shadow-md cursor-pointer mt-4 focus:ring-2 focus:ring-white focus:outline-none"
                      >
                        {t.resSubmit}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 space-y-4 relative z-10"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-cafe-olive bg-cafe-olive/10 flex items-center justify-center mx-auto text-cafe-olive animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl font-black text-cafe-dark uppercase">{t.resSuccessTitle}</h3>
                      <p className="text-xs text-neutral-600 font-bold uppercase">{t.resSuccessDesc}</p>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium">
                      {t.resSuccessMail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 16. Dedicated Interactive Hiring & Positions Accessible Modal */}
      <AnimatePresence>
        {isHiringModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHiringModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              tabIndex="-1"
              role="dialog"
              aria-modal="true"
              autoFocus
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#fafaf9] border-2 border-cafe-crimson overflow-y-auto shadow-2xl z-10 p-6 sm:p-10 scrollbar-hidden outline-none"
            >
              <div className="absolute inset-0 bg-checkered-light opacity-20 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsHiringModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white border border-cafe-crimson hover:bg-cafe-crimson hover:text-white text-cafe-crimson transition-all cursor-pointer shadow-md rounded z-20 focus:ring-2 focus:ring-cafe-crimson focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <AnimatePresence mode="wait">
                {!hiringSuccess ? (
                  <motion.div
                    key="hiring-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 pt-4"
                  >
                    {/* Left Column: List Openings & Downloaded flyers (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs uppercase tracking-widest font-black text-cafe-crimson block">
                          {t.hireLabel}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-black text-cafe-dark uppercase">
                          {t.hireTitle}
                        </h3>
                        <p className="text-xs text-neutral-600 font-bold uppercase">
                          {t.hireDesc}
                        </p>
                      </div>

                      {/* Displaying original scraped hiring posts beautifully */}
                      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hidden">
                        <h4 className="font-serif font-black text-base uppercase text-cafe-crimson border-b border-dashed border-cafe-crimson/30 pb-2 flex items-center space-x-2">
                          <Briefcase className="w-4 h-4" aria-hidden="true" />
                          <span>{t.hirePositions}</span>
                        </h4>

                        {promoPosts.map((post) => {
                          let title = t.roleBarista;
                          if (post.caption.toLowerCase().includes("manager")) title = t.roleManager;
                          if (post.caption.toLowerCase().includes("midi")) title = t.roleAssistant;

                          return (
                            <div key={post.id} className="border-2 border-cafe-crimson bg-white p-4 flex flex-col sm:flex-row gap-4 shadow-sm hover-lift">
                              {/* Scraped recruitment image with Alt Tag */}
                              <div className="w-full sm:w-28 aspect-square shrink-0 overflow-hidden border border-cafe-crimson bg-neutral-100">
                                <img
                                  src={post.imageUrl}
                                  alt={`Official Guido Caffe hiring advertisement card for ${title}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              {/* Caption Details */}
                              <div className="space-y-2">
                                <span className="inline-block px-2 py-0.5 bg-cafe-crimson text-white text-[8px] font-black uppercase tracking-wider rounded-sm">
                                  {title}
                                </span>
                                <p className="text-[11px] text-neutral-700 font-medium leading-relaxed whitespace-pre-line line-clamp-6">
                                  {post.caption}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Apply form (5 cols) */}
                    <div className="lg:col-span-5 bg-white border-2 border-cafe-crimson p-6 relative">
                      <div className="absolute inset-0 bg-checkered-light opacity-10 pointer-events-none" />
                      <form onSubmit={handleHiringSubmit} className="space-y-4 relative z-10">
                        <h4 className="font-serif font-black text-sm uppercase text-cafe-crimson border-b border-dashed border-cafe-crimson/30 pb-2">
                          {t.hireApplyToday}
                        </h4>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-cafe-crimson block">{t.resName}</label>
                          <input
                            type="text"
                            required
                            name="name"
                            value={hiringForm.name}
                            onChange={handleHiringChange}
                            placeholder="Gianni"
                            className="w-full bg-white border-2 border-cafe-crimson px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cafe-crimson focus:border-cafe-crimson outline-none text-cafe-dark"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-cafe-crimson block">{t.resEmail}</label>
                          <input
                            type="email"
                            required
                            name="email"
                            value={hiringForm.email}
                            onChange={handleHiringChange}
                            placeholder="gianni@caffe.it"
                            className="w-full bg-white border-2 border-cafe-crimson px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cafe-crimson focus:border-cafe-crimson outline-none text-cafe-dark"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-cafe-crimson block">{t.hireRole}</label>
                          <select
                            name="role"
                            value={hiringForm.role}
                            onChange={handleHiringChange}
                            className="w-full bg-white border-2 border-cafe-crimson px-2.5 py-2 text-xs font-bold focus:ring-2 focus:ring-cafe-crimson focus:border-cafe-crimson outline-none text-cafe-dark"
                          >
                            <option value="barista">{t.roleBarista}</option>
                            <option value="manager">{t.roleManager}</option>
                            <option value="assistant">{t.roleAssistant}</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-cafe-crimson block">{t.hireMessage}</label>
                          <textarea
                            required
                            rows="4"
                            name="message"
                            value={hiringForm.message}
                            onChange={handleHiringChange}
                            placeholder={t.hireMessagePlaceholder}
                            className="w-full bg-white border-2 border-cafe-crimson px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cafe-crimson focus:border-cafe-crimson outline-none text-cafe-dark"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-cafe-crimson hover:bg-cafe-dark hover:border-cafe-dark border-2 border-cafe-crimson text-white font-black uppercase text-[10px] tracking-widest transition-all duration-350 shadow-md cursor-pointer focus:ring-2 focus:ring-white focus:outline-none"
                        >
                          {t.hireSubmit}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hiring-success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 space-y-4 relative z-10 max-w-md mx-auto"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-cafe-olive bg-cafe-olive/10 flex items-center justify-center mx-auto text-cafe-olive animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl font-black text-cafe-dark uppercase">{t.hireSuccessTitle}</h3>
                      <p className="text-xs text-neutral-600 font-bold uppercase">{t.hireSuccessDesc}</p>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium">
                      {t.hireSuccessSub}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
