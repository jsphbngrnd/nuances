"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { TranscriptBubble } from "@/components/transcript-bubble";
import {
  buildDemoIntro,
  buildDemoReply,
  buildDemoSystemMessage,
  getDemoStageDuration,
  getInitialDemoStage,
  getNextStageAfterPartner,
  getPartnerStageForUserTurn,
  type DemoConversationStage,
} from "@/lib/demo-simulator";
import { saveDemoConversation } from "@/lib/demo-storage";
import type { Locale } from "@/lib/i18n";
import { getCopy, getModeName, translateSampleText } from "@/lib/i18n";
import { MODE_CONFIG } from "@/lib/modes";
import { getDemoRoomById, mockTopics, mockUsers } from "@/lib/mock-data";
import type { TranscriptMessage } from "@/lib/types";

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: null | (() => void);
  onerror: null | ((event: { error?: string }) => void);
  onresult: null | ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>>; resultIndex: number }) => void);
  onend: null | (() => void);
  start: () => void;
  stop: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return null;

  const browserWindow = window as Window & {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  };

  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
}

function getStageCardCopy(
  stage: DemoConversationStage,
  locale: Locale,
  currentUserName: string,
  partnerName: string
) {
  if (stage === "debate-opening-user") {
    return {
      canUserSpeak: true,
      badge:
        locale === "fr" ? "Ouverture · 60 sec" : "Opening · 60 sec",
      status:
        locale === "fr"
          ? `${currentUserName}, pose ton argument principal clairement.`
          : `${currentUserName}, give your main argument clearly.`,
    };
  }

  if (stage === "debate-opening-partner") {
    return {
      canUserSpeak: false,
      badge:
        locale === "fr" ? `${partnerName} répond` : `${partnerName} responds`,
      status:
        locale === "fr"
          ? `${partnerName} prend maintenant l'angle opposé.`
          : `${partnerName} is now taking the counter-position.`,
    };
  }

  if (stage === "debate-reply-user") {
    return {
      canUserSpeak: true,
      badge: locale === "fr" ? "Réplique · 30 sec" : "Reply · 30 sec",
      status:
        locale === "fr"
          ? `${currentUserName}, réponds au point le plus fort d'en face.`
          : `${currentUserName}, answer the strongest point from the other side.`,
    };
  }

  if (stage === "debate-reply-partner") {
    return {
      canUserSpeak: false,
      badge:
        locale === "fr" ? `${partnerName} contre-attaque` : `${partnerName} pushes back`,
      status:
        locale === "fr"
          ? `${partnerName} affine sa réplique.`
          : `${partnerName} is sharpening their reply.`,
    };
  }

  if (stage === "debate-closing-user") {
    return {
      canUserSpeak: true,
      badge: locale === "fr" ? "Clôture · 20 sec" : "Closing · 20 sec",
      status:
        locale === "fr"
          ? `${currentUserName}, donne ta conclusion courte.`
          : `${currentUserName}, give your short closing thought.`,
    };
  }

  if (stage === "debate-closing-partner") {
    return {
      canUserSpeak: false,
      badge:
        locale === "fr" ? `${partnerName} conclut` : `${partnerName} closes`,
      status:
        locale === "fr"
          ? `${partnerName} livre sa conclusion finale.`
          : `${partnerName} is giving the final close.`,
    };
  }

  if (stage === "debate-complete") {
    return {
      canUserSpeak: false,
      badge: locale === "fr" ? "Débat terminé" : "Debate complete",
      status:
        locale === "fr"
          ? "Les tours sont terminés. Tu peux ouvrir le résumé."
          : "The structured rounds are complete. You can open the summary.",
    };
  }

  if (stage === "funny-opening-user") {
    return {
      canUserSpeak: true,
      badge: locale === "fr" ? "Funny · 45 sec" : "Funny · 45 sec",
      status:
        locale === "fr"
          ? `${currentUserName}, lance ta take la plus drôle avec une vraie conviction.`
          : `${currentUserName}, launch your funniest take with real conviction.`,
    };
  }

  if (stage === "funny-opening-partner") {
    return {
      canUserSpeak: false,
      badge: locale === "fr" ? `${partnerName} joue le contre-camp` : `${partnerName} takes the opposite side`,
      status:
        locale === "fr"
          ? `${partnerName} défend maintenant la version la plus absurde du sujet.`
          : `${partnerName} is now defending the most absurd version of the prompt.`,
    };
  }

  if (stage === "funny-reply-user") {
    return {
      canUserSpeak: true,
      badge: locale === "fr" ? "Réplique · 20 sec" : "Reply · 20 sec",
      status:
        locale === "fr"
          ? `${currentUserName}, réponds vite, clairement, et garde le ton joueur.`
          : `${currentUserName}, answer quickly, clearly, and keep it playful.`,
    };
  }

  if (stage === "funny-reply-partner") {
    return {
      canUserSpeak: false,
      badge: locale === "fr" ? `${partnerName} renchérit` : `${partnerName} doubles down`,
      status:
        locale === "fr"
          ? `${partnerName} renforce sa take une dernière fois.`
          : `${partnerName} is sharpening the take one last time.`,
    };
  }

  if (stage === "funny-complete") {
    return {
      canUserSpeak: false,
      badge: locale === "fr" ? "Funny terminé" : "Funny complete",
      status:
        locale === "fr"
          ? "Le round est terminé. Tu peux passer au résumé et au vote rapide."
          : "The round is done. You can move to the summary and quick vote.",
    };
  }

  if (stage === "deep-opening-user") {
    return {
      canUserSpeak: true,
      badge: locale === "fr" ? "Ouverture · 90 sec" : "Opening · 90 sec",
      status:
        locale === "fr"
          ? `${currentUserName}, pose une réponse honnête et complète.`
          : `${currentUserName}, give one honest and complete opening answer.`,
    };
  }

  if (stage === "deep-opening-partner") {
    return {
      canUserSpeak: false,
      badge:
        locale === "fr" ? `${partnerName} répond` : `${partnerName} responds`,
      status:
        locale === "fr"
          ? `${partnerName} prend son temps avant l'échange libre.`
          : `${partnerName} is taking their opening turn before open exchange.`,
    };
  }

  if (stage === "deep-open") {
    return {
      canUserSpeak: true,
      badge: locale === "fr" ? "Échange libre · 2 min" : "Open exchange · 2 min",
      status:
        locale === "fr"
          ? "Le cadre s'ouvre maintenant. Tu peux relancer, préciser, ou approfondir."
          : "The structure is open now. You can probe, clarify, or go deeper.",
    };
  }

  return {
    canUserSpeak: true,
    badge: locale === "fr" ? "Échange libre" : "Open exchange",
    status:
      locale === "fr"
        ? "Les deux personnes peuvent parler. L'IA garde un ton calme et doux."
        : "Both people can speak. The AI partner keeps the tone calm and gentle.",
  };
}

