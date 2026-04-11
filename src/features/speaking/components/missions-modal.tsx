import { Check, List } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Modal, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Backdrop, PrimaryButton } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useConversationStore } from "@/stores";
import type { Missions } from "@/features/speaking/api";

const TIMING_CONFIG = { duration: 320, easing: Easing.out(Easing.cubic) };

interface MissionsModalProps {
  visible: boolean;
  onClose: () => void;
}

function MissionItem({
  mission,
  index,
  theme,
}: {
  mission: Missions;
  index: number;
  theme: typeof Colors.light;
}) {
  const isCompleted = mission.status === "COMPLETED";

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-4">
        <Text
          className="font-heading text-[32px]"
          style={{ color: theme.text.primary, lineHeight: 40 }}
        >
          {index + 1}
        </Text>
        <Text
          className="font-body text-base"
          style={{ color: theme.text.secondary, width: 235 }}
        >
          {mission.title}
        </Text>
      </View>

      <View
        className="items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          backgroundColor: isCompleted
            ? theme.success.default
            : theme.border.default,
        }}
      >
        <Check size={24} color={theme.icon.onBrand} strokeWidth={2.5} />
      </View>
    </View>
  );
}

export function MissionsModal({ visible, onClose }: MissionsModalProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const missions = useConversationStore((s) => s.missions);

  const completedCount = missions.filter(
    (m) => m.status === "COMPLETED",
  ).length;

  const [internalVisible, setInternalVisible] = useState(visible);
  const translateY = useSharedValue(500);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      translateY.value = withTiming(0, TIMING_CONFIG);
    } else {
      translateY.value = withTiming(500, TIMING_CONFIG, (finished) => {
        if (finished) runOnJS(setInternalVisible)(false);
      });
    }
  }, [visible]);

  const panelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      visible={internalVisible}
      animationType="none"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        {/* Overlay */}
        <Backdrop visible={visible} onPress={onClose} />

        {/* Panel */}
        <Animated.View
          className="rounded-t-3xl"
          style={[
            panelAnimatedStyle,
            {
              backgroundColor: theme.background.surface,
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            },
          ]}
        >
          <View className="px-7 pt-4 gap-2">
            {/* Header row */}
            <View className="flex-row items-center justify-between">
              <Text
                className="font-heading text-2xl"
                style={{ color: theme.text.primary }}
              >
                Nhiệm vụ
              </Text>

              <View
                className="flex-row items-center gap-2 rounded-lg px-2 py-2"
                style={{ backgroundColor: theme.border.subtle }}
              >
                <List size={16} color={theme.text.secondary} />
                <Text
                  className="font-body text-sm text-muted-foreground"
                  style={{ fontWeight: "600" }}
                >
                  {completedCount}/{missions.length}
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text
              className="font-body text-sm"
              style={{ color: theme.text.secondary, lineHeight: 20 }}
            >
              Hoàn thành các mục tiêu sau để hoàn thành thành công cuộc hội
              thoại nhập vai này
            </Text>

            {/* Mission list */}
            <View className="gap-4 py-2">
              {missions.map((mission, index) => (
                <MissionItem
                  key={mission.id}
                  mission={mission}
                  index={index}
                  theme={theme}
                />
              ))}
            </View>

            {/* CTA */}
            <PrimaryButton text="Hiểu rồi" variant="dark" onPress={onClose} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
