export interface DeviceInfo {
  deviceType?: string; // mobile, desktop, tablet
  os?: string; // iOS 17.2, Android 14, Windows 11
  browser?: string; // Chrome, Safari, Firefox
  appVersion?: string; // App version for mobile
  deviceModel?: string; // iPhone 15, Samsung S24
  pushToken?: string; // FCM/APNS token
}

export interface LoginParams {
  email: string;
  password: string;
  deviceInfo?: DeviceInfo;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  code: string;
  message: string;
  data: LoginData;
  timestamp: string;
}

export interface LogoutResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  logoutOtherDevices?: boolean;
}

export interface ChangePasswordResponse {
  success: boolean;
  code: string;
  message: string;
  data: null;
}