function getQuickPrompts(stage: DemoConversationStage, locale: Locale, topicText = "") {
  const topic = topicText.toLowerCase();

  if (stage.startsWith("funny")) {
    if (topic.includes("pigeon")) {
      return locale === "fr"
        ? [
            "Ils survivent à Paris, ils méritent au moins un conseil municipal.",
            "S'ils subissent la ville, ils devraient avoir voix au chapitre.",
            "Leur sens politique n'est pas pire que celui de certains humains.",
          ]
        : [
            "They survive the city, they deserve at least a municipal vote.",
            "If they endure urban life, they should get a say in it.",
            "Their political instincts are not worse than some humans'.",
          ];
    }

    if (topic.includes("monday") || topic.includes("lundi")) {
      return locale === "fr"
        ? [
            "Le lundi demande trop d'énergie pour si peu de dignité.",
            "On ne peut pas appeler ça neutre quand tout le monde souffre pareil.",
            "Le lundi est surtout une violence administrative déguisée.",
          ]
        : [
            "Monday asks too much energy for too little dignity.",
            "You cannot call it neutral when everyone suffers in the same way.",
            "Monday is basically administrative violence in disguise.",
          ];
    }

    if (topic.includes("ghosting")) {
      return locale === "fr"
        ? [
            "Parfois disparaître est plus honnête qu'une fausse clôture tiède.",
            "Le ghosting n'est pas élégant, mais il n'est pas toujours immoral.",
            "Tout dépend si la conversation était confuse ou clairement morte.",
          ]
        : [
            "Sometimes disappearing is more honest than a fake lukewarm ending.",
            "Ghosting is not elegant, but it is not always immoral.",
            "It depends on whether the conversation was confused or already dead.",
          ];
    }

    return locale === "fr"
      ? [
          "Je défends cette opinion avec beaucoup trop de sérieux, et c'est précisément le plaisir.",
          "La bonne take est souvent celle qui tient à moitié entre vérité et mauvaise foi.",
          "Je suis prête à exagérer un peu si ça rend la conversation meilleure.",
        ]
      : [
          "I am defending this opinion with far too much seriousness, which is exactly the fun of it.",
          "The best take usually lives halfway between truth and elegant bad faith.",
          "I am willing to exaggerate a little if it improves the conversation.",
        ];
  }

  if (stage.startsWith("debate")) {
    if (topic.includes("ai")) {
      return locale === "fr"
        ? [
            "Je pense que l'outil révèle surtout nos habitudes déjà fragiles.",
            "Le vrai risque, c'est la délégation de l'attention, pas l'outil seul.",
            "Je ne dirais pas paresse, mais plutôt dépendance croissante au confort.",
          ]
        : [
            "I think the tool mostly reveals habits that were already weak.",
            "The real risk is outsourcing attention, not the tool by itself.",
            "I would not call it laziness, more a growing dependence on convenience.",
          ];
    }

    if (topic.includes("money") || topic.includes("freedom")) {
      return locale === "fr"
        ? [
            "L'argent élargit les choix, mais il ne garantit pas une vie libre.",
            "La vraie liberté dépend aussi du temps, de la santé et du contexte social.",
            "Je crois que l'argent enlève des contraintes plus qu'il ne crée du sens.",
          ]
        : [
            "Money expands choices, but it does not guarantee a free life.",
            "Real freedom also depends on time, health, and social context.",
            "I think money removes constraints more than it creates meaning.",
          ];
    }

    if (topic.includes("inheritance")) {
      return locale === "fr"
        ? [
            "Je comprends la transmission familiale, mais pas quand elle fige les inégalités.",
            "Limiter l'héritage peut protéger l'idée d'égalité des chances.",
            "Le vrai enjeu, c'est où l'on place la limite, pas le principe seul.",
          ]
        : [
            "I understand family transmission, but not when it hardens inequality.",
            "Limiting inheritance can protect the idea of equal opportunity.",
            "The real issue is where the limit sits, not just the principle itself.",
          ];
    }

    if (topic.includes("ambition")) {
      return locale === "fr"
        ? [
            "L'ambition devient toxique surtout quand elle se réduit au statut.",
            "Je ne crois pas qu'elle soit surestimée, seulement mal dirigée.",
            "Sans ambition, on perd aussi des formes très saines d'élan.",
          ]
        : [
            "Ambition turns toxic mostly when it gets reduced to status.",
            "I do not think it is overrated, just often badly directed.",
            "Without ambition, we also lose healthier forms of momentum.",
          ];
    }

    if (topic.includes("privacy") || topic.includes("convenience")) {
      return locale === "fr"
        ? [
            "On échange souvent notre vie privée contre du confort sans mesurer le prix réel.",
            "Le problème, c'est que la commodité paraît immédiate alors que la perte de contrôle est diffuse.",
            "Je pense que la vie privée compte surtout quand on a déjà commencé à la perdre.",
          ]
        : [
            "We often trade privacy for comfort without seeing the real cost.",
            "Convenience feels immediate, while loss of control feels diffuse.",
            "I think privacy matters most once we have already started losing it.",
          ];
    }

    return locale === "fr"
      ? [
          "Je pense que le sujet est plus nuancé qu'il n'en a l'air au départ.",
          "Le vrai point de tension n'est pas moral seulement, mais aussi pratique.",
          "Je suis d'accord avec une partie de l'idée, pas avec toute sa conclusion.",
        ]
      : [
          "I think the topic is more nuanced than it first appears.",
          "The real tension is not just moral, but practical too.",
          "I agree with part of the idea, just not with the whole conclusion.",
        ];
  }

  if (stage.startsWith("deep")) {
    if (topic.includes("alive")) {
      return locale === "fr"
        ? [
            "Je me sens le plus vivant quand je ne joue plus aucun rôle.",
            "Pour moi, ce sont souvent des moments très simples mais très présents.",
            "Je remarque ça surtout quand mon attention devient entière.",
          ]
        : [
            "I feel most alive when I stop performing any role.",
            "For me it is usually something simple, but deeply present.",
            "I notice it most when my attention becomes whole.",
          ];
    }

    if (topic.includes("understand about yourself")) {
      return locale === "fr"
        ? [
            "J'essaie encore de comprendre ce qui, chez moi, relève du désir ou de la peur.",
            "Je crois que je comprends mieux mes contradictions qu'avant, mais pas encore leur racine.",
            "Le plus difficile, c'est souvent de voir ce qu'on répète sans s'en rendre compte.",
          ]
        : [
            "I am still trying to understand what in me comes from desire versus fear.",
            "I understand my contradictions better than before, but not yet their root.",
            "The hardest part is seeing what we keep repeating without noticing.",
          ];
    }

    if (topic.includes("generation")) {
      return locale === "fr"
        ? [
            "Je pense qu'on confond souvent fragilité visible et manque de solidité intérieure.",
            "Ce que les gens comprennent mal, c'est peut-être moins notre génération que le monde qu'elle traverse.",
            "Il y a une fatigue spécifique à devoir toujours se raconter clairement.",
          ]
        : [
            "I think people often confuse visible fragility with lack of inner strength.",
            "What gets misunderstood may be less our generation than the world it is moving through.",
            "There is a specific fatigue in always having to explain yourself clearly.",
          ];
    }

    if (topic.includes("home")) {
      return locale === "fr"
        ? [
            "Un endroit ressemble à chez moi quand je peux y baisser ma garde.",
            "Le sentiment de maison dépend plus de l'atmosphère que de l'adresse.",
            "Parfois, chez soi n'est pas un lieu mais une qualité de présence.",
          ]
        : [
            "A place feels like home when I can lower my guard there.",
            "The feeling of home depends more on atmosphere than on address.",
            "Sometimes home is not a place, but a quality of presence.",
          ];
    }

    return locale === "fr"
      ? [
          "Ce qui change tout, c'est souvent un détail très précis.",
          "J'ai l'impression que je cherche surtout plus de présence.",
          "Le plus vrai n'est pas toujours le plus spectaculaire.",
        ]
      : [
          "What changes everything is usually one very precise detail.",
          "I think what I’m really looking for is more presence.",
          "The truest thing is not always the most dramatic one.",
        ];
  }

  if (topic.includes("miss")) {
    return locale === "fr"
      ? [
          "Ce qui me manque n'est pas seulement une personne, mais une sensation précise.",
          "Le manque revient souvent à certaines heures plus qu'à d'autres.",
          "Je crois que ce qui me manque le plus, c'est une forme de simplicité partagée.",
        ]
      : [
          "What I miss is not only a person, but a very specific feeling.",
          "Missing something tends to return at certain hours more than others.",
          "I think what I miss most is a kind of shared simplicity.",
        ];
  }

  if (topic.includes("say more easily")) {
    return locale === "fr"
      ? [
          "J'aimerais dire plus facilement quand quelque chose me touche vraiment.",
          "Le plus dur, c'est souvent de parler avant d'être déjà saturé.",
          "Je crois qu'on apprend tard à parler sans se protéger d'abord.",
        ]
      : [
          "I wish I could say more easily when something really affects me.",
          "The hardest part is usually speaking before I am already overwhelmed.",
          "I think we learn late how to speak without protecting ourselves first.",
        ];
  }

  if (topic.includes("night")) {
    return locale === "fr"
      ? [
          "Cette nuit a une qualité un peu floue, mais très présente.",
          "J'avais surtout besoin d'un endroit calme pour parler ce soir.",
          "Il y a des nuits où penser devient plus fort que faire.",
        ]
      : [
          "This night feels a little blurry, but very present.",
          "I mostly needed a calm place to speak tonight.",
          "Some nights thinking becomes louder than doing.",
        ];
  }

  if (topic.includes("carrying")) {
    return locale === "fr"
      ? [
          "Le plus difficile, c'est de nommer ce que je porte exactement.",
          "Parfois ce qu'on porte n'est pas dramatique, juste constant.",
          "J'ai l'impression que ça s'alourdit surtout quand je dois faire comme si tout allait bien.",
        ]
      : [
          "The hardest part is naming what I’m actually carrying.",
          "Sometimes what we carry is not dramatic, just constant.",
          "It gets heavier mainly when I have to act like everything is fine.",
        ];
  }

  return locale === "fr"
    ? [
        "Ce soir, j'avais surtout besoin d'un endroit calme pour parler.",
        "Je crois que j'ai besoin d'une réponse simple et honnête.",
        "Il y a quelque chose que j'essaie encore de formuler correctement.",
      ]
    : [
        "Tonight I mostly needed a calm place to speak.",
        "I think I need a simple and honest answer tonight.",
        "There is something I am still trying to phrase properly.",
      ];
}

