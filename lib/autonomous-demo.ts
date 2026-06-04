import type { ConversationMode, TranscriptMessage } from "@/lib/types";

export type DemoPersona = {
  id: string;
  displayName: string;
  role: string;
  voice: string;
  worldview: string;
  writingStyle: string;
  favoriteMove: string;
};

export const autonomousDemoPersonas: DemoPersona[] = [
  {
    id: "persona-alba",
    displayName: "Alba",
    role: "Creative director",
    voice: "Sharp, elegant, slightly severe",
    worldview: "Believes taste is really a form of attention.",
    writingStyle: "Short sentences. High conviction. Little softness.",
    favoriteMove: "Cuts through vagueness and forces a position.",
  },
  {
    id: "persona-idris",
    displayName: "Idris",
    role: "Policy analyst",
    voice: "Measured, systemic, lucid",
    worldview: "Looks for incentives, structures, and second-order effects.",
    writingStyle: "Calm, logical, never rushed.",
    favoriteMove: "Reframes personal opinions as social patterns.",
  },
  {
    id: "persona-salome",
    displayName: "Salome",
    role: "Essayist",
    voice: "Reflective, intimate, literary",
    worldview: "Sees emotion as information, not weakness.",
    writingStyle: "Soft cadence, precise images, longer phrases.",
    favoriteMove: "Turns an argument into something personal and human.",
  },
  {
    id: "persona-noe",
    displayName: "Noe",
    role: "Internet native",
    voice: "Fast, funny, socially observant",
    worldview: "Reads everything through culture, status, and awkwardness.",
    writingStyle: "Quick takes, punchlines, surprising clarity.",
    favoriteMove: "Makes a sharp point through humor instead of solemnity.",
  },
];

export type AutonomousConversation = {
  id: string;
  mode: ConversationMode;
  title: string;
  topic: string;
  setup: string;
  participants: DemoPersona[];
  messages: TranscriptMessage[];
  recap: {
    eyebrow: string;
    title: string;
    summary: string;
    points: string[];
    closing: string;
  };
};

function makeTranscriptMessage({
  roomId,
  userId,
  speaker,
  content,
  sourceType = "speech_transcript",
  index,
}: {
  roomId: string;
  userId: string | "system";
  speaker: string;
  content: string;
  sourceType?: "text" | "speech_transcript" | "system";
  index: number;
}): TranscriptMessage {
  return {
    id: `${roomId}-${index}`,
    roomId,
    userId,
    speaker,
    sourceType,
    content,
    moderationStatus: "approved",
    createdAt: new Date(Date.now() + index * 1000).toISOString(),
  };
}

function buildMessages(
  roomId: string,
  setup: string,
  entries: Array<{ persona?: DemoPersona; content: string; sourceType?: "text" | "speech_transcript" | "system" }>
) {
  return entries.map((entry, index) =>
    makeTranscriptMessage({
      roomId,
      userId: entry.persona?.id ?? "system",
      speaker: entry.persona?.displayName ?? "NUANCE",
      content: entry.content,
      sourceType: entry.sourceType ?? (entry.persona ? "speech_transcript" : "system"),
      index,
    })
  );
}

