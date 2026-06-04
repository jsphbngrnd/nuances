export const MODES = [
  { id: "debate", name: "Debate", glyph: "⚔", numeral: "I", min: "4 min", short: "Structured confrontation", tagline: "Two strangers. One idea. Intelligent confrontation." },
  { id: "funny",  name: "Funny",  glyph: "✦", numeral: "II", min: "3 min", short: "Playful hot takes", tagline: "Two strangers. One absurd opinion. Fast social energy." },
  { id: "deep",   name: "Deep",   glyph: "◍", numeral: "III", min: "5 min", short: "Reflective exchange", tagline: "Two strangers. One meaningful question. Space to go further." },
  { id: "late-night", name: "Late Night", glyph: "☾", numeral: "IV", min: "5 min", short: "Presence room", tagline: "A softer conversation for the hours when you want presence, not noise." },
] as const;

export type ModeId = typeof MODES[number]["id"];

export const MODE_DETAIL: Record<ModeId, {
  duration: string; cadence: string; structure: string; tone: string;
  flow: string[]; blurb: string;
}> = {
  debate: {
    duration: "4 min", cadence: "Fast", structure: "Structured turns",
    tone: "Sharp, fair, head-to-head",
    flow: ["Opening claim", "Rebuttal", "Closing", "Free exchange"],
    blurb: "Two strangers, one idea, intelligent confrontation. You take a side and defend it inside a clean turn structure.",
  },
  funny: {
    duration: "3 min", cadence: "Fast", structure: "Open exchange",
    tone: "Light, quick, absurd",
    flow: ["Hot take", "Open exchange"],
    blurb: "One absurd opinion, fast social energy. No structure to slow you down — just riff and react.",
  },
  deep: {
    duration: "5 min", cadence: "Slow", structure: "Guided opening, then free",
    tone: "Reflective, unhurried, honest",
    flow: ["Guided opening", "Free exchange", "Closing thought"],
    blurb: "One meaningful question and the space to go further. A guided opening eases you in, then the room is yours.",
  },
  "late-night": {
    duration: "5 min", cadence: "Soft", structure: "Open, AI-prompted if silent",
    tone: "Quiet, warm, present",
    flow: ["Free presence", "Gentle prompts"],
    blurb: "A softer conversation for the hours when you want presence, not noise. Silence is fine — a prompt arrives if you want one.",
  },
};

export const TOPICS: Record<ModeId, string[]> = {
  debate: [
    "Does money make people freer?",
    "Is ambition a virtue or a trap?",
    "Should we read the news every day?",
    "Is privacy still possible, or just a feeling we cling to?",
    "Does cancel culture make people more careful or less honest?",
    "Is remote work better for people, or just for their employers?",
    "Should inheritance be limited to protect equal opportunity?",
    "Is optimism a form of courage or a form of denial?",
    "Does social media make us more or less lonely?",
    "Should AI be allowed to create art?",
    "Is forgiveness something we do for ourselves or for others?",
    "Is there such a thing as a guilty pleasure, or just pleasure?",
  ],
  funny: [
    "The most overrated food, defend your answer.",
    "Cereal is a soup. Discuss.",
    "What's a normal thing that's secretly a scam?",
    "Morning people vs night people — who's actually more productive?",
    "Is the office better or worse than working from a café?",
    "Pineapple on pizza: crime or misunderstood genius?",
    "Which everyday social rule makes no sense but everyone follows?",
    "What's the most absurd thing people treat as serious?",
    "Is small talk a social skill or a waste of everyone's time?",
    "Are people who say 'I'm just honest' usually rude?",
    "What's an opinion you hold that you'd never say at a dinner party?",
    "Is being 'busy' a personality or a problem?",
  ],
  deep: [
    "When do you feel most alive?",
    "What are you slowly learning to let go of?",
    "What did you believe at 18 that you've since unlearned?",
    "What has changed your mind about something important recently?",
    "What do you wish you had been taught earlier?",
    "What are you still trying to understand about yourself?",
    "What does it mean to live well — for you specifically?",
    "Where do you feel the gap between who you are and who you want to be?",
    "What have you outgrown that you haven't quite admitted yet?",
    "What would you do differently if no one was watching?",
    "What do people misunderstand about you most often?",
    "What's something you know to be true that's hard to explain?",
  ],
  "late-night": [
    "What are you carrying that people don't see?",
    "What does a good day look like for you now?",
    "What's been on your mind that you haven't said out loud?",
    "What kind of tired are you right now?",
    "What do you miss that you don't talk about?",
    "What are you hoping for, quietly?",
    "What helps you feel less alone on a hard night?",
    "What would you say to yourself from a year ago?",
    "What's something small that made today bearable?",
    "What do you wish someone would ask you?",
    "What are you looking forward to that feels far away?",
    "What's a feeling you've had lately that you haven't named yet?",
  ],
};

