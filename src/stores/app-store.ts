import { create } from "zustand";

interface AppState {
  // State
  isOnline: boolean;
  theme: "light" | "dark" | "system";
  language: string;
  notificationsEnabled: boolean;

  // Actions
  setOnlineStatus: (isOnline: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLanguage: (language: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isOnline: true,
  theme: "system",
  language: "vi",
  notificationsEnabled: true,

  // Actions
  setOnlineStatus: (isOnline) => set({ isOnline }),

  setTheme: (theme) => set({ theme }),

  setLanguage: (language) => set({ language }),

  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
}));

// Selectors
export const selectIsOnline = (state: AppState) => state.isOnline;
export const selectTheme = (state: AppState) => state.theme;
