import type { User } from "@/types/api";

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
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
