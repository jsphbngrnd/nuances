import type { ConversationMode } from "@/lib/types";

export type Locale = "en" | "fr";

export function normalizeLocale(value?: string | null): Locale {
  return value === "fr" ? "fr" : "en";
}

type Copy = {
  nav: {
    start: string;
    home: string;
    reconnects: string;
    safety: string;
    language: string;
  };
  marketing: {
    eyebrow: string;
    signIn: string;
    heroEyebrow: string;
    heroTitle: string;
    heroBody: string;
    liveNow: string;
    liveNowBody: string;
    completion: string;
    completionBody: string;
    ctaPrimary: string;
    ctaSecondary: string;
    modesEyebrow: string;
    modesTitle: string;
    modesBody: string;
  };
  auth: {
    eyebrow: string;
    title: string;
    body: string;
    email: string;
    apple: string;
    notes: string[];
    back: string;
    continue: string;
  };
  onboarding: {
    eyebrow: string;
    title: string;
    body: string;
    displayName: string;
    ageRange: string;
    language: string;
    country: string;
    mood: string;
    interests: string;
    toggles: string[];
    back: string;
    continue: string;
    moods: string[];
  };
  home: {
    eyebrow: string;
    title: string;
    body: string;
    launchEyebrow: string;
    launchTitle: string;
    launchBody: string;
    launchCta: string;
    onlineNow: string;
    quoteEyebrow: string;
    quoteTitle: string;
    quoteBody: string;
    reconnectsEyebrow: string;
    reconnectsTitle: string;
    reconnectsBody: string;
    reconnectsLink: string;
    safetyEyebrow: string;
    safetyTitle: string;
    safetyBody: string;
    safetyRules: string[];
    safetyLink: string;
  };
  matchmaking: {
    title: string;
    searching: string;
    chips: string[];
    cancel: string;
    found: string;
  };
  topic: {
    eyebrow: string;
    title: string;
    body: string;
    accept: string;
    reroll: string;
  };
  reconnects: {
    eyebrow: string;
    title: string;
    body: string;
    reopen: string;
  };
  settings: {
    eyebrow: string;
    title: string;
    body: string;
    controls: Array<{ label: string; description: string }>;
    conductEyebrow: string;
    conduct: string[];
  };
  summary: {
    eyebrow: string;
    title: string;
    sharedThemes: string;
    semanticTags: string;
    agreementPoints: string;
    disagreementPoints: string;
    emotionalTone: string;
    reconnect: string;
    talkAgain: string;
    nextPerson: string;
    reflection: string;
    reflectionQuestion: string;
    reflectionOptions: string[];
    goFurther: string;
    goFurtherBody: string;
    saveItem: string;
    savedItem: string;
    openItem: string;
    sponsored: string;
  };
  room: {
    roomSuffix: string;
    timeLeft: string;
    currentTurn: string;
    openExchange: string;
    structuredTurn: string;
    live: string;
    transcript: string;
    mixedStream: string;
    input: string;
    inputBody: string;
    talk: string;
    send: string;
    report: string;
    block: string;
    end: string;
    lateNightTurn: string;
    liveTopicConversation: string;
  };
};

