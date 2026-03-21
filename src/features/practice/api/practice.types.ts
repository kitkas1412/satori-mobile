// Định nghĩa tất cả TypeScript types dùng trong tính năng Practice (bài tập).
// Mỗi interface tương ứng với một endpoint hoặc một phần của response từ server.

// GET /learner/assignments
// Loại bài tập: trắc nghiệm hoặc bài viết
export type AssignmentType = "QUIZ" | "WRITING";

// Trạng thái nộp bài của học viên
export type LearnerSubmissionStatus =
  | "GRADED"       // Đã chấm điểm
  | "IN_PROGRESS"  // Đang làm
  | "NOT_STARTED"  // Chưa bắt đầu
  | "OVERDUE"      // Quá hạn
  | "SUBMITTED";   // Đã nộp, chờ chấm

// Response danh sách bài tập (có phân trang)
export interface AssignmentsResponse {
  content: Content[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// Thông tin tóm tắt của một bài tập trong danh sách
export interface Content {
  id: string;
  title: string;
  assignmentType: AssignmentType;
  dueDate: string;
  questionCount: number;
  createdAt: string;
  learnerSubmissionStatus: LearnerSubmissionStatus;
  // null nếu học viên chưa bắt đầu làm bài
  learnerSubmissionId: string | null;
}

// POST /learner/assignments/:id/start
// Thông tin chi tiết bài tập sau khi bắt đầu làm — bao gồm câu hỏi hoặc nội dung bài viết
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
  // Danh sách câu hỏi — chỉ có giá trị với bài QUIZ
  questions: Question[] | null;
  // Nội dung bài viết — chỉ có giá trị với bài WRITING
  writingContent: WritingContent | null;
}

// Một câu hỏi trong bài trắc nghiệm
export interface Question {
  assignmentQuestionId: string; // ID trong ngữ cảnh bài tập (dùng làm key lưu đáp án)
  orderIndex: number;
  points: number | null;
  questionId: string;           // ID gốc của câu hỏi
  questionText: string;
  questionType: string;         // Ví dụ: "multiple_choice", "fill_blank", "true_false"
  options: Option[] | null;     // null nếu là câu điền vào chỗ trống
  imageUrl: string | null;
  jlptLevel: string;
}

// Một lựa chọn trong câu hỏi trắc nghiệm
export interface Option {
  id: string;   // Giá trị được gửi lên server khi chọn đáp án này
  text: string; // Nội dung hiển thị
}

// Nội dung đề bài viết
export interface WritingContent {
  id: string;
  assignmentId: string;
  prompt: string;            // Yêu cầu/đề bài
  sourceText: string | null; // Văn bản tham khảo (nếu có)
  createdAt: string;
}

// POST /learner/assignments/:id/submit-quiz
// Body request khi nộp bài trắc nghiệm
export interface SubmitQuizRequest {
  answers: string; // JSON.stringify(SubmitQuizAnswer[]) — serialize thành chuỗi theo yêu cầu API
  timeSpentSeconds: number;
}

// Response sau khi nộp hoặc lấy kết quả bài trắc nghiệm
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
  score: number;           // Điểm tính theo thang 100
  correctCount: number;
  totalQuestions: number;
  feedback: string | null;
  timeSpentSeconds: number;
  answers: string;
  writtenAnswer: string | null;
  imageUrls: string[] | null;
  teacherScore: number | null;
  quizDetails: QuizDetail[]; // Chi tiết đáp án từng câu
  createdAt: string;
}

// Đáp án của một câu hỏi khi gửi lên server
export interface SubmitQuizAnswer {
  questionId: string;
  selectedAnswer: string;
  timeSpent: number; // Thời gian làm câu này (giây)
}

// Chi tiết kết quả một câu hỏi sau khi chấm
export interface QuizDetail {
  questionId: string;
  questionText: string;
  questionType: string;
  selectedAnswer: string;  // Đáp án học viên đã chọn
  correctAnswer: string;   // Đáp án đúng
  explanation: string;     // Giải thích đáp án
  options: Option[];
  correct: boolean;
}

// Response sau khi nộp hoặc lấy kết quả bài viết
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
  score: number | null;    // null nếu chưa được chấm điểm
  correctCount: number;
  totalQuestions: number;
  feedback: string | null; // Nhận xét của giáo viên (nếu đã chấm)
  timeSpentSeconds: number;
  answers: string;
  writtenAnswer: string | null;
  imageUrls: string[] | null; // Danh sách URL ảnh bài làm đã nộp
  teacherScore: number | null;
  quizDetails: QuizDetail[] | null;
  createdAt: string;
}
