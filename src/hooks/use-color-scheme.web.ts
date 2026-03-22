import { useAppStore } from "@/stores/app-store";
import { useEffect, useState } from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const theme = useAppStore((state) => state.theme);
  const isStoreHydrated = useAppStore((state) => state.isHydrated);
  const deviceScheme = useDeviceColorScheme();

  if (!hasHydrated || !isStoreHydrated) return "light";
  if (theme === "system") return deviceScheme ?? "light";
  return theme;
}