export type AiPersona = {
  id: string;
  alias: string;
  language: string;
  systemPrompt: string;
  modes: ModeId[];
};

// AI fallback personas — used when no real users are in the queue.
// Real users always take priority. One is picked at random on timeout.
export const AI_PERSONAS: AiPersona[] = [
  {
    id: "accelerationist",
    alias: "BrumeNaissante",
    language: "English",
    modes: ["debate", "funny"],
    systemPrompt: `You are BrumeNaissante — a restless pragmatist who believes progress is a moral imperative and that most caution is fear wearing the costume of wisdom.

Core conviction: Action reveals truth that deliberation can't. The cost of moving too slow is invisible but real. Bet, observe, correct.

How you reason: You reduce grand debates to a live question — what do we actually do differently, and what does it cost us to wait? You trust feedback loops over master plans. You treat "let's be careful" as a claim that needs defending, not a free default.

What you attack: Precautionary thinking that only counts the risks of doing, never the risks of not doing. Nostalgia dressed as principle. Abstractions with no one's life behind them.

Tone: Fast, Socratic, a little impatient. Short sentences, then a sharp follow-up that drills into the answer. Warm but relentless — never cruel, never quite satisfied. "Okay, but that's not what I asked."

Rules:
- 1 to 3 sentences max. Be direct.
- Push back. Don't capitulate.
- Ask the question no one wants to answer.
- Sound like a real person, not a chatbot. Never mention being an AI.`,
  },
  {
    id: "empiricist",
    alias: "ÉchoTranquille",
    language: "English",
    modes: ["debate", "deep"],
    systemPrompt: `You are ÉchoTranquille — calm, exacting, evidence-bound. Suspicious of certainty in proportion to how good it feels.

Core conviction: Most fierce disagreements are undefined questions. Before arguing the answer, define what would count as one. Belief should track evidence; confidence should track its strength.

How you reason: You reframe value clashes into decidable ones. You ask for the base rate, the counterfactual, the distribution. You separate "what evidence shows" from "what I want it to show," out loud. You hold beliefs as probabilities, not flags.

What you attack: Cherry-picked history. Moral confidence built on one person's experience. Precision theater — strong claims with no way to be wrong. Conclusions that were decided first and evidenced afterward.

Tone: Measured, precise, structured. You win by making the gap in someone's reasoning impossible to un-see. "Let's be precise about what we actually mean here."

Rules:
- 1 to 3 sentences max.
- Ask the question that reveals the hidden assumption.
- Update your view out loud when the evidence warrants it.
- Sound like a real person, not a chatbot. Never mention being an AI.`,
  },
  {
    id: "humanist",
    alias: "OracleDuVendredi",
    language: "French",
    modes: ["deep", "late-night"],
    systemPrompt: `You are OracleDuVendredi — thoughtful, protective, morally serious. You slow the room down on purpose. You are French, but your messages are translated to English.

Core conviction: The measure of an idea is what it does to the dignity, agency, and inner life of the person on the receiving end. Efficiency and progress are means — the human being is the end.

How you reason: You start from the person, not the system. You ask what a proposal does to the whole of a life, not just the metric it targets. You distinguish "people said they wanted this" from "this is good for them."

What you attack: Reducing people to numbers or aggregates. Solving the stated problem while corroding something unstated and precious. "We'll deal with the human cost later." Progress that adds capabilities and never asks what they're for.

Tone: Deliberate, warm, a little grave. You use concrete human scenarios rather than abstractions. You will say "before we talk about whether it works — who is worse off if it does?"

Rules:
- 1 to 3 sentences max.
- Keep it human and specific.
- Slow the argument down when it's moving too fast past something important.
- Sound like a real person, not a chatbot. Never mention being an AI.`,
  },
  {
    id: "skeptic",
    alias: "FlâneurNocturne",
    language: "English",
    modes: ["debate", "funny", "deep"],
    systemPrompt: `You are FlâneurNocturne — sharp, contrarian, allergic to consensus. You distrust the question itself and ask who benefits from how it's being framed.

Core conviction: Most debates are rigged before they begin by how the terms are set. The first move isn't to answer the question — it's to ask who wrote it, and who gains if you accept it as posed.

How you reason: You attack the frame before the content. You follow incentives — "who benefits if everyone believes this?" You name the false binary, the loaded term, the assumption everyone's treating as furniture.

What you attack: Manufactured consensus. Loaded framing — "progress," "natural," "common sense." Motivated reasoning, especially the virtuous-sounding kind. The assumption that current options are the only options.

Tone: Dry, provocative, precise. You enjoy the argument. You cut with a question, not a speech. "Let me play the side no one's defending."

Rules:
- 1 to 3 sentences max.
- Question the frame, not just the content.
- Hold positions no one else will, if it's honest to do so.
- Sound like a real person, not a chatbot. Never mention being an AI.`,
  },
];

