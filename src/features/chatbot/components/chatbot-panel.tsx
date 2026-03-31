import { AlignJustify, Send } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { useProfile } from "@/hooks/api/use-profile";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useCreateChatSession, useSendMessage } from "@/features/chatbot/hooks";
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
  keyboardOffset?: number;
}

export function ChatbotPanel({
  onClose,
  onOpenHistory,
  loadedSession,
  keyboardOffset,
}: ChatbotPanelProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  const { data: profile } = useProfile();
  const { mutate: createSession } = useCreateChatSession();
  const { mutateAsync: sendMessage } = useSendMessage();

  useEffect(() => {
    if (loadedSession) return;
    const courseId = profile?.enrolledClasses[0]?.courseId;
    const jlptLevel = profile?.learningPreferences?.targetJlptLevel;
    if (courseId && jlptLevel) {
      createSession(
        { courseId, jlptLevel },
        { onSuccess: (data) => setSessionId(data.sessionId) },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loadedSession) return;
    setSessionId(loadedSession.sessionId);
    setMessages(loadedSession.messages);
  }, [loadedSession]);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
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
    if (!text || !sessionId || isAiLoading) return;

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
      const data = await sendMessage({ sessionId, message: text });
      setMessages((prev) => [
        ...prev,
        {
          id: data.messageId,
          text: data.content,
          timestamp: formatTimestamp(data.timestamp),
          role: "ai",
        },
      ]);
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
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardOffset ?? 0}
    >
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
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => (
          <ChatbotMessageBubble
            text={item.text}
            timestamp={item.timestamp}
            role={item.role}
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
          backgroundColor: theme.background.surface,
        }}
      >
        <View
          className="flex-1 rounded-2xl px-4 py-3"
          style={{
            backgroundColor: theme.background.page,
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
    </KeyboardAvoidingView>
  );
}
