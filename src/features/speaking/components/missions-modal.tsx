import { Check, List } from "lucide-react-native";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useConversationStore } from "@/stores";
import type { Missions } from "@/features/speaking/api";

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
          {mission.titleVi}
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        {/* Overlay */}
        <TouchableOpacity
          className="absolute inset-0 bg-black/50"
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Panel */}
        <View
          className="rounded-t-3xl"
          style={{
            backgroundColor: theme.background.surface,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
          }}
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
        </View>
      </View>
    </Modal>
  );
}
