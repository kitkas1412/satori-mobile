export interface NotificationSettings {
  id: string;
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  assignmentNotifications: boolean;
  achievementNotifications: boolean;
  socialNotifications: boolean;
  marketingNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export type UpdateNotificationSettingsRequest = Omit<NotificationSettings, "id" | "userId">;
