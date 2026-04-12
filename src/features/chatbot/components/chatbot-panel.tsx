import { AlignJustify, Send } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { useProfile } from "@/features/profile-management/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useCreateChatSession, useSendMessage } from "@/features/chatbot/hooks";
import { extractApiError } from "@/lib/extract-api-error";
import { useErrorOverlayStore } from "@/stores/error-overlay-store";
import { ChatbotMessageBubble } from "./chatbot-message-bubble";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  role: "ai" | "user";
}

const LOADING_BUBBLE_ID = "__loading__";

interface LoadedSession {
  sessionId: string;
  messages: Message[];
}

interface ChatbotPanelProps {
  onClose: () => void;
  onOpenHistory: () => void;
  loadedSession?: LoadedSession;
}

export function ChatbotPanel({
  onClose,
  onOpenHistory,
  loadedSession,
}: ChatbotPanelProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const keyboardVisible = keyboardHeight > 0;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  const { data: profile } = useProfile();
  const { mutateAsync: createSession } = useCreateChatSession();
  const { mutateAsync: sendMessage } = useSendMessage();

  useEffect(() => {
    if (!loadedSession) return;
    setSessionId(loadedSession.sessionId);
    setMessages(loadedSession.messages);
  }, [loadedSession]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvent, (e) =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener(hideEvent, () =>
      setKeyboardHeight(0),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  function formatTimestamp(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  async function handleSend() {
    const text = message.trim();
    if (!text || isAiLoading) return;

    let activeSessionId = sessionId;

    if (!activeSessionId) {
      const courseId = profile?.enrolledClasses[0]?.courseId;
      const jlptLevel = profile?.enrolledClasses?.[0]?.jlptLevel;
      if (!courseId || !jlptLevel) return;
      try {
        const session = await createSession({ courseId, jlptLevel });
        activeSessionId = session.sessionId;
        setSessionId(activeSessionId);
      } catch (error) {
        useErrorOverlayStore.getState().show(
          extractApiError(error, "Không thể khởi tạo cuộc trò chuyện. Vui lòng thử lại."),
          () => {}, // Ở lại chat, không navigate
        );
        return;
      }
    }

    setMessage("");
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text,
        timestamp: formatTimestamp(new Date().toISOString()),
        role: "user",
      },
    ]);
    setIsAiLoading(true);

    try {
      const data = await sendMessage({
        sessionId: activeSessionId,
        message: text,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: data.messageId,
          text: data.content,
          timestamp: formatTimestamp(data.timestamp),
          role: "ai",
        },
      ]);
    } catch (error) {
      useErrorOverlayStore.getState().show(
        extractApiError(error, "Không thể gửi tin nhắn. Vui lòng thử lại."),
        () => {}, // Ở lại chat, không navigate
      );
    } finally {
      setIsAiLoading(false);
    }
  }

  const displayMessages: Message[] = isAiLoading
    ? [
        ...messages,
        { id: LOADING_BUBBLE_ID, text: "...", timestamp: "", role: "ai" },
      ]
    : messages;

  return (
    <View className="flex-1" style={{ paddingBottom: keyboardHeight }}>
      {/* Header */}
      <View
        className="flex-row items-center px-4 py-4 gap-3"
        style={{ borderBottomWidth: 1, borderBottomColor: theme.border.subtle }}
      >
        <Pressable
          onPress={onOpenHistory}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <AlignJustify size={24} color={theme.icon.primary} />
        </Pressable>
        <Text
          className="font-heading text-xl flex-1"
          style={{ color: theme.text.primary }}
        >
          Trợ lý AI
        </Text>
      </View>

      {/* Message list */}
      <FlatList
        ref={listRef}
        data={displayMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center gap-2 px-6">
            <Text
              className="font-heading text-lg text-center"
              style={{ color: theme.text.primary }}
            >
              Xin chào! Tôi là Trợ lý AI của Satori.
            </Text>
            <Text
              className="font-body text-sm text-center"
              style={{ color: theme.text.secondary }}
            >
              Hãy đặt câu hỏi về tiếng Nhật, ngữ pháp, từ vựng hoặc luyện tập
              hội thoại — tôi luôn sẵn sàng giúp bạn!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ChatbotMessageBubble
            text={item.text}
            timestamp={item.timestamp}
            role={item.role}
            isLoading={item.id === LOADING_BUBBLE_ID}
          />
        )}
      />

      {/* Input bar */}
      <View
        className="flex-row items-center px-4 gap-2"
        style={{
          paddingBottom: keyboardVisible ? 12 : insets.bottom + 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: theme.border.subtle,
          backgroundColor: theme.background.page,
        }}
      >
        <View
          className="flex-1 rounded-2xl px-4 py-3"
          style={{
            backgroundColor: theme.background.surface,
            borderWidth: 1,
            borderColor: theme.border.subtle,
          }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={theme.text.tertiary}
            className="font-body text-sm"
            style={{ color: theme.text.primary }}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            editable={!isAiLoading}
          />
        </View>
        <Pressable
          onPress={handleSend}
          disabled={isAiLoading}
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{
            backgroundColor: isAiLoading
              ? theme.brand.primary
              : theme.brand.primary,
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Send size={18} color={theme.icon.onBrand} />
        </Pressable>
      </View>
    </View>
  );
}
