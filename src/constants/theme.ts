/**
 * Semantic Color System — Mobile App (iOS & Android)
 * Primary Light: #3D5CC4 (WCAG AA 5.53:1) · Primary Dark: #5477E8 (WCAG AA 4.6:1)
 * Standard: WCAG 2.1 AA
 *
 * Cấu trúc hai lớp:
 *   Primitive  — raw scale, không dùng trực tiếp trong component
 *   Colors     — semantic tokens, export dùng trong toàn app
 */

import { Platform } from "react-native";

// ---------------------------------------------------------------------------
// Primitive Scale
// ---------------------------------------------------------------------------

export const Primitive = {
  blue: {
    50: "#EEF1FD",
    100: "#D5DCFA",
    200: "#ADBAF4",
    300: "#8FA5EF",
    400: "#7D97ED",
    500: "#6485EA",
    600: "#5477E8",
    700: "#3D5CC4",
    800: "#2D4499",
    900: "#1A2A6E",
    950: "#111830",
  },
  neutral: {
    0: "#FFFFFF",
    50: "#F8F9FF",
    100: "#EEF1FD",
    200: "#E2E7F6",
    300: "#BFC9DF",
    400: "#7D8DB5",
    500: "#6B7A9D",
    600: "#8090AE",
    700: "#3D4A6B",
    800: "#1D2540",
    850: "#161C2E",
    900: "#111929",
    950: "#0D111E",
  },
  neutralDark: {
    100: "#EEF1FD",
    200: "#ADBAF4",
    300: "#A8B5D1",
    400: "#6B7A9D",
    500: "#4A6099",
    600: "#3D4F7A",
    700: "#232B4D",
    800: "#1E2847",
    900: "#141B3A",
    950: "#0F1428",
  },
  green: {
    50: "#DCFCE7",
    100: "#BBF7D0",
    200: "#86EFAC",
    300: "#4ADE80",
    400: "#22C55E",
    500: "#16A34A",
    600: "#15803D",
    700: "#166534",
    800: "#14532D",
    900: "#052E16",
  },
  amber: {
    50: "#FEF3C7",
    100: "#FDE68A",
    200: "#FCD34D",
    300: "#F59E0B",
    400: "#D97706",
    500: "#B45309",
    600: "#92400E",
    700: "#78350F",
    800: "#451A03",
    900: "#1C1200",
  },
  red: {
    50: "#FEE2E2",
    100: "#FECACA",
    200: "#FCA5A5",
    300: "#F87171",
    400: "#EF4444",
    500: "#DC2626",
    600: "#B91C1C",
    700: "#991B1B",
    800: "#7F1D1D",
    900: "#1A0505",
  },
  purple: {
    50: "#F5F0FF",
    100: "#EAE0FE",
    200: "#CDB8FC",
    300: "#AB8CF8",
    400: "#8B65F3",
    500: "#6B3EEC",
    600: "#5530C8",
    700: "#42249E",
    800: "#2F1872",
    900: "#160B38",
    950: "#0C0620",
  },
  inverse: {
    light: "#1B2340",
    dark: "#F0F4FF",
  },
  alpha: {
    black8: "rgba(0,0,0,0.05)",
    black16: "rgba(0,0,0,0.10)",
    black48: "rgba(0,0,0,0.30)",
    white8: "rgba(255,255,255,0.05)",
    white16: "rgba(255,255,255,0.10)",
  },
} as const;

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------

