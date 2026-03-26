import type {
  AssignmentCardProps,
  AssignmentStatus,
} from "../components/assignment-card";
import type { Content, LearnerSubmissionStatus } from "../api";

// Map trạng thái từ enum API (UPPER_CASE) sang enum UI (snake_case) dùng cho AssignmentCard.
const STATUS_MAP: Record<LearnerSubmissionStatus, AssignmentStatus> = {
  GRADED: "graded",
  IN_PROGRESS: "in_progress",
  NOT_STARTED: "not_started",
  OVERDUE: "overdue",
  SUBMITTED: "submitted",
};

// Chuyển đổi một bài tập từ dữ liệu API sang props hiển thị trên AssignmentCard.
export function mapAssignmentToCardProps(a: Content): AssignmentCardProps {
  const subtitle =
    a.assignmentType === "QUIZ"
      ? `${a.questionCount} câu hỏi • Trắc nghiệm`
      : "Bài viết";

  // Định dạng ngày hạn nộp sang dd/MM/yyyy
  const date = new Date(a.dueDate);
  const dueDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

  const status = STATUS_MAP[a.learnerSubmissionStatus];

  return { title: a.title, subtitle, dueDate, status };
}
