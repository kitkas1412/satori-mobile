// Zustand store lưu trữ tạm thời kết quả bài tập (quiz và writing).
// Dùng store thay vì route params vì kết quả có thể chứa dữ liệu lớn (danh sách quizDetails, imageUrls)
// mà Expo Router không hỗ trợ truyền trực tiếp qua params.
// Store được xóa sau khi người dùng rời khỏi màn hình kết quả.

import { create } from "zustand";
import type { SubmitQuizResponse, SubmitWritingResponse } from "@/features/assignment/api";

interface AssignmentState {
  quizResult: SubmitQuizResponse | null;
  assignmentId: string | null;   // ID bài tập tương ứng với quizResult
  writingResult: SubmitWritingResponse | null;
  writingDueDate: string | null; // Deadline của bài viết — dùng để ẩn nút hủy nộp sau hạn
  // true khi user đang xem lại bài đã nộp/chấm từ danh sách (không phải vừa submit xong)
  isReview: boolean;
}

interface AssignmentActions {
  setQuizResult: (assignmentId: string, result: SubmitQuizResponse, isReview?: boolean) => void;
  clearQuizResult: () => void;
  setWritingResult: (result: SubmitWritingResponse, isReview?: boolean, dueDate?: string) => void;
  clearWritingResult: () => void;
}

type AssignmentStore = AssignmentState & AssignmentActions;

export const useAssignmentStore = create<AssignmentStore>()((set) => ({
  quizResult: null,
  assignmentId: null,
  writingResult: null,
  writingDueDate: null,
  isReview: false,

  setQuizResult: (assignmentId, result, isReview = false) => set({ assignmentId, quizResult: result, isReview }),
  clearQuizResult: () => set({ assignmentId: null, quizResult: null, isReview: false }),
  setWritingResult: (result, isReview = false, dueDate) => set({ writingResult: result, isReview, writingDueDate: dueDate ?? null }),
  clearWritingResult: () => set({ writingResult: null, writingDueDate: null, isReview: false }),
}));

export const selectQuizResult = (s: AssignmentStore) => s.quizResult;
export const selectAssignmentId = (s: AssignmentStore) => s.assignmentId;
export const selectWritingResult = (s: AssignmentStore) => s.writingResult;
export const selectWritingDueDate = (s: AssignmentStore) => s.writingDueDate;
export const selectIsReview = (s: AssignmentStore) => s.isReview;
export const selectSetQuizResult = (s: AssignmentStore) => s.setQuizResult;
export const selectClearQuizResult = (s: AssignmentStore) => s.clearQuizResult;
export const selectSetWritingResult = (s: AssignmentStore) => s.setWritingResult;
export const selectClearWritingResult = (s: AssignmentStore) => s.clearWritingResult;