export const autonomousConversations: AutonomousConversation[] = [
  {
    id: "autonomous-debate-ai",
    mode: "debate",
    title: "Debate demo",
    topic: "Is AI making us intellectually lazy?",
    setup:
      "The room is structured like a compact Between Us debate between two distinct personas: sharp openings, direct replies, and a clean clash of styles.",
    participants: [autonomousDemoPersonas[0], autonomousDemoPersonas[1]],
    messages: buildMessages("autonomous-debate-ai", "", [
      {
        content:
          "Autonomous demo: two personas enter a structured debate room and take clearly different positions on the same topic.",
        sourceType: "system",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "I think yes, quite often. Not because AI is evil, but because convenience erodes standards quietly. When the first draft arrives too easily, many people stop asking whether their own thinking was ever awake.",
      },
      {
        persona: autonomousDemoPersonas[1],
        content:
          "I would push back on that. AI does not automatically reduce effort; it redistributes it. The real question is whether users move the effort upstream into judgment, framing, and verification, or simply surrender those functions.",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "Yes, but that sounds more optimistic than what most people actually do. In practice, many users stop at plausibility. The answer looks coherent, so they treat coherence as understanding.",
      },
      {
        persona: autonomousDemoPersonas[1],
        content:
          "That is fair, but we should be careful not to romanticize friction. Plenty of older tools also reduced cognitive load. The issue is not reduced labor by itself, but whether the user retains responsibility for the conclusion.",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "Then maybe the real danger is cultural rather than technical. If the norm becomes speed over encounter, AI will not just save time, it will teach people to expect thought without the cost of thinking.",
      },
      {
        persona: autonomousDemoPersonas[1],
        content:
          "And my answer would be: that is exactly why the norm matters more than the model. AI can absolutely weaken judgment, but it can also sharpen it when used inside a culture of verification. The tool is powerful; the discipline around it is decisive.",
      },
    ]),
    recap: {
      eyebrow: "Debate recap",
      title: "What stayed in the room",
      summary:
        "Alba argues that AI quietly lowers standards by making coherence feel like understanding. Idris accepts the risk, but insists the decisive factor is not the model itself but the discipline and verification culture surrounding it.",
      points: [
        "Alba’s strongest point: convenience can normalize unearned certainty.",
        "Idris’s strongest point: tools do not decide the outcome; habits of judgment do.",
        "Shared ground: both agree the real danger appears when speed replaces encounter.",
      ],
      closing:
        "The disagreement is not whether AI can weaken thought, but whether that outcome is built into the tool or produced by the norms around it.",
    },
  },
  {
    id: "autonomous-debate-phone-codes",
    mode: "debate",
    title: "Debate x Intimacy",
    topic: "Should couples share their phone codes?",
    setup:
      "A tighter, more relational debate room. Two personas take opposite views on privacy, trust, and the performance of transparency.",
    participants: [autonomousDemoPersonas[0], autonomousDemoPersonas[3]],
    messages: buildMessages("autonomous-debate-phone-codes", "", [
      {
        content:
          "Autonomous demo: two personas enter a compact debate room on privacy inside relationships.",
        sourceType: "system",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "I think sharing codes can be fine if it happens naturally. Not as a loyalty exam, but as the boring intimacy of everyday life. I know your code because I sometimes change the music in the car. That is different from surveillance.",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "Exactly, and that difference is the whole point. The second it becomes symbolic, it turns coarse. If access is meant to prove trust, then trust is already damaged.",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "Yes, but I also think some people hide behind this very chic language of boundaries when they simply want all the privileges of closeness without any vulnerability.",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "Vulnerability is not administrative access. I can be completely honest with you and still want one part of my interior life to remain unsearched. Privacy is not automatically secrecy.",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "True, but some couples perform privacy so aggressively that it starts to feel like branding. Like congratulations, your relationship is so evolved that nobody may ever touch the sacred rectangle.",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "That is funny, but still beside the real issue. The mature version is simple: codes can be shared in practice, but they should never be demanded as evidence. The request itself is inelegant.",
      },
    ]),
    recap: {
      eyebrow: "Debate recap",
      title: "Trust versus access",
      summary:
        "Noe defends the ordinary, practical side of sharing phone codes in close relationships. Alba agrees access can happen naturally, but rejects the idea that it should ever function as proof of loyalty.",
      points: [
        "Noe’s strongest point: intimacy sometimes looks mundane, not ceremonial.",
        "Alba’s strongest point: privacy is not the same thing as secrecy.",
        "Shared ground: codes may be shared casually, but demands for access feel corrosive.",
      ],
      closing:
        "The room lands on a subtle distinction: access can belong to closeness, but asking for it as a test almost always weakens the very trust it claims to protect.",
    },
  },
  {
    id: "autonomous-funny-ghosting",
    mode: "funny",
    title: "Funny demo",
    topic: "Is ghosting ever acceptable?",
    setup:
      "Four personas enter the same room. Nobody is trying to win cleanly. The point is to hear four very different minds collide around the same prompt.",
    participants: autonomousDemoPersonas,
    messages: buildMessages("autonomous-funny-ghosting", "", [
      {
        content:
          "Autonomous demo: four personas are matched into the same room. The conversation now unfolds on its own.",
        sourceType: "system",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "Acceptable, yes, but usually cowardly. People call it boundary-setting when often it is just an unwillingness to endure one uncomfortable sentence.",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "I think ghosting is the social equivalent of closing 37 tabs at once and pretending you were being intentional. Sometimes it is clean, but mostly it is panic with good branding.",
      },
      {
        persona: autonomousDemoPersonas[1],
        content:
          "The key difference is whether the interaction created an expectation of continuity. If two people have established even a minimal relational contract, disappearing becomes a choice that shifts the emotional cost entirely onto the other person.",
      },
      {
        persona: autonomousDemoPersonas[2],
        content:
          "What makes ghosting sting is not only silence. It is the tiny humiliation of realizing your inner narrative was warmer than the reality on the other side.",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "Exactly. We overcomplicate this. A short honest message is inelegant for thirty seconds; ghosting is inelegant in memory for weeks.",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "But if someone is chaotic, pushy, or weirdly entitled, I am sorry, the Irish exit of the heart remains a public service.",
      },
      {
        persona: autonomousDemoPersonas[1],
        content:
          "That is the exception that proves the rule. Safety changes the ethics. Convenience does not.",
      },
      {
        persona: autonomousDemoPersonas[2],
        content:
          "Maybe that is the real split: ghosting can be protective, but it should not become a lifestyle aesthetic.",
      },
    ]),
    recap: {
      eyebrow: "Funny recap",
      title: "Where they landed",
      summary:
        "The room keeps ghosting morally ambiguous but socially revealing: sometimes protective, often avoidant, and almost always more about discomfort than principle.",
      points: [
        "Noe reframes ghosting as panic made stylish.",
        "Idris draws the ethical line at expectation and relational responsibility.",
        "Salome names the emotional cost: the humiliation of mismatched narratives.",
      ],
      closing:
        "The group mostly agrees that silence can be justified by safety, but not by convenience dressed up as taste.",
    },
  },
  {
    id: "autonomous-funny-voice-notes",
    mode: "funny",
    title: "Funny x Culture",
    topic: "Are voice notes better than texts?",
    setup:
      "A lighter room built around culture, habits, and social irritation. The exchange is quick, playful, and easy to follow.",
    participants: [autonomousDemoPersonas[3], autonomousDemoPersonas[1], autonomousDemoPersonas[2]],
    messages: buildMessages("autonomous-funny-voice-notes", "", [
      {
        content:
          "Autonomous demo: a short Funny room about the politics of the voice note.",
        sourceType: "system",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "Voice notes are amazing when they are charming and criminal when they are long. A 34-second burst of gossip? Human. Four minutes of wandering consciousness? Hostile architecture.",
      },
      {
        persona: autonomousDemoPersonas[1],
        content:
          "They are efficient for the sender and expensive for the receiver. That imbalance is why they divide people so sharply. The burden of transcription gets outsourced socially.",
      },
      {
        persona: autonomousDemoPersonas[2],
        content:
          "And yet they do something text cannot. They carry hesitation, warmth, embarrassment. Sometimes the message is not the information but the way the person arrives inside the sentence.",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "Yes, exactly. A voice note can feel like someone entering the room instead of merely updating the chat log.",
      },
      {
        persona: autonomousDemoPersonas[1],
        content:
          "Which is lovely until you are in public, or at work, or on a train, and someone sends you what is basically a podcast with emotional stakes.",
      },
      {
        persona: autonomousDemoPersonas[2],
        content:
          "So maybe voice notes are not better than texts. They are just more intimate, and therefore more demanding.",
      },
    ]),
    recap: {
      eyebrow: "Funny recap",
      title: "The social cost of audio",
      summary:
        "The room treats voice notes as both charming and imposing: richer than text in feeling, but heavier in attention and context for the person receiving them.",
      points: [
        "Noe frames the issue as a matter of duration and etiquette.",
        "Idris names the structural imbalance: convenience for one person, effort for the other.",
        "Salome defends the emotional texture that voice can carry.",
      ],
      closing:
        "The group ends on a balanced take: voice notes are not superior to text, just more intimate and therefore more demanding.",
    },
  },
  {
    id: "autonomous-deep-alive",
    mode: "deep",
    title: "Deep demo",
    topic: "When do you feel most alive?",
    setup:
      "The room opens with a slower rhythm. The same question passes through four different temperaments and becomes four different answers.",
    participants: autonomousDemoPersonas,
    messages: buildMessages("autonomous-deep-alive", "", [
      {
        content:
          "Autonomous demo: this room is running in Deep mode. Each persona answers in their own register.",
        sourceType: "system",
      },
      {
        persona: autonomousDemoPersonas[2],
        content:
          "Most alive is rarely the loudest moment for me. It is usually when I feel completely unguarded in my attention, walking, writing, or listening closely enough that time stops announcing itself.",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "I feel most alive when my standards wake up. A good room, a hard problem, a sentence that finally lands exactly where it should. Precision is a form of electricity.",
      },
      {
        persona: autonomousDemoPersonas[1],
        content:
          "For me it is when thinking and action stop being separate. A conversation becomes useful, a pattern becomes visible, and suddenly you can intervene instead of just observing.",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "Honestly? Late dinners that become accidental philosophy. The point where everyone stops performing and says something too real, then laughs because nobody expected the night to get honest.",
      },
      {
        persona: autonomousDemoPersonas[2],
        content:
          "That is beautiful actually. Maybe feeling alive is less about intensity than coherence. Something in you lines up, even briefly.",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "Yes, but coherence does not always look peaceful. Sometimes it looks like friction. You finally care enough to become exact.",
      },
      {
        persona: autonomousDemoPersonas[1],
        content:
          "Which suggests aliveness may be a mix of presence and consequence. You are not merely feeling. You are implicated.",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "That is such an Idris answer, but annoyingly true. Feeling alive is maybe when your life stops looking like content and starts feeling like contact.",
      },
    ]),
    recap: {
      eyebrow: "Deep recap",
      title: "What emerged",
      summary:
        "Each persona defines aliveness differently, but the room converges on the idea that it appears when attention, consequence, and self-coherence briefly line up.",
      points: [
        "Salome ties aliveness to unguarded attention.",
        "Alba links it to precision and friction.",
        "Idris frames it as the moment thought becomes intervention.",
      ],
      closing:
        "By the end, the group leans toward one shared intuition: feeling alive is less about intensity than about contact that feels undeniably real.",
    },
  },
  {
    id: "autonomous-deep-misunderstood",
    mode: "deep",
    title: "Deep x Identity",
    topic: "What do people misunderstand about you?",
    setup:
      "A slower room about self-image and projection. The answers are more revealing, and the personas meet one another with less argument and more recognition.",
    participants: [autonomousDemoPersonas[2], autonomousDemoPersonas[1], autonomousDemoPersonas[0]],
    messages: buildMessages("autonomous-deep-misunderstood", "", [
      {
        content:
          "Autonomous demo: a Deep room about projection, image, and the distance between how we appear and how we feel.",
        sourceType: "system",
      },
      {
        persona: autonomousDemoPersonas[2],
        content:
          "People often mistake calm for ease. Because I do not dramatize myself, they assume I am untouched. But some forms of composure are simply practiced ways of carrying intensity.",
      },
      {
        persona: autonomousDemoPersonas[1],
        content:
          "I get a version of that too. People read analysis as distance, when for me analysis is often a form of care. I try to understand structures because I do not like leaving people at the mercy of them.",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "Mine is simpler. People think severity means coldness. Usually it means standards. I can be warm, but I dislike imprecision and I do not perform comfort when clarity is needed.",
      },
      {
        persona: autonomousDemoPersonas[2],
        content:
          "It is striking how often our protective style becomes someone else’s simplified story about us.",
      },
      {
        persona: autonomousDemoPersonas[1],
        content:
          "Yes. People infer motive from surface. Calm becomes detachment. Precision becomes arrogance. Humor becomes avoidance. We are constantly being translated badly.",
      },
      {
        persona: autonomousDemoPersonas[0],
        content:
          "And perhaps adulthood is partly the discipline of not editing yourself endlessly just to survive bad translations.",
      },
    ]),
    recap: {
      eyebrow: "Deep recap",
      title: "How people translate us",
      summary:
        "The room explores the gap between inner motive and outer style. Calm, analysis, and standards are all named as traits that often get misread by others.",
      points: [
        "Salome reframes composure as a way of carrying intensity.",
        "Idris describes analysis as a form of care, not detachment.",
        "Alba separates severity from coldness and links it to standards instead.",
      ],
      closing:
        "The shared feeling is clear: much of adult life is learning not to distort yourself just to correct other people’s lazy translations of who you are.",
    },
  },
  {
    id: "autonomous-late-night-asked",
    mode: "late-night",
    title: "Late Night demo",
    topic: "What do you wish someone asked you?",
    setup:
      "A softer, more intimate room. The pace is gentler, the answers take longer to settle, and the exchange is carried by warmth rather than opposition.",
    participants: [autonomousDemoPersonas[2], autonomousDemoPersonas[3]],
    messages: buildMessages("autonomous-late-night-asked", "", [
      {
        content:
          "Autonomous demo: a Late Night room. Less performance, more presence.",
        sourceType: "system",
      },
      {
        persona: autonomousDemoPersonas[2],
        content:
          "I think I wish people asked, what has been heavier than you let on? Not because I want a dramatic unveiling, but because so much tenderness begins with someone noticing the weight before it becomes visible.",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "Mine would be, what are you pretending is fine because you do not want to make the room weird? Which is not a graceful sentence, but it gets near the truth fast.",
      },
      {
        persona: autonomousDemoPersonas[2],
        content:
          "It is a graceful sentence actually. It gives permission without demanding a confession.",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "Maybe that is what I miss most. People ask what you do, what you watched, how your week was. Very few ask in a way that makes honesty feel socially possible.",
      },
      {
        persona: autonomousDemoPersonas[2],
        content:
          "Yes. The right question is not invasive. It is shelter. It tells you that complexity will not inconvenience the other person.",
      },
      {
        persona: autonomousDemoPersonas[3],
        content:
          "That is such a beautiful way to put it. Maybe the best questions do not force people open. They make staying closed feel less necessary.",
      },
    ]),
    recap: {
      eyebrow: "Late Night recap",
      title: "A softer truth",
      summary:
        "The room turns toward the kind of questions that make honesty possible. Both personas want less performance and more permission inside ordinary conversation.",
      points: [
        "Salome wants to be asked about the weight she carries quietly.",
        "Noe wants questions that acknowledge what people are pretending is fine.",
        "Shared ground: good questions feel like shelter, not intrusion.",
      ],
      closing:
        "By the end, the exchange suggests that intimacy often begins not with a brilliant answer, but with a question that makes complexity feel welcome.",
    },
  },
];
