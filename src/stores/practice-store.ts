import { create } from "zustand";
import type { SubmitQuizResponse, SubmitWritingResponse } from "@/features/practice/api";

interface PracticeState {
  quizResult: SubmitQuizResponse | null;
  assignmentId: string | null;
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
