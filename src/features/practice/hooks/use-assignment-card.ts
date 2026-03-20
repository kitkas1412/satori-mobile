import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { usePracticeStore } from "@/stores";
import type {
  AssignmentCardProps,
  AssignmentStatus,
} from "../components/assignment-card";
import type { Content, LearnerSubmissionStatus } from "../api";
import { getSubmissionApi, getWritingSubmissionApi } from "../api";

const STATUS_MAP: Record<LearnerSubmissionStatus, AssignmentStatus> = {
  GRADED: "graded",
  IN_PROGRESS: "in_progress",
  NOT_STARTED: "not_started",
  OVERDUE: "overdue",
  SUBMITTED: "submitted",
};

export function mapAssignmentToCardProps(a: Content): AssignmentCardProps {
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
  const setQuizResult = usePracticeStore((s) => s.setQuizResult);
  const setWritingResult = usePracticeStore((s) => s.setWritingResult);
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(false);

  async function handleAssignmentPress(item: Content) {
    if (item.learnerSubmissionStatus === "GRADED") {
      if (!item.learnerSubmissionId) {
        Alert.alert("Lỗi", "Không tìm thấy thông tin bài nộp.");
        return;
      }
      if (item.assignmentType === "QUIZ") {
        try {
          setIsLoadingSubmission(true);
          const submission = await getSubmissionApi(item.learnerSubmissionId);
          setQuizResult(item.id, submission);
          router.push({ pathname: "/assignment-result" });
        } catch {
          Alert.alert(
            "Lỗi",
            "Không thể tải kết quả bài tập. Vui lòng thử lại.",
          );
        } finally {
          setIsLoadingSubmission(false);
        }
      } else if (item.assignmentType === "WRITING") {
        try {
          setIsLoadingSubmission(true);
          const submission = await getWritingSubmissionApi(item.learnerSubmissionId);
          setWritingResult(submission);
          router.push({ pathname: "/assignment-writing-result" });
        } catch {
          Alert.alert(
            "Lỗi",
            "Không thể tải kết quả bài tập. Vui lòng thử lại.",
          );
        } finally {
          setIsLoadingSubmission(false);
        }
      }
    } else if (item.learnerSubmissionStatus === "SUBMITTED" && item.assignmentType === "WRITING") {
      if (!item.learnerSubmissionId) {
        Alert.alert("Lỗi", "Không tìm thấy thông tin bài nộp.");
        return;
      }
      try {
        setIsLoadingSubmission(true);
        const submission = await getWritingSubmissionApi(item.learnerSubmissionId);
        setWritingResult(submission);
        router.push({ pathname: "/assignment-writing-result" });
      } catch {
        Alert.alert(
          "Lỗi",
          "Không thể tải kết quả bài tập. Vui lòng thử lại.",
        );
      } finally {
        setIsLoadingSubmission(false);
      }
    } else if (item.learnerSubmissionStatus === "OVERDUE") {
      Alert.alert("Bài tập đã quá hạn", "Bài tập này đã hết hạn nộp.");
    } else if (item.assignmentType === "QUIZ") {
      router.push({ pathname: "/assignment-quiz", params: { id: item.id } });
    } else if (item.assignmentType === "WRITING") {
      router.push({ pathname: "/assignment-writing", params: { id: item.id } });
    }
  }

  return { handleAssignmentPress, isLoadingSubmission };
}
