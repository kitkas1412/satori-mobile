// Types cho tính năng Luyện tập AI.

export type SessionType =
  | "vocabulary"
  | "grammar"
  | "combined"
  | "kanji"
  | "sentence";

export type ExerciseType =
  | "multiple_choice"
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

export interface Lesson {
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
