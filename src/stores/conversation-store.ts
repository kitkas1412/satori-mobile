import { create } from "zustand";
import type {
  FeedbackResultResponse,
  Messages,
  Missions,
} from "@/features/speaking/api";

interface ConversationState {
  sessionId: string | null;
  messages: Messages[];
  missions: Missions[];
  feedback: FeedbackResultResponse | null;
}

interface ConversationActions {
  setSession: (sessionId: string, messages: Messages[], missions: Missions[]) => void;
  addMessages: (messages: Messages[]) => void;
  removeMessage: (id: string) => void;
  setMissions: (missions: Missions[]) => void;
  setFeedback: (feedback: FeedbackResultResponse) => void;
  clearSession: () => void;
}

const initialState: ConversationState = {
  sessionId: null,
  messages: [],
  missions: [],
  feedback: null,
};

export const useConversationStore = create<ConversationState & ConversationActions>()((set) => ({
  ...initialState,

  setSession: (sessionId, messages, missions) =>
    set({ sessionId, messages, missions, feedback: null }),

  addMessages: (newMessages) =>
    set((state) => ({ messages: [...state.messages, ...newMessages] })),

  removeMessage: (id) =>
    set((state) => ({ messages: state.messages.filter((m) => m.id !== id) })),

  setMissions: (missions) => set({ missions }),

  setFeedback: (feedback) => set({ feedback }),

  clearSession: () => set(initialState),
}));

export const selectSessionId = (state: ConversationState & ConversationActions) => state.sessionId;
export const selectMessages = (state: ConversationState & ConversationActions) => state.messages;
export const selectMissions = (state: ConversationState & ConversationActions) => state.missions;
export const selectFeedback = (state: ConversationState & ConversationActions) => state.feedback;
