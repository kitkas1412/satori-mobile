import React from "react";
import { View } from "react-native";
import Svg, { Polygon, Line, Text as SvgText } from "react-native-svg";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { SkillRadarItem } from "../api";

const SKILL_ORDER = [
  "PRONUNCIATION",
  "FLUENCY",
  "GRAMMAR",
  "SPEAKING",
  "VOCABULARY",
] as const;

const SKILL_LABELS: Record<string, string> = {
  PRONUNCIATION: "Phát âm",
  FLUENCY: "Trôi chảy",
  GRAMMAR: "Ngữ pháp",
  SPEAKING: "Nói",
  VOCABULARY: "Từ vựng",
};

const GRID_LEVELS = [0.25, 0.5, 0.75, 1];
const NUM_AXES = 5;
// Padding around the pentagon to fit skill labels
const PADDING = 48;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function getVertices(cx: number, cy: number, r: number): [number, number][] {
  return Array.from({ length: NUM_AXES }, (_, i) => {
    const angle = toRad(-90 + i * 72);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
}

function pointsAttr(pts: [number, number][]) {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}


/** Horizontal anchor based on horizontal position relative to center */
function textAnchor(x: number, cx: number): "start" | "middle" | "end" {
  const dx = x - cx;
  if (dx > 8) return "start";
  if (dx < -8) return "end";
  return "middle";
}

interface SkillRadarChartProps {
  skills: SkillRadarItem[];
  overallScore: number;
  size?: number;
}

export function SkillRadarChart({
  skills,
  overallScore,
  size = 280,
}: SkillRadarChartProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const svgSize = size;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const maxR = svgSize / 2 - PADDING;

  // Map skills to the fixed display order
  const orderedSkills = SKILL_ORDER.map(
    (key) => skills.find((s) => s.skill === key) ?? null
  );

  // Background pentagon vertices (full radius)
  const bgVertices = getVertices(cx, cy, maxR);

  // Data polygon vertices (score-scaled)
  const dataVertices: [number, number][] = orderedSkills.map((skill, i) => {
    const pct = skill ? Math.min(Math.max(skill.score / 100, 0), 1) : 0;
    const angle = toRad(-90 + i * 72);
    return [cx + maxR * pct * Math.cos(angle), cy + maxR * pct * Math.sin(angle)];
  });

  return (
    <View style={{ width: svgSize, height: svgSize }}>
      <Svg width={svgSize} height={svgSize}>
        {/* Concentric grid pentagons */}
        {GRID_LEVELS.map((level) => (
          <Polygon
            key={level}
            points={pointsAttr(getVertices(cx, cy, maxR * level))}
            fill={level === 1 ? theme.background.surface : "none"}
            stroke={theme.border.subtle}
            strokeWidth={1}
          />
        ))}

        {/* Axis lines from center to each vertex */}
        {bgVertices.map(([x, y], i) => (
          <Line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke={theme.border.subtle}
            strokeWidth={1}
          />
        ))}

        {/* Data polygon fill */}
        <Polygon
          points={pointsAttr(dataVertices)}
          fill={theme.brand.primaryDisabled}
          fillOpacity={0.7}
          stroke={theme.brand.primary}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Overall score at center */}
        <SvgText
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fontSize={20}
          fontWeight="700"
          fill={theme.text.primary}
        >
          {Math.round(overallScore)}%
        </SvgText>

        {/* Skill labels at each axis tip */}
        {bgVertices.map(([vx, vy], i) => {
          const skill = orderedSkills[i];
          const label = SKILL_LABELS[SKILL_ORDER[i]] ?? SKILL_ORDER[i];
          const score = skill ? Math.round(skill.score) : 0;
          const anchor = textAnchor(vx, cx);

          // Direction unit vector from center
          const angle = toRad(-90 + i * 72);
          const labelGap = 10;
          const lx = cx + (maxR + labelGap) * Math.cos(angle);
          const ly = cy + (maxR + labelGap) * Math.sin(angle);

          // Offset lines vertically: name above score
          // If pointing upward (sin < 0): name at ly-14, score at ly
          // If pointing downward (sin > 0): name at ly+4, score at ly+18
          // Sideways: name at ly-6, score at ly+8
          const sinA = Math.sin(angle);
          let nameY: number;
          let scoreY: number;
          if (sinA < -0.3) {
            nameY = ly - 14;
            scoreY = ly;
          } else if (sinA > 0.3) {
            nameY = ly + 4;
            scoreY = ly + 18;
          } else {
            nameY = ly - 6;
            scoreY = ly + 8;
          }

          return (
            <React.Fragment key={i}>
              <SvgText
                x={lx}
                y={nameY}
                textAnchor={anchor}
                fontSize={11}
                fill={theme.text.secondary}
              >
                {label}
              </SvgText>
              <SvgText
                x={lx}
                y={scoreY}
                textAnchor={anchor}
                fontSize={11}
                fontWeight="700"
                fill={theme.text.primary}
              >
                {score}%
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
