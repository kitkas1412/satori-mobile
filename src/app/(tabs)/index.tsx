import { BellButton } from "@/components/ui";
import { StreakCard } from "@/features/streak/components";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { CircleCheck, Clock } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      className="flex-row items-center justify-between px-4 pb-4"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center gap-2">
        <Image
          source={require("../../../assets/images/avatar.png")}
          style={{ width: 36, height: 36, borderRadius: 18 }}
        />
        <View className="flex-row items-center">
          <Text className="text-text-muted text-xl font-heading ">
            Chào bạn{" "}
          </Text>
          <Image
            source={require("../../../assets/images/waving-hand.png")}
            style={{ width: 24, height: 24 }}
          />
        </View>
      </View>

      <BellButton onPress={() => router.push("/notifications")} />
    </View>
  );
}

function DailyReport() {
  return (
    <View className="mx-4 mb-6">
      <View className="mb-3">
        <Text
          className="text-text-muted text-xl font-bold"
          style={{ fontFamily: "Nunito_700Bold" }}
        >
          Báo cáo học tập
        </Text>
        <Text className="text-text-muted text-xs font-body">
          Cày cuốc sương sương, tương lai phi thường
        </Text>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1 bg-background-surface rounded-2xl border border-border p-4">
          <View className="flex-row items-center gap-1.5 mb-2">
            <Clock className="w-5 h-5" color={"hsl(228, 78%, 71%)"} />
            <Text className="text-text-muted text-sm font-body">
              Thời gian học
            </Text>
          </View>
          <Text className="text-text-muted text-lg font-bold font-heading">
            45 phút
          </Text>
        </View>

        <View className="flex-1 bg-background-surface rounded-2xl border border-border p-4">
          <View className="flex-row items-center gap-1.5 mb-2">
            <CircleCheck className="w-5 h-5" color={"hsl(160, 84%, 39%)"} />
            <Text className="text-text-muted text-sm font-body">
              Bài đã học
            </Text>
          </View>
          <Text className="text-text-muted text-lg font-bold font-heading">
            12 bài
          </Text>
        </View>
      </View>
    </View>
  );
}

function QuickPractice() {
  return (
    <View className="mx-4 mb-24">
      <View className="mb-3">
        <Text className="text-text-muted text-xl font-bold font-heading">
          Luyện tập nhanh
        </Text>
        <Text className="text-text-muted text-xs font-body">
          Học nhanh đi ngủ, kiến thức đã đủ
        </Text>
      </View>

      <View className="gap-2">
        <Pressable className="bg-background-surface rounded-2xl border border-border p-4 flex-row items-center justify-between h-[97px]">
          <View className="flex-1">
            <Text className="text-text-muted text-lg font-bold mb-1 font-heading">
              Ôn tập từ vựng
            </Text>
            <Text className="text-text-muted text-tiny-xs font-body">
              Các câu hỏi trắc nghiệm theo bài học
            </Text>
          </View>
          <Image
            source={require("../../../assets/images/notebook-dynamic-color.png")}
            style={{ width: 80, height: 80 }}
            contentFit="contain"
          />
        </Pressable>

        <Pressable className="bg-background-surface rounded-2xl border border-border p-4 flex-row items-center justify-between h-[97px]">
          <View className="flex-1">
            <Text className="text-text-muted text-lg font-bold mb-0.5 font-heading">
              Hội thoại với AI
            </Text>
            <Text className="text-text-muted text-tiny-xs font-body">
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
  return (
    <ScrollView
      className="flex-1 bg-background-default"
      showsVerticalScrollIndicator={false}
    >
      <Header />
      <StreakCard />
      <DailyReport />
      <QuickPractice />
    </ScrollView>
  );
}
