import { BellButton, LoadingOverlay, ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { AssignmentCard } from "@/features/assignment/components/assignment-card";
import { ChatbotFab } from "@/features/chatbot/components";
import { useProfile } from "@/features/profile-management/hooks";
import { StatusBar } from "expo-status-bar";
import {
  useAssignmentNavigation,
  useUpcomingAssignments,
} from "@/features/assignment/hooks";
import { mapAssignmentToCardProps } from "@/features/assignment/utils";
import { StreakCard } from "@/features/streak/components";
import {
  streakQueryKeys,
  useStreakCurrent,
  useStreakHistory,
} from "@/features/streak/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function UpcomingAssignments() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const { data: assignments } = useUpcomingAssignments();
  const { handleAssignmentPress, isLoadingSubmission } =
    useAssignmentNavigation();

  const isEmpty = !assignments || assignments.length === 0;

  return (
    <View className="mx-4 mb-6">
      <View className="mb-3 flex-row items-center justify-between">
        <View>
          <Text
            className="text-xl font-bold font-heading"
            style={{ color: theme.text.primary }}
          >
            Bài tập sắp đến hạn
          </Text>
          <Text
            className="text-xs font-body"
            style={{ color: theme.text.secondary }}
          >
            Nộp trước khi quá muộn nha bạn ơi
          </Text>
        </View>
        <Pressable
          className="flex-row items-center gap-0.5"
          onPress={() => router.push("/(tabs)/practice")}
        >
          <Text
            className="text-sm font-heading"
            style={{ color: theme.brand.primary }}
          >
            Xem tất cả
          </Text>
          <ChevronRight size={16} color={theme.brand.primary} strokeWidth={2} />
        </Pressable>
      </View>

      {isEmpty ? (
        <Text
          className="text-sm font-body text-center py-4"
          style={{ color: theme.text.secondary }}
        >
          Không có bài tập sắp đến hạn
        </Text>
      ) : (
        <View className="gap-2">
          {assignments.map((item) => (
            <AssignmentCard
              key={item.id}
              {...mapAssignmentToCardProps(item)}
              onPress={() => handleAssignmentPress(item)}
            />
          ))}
        </View>
      )}

      <LoadingOverlay visible={isLoadingSubmission} title="Đang tải..." />
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isFetching: isCurrentFetching } = useStreakCurrent();
  const { isFetching: isHistoryFetching } = useStreakHistory(7);
  const isLoading = isCurrentFetching || isHistoryFetching;
  const { data: profile } = useProfile();
  const isBlocked = (() => {
    if (!profile?.enrolledClasses?.length) return true;
    const classStatus = profile?.enrolledClasses[0]?.status;
    if (classStatus === "not_started" || classStatus === "closed") return true;
    return false;
  })();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: streakQueryKeys.current });
      queryClient.invalidateQueries({ queryKey: streakQueryKeys.history(7) });
    }, [queryClient]),
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <ScreenHeader
        title="Chào bạn 👋"
        rightAction={
          <BellButton onPress={() => router.push("/notifications")} />
        }
        paddingTop={insets.top + 16}
      />
      <LoadingOverlay visible={isLoading} />
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: theme.background.page }}
        showsVerticalScrollIndicator={false}
      >
        <StreakCard />
        <UpcomingAssignments />
      </ScrollView>
      {!isBlocked && <ChatbotFab />}
    </View>
  );
}
