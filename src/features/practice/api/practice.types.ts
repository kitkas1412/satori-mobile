// GET /learner/assignments
export type AssignmentType = "QUIZ" | "WRITING";
export type AssignmentApiStatus = "PUBLISHED" | "CLOSED";
export type LearnerSubmissionStatus = "GRADED" | "IN_PROGRESS" | "NOT_STARTED";

export interface Assignment {
  id: string;
  title: string;
  assignmentType: AssignmentType;
  status: AssignmentApiStatus;
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
