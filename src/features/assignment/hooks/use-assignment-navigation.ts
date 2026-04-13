// Hook xử lý logic điều hướng khi học viên nhấn vào một bài tập.
// Hành vi khác nhau tùy theo trạng thái bài tập:
// - GRADED: tải kết quả đã chấm và điều hướng đến màn hình kết quả
// - SUBMITTED + WRITING: tải bài đã nộp đang chờ chấm
// - OVERDUE: hiển thị thông báo hết hạn
// - Còn lại: điều hướng đến màn hình làm bài tương ứng

import { useState } from "react";
import { useRouter } from "expo-router";

import { useAssignmentStore } from "@/stores";
import { extractApiError } from "@/lib/extract-api-error";
import { useErrorOverlayStore } from "@/stores/error-overlay-store";
import type { Content } from "../api";
import { getQuizSubmissionApi, getWritingSubmissionApi } from "../api";

export function useAssignmentNavigation() {
  const router = useRouter();
  const setQuizResult = useAssignmentStore((s) => s.setQuizResult);
  const setWritingResult = useAssignmentStore((s) => s.setWritingResult);
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(false);

  async function handleAssignmentPress(item: Content) {
    if (item.learnerSubmissionStatus === "GRADED") {
      if (!item.learnerSubmissionId) {
        useErrorOverlayStore.getState().show("Không tìm thấy thông tin bài nộp.");
        return;
      }
      if (item.assignmentType === "QUIZ") {
        try {
          setIsLoadingSubmission(true);
          const submission = await getQuizSubmissionApi(
            item.learnerSubmissionId,
          );
          // Lưu kết quả vào store để màn hình kết quả có thể đọc
          setQuizResult(item.id, submission, true);
          router.push({ pathname: "/assignment-result" });
        } catch (error) {
          useErrorOverlayStore.getState().show(extractApiError(error));
        } finally {
          setIsLoadingSubmission(false);
        }
      } else if (item.assignmentType === "WRITING" || item.assignmentType === "TRANSLATION") {
        try {
          setIsLoadingSubmission(true);
          const submission = await getWritingSubmissionApi(
            item.learnerSubmissionId,
          );
          setWritingResult(submission, true);
          router.push({ pathname: "/assignment-writing-result" });
        } catch (error) {
          useErrorOverlayStore.getState().show(extractApiError(error));
        } finally {
          setIsLoadingSubmission(false);
        }
      }
    } else if (
      item.learnerSubmissionStatus === "SUBMITTED" &&
      (item.assignmentType === "WRITING" || item.assignmentType === "TRANSLATION")
    ) {
      // Bài viết đã nộp nhưng chưa chấm — cho xem lại trang chi tiết bài nộp
      if (!item.learnerSubmissionId) {
        useErrorOverlayStore.getState().show("Không tìm thấy thông tin bài nộp.");
        return;
      }
      try {
        setIsLoadingSubmission(true);
        const submission = await getWritingSubmissionApi(
          item.learnerSubmissionId,
        );
        setWritingResult(submission, true);
        router.push({ pathname: "/assignment-writing-result" });
      } catch (error) {
        useErrorOverlayStore.getState().show(extractApiError(error));
      } finally {
        setIsLoadingSubmission(false);
      }
    } else if (item.learnerSubmissionStatus === "OVERDUE") {
      Alert.alert("Bài tập đã quá hạn", "Bài tập này đã hết hạn nộp.");
    } else if (item.assignmentType === "QUIZ") {
      router.push({ pathname: "/assignment-quiz", params: { id: item.id } });
    } else if (item.assignmentType === "WRITING" || item.assignmentType === "TRANSLATION") {
      router.push({ pathname: "/assignment-writing", params: { id: item.id } });
    }
  }

  return { handleAssignmentPress, isLoadingSubmission };
}
