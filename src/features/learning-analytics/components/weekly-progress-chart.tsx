import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg";
import type { WeeklyDataPoint } from "../api";

export type MetricKey =
  | "sessionsCompleted"
  | "totalStudyMinutes"
  | "averageScore"
  | "expEarned";

interface WeeklyProgressChartProps {
  dataPoints: WeeklyDataPoint[];
  metric: MetricKey;
  width: number;
  selectedIndex?: number | null;
  onDotPress?: (index: number) => void;
}

const PAD_LEFT = 32;
const PAD_RIGHT = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 24;
const CHART_H = 150;
const GRID_COUNT = 4;

function extractWeekLabel(label: string): string {
  const match = label.match(/^(W\d+)/);
  return match ? match[1] : label;
}

export function WeeklyProgressChart({
  dataPoints,
  metric,
  width,
  selectedIndex,
  onDotPress,
}: WeeklyProgressChartProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const svgH = CHART_H + PAD_TOP + PAD_BOTTOM;
  const chartW = width - PAD_LEFT - PAD_RIGHT;
  const n = dataPoints.length;

  const values = dataPoints.map((d) => d[metric] as number);
  const maxVal = Math.max(...values, 0);
  const range = maxVal === 0 ? 1 : maxVal;

  const gridValues = Array.from({ length: GRID_COUNT + 1 }, (_, i) =>
    Math.round((maxVal / GRID_COUNT) * i),
  );

  const toX = (i: number) =>
    PAD_LEFT + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);

  const toY = (v: number) => PAD_TOP + CHART_H - (v / range) * CHART_H;

  const polylinePoints = dataPoints
    .map((d, i) => `${toX(i)},${toY(d[metric] as number)}`)
    .join(" ");

  return (
    <View style={{ width, height: svgH }}>
      <Svg width={width} height={svgH}>
        {/* Horizontal grid lines + Y-axis labels */}
        {gridValues.map((val, i) => {
          const y = toY(val);
          return (
            <React.Fragment key={i}>
              <Line
                x1={PAD_LEFT}
                y1={y}
                x2={width - PAD_RIGHT}
                y2={y}
                stroke={theme.border.subtle}
                strokeWidth={1}
                strokeDasharray={i === 0 ? undefined : "3,3"}
              />
              <SvgText
                x={PAD_LEFT - 8}
                y={y + 4}
                textAnchor="end"
                fontSize={9}
                fill={theme.text.secondary}
              >
                {val}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Data line */}
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={theme.brand.primary}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots + tap targets + X-axis week labels */}
        {dataPoints.map((d, i) => {
          const x = toX(i);
          const y = toY(d[metric] as number);
          const isSelected = selectedIndex === i;
          return (
            <React.Fragment key={i}>
              {/* Visible dot */}
              <Circle
                cx={x}
                cy={y}
                r={isSelected ? 6 : 4}
                fill={
                  isSelected ? theme.brand.primary : theme.background.surface
                }
                stroke={theme.brand.primary}
                strokeWidth={2}
              />
              {/* Invisible tap target (larger hit area) */}
              <Circle
                cx={x}
                cy={y}
                r={16}
                fill="transparent"
                onPress={() => onDotPress?.(i)}
              />
              <SvgText
                x={x}
                y={svgH - 2}
                textAnchor="middle"
                fontSize={9}
                fill={isSelected ? theme.brand.primary : theme.text.secondary}
                fontWeight={isSelected ? "700" : "400"}
              >
                {extractWeekLabel(d.label)}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
