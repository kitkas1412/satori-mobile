import { Sparkles } from "lucide-react-native";
import { Image, Text, View } from "react-native";

export function ReadyBanner() {
  return (
    <View className="bg-[rgba(148,199,255,0.5)] px-7 py-5 rounded-3xl flex-row items-center justify-between w-full">
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Sparkles size={14} className="text-primary-800" />
        </View>
        <Text className="font-heading text-[24px] text-primary-800 leading-6">
          Bạn Đã Sẵn Sàng Chưa
        </Text>
      </View>
      <Image
        source={require("../../../../assets/images/eyes-emoji.png")}
        className="w-[94px] h-[94px]"
        resizeMode="contain"
        style={{
          shadowColor: "rgba(0,0,0,1)",
          shadowOffset: { width: 4, height: 5 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
        }}
      />
    </View>
  );
}