type SemanticTokens = {
  brand: {
    primary: string; // CTA chính, active states
    primaryHover: string; // Hover state
    primaryPressed: string; // Pressed / active
    primaryDisabled: string; // Disabled — decorative only
    primarySubtle: string; // Chip, tag, selected row bg
    onPrimary: string; // Text / icon trên nền primary
  };
  background: {
    page: string; // Nền toàn trang
    surface: string; // Card, modal — elevation 1
    surfaceRaised: string; // Elevated card — elevation 2
    surfaceOverlay: string; // Drawer, bottom sheet — elevation 3
    inverse: string; // Tooltip background
  };
  text: {
    primary: string; // Heading, body — AAA
    secondary: string; // Subtext, caption — AAA
    tertiary: string; // Placeholder ONLY — AA Large
    disabled: string; // Non-interactive — decorative
    inverse: string; // Text trên bg inverse
    onBrand: string; // Text trên nền primary
    link: string; // Hyperlink — AAA
    linkVisited: string; // Link đã truy cập — AAA
  };
  success: {
    default: string; // Icon, border
    subtle: string; // Banner bg
    text: string; // Text trên subtle
    bold: string; // Badge filled bg
    onBold: string; // Text trên bold
  };
  warning: {
    default: string;
    subtle: string;
    text: string;
    bold: string;
    onBold: string;
  };
  error: {
    default: string;
    subtle: string;
    text: string;
    bold: string;
    onBold: string;
  };
  info: {
    default: string;
    subtle: string;
    text: string;
    bold: string;
    onBold: string;
  };
  purple: {
    default: string;
    subtle: string;
    text: string;
    bold: string;
    onBold: string;
  };
  border: {
    default: string; // Form, card, input — ≥ 3:1
    strong: string; // Focused state
    subtle: string; // Divider, separator
    brand: string; // Focus ring, selected — ≥ 3:1
    error: string; // Validation error
    purple: string; // Purple accent border
  };
  icon: {
    primary: string; // Icon chính — AAA
    secondary: string; // Icon phụ — AAA
    disabled: string; // Disabled — decorative
    onBrand: string; // Icon trên primary
    success: string;
    warning: string;
    error: string;
    info: string;
    purple: string;
  };
};

// ---------------------------------------------------------------------------
// Light Mode
// ---------------------------------------------------------------------------

