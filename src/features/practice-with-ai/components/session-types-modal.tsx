// Modal chọn loại hình luyện tập khi nhấn vào lesson card.
// Hiển thị carousel vuốt ngang để chọn session type, sau đó điều hướng sang màn hình config.

import { useRef, useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Backdrop, PrimaryButton } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type {
  LessonResponse,
  SessionType,
} from "@/features/practice-with-ai/api";

const TIMING_CONFIG = { duration: 320, easing: Easing.out(Easing.cubic) };

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = 175;
// Gap bằng side padding → card kế tiếp bắt đầu đúng tại cạnh màn hình, chỉ 1 card hiển thị
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const CARD_GAP = SIDE_PADDING - 16; // trừ 16 → card kề peek vào 16px
const CARD_STEP = CARD_WIDTH + CARD_GAP;

const SESSION_TYPES: {
  value: SessionType;
  label: string;
  subtitle: string;
  image: ImageSourcePropType;
}[] = [
  {
    value: "VOCAB_DRILL",
    label: "Từ vựng",
    subtitle: "Ghi nhớ & kiểm tra",
    image: require("../../../../assets/images/practice/vocab.png"),
  },
  {
    value: "GRAMMAR_DRILL",
    label: "Ngữ pháp",
    subtitle: "Cấu trúc câu",
    image: require("../../../../assets/images/practice/grammar.png"),
  },
  {
    value: "KANJI_READING",
    label: "Kanji",
    subtitle: "Nghĩa chữ Hán",
    image: require("../../../../assets/images/practice/kanji.png"),
  },
  {
    value: "MIXED_LESSON",
    label: "Tổng hợp",
    subtitle: "Tất cả loại hình",
    image: require("../../../../assets/images/practice/mixed.png"),
  },
];

const TOTAL = SESSION_TYPES.length;
// Triple the array so we can silently jump between copies for infinite scroll
const LOOPED_DATA = [...SESSION_TYPES, ...SESSION_TYPES, ...SESSION_TYPES];

export interface SessionTypesModalProps {
  visible: boolean;
  onClose: () => void;
  lesson: LessonResponse | null;
  onNext: (sessionType: SessionType) => void;
}

export function SessionTypesModal({
  visible,
  onClose,
  lesson,
  onNext,
}: SessionTypesModalProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [activeIndex, setActiveIndex] = useState(0);
  const [internalVisible, setInternalVisible] = useState(visible);
  const translateY = useSharedValue(600);
  const skipCloseAnimation = useRef(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible) {
      skipCloseAnimation.current = false;
      setInternalVisible(true);
      setActiveIndex(0);
      translateY.value = withTiming(0, TIMING_CONFIG);
    } else if (skipCloseAnimation.current) {
      setInternalVisible(false);
    } else {
      translateY.value = withTiming(600, TIMING_CONFIG, (finished) => {
        if (finished) runOnJS(setInternalVisible)(false);
      });
    }
  }, [visible]);

  // Scroll to first item of the middle copy so both sides are infinite
  useEffect(() => {
    if (internalVisible) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: TOTAL * CARD_STEP,
          animated: false,
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [internalVisible]);

  const panelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.value = gs.dy;
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 150 || gs.vy > 0.5) {
          onCloseRef.current();
        } else {
          translateY.value = withTiming(0, TIMING_CONFIG);
        }
      },
      onPanResponderTerminate: () => {
        translateY.value = withTiming(0, TIMING_CONFIG);
      },
    }),
  ).current;

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const offset = e.nativeEvent.contentOffset.x;
    const scrollIndex = Math.round(offset / CARD_STEP);
    const realIndex = ((scrollIndex % TOTAL) + TOTAL) % TOTAL;
    setActiveIndex(realIndex);

    // Silently jump to the corresponding position in the middle copy
    if (scrollIndex < TOTAL) {
      flatListRef.current?.scrollToOffset({
        offset: (scrollIndex + TOTAL) * CARD_STEP,
        animated: false,
      });
    } else if (scrollIndex >= TOTAL * 2) {
      flatListRef.current?.scrollToOffset({
        offset: (scrollIndex - TOTAL) * CARD_STEP,
        animated: false,
      });
    }
  }

  function handleNext() {
    skipCloseAnimation.current = true;
    onNext(SESSION_TYPES[activeIndex].value);
  }

  return (
    <Modal
      visible={internalVisible}
      animationType="none"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        <Backdrop visible={visible} onPress={onClose} />

        <Animated.View
          className="rounded-t-3xl overflow-hidden"
          style={[
            panelAnimatedStyle,
            {
              backgroundColor: theme.background.page,
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            },
          ]}
        >
          {/* Drag handle */}
          <View {...panResponder.panHandlers}>
            <View className="items-center pt-3 pb-4">
              <View
                className="rounded-full"
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: theme.icon.primary,
                }}
              />
            </View>

            {/* Title + subtitle */}
            <View className="items-center px-5 gap-1.5 pb-5">
              <Text
                className="font-heading text-2xl"
                style={{ color: theme.text.primary }}
              >
                Loại hình luyện tập
              </Text>
              <Text
                className="font-body text-sm text-center"
                style={{ color: theme.text.secondary }}
              >
                Lựa chọn loại hình luyện tập bạn muốn
              </Text>
            </View>
          </View>

          {/* Carousel */}
          <FlatList
            ref={flatListRef}
            className="py-36"
            data={LOOPED_DATA}
            keyExtractor={(item, index) => `${item.value}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_STEP}
            decelerationRate="fast"
            disableIntervalMomentum
            contentContainerStyle={{
              paddingHorizontal: SIDE_PADDING,
              gap: CARD_GAP,
            }}
            onMomentumScrollEnd={handleScroll}
            renderItem={({ item }) => (
              <View
                className="rounded-2xl items-center justify-center"
                style={{
                  width: CARD_WIDTH,
                  height: CARD_WIDTH,
                  padding: 17,
                  backgroundColor: theme.background.surface,
                  borderWidth: 1,
                  borderColor: theme.border.subtle,
                  gap: 8,
                }}
              >
                <Image
                  source={item.image}
                  style={{ width: 100, height: 100 }}
                  resizeMode="contain"
                />
                <View className="items-center gap-px">
                  <Text
                    className="font-heading"
                    style={{ fontSize: 18, color: theme.text.primary }}
                  >
                    {item.label}
                  </Text>
                  <Text
                    className="font-body text-xs"
                    style={{ color: theme.text.secondary }}
                  >
                    {item.subtitle}
                  </Text>
                </View>
              </View>
            )}
          />

          {/* Page dots */}
          <View className="flex-row justify-center items-center gap-1.5 mt-5">
            {SESSION_TYPES.map((_, i) => (
              <View
                key={i}
                className="rounded-full"
                style={{
                  width: i === activeIndex ? 16 : 6,
                  height: 6,
                  backgroundColor:
                    i === activeIndex
                      ? theme.brand.primary
                      : theme.border.subtle,
                }}
              />
            ))}
          </View>

          {/* CTA */}
          <View className="px-5 pt-5">
            <PrimaryButton text="Tiếp theo" onPress={handleNext} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
