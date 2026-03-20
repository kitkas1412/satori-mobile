import Markdown from "react-native-markdown-display";
import { View, Text } from "react-native";
import type { ViewStyle } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Segment =
  | { type: "text"; content: string }
  | { type: "underline"; content: string }
  | { type: "furigana"; base: string; reading: string };

const INLINE_RE = /\+\+(.+?)\+\+|\[([^\]]+)\]\{([^}]+)\}/g;
const HAS_INLINE_RE = /\+\+.+?\+\+|\[[^\]]+\]\{[^}]+\}/;

function parseInline(text: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  INLINE_RE.lastIndex = 0;
  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: "underline", content: match[1] });
    } else {
      segments.push({ type: "furigana", base: match[2], reading: match[3] });
    }
    lastIndex = INLINE_RE.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }
  return segments;
}

interface MarkdownTextProps {
  children: string;
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: string;
  color?: string;
  containerStyle?: ViewStyle;
}

export function MarkdownText({
  children,
  fontSize = 14,
  lineHeight,
  fontFamily = "OpenSans_400Regular",
  color,
  containerStyle,
}: MarkdownTextProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const textColor = color ?? theme.textDefault;
  const resolvedLineHeight = lineHeight ?? fontSize * 1.5;

  if (HAS_INLINE_RE.test(children)) {
    const furiganaSize = Math.max(8, Math.round(fontSize * 0.5));
    const baseStyle = { fontSize, fontFamily, color: textColor, lineHeight: resolvedLineHeight };
    return (
      <View style={[{ flexDirection: "row", flexWrap: "wrap", alignItems: "flex-end" }, containerStyle]}>
        {parseInline(children).map((seg, i) => {
          if (seg.type === "text") {
            return <Text key={i} style={baseStyle}>{seg.content}</Text>;
          }
          if (seg.type === "underline") {
            return <Text key={i} style={[baseStyle, { textDecorationLine: "underline" }]}>{seg.content}</Text>;
          }
          return (
            <View key={i} style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: furiganaSize,
                  fontFamily,
                  color: textColor,
                  position: "absolute",
                  bottom: resolvedLineHeight,
                  left: -30,
                  right: -30,
                  textAlign: "center",
                }}
              >
                {seg.reading}
              </Text>
              <Text style={baseStyle}>{seg.base}</Text>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <Markdown
      style={{
        body: {
          fontSize,
          fontFamily,
          color: textColor,
          lineHeight: resolvedLineHeight,
          margin: 0,
          padding: 0,
        },
        paragraph: {
          marginTop: 0,
          marginBottom: 0,
        },
        strong: {
          fontFamily: "Nunito_700Bold",
        },
        em: {
          fontStyle: "italic",
        },
        code_inline: {
          fontFamily: "monospace",
          backgroundColor: "rgba(0,0,0,0.06)",
          paddingHorizontal: 4,
          borderRadius: 4,
        },
        bullet_list: {
          marginVertical: 2,
        },
        ordered_list: {
          marginVertical: 2,
        },
        list_item: {
          marginVertical: 1,
        },
      }}
      mergeStyle
    >
      {children}
    </Markdown>
  );
}
