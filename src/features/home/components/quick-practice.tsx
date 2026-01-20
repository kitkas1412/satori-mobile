import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

export function QuickPractice() {
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
            <Text className="text-text-muted text-[10px] font-body">
              Các câu hỏi trắc nghiệm theo bài học
            </Text>
          </View>
          <Image
            source={require("../../../../assets/images/notebook-dynamic-color.png")}
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
            source={require("../../../../assets/images/chat-bubble-dynamic-color.png")}
            style={{ width: 80, height: 80 }}
            contentFit="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}
