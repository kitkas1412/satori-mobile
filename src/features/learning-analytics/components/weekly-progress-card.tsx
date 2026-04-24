import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useWeeklyProgress } from "../hooks";
import type { MetricKey } from "./weekly-progress-chart";
import { WeeklyProgressChart } from "./weekly-progress-chart";

const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: "sessionsCompleted", label: "Buổi học", unit: "buổi" },
  { key: "totalStudyMinutes", label: "Phút học", unit: "phút" },
  { key: "averageScore", label: "Điểm TB", unit: "điểm" },
  { key: "expEarned", label: "EXP", unit: "EXP" },
];

const TREND_LABELS: Record<string, string> = {
  UP: "↑ Tăng",
  DOWN: "↓ Giảm",
  STABLE: "→ Ổn định",
};

function formatDate(dateStr: string): string {
  const parts = dateStr.split("-");
  return `${parts[2]}/${parts[1]}`;
}

function extractWeekLabel(label: string): string {
  const match = label.match(/^(W\d+)/);
  return match ? match[1] : label;
}

export function WeeklyProgressCard() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { data, isLoading, isError } = useWeeklyProgress();
  const [selectedMetric, setSelectedMetric] =
    useState<MetricKey>("sessionsCompleted");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { width: screenWidth } = useWindowDimensions();

  const minChartWidth = screenWidth - 64;
  // 56px per point ensures dots are spaced comfortably; scroll when wider than card
  const chartWidth = Math.max(
    minChartWidth,
    (data?.dataPoints.length ?? 0) * 56,
  );

  function handleMetricChange(key: MetricKey) {
    setSelectedMetric(key);
    setSelectedIndex(null);
  }

  function handleDotPress(index: number) {
    setSelectedIndex((prev) => (prev === index ? null : index));
  }

  const selectedPoint =
    data && selectedIndex !== null ? data.dataPoints[selectedIndex] : null;

  const activeMetric = METRICS.find((m) => m.key === selectedMetric)!;

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
        Hoạt động học tập
      </Text>

      {/* Metric selector pills */}
      <View
        style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 12 }}
      >
        {METRICS.map(({ key, label }) => {
          const isSelected = selectedMetric === key;
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.7}
              onPress={() => handleMetricChange(key)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? theme.brand.primary
                  : theme.background.page,
                borderWidth: 1,
                borderColor: isSelected ? theme.brand.primary : theme.border.subtle,
              }}
            >
              <Text
                className="font-body"
                style={{
                  fontSize: 12,
                  color: isSelected ? theme.text.onBrand : theme.text.secondary,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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
            textAlign: "center",
          }}
        >
          Không thể tải dữ liệu
        </Text>
      )}

      {data && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
          >
            <WeeklyProgressChart
              dataPoints={data.dataPoints}
              metric={selectedMetric}
              width={chartWidth}
              selectedIndex={selectedIndex}
              onDotPress={handleDotPress}
            />
          </ScrollView>

          {/* Info panel — shown when a dot is selected */}
          <View
            style={{
              minHeight: 36,
              marginTop: 4,
              marginBottom: 4,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: selectedPoint
                ? theme.brand.primarySubtle
                : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectedPoint ? (
              <Text
                className="font-body"
                style={{ fontSize: 13, color: theme.text.primary }}
              >
                <Text style={{ fontWeight: "700" }}>
                  {extractWeekLabel(selectedPoint.label)}
                </Text>
                {"  ·  "}
                {formatDate(selectedPoint.startDate)}
                {" – "}
                {formatDate(selectedPoint.endDate)}
                {"  ·  "}
                <Text style={{ fontWeight: "700" }}>
                  {selectedMetric === "averageScore"
                    ? selectedPoint[selectedMetric].toFixed(1)
                    : selectedPoint[selectedMetric]}{" "}
                  {activeMetric.unit}
                </Text>
              </Text>
            ) : (
              <Text
                className="font-body"
                style={{ fontSize: 12, color: theme.text.secondary }}
              >
                Nhấn vào điểm để xem chi tiết
              </Text>
            )}
          </View>

          {/* Trend footer */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: theme.border.subtle,
            }}
          >
            <Text
              className="font-body"
              style={{ fontSize: 11, color: theme.text.secondary }}
            >
              Điểm:{" "}
              {TREND_LABELS[data.trends.scoreDirection] ??
                data.trends.scoreDirection}
            </Text>
            <Text
              className="font-body"
              style={{ fontSize: 11, color: theme.text.secondary }}
            >
              Tỉ lệ đều đặn: {Math.round(data.trends.consistencyRate * 100)}%
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
