// Types cho tính năng Luyện tập AI.

export type SessionType =
  | "VOCAB_DRILL"
  | "GRAMMAR_DRILL"
  | "MIXED_LESSON"
  | "KANJI_READING";

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

// GET: /api/v1/courses/{{courseId}}/lessons
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

// POST: /api/v1/learner/practice/sessions
/** Tham số khởi tạo session luyện tập với AI */
export interface PracticeSessionRequest {
  lessonId: string;
  sessionType: SessionType;
  itemCount: number;
  itemTypes: ItemType[];
}

/** Dữ liệu session trả về khi khởi tạo thành công */
export interface PracticeSessionResponse {
  session: Session;
  items: Items[];
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
}

/** Đáp án của câu hỏi */
export interface Options {
  id: number;
  text: string;
  side?: "LEFT" | "RIGHT";
}

// POST: /api/v1/learner/practice/sessions/{{sessionId}}/items/{{itemId}}/answer
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

// GET: /api/v1/learner/practice/sessions/{{practiceSessionId}}/summary
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

/** Tổng kết toàn phiên luyện tập */
export interface PracticeSessionSummaryResponse {
  sessionId: string;
  score: number;
  correctItems: number;
  totalItems: number;
  aiFeedback: string;
  items: PracticeSessionSummaryItem[];
}
