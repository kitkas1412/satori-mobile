/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    textDefault: "hsl(220, 14.3%, 4.1%)",
    textMuted: "hsl(215, 19.3%, 34.5%)",
    textInverse: "hsl(220, 14.3%, 95.9%)",
    background: "hsl(220, 18%, 97%)",
    cardBackground: "hsl(0, 0%, 100%)",
    primary: "hsl(226, 76%, 71%)",
    secondary: "hsl(40, 90%, 53%)",
    iconDefault: "hsl(220, 14.3%, 4.1%)",
    iconSelected: "hsl(226, 76%, 71%)",
    success: "hsl(161, 84%, 40%)",
    warning: "hsl(40, 90%, 53%)",
    error: "hsl(0, 84%, 60%)",
    purple: "hsl(282, 55%, 69%)",
    white: "hsl(0, 0%, 100%)",
    shadow: "hsl(0, 0%, 0%)",
    border: "hsl(213, 27%, 84%)",
  },
  dark: {
    textDefault: "hsl(220, 14.3%, 95.9%)",
    textMuted: "hsl(215, 19.3%, 65.5%)",
    textInverse: "hsl(220, 14.3%, 4.1%)",
    background: "hsl(270, 3%, 9%)",
    cardBackground: "hsl(220, 10%, 14%)",
    primary: "hsl(226, 76%, 62%)",
    secondary: "hsl(40, 90%, 52%)",
    iconDefault: "hsl(220, 14.3%, 95.9%)",
    iconSelected: "hsl(226, 76%, 62%)",
    success: "hsl(161, 84%, 60%)",
    warning: "hsl(40, 90%, 52%)",
    error: "hsl(0, 84%, 60%)",
    purple: "hsl(282, 55%, 72%)",
    white: "hsl(0, 0%, 100%)",
    shadow: "hsl(0, 0%, 100%)",
    border: "hsl(213, 27%, 22%)",
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
