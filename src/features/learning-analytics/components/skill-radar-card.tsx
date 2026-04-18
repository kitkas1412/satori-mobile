import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useSkillRadar } from "../hooks";
import { SkillRadarChart } from "./skill-radar-chart";

export function SkillRadarCard() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { data, isLoading, isError } = useSkillRadar();

  return (
    <View
      style={{
        backgroundColor: theme.background.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        padding: 16,
        alignItems: "center",
      }}
    >
      <Text
        className="font-heading"
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: theme.text.primary,
          alignSelf: "flex-start",
          marginBottom: 12,
        }}
      >
        Kỹ năng của bạn
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
          style={{
            fontSize: 14,
            color: theme.error.text,
            marginVertical: 40,
          }}
        >
          Không thể tải dữ liệu
        </Text>
      )}

      {data && (
        <SkillRadarChart
          skills={data.skills}
          overallScore={data.overallScore}
        />
      )}
    </View>
  );
}
