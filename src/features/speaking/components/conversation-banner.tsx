import { ArrowRight, MessageCircle, Sparkles } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface ConversationBannerProps {
  onPress?: () => void;
}

export function ConversationBanner({ onPress }: ConversationBannerProps) {
  return (
    <View className="bg-background-surface rounded-[20px] border border-border overflow-hidden h-[156px] shadow-sm">
      {/* Decorative circles */}
      <View className="absolute w-[130px] h-[130px] rounded-full bg-primary-light opacity-20 -top-8 left-[247px]" />
      <View className="absolute w-[90px] h-[90px] rounded-full bg-primary-default opacity-10 top-[112px] left-[204px]" />
      <View className="absolute w-[60px] h-[60px] rounded-full bg-primary-dark opacity-10 top-[9px] -left-5" />

      <View className="flex-row items-start px-5 py-[18px] gap-2 absolute inset-0">
        {/* Left column */}
        <View className="flex-1 gap-[11px]">
          {/* AI POWERED badge */}
          <View className="bg-primary-dark rounded-full flex-row items-center gap-1 px-2 py-[2px] self-start h-[21px]">
            <Sparkles size={11} color="#f3f4f6" />
            <Text className="text-text-inverse text-[10px] font-body-bold tracking-[0.5px]">
              AI POWERED
            </Text>
          </View>

          {/* Title + subtitle */}
          <View className="gap-[3px]">
            <Text className="text-text-main text-lg font-heading-extra leading-[21px]">
              Nói chuyện với AI
            </Text>
            <Text className="text-text-muted text-xs font-body leading-[17px]">
              Chém gió cùng AI, không lo sai sót
            </Text>
          </View>

          {/* CTA button */}
          <Pressable
            onPress={onPress}
            className="bg-background-surface rounded-[10px] flex-row items-center gap-[6px] pl-[14px] pr-3 h-[35px] self-start"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <MessageCircle size={14} color="#4a67d6" />
            <Text className="text-primary-dark text-sm font-heading">
              Bắt đầu trò chuyện
            </Text>
            <ArrowRight size={13} color="#4a67d6" />
          </Pressable>
        </View>

        {/* Right column – decorative chat bubbles */}
        <View className="w-[88px] h-[78px] relative">
          {/* "Hello! 👋" speech bubble */}
          <View className="absolute top-0 left-0 bg-white/30 border border-white/70 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] px-[9px] py-[6px] w-[50px]">
            <Text className="text-text-muted text-tiny-xs font-body">
              Hello! 👋
            </Text>
          </View>

          {/* Sparkles floating icon */}
          <View className="absolute top-[21px] right-0 bg-white/25 rounded-full w-[22px] h-[22px] items-center justify-center">
            <Sparkles size={11} color="#f3f4f6" />
          </View>

          {/* Dots bubble */}
          <View className="absolute top-[25px] left-[26px] bg-white/95 rounded-tl-[16px] rounded-tr-[16px] rounded-br-[4px] rounded-bl-[16px] w-[62px] h-[52px] items-center justify-center shadow-sm">
            <View className="flex-row gap-1">
              <View className="w-[6px] h-[6px] rounded-full bg-primary-light" />
              <View className="w-[6px] h-[6px] rounded-full bg-primary-default" />
              <View className="w-[6px] h-[6px] rounded-full bg-primary-dark" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
