import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MessageCircle } from "lucide-react-native";
import { Modal, Pressable, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { Backdrop } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  getSessionMessagesApi,
  reopenChatSessionApi,
} from "@/features/chatbot/api";
import { ChatHistoryDrawer } from "./chatbot-history-drawer";
import { ChatbotPanel } from "./chatbot-panel";

interface LoadedSession {
  sessionId: string;
  messages: {
    id: string;
    text: string;
    timestamp: string;
    role: "ai" | "user";
  }[];
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const FAB_SIZE = 56;
const FAB_RIGHT = 16;
const TIMING_CONFIG = { duration: 320, easing: Easing.out(Easing.cubic) };

export function ChatbotFab() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();

  const CLOSED_Y = screenHeight - tabBarHeight - FAB_SIZE - 16;
  const OPEN_Y = insets.top + 16;

  const progress = useSharedValue(0);
  const [panelVisible, setPanelVisible] = useState(false);
  const [backdropVisible, setBackdropVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [loadedSession, setLoadedSession] = useState<
    LoadedSession | undefined
  >();
  const [chatKey, setChatKey] = useState(0);

  const handleOpen = () => {
    setPanelVisible(true);
    setBackdropVisible(true);
    progress.value = withTiming(1, TIMING_CONFIG);
  };

  const handleSelectSession = async (sessionId: string) => {
    setHistoryVisible(false);
    const [, apiMessages] = await Promise.all([
      reopenChatSessionApi(sessionId),
      getSessionMessagesApi(sessionId),
    ]);
    setLoadedSession({
      sessionId,
      messages: apiMessages.map((m) => ({
        id: m.messageId,
        text: m.content,
        timestamp: formatTimestamp(m.createdAt),
        role: m.role === "USER" ? "user" : "ai",
      })),
    });
  };

  const handleNewChat = () => {
    setLoadedSession(undefined);
    setHistoryVisible(false);
    setChatKey((k) => k + 1);
  };

  const handleClose = () => {
    setBackdropVisible(false);
    progress.value = withTiming(0, TIMING_CONFIG, (finished) => {
      if (finished) runOnJS(setPanelVisible)(false);
    });
  };

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [CLOSED_Y, OPEN_Y]),
      },
    ],
  }));

  const panelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [screenHeight, 0]),
      },
    ],
  }));

  const fabButtonStyle = {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: theme.brand.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  };

  const fabContainerStyle = {
    position: "absolute" as const,
    right: FAB_RIGHT,
    top: 0,
    zIndex: 10,
  };

  return (
    <>
      {/* FAB (ẩn khi modal đang mở) */}
      {!panelVisible && (
        <Animated.View style={[fabContainerStyle, fabAnimatedStyle]}>
          <Pressable onPress={handleOpen} style={fabButtonStyle}>
            <MessageCircle size={24} color={theme.icon.onBrand} />
          </Pressable>
        </Animated.View>
      )}

      {/* Modal phủ toàn màn hình kể cả tab bar */}
      <Modal
        visible={panelVisible}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        {/* Backdrop overlay */}
        <Backdrop visible={backdropVisible} pointerEvents="none" />

        {/* Tap-to-close area above the panel */}
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: OPEN_Y + FAB_SIZE + 8,
          }}
          onPress={handleClose}
        />

        {/* Chat panel */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: OPEN_Y + FAB_SIZE + 8,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: theme.background.page,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              overflow: "hidden",
            },
            panelAnimatedStyle,
          ]}
        >
          <ChatbotPanel
            key={chatKey}
            onClose={handleClose}
            onOpenHistory={() => setHistoryVisible(true)}
            loadedSession={loadedSession}
            keyboardOffset={OPEN_Y + FAB_SIZE + 8}
          />
        </Animated.View>

        {/* FAB bên trong modal */}
        <Animated.View style={[fabContainerStyle, fabAnimatedStyle]}>
          <Pressable onPress={handleClose} style={fabButtonStyle}>
            <MessageCircle size={24} color={theme.icon.onBrand} />
          </Pressable>
        </Animated.View>

        {/* History drawer */}
        <ChatHistoryDrawer
          visible={historyVisible}
          onClose={() => setHistoryVisible(false)}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          topOffset={OPEN_Y + FAB_SIZE + 8}
        />
      </Modal>
    </>
  );
}