function getTransitionMessage(
  roomId: string,
  nextStage: DemoConversationStage,
  locale: Locale
) {
  if (nextStage === "debate-reply-user") {
    return buildDemoSystemMessage(
      roomId,
      locale === "fr"
        ? "Tour suivant : réplique courte. Répondez directement au meilleur argument entendu."
        : "Next round: short reply. Answer the strongest argument you just heard.",
      "debate-reply"
    );
  }

  if (nextStage === "debate-closing-user") {
    return buildDemoSystemMessage(
      roomId,
      locale === "fr"
        ? "Clôture : chacun peut donner une dernière phrase claire."
        : "Closing round: each person gets one short final statement.",
      "debate-closing"
    );
  }

  if (nextStage === "debate-complete") {
    return buildDemoSystemMessage(
      roomId,
      locale === "fr"
        ? "Le débat est terminé. Le résumé final peut maintenant refléter vos vrais arguments."
        : "The debate is complete. The final summary can now reflect your actual arguments.",
      "debate-complete"
    );
  }

  if (nextStage === "funny-reply-user") {
    return buildDemoSystemMessage(
      roomId,
      locale === "fr"
        ? "Réplique rapide : vingt secondes pour défendre ta take sans la sur-expliquer."
        : "Quick reply: twenty seconds to defend your take without over-explaining it.",
      "funny-reply"
    );
  }

  if (nextStage === "funny-complete") {
    return buildDemoSystemMessage(
      roomId,
      locale === "fr"
        ? "Le round Funny est terminé. Le résumé et le vote rapide peuvent maintenant départager la meilleure take."
        : "The Funny round is complete. The summary and quick vote can now decide which take landed best.",
      "funny-complete"
    );
  }

  if (nextStage === "deep-open") {
    return buildDemoSystemMessage(
      roomId,
      locale === "fr"
        ? "L'ouverture guidée est terminée. L'échange libre commence maintenant."
        : "The guided opening is complete. Open exchange begins now.",
      "deep-open"
    );
  }

  return null;
}

