export interface RegisterDeviceTokenParams {
  fcmToken: string;
  deviceType: "android" | "ios";
  deviceName?: string;
  appVersion?: string;
}

export interface RegisterDeviceTokenResponse {
  success: boolean;
  message?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}
