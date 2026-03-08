export type MessageRole = "ASSISTANT" | "USER";
export type TurnState = "AI_TURN" | "USER_TURN" | "LOADING";
export type MissionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type SessionStatus = "ACTIVE" | "COMPLETED" | "ABANDONED";

export interface RoleplayMessage {
  id: string;
  role: MessageRole;
  content: string;
  translation: string | null;
  romaji: string | null;
  sequenceNumber: number;
  audioUrl: string | null;
  userAudioUrl: string | null;
}

export interface SessionMission {
  id: string;
  title: string;
  titleJapanese: string;
  status: MissionStatus;
  progressPct: number;
  reasoning: string | null;
}

export interface RoleplaySession {
  id: string;
  topicId: string;
  status: SessionStatus;
  sessionType: string;
  messageCount: number;
  messages: RoleplayMessage[];
  missions: SessionMission[];
}

export interface MissionDetail {
  title: string;
  titleJapanese: string;
  status: MissionStatus;
  progressPct: number;
  reasoning: string | null;
}

export interface LanguageEvaluation {
  fluencyScore: number | null;
  accuracyScore: number | null;
  vocabularyScore: number | null;
  grammarScore: number | null;
  strengths: string[];
  improvements: string[];
  summary: string | null;
}

export interface FeedbackResult {
  missionScore: number | null;
  pronunciationScore: number | null;
  languageScore: number | null;
  overallScore: number | null;
  missionDetails: MissionDetail[];
  pronunciationSummary: string | null;
  languageEvaluation: LanguageEvaluation | null;
}

export interface LessonSectionItem {
  id: string;
  title: string;
  titleJapanese: string;
  descriptionVi: string;
  category: string;
  jlptLevel: string;
  thumbnailUrl: string | null;
  status: string;
  orderIndex: number;
  topicCount: number;
}

export interface ConversationTopic {
  id: string;
  themeId: string;
  title: string;
  titleJapanese: string;
  category: string;
  jlptLevel: string;
  difficultyScore: number;
  isRoleplay: boolean;
  thumbnailUrl: string | null;
  status: string;
  orderIndex: number;
}

export interface PagedContent<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}