export const copy: Record<Locale, Copy> = {
  en: {
    nav: {
      start: "Start",
      home: "Home",
      reconnects: "Reconnects",
      safety: "Safety",
      language: "Language",
    },
    marketing: {
      eyebrow: "Conversation Discovery App",
      signIn: "✨ Sign in",
      heroEyebrow: "Meet strangers through ideas, not profiles.",
      heroTitle: "Human conversations, on demand.",
      heroBody:
        "NUANCE matches two strangers for short, thoughtful conversations around a topic. No feed, no follower counts, no public profiles. Just structure, safety, and a real exchange.",
      liveNow: "Live Now",
      liveNowBody: "People online and available to talk.",
      completion: "Completion",
      completionBody: "Rooms that reach a full ending screen.",
      ctaPrimary: "💬 Start a conversation",
      ctaSecondary: "👀 View app prototype",
      modesEyebrow: "Modes",
      modesTitle: "Pick the atmosphere, not the person.",
      modesBody: "Each mode shapes rhythm, safety, and emotional tone.",
    },
    auth: {
      eyebrow: "Access",
      title: "Sign in without building a persona.",
      body:
        "NUANCE keeps the first step light. The product is about entering a conversation fast, not filling out an endless profile.",
      email: "✉️ Continue with email magic link",
      apple: "🍎 Continue with Apple",
      notes: [
        "No public profile is created at signup. Your identity stays private.",
        "After signing up, check your email to confirm your account.",
      ],
      back: "Back",
      continue: "Continue to onboarding",
    },
    onboarding: {
      eyebrow: "Onboarding",
      title: "Fast setup. Clear boundaries.",
      body:
        "The MVP keeps onboarding intentionally short: enough signal to match well and keep the room safe.",
      displayName: "Display name or pseudonym",
      ageRange: "Age range",
      language: "Language",
      country: "Country or region",
      mood: "Current mood",
      interests: "Optional interests",
      toggles: [
        "🎙️ Enable voice input",
        "📝 Allow transcription",
        "💌 Allow reconnect requests",
        "🛡️ I accept the conduct rules",
      ],
      back: "Back",
      continue: "✨ Save and continue",
      moods: ["Calm", "Curious", "Restless", "Reflective", "Open"],
    },
    home: {
      eyebrow: "Good evening",
      title: "Talk to someone real.",
      body: "A calmer social product: structured rooms, private reconnects, and no performance layer.",
      launchEyebrow: "Start",
      launchTitle: "Choose the exchange before you meet the person.",
      launchBody:
        "Open the mode hub to pick the tone, structure, and duration that fits tonight.",
      launchCta: "Open exchange modes",
      onlineNow: "Online now",
      quoteEyebrow: "Quote of the day",
      quoteTitle: "A line worth keeping.",
      quoteBody:
        "Drawn from a real exchange somewhere in the NUANCE community, so the home screen carries a voice larger than your own session.",
      reconnectsEyebrow: "Reconnects",
      reconnectsTitle: "Private and mutual.",
      reconnectsBody:
        "No open DMs. If both people say yes, a reconnect thread becomes available later.",
      reconnectsLink: "💌 Open reconnects",
      safetyEyebrow: "Safety",
      safetyTitle: "Calm by design.",
      safetyBody:
        "Every room includes report, block, moderation checks, and a trust threshold before matching.",
      safetyRules: [
        "Transcript moderation in near real time",
        "Two rerolls max before rematch",
        "No public profiles or follower system",
      ],
      safetyLink: "🛡️ Review safety settings",
    },
    matchmaking: {
      title: "Looking for someone ready to talk.",
      searching: "🔎 Searching",
      chips: ["Same mode", "Same language", "Trust-safe"],
      cancel: "Cancel",
      found: "✨ Simulate match found",
    },
    topic: {
      eyebrow: "Topic Acceptance",
      title: "Both people need to want this conversation.",
      body: "If either user rerolls, a new topic appears. After two rerolls, the system rematches.",
      accept: "✅ Accept topic",
      reroll: "🔄 New topic",
    },
    reconnects: {
      eyebrow: "Reconnects",
      title: "Mutual intent, or nothing.",
      body:
        "Reconnect history stays private and limited. No one sees a profile until both people want another conversation.",
      reopen: "💬 Reopen conversation",
    },
    settings: {
      eyebrow: "Safety and Settings",
      title: "Boundaries are part of the product.",
      body:
        "Safety is visible, explicit, and close at hand. The app should feel calm because users can trust the structure.",
      controls: [
        {
          label: "Allow voice input",
          description: "Use push-to-talk in live rooms and send speech through transcription.",
        },
        {
          label: "Allow transcription",
          description: "Display live transcript chunks in the shared stream for clarity and moderation.",
        },
        {
          label: "Allow reconnect requests",
          description: "Let other users ask for another conversation after a room ends.",
        },
      ],
      conductEyebrow: "Conduct",
      conduct: [
        "Harassment, hate, threats, doxxing, and sexual misconduct trigger blocking and possible room termination.",
        "Blocked content is not rewritten invisibly. The sender sees a clear explanation.",
        "Repeat severe violations feed into a trust score and can remove queue access.",
      ],
    },
    summary: {
      eyebrow: "Conversation Summary",
      title: "A short ending, not a social score.",
      sharedThemes: "Shared Themes",
      semanticTags: "Semantic Tags",
      agreementPoints: "Agreement Points",
      disagreementPoints: "Points of Difference",
      emotionalTone: "Emotional Tone",
      reconnect: "If you reconnect",
      talkAgain: "💌 Talk again",
      nextPerson: "🌟 Next person",
      reflection: "🫶 Reflection",
      reflectionQuestion: "Did this conversation make you think differently?",
      reflectionOptions: ["😊 Good", "🙂 Neutral", "😕 Uncomfortable"],
      goFurther: "Go further",
      goFurtherBody:
        "If this conversation sparked something, here are a few ways to keep exploring the topic without turning the moment into a funnel.",
      saveItem: "Save",
      savedItem: "Saved",
      openItem: "Open",
      sponsored: "Sponsored",
    },
    room: {
      roomSuffix: "Room",
      timeLeft: "⏳ Time Left",
      currentTurn: "🎯 Current turn",
      openExchange: "Open exchange",
      structuredTurn: "Structured turn",
      live: "💬 Live",
      transcript: "📝 Transcript Stream",
      mixedStream: "Mixed text + speech",
      input: "🎙️ Input",
      inputBody: "Push to talk for voice. Type if you need a fallback.",
      talk: "Talk",
      send: "✉️ Send",
      report: "🚩 Report",
      block: "🚫 Block",
      end: "👋 End",
      lateNightTurn: "Both users can speak, with AI ready to help if the room goes quiet.",
      liveTopicConversation: "✨ Live topic-led conversation",
    },
  },
  fr: {
    nav: {
      start: "Start",
      home: "Accueil",
      reconnects: "Recontacts",
      safety: "Sécurité",
      language: "Langue",
    },
    marketing: {
      eyebrow: "App de conversations",
      signIn: "✨ Se connecter",
      heroEyebrow: "Rencontrez des inconnus par les idées, pas par les profils.",
      heroTitle: "Des conversations humaines, à la demande.",
      heroBody:
        "NUANCE met en relation deux inconnus pour de courtes conversations réfléchies autour d'un sujet. Aucun feed, aucun compteur social, aucun profil public. Juste de la structure, de la sécurité et un vrai échange.",
      liveNow: "En ligne",
      liveNowBody: "Personnes disponibles pour parler maintenant.",
      completion: "Complétion",
      completionBody: "Salons qui vont jusqu'à l'écran de fin.",
      ctaPrimary: "💬 Commencer une conversation",
      ctaSecondary: "👀 Voir le prototype",
      modesEyebrow: "Modes",
      modesTitle: "Choisissez l'ambiance, pas la personne.",
      modesBody: "Chaque mode façonne le rythme, la sécurité et le ton émotionnel.",
    },
    auth: {
      eyebrow: "Accès",
      title: "Connectez-vous sans construire un personnage.",
      body:
        "NUANCE garde la première étape légère. Le produit sert à entrer vite dans une conversation, pas à remplir un profil sans fin.",
      email: "✉️ Continuer avec un lien magique par email",
      apple: "🍎 Continuer avec Apple",
      notes: [
        "Aucun profil public n'est créé à l'inscription. Votre identité reste privée.",
        "Après l'inscription, vérifiez votre email pour confirmer votre compte.",
      ],
      back: "Retour",
      continue: "Continuer vers l'onboarding",
    },
    onboarding: {
      eyebrow: "Onboarding",
      title: "Configuration rapide. Limites claires.",
      body:
        "Le MVP garde l'onboarding volontairement court : assez de signal pour bien matcher et garder le salon sûr.",
      displayName: "Nom affiché ou pseudo",
      ageRange: "Tranche d'âge",
      language: "Langue",
      country: "Pays ou région",
      mood: "Humeur du moment",
      interests: "Centres d'intérêt optionnels",
      toggles: [
        "🎙️ Activer la voix",
        "📝 Autoriser la transcription",
        "💌 Autoriser les demandes de recontact",
        "🛡️ J'accepte les règles de conduite",
      ],
      back: "Retour",
      continue: "✨ Enregistrer et continuer",
      moods: ["Calme", "Curieux", "Agité", "Réfléchi", "Ouvert"],
    },
    home: {
      eyebrow: "Bonsoir",
      title: "Parlez à quelqu'un de vrai.",
      body: "Un produit social plus calme : salons structurés, recontacts privés et aucune couche de performance.",
      launchEyebrow: "Start",
      launchTitle: "Choisissez l'échange avant de rencontrer la personne.",
      launchBody:
        "Ouvrez le hub des modes pour choisir le ton, la structure et la durée qui correspondent à ce soir.",
      launchCta: "Ouvrir les types d'échanges",
      onlineNow: "En ligne",
      quoteEyebrow: "Quote of the day",
      quoteTitle: "Une phrase à garder.",
      quoteBody:
        "Tiré d'un vrai échange quelque part dans la communauté NUANCE, pour que l'accueil fasse entendre une voix plus large que votre propre session.",
      reconnectsEyebrow: "Recontacts",
      reconnectsTitle: "Privé et mutuel.",
      reconnectsBody:
        "Aucun DM ouvert. Si les deux personnes disent oui, un fil privé de recontact devient disponible plus tard.",
      reconnectsLink: "💌 Ouvrir les recontacts",
      safetyEyebrow: "Sécurité",
      safetyTitle: "Du calme par design.",
      safetyBody:
        "Chaque salon inclut signalement, blocage, modération et seuil de confiance avant le matching.",
      safetyRules: [
        "Modération des transcriptions en quasi temps réel",
        "Deux rerolls maximum avant rematch",
        "Aucun profil public ni système d'abonnés",
      ],
      safetyLink: "🛡️ Voir les réglages de sécurité",
    },
    matchmaking: {
      title: "Recherche de quelqu'un prêt à parler.",
      searching: "🔎 Recherche",
      chips: ["Même mode", "Même langue", "Seuil de confiance"],
      cancel: "Annuler",
      found: "✨ Simuler un match",
    },
    topic: {
      eyebrow: "Acceptation du sujet",
      title: "Les deux personnes doivent vouloir cette conversation.",
      body:
        "Si l'un des deux reroll, un nouveau sujet apparaît. Après deux rerolls, le système rematche.",
      accept: "✅ Accepter le sujet",
      reroll: "🔄 Nouveau sujet",
    },
    reconnects: {
      eyebrow: "Recontacts",
      title: "Une intention mutuelle, sinon rien.",
      body:
        "L'historique de recontact reste privé et limité. Personne ne voit de profil avant que les deux personnes veuillent reparler.",
      reopen: "💬 Rouvrir la conversation",
    },
    settings: {
      eyebrow: "Sécurité et réglages",
      title: "Les limites font partie du produit.",
      body:
        "La sécurité est visible, explicite et toujours proche. L'app doit sembler calme parce qu'on peut faire confiance à sa structure.",
      controls: [
        {
          label: "Autoriser la voix",
          description: "Utiliser le push-to-talk dans les salons et envoyer la parole vers la transcription.",
        },
        {
          label: "Autoriser la transcription",
          description: "Afficher les transcriptions en direct dans le flux partagé pour la clarté et la modération.",
        },
        {
          label: "Autoriser les demandes de recontact",
          description: "Permettre aux autres utilisateurs de demander une nouvelle conversation après le salon.",
        },
      ],
      conductEyebrow: "Règles",
      conduct: [
        "Le harcèlement, la haine, les menaces, le doxxing et les comportements sexuels déplacés déclenchent un blocage et parfois la fin du salon.",
        "Le contenu bloqué n'est pas réécrit en silence. L'expéditeur voit une explication claire.",
        "Les violations graves répétées alimentent un score de confiance et peuvent retirer l'accès à la file.",
      ],
    },
    summary: {
      eyebrow: "Résumé de conversation",
      title: "Une fin courte, pas une note sociale.",
      sharedThemes: "Thèmes partagés",
      semanticTags: "Tags sémantiques",
      agreementPoints: "Points d'accord",
      disagreementPoints: "Points de désaccord",
      emotionalTone: "Tonalité émotionnelle",
      reconnect: "Si vous vous recontactez",
      talkAgain: "💌 Reparler",
      nextPerson: "🌟 Personne suivante",
      reflection: "🫶 Réflexion",
      reflectionQuestion: "Cette conversation vous a-t-elle fait penser autrement ?",
      reflectionOptions: ["😊 Bien", "🙂 Neutre", "😕 Inconfortable"],
      goFurther: "Go further",
      goFurtherBody:
        "Si cette conversation a ouvert quelque chose, voici quelques pistes pour prolonger la réflexion sans casser la délicatesse du moment.",
      saveItem: "Sauver",
      savedItem: "Sauvé",
      openItem: "Ouvrir",
      sponsored: "Sponsorisé",
    },
    room: {
      roomSuffix: "Salon",
      timeLeft: "⏳ Temps restant",
      currentTurn: "🎯 Tour actuel",
      openExchange: "Échange libre",
      structuredTurn: "Tour structuré",
      live: "💬 En direct",
      transcript: "📝 Flux de transcription",
      mixedStream: "Texte + voix",
      input: "🎙️ Saisie",
      inputBody: "Maintenez pour parler. Vous pouvez aussi écrire si besoin.",
      talk: "Parler",
      send: "✉️ Envoyer",
      report: "🚩 Signaler",
      block: "🚫 Bloquer",
      end: "👋 Fin",
      lateNightTurn: "Les deux personnes peuvent parler, avec l'IA prête à aider si le salon devient silencieux.",
      liveTopicConversation: "✨ Conversation en direct autour d'un sujet",
    },
  },
};