export function LiveRoom({
  roomId,
  locale,
  topicId,
  currentUserAlias,
}: {
  roomId: string;
  locale: Locale;
  topicId?: string;
  currentUserAlias?: string;
}) {
  const room = getDemoRoomById(roomId);
  const topic =
    mockTopics.find((item) => item.id === topicId && item.mode === room.mode) ??
    mockTopics.find((item) => item.id === room.topicId);
  const topicText = topic ? translateSampleText(topic.text, locale) : "";
  const mode = MODE_CONFIG[room.mode];
  const t = getCopy(locale);
  const currentUser = {
    ...mockUsers[0],
    displayName: currentUserAlias ?? mockUsers[0].displayName,
    alias: currentUserAlias ?? mockUsers[0].alias,
  };
  const partner = mockUsers[1];
  const initialStage = getInitialDemoStage(room.mode);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const queueVoiceTranscriptRef = useRef<(content: string) => void>(() => {});
  const finalTranscriptRef = useRef("");
  const shouldAutoSendVoiceRef = useRef(false);
  const [draft, setDraft] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [lastSentAsVoice, setLastSentAsVoice] = useState(false);
  const [aiReplySource, setAiReplySource] = useState<"live" | "fallback">("fallback");
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [stage, setStage] = useState<DemoConversationStage>(initialStage);
  const [secondsLeft, setSecondsLeft] = useState(getDemoStageDuration(initialStage));
  const [messages, setMessages] = useState<TranscriptMessage[]>(() =>
    buildDemoIntro(room.id, locale, room.mode, partner, topic?.text ?? "")
  );

  useEffect(() => {
    const nextStage = getInitialDemoStage(room.mode);
    setStage(nextStage);
    setSecondsLeft(getDemoStageDuration(nextStage));
    setMessages(buildDemoIntro(room.id, locale, room.mode, partner, topic?.text ?? ""));
    setDraft("");
    setIsPartnerTyping(false);
    setLastSentAsVoice(false);
    setAiReplySource("fallback");
    setIsListening(false);
    setInterimTranscript("");
    setSpeechError(null);
    finalTranscriptRef.current = "";
    shouldAutoSendVoiceRef.current = false;
    recognitionRef.current?.stop();
  }, [locale, partner, room.id, room.mode, topic?.text]);

  useEffect(() => {
    const Recognition = getSpeechRecognitionConstructor();
    setSpeechSupported(Boolean(Recognition));

    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = locale === "fr" ? "fr-FR" : "en-US";

    recognition.onstart = () => {
      finalTranscriptRef.current = "";
      setSpeechError(null);
      setInterimTranscript("");
      setIsListening(true);
    };

    recognition.onerror = (event) => {
      setSpeechError(
        locale === "fr"
          ? `Transcription indisponible${event.error ? ` : ${event.error}` : ""}.`
          : `Transcription unavailable${event.error ? `: ${event.error}` : ""}.`
      );
    };

    recognition.onresult = (event) => {
      let nextFinal = "";
      let nextInterim = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result?.[0]?.transcript?.trim() ?? "";
        if (!transcript) continue;

        const isFinalResult = "isFinal" in result ? Boolean((result as { isFinal?: boolean }).isFinal) : false;

        if (isFinalResult) {
          nextFinal = `${nextFinal} ${transcript}`.trim();
        } else {
          nextInterim = `${nextInterim} ${transcript}`.trim();
        }
      }

      if (nextFinal) {
        finalTranscriptRef.current = `${finalTranscriptRef.current} ${nextFinal}`.trim();
      }

      setInterimTranscript(nextInterim);
      setDraft(`${finalTranscriptRef.current}${nextInterim ? ` ${nextInterim}` : ""}`.trim());
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");

      const transcript = finalTranscriptRef.current.trim();
      finalTranscriptRef.current = "";

      if (shouldAutoSendVoiceRef.current && transcript) {
        shouldAutoSendVoiceRef.current = false;
        queueVoiceTranscriptRef.current(transcript);
        return;
      }

      shouldAutoSendVoiceRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [locale]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setSecondsLeft(getDemoStageDuration(stage));
  }, [stage]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isPartnerTyping]);

  useEffect(() => {
    saveDemoConversation({
      roomId: room.id,
      mode: room.mode,
      topicText,
      messages,
      updatedAt: new Date().toISOString(),
    });
  }, [messages, room.id, room.mode, topicText]);

  const stageCard = useMemo(
    () => getStageCardCopy(stage, locale, currentUser.displayName, partner.displayName),
    [currentUser.displayName, locale, partner.displayName, stage]
  );

  const userExchangeCount = messages.filter((message) => message.userId === currentUser.id).length;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const quickPrompts = getQuickPrompts(stage, locale, topic?.text ?? "");
  const canSend =
    stageCard.canUserSpeak &&
    !isPartnerTyping &&
    stage !== "debate-complete" &&
    stage !== "funny-complete";

  useEffect(() => {
    queueVoiceTranscriptRef.current = (content: string) => {
      queueUserMessage(content, true);
    };
  });

  useEffect(() => {
    if (!canSend && isListening && recognitionRef.current) {
      shouldAutoSendVoiceRef.current = false;
      recognitionRef.current.stop();
    }
  }, [canSend, isListening]);

  async function fetchAiReply(input: {
    userMessage: string;
    exchangeCount: number;
    partnerStage: DemoConversationStage;
    pendingMessages: TranscriptMessage[];
  }): Promise<{ message: TranscriptMessage; usedFallback: boolean }> {
    try {
      const response = await fetch("/api/demo/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          mode: room.mode,
          roomId: room.id,
          topicText: topic?.text,
          userMessage: input.userMessage,
          exchangeCount: input.exchangeCount,
          stage: input.partnerStage,
          partner,
          messages: input.pendingMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Reply route returned ${response.status}`);
      }

      const payload = (await response.json()) as {
        message?: TranscriptMessage;
        usedFallback?: boolean;
      };

      if (!payload.message) {
        throw new Error("Reply route returned no message");
      }

      return {
        message: payload.message,
        usedFallback: Boolean(payload.usedFallback),
      };
    } catch {
      return {
        message: buildDemoReply({
          locale,
          mode: room.mode,
          roomId: room.id,
          partner,
          userMessage: input.userMessage,
          exchangeCount: input.exchangeCount,
          stage: input.partnerStage,
          topicText: topic?.text,
        }),
        usedFallback: true,
      };
    }
  }

  function queueUserMessage(content: string, asVoice = false) {
    const trimmed = content.trim();

    if (!trimmed || !canSend) return;

    const outgoing: TranscriptMessage = {
      id: `user-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      roomId: room.id,
      userId: currentUser.id,
      speaker: currentUser.displayName,
      sourceType: asVoice ? "speech_transcript" : "text",
      content: trimmed,
      moderationStatus: "approved",
      createdAt: new Date().toISOString(),
    };

    const partnerStage = getPartnerStageForUserTurn(stage);
    const nextExchangeCount = userExchangeCount + 1;
    const pendingMessages = [...messages, outgoing];

    setMessages((current) => [...current, outgoing]);
    setDraft("");
    setIsPartnerTyping(true);
    setLastSentAsVoice(asVoice);
    setStage(partnerStage);

    window.setTimeout(async () => {
      const replyResult = await fetchAiReply({
        userMessage: trimmed,
        exchangeCount: nextExchangeCount,
        partnerStage,
        pendingMessages,
      });
      const reply = replyResult.message;
      const nextStage = getNextStageAfterPartner(partnerStage);
      const transition = getTransitionMessage(room.id, nextStage, locale);

      setMessages((current) =>
        transition ? [...current, reply, transition] : [...current, reply]
      );
      setAiReplySource(replyResult.usedFallback ? "fallback" : "live");
      setIsPartnerTyping(false);
      setStage(nextStage);
    }, room.mode === "late-night" ? 1500 : 1700);
  }

  function sendMessage() {
    queueUserMessage(draft, false);
  }

  function sendVoiceDemo() {
    const voiceDraft =
      draft.trim() ||
      (locale === "fr"
        ? room.mode === "debate"
          ? "Je pense que l'outil amplifie surtout les habitudes qu'on avait déjà."
          : room.mode === "deep"
            ? "Je me sens le plus vivant quand je suis attentif sans jouer un rôle."
            : "Ce soir, j'avais surtout besoin d'un espace calme pour être un peu honnête."
        : room.mode === "debate"
          ? "I think the tool mostly amplifies the habits we already had."
          : room.mode === "deep"
            ? "I feel most alive when I’m attentive and not performing."
            : "Tonight I mostly needed a calm space to be a little honest.");

    queueUserMessage(voiceDraft, true);
  }

  function toggleVoiceCapture() {
    if (!canSend) return;

    if (!speechSupported || !recognitionRef.current) {
      sendVoiceDemo();
      return;
    }

    if (isListening) {
      shouldAutoSendVoiceRef.current = true;
      recognitionRef.current.stop();
      return;
    }

    shouldAutoSendVoiceRef.current = true;
    setSpeechError(null);
    finalTranscriptRef.current = "";
    setInterimTranscript("");
    recognitionRef.current.start();
  }

  return (
    <div className="screen-stack">
      <header className="glass-panel bg-room-glow p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="mt-3 font-display text-[2.45rem] font-semibold leading-none tracking-[-0.05em] text-ink">
              {topicText}
            </h1>
            <p className="eyebrow mt-3">
              {mode.emoji} {getModeName(room.mode, locale)} {t.room.roomSuffix}
            </p>
            <p className="mt-4 max-w-[34ch] text-sm leading-6 text-ink/70">
              {locale === "fr"
                ? "Démo MVP avec tours simulés, réponses IA et résumé final relié au vrai transcript."
                : "MVP demo with structured turns, AI replies, and a final summary connected to the real transcript."}
            </p>
            <p className="mt-3 text-[0.72rem] uppercase tracking-[0.22em] text-stone">
              {aiReplySource === "live"
                ? locale === "fr"
                  ? "Partenaire IA live"
                  : "Live AI partner"
                : locale === "fr"
                  ? "Partenaire de fallback démo"
                  : "Demo fallback partner"}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/28 px-4 py-3 text-right">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-stone">
              {t.room.timeLeft}
            </p>
            <p className="mt-1 text-3xl font-semibold text-ink">
              {minutes}:{seconds}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-[24px] border border-white/10 bg-white/6 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-[0.24em] text-stone">
              {t.room.currentTurn}
            </span>
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink/72">
              {isPartnerTyping
                ? locale === "fr"
                  ? "Partenaire IA"
                  : "AI partner"
                : stageCard.badge}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg text-ink">
              {isPartnerTyping
                ? locale === "fr"
                  ? `${partner.displayName} prépare sa réponse...`
                  : `${partner.displayName} is preparing a reply...`
                : stageCard.status}
            </p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-bone animate-pulseLine" />
              <span className="text-xs uppercase tracking-[0.2em] text-stone">
              {t.room.live}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-5 glass-panel p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="eyebrow">{t.room.transcript}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">
            {locale === "fr" ? "Démo IA + vos messages" : "AI demo + your messages"}
          </p>
        </div>
        <div className="grid gap-3">
          {messages.map((message) => (
            <TranscriptBubble
              key={message.id}
              message={message}
              isOwn={message.userId === currentUser.id}
            />
          ))}
          {isPartnerTyping ? (
            <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-ink/72">
              {locale === "fr"
                ? `${partner.displayName} écrit une réponse...`
                : `${partner.displayName} is typing a reply...`}
            </div>
          ) : null}
          <div ref={transcriptEndRef} />
        </div>
      </section>

      <section className="mt-5 grid gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">{t.room.input}</p>
              <p className="mt-2 text-sm leading-6 text-ink/70">
                {canSend
                  ? t.room.inputBody
                  : locale === "fr"
                    ? "Attends le prochain tour ouvert pour envoyer ton message."
                    : "Wait for the next open turn before sending your message."}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleVoiceCapture}
              disabled={!canSend}
              className={`flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full border text-sm font-semibold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-45 ${
                isListening
                  ? "border-white/14 bg-black text-white"
                  : "border-black/10 bg-white text-black"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path
                  d="M12 15.5a3 3 0 0 0 3-3V8.75a3 3 0 1 0-6 0v3.75a3 3 0 0 0 3 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.75 11.75a5.25 5.25 0 1 0 10.5 0M12 17v3.25M9.5 20.25h5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                {isListening
                  ? locale === "fr"
                    ? "Stop"
                    : "Stop"
                  : t.room.talk}
              </span>
            </button>
          </div>

          <div className="mt-4 rounded-[22px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-ink/74">
            {locale === "fr"
              ? `Partenaire de démo : ${partner.displayName}. Cette room simule un vrai flow produit, avec personnalité IA différente selon le mode.`
              : `Demo partner: ${partner.displayName}. This room simulates the real product flow, with a different AI personality in each mode.`}
          </div>

          <div className="mt-4 rounded-[22px] border border-white/10 bg-black/24 px-4 py-3 text-sm text-ink/72">
            {speechSupported
              ? isListening
                ? locale === "fr"
                  ? `Transcription en cours... ${interimTranscript || "Parle naturellement, puis appuie sur Stop pour envoyer."}`
                  : `Listening... ${interimTranscript || "Speak naturally, then tap Stop to send."}`
                : locale === "fr"
                  ? "Le bouton Parler utilise la transcription du navigateur dans ce proto."
                  : "The Talk button uses browser transcription in this prototype."
              : locale === "fr"
                ? "La transcription navigateur n'est pas disponible ici. Le bouton Parler utilise le fallback de démo."
                : "Browser transcription is not available here. The Talk button falls back to the demo voice flow."}
            {speechError ? ` ${speechError}` : ""}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setDraft(prompt)}
                className="rounded-full border border-white/15 bg-white/[0.1] px-3 py-2 text-xs font-medium text-ink/90 transition hover:border-bone hover:bg-bone hover:text-fog"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="mt-4 flex gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              aria-label="Message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={
                canSend
                  ? locale === "fr"
                    ? "Écris ton message puis clique sur Envoyer..."
                    : "Write your message, then click Send..."
                  : locale === "fr"
                    ? "Le prochain tour arrive après la réponse de l'IA..."
                    : "The next turn opens after the AI reply..."
              }
              disabled={!canSend}
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-ink placeholder:text-stone focus:border-bone/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!draft.trim() || !canSend}
              className="rounded-full border border-white/10 bg-black/28 px-4 py-3 text-sm text-ink transition hover:border-bone hover:bg-bone hover:text-fog disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.room.send}
            </button>
          </form>

          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-stone">
            <span>
              {locale === "fr"
                ? isListening
                  ? "Micro actif"
                  : lastSentAsVoice
                    ? "Dernier envoi : transcription vocale"
                    : "Dernier envoi : texte"
                : lastSentAsVoice
                  ? "Last send: voice transcript"
                  : isListening
                    ? "Mic live"
                    : "Last send: text"}
            </span>
            <span>
              {room.mode === "debate"
                ? locale === "fr"
                  ? "Débat structuré"
                  : "Structured debate"
                : room.mode === "deep"
                  ? locale === "fr"
                    ? "Ouverture guidée"
                    : "Guided opening"
                  : locale === "fr"
                    ? "Échange doux"
                    : "Gentle exchange"}
            </span>
          </div>
        </div>

        <div className="glass-panel p-4">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <button className="rounded-full border border-white/15 bg-white/[0.1] px-4 py-3 font-medium text-ink/90 transition hover:border-bone hover:bg-white/[0.16]">
              {t.room.report}
            </button>
            <button className="rounded-full border border-white/15 bg-white/[0.1] px-4 py-3 font-medium text-ink/90 transition hover:border-bone hover:bg-white/[0.16]">
              {t.room.block}
            </button>
            <Link
              href={`/summary/${room.id}`}
              className="rounded-full bg-bone px-4 py-3 text-center text-fog transition hover:opacity-90"
            >
              {t.room.end}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
