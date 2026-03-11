import { AlignJustify, Languages, Mic, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useConversationSession, useRecorder } from "@/features/speaking/hooks";
import { useConversationStore } from "@/stores";
import type { Messages } from "@/features/speaking/api";

interface ConversationPracticeScreenProps {
  topicId: string;
  title: string;
}

function MessageBubble({ message }: { message: Messages }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [showTranslation, setShowTranslation] = useState(false);

  if (message.role === "ASSISTANT") {
    return (
      <View className="self-start max-w-[85%]">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setShowTranslation((v) => !v)}
        >
          <View
            className="bg-white px-4 py-4 gap-2"
            style={{
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              borderBottomRightRadius: 14,
            }}
          >
            <Text className="font-body text-base text-text-main">
              {message.content}
            </Text>
            {showTranslation && message.translation ? (
              <Text
                className="font-body text-sm"
                style={{ color: theme.textMuted }}
              >
                {message.translation}
              </Text>
            ) : null}
            <View className="self-end">
              <Languages size={12} color={theme.textMuted} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="self-end max-w-[85%]">
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
  );
}

export function ConversationPracticeScreen({
  topicId,
  title,
}: ConversationPracticeScreenProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const scrollViewRef = useRef<ScrollView>(null);
  const pressStartTimeRef = useRef<number | null>(null);
  const isTapModeRef = useRef(false);

  const messages = useConversationStore((s) => s.messages);

  const {
    turnState,
    isInitializing,
    initSession,
    sendMessage,
    abandonSession,
  } = useConversationSession();

  const { startRecording, stopRecording, isRecording } = useRecorder();

  useEffect(() => {
    initSession(topicId);
  }, [topicId]);

  function handleEndSession() {
    Alert.alert(
      "Kết thúc buổi học",
      "Tiến độ sẽ không được lưu. Bạn chắc chắn chứ?",
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Kết thúc",
          style: "destructive",
          onPress: () => abandonSession(),
        },
      ],
    );
  }

  async function handleMicPressIn() {
    if (turnState !== "USER_TURN") return;
    pressStartTimeRef.current = Date.now();
    if (!isRecording) {
      await startRecording();
    }
  }

  async function handleMicPressOut() {
    if (!isRecording) return;
    const elapsed = Date.now() - (pressStartTimeRef.current ?? 0);
    const TAP_THRESHOLD = 300;

    if (elapsed < TAP_THRESHOLD) {
      if (isTapModeRef.current) {
        isTapModeRef.current = false;
        const { transcript, audioUri } = await stopRecording();
        await sendMessage(transcript, audioUri);
      } else {
        isTapModeRef.current = true;
      }
    } else {
      isTapModeRef.current = false;
      const { transcript, audioUri } = await stopRecording();
      await sendMessage(transcript, audioUri);
    }
  }

  const micDisabled = turnState !== "USER_TURN";
  const micLabel =
    turnState === "LOADING"
      ? "AI đang trả lời..."
      : turnState === "AI_TURN"
        ? "Chờ AI..."
        : isRecording
          ? "Đang ghi âm..."
          : "Chạm để nói";

  if (isInitializing) {
    return (
      <View
        className="flex-1 bg-background-default items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text
          className="font-body text-sm mt-3"
          style={{ color: theme.textMuted }}
        >
          Đang khởi tạo buổi học...
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background-default"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 h-16 gap-8">
        <View className="flex-row items-center gap-2 flex-1">
          <TouchableOpacity
            onPress={handleEndSession}
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
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message, index) => (
          <MessageBubble key={message.id ?? `msg-${index}`} message={message} />
        ))}

        {turnState === "LOADING" && (
          <View className="self-start">
            <View
              className="bg-white px-4 py-3 flex-row items-center gap-2"
              style={{
                borderTopLeftRadius: 14,
                borderTopRightRadius: 14,
                borderBottomRightRadius: 14,
              }}
            >
              <ActivityIndicator size="small" color={theme.primary} />
              <Text
                className="font-body text-sm"
                style={{ color: theme.textMuted }}
              >
                AI đang trả lời...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Controls */}
      <View
        className="px-4 gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        {/* Mic + End button row */}
        <View className="flex-row items-center">
          {/* End button - left */}
          <View className="flex-1 justify-center">
            <TouchableOpacity
              onPress={handleEndSession}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text className="font-heading text-lg text-primary-dark">
                Kết thúc
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mic button - center */}
          <View className="items-center gap-2">
            <Text
              className="font-body text-base"
              style={{ color: theme.textMuted }}
            >
              {micLabel}
            </Text>
            <Pressable
              onPressIn={handleMicPressIn}
              onPressOut={handleMicPressOut}
              disabled={micDisabled}
              className={`w-[62px] h-[62px] rounded-xl items-center justify-center ${
                isRecording
                  ? "bg-error-default"
                  : micDisabled
                    ? "bg-border"
                    : "bg-primary-dark"
              }`}
            >
              <Mic size={32} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Spacer - right */}
          <View className="flex-1" />
        </View>
      </View>
    </View>
  );
}