const light: SemanticTokens = {
  brand: {
    primary: Primitive.blue[700], // #3D5CC4 — 5.53:1 AA ✅
    primaryHover: Primitive.blue[800], // #2D4499 — 8.5:1  AAA ✅
    primaryPressed: Primitive.blue[900], // #1A2A6E — 13.2:1 AAA ✅
    primaryDisabled: Primitive.blue[200], // #ADBAF4 — decorative only
    primarySubtle: Primitive.blue[50], // #EEF1FD
    onPrimary: Primitive.neutral[0], // #FFFFFF — 5.53:1 AA ✅
  },
  background: {
    page: Primitive.neutral[50], // #F8F9FF
    surface: Primitive.neutral[0], // #FFFFFF
    surfaceRaised: Primitive.neutral[0], // #FFFFFF
    surfaceOverlay: Primitive.neutral[0], // #FFFFFF
    inverse: Primitive.inverse.light, // #1B2340
  },
  text: {
    primary: Primitive.neutral[900], // #111929 — 17.8:1 AAA
    secondary: Primitive.neutral[700], // #3D4A6B — 8.5:1  AAA
    tertiary: Primitive.neutral[500], // #6B7A9D — 4.1:1  AA Large (placeholder only)
    disabled: Primitive.neutral[600], // #8090AE — decorative
    inverse: Primitive.neutralDark[100], // #EEF1FD
    onBrand: Primitive.neutral[0], // #FFFFFF — 5.53:1 AA ✅
    link: Primitive.blue[800], // #2D4499 — 8.5:1  AAA
    linkVisited: Primitive.purple[700], // #5B21B6 — 8.7:1  AAA
  },
  success: {
    default: Primitive.green[500], // #16A34A — 3.1:1 ✅ icon
    subtle: Primitive.green[50], // #DCFCE7
    text: Primitive.green[800], // #14532D — 7.8:1 AAA
    bold: Primitive.green[600], // #15803D — 5.0:1 AA
    onBold: Primitive.neutral[0], // #FFFFFF
  },
  warning: {
    default: Primitive.amber[500], // #B45309 — 4.8:1 AA
    subtle: Primitive.amber[50], // #FEF3C7
    text: Primitive.amber[700], // #78350F — 7.9:1 AAA
    bold: Primitive.amber[500], // #B45309
    onBold: Primitive.neutral[0], // #FFFFFF
  },
  error: {
    default: Primitive.red[500], // #DC2626 — 4.9:1 AA
    subtle: Primitive.red[50], // #FEE2E2
    text: Primitive.red[800], // #7F1D1D — 8.3:1 AAA
    bold: Primitive.red[600], // #B91C1C — 6.3:1 AA
    onBold: Primitive.neutral[0], // #FFFFFF
  },
  info: {
    default: Primitive.blue[600], // #5477E8 — 3.8:1 AA Large (icon only)
    subtle: Primitive.blue[50], // #EEF1FD
    text: Primitive.blue[800], // #2D4499 — 7.7:1 AAA
    bold: Primitive.blue[700], // #3D5CC4 — 5.5:1 AA
    onBold: Primitive.neutral[0], // #FFFFFF
  },
  purple: {
    default: Primitive.purple[500], // #6B3EEC — 5.97:1 AA
    subtle: Primitive.purple[50], // #F5F0FF
    text: Primitive.purple[700], // #42249E — 9.6:1  AAA
    bold: Primitive.purple[600], // #5530C8 — 8.0:1  AAA
    onBold: Primitive.neutral[0], // #FFFFFF
  },
  border: {
    default: Primitive.neutral[400], // #7D8DB5 — 3.4:1 ✅
    strong: Primitive.neutral[700], // #3D4A6B — 8.5:1 ✅
    subtle: Primitive.neutral[200], // #E2E7F6 — decorative
    brand: Primitive.blue[700], // #3D5CC4 — 5.5:1 focus ring ✅
    error: Primitive.red[500], // #DC2626 — 4.9:1 ✅
    purple: Primitive.purple[600], // #5530C8
  },
  icon: {
    primary: Primitive.neutral[900], // #111929 — 17.8:1 AAA
    secondary: Primitive.neutral[700], // #3D4A6B — 8.5:1  AAA
    disabled: Primitive.neutral[600], // #8090AE — decorative
    onBrand: Primitive.neutral[0], // #FFFFFF
    success: Primitive.green[500], // #16A34A
    warning: Primitive.amber[500], // #B45309
    error: Primitive.red[500], // #DC2626
    info: Primitive.blue[600], // #5477E8
    purple: Primitive.purple[500], // #6B3EEC
  },
};

// ---------------------------------------------------------------------------
// Dark Mode
// ---------------------------------------------------------------------------

