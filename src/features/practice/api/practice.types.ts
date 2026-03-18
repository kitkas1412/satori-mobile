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

// POST /learner/assignments/:id/submit-quiz
export interface SubmitQuizAnswer {
  questionId: string;
  selectedAnswer: string;
  timeSpent: number;
}

export interface SubmitQuizRequest {
  answers: string; // JSON.stringify(SubmitQuizAnswer[])
  timeSpentSeconds: number;
}

export interface QuizDetail {
  questionId: string;
  questionText: string;
  questionType: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  options: QuestionOption[];
  correct: boolean;
}

export interface SubmitQuizResponse {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  status: LearnerSubmissionStatus;
  attemptNumber: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  feedback: string | null;
  quizDetails: QuizDetail[];
  submittedAt: string;
  createdAt: string;
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
