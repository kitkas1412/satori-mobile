import { ChevronLeft, Clock, Plus } from "lucide-react-native";
import { useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const DRAWER_WIDTH = 293;
const TIMING_CONFIG = { duration: 280, easing: Easing.out(Easing.cubic) };

interface ConversationItem {
  id: string;
  title: string;
  preview: string;
  date: string;
}

const PLACEHOLDER_CONVERSATIONS: ConversationItem[] = [
  {
    id: "1",
    title: "Học từ vựng Unit 5",
    preview: "Bạn có thể giải thích nghĩa của...",
    date: "Hôm nay",
  },
  {
    id: "2",
    title: "Luyện ngữ pháp N3",
    preview: "て form được dùng khi nào?",
    date: "Hôm nay",
  },
  {
    id: "3",
    title: "Hội thoại mua sắm",
    preview: "Cách nói giá tiền trong tiếng Nhật",
    date: "Hôm nay",
  },
  {
    id: "4",
    title: "Kanji thường gặp",
    preview: "Ý nghĩa của kanji 大 là gì?",
    date: "Hôm nay",
  },
  {
    id: "5",
    title: "Luyện nghe JLPT",
    preview: "Bài nghe N4 phần 3 mục 2...",
    date: "Hôm nay",
  },
];

interface ChatHistoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  topOffset?: number;
}

export function ChatHistoryDrawer({ visible, onClose, topOffset = 0 }: ChatHistoryDrawerProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, TIMING_CONFIG);
  }, [visible]);

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [-DRAWER_WIDTH, 0]),
      },
    ],
  }));

  return (
    <View
      pointerEvents={visible ? "box-none" : "none"}
      style={{ position: "absolute", top: topOffset, left: 0, right: 0, bottom: 0 }}
    >

      {/* Drawer panel */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: DRAWER_WIDTH,
            backgroundColor: theme.background.page,
            borderTopLeftRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 8,
          },
          drawerAnimatedStyle,
        ]}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            height: 72,
            borderBottomWidth: 1,
            borderBottomColor: theme.border.subtle,
          }}
        >
          <Text
            className="font-heading text-lg"
            style={{ color: theme.text.primary }}
          >
            Lịch sử trò chuyện
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ChevronLeft size={24} color={theme.icon.primary} />
          </Pressable>
        </View>

        {/* New conversation button */}
        <View style={{ paddingHorizontal: 12, paddingTop: 12 }}>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              height: 45,
              paddingHorizontal: 16,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.border.default,
            }}
          >
            <Plus size={16} color={theme.icon.primary} />
            <Text
              className="font-heading text-sm"
              style={{ color: theme.text.primary }}
            >
              Cuộc trò chuyện mới
            </Text>
          </Pressable>
        </View>

        {/* Section label */}
        <Text
          className="font-body text-xs"
          style={{
            color: theme.text.secondary,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 4,
          }}
        >
          Gần đây
        </Text>

        {/* Conversation list */}
        <FlatList
          data={PLACEHOLDER_CONVERSATIONS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={{
                flexDirection: "row",
                gap: 12,
                paddingHorizontal: 12,
                paddingTop: 12,
                paddingBottom: 12,
                borderRadius: 14,
              }}
            >
              <View style={{ paddingTop: 4 }}>
                <Clock size={12} color={theme.icon.secondary} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text
                  className="font-heading text-sm"
                  style={{ color: theme.text.primary }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  className="font-body text-xs"
                  style={{ color: theme.text.secondary }}
                  numberOfLines={1}
                >
                  {item.preview}
                </Text>
                <Text
                  className="font-body"
                  style={{ color: theme.info.default, fontSize: 10 }}
                >
                  {item.date}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </Animated.View>
    </View>
  );
}
