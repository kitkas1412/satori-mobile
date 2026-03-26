// Zustand store lưu trữ tạm thời kết quả bài tập (quiz và writing).
// Dùng store thay vì route params vì kết quả có thể chứa dữ liệu lớn (danh sách quizDetails, imageUrls)
// mà Expo Router không hỗ trợ truyền trực tiếp qua params.
// Store được xóa sau khi người dùng rời khỏi màn hình kết quả.

import { create } from "zustand";
import type { SubmitQuizResponse, SubmitWritingResponse } from "@/features/assignment/api";

interface PracticeState {
  quizResult: SubmitQuizResponse | null;
  assignmentId: string | null;   // ID bài tập tương ứng với quizResult
  writingResult: SubmitWritingResponse | null;
}

interface PracticeActions {
  setQuizResult: (assignmentId: string, result: SubmitQuizResponse) => void;
  clearQuizResult: () => void;
  setWritingResult: (result: SubmitWritingResponse) => void;
  clearWritingResult: () => void;
}

export const usePracticeStore = create<PracticeState & PracticeActions>()((set) => ({
  quizResult: null,
  assignmentId: null,
  writingResult: null,

  setQuizResult: (assignmentId, result) => set({ assignmentId, quizResult: result }),
  clearQuizResult: () => set({ assignmentId: null, quizResult: null }),
  setWritingResult: (result) => set({ writingResult: result }),
  clearWritingResult: () => set({ writingResult: null }),
}));