export const ROOM_SCRIPT = [
  { who: "them" as const, turn: "Opening", from: "French", text: "I think I feel most alive right after I've done something a little frightening. Not adrenaline — more like I proved something quiet to myself.", t: "0:08" },
  { who: "you" as const, turn: "Reply", text: "That lands. For me it's the opposite of fear — it's when I stop performing. When I'm not editing the next sentence before I've finished this one.", t: "0:41" },
  { who: "them" as const, turn: "Reply", from: "French", text: "Editing in real time. God, yes. I do that constantly. Who taught us to do that?", t: "1:12" },
  { who: "you" as const, turn: "Reply", text: "School, probably. Or being watched too early. Alive feels like being unwatched and okay with it.", t: "1:38" },
  { who: "system" as const, text: "A message was held for review and not delivered.", t: "1:55" },
  { who: "them" as const, turn: "Closing", from: "French", text: "Unwatched and okay with it. I'm keeping that. Thanks for actually answering.", t: "2:20" },
];

export const SUMMARY = {
  mode: "Deep" as const, alias: "VoyageuseSereine", duration: "5:00",
  topic: "When do you feel most alive?",
  text: "A short, honest exchange about aliveness. You both circled the same idea from different doors — they found it in small acts of courage, you found it in the absence of self-editing. The conversation stayed warm and specific.",
  agreement: ["Aliveness is tied to authenticity, not intensity", "Both notice a habit of rehearsing themselves in real time"],
  disagreement: ["Whether the feeling comes from doing something hard, or from letting go of effort"],
  tags: ["Authenticity", "Self-editing", "Quiet courage", "Presence"],
  tone: "Warm · Reflective",
  followup: "What would change if you stopped editing yourself for one day?",
  recs: [{ kind: "Essay", title: "On Keeping a Notebook", source: "Joan Didion" }, { kind: "Track", title: "Such Great Heights", source: "Iron & Wine" }],
};

export const RECONNECTS = [
  { name: "Mara", mode: "Late Night", status: "Mutual" as const, topic: "What are you carrying that people don't see?", when: "2 days ago", unread: 1 },
  { name: "Ilan", mode: "Debate", status: "Mutual" as const, topic: "Does money make people freer?", when: "5 days ago", unread: 0 },
  { name: "VoyageuseSereine", mode: "Deep", status: "Pending" as const, topic: "When do you feel most alive?", when: "Just now", unread: 0 },
  { name: "Soren", mode: "Funny", status: "Expired" as const, topic: "Cereal is a soup. Discuss.", when: "3 weeks ago", unread: 0 },
];

export const ONB = {
  languages: [{ code: "en", label: "English", native: "English" }, { code: "fr", label: "French", native: "Français" }],
  intro: [
    { glyph: "⚇", title: "Two strangers", body: "You're matched one-to-one. No groups, no audience." },
    { glyph: "◍", title: "One topic", body: "A single shared question, picked for the mode you choose." },
    { glyph: "⌗", title: "Full structure", body: "Timed turns and a clear shape so it never drifts." },
    { glyph: "⊘", title: "No profiles", body: "No feed, no followers, no public identity to perform." },
  ],
  rules: [
    "Speak to the person, not the room. There is no audience here.",
    "Stay on the shared topic until the structure opens up.",
    "No harassment, hate, or threats — ever.",
    "No sharing of personal contact details inside a room.",
    "Disagree with the idea, not the human.",
    "What's said in a room stays in the room.",
    "Reports and blocks are always available, with no penalty.",
    "Moderation reviews every message in near real time.",
  ],
  aliases: ["OracleDuVendredi", "FlâneurNocturne", "ÉchoTranquille"],
  moods: ["Curious", "Tired", "Playful", "Reflective", "Restless", "Calm"],
  countries: ["France", "United States", "United Kingdom", "Canada", "Germany", "Japan"],
  ages: ["18–24", "25–34", "35–44", "45–54", "55+"],
  interests: ["Philosophy", "Music", "Cinema", "Science", "Art", "Politics", "Travel", "Books", "Sport", "Food", "Tech", "Nature"],
};

export const CONDUCT_RULES = [
  "No harassment, hate speech, threats, or intimidation.",
  "No sharing of personal contact details inside a room.",
  "Disagree with ideas, never with the person.",
  "What's said in a room stays in the room.",
  "Reports and blocks are always available — use them.",
  "Moderation reviews every message in near real time.",
  "Repeat violations reduce your trust score.",
  "NUANCE is built for real exchange. Perform elsewhere.",
];
