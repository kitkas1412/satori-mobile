// Màn hình luyện hội thoại với AI — trung tâm của feature Speaking.
// Hỗ trợ 2 chế độ:
//   - Guided (có topicId): luyện theo topic với danh sách nhiệm vụ
//   - Free-talk (có jlptLevel + language): hội thoại tự do không theo topic
//
// Luồng: khởi tạo session → người dùng nói (mic) → AI phản hồi → lặp lại
//        → nhấn "Kết thúc" → xem kết quả → chuyển sang FeedbackScreen

import { List, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRef } from "react";
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
import {
  useConversationSession,
  useMicInteraction,
  useRecorder,
} from "@/features/speaking/hooks";
import { useConversationStore } from "@/stores";

interface ConversationPracticeScreenProps {
  topicId?: string;
  jlptLevel?: string;
  language?: string;
  title: string;
}

export function ConversationPracticeScreen({
  topicId,
  jlptLevel,
  language,
  title,
}: ConversationPracticeScreenProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [isMissionsVisible, setIsMissionsVisible] = useState(false);

  const messages = useConversationStore((s) => s.messages);
  const feedback = useConversationStore((s) => s.feedback);
  const hasUserSpoken = useConversationStore((s) =>
    s.messages.some((m) => m.role === "USER"),
  );

  const {
    turnState,
    isInitializing,
    isCompleting,
    initSession,
    initFreeTalkSession,
    sendMessage,
    completeSession,
    abandonSession,
  } = useConversationSession();

  const { startRecording, stopRecording, isRecording } = useRecorder();

  const { handleMicPressIn, handleMicPressOut, micDisabled, micLabel } =
    useMicInteraction({
      turnState,
      isRecording,
      startRecording,
      stopRecording,
      sendMessage,
    });

  // Khởi tạo session khi màn hình mount:
  // - Nếu có topicId → guided session theo topic
  // - Nếu có jlptLevel + language → free-talk session
  useEffect(() => {
    if (topicId) {
      initSession(topicId);
    } else if (jlptLevel && language) {
      initFreeTalkSession(jlptLevel, language);
    }
  }, [topicId, jlptLevel, language]);

  /** Hiển thị hộp thoại xác nhận trước khi bỏ dở session (tiến độ sẽ không được lưu) */
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

  /** Hoàn thành session và chờ kết quả từ AI (nút "Kết thúc" ở bottom bar) */
  async function handleCompleteSession() {
    await completeSession();
  }

  return (
    <>
      <View
        className="flex-1"
        style={{ paddingTop: insets.top, backgroundColor: theme.background.page }}
      >
        {/* Header */}
        <ScreenHeader
          title={title}
          leftAction={
            <TouchableOpacity
              onPress={handleAbandonSession}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={24} color={theme.text.primary} />
            </TouchableOpacity>
          }
          rightAction={
            topicId ? (
              <TouchableOpacity
                onPress={() => setIsMissionsVisible(true)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <List size={24} color={theme.text.primary} />
              </TouchableOpacity>
            ) : undefined
          }
        />

        {/* Divider */}
        <View className="h-px" style={{ backgroundColor: theme.border.subtle }} />

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
          // Tự động cuộn xuống cuối mỗi khi có tin nhắn mới được thêm vào
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
            /* Session đã hoàn thành — hiển thị nút chuyển sang màn hình kết quả */
            <PrimaryButton
              text="Tiếp tục"
              variant="dark"
              onPress={() => router.replace("/conversation-feedback")}
            />
          ) : (
            /* Session đang diễn ra — hiển thị nút Kết thúc (trái) và nút Mic (giữa) */
            <View className="flex-row items-center">
              {/* Kết thúc button - left (chỉ hiện sau khi người dùng đã nói và AI đã phản hồi) */}
              <View className="flex-1 justify-center">
                {hasUserSpoken && turnState === "USER_TURN" && (
                  <TouchableOpacity
                    onPress={handleCompleteSession}
                    disabled={isCompleting}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    {isCompleting ? (
                      <ActivityIndicator size="small" color={theme.brand.primary} />
                    ) : (
                      <Text className="font-heading text-lg" style={{ color: theme.brand.primary }}>
                        Kết thúc
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
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
      {topicId && (
        <MissionsModal
          visible={isMissionsVisible}
          onClose={() => setIsMissionsVisible(false)}
        />
      )}
    </>
  );
}
