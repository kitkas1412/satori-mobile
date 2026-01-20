import { PracticeCard, ReadyBanner } from "@/features/speaking/components";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Bell } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function SpeakingScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background-default">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-16 pb-4">
        <Text className="font-heading text-[20px] text-text-muted">
          Luyện nói
        </Text>
        <Pressable className="w-9 h-9 bg-secondary-default rounded-full items-center justify-center active:opacity-80">
          <Bell size={20} className="text-typography-white" />
          <View className="absolute top-0 right-0 w-[7px] h-[7px] bg-red-500 rounded-full border border-white" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Ready Banner */}
        <ReadyBanner />

        {/* Practice Section */}
        <View className="mt-6 gap-2.5">
          <View className="gap-1 mb-2">
            <Text className="font-heading text-[20px] text-text-muted">
              Chọn bài học của bạn
            </Text>
            <Text className="font-body text-[12px] text-text-muted">
              Học nhanh đi ngủ, kiến thức đã đủ
            </Text>
          </View>

          <PracticeCard
            title="Luyện phát âm"
            description="Các câu hỏi trắc nghiệm theo bài học"
            imageSource={require("../../../assets/images/mic-dynamic-color.png")}
            onPress={() => console.log("Navigate to pronunciation practice")}
          />

          <PracticeCard
            title="Luyện hội thoại"
            description="Chữa lành tâm hồn bằng một bài hội thoại"
            imageSource={require("../../../assets/images/chat-bubble-dynamic-color.png")}
            onPress={() => router.push("/(screen)/conversation-practice")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
