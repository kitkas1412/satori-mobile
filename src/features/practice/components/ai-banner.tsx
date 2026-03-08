import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

interface AiBannerProps {
  onPress?: () => void;
}

export function AiBanner({ onPress }: AiBannerProps) {
  return (
    <View>
      <Pressable
        onPress={onPress}
        className="h-[132px] rounded-3xl overflow-hidden"
      >
        <LinearGradient
          colors={["hsl(207, 100%, 83%)", "hsl(334, 100%, 92%)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: "100%", height: "100%" }}
        />
        <View className="absolute inset-0 items-center justify-center px-12">
          <Text className="text-[hsl(228,58%,35%)] text-lg font-bold font-heading text-center">
            Chém gió cùng AI{"\n"}Không lo sai sót
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
