import type { ConversationMode, TranscriptMessage } from "@/lib/types";

export type StoredDemoConversation = {
  roomId: string;
  mode: ConversationMode;
  topicText: string;
  messages: TranscriptMessage[];
  updatedAt: string;
};

export function getDemoStorageKey(roomId: string) {
  return `nuance-demo-room:${roomId}`;
}

export function saveDemoConversation(input: StoredDemoConversation) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getDemoStorageKey(input.roomId), JSON.stringify(input));
}

export function readDemoConversation(roomId: string): StoredDemoConversation | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(getDemoStorageKey(roomId));

  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredDemoConversation;
  } catch {
    return null;
  }
}

export function listDemoConversations() {
  if (typeof window === "undefined") return [] as StoredDemoConversation[];

  const items: StoredDemoConversation[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (!key || !key.startsWith("nuance-demo-room:")) {
      continue;
    }

    const raw = window.localStorage.getItem(key);

    if (!raw) {
      continue;
    }

    try {
      items.push(JSON.parse(raw) as StoredDemoConversation);
    } catch {
      continue;
    }
  }

  return items.sort((left, right) => {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}
