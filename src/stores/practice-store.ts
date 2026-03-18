import { create } from "zustand";
import type { SubmitQuizResponse } from "@/features/practice/api";

interface PracticeState {
  quizResult: SubmitQuizResponse | null;
  assignmentId: string | null;
}

interface PracticeActions {
  setQuizResult: (assignmentId: string, result: SubmitQuizResponse) => void;
  clearQuizResult: () => void;
}

export const usePracticeStore = create<PracticeState & PracticeActions>()((set) => ({
  quizResult: null,
  assignmentId: null,

  setQuizResult: (assignmentId, result) => set({ assignmentId, quizResult: result }),
  clearQuizResult: () => set({ assignmentId: null, quizResult: null }),
}));
