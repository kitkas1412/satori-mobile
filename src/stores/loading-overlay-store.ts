import { create } from "zustand";

interface LoadingOverlayOptions {
  title?: string;
  message?: string;
  transparent?: boolean;
}

interface LoadingOverlayState {
  counter: number;
  title: string;
  message: string;
  transparent: boolean;

  show: (opts?: LoadingOverlayOptions) => void;
  hide: () => void;
}

export const useLoadingOverlayStore = create<LoadingOverlayState>()((set) => ({
  counter: 0,
  title: "Đang xử lý...",
  message: "Vui lòng đợi trong giây lát",
  transparent: false,

  show: (opts) =>
    set((state) => ({
      counter: state.counter + 1,
      title: opts?.title ?? "Đang xử lý...",
      message: opts?.message ?? "Vui lòng đợi trong giây lát",
      transparent: opts?.transparent ?? false,
    })),

  hide: () =>
    set((state) => ({
      counter: Math.max(0, state.counter - 1),
    })),
}));