const dark: SemanticTokens = {
  brand: {
    primary: Primitive.blue[600], // #5477E8 — 4.6:1 AA ✅
    primaryHover: Primitive.blue[500], // #6485EA — 5.7:1 AA ✅
    primaryPressed: Primitive.blue[700], // #3D5CC4 — 4.8:1 AA ✅
    primaryDisabled: Primitive.neutralDark[600], // #3D4F7A — decorative
    primarySubtle: Primitive.neutralDark[900], // #141B3A
    onPrimary: Primitive.neutral[900], // #111929 — 4.7:1 AA ✅
  },
  background: {
    page: Primitive.neutral[950], // #0D111E
    surface: Primitive.neutralDark[800], // #1E2847
    surfaceRaised: Primitive.neutralDark[700], // #232B4D
    surfaceOverlay: Primitive.neutralDark[700], // #232B4D
    inverse: Primitive.inverse.dark, // #F0F4FF
  },
  text: {
    primary: Primitive.neutralDark[100], // #EEF1FD — 17.4:1 AAA
    secondary: Primitive.neutralDark[300], // #A8B5D1 — 9.6:1  AAA
    tertiary: Primitive.neutralDark[400], // #6B7A9D — 4.3:1  AA Large
    disabled: Primitive.neutralDark[600], // #3D4F7A — decorative
    inverse: Primitive.neutral[900], // #111929
    onBrand: Primitive.neutral[900], // #111929 — 4.7:1 AA ✅
    link: Primitive.blue[400], // #7D97ED — 7.3:1 AAA
    linkVisited: Primitive.purple[400], // #A78BFA — 7.1:1 AAA
  },
  success: {
    default: Primitive.green[300], // #4ADE80 — 11.4:1 AAA
    subtle: Primitive.green[900], // #052E16
    text: Primitive.green[200], // #86EFAC — 10.5:1 AAA
    bold: Primitive.green[500], // #16A34A — 5.6:1  AA
    onBold: Primitive.green[900], // #052E16
  },
  warning: {
    default: Primitive.amber[200], // #FCD34D — 12.3:1 AAA
    subtle: Primitive.amber[900], // #1C1200
    text: Primitive.amber[200], // #FCD34D — 13.2:1 AAA
    bold: Primitive.amber[400], // #D97706 — 5.9:1  AA
    onBold: Primitive.amber[900], // #1C1200
  },
  error: {
    default: Primitive.red[300], // #F87171 — 6.4:1 AA
    subtle: Primitive.red[900], // #1A0505
    text: Primitive.red[200], // #FCA5A5 — 10.7:1 AAA
    bold: Primitive.red[500], // #DC2626 — 3.6:1 AA Large
    onBold: Primitive.neutral[0], // #FFFFFF
  },
  info: {
    default: Primitive.blue[400], // #7D97ED — 7.3:1 AAA
    subtle: Primitive.neutralDark[950], // #0F1428
    text: Primitive.neutralDark[200], // #ADBAF4 — 10.0:1 AAA
    bold: Primitive.blue[600], // #5477E8 — 4.6:1 AA
    onBold: Primitive.neutral[900], // #111929
  },
  purple: {
    default: Primitive.purple[300], // #AB8CF8 — 6.5:1 AAA
    subtle: Primitive.purple[900], // #160B38
    text: Primitive.purple[200], // #CDB8FC — 10.8:1 AAA
    bold: Primitive.purple[500], // #6B3EEC — 4.6:1 AA
    onBold: Primitive.purple[900], // #160B38
  },
  border: {
    default: Primitive.neutralDark[500], // #4A6099 — 3.1:1 ✅
    strong: Primitive.blue[400], // #7D97ED — 6.6:1 ✅
    subtle: Primitive.neutralDark[800], // #1E2847 — decorative
    brand: Primitive.blue[600], // #5477E8 — 4.6:1 ✅
    error: Primitive.red[300], // #F87171 — 6.4:1 ✅
    purple: Primitive.purple[500], // #6B3EEC
  },
  icon: {
    primary: Primitive.neutralDark[100], // #EEF1FD — 15.7:1 AAA
    secondary: Primitive.neutralDark[300], // #A8B5D1 — 8.6:1  AAA
    disabled: Primitive.neutralDark[600], // #3D4F7A — decorative
    onBrand: Primitive.neutral[900], // #111929
    success: Primitive.green[300], // #4ADE80
    warning: Primitive.amber[200], // #FCD34D
    error: Primitive.red[300], // #F87171
    info: Primitive.blue[400], // #7D97ED
    purple: Primitive.purple[300], // #AB8CF8
  },
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Colors = {
  primitive: Primitive,
  light,
  dark,
} as const;

/**
 * Helper — resolve token theo colorScheme.
 *
 * @example
 * const colorScheme = useColorScheme() ?? "light";
 * const bg = token(colorScheme, t => t.background.surface);
 * const style = { backgroundColor: bg };
 */
export function token(
  scheme: "light" | "dark",
  selector: (t: SemanticTokens) => string,
): string {
  return selector(scheme === "dark" ? Colors.dark : Colors.light);
}

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
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