export function getCopy(locale: Locale) {
  return copy[locale];
}

export function getModeName(mode: ConversationMode, locale: Locale) {
  if (locale === "fr") {
    if (mode === "debate") return "Débat";
    if (mode === "funny") return "Funny";
    if (mode === "deep") return "Deep";
    return "Late Night";
  }

  if (mode === "debate") return "Debate";
  if (mode === "funny") return "Funny";
  if (mode === "deep") return "Deep";
  return "Late Night";
}

export function getModeCopy(mode: ConversationMode, locale: Locale) {
  if (locale === "fr") {
    if (mode === "debate") {
      return {
        shortLabel: "Confrontation structurée",
        tagline: "Deux inconnus. Une idée. Une confrontation intelligente.",
        description:
          "Rapide, stimulant et rejouable. Le timer garde l'échange net sans le laisser devenir chaotique.",
        waitingCopy: "Recherche d'une personne vive, disponible et prête à défendre une idée.",
      };
    }
    if (mode === "funny") {
      return {
        shortLabel: "Hot takes légers",
        tagline: "Deux inconnus. Une opinion absurde. Une énergie sociale rapide.",
        description:
          "Plus léger, plus drôle, plus facile à relancer. On débat ici sur des takes de groupe WhatsApp, pas sur le destin du monde.",
        waitingCopy: "Recherche d'une personne joueuse, rapide et prête à défendre une opinion ridicule avec sérieux.",
      };
    }
    if (mode === "deep") {
      return {
        shortLabel: "Échange réflexif",
        tagline: "Deux inconnus. Une vraie question. De l'espace pour aller plus loin.",
        description:
          "Une ouverture guidée laisse à chacun le temps d'arriver avant que la conversation ne s'ouvre plus naturellement.",
        waitingCopy: "Recherche d'une personne calme, réfléchie et prête à rester avec une vraie question.",
      };
    }
    return {
      shortLabel: "Salon de présence",
      tagline: "Une conversation plus douce pour les heures où l'on veut de la présence, pas du bruit.",
      description:
        "Plus intime et plus souple, avec des relances douces de l'IA uniquement si le silence s'installe.",
      waitingCopy: "Recherche d'une autre personne qui veut une vraie présence humaine ce soir.",
    };
  }

  if (mode === "debate") {
    return {
      shortLabel: "Structured confrontation",
      tagline: "Two strangers. One idea. Intelligent confrontation.",
      description:
        "Fast, energizing, and replayable. The timer keeps both sides sharp without letting the room turn messy.",
      waitingCopy: "Looking for someone sharp, available now, and ready to defend an idea.",
    };
  }
  if (mode === "funny") {
    return {
      shortLabel: "Playful hot takes",
      tagline: "Two strangers. One absurd opinion. Fast social energy.",
      description:
        "Lighter, weirder, and easier to replay. This is where group-chat opinions become short live conversations.",
      waitingCopy: "Looking for someone playful, quick, and ready to defend a ridiculous opinion seriously.",
    };
  }
  if (mode === "deep") {
    return {
      shortLabel: "Reflective exchange",
      tagline: "Two strangers. One meaningful question. Space to go further.",
      description:
        "A guided opening gives both people room to land before the conversation opens into something more natural.",
      waitingCopy: "Looking for someone calm, reflective, and willing to stay with a real question.",
    };
  }
  return {
    shortLabel: "Presence room",
    tagline: "A softer conversation for the hours when you want presence, not noise.",
    description:
      "Low-pressure and intimate, with gentle AI prompts only when the room goes quiet for too long.",
    waitingCopy: "Looking for someone else who wants real human presence tonight.",
  };
}

