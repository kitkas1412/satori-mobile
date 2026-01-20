/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#7b92ef"; // primary-default
const tintColorDark = "#FFFFFF"; // typography-white

export const Colors = {
  light: {
    text: "#475569", // text-muted
    background: "#F6F7F9", // background-default
    surface: "#FFFFFF", // background-surface
    primary: "#7b92ef", // primary-default
    tint: tintColorLight,
    icon: "#475569", // text-muted
    tabIconDefault: "#475569", // text-muted
    tabIconSelected: tintColorLight,
    textMuted: "#475569", // text-muted
    border: "rgba(0,0,0,0.1)",
  },
  dark: {
    text: "#ECEDEE",
    background: "#181719", // background-dark
    surface: "#1F2937",
    primary: "#7b92ef", // primary-default
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    textMuted: "#9BA1A6",
    border: "rgba(255,255,255,0.1)",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
