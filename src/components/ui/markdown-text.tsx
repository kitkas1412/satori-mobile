import Markdown, {
  type ASTNode,
  type RenderRules,
} from "react-native-markdown-display";
import { View, Text, Platform } from "react-native";
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
      segments.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
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

function extractNodeText(node: ASTNode): string {
  if (node.content) return node.content;
  if (node.children?.length) return node.children.map(extractNodeText).join("");
  return "";
}

const CJK_RE = /[　-〿぀-ゟ゠-ヿ一-鿿ｦ-ﾟ]/;

function tokenizeText(text: string): string[] {
  const tokens: string[] = [];
  let buffer = "";
  const flush = () => {
    if (buffer) {
      tokens.push(buffer);
      buffer = "";
    }
  };
  for (const ch of text) {
    if (CJK_RE.test(ch)) {
      flush();
      tokens.push(ch);
    } else {
      buffer += ch;
      if (ch === " " || ch === "\t" || ch === "\n") {
        flush();
      }
    }
  }
  flush();
  return tokens;
}

function renderSegments(
  text: string,
  baseStyle: object,
  furiganaSize: number,
  color: string,
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let key = 0;
  for (const seg of parseInline(text)) {
    if (seg.type === "text") {
      for (const token of tokenizeText(seg.content)) {
        nodes.push(
          <Text key={key++} style={baseStyle}>
            {token}
          </Text>,
        );
      }
      continue;
    }
    if (seg.type === "underline") {
      for (const token of tokenizeText(seg.content)) {
        nodes.push(
          <Text
            key={key++}
            style={[baseStyle, { textDecorationLine: "underline" }]}
          >
            {token}
          </Text>,
        );
      }
      continue;
    }
    nodes.push(
      <View
        key={key++}
        style={{ alignItems: "center", paddingTop: furiganaSize + 2 }}
      >
        <Text
          style={{
            fontSize: furiganaSize,
            lineHeight: furiganaSize + 2,
            fontFamily,
            color,
            position: "absolute",
            top: 0,
            left: -30,
            right: -30,
            textAlign: "center",
          }}
        >
          {seg.reading}
        </Text>
        <Text style={baseStyle}>{seg.base}</Text>
      </View>,
    );
  }
  return nodes;
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
  const resolvedLineHeight = lineHeight ?? fontSize * 1.8;
  const resolvedColor = color ?? theme.text.primary;
  const furiganaSize = Math.max(8, Math.round(fontSize * 0.5));
  const baseStyle = {
    fontSize,
    fontFamily,
    color: resolvedColor,
    lineHeight: resolvedLineHeight,
  };

  const rules: RenderRules = {
    list_item: (node, children, parent, _styles) => {
      const hasFurigana = ((node as any).children ?? [])
        .filter((child: ASTNode) => child.type !== "bullet_list" && child.type !== "ordered_list")
        .some((child: ASTNode) => HAS_INLINE_RE.test(extractNodeText(child)));
      const iconPadding = hasFurigana ? furiganaSize + 2 : 0;
      const iconStyle = {
        ...baseStyle,
        paddingTop: iconPadding,
        marginLeft: 4,
        marginRight: 6,
      };

      const isBullet = (parent as ASTNode[]).some(
        (p) => p.type === "bullet_list",
      );
      const isOrdered = (parent as ASTNode[]).some(
        (p) => p.type === "ordered_list",
      );

      if (isBullet) {
        return (
          <View
            key={node.key}
            style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}
          >
            <Text accessible={false} style={iconStyle}>
              {Platform.select({ android: "•", default: "•" })}
            </Text>
            <View style={{ flex: 1 }}>{children}</View>
          </View>
        );
      }

      if (isOrdered) {
        const orderedListIndex = (parent as ASTNode[]).findIndex(
          (p) => p.type === "ordered_list",
        );
        const orderedList = (parent as ASTNode[])[orderedListIndex] as any;
        const start = orderedList.attributes?.start ?? 0;
        const listItemNumber = start + node.index + 1;

        return (
          <View
            key={node.key}
            style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}
          >
            <Text style={iconStyle}>
              {listItemNumber}
              {node.markup}
            </Text>
            <View style={{ flex: 1 }}>{children}</View>
          </View>
        );
      }

      return (
        <View key={node.key} style={{ flexDirection: "row" }}>
          {children}
        </View>
      );
    },
    textgroup: (node, children, _parent, styles) => {
      const rawText = extractNodeText(node);
      if (HAS_INLINE_RE.test(rawText)) {
        return (
          <View
            key={node.key}
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            {renderSegments(
              rawText,
              baseStyle,
              furiganaSize,
              resolvedColor,
              fontFamily,
              fontSize,
              resolvedLineHeight,
            )}
          </View>
        );
      }
      return (
        <Text key={node.key} style={[baseStyle, styles.textgroup]}>
          {children}
        </Text>
      );
    },
  };

  return (
    <Markdown
      rules={rules}
      style={{
        body: {
          fontSize,
          fontFamily,
          color: resolvedColor,
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
          paddingLeft: 4,
        },
        ordered_list: {
          marginVertical: 2,
          paddingLeft: 4,
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
