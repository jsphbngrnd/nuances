const topics = {
  debate: [
    "Should inheritance be limited?",
    "Does money make people freer?",
    "Is AI making us intellectually lazy?",
    "Should university be free for everyone?",
    "Is ambition overrated?",
  ],
  deep: [
    "What has changed your mind recently?",
    "What are you still trying to understand about yourself?",
    "What do people misunderstand about your generation?",
    "When do you feel most alive?",
    "What have you outgrown lately?",
  ],
  "late-night": [
    "What kind of night are you having?",
    "What do you wish you could say more easily?",
    "What has been on your mind today?",
    "What are you carrying that people do not see?",
    "What do you miss right now?",
  ],
} as const;

const categoryByMode = {
  debate: "Debate",
  deep: "Deep",
  "late-night": "Late Night",
} as const;

const difficultyByMode = {
  debate: "sharp",
  deep: "balanced",
  "late-night": "gentle",
} as const;

const statements = Object.entries(topics).flatMap(([mode, prompts]) =>
  prompts.map(
    (text) =>
      `insert into public.topics (mode, text, category, difficulty, active) values ('${mode}', '${text.replaceAll("'", "''")}', '${categoryByMode[mode as keyof typeof categoryByMode]}', '${difficultyByMode[mode as keyof typeof difficultyByMode]}', true);`
  )
);

console.log("-- NUANCE topic seed");
console.log(statements.join("\n"));
