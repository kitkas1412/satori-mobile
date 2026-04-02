// Types cho tính năng Luyện tập AI.

export type SessionType =
  | "VOCABULARY"
  | "GRAMMAR"
  | "COMBINED"
  | "KANJI"
  | "SENTENCE";

export type SessionStatus = "IN_PROGRESS";

export type ItemType =
  | "MULTIPLE_CHOICE"
  | "FILL_BLANK"
  | "TRANSLATION"
  | "ORDERING"
  | "MATCHING"
  | "TRUE_FALSE";

export type ExerciseType =
  | "MULTIPLE_CHOICE"
  | "fill_blank"
  | "translation"
  | "ordering"
  | "matching"
  | "true_false";

export interface SessionConfig {
  sessionType: SessionType;
  questionCount: number;
  exerciseTypes: ExerciseType[];
}

export interface QuestionOption {
  id: string;
  label: "A" | "B" | "C" | "D";
  text: string;
  isCorrect: boolean;
}

export interface PracticeQuestion {
  id: string;
  type: "multiple_choice";
  text: string;
  hint?: string;
  options: QuestionOption[];
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
  itemTypes: [ItemType];
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
  hint: string;
  options: Options;
}

/** Đáp án của câu hỏi */
export interface Options {
  text: string;
}
