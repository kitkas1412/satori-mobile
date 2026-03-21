// GET /learner/assignments
export type AssignmentType = "QUIZ" | "WRITING";
export type LearnerSubmissionStatus =
  | "GRADED"
  | "IN_PROGRESS"
  | "NOT_STARTED"
  | "OVERDUE"
  | "SUBMITTED";

export interface AssignmentsResponse {
  content: Content[];
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
  assignmentType: AssignmentType;
  dueDate: string;
  questionCount: number;
  createdAt: string;
  learnerSubmissionStatus: LearnerSubmissionStatus;
  learnerSubmissionId: string | null;
}

// POST /learner/assignments/:id/start
export interface AssignmentDetailResponse {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  assignmentType: AssignmentType;
  startDate: string | null;
  dueDate: string;
  audioUrl: string | null;
  actualQuestionCount: number;
  questions: Question[] | null;
  writingContent: WritingContent | null;
}

export interface Question {
  assignmentQuestionId: string;
  orderIndex: number;
  points: number | null;
  questionId: string;
  questionText: string;
  questionType: string;
  options: Option[] | null;
  imageUrl: string | null;
  jlptLevel: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface WritingContent {
  id: string;
  assignmentId: string;
  prompt: string;
  sourceText: string | null;
  createdAt: string;
}

// POST /learner/assignments/:id/submit-quiz
export interface SubmitQuizRequest {
  answers: string; // JSON.stringify(SubmitQuizAnswer[])
  timeSpentSeconds: number;
}

export interface SubmitQuizResponse {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  status: LearnerSubmissionStatus;
  attemptNumber: number;
  startedAt: string;
  submittedAt: string;
  gradedAt: string | null;
  gradedBy: string | null;
  score: number;
  correctCount: number;
  totalQuestions: number;
  feedback: string | null;
  timeSpentSeconds: number;
  answers: string;
  writtenAnswer: string | null;
  imageUrls: string[] | null;
  teacherScore: number | null;
  quizDetails: QuizDetail[];
  createdAt: string;
}

export interface SubmitQuizAnswer {
  questionId: string;
  selectedAnswer: string;
  timeSpent: number;
}

export interface QuizDetail {
  questionId: string;
  questionText: string;
  questionType: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  options: Option[];
  correct: boolean;
}

export interface SubmitWritingResponse {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  status: LearnerSubmissionStatus;
  attemptNumber: number;
  startedAt: string;
  submittedAt: string;
  gradedAt: string | null;
  gradedBy: string | null;
  score: number | null;
  correctCount: number;
  totalQuestions: number;
  feedback: string | null;
  timeSpentSeconds: number;
  answers: string;
  writtenAnswer: string | null;
  imageUrls: string[] | null;
  teacherScore: number | null;
  quizDetails: QuizDetail[] | null;
  createdAt: string;
}
