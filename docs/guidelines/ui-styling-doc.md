# UI and Styling System

> Part of the [System Design Ground Truth](system_design-doc.md).

---

## Styling Approach

**All styling uses `style={}` props with semantic color tokens from `Colors[colorScheme]`.** `StyleSheet.create()` is never used.

```tsx
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

function MyComponent() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background.page }}>
      <Text style={{ color: theme.text.primary, fontSize: 16 }}>Hello</Text>
    </View>
  );
}
```

Use `className` **only** for typography font family classes (`font-heading`, `font-body`, etc.) — these cannot be set via `style={}`.

```tsx
// Correct — font family via className, everything else via style
<Text className="font-heading" style={{ fontSize: 18, color: theme.text.primary }}>
  Heading
</Text>

// NEVER DO THIS
const styles = StyleSheet.create({ container: { flex: 1 } });
```

---

## Color Tokens

Colors come from `src/constants/theme.ts`. Always use semantic tokens, never raw hex values.

```ts
const theme = Colors[colorScheme ?? "light"];

// Brand
theme.brand.primary          // CTA, active states
theme.brand.primarySubtle    // Chip, tag, selected row bg
theme.brand.onPrimary        // Text/icon on primary bg

// Background
theme.background.page        // Full-page background
theme.background.surface     // Card, modal (elevation 1)
theme.background.surfaceRaised  // Elevated card (elevation 2)

// Text
theme.text.primary           // Headings, body
theme.text.secondary         // Subtext, caption
theme.text.tertiary          // Placeholder only
theme.text.disabled          // Non-interactive

// Border
theme.border.default         // Form, card, input
theme.border.subtle          // Divider, separator
theme.border.brand           // Focus ring, selected

// Icon
theme.icon.primary
theme.icon.secondary
theme.icon.success / .warning / .error / .info / .purple

// Semantic status
theme.success.default / .subtle / .text / .bold
theme.error.default / .subtle / .text / .bold
theme.warning.default / .subtle / .text / .bold
theme.info.default / .subtle / .text / .bold
```

A `token()` helper is also available for one-off usage outside a component body:
```ts
import { token } from "@/constants/theme";
const bg = token(colorScheme, t => t.background.surface);
```

---

## Typography

| Font Class           | Family    | Weight        | Use Case                            |
| -------------------- | --------- | ------------- | ----------------------------------- |
| `font-heading`       | Nunito    | 700 Bold      | Headings, button labels, tab labels |
| `font-heading-extra` | Nunito    | 800 ExtraBold | Display headings                    |
| `font-body`          | Open Sans | 400 Regular   | Body text, input text               |
| `font-body-bold`     | Open Sans | 600 SemiBold  | Emphasized body text                |

Font size scale:

| Class          | Size / Line Height |
| -------------- | ------------------ |
| `text-tiny-xs` | 10px / 14px        |
| `text-xs`      | 12px / 16px        |
| `text-sm`      | 14px / 20px        |
| `text-base`    | 16px / 24px        |
| `text-lg`      | 18px / 26px        |
| `text-xl`      | 20px / 28px        |
| `text-2xl`     | 24px / 32px        |
| `text-3xl`     | 30px / 36px        |

---

## Dark Mode

Dark mode resolves automatically through `Colors[colorScheme ?? "light"]`. `setColorScheme("light")` is called on app startup in `_layout.tsx`. Always use semantic tokens from `Colors` — never hardcode hex values directly in `style={}`.

---


## Global UI Primitives

### `BaseInput` (`src/components/ui/base-input.tsx`)

```ts
interface BaseInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string | boolean; // string shows message, boolean shows red border
  label?: string;
  leftIcon?: ReactNode;
  rightAccessory?: ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  autoFocus?: boolean;
  editable?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: ReturnKeyTypeOptions;
  containerClassName?: string;
  inputClassName?: string;
}
```

Supports `forwardRef` for focus management.

---

### `PrimaryButton` (`src/components/ui/button.tsx`)

```ts
interface PrimaryButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean; // Shows ActivityIndicator, disables button
  variant?: "primary" | "danger" | "secondary";
  icon?: React.ReactNode;
  fullWidth?: boolean; // Default: true
  accessibilityLabel?: string;
}
```

---

## Other Shared UI Primitives

### `ScreenHeader` (`src/components/ui/screen-header.tsx`)

Header row with title and optional left/right action slots.

