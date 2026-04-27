import type { UpdateNotificationSettingsRequest } from "@/features/setting/api";
import type { NotificationSettings } from "@/features/setting/api";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";

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

export function dateToTimeString(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

const TIME_RE = /^\d{2}:\d{2}$/;

interface UseNotificationSettingsFormParams {
  prefs: NotificationSettings | undefined;
  mutate: (data: Partial<UpdateNotificationSettingsRequest>) => void;
}

export function useNotificationSettingsForm({
  prefs,
  mutate,
}: UseNotificationSettingsFormParams) {
  const navigation = useNavigation();

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

  const isDirtyRef = useRef(false);

  function markDirty<T>(setter: React.Dispatch<React.SetStateAction<T>>) {
    return (value: React.SetStateAction<T>) => {
      isDirtyRef.current = true;
      setter(value);
    };
  }

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

  const mutateRef = useRef(mutate);
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

  useEffect(() => { mutateRef.current = mutate; }, [mutate]);
  useEffect(() => { prefsRef.current = prefs; }, [prefs]);
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
    pushEnabled, emailEnabled, dailyReminderEnabled, dailyReminderTime,
    assignmentNotifications, achievementNotifications, classNotifications,
    quietHoursEnabled, quietHoursStart, quietHoursEnd,
  ]);

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

  return {
    pushEnabled, setPushEnabled: markDirty(setPushEnabled),
    emailEnabled, setEmailEnabled: markDirty(setEmailEnabled),
    dailyReminderEnabled, setDailyReminderEnabled: markDirty(setDailyReminderEnabled),
    dailyReminderTime, setDailyReminderTime: markDirty(setDailyReminderTime),
    assignmentNotifications, setAssignmentNotifications: markDirty(setAssignmentNotifications),
    achievementNotifications, setAchievementNotifications: markDirty(setAchievementNotifications),
    classNotifications, setClassNotifications: markDirty(setClassNotifications),
    quietHoursEnabled, setQuietHoursEnabled: markDirty(setQuietHoursEnabled),
    quietHoursStart, setQuietHoursStart: markDirty(setQuietHoursStart),
    quietHoursEnd, setQuietHoursEnd: markDirty(setQuietHoursEnd),
    timePickerVisible, setTimePickerVisible,
    tempTime, setTempTime,
    quietStartPickerVisible, setQuietStartPickerVisible,
    tempQuietStart, setTempQuietStart,
    quietEndPickerVisible, setQuietEndPickerVisible,
    tempQuietEnd, setTempQuietEnd,
  };
}
