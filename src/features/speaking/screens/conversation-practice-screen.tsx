import { AlignJustify, Languages, Mic, X } from "lucide-react-native";
import React, { useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type MessageSender = "ai" | "user";

interface Message {
  id: string;
  sender: MessageSender;
  content: string;
}

const MOCK_MESSAGES: Message[] = [
  { id: "1", sender: "ai", content: "こんにちは！お元気ですか？" },
  { id: "2", sender: "user", content: "こんにちは！お元気ですか？" },
  { id: "3", sender: "ai", content: "こんにちは！お元気ですか？" },
];

const SUGGESTION_CHIPS = [
  "こんにちは！お元気ですか？",
  "こんにちは！お元気ですか？",
];

interface ConversationPracticeScreenProps {
  title?: string;
  onClose?: () => void;
  onMenuPress?: () => void;
  onEndSession?: () => void;
  onMicPress?: () => void;
  onSuggestionPress?: (text: string) => void;
}

export function ConversationPracticeScreen({
  title = "Tự giới thiệu trong buổi họp",
  onClose,
  onMenuPress,
  onEndSession,
  onMicPress,
  onSuggestionPress,
}: ConversationPracticeScreenProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View
      className="flex-1 bg-background-default"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 h-16 gap-8">
        <View className="flex-row items-center gap-2 flex-1">
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <X size={24} color={theme.textDefault} />
          </TouchableOpacity>
          <Text
            className="font-heading text-xl text-text-main flex-1"
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onMenuPress}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <AlignJustify size={24} color={theme.textDefault} />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View className="h-px bg-border" />

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {MOCK_MESSAGES.map((message) =>
          message.sender === "ai" ? (
            <View key={message.id} className="self-start max-w-[85%]">
              <View
                className="bg-white flex-row items-end gap-1 px-4 py-4"
                style={{
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                  borderBottomRightRadius: 14,
                }}
              >
                <Text className="font-body text-base text-text-main">
                  {message.content}
                </Text>
                <Languages size={12} color={theme.textMuted} />
              </View>
            </View>
          ) : (
            <View key={message.id} className="self-end max-w-[85%]">
              <View
                className="bg-primary-default px-4 py-4"
                style={{
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                  borderBottomLeftRadius: 14,
                }}
              >
                <Text className="font-body text-base text-text-main">
                  {message.content}
                </Text>
              </View>
            </View>
          )
        )}
      </ScrollView>

      {/* Bottom Controls */}
      <View
        className="px-4 gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        {/* Suggestion Chips */}
        <View className="flex-row gap-2 flex-wrap">
          {SUGGESTION_CHIPS.map((chip, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white border border-border rounded-lg px-2 py-1"
              onPress={() => onSuggestionPress?.(chip)}
            >
              <Text className="font-body text-xs text-text-muted">{chip}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mic + End button row */}
        <View className="flex-row items-center">
          {/* End button - left */}
          <View className="flex-1 justify-center">
            <TouchableOpacity
              onPress={onEndSession}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text className="font-heading text-lg text-primary-dark">
                Kết thúc
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mic button - center */}
          <View className="items-center gap-2">
            <Text className="font-body text-base text-text-muted">
              Chạm để nói
            </Text>
            <TouchableOpacity
              className="bg-primary-dark w-[62px] h-[62px] rounded-xl items-center justify-center"
              onPress={onMicPress}
              activeOpacity={0.8}
            >
              <Mic size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Spacer - right (mirrors flex-1 left to keep mic centered) */}
          <View className="flex-1" />
        </View>
      </View>
    </View>
  );
}
