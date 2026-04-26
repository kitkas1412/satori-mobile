import {
  IconButton,
  ScreenAsyncView,
  ScreenHeader,
} from "@/components/ui";
import { TimePickerModal } from "@/features/setting/components";
import {
  dateToTimeString,
  useNotificationSettings,
  useNotificationSettingsForm,
  useUpdateNotificationSettings,
} from "@/features/setting/hooks";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function NotificationSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { data: prefs, isLoading, isError } = useNotificationSettings();
  const { mutate: updatePrefs } = useUpdateNotificationSettings();

  const form = useNotificationSettingsForm({ prefs, mutate: updatePrefs });

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
            <Text className="font-heading text-base" style={{ color: theme.text.primary }}>
              Kênh thông báo
            </Text>

            <View className="rounded-2xl px-4 py-4" style={cardStyle}>
              <View className="flex-row items-center justify-between">
                <Text className="font-body text-base" style={{ color: theme.text.primary }}>
                  Thông báo đẩy
                </Text>
                <Switch value={form.pushEnabled} onValueChange={form.setPushEnabled} {...switchProps} />
              </View>
            </View>

            <View className="rounded-2xl px-4 py-4" style={cardStyle}>
              <View className="flex-row items-center justify-between">
                <Text className="font-body text-base" style={{ color: theme.text.primary }}>
                  Thông báo email
                </Text>
                <Switch value={form.emailEnabled} onValueChange={form.setEmailEnabled} {...switchProps} />
              </View>
            </View>
          </View>

          {/* Section 2: Nhắc nhở hàng ngày */}
          <View style={{ gap: 8 }}>
            <Text className="font-heading text-base" style={{ color: theme.text.primary }}>
              Nhắc nhở hàng ngày
            </Text>

            <View className="rounded-2xl px-4 py-4" style={cardStyle}>
              <View className="flex-row items-center justify-between">
                <Text className="font-body text-base" style={{ color: theme.text.primary }}>
                  Bật nhắc nhở hàng ngày
                </Text>
                <Switch
                  value={form.dailyReminderEnabled}
                  onValueChange={form.setDailyReminderEnabled}
                  {...switchProps}
                />
              </View>
            </View>

            {form.dailyReminderEnabled && (
              <>
                <View className="rounded-2xl px-4 py-4" style={cardStyle}>
                  <View className="flex-row items-center justify-between">
                    <View style={{ gap: 2 }}>
                      <Text className="text-sm font-heading" style={{ color: theme.text.secondary }}>
                        Giờ nhắc nhở
                      </Text>
                      <Text className="text-base font-body" style={{ color: theme.text.primary }}>
                        {form.dailyReminderTime}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        form.setTempTime(new Date(form.tempTime));
                        form.setTimePickerVisible(true);
                      }}
                      activeOpacity={0.6}
                      hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                    >
                      <Text className="text-base font-heading" style={{ color: theme.brand.primary }}>
                        Thay đổi
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TimePickerModal
                  visible={form.timePickerVisible}
                  title="Chọn thời gian"
                  value={form.tempTime}
                  onChange={form.setTempTime}
                  onClose={() => form.setTimePickerVisible(false)}
                  onConfirm={() => {
                    form.setDailyReminderTime(dateToTimeString(form.tempTime));
                    form.setTimePickerVisible(false);
                  }}
                />
              </>
            )}
          </View>

          {/* Section 3: Loại thông báo */}
          <View style={{ gap: 8 }}>
            <Text className="font-heading text-base" style={{ color: theme.text.primary }}>
              Loại thông báo
            </Text>

            {[
              {
                label: "Bài tập & kiểm tra",
                value: form.assignmentNotifications,
                onChange: form.setAssignmentNotifications,
              },
              {
                label: "Thành tích",
                value: form.achievementNotifications,
                onChange: form.setAchievementNotifications,
              },
              {
                label: "Lớp học",
                value: form.classNotifications,
                onChange: form.setClassNotifications,
              },
            ].map((item) => (
              <View key={item.label} className="rounded-2xl px-4 py-4" style={cardStyle}>
                <View className="flex-row items-center justify-between">
                  <Text className="font-body text-base" style={{ color: theme.text.primary }}>
                    {item.label}
                  </Text>
                  <Switch value={item.value} onValueChange={item.onChange} {...switchProps} />
                </View>
              </View>
            ))}
          </View>

          {/* Section 4: Giờ yên tĩnh */}
          <View style={{ gap: 8 }}>
            <Text className="font-heading text-base" style={{ color: theme.text.primary }}>
              Giờ yên tĩnh
            </Text>

            <View className="rounded-2xl px-4 py-4" style={cardStyle}>
              <View className="flex-row items-center justify-between">
                <Text className="font-body text-base" style={{ color: theme.text.primary }}>
                  Bật giờ yên tĩnh
                </Text>
                <Switch
                  value={form.quietHoursEnabled}
                  onValueChange={form.setQuietHoursEnabled}
                  {...switchProps}
                />
              </View>
            </View>

            {form.quietHoursEnabled && (
              <>
                <View className="rounded-2xl px-4 py-4" style={cardStyle}>
                  <View className="flex-row items-center justify-between">
                    <View style={{ gap: 2 }}>
                      <Text className="text-sm font-heading" style={{ color: theme.text.secondary }}>
                        Bắt đầu
                      </Text>
                      <Text className="text-base font-body" style={{ color: theme.text.primary }}>
                        {form.quietHoursStart}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        form.setTempQuietStart(new Date(form.tempQuietStart));
                        form.setQuietStartPickerVisible(true);
                      }}
                      activeOpacity={0.6}
                      hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                    >
                      <Text className="text-base font-heading" style={{ color: theme.brand.primary }}>
                        Thay đổi
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TimePickerModal
                  visible={form.quietStartPickerVisible}
                  title="Chọn thời gian"
                  value={form.tempQuietStart}
                  onChange={form.setTempQuietStart}
                  onClose={() => form.setQuietStartPickerVisible(false)}
                  onConfirm={() => {
                    form.setQuietHoursStart(dateToTimeString(form.tempQuietStart));
                    form.setQuietStartPickerVisible(false);
                  }}
                />

                <View className="rounded-2xl px-4 py-4" style={cardStyle}>
                  <View className="flex-row items-center justify-between">
                    <View style={{ gap: 2 }}>
                      <Text className="text-sm font-heading" style={{ color: theme.text.secondary }}>
                        Kết thúc
                      </Text>
                      <Text className="text-base font-body" style={{ color: theme.text.primary }}>
                        {form.quietHoursEnd}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        form.setTempQuietEnd(new Date(form.tempQuietEnd));
                        form.setQuietEndPickerVisible(true);
                      }}
                      activeOpacity={0.6}
                      hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                    >
                      <Text className="text-base font-heading" style={{ color: theme.brand.primary }}>
                        Thay đổi
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TimePickerModal
                  visible={form.quietEndPickerVisible}
                  title="Chọn thời gian"
                  value={form.tempQuietEnd}
                  onChange={form.setTempQuietEnd}
                  onClose={() => form.setQuietEndPickerVisible(false)}
                  onConfirm={() => {
                    form.setQuietHoursEnd(dateToTimeString(form.tempQuietEnd));
                    form.setQuietEndPickerVisible(false);
                  }}
                />
              </>
            )}
          </View>
        </ScreenAsyncView>
      </ScrollView>
    </View>
  );
}
