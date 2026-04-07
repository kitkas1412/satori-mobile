import { BellButton, ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { StreakCard } from "@/features/streak/components";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { CircleCheck, Clock } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function DailyReport() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="mx-4 mb-6">
      <View className="mb-3">
        <Text
          className="text-xl font-bold"
          style={{ fontFamily: "Nunito_700Bold", color: theme.text.primary }}
        >
          Báo cáo học tập
        </Text>
        <Text
          className="text-xs font-body"
          style={{ color: theme.text.secondary }}
        >
          Cày cuốc sương sương, tương lai phi thường
        </Text>
      </View>

      <View className="flex-row gap-4">
        <View
          className="flex-1 rounded-2xl border p-4"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <View className="flex-row items-center gap-1.5 mb-2">
            <Clock className="w-5 h-5" color={theme.brand.primary} />
            <Text
              className="text-sm font-body"
              style={{ color: theme.text.secondary }}
            >
              Thời gian học
            </Text>
          </View>
          <Text
            className="text-lg font-bold font-heading"
            style={{ color: theme.text.primary }}
          >
            45 phút
          </Text>
        </View>

        <View
          className="flex-1 rounded-2xl border p-4"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <View className="flex-row items-center gap-1.5 mb-2">
            <CircleCheck className="w-5 h-5" color={theme.success.default} />
            <Text
              className="text-sm font-body"
              style={{ color: theme.text.secondary }}
            >
              Bài đã học
            </Text>
          </View>
          <Text
            className="text-lg font-bold font-heading"
            style={{ color: theme.text.primary }}
          >
            12 bài
          </Text>
        </View>
      </View>
    </View>
  );
}

function QuickPractice() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="mx-4 mb-24">
      <View className="mb-3">
        <Text
          className="text-xl font-bold font-heading"
          style={{ color: theme.text.primary }}
        >
          Luyện tập nhanh
        </Text>
        <Text
          className="text-xs font-body"
          style={{ color: theme.text.secondary }}
        >
          Học nhanh đi ngủ, kiến thức đã đủ
        </Text>
      </View>

      <View className="gap-2">
        <Pressable
          className="rounded-2xl border p-4 flex-row items-center justify-between h-[97px]"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <View className="flex-1">
            <Text
              className="text-lg font-bold mb-1 font-heading"
              style={{ color: theme.text.primary }}
            >
              Ôn tập từ vựng
            </Text>
            <Text
              className="text-tiny-xs font-body"
              style={{ color: theme.text.secondary }}
            >
              Các câu hỏi trắc nghiệm theo bài học
            </Text>
          </View>
          <Image
            source={require("../../../assets/images/notebook-dynamic-color.png")}
            style={{ width: 80, height: 80 }}
            contentFit="contain"
          />
        </Pressable>

        <Pressable
          className="rounded-2xl border p-4 flex-row items-center justify-between h-[97px]"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <View className="flex-1">
            <Text
              className="text-lg font-bold mb-0.5 font-heading"
              style={{ color: theme.text.primary }}
            >
              Hội thoại với AI
            </Text>
            <Text
              className="text-tiny-xs font-body"
              style={{ color: theme.text.secondary }}
            >
              Chữa lành tâm hồn bằng một bài hội thoại
            </Text>
          </View>
          <Image
            source={require("../../../assets/images/chat-bubble-dynamic-color.png")}
            style={{ width: 80, height: 80 }}
            contentFit="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: theme.background.page }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="Chào bạn 👋"
        leftAction={
          <Image
            source={require("../../../assets/images/avatar.png")}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        }
        rightAction={
          <BellButton onPress={() => router.push("/notifications")} />
        }
        paddingTop={insets.top + 16}
      />
      <StreakCard />
      <DailyReport />
      <QuickPractice />
    </ScrollView>
  );
}
