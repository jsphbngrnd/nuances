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
  debate: ["Does money make people freer?", "Is ambition a virtue or a trap?", "Should we read the news every day?"],
  funny: ["The most overrated food, defend your answer.", "Cereal is a soup. Discuss.", "What's a normal thing that's secretly a scam?"],
  deep: ["When do you feel most alive?", "What are you slowly learning to let go of?", "What did you believe at 18 that you've since unlearned?"],
  "late-night": ["What are you carrying that people don't see?", "What does a good day look like for you now?", "What's been on your mind that you haven't said out loud?"],
};

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
