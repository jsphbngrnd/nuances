export type ConversationMode = "debate" | "funny" | "deep" | "late-night";
export type TopicDifficulty = "gentle" | "balanced" | "sharp";
export type QueueStatus = "waiting" | "matched" | "cancelled";
export type RoomStatus = "pending_topic" | "live" | "ended" | "cancelled";
export type MessageSourceType = "text" | "speech_transcript" | "system";
export type ModerationStatus = "pending" | "approved" | "blocked";
export type TurnType = "opening" | "reply" | "closing" | "free";
export type RecommendationType = "book" | "podcast" | "article" | "film" | "app" | "course";
export type RecommendationAction = "click" | "save" | "purchase";

export interface UserProfile {
  id: string;
  displayName: string;
  alias?: string;
  aliasFamily?: string;
  aliasStage?: number;
  ageRange: string;
  language: string;
  country: string;
  mood: string;
  interests: string[];
  voiceEnabled: boolean;
  reconnectEnabled: boolean;
  trustScore: number;
}

export interface ConversationTopic {
  id: string;
  mode: ConversationMode;
  text: string;
  category: string;
  difficulty: TopicDifficulty;
  active: boolean;
}

export interface QueueEntry {
  id: string;
  userId: string;
  mode: ConversationMode;
  language: string;
  trustScore: number;
  compatibleLanguages?: string[];
  country: string;
  status: QueueStatus;
  createdAt: string;
}

export interface RoomParticipant {
  id: string;
  roomId: string;
  userId: string;
  joinedAt: string;
  leftAt?: string | null;
  reconnectVote?: boolean | null;
  roomRating?: "good" | "neutral" | "uncomfortable" | null;
}

export interface ConversationRoom {
  id: string;
  mode: ConversationMode;
  status: RoomStatus;
  topicId: string;
  createdAt: string;
  endedAt?: string | null;
  users: UserProfile[];
  participants: RoomParticipant[];
}

export interface TranscriptMessage {
  id: string;
  roomId: string;
  userId: string | "system";
  speaker: string;
  sourceType: MessageSourceType;
  content: string;
  moderationStatus: ModerationStatus;
  createdAt: string;
}

export interface ConversationTurn {
  id: string;
  roomId: string;
  roundNumber: number;
  userId: string;
  turnType: TurnType;
  durationSeconds: number;
  startedAt: string;
  endedAt?: string | null;
}

export interface RoomSummary {
  id: string;
  roomId: string;
  summaryText: string;
  agreementPoints: string[];
  disagreementPoints: string[];
  mainThemes: string[];
  semanticTags: string[];
  emotionalTone: string;
  followUpQuestion?: string;
  generatedAt: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  type: RecommendationType;
  shortDescription: string;
  tags: string[];
  conversationModes: ConversationMode[];
  emotionalTones: string[];
  url: string;
  imageUrl: string;
  affiliateUrl?: string;
  sponsorLabel?: string;
  active: boolean;
}

export interface RoomRecommendation {
  id: string;
  roomId: string;
  recommendationId: string;
  position: number;
  source: "summary" | "reconnect";
}

export interface UserRecommendationClick {
  id: string;
  recommendationId: string;
  roomId?: string;
  userId?: string;
  action: RecommendationAction;
  createdAt: string;
}

export interface ModeDefinition {
  id: ConversationMode;
  emoji: string;
  name: string;
  shortLabel: string;
  tagline: string;
  description: string;
  cadence: string;
  colorClass: string;
  waitingCopy: string;
}

export interface MatchmakingRequest {
  entrant: QueueEntry;
  queue: QueueEntry[];
  trustScoreMinimum?: number;
}

export interface MatchmakingResult {
  matched: boolean;
  room?: {
    id: string;
    status: RoomStatus;
    mode: ConversationMode;
    matchedUserIds: string[];
  };
  reason?: string;
}
