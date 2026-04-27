import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { Items } from "../api/practice-with-ai.types";

type Theme = typeof Colors.light;

export interface MatchingSectionProps {
  currentItem: Items;
  isSubmitting: boolean;
  theme: Theme;
  onConfirmedPairsChange: (pairs: { leftId: number; rightId: number }[]) => void;
}

type FlashEntry = { leftId: number; rightId: number; correct: boolean };

export function MatchingSection({
  currentItem,
  isSubmitting,
  theme,
  onConfirmedPairsChange,
}: MatchingSectionProps) {
  const leftOptions = [...currentItem.options].sort((a, b) => a.id - b.id).filter((o) => o.side === "LEFT");
  const rightOptions = [...currentItem.options].sort((a, b) => a.id - b.id).filter((o) => o.side === "RIGHT");

  const [selectedLeftId, setSelectedLeftId] = useState<number | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<number | null>(null);
  const [confirmedPairs, setConfirmedPairs] = useState<{ leftId: number; rightId: number }[]>([]);
  const [flashPairs, setFlashPairs] = useState<FlashEntry[]>([]);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    onConfirmedPairsChange(confirmedPairs);
  }, [confirmedPairs]);

  function isPairCorrect(leftId: number, rightId: number): boolean {
    const mapping = currentItem.correctMapping;
    if (!mapping) return true;
    return mapping[String(leftId)] === rightId;
  }

  function commitPair(leftId: number, rightId: number) {
    const correct = isPairCorrect(leftId, rightId);
    setSelectedLeftId(null);
    setSelectedRightId(null);
    setFlashPairs((prev) => [...prev, { leftId, rightId, correct }]);

    const timer = setTimeout(() => {
      setFlashPairs((prev) => prev.filter((p) => !(p.leftId === leftId && p.rightId === rightId)));
      if (correct) {
        setConfirmedPairs((prev) => [...prev, { leftId, rightId }]);
      }
    }, 1000);

    timers.current.push(timer);
  }

  function handleSelectLeft(id: number) {
    if (isSubmitting) return;
    if (confirmedPairs.some((p) => p.leftId === id)) return;
    if (flashPairs.some((p) => p.leftId === id)) return;

    if (selectedRightId !== null) {
      commitPair(id, selectedRightId);
      return;
    }

    setSelectedLeftId((prev) => (prev === id ? null : id));
  }

  function handleSelectRight(id: number) {
    if (isSubmitting) return;
    if (confirmedPairs.some((p) => p.rightId === id)) return;
    if (flashPairs.some((p) => p.rightId === id)) return;

    if (selectedLeftId !== null) {
      commitPair(selectedLeftId, id);
      return;
    }

    setSelectedRightId((prev) => (prev === id ? null : id));
  }

  function getFlashEntry(leftId?: number, rightId?: number): FlashEntry | undefined {
    return flashPairs.find((p) =>
      leftId !== undefined ? p.leftId === leftId : p.rightId === rightId,
    );
  }

  const confirmedStyle = {
    bg: theme.background.page,
    border: theme.border.subtle,
    text: theme.text.disabled,
  };

  function getLeftButtonStyle(id: number) {
    if (confirmedPairs.some((p) => p.leftId === id)) {
      return confirmedStyle;
    }
    const flash = getFlashEntry(id, undefined);
    if (flash) {
      return flash.correct
        ? { bg: theme.success.subtle, border: theme.success.default, text: theme.success.default }
        : { bg: theme.error.subtle, border: theme.error.default, text: theme.error.default };
    }
    if (selectedLeftId === id) {
      return { bg: theme.brand.primary, border: theme.brand.primary, text: theme.text.onBrand };
    }
    return { bg: theme.background.surface, border: theme.border.subtle, text: theme.text.primary };
  }

  function getRightButtonStyle(id: number) {
    if (confirmedPairs.some((p) => p.rightId === id)) {
      return confirmedStyle;
    }
    const flash = flashPairs.find((p) => p.rightId === id);
    if (flash) {
      return flash.correct
        ? { bg: theme.success.subtle, border: theme.success.default, text: theme.success.default }
        : { bg: theme.error.subtle, border: theme.error.default, text: theme.error.default };
    }
    if (selectedRightId === id) {
      return { bg: theme.brand.primary, border: theme.brand.primary, text: theme.text.onBrand };
    }
    return { bg: theme.background.surface, border: theme.border.subtle, text: theme.text.primary };
  }

  function isLeftDisabled(id: number) {
    return (
      isSubmitting ||
      confirmedPairs.some((p) => p.leftId === id) ||
      flashPairs.some((p) => p.leftId === id)
    );
  }

  function isRightDisabled(id: number) {
    return (
      isSubmitting ||
      confirmedPairs.some((p) => p.rightId === id) ||
      flashPairs.some((p) => p.rightId === id)
    );
  }

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
        {/* Left column */}
        <View style={{ flex: 1, gap: 16 }}>
          {leftOptions.map((option) => {
            const style = getLeftButtonStyle(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelectLeft(option.id)}
                disabled={isLeftDisabled(option.id)}
                style={{
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: style.border,
                  backgroundColor: style.bg,
                  paddingHorizontal: 14,
                  paddingVertical: 18,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  className="font-heading"
                  style={{ fontSize: 14, color: style.text, textAlign: "center" }}
                >
                  {option.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Right column */}
        <View style={{ flex: 1, gap: 16 }}>
          {rightOptions.map((option) => {
            const style = getRightButtonStyle(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelectRight(option.id)}
                disabled={isRightDisabled(option.id)}
                style={{
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: style.border,
                  backgroundColor: style.bg,
                  paddingHorizontal: 14,
                  paddingVertical: 18,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  className="font-heading"
                  style={{ fontSize: 14, color: style.text, textAlign: "center" }}
                >
                  {option.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
