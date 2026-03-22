import { useAppStore } from "@/stores/app-store";
import { useColorScheme as useDeviceColorScheme } from "react-native";

export function useColorScheme() {
  const theme = useAppStore((state) => state.theme);
  const isHydrated = useAppStore((state) => state.isHydrated);
  const deviceScheme = useDeviceColorScheme();

  if (!isHydrated) return "light";
  if (theme === "system") return deviceScheme ?? "light";
  return theme;
}