```ts
interface ScreenHeaderProps {
  title: string;
  leftAction?: React.ReactNode;   // e.g., <IconButton icon={<ArrowLeft />} onPress={...} />
  rightAction?: React.ReactNode;
  paddingTop?: number;            // Default: 0
  titleSize?: "xl" | "2xl";       // Default: "xl"
  showDivider?: boolean;          // Default: false
}
```

### `IconButton` (`src/components/ui/icon-button.tsx`)

Generic icon tap target with generous hit slop (`30px` on all sides). Pass any `ReactNode` as `icon`.

```ts
interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
}
```

Use as `leftAction` inside `ScreenHeader` for back navigation:

```tsx
<ScreenHeader
  title="Screen Title"
  leftAction={<IconButton icon={<ArrowLeft />} onPress={() => router.back()} />}
/>
```

### `LoadingSpinner` (`src/components/ui/loading-spinner.tsx`)

Animated spinning ring built with Reanimated (runs on UI thread).

```ts
interface LoadingSpinnerProps {
  size?: number; // Default: 80
}
```

### `LoadingOverlay` (`src/components/ui/loading-overlay.tsx`)

Full-screen Modal overlay shown during long async operations.

```ts
interface LoadingOverlayProps {
  visible: boolean;
  title?: string;       // Default: "Đang xử lý..."
  message?: string;     // Default: "Vui lòng đợi trong giây lát"
  spinnerSize?: number; // Default: 80
  transparent?: boolean; // true = semi-transparent bg, false = solid bg-background-default
}
```

### `ScreenAsyncView` (`src/components/ui/screen-async-view.tsx`)

Wrapper that handles loading / error / empty states before rendering children.

```ts
interface ScreenAsyncViewProps {
  isLoading: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  errorText?: string;  // Default: "Không thể tải dữ liệu. Vui lòng thử lại."
  emptyText?: string;  // Default: "Chưa có dữ liệu."
  children: React.ReactNode;
}
```

### `ProgressBar` (`src/components/ui/progress-bar.tsx`)

Horizontal progress bar. `progress` is a value from `0` to `1`.

```ts
interface ProgressBarProps {
  progress: number;     // 0–1
  color?: string;       // Default: theme.primary
  trackColor?: string;  // Default: theme.border
  height?: number;      // Default: 8
}
```

### `ScoreRing` (`src/components/ui/score-ring.tsx`)

Large circular SVG ring displaying a 0–100 score. Uses `react-native-svg`.

```ts
interface ScoreRingProps {
  score: number; // 0–100
  size?: number; // Default: 200
}
```

### `ScoreCircle` (`src/components/ui/score-circle.tsx`)

Small circular border badge displaying a score with a label underneath. Used in feedback breakdowns.

```ts
interface ScoreCircleProps {
  score: number | null; // null displays "--"
  label: string;
}
```

### `SectionHeader` (`src/components/ui/section-header.tsx`)

Title + optional subtitle block for grouping content.

```ts
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";           // Default: "md"
  alignment?: "left" | "center";       // Default: "left"
}
```

### `MarkdownText` (`src/components/ui/markdown-text.tsx`)

Renders a string that may contain standard Markdown **and** two Japanese-specific inline syntaxes:
- `++text++` → underlined text
- `[base]{reading}` → furigana (ruby) annotation

Falls back to `react-native-markdown-display` for plain Markdown when no inline annotations are present.

```ts
interface MarkdownTextProps {
  children: string;
  fontSize?: number;      // Default: 14
  lineHeight?: number;    // Default: fontSize * 1.5
  fontFamily?: string;    // Default: "OpenSans_400Regular"
  color?: string;         // Default: theme.textDefault
  containerStyle?: ViewStyle;
}
```

### `TextLink` (`src/components/ui/text-link.tsx`)

Tappable text with variant and size options. Extends `TouchableOpacityProps`.

```ts
interface TextLinkProps extends TouchableOpacityProps {
  text: string;
  variant?: "primary" | "secondary" | "danger"; // Default: "primary"
  size?: "sm" | "md" | "lg";                    // Default: "md"
  align?: "left" | "center" | "right";          // Default: "left"
}
```

### `IconSymbol` (`src/components/ui/icon-symbol.tsx`)

Cross-platform icon: SF Symbols on iOS, Material Icons on Android/web. Icon names are SF Symbol names mapped in the component's `MAPPING` constant.

```ts
interface IconSymbolProps {
  name: IconSymbolName; // SF Symbol name (must exist in MAPPING)
  size?: number;        // Default: 24
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}
```
