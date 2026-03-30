import { AlignJustify, Send } from "lucide-react-native";
import { useEffect, useState } from "react";
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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ChatbotMessageBubble } from "./chatbot-message-bubble";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  role: "ai" | "user";
}

const PLACEHOLDER_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn học tiếng Nhật, trả lời câu hỏi hoặc trò chuyện với bạn. Bạn cần giúp gì không?",
    timestamp: "12:58",
    role: "ai",
  },
  {
    id: "2",
    text: "Thuyết với Đức ai đẹp trai hơn???",
    timestamp: "13:09",
    role: "user",
  },
  {
    id: "3",
    text: "Tôi hiểu rồi! Bạn muốn biết thêm về chủ đề này à? Tôi có thể giúp bạn giải thích chi tiết hơn.",
    timestamp: "13:09",
    role: "ai",
  },
  {
    id: "4",
    text: "Yes",
    timestamp: "13:09",
    role: "user",
  },
  {
    id: "5",
    text: "Có vẻ như bạn đang gặp khó khăn. Đừng lo, chúng ta sẽ cùng nhau giải quyết!",
    timestamp: "13:09",
    role: "ai",
  },
];

interface ChatbotPanelProps {
  onClose: () => void;
  keyboardOffset?: number;
}

export function ChatbotPanel({ onClose, keyboardOffset }: ChatbotPanelProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
          onPress={onClose}
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
        data={PLACEHOLDER_MESSAGES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
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
            onSubmitEditing={() => setMessage("")}
          />
        </View>
        <Pressable
          onPress={() => setMessage("")}
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{ backgroundColor: theme.brand.primary }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Send size={18} color={theme.icon.onBrand} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
