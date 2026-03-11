export type Role = "ASSISTANT" | "USER";
export type TurnState = "AI_TURN" | "USER_TURN" | "LOADING";
export type MissionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type SessionStatus = "ACTIVE" | "COMPLETED" | "ABANDONED";

// GET: /learner/conversation/themes?page=0&size=10
export interface ThemeResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface Content {
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

// GET: /learner/conversation/themes/{{theme_id}}/topics
export interface TopicResponse {
  id: string;
  themeId: string;
  title: string;
  titleJapanese: string;
  descriptionVi: string;
  category: string;
  jlptLevel: string;
  difficultyScore: number;
  isRoleplay: boolean;
  thumbnailUrl: string | null;
  status: string;
  orderIndex: number;
  practiceCount: number;
  lastPracticedAt: string | null;
  practiced: boolean;
}

// POST: /learner/roleplay/sessions
export interface RoleplaySessionResponse {
  id: string;
  userId: string;
  topicId: string;
  sessionType: string;
  status: SessionStatus;
  messageCount: number;
  userMessageCount: number;
  missionScore: number | null;
  pronunciationScore: number | null;
  languageScore: number | null;
  overallScore: number | null;
  createdAt: string;
  completedAt: string | null;
  messages: Messages[];
  missions: Missions[];
}

export interface Messages {
  id: string;
  sessionId: string;
  role: Role;
  content: string;
  japaneseContent: string | null;
  translation: string | null;
  romaji: string | null;
  audioUrl: string | null;
  userAudioUrl: string | null;
  correction: Correction[] | null;
  vocabularyUsed: VocabularyUsed[] | null;
  isHintRequest: boolean;
  sequenceNumber: number;
  createdAt: string;
  messageType: string;
  pronunciationScore: number | null;
}

export interface Missions {
  id: string;
  title: string;
  titleJapanese: string;
  titleVi: string;
  description: string;
  descriptionVi: string;
  aiReasoning: string | null;
  missionType: string;
  status: MissionStatus;
  progressPct: number;
}

export interface Correction {
  id: string;
  messageId: string;
}

export interface VocabularyUsed {
  id: string;
  messageId: string;
  word: string;
  meaning: string;
  jlptLevel: string;
}

// POST: /learner/roleplay/sessions/{{session_id}}/complete
export interface FeedbackResultResponse {
  sessionId: string;
  missionScore: number | null;
  pronunciationScore: number | null;
  languageScore: number | null;
  overallScore: number | null;
  missionDetails: MissionDetails[];
  pronunciationSummary: string | null;
  languageEvaluation: LanguageEvaluation | null;
}

export interface MissionDetails {
  title: string;
  titleVi: string;
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
