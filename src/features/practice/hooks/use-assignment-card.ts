import { Alert } from "react-native";
import { useRouter } from "expo-router";

import type { AssignmentCardProps, AssignmentStatus } from "../components/assignment-card";
import type { Assignment, LearnerSubmissionStatus } from "../api";

const STATUS_MAP: Record<LearnerSubmissionStatus, AssignmentStatus> = {
  GRADED: "completed",
  IN_PROGRESS: "in_progress",
  NOT_STARTED: "not_started",
  OVERDUE: "overdue",
};

export function mapAssignmentToCardProps(a: Assignment): AssignmentCardProps {
  const subtitle =
    a.assignmentType === "QUIZ"
      ? `${a.questionCount} câu hỏi • Trắc nghiệm`
      : "Bài viết";

  const date = new Date(a.dueDate);
  const dueDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

  const status = STATUS_MAP[a.learnerSubmissionStatus];

  return { title: a.title, subtitle, dueDate, status };
}

export function useAssignmentNavigation() {
  const router = useRouter();

  function handleAssignmentPress(item: Assignment) {
    if (item.learnerSubmissionStatus === "GRADED") {
      Alert.alert("Không thể làm lại", "Bài tập đã được chấm điểm, bạn không thể làm lại.");
    } else if (item.learnerSubmissionStatus === "OVERDUE") {
      Alert.alert("Bài tập đã quá hạn", "Bài tập này đã hết hạn nộp.");
    } else if (item.assignmentType === "QUIZ") {
      router.push({ pathname: "/assignment-quiz", params: { id: item.id } });
    }
  }

  return { handleAssignmentPress };
}
