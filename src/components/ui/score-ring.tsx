import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ScoreRingProps {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 200 }: ScoreRingProps) {
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score / 100, 0), 1);
  const dashOffset = circumference * (1 - pct);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg
        width={size}
        height={size}
        style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#22c55e"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ alignItems: "center" }}>
        <Text
          className="font-heading"
          style={{ fontSize: 56, lineHeight: 64, color: "#1e293b" }}
        >
          {Math.round(score)}
        </Text>
        <Text
          className="font-body"
          style={{ fontSize: 16, color: "#64748b" }}
        >
          điểm
        </Text>
      </View>
    </View>
  );
}
