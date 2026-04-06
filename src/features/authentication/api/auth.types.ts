/**
 * Thông tin thiết bị gửi lên server khi đăng nhập.
 * Dùng để server ghi nhận phiên đăng nhập theo từng thiết bị,
 * hỗ trợ tính năng quản lý phiên và gửi push notification.
 */
export interface DeviceInfo {
  deviceType?: string; // mobile, desktop, tablet
  os?: string; // iOS 17.2, Android 14, Windows 11
  browser?: string; // Chrome, Safari, Firefox
  appVersion?: string; // App version for mobile
  deviceModel?: string; // iPhone 15, Samsung S24
  pushToken?: string; // FCM/APNS token
}

/** Tham số gửi lên API khi đăng nhập. */
export interface LoginRequest {
  email: string;
  password: string;
  deviceInfo?: DeviceInfo;
}

/** Thông tin người dùng trả về từ server sau khi đăng nhập hoặc xác thực token. */
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;   // Vai trò: "LEARNER" là học viên, các role khác không được phép dùng app
  status: string;
}

/** Dữ liệu trả về trong phần `data` của response đăng nhập thành công. */
export interface LoginData {
  accessToken: string;   // JWT dùng để xác thực các request tiếp theo
  refreshToken: string;  // Token dùng để lấy accessToken mới khi hết hạn
  tokenType: string;     // Thường là "Bearer"
  expiresIn: number;     // Thời gian hết hạn của accessToken (giây)
  user: User;
}

/** Response hoàn chỉnh từ API đăng nhập. */
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

export interface ChangePasswordRequest {
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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
}

/** Tham số xác thực mã OTP để đặt lại mật khẩu. */
export interface VerifyOTPRequest {
  email: string;
  otp: string; // Mã 6 chữ số được gửi về email
}

/** Dữ liệu trả về trong phần `data` của response xác thực OTP thành công. */
export interface VerifyOTPData {
  resetToken: string;      // Token tạm thời dùng để đặt lại mật khẩu
  expiresInSeconds: number;
  email: string;
}

/** Response khi xác thực OTP thành công. */
export interface VerifyOTPResponse {
  success: boolean;
  code: string;
  message: string;
  data: VerifyOTPData;
  timestamp: string;
}

export interface ResendOTPRequest {
  email: string;
}

export interface ResendOTPResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
}
