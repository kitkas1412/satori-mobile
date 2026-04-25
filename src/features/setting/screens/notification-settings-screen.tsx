import {
  BaseInput,
  IconButton,
  ScreenAsyncView,
  ScreenHeader,
} from "@/components/ui";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/features/setting/hooks";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TIME_RE = /^\d{2}:\d{2}$/;

function toDisplay(time: string): string {
  return time ? time.slice(0, 5) : "";
}

function toPayload(time: string): string {
  return `${time}:00`;
}

export function NotificationSettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { data: prefs, isLoading, isError } = useNotificationSettings();
  const { mutate: updatePrefs } = useUpdateNotificationSettings();

  const [pushEnabled, setPushEnabled] = useState(prefs?.pushEnabled ?? true);
  const [emailEnabled, setEmailEnabled] = useState(prefs?.emailEnabled ?? true);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(
    prefs?.dailyReminderEnabled ?? false,
  );
  const [dailyReminderTime, setDailyReminderTime] = useState(
    prefs?.dailyReminderTime ? toDisplay(prefs.dailyReminderTime) : "08:00",
  );
  const [assignmentNotifications, setAssignmentNotifications] = useState(
    prefs?.assignmentNotifications ?? true,
  );
  const [achievementNotifications, setAchievementNotifications] = useState(
    prefs?.achievementNotifications ?? true,
  );
  const [classNotifications, setClassNotifications] = useState(
    prefs?.classNotifications ?? true,
  );
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(
    prefs?.quietHoursEnabled ?? false,
  );
  const [quietHoursStart, setQuietHoursStart] = useState(
    prefs?.quietHoursStart ? toDisplay(prefs.quietHoursStart) : "22:00",
  );
  const [quietHoursEnd, setQuietHoursEnd] = useState(
    prefs?.quietHoursEnd ? toDisplay(prefs.quietHoursEnd) : "07:00",
  );

  // Track whether the user has made any changes
  const isDirtyRef = useRef(false);

  function markDirty<T>(setter: React.Dispatch<React.SetStateAction<T>>) {
    return (value: React.SetStateAction<T>) => {
      isDirtyRef.current = true;
      setter(value);
    };
  }

  // Keep refs fresh for use inside the beforeRemove listener
  const mutateRef = useRef(updatePrefs);
  const prefsRef = useRef(prefs);
  const stateRef = useRef({
    pushEnabled,
    emailEnabled,
    dailyReminderEnabled,
    dailyReminderTime,
    assignmentNotifications,
    achievementNotifications,
    classNotifications,
    quietHoursEnabled,
    quietHoursStart,
    quietHoursEnd,
  });

  useEffect(() => {
    mutateRef.current = updatePrefs;
  }, [updatePrefs]);

  useEffect(() => {
    prefsRef.current = prefs;
  }, [prefs]);

  useEffect(() => {
    stateRef.current = {
      pushEnabled,
      emailEnabled,
      dailyReminderEnabled,
      dailyReminderTime,
      assignmentNotifications,
      achievementNotifications,
      classNotifications,
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
    };
  }, [
    pushEnabled,
    emailEnabled,
    dailyReminderEnabled,
    dailyReminderTime,
    assignmentNotifications,
    achievementNotifications,
    classNotifications,
    quietHoursEnabled,
    quietHoursStart,
    quietHoursEnd,
  ]);

  // Send changes when the user navigates away
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      if (!isDirtyRef.current || !prefsRef.current) return;
      const s = stateRef.current;
      const p = prefsRef.current;
      mutateRef.current({
        pushEnabled: s.pushEnabled,
        emailEnabled: s.emailEnabled,
        dailyReminderEnabled: s.dailyReminderEnabled,
        dailyReminderTime: TIME_RE.test(s.dailyReminderTime)
          ? toPayload(s.dailyReminderTime)
          : p.dailyReminderTime,
        assignmentNotifications: s.assignmentNotifications,
        achievementNotifications: s.achievementNotifications,
        classNotifications: s.classNotifications,
        quietHoursEnabled: s.quietHoursEnabled,
        quietHoursStart: TIME_RE.test(s.quietHoursStart)
          ? toPayload(s.quietHoursStart)
          : p.quietHoursStart,
        quietHoursEnd: TIME_RE.test(s.quietHoursEnd)
          ? toPayload(s.quietHoursEnd)
          : p.quietHoursEnd,
      });
    });
    return unsubscribe;
  }, [navigation]);

  const cardStyle = {
    backgroundColor: theme.background.surface,
    borderWidth: 1,
    borderColor: theme.border.subtle,
  };

  const switchProps = {
    trackColor: { false: theme.border.default, true: theme.brand.primary },
    thumbColor: theme.background.surface,
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <ScreenHeader
        title="Thông báo"
        paddingTop={insets.top + 16}
        leftAction={
          <IconButton
            icon={<ChevronLeft size={24} color={theme.icon.primary} />}
            onPress={() => router.back()}
          />
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
          gap: 24,
        }}
      >
        <ScreenAsyncView
          isLoading={isLoading}
          isError={isError}
          isEmpty={!prefs}
          emptyText="Không thể tải cài đặt thông báo."
        >
          {/* Section 1: Kênh thông báo */}
          <View style={{ gap: 8 }}>
            <Text
              className="font-heading text-base"
              style={{ color: theme.text.primary }}
            >
              Kênh thông báo
            </Text>

            <View className="rounded-2xl px-4 py-4" style={cardStyle}>
              <View className="flex-row items-center justify-between">
                <Text
                  className="font-body text-base"
                  style={{ color: theme.text.primary }}
                >
                  Thông báo đẩy
                </Text>
                <Switch
                  value={pushEnabled}
                  onValueChange={markDirty(setPushEnabled)}
                  {...switchProps}
                />
              </View>
            </View>

            <View className="rounded-2xl px-4 py-4" style={cardStyle}>
              <View className="flex-row items-center justify-between">
                <Text
                  className="font-body text-base"
                  style={{ color: theme.text.primary }}
                >
                  Thông báo email
                </Text>
                <Switch
                  value={emailEnabled}
                  onValueChange={markDirty(setEmailEnabled)}
                  {...switchProps}
                />
              </View>
            </View>
          </View>

          {/* Section 2: Nhắc nhở hàng ngày */}
          <View style={{ gap: 8 }}>
            <Text
              className="font-heading text-base"
              style={{ color: theme.text.primary }}
            >
              Nhắc nhở hàng ngày
            </Text>

            <View className="rounded-2xl px-4 py-4" style={cardStyle}>
              <View className="flex-row items-center justify-between">
                <Text
                  className="font-body text-base"
                  style={{ color: theme.text.primary }}
                >
                  Bật nhắc nhở hàng ngày
                </Text>
                <Switch
                  value={dailyReminderEnabled}
                  onValueChange={markDirty(setDailyReminderEnabled)}
                  {...switchProps}
                />
              </View>
            </View>

            {dailyReminderEnabled && (
              <BaseInput
                label="Giờ nhắc nhở"
                value={dailyReminderTime}
                onChangeText={markDirty(setDailyReminderTime)}
                placeholder="HH:mm"
                keyboardType="numbers-and-punctuation"
                error={
                  dailyReminderTime.length > 0 && !TIME_RE.test(dailyReminderTime)
                    ? "Định dạng giờ không hợp lệ (HH:mm)"
                    : undefined
                }
              />
            )}
          </View>

          {/* Section 3: Loại thông báo */}
          <View style={{ gap: 8 }}>
            <Text
              className="font-heading text-base"
              style={{ color: theme.text.primary }}
            >
              Loại thông báo
            </Text>

            {[
              {
                label: "Bài tập & kiểm tra",
                value: assignmentNotifications,
                onChange: markDirty(setAssignmentNotifications),
              },
              {
                label: "Thành tích",
                value: achievementNotifications,
                onChange: markDirty(setAchievementNotifications),
              },
              {
                label: "Lớp học",
                value: classNotifications,
                onChange: markDirty(setClassNotifications),
              },
            ].map((item) => (
              <View
                key={item.label}
                className="rounded-2xl px-4 py-4"
                style={cardStyle}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className="font-body text-base"
                    style={{ color: theme.text.primary }}
                  >
                    {item.label}
                  </Text>
                  <Switch
                    value={item.value}
                    onValueChange={item.onChange}
                    {...switchProps}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Section 4: Giờ yên tĩnh */}
          <View style={{ gap: 8 }}>
            <Text
              className="font-heading text-base"
              style={{ color: theme.text.primary }}
            >
              Giờ yên tĩnh
            </Text>

            <View className="rounded-2xl px-4 py-4" style={cardStyle}>
              <View className="flex-row items-center justify-between">
                <Text
                  className="font-body text-base"
                  style={{ color: theme.text.primary }}
                >
                  Bật giờ yên tĩnh
                </Text>
                <Switch
                  value={quietHoursEnabled}
                  onValueChange={markDirty(setQuietHoursEnabled)}
                  {...switchProps}
                />
              </View>
            </View>

            {quietHoursEnabled && (
              <>
                <BaseInput
                  label="Bắt đầu"
                  value={quietHoursStart}
                  onChangeText={markDirty(setQuietHoursStart)}
                  placeholder="HH:mm"
                  keyboardType="numbers-and-punctuation"
                  error={
                    quietHoursStart.length > 0 && !TIME_RE.test(quietHoursStart)
                      ? "Định dạng giờ không hợp lệ (HH:mm)"
                      : undefined
                  }
                />
                <BaseInput
                  label="Kết thúc"
                  value={quietHoursEnd}
                  onChangeText={markDirty(setQuietHoursEnd)}
                  placeholder="HH:mm"
                  keyboardType="numbers-and-punctuation"
                  error={
                    quietHoursEnd.length > 0 && !TIME_RE.test(quietHoursEnd)
                      ? "Định dạng giờ không hợp lệ (HH:mm)"
                      : undefined
                  }
                />
              </>
            )}
          </View>
        </ScreenAsyncView>
      </ScrollView>
    </View>
  );
}
