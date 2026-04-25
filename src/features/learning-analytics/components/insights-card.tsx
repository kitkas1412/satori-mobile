import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useInsights } from "../hooks";

const MAX_WEAK_POINTS = 5;

export function InsightsCard() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { data, isLoading, isError } = useInsights();

  const validWeakPoints = data?.weakPoints.filter((p) => p.description !== null).slice(0, MAX_WEAK_POINTS) ?? [];
  const validStrongPoints = data?.strongPoints.filter((p) => p.description !== null) ?? [];
  const hasContent = validWeakPoints.length > 0 || validStrongPoints.length > 0 || (data?.recommendations.length ?? 0) > 0;

  return (
    <View
      style={{
        backgroundColor: theme.background.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        padding: 16,
      }}
    >
      <Text
        className="font-heading"
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: theme.text.primary,
          marginBottom: 12,
        }}
      >
        Phân tích học tập
      </Text>

      {isLoading && (
        <ActivityIndicator
          size="large"
          color={theme.brand.primary}
          style={{ marginVertical: 40 }}
        />
      )}

      {isError && (
        <Text
          className="font-body"
          style={{ fontSize: 14, color: theme.error.text, marginVertical: 40 }}
        >
          Không thể tải dữ liệu
        </Text>
      )}

      {data && !hasContent && (
        <Text
          className="font-body"
          style={{ fontSize: 13, color: theme.text.secondary, marginVertical: 16 }}
        >
          Chưa có đủ dữ liệu để phân tích
        </Text>
      )}

      {data && hasContent && (
        <View style={{ gap: 16 }}>
          {validWeakPoints.length > 0 && (
            <View style={{ gap: 8 }}>
              <Text
                className="font-heading"
                style={{ fontSize: 13, fontWeight: "600", color: theme.error.text }}
              >
                Điểm cần cải thiện
              </Text>
              {validWeakPoints.map((point, index) => (
                <View key={index} style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}>
                  <Text style={{ color: theme.error.text, fontSize: 13, lineHeight: 18 }}>⚠</Text>
                  <Text
                    className="font-body"
                    style={{ fontSize: 13, color: theme.text.primary, flex: 1, lineHeight: 18 }}
                  >
                    {point.description}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {validStrongPoints.length > 0 && (
            <View style={{ gap: 8 }}>
              <Text
                className="font-heading"
                style={{ fontSize: 13, fontWeight: "600", color: theme.brand.primary }}
              >
                Điểm mạnh
              </Text>
              {validStrongPoints.map((point, index) => (
                <View key={index} style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}>
                  <Text style={{ color: theme.brand.primary, fontSize: 13, lineHeight: 18 }}>✓</Text>
                  <Text
                    className="font-body"
                    style={{ fontSize: 13, color: theme.text.primary, flex: 1, lineHeight: 18 }}
                  >
                    {point.description}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {(data.recommendations.length ?? 0) > 0 && (
            <View style={{ gap: 8 }}>
              <Text
                className="font-heading"
                style={{ fontSize: 13, fontWeight: "600", color: theme.text.primary }}
              >
                Gợi ý cho bạn
              </Text>
              {data.recommendations.map((rec, index) => (
                <View key={index} style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}>
                  <Text style={{ color: theme.text.secondary, fontSize: 13, lineHeight: 18 }}>•</Text>
                  <Text
                    className="font-body"
                    style={{ fontSize: 13, color: theme.text.secondary, flex: 1, lineHeight: 18 }}
                  >
                    {rec}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
