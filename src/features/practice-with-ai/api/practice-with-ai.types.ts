// Types cho tính năng Luyện tập AI.

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
