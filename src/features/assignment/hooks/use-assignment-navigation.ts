// Hook xử lý logic điều hướng khi học viên nhấn vào một bài tập.
// Dùng rule table thay vì if/else để dễ mở rộng khi có loại bài tập mới:
// thêm loại mới chỉ cần thêm predicate + handler, không sửa code hiện có.

import { Alert } from "react-native";

import { useAssignmentStore } from "@/stores";
import { selectSetQuizResult, selectSetWritingResult } from "@/stores/assignment-store";
import { extractApiError } from "@/lib/extract-api-error";
import { useErrorOverlayStore } from "@/stores/error-overlay-store";
import type { Content } from "../api";
import { useLoadSubmission } from "./use-load-submission";

// ---------------------------------------------------------------------------
// Predicates — pure functions, không có side effects
// ---------------------------------------------------------------------------

const isGradedQuiz = (item: Content) =>
  item.learnerSubmissionStatus === "GRADED" && item.assignmentType === "QUIZ";

const isGradedOrSubmittedWriting = (item: Content) =>
  (item.learnerSubmissionStatus === "GRADED" || item.learnerSubmissionStatus === "SUBMITTED") &&
  (item.assignmentType === "WRITING" || item.assignmentType === "TRANSLATION");

const isOverdue = (item: Content) => item.learnerSubmissionStatus === "OVERDUE";

const isPendingQuiz = (item: Content) => item.assignmentType === "QUIZ";

const isPendingWriting = (item: Content) =>
  item.assignmentType === "WRITING" || item.assignmentType === "TRANSLATION";

// ---------------------------------------------------------------------------

export function useAssignmentNavigation(
  onNavigate: (pathname: string, params?: Record<string, string>) => void,
) {
  const setQuizResult = useAssignmentStore(selectSetQuizResult);
  const setWritingResult = useAssignmentStore(selectSetWritingResult);
  const { loadQuizSubmission, loadWritingSubmission, isLoading: isLoadingSubmission } =
    useLoadSubmission();

  async function handleGradedQuiz(item: Content) {
    if (!item.learnerSubmissionId) {
      useErrorOverlayStore.getState().show("Không tìm thấy thông tin bài nộp.");
      return;
    }
    try {
      const submission = await loadQuizSubmission(item.learnerSubmissionId);
      setQuizResult(item.id, submission, true);
      onNavigate("/quiz-result");
    } catch (error) {
      useErrorOverlayStore.getState().show(extractApiError(error));
    }
  }

  async function handleGradedOrSubmittedWriting(item: Content) {
    if (!item.learnerSubmissionId) {
      useErrorOverlayStore.getState().show("Không tìm thấy thông tin bài nộp.");
      return;
    }
    try {
      const submission = await loadWritingSubmission(item.learnerSubmissionId);
      setWritingResult(submission, true, item.dueDate);
      onNavigate("/assignment-writing-result");
    } catch (error) {
      useErrorOverlayStore.getState().show(extractApiError(error));
    }
  }

  async function handleOverdue(_item: Content) {
    Alert.alert("Bài tập đã quá hạn", "Bài tập này đã hết hạn nộp.");
  }

  async function handlePendingQuiz(item: Content) {
    onNavigate("/assignment-quiz", { id: item.id });
  }

  async function handlePendingWriting(item: Content) {
    onNavigate("/assignment-writing", { id: item.id });
  }

  const rules = [
    { matches: isGradedQuiz,              execute: handleGradedQuiz },
    { matches: isGradedOrSubmittedWriting, execute: handleGradedOrSubmittedWriting },
    { matches: isOverdue,                 execute: handleOverdue },
    { matches: isPendingQuiz,             execute: handlePendingQuiz },
    { matches: isPendingWriting,          execute: handlePendingWriting },
  ];

  async function handleAssignmentPress(item: Content) {
    const rule = rules.find((r) => r.matches(item));
    if (rule) await rule.execute(item);
  }

  return { handleAssignmentPress, isLoadingSubmission };
}
