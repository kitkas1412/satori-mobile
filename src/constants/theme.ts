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
    background: "hsl(220, 20%, 97.1%)",
    cardBackground: "hsl(0, 0%, 100%)",
    primary: "hsl(228, 63.1%, 56.5%)",
    secondary: "hsl(40, 90%, 52.9%)",
    iconDefault: "hsl(220, 14.3%, 4.1%)",
    iconSelected: "hsl(228, 63.1%, 56.5%)",
    success: "hsl(160, 84.1%, 39.4%)",
    warning: "hsl(40, 90%, 52.9%)",
    error: "hsl(0, 84.2%, 60.2%)",
    purple: "hsl(266, 48%, 48.2%)",
    white: "hsl(0, 0%, 100%)",
    shadow: "hsl(0, 0%, 0%)",
    border: "hsl(213, 26.8%, 83.9%)",
  },
  dark: {
    textDefault: "hsl(220, 14.3%, 95.9%)",
    textMuted: "hsl(215, 19.3%, 65.5%)",
    textInverse: "hsl(220, 14.3%, 4.1%)",
    background: "hsl(220, 20%, 10.2%)",
    cardBackground: "hsl(0, 0%, 0%)",
    primary: "hsl(228, 63.1%, 44.5%)",
    secondary: "hsl(40, 90%, 47.1%)",
    iconDefault: "hsl(220, 14.3%, 95.9%)",
    iconSelected: "hsl(228, 63.1%, 44.5%)",
    success: "hsl(160, 84.1%, 60.6%)",
    warning: "hsl(40, 90%, 47.1%)",
    error: "hsl(0, 84.2%, 39.8%)",
    purple: "hsl(266, 48%, 51.8%)",
    white: "hsl(0, 0%, 100%)",
    shadow: "hsl(0, 0%, 100%)",
    border: "hsl(213, 26.8%, 16.1%)",
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
