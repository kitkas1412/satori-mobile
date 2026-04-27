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
  | "expEarned"
  | "pronunciationOverall"
  | "languageOverall"
  | "speakingSessions";

export const Y_AXIS_W = 24;
const BODY_PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 24;
const CHART_H = 150;
const GRID_COUNT = 4;
export const CHART_SVG_H = CHART_H + PAD_TOP + PAD_BOTTOM;

function extractWeekLabel(label: string): string {
  const match = label.match(/^(W\d+)/);
  return match ? match[1] : label;
}

function computeGrid(values: number[]) {
  const maxVal = Math.max(...values, 0);
  const range = maxVal === 0 ? 1 : maxVal;
  const gridValues = Array.from({ length: GRID_COUNT + 1 }, (_, i) =>
    Math.round((maxVal / GRID_COUNT) * i),
  );
  return { range, gridValues };
}

function toY(v: number, range: number): number {
  return PAD_TOP + CHART_H - (v / range) * CHART_H;
}

interface YAxisProps {
  dataPoints: WeeklyDataPoint[];
  metric: MetricKey;
}

export function WeeklyProgressYAxis({ dataPoints, metric }: YAxisProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const values = dataPoints.map((d) => (d[metric] ?? 0) as number);
  const { range, gridValues } = computeGrid(values);

  return (
    <Svg width={Y_AXIS_W} height={CHART_SVG_H}>
      {gridValues.map((val, i) => (
        <SvgText
          key={i}
          x={Y_AXIS_W - 4}
          y={toY(val, range) + 4}
          textAnchor="end"
          fontSize={9}
          fill={theme.text.secondary}
        >
          {val}
        </SvgText>
      ))}
    </Svg>
  );
}

interface WeeklyProgressChartProps {
  dataPoints: WeeklyDataPoint[];
  metric: MetricKey;
  width: number;
  selectedIndex?: number | null;
  onDotPress?: (index: number) => void;
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

  const n = dataPoints.length;
  const values = dataPoints.map((d) => (d[metric] ?? 0) as number);
  const { range, gridValues } = computeGrid(values);

  const chartW = width - BODY_PAD_LEFT - PAD_RIGHT;
  const toX = (i: number) =>
    BODY_PAD_LEFT + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);

  const polylinePoints = dataPoints
    .map((d, i) => `${toX(i)},${toY((d[metric] ?? 0) as number, range)}`)
    .join(" ");

  return (
    <View style={{ width, height: CHART_SVG_H }}>
      <Svg width={width} height={CHART_SVG_H}>
        {gridValues.map((val, i) => {
          const y = toY(val, range);
          return (
            <Line
              key={i}
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke={theme.border.subtle}
              strokeWidth={1}
              strokeDasharray={i === 0 ? undefined : "3,3"}
            />
          );
        })}

        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={theme.brand.primary}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {dataPoints.map((d, i) => {
          const x = toX(i);
          const y = toY((d[metric] ?? 0) as number, range);
          const isSelected = selectedIndex === i;
          return (
            <React.Fragment key={i}>
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
              <Circle
                cx={x}
                cy={y}
                r={16}
                fill="transparent"
                onPress={() => onDotPress?.(i)}
              />
              <SvgText
                x={x}
                y={CHART_SVG_H - 2}
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