export function translateSampleText(text: string, locale: Locale) {
  if (locale === "en") return text;

  const translations: Record<string, string> = {
    "Is AI making us intellectually lazy?": "L'IA nous rend-elle intellectuellement paresseux ?",
    "Does money make people freer?": "L'argent rend-il les gens plus libres ?",
    "Should inheritance be limited?": "Faut-il limiter l'héritage ?",
    "Is ambition overrated?": "L'ambition est-elle surestimée ?",
    "Should university be free for everyone?": "L'université devrait-elle être gratuite pour tout le monde ?",
    "Has remote work made life better overall?": "Le travail à distance a-t-il vraiment amélioré la vie dans l'ensemble ?",
    "Does cancel culture hold people accountable or make honest conversation harder?":
      "La cancel culture responsabilise-t-elle vraiment, ou rend-elle les conversations honnêtes plus difficiles ?",
    "Should privacy matter more than convenience online?":
      "La vie privée devrait-elle compter davantage que la commodité en ligne ?",
    "Can endless personal growth become another form of pressure?":
      "Le développement personnel sans fin peut-il devenir une nouvelle forme de pression ?",
    "When do you feel most alive?": "Quand vous sentez-vous le plus vivant ?",
    "What has changed your mind recently?": "Qu'est-ce qui a récemment changé votre regard ?",
    "What have you outgrown lately?": "Qu'avez-vous dépassé ces derniers temps ?",
    "What are you still trying to understand about yourself?":
      "Qu'essaies-tu encore de comprendre à propos de toi-même ?",
    "What do people misunderstand about your generation?":
      "Qu'est-ce que les gens comprennent mal à propos de ta génération ?",
    "Where in your life do you think you might still be lying to yourself a little?":
      "Dans quelle partie de ta vie penses-tu encore te mentir un peu ?",
    "What are you chasing right now, and why does it matter to you?":
      "Qu'es-tu en train de poursuivre en ce moment, et pourquoi est-ce important pour toi ?",
    "What makes a place feel like home to you now?":
      "Qu'est-ce qui fait qu'un endroit ressemble à chez toi aujourd'hui ?",
    "What advice did you reject for years before finally understanding it?":
      "Quel conseil as-tu rejeté pendant des années avant de finalement le comprendre ?",
    "What are you carrying that people do not see?": "Que portez-vous en vous que les autres ne voient pas ?",
    "What kind of night are you having?": "Quel genre de nuit êtes-vous en train de vivre ?",
    "What do you miss right now?": "Qu'est-ce qui vous manque en ce moment ?",
    "What do you wish you could say more easily?": "Qu'aimerais-tu pouvoir dire plus facilement ?",
    "What has been on your mind today that you have not really said out loud?":
      "Qu'est-ce qui t'a traversé l'esprit aujourd'hui sans vraiment sortir à voix haute ?",
    "What do you wish someone would ask you tonight?":
      "Qu'aimerais-tu que quelqu'un te demande ce soir ?",
    "What kind of tired are you right now?": "De quelle fatigue s'agit-il pour toi, là, maintenant ?",
    "What helps you soften when life has made you tense all day?":
      "Qu'est-ce qui t'aide à relâcher quand la journée t'a laissé tendu ?",
    "What do you notice only when everything finally gets quiet?":
      "Qu'est-ce que tu remarques seulement quand tout devient enfin silencieux ?",
    "Should pigeons vote?": "Les pigeons devraient-ils voter ?",
    "Is Monday immoral?": "Le lundi est-il immoral ?",
    "Are voice notes better than texts?": "Les notes vocales sont-elles meilleures que les textos ?",
    "Is ghosting ever acceptable?": "Le ghosting est-il parfois acceptable ?",
    "Is brunch overrated?": "Le brunch est-il surestimé ?",
    "Are memes a real form of intelligence?": "Les mèmes sont-ils une vraie forme d'intelligence ?",
    "Pineapple on pizza: crime or genius?": "L'ananas sur la pizza : crime ou génie ?",
    "Are morning people secretly insufferable?": "Les gens du matin sont-ils secrètement insupportables ?",
    "Should couples share their phone codes?": "Les couples devraient-ils partager leurs codes de téléphone ?",
    "Is everyone pretending to like networking?": "Est-ce que tout le monde fait semblant d'aimer le networking ?",
    "Can someone be cool if they walk too slowly?": "Peut-on être cool quand on marche trop lentement ?",
    "Is oversharing online making everyone less mysterious?":
      "Le fait de trop se raconter en ligne rend-il tout le monde moins mystérieux ?",
    "Are Scorpios really a sign apart?": "Les Scorpions sont-ils vraiment à part ?",
    "Are Geminis unfairly judged?": "Les Gémeaux sont-ils injustement jugés ?",
    "Can you guess someone’s sign too fast?": "Peut-on deviner trop vite le signe de quelqu'un ?",
    "Is astrology just therapy in disguise?": "L'astrologie est-elle juste une thérapie déguisée ?",
    "Is replying too fast unattractive?": "Répondre trop vite est-il peu attirant ?",
    "Can you flirt without irony anymore?": "Peut-on encore flirter sans ironie ?",
    "Are people who say “I’m just honest” usually rude?":
      "Les gens qui disent « je suis juste honnête » sont-ils souvent impolis ?",
    "Is charisma more powerful than intelligence?": "Le charisme est-il plus puissant que l'intelligence ?",
    "Is coffee actually better than tea?": "Le café est-il vraiment meilleur que le thé ?",
    "Is sweet-and-salty always a good idea?": "Le sucré-salé est-il toujours une bonne idée ?",
    "Are people who run at 6am morally superior?": "Les gens qui courent à 6h du matin sont-ils moralement supérieurs ?",
    "Is being “booked and busy” just a modern flex?":
      "Être « booked and busy », est-ce juste une démonstration moderne de statut ?",
    "Is Paris better without Parisians?": "Paris est-il meilleur sans les Parisiens ?",
    "Does the metro build character?": "Le métro forge-t-il le caractère ?",
    "Is city life overrated after 30?": "La vie en ville est-elle surestimée après 30 ans ?",
    "Are rooftop bars all the same?": "Est-ce que tous les rooftop bars se ressemblent ?",
    "Is irony ruining sincerity?": "L'ironie est-elle en train de ruiner la sincérité ?",
    "Has dating become a branding exercise?": "Le dating est-il devenu un exercice de branding ?",
    "Both people spoke about the quiet forms of loneliness that can hide inside competent-looking lives, and the relief of being met with honesty instead of performance.":
      "Les deux personnes ont parlé des formes discrètes de solitude qui peuvent se cacher derrière des vies en apparence très maîtrisées, ainsi que du soulagement d'être accueilli avec honnêteté plutôt qu'avec performance.",
    "What kind of conversation do you wish existed more often in your everyday life?":
      "Quel type de conversation aimeriez-vous voir exister plus souvent dans votre quotidien ?",
  };

  return translations[text] ?? text;
}

export function translateReconnectStatus(status: string, locale: Locale) {
  if (locale === "fr") {
    if (status === "Mutual") return "Mutuel";
    if (status === "Pending") return "En attente";
  }

  return status;
}
