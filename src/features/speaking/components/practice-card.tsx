import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

interface PracticeCardProps {
  title: string;
  description: string;
  imageSource: ImageSourcePropType;
  onPress?: () => void;
}

export function PracticeCard({
  title,
  description,
  imageSource,
  onPress,
}: PracticeCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-4 flex-row items-center justify-between h-[97px] w-full active:opacity-80"
    >
      <View className="flex-1 gap-1">
        <Text className="font-heading text-[18px] text-text-muted leading-[18px]">
          {title}
        </Text>
        <Text className="font-body text-[10px] text-text-muted leading-[10px]">
          {description}
        </Text>
      </View>
      <Image source={imageSource} className="w-20 h-20" resizeMode="contain" />
    </Pressable>
  );
}
