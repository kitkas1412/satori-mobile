import {
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TIME_RE = /^\d{2}:\d{2}$/;

function toDisplay(time: string): string {
  return time ? time.slice(0, 5) : "";
}

function toPayload(time: string): string {
  return `${time}:00`;
}

function timeStringToDate(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function dateToTimeString(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
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

  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [tempTime, setTempTime] = useState(() => timeStringToDate(dailyReminderTime));

  const [quietStartPickerVisible, setQuietStartPickerVisible] = useState(false);
  const [tempQuietStart, setTempQuietStart] = useState(() => timeStringToDate(quietHoursStart));

  const [quietEndPickerVisible, setQuietEndPickerVisible] = useState(false);
  const [tempQuietEnd, setTempQuietEnd] = useState(() => timeStringToDate(quietHoursEnd));

  // Track whether the user has made any changes
  const isDirtyRef = useRef(false);

  function markDirty<T>(setter: React.Dispatch<React.SetStateAction<T>>) {
    return (value: React.SetStateAction<T>) => {
      isDirtyRef.current = true;
      setter(value);
    };
  }

  // Sync server data → local state when prefs arrives/refreshes (only if user hasn't changed anything)
  useEffect(() => {
    if (!prefs || isDirtyRef.current) return;
    setPushEnabled(prefs.pushEnabled);
    setEmailEnabled(prefs.emailEnabled);
    setDailyReminderEnabled(prefs.dailyReminderEnabled);
    setDailyReminderTime(prefs.dailyReminderTime ? toDisplay(prefs.dailyReminderTime) : "08:00");
    setAssignmentNotifications(prefs.assignmentNotifications);
    setAchievementNotifications(prefs.achievementNotifications);
    setClassNotifications(prefs.classNotifications);
    setQuietHoursEnabled(prefs.quietHoursEnabled);
    setQuietHoursStart(prefs.quietHoursStart ? toDisplay(prefs.quietHoursStart) : "22:00");
    setQuietHoursEnd(prefs.quietHoursEnd ? toDisplay(prefs.quietHoursEnd) : "07:00");
  }, [prefs]);

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
              <>
                <View className="rounded-2xl px-4 py-4" style={cardStyle}>
                  <View className="flex-row items-center justify-between">
                    <View style={{ gap: 2 }}>
                      <Text
                        className="text-sm font-heading"
                        style={{ color: theme.text.secondary }}
                      >
                        Giờ nhắc nhở
                      </Text>
                      <Text
                        className="text-base font-body"
                        style={{ color: theme.text.primary }}
                      >
                        {dailyReminderTime}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setTempTime(timeStringToDate(dailyReminderTime));
                        setTimePickerVisible(true);
                      }}
                      activeOpacity={0.6}
                      hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                    >
                      <Text
                        className="text-base font-heading"
                        style={{ color: theme.brand.primary }}
                      >
                        Thay đổi
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Modal
                  visible={timePickerVisible}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setTimePickerVisible(false)}
                >
                  <Pressable
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
                    onPress={() => setTimePickerVisible(false)}
                  />
                  <View
                    style={{
                      backgroundColor: theme.background.surface,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      paddingBottom: insets.bottom + 16,
                    }}
                  >
                    <View
                      className="flex-row items-center justify-between px-4"
                      style={{ paddingTop: 16, paddingBottom: 8 }}
                    >
                      <TouchableOpacity
                        onPress={() => setTimePickerVisible(false)}
                        hitSlop={12}
                        activeOpacity={0.6}
                      >
                        <View
                          style={{
                            backgroundColor: theme.background.page,
                            borderRadius: 99,
                            padding: 6,
                          }}
                        >
                          <X size={18} color={theme.icon.primary} />
                        </View>
                      </TouchableOpacity>
                      <Text
                        className="text-base font-heading"
                        style={{ color: theme.text.primary }}
                      >
                        Chọn thời gian
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          markDirty(setDailyReminderTime)(dateToTimeString(tempTime));
                          setTimePickerVisible(false);
                        }}
                        hitSlop={12}
                        activeOpacity={0.6}
                      >
                        <Text
                          className="text-base font-heading"
                          style={{ color: theme.brand.primary }}
                        >
                          Xong
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: "center", width: "100%" }}>
                      <DateTimePicker
                        value={tempTime}
                        mode="time"
                        display="spinner"
                        is24Hour
                        onChange={(_, date) => { if (date) setTempTime(date); }}
                        style={{ height: 216 }}
                      />
                    </View>
                  </View>
                </Modal>
              </>
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
                {/* Bắt đầu */}
                <View className="rounded-2xl px-4 py-4" style={cardStyle}>
                  <View className="flex-row items-center justify-between">
                    <View style={{ gap: 2 }}>
                      <Text
                        className="text-sm font-heading"
                        style={{ color: theme.text.secondary }}
                      >
                        Bắt đầu
                      </Text>
                      <Text
                        className="text-base font-body"
                        style={{ color: theme.text.primary }}
                      >
                        {quietHoursStart}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setTempQuietStart(timeStringToDate(quietHoursStart));
                        setQuietStartPickerVisible(true);
                      }}
                      activeOpacity={0.6}
                      hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                    >
                      <Text
                        className="text-base font-heading"
                        style={{ color: theme.brand.primary }}
                      >
                        Thay đổi
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Modal
                  visible={quietStartPickerVisible}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setQuietStartPickerVisible(false)}
                >
                  <Pressable
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
                    onPress={() => setQuietStartPickerVisible(false)}
                  />
                  <View
                    style={{
                      backgroundColor: theme.background.surface,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      paddingBottom: insets.bottom + 16,
                    }}
                  >
                    <View
                      className="flex-row items-center justify-between px-4"
                      style={{ paddingTop: 16, paddingBottom: 8 }}
                    >
                      <TouchableOpacity
                        onPress={() => setQuietStartPickerVisible(false)}
                        hitSlop={12}
                        activeOpacity={0.6}
                      >
                        <View
                          style={{
                            backgroundColor: theme.background.page,
                            borderRadius: 99,
                            padding: 6,
                          }}
                        >
                          <X size={18} color={theme.icon.primary} />
                        </View>
                      </TouchableOpacity>
                      <Text
                        className="text-base font-heading"
                        style={{ color: theme.text.primary }}
                      >
                        Chọn thời gian
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          markDirty(setQuietHoursStart)(dateToTimeString(tempQuietStart));
                          setQuietStartPickerVisible(false);
                        }}
                        hitSlop={12}
                        activeOpacity={0.6}
                      >
                        <Text
                          className="text-base font-heading"
                          style={{ color: theme.brand.primary }}
                        >
                          Xong
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: "center", width: "100%" }}>
                      <DateTimePicker
                        value={tempQuietStart}
                        mode="time"
                        display="spinner"
                        is24Hour
                        onChange={(_, date) => { if (date) setTempQuietStart(date); }}
                        style={{ height: 216 }}
                      />
                    </View>
                  </View>
                </Modal>

                {/* Kết thúc */}
                <View className="rounded-2xl px-4 py-4" style={cardStyle}>
                  <View className="flex-row items-center justify-between">
                    <View style={{ gap: 2 }}>
                      <Text
                        className="text-sm font-heading"
                        style={{ color: theme.text.secondary }}
                      >
                        Kết thúc
                      </Text>
                      <Text
                        className="text-base font-body"
                        style={{ color: theme.text.primary }}
                      >
                        {quietHoursEnd}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setTempQuietEnd(timeStringToDate(quietHoursEnd));
                        setQuietEndPickerVisible(true);
                      }}
                      activeOpacity={0.6}
                      hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                    >
                      <Text
                        className="text-base font-heading"
                        style={{ color: theme.brand.primary }}
                      >
                        Thay đổi
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Modal
                  visible={quietEndPickerVisible}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setQuietEndPickerVisible(false)}
                >
                  <Pressable
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
                    onPress={() => setQuietEndPickerVisible(false)}
                  />
                  <View
                    style={{
                      backgroundColor: theme.background.surface,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      paddingBottom: insets.bottom + 16,
                    }}
                  >
                    <View
                      className="flex-row items-center justify-between px-4"
                      style={{ paddingTop: 16, paddingBottom: 8 }}
                    >
                      <TouchableOpacity
                        onPress={() => setQuietEndPickerVisible(false)}
                        hitSlop={12}
                        activeOpacity={0.6}
                      >
                        <View
                          style={{
                            backgroundColor: theme.background.page,
                            borderRadius: 99,
                            padding: 6,
                          }}
                        >
                          <X size={18} color={theme.icon.primary} />
                        </View>
                      </TouchableOpacity>
                      <Text
                        className="text-base font-heading"
                        style={{ color: theme.text.primary }}
                      >
                        Chọn thời gian
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          markDirty(setQuietHoursEnd)(dateToTimeString(tempQuietEnd));
                          setQuietEndPickerVisible(false);
                        }}
                        hitSlop={12}
                        activeOpacity={0.6}
                      >
                        <Text
                          className="text-base font-heading"
                          style={{ color: theme.brand.primary }}
                        >
                          Xong
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: "center", width: "100%" }}>
                      <DateTimePicker
                        value={tempQuietEnd}
                        mode="time"
                        display="spinner"
                        is24Hour
                        onChange={(_, date) => { if (date) setTempQuietEnd(date); }}
                        style={{ height: 216 }}
                      />
                    </View>
                  </View>
                </Modal>
              </>
            )}
          </View>
        </ScreenAsyncView>
      </ScrollView>
    </View>
  );
}
