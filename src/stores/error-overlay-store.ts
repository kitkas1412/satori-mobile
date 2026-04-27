import { create } from "zustand";

interface ErrorOverlayState {
  visible: boolean;
  message: string;
  onBack?: () => void;

  show: (message: string, onBack?: () => void) => void;
  hide: () => void;
}

export const useErrorOverlayStore = create<ErrorOverlayState>()((set) => ({
  visible: false,
  message: "",
  onBack: undefined,

  show: (message, onBack) => set({ visible: true, message, onBack }),
  hide: () => set({ visible: false, message: "", onBack: undefined }),
}));
