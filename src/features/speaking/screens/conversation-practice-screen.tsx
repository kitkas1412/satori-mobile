import { List, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LoadingOverlay, PrimaryButton, ScreenHeader } from "@/components/ui";
import {
  FeedbackBubble,
  MessageBubble,
  MicButton,
  MissionsModal,
  TypingIndicator,
} from "@/features/speaking/components";
import { useConversationSession, useRecorder } from "@/features/speaking/hooks";
import { useConversationStore } from "@/stores";

interface ConversationPracticeScreenProps {
  topicId: string;
  title: string;
}

export function ConversationPracticeScreen({
  topicId,
  title,
}: ConversationPracticeScreenProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const pressStartTimeRef = useRef<number | null>(null);
  const isTapModeRef = useRef(false);

  const [isMissionsVisible, setIsMissionsVisible] = useState(false);

  const messages = useConversationStore((s) => s.messages);
  const feedback = useConversationStore((s) => s.feedback);

  const {
    turnState,
    isInitializing,
    isCompleting,
    initSession,
    sendMessage,
    completeSession,
    abandonSession,
  } = useConversationSession();

  const { startRecording, stopRecording, isRecording } = useRecorder();

  useEffect(() => {
    initSession(topicId);
  }, [topicId]);

  function handleAbandonSession() {
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

  async function handleCompleteSession() {
    await completeSession();
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

  return (
    <>
      <View
        className="flex-1 bg-background-default"
        style={{ paddingTop: insets.top }}
      >
        {/* Header */}
        <ScreenHeader
          title={title}
          leftAction={
            <TouchableOpacity
              onPress={handleAbandonSession}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={24} color={theme.textDefault} />
            </TouchableOpacity>
          }
          rightAction={
            <TouchableOpacity
              onPress={() => setIsMissionsVisible(true)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <List size={24} color={theme.textDefault} />
            </TouchableOpacity>
          }
        />

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
            <MessageBubble
              key={message.id ?? `msg-${index}`}
              message={message}
            />
          ))}

          {feedback && <FeedbackBubble feedback={feedback} />}

          {turnState === "LOADING" && <TypingIndicator />}
        </ScrollView>

        {/* Bottom Controls */}
        <View
          className="px-4 gap-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
        >
          {feedback ? (
            /* Session completed — show Tiếp tục button */
            <PrimaryButton
              text="Tiếp tục"
              variant="dark"
              onPress={() => router.replace("/conversation-feedback")}
            />
          ) : (
            /* Session active — show Mic + Kết thúc */
            <View className="flex-row items-center">
              {/* Kết thúc button - left */}
              <View className="flex-1 justify-center">
                <TouchableOpacity
                  onPress={handleCompleteSession}
                  disabled={isCompleting}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  {isCompleting ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                  ) : (
                    <Text className="font-heading text-lg text-primary-dark">
                      Kết thúc
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Mic button - center */}
              <MicButton
                isRecording={isRecording}
                disabled={micDisabled}
                label={micLabel}
                onPressIn={handleMicPressIn}
                onPressOut={handleMicPressOut}
              />

              {/* Spacer - right */}
              <View className="flex-1" />
            </View>
          )}
        </View>
      </View>
      <LoadingOverlay
        visible={isInitializing}
        title="Đang khởi tạo..."
        message="Vui lòng đợi trong giây lát"
      />
      <MissionsModal
        visible={isMissionsVisible}
        onClose={() => setIsMissionsVisible(false)}
      />
    </>
  );
}
