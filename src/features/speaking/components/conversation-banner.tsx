import { ArrowRight, MessageCircle, Sparkles } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface ConversationBannerProps {
  onPress?: () => void;
}

export function ConversationBanner({ onPress }: ConversationBannerProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      className="rounded-[20px] border overflow-hidden h-[156px] shadow-sm"
      style={{ backgroundColor: theme.background, borderColor: theme.border }}
    >
      {/* Decorative circles */}
      <View
        className="absolute w-[130px] h-[130px] rounded-full  opacity-20 -top-8 left-[247px]"
        style={{ backgroundColor: theme.primary }}
      />
      <View
        className="absolute w-[90px] h-[90px] rounded-full opacity-10 top-[112px] left-[204px]"
        style={{ backgroundColor: theme.primary }}
      />
      <View
        className="absolute w-[60px] h-[60px] rounded-full opacity-10 top-[9px] -left-5"
        style={{ backgroundColor: theme.primary }}
      />

      <View className="flex-row items-start px-5 py-[18px] gap-2 absolute inset-0">
        {/* Left column */}
        <View className="flex-1 gap-[11px]">
          {/* AI POWERED badge */}
          <View
            className="rounded-full flex-row items-center gap-1 px-2 py-[2px] self-start h-[21px]"
            style={{ backgroundColor: theme.primary }}
          >
            <Sparkles size={11} color="hsl(220, 14%, 96%)" />
            <Text
              className="text-[10px] font-body-bold tracking-[0.5px]"
              style={{ color: theme.white }}
            >
              AI POWERED
            </Text>
          </View>

          {/* Title + subtitle */}
          <View className="gap-[3px]">
            <Text
              className="text-lg font-heading-extra leading-[21px]"
              style={{ color: theme.textDefault }}
            >
              Nói chuyện với AI
            </Text>
            <Text
              className="text-xs font-body leading-[17px]"
              style={{ color: theme.textMuted }}
            >
              Chém gió cùng AI, không lo sai sót
            </Text>
          </View>

          {/* CTA button */}
          <Pressable
            onPress={onPress}
            className=" rounded-[10px] flex-row items-center gap-[6px] pl-[14px] pr-3 h-[35px] self-start"
            style={{
              shadowColor: theme.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 8,
              elevation: 3,
              backgroundColor: theme.background,
            }}
          >
            <MessageCircle size={14} color={theme.primary} />
            <Text
              className="text-sm font-heading"
              style={{ color: theme.primary }}
            >
              Bắt đầu trò chuyện
            </Text>
            <ArrowRight size={13} color={theme.primary} />
          </Pressable>
        </View>

        {/* Right column – decorative chat bubbles */}
        <View className="w-[88px] h-[78px] relative">
          {/* "Hello! 👋" speech bubble */}
          <View className="absolute top-0 left-0 bg-white/30 border border-white/70 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] px-[9px] py-[6px] w-[50px]">
            <Text
              className="text-tiny-xs font-body"
              style={{ color: theme.textMuted }}
            >
              Hello! 👋
            </Text>
          </View>

          {/* Sparkles floating icon */}
          <View className="absolute top-[21px] right-0 bg-white/25 rounded-full w-[22px] h-[22px] items-center justify-center">
            <Sparkles size={11} color="hsl(220, 14%, 96%)" />
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
