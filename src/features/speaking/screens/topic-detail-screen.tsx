import { Check, ListChecks, X } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { LoadingOverlay, PrimaryButton } from "@/components/ui";
import { useTopicDetail } from "@/features/speaking/hooks";
import type { Missions } from "@/features/speaking/api";

function difficultyLabel(score: number): string {
  if (score === 1) return "Dễ";
  if (score === 2) return "Trung Bình";
  return "Khó";
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
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-row items-center gap-4 flex-1">
        <Text
          className="font-heading text-[32px] w-7 text-center"
          style={{ color: theme.textMuted, lineHeight: 40 }}
        >
          {index + 1}
        </Text>
        <Text
          className="font-body text-base flex-1"
          style={{ color: theme.textMuted }}
        >
          {mission.titleVi}
        </Text>
      </View>

      <View
        className="items-center justify-center rounded-full ml-3"
        style={{
          width: 40,
          height: 40,
          backgroundColor: isCompleted ? theme.success : theme.border,
        }}
      >
        <Check size={22} color="white" strokeWidth={2.5} />
      </View>
    </View>
  );
}

interface TopicDetailScreenProps {
  topicId: string;
}

export function TopicDetailScreen({ topicId }: TopicDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const { data: topic, isLoading } = useTopicDetail(topicId);

  function handleStart() {
    router.replace({
      pathname: "/conversation-practice",
      params: { topicId, title: topic?.title ?? "" },
    });
  }

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: theme.background }}>
        {/* Header */}
        <View
          className="flex-row items-center px-4 pb-4"
          style={{ paddingTop: insets.top }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={24} color={theme.textDefault} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-32 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {topic && (
            <>
              {/* Title + difficulty badge */}
              <View className="flex-row items-center gap-3 flex-wrap">
                <Text
                  className="font-heading text-[28px] font-bold"
                  style={{ color: theme.textDefault }}
                >
                  {topic.title}
                </Text>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? "hsl(228, 40%, 22%)"
                        : "hsl(228, 60%, 93%)",
                  }}
                >
                  <Text
                    className="font-body text-xs font-semibold"
                    style={{ color: theme.primary }}
                  >
                    {difficultyLabel(topic.difficultyScore)}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text
                className="font-body text-sm mt-3 leading-6"
                style={{ color: theme.textMuted }}
              >
                {topic.descriptionVi}
              </Text>

              {/* Missions section */}
              {topic.missions && topic.missions.length > 0 && (
                <View className="mt-10">
                  {/* Section heading */}
                  <View className="flex-row items-center gap-3 mb-4">
                    <ListChecks
                      size={24}
                      color={theme.textDefault}
                      strokeWidth={2}
                    />
                    <Text
                      className="font-heading text-xl font-bold"
                      style={{ color: theme.textDefault }}
                    >
                      Nhiệm vụ
                    </Text>
                  </View>

                  {/* Mission list */}
                  <View>
                    {topic.missions.map((mission, index) => (
                      <View key={mission.id}>
                        {index > 0 && (
                          <View
                            style={{ height: 1, backgroundColor: theme.border }}
                          />
                        )}
                        <MissionItem
                          mission={mission}
                          index={index}
                          theme={theme}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Footer button */}
        {topic && (
          <View
            className="absolute bottom-0 left-0 right-0 px-6"
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
          >
            <PrimaryButton text="Hiểu rồi" onPress={handleStart} />
          </View>
        )}
      </View>

      <LoadingOverlay visible={isLoading} title="Đang tải..." />
    </>
  );
}
