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
  // true khi user đang xem lại bài đã nộp/chấm từ danh sách (không phải vừa submit xong)
  isReview: boolean;
}

interface AssignmentActions {
  setQuizResult: (assignmentId: string, result: SubmitQuizResponse, isReview?: boolean) => void;
  clearQuizResult: () => void;
  setWritingResult: (result: SubmitWritingResponse, isReview?: boolean) => void;
  clearWritingResult: () => void;
}

export const useAssignmentStore = create<AssignmentState & AssignmentActions>()((set) => ({
  quizResult: null,
  assignmentId: null,
  writingResult: null,
  isReview: false,

  setQuizResult: (assignmentId, result, isReview = false) => set({ assignmentId, quizResult: result, isReview }),
  clearQuizResult: () => set({ assignmentId: null, quizResult: null, isReview: false }),
  setWritingResult: (result, isReview = false) => set({ writingResult: result, isReview }),
  clearWritingResult: () => set({ writingResult: null, isReview: false }),
}));
