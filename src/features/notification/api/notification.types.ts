export interface MarkReadRequest {
  notificationIds: string[];
}

export interface MarkReadResponse {
  success: boolean;
  data: number;
}

export interface RegisterDeviceTokenRequest {
  fcmToken: string;
  deviceType: "ANDROID" | "IOS";
  deviceName?: string;
  appVersion?: string;
}

export interface RegisterDeviceTokenResponse {
  success: boolean;
  message?: string;
}

export interface Content {
  id: string;
  type: string;
  priority: string;
  title: string;
  body: string;
  data: Record<string, object>;
  imageUrl: string | null;
  actionUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  content: Content[];
  number: number;
  size: number;
  last: boolean;
  first: boolean;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  empty: boolean;
  sort: object[];
  pageable: object;
}
