// GET /learner/assignments
export type AssignmentType = "QUIZ" | "WRITING";
export type LearnerSubmissionStatus =
  | "GRADED"
  | "IN_PROGRESS"
  | "NOT_STARTED"
  | "OVERDUE";

export interface Assignment {
  id: string;
  title: string;
  assignmentType: AssignmentType;
  dueDate: string;
  questionCount: number;
  createdAt: string;
  learnerSubmissionStatus: LearnerSubmissionStatus;
  learnerSubmissionId: string | null;
}

export interface AssignmentsPageData {
  content: Assignment[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  assignmentQuestionId: string;
  orderIndex: number;
  points: number | null;
  questionId: string;
  questionText: string;
  questionType: "multiple_choice" | "true_false" | "fill_blank";
  options: QuestionOption[] | null;
  imageUrl: string | null;
  jlptLevel: string;
}

// POST /learner/assignments/:id/start
export interface AssignmentDetail {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  assignmentType: AssignmentType;
  startDate: string | null;
  dueDate: string;
  audioUrl: string | null;
  actualQuestionCount: number;
  questions: Question[];
  writingContent: string | null;
}
