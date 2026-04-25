// Types cho tính năng Luyện tập AI.

// ---------------------------------------------------------------------------
// Shared / Common
// ---------------------------------------------------------------------------

export type SessionType = "VOCAB_DRILL" | "GRAMMAR_DRILL" | "MIXED_LESSON";

export type SessionStatus = "IN_PROGRESS";

export type ItemType =
  | "MULTIPLE_CHOICE"
  | "FILL_BLANK"
  | "TRANSLATION"
  | "SENTENCE_ORDER"
  | "MATCHING"
  | "TRUE_FALSE";

export interface SessionConfig {
  sessionType: SessionType;
  itemCount: number;
  itemTypes: ItemType[];
}

export type BadgeType =
  | "LEARNING_STREAK"
  | "LESSON_MASTER"
  | "QUIZ_CHAMPION"
  | "FIRST_STEPS"
  | "DEDICATED_LEARNER"
  | string;

export interface BadgeEarned {
  badgeId: string;
  badgeName: string;
  description: string;
  badgeType: BadgeType;
  iconUrl: string;
  expReward: number;
  earnedAt: string;
  isFeatured: boolean;
}

export interface LevelUp {
  previousLevel: number;
  newLevel: number;
  expEarned: number;
  oldTotalExp: number;
  totalExp: number;
  expToNextLevel: number;
  progressPercentage: number;
  isLevelUp: boolean;
}

export interface StreakNotification {
  is_first_activity_today: boolean;
  current_streak: number;
  longest_streak: number;
  streak_last_date: string;
}

// ---------------------------------------------------------------------------
// GET /api/v1/courses/:courseId/lessons
// ---------------------------------------------------------------------------

/** Một bài học trong sách */
export interface LessonResponse {
  id: string;
  courseId: string;
  title: string;
  titleJapanese: string | null;
  orderIndex: number;
  estimatedDurationMinutes: number;
  status: string;
  processingStatus: string;
  vocabularyCount: number;
  grammarPointCount: number;
}

// ---------------------------------------------------------------------------
// GET /api/v1/learner/practice/lessons/:lessonId/items
// ---------------------------------------------------------------------------

export interface MasteryInfo {
  level: number;
  label: string;
  attemptCount: number;
  emaScore: number;
  lastPracticedAt: string;
}

/** Một từ vựng trong bài học */
export interface VocabItem {
  id: string;
  japaneseText: string;
  reading: string;
  meaningVi: string;
  partOfSpeech: string | null;
  mastery: MasteryInfo | null;
}

/** Một điểm ngữ pháp trong bài học */
export interface GrammarItem {
  id: string;
  pattern: string;
  meaningVi: string;
  shortExplanation: string | null;
  mastery: MasteryInfo | null;
}

/** Response cho danh sách nội dung bài học */
export interface LessonItemsResponse {
  vocabulary: VocabItem[];
  grammar: GrammarItem[];
  summary: {
    totalVocab: number;
    totalGrammar: number;
    masteredVocab: number;
    masteredGrammar: number;
    needsReviewCount: number;
  };
}

// ---------------------------------------------------------------------------
// POST /api/v1/learner/practice/sessions
// ---------------------------------------------------------------------------

/** Tham số khởi tạo session luyện tập với AI */
export interface PracticeSessionRequest {
  lessonId: string;
  sessionType: SessionType;
  preset?: "QUICK" | "STANDARD" | "FULL";
  itemTypes: ItemType[];
  selectedVocabIds: string[] | null;
  selectedGrammarIds: string[] | null;
}

/** Một session luyện tập */
export interface Session {
  sessionId: string;
  lessonId: string;
  courseId: string;
  sessionType: SessionType;
  status: SessionStatus;
  totalItems: number;
  completedItems: number;
  correctItems: number;
  score: number;
  startedAt: string;
  completedAt: string | null;
}

/** Nội dung bài luyện tập */
export interface Items {
  id: string;
  itemIndex: number;
  itemType: ItemType;
  question: string;
  questionJapanese?: string;
  hint?: string;
  options: Options[];
  correctMapping?: Record<string, number>;
}

/** Đáp án của câu hỏi */
export interface Options {
  id: number;
  text: string;
  side?: "LEFT" | "RIGHT";
}

/** Dữ liệu session trả về khi khởi tạo thành công */
export interface PracticeSessionResponse {
  session: Session;
  items: Items[];
}

// ---------------------------------------------------------------------------
// POST /api/v1/learner/practice/sessions/:sessionId/items/:itemId/answer
// ---------------------------------------------------------------------------

/** Request body gửi câu trả lời */
export interface AnswerRequest {
  userAnswer: string;
}

/** Response sau khi submit câu trả lời */
export interface AnswerResponse {
  score: number;
  feedback: string;
  correctAnswer: string;
  explanation: string;
  sessionCompleted: boolean;
  correct: boolean;
}

// ---------------------------------------------------------------------------
// GET /api/v1/learner/practice/sessions/:practiceSessionId/summary
// ---------------------------------------------------------------------------

/** Chi tiết kết quả cho từng câu trong phiên luyện tập */
export interface PracticeSessionSummaryItem {
  itemIndex: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
  explanation: string;
  aiFeedback: string;
}

export interface MasteryChange {
  entityId: string;
  entityType: string;
  japaneseText: string;
  levelBefore: number;
  levelAfter: number;
  newlyMastered: boolean;
}

/** Tổng kết toàn phiên luyện tập */
export interface PracticeSessionSummaryResponse {
  sessionId: string;
  score: number;
  correctItems: number;
  totalItems: number;
  aiFeedback: string;
  items: PracticeSessionSummaryItem[];
  newBadgesEarned: BadgeEarned[];
  levelUp: LevelUp | null;
  streakNotification: StreakNotification | null;
  masteryChanges: MasteryChange[];
}
