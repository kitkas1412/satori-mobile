import { create } from "zustand";
import type {
  FeedbackResult,
  RoleplayMessage,
  SessionMission,
} from "@/features/speaking/api";

interface ConversationState {
  sessionId: string | null;
  messages: RoleplayMessage[];
  missions: SessionMission[];
  feedback: FeedbackResult | null;
}

interface ConversationActions {
  setSession: (sessionId: string, messages: RoleplayMessage[], missions: SessionMission[]) => void;
  addMessages: (messages: RoleplayMessage[]) => void;
  setFeedback: (feedback: FeedbackResult) => void;
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

  setFeedback: (feedback) => set({ feedback }),

  clearSession: () => set(initialState),
}));

export const selectSessionId = (state: ConversationState & ConversationActions) => state.sessionId;
export const selectMessages = (state: ConversationState & ConversationActions) => state.messages;
export const selectMissions = (state: ConversationState & ConversationActions) => state.missions;
export const selectFeedback = (state: ConversationState & ConversationActions) => state.feedback;
