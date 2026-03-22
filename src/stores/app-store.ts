import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  isOnline: boolean;
  theme: "light" | "dark" | "system";
  language: string;
  notificationsEnabled: boolean;
  isHydrated: boolean;
}

interface AppActions {
  setOnlineStatus: (isOnline: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLanguage: (language: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setHydrated: () => void;
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      isOnline: true,
      theme: "system",
      language: "vi",
      notificationsEnabled: true,
      isHydrated: false,

      setOnlineStatus: (isOnline) => set({ isOnline }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

// Selectors
export const selectIsOnline = (state: AppState & AppActions) => state.isOnline;
export const selectTheme = (state: AppState & AppActions) => state.theme;
export const selectIsAppHydrated = (state: AppState & AppActions) => state.isHydrated;
