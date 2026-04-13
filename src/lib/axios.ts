import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth-store";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 180000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Cờ ngăn nhiều request cùng lúc đều thử refresh token.
 * Khi một request đang refresh, các request khác bị 401 sẽ được enqueue
 * và chờ kết quả của lần refresh đó.
 */
let isRefreshing = false;

/**
 * Hàng đợi các request bị 401 trong khi đang refresh token.
 * Khi refresh xong, tất cả request trong queue sẽ được retry với token mới.
 */
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

/**
 * Giải quyết tất cả request đang chờ trong hàng đợi.
 * @param error Nếu có lỗi (refresh thất bại), reject tất cả. Nếu null, resolve với token mới.
 */
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

/**
 * Request interceptor: tự động đính kèm accessToken vào header Authorization
 * cho tất cả request đến các endpoint cần xác thực.
 * Các public endpoint (login, register, v.v.) được bỏ qua.
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ auth store
    const token = useAuthStore.getState().token;

    // Các endpoint không cần token
    const publicEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/refresh",
    ];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint),
    );

    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Request:",
        config.method?.toUpperCase(),
        config.url,
        "- Token attached",
      );
    } else if (!isPublicEndpoint) {
      console.log(
        "Request:",
        config.method?.toUpperCase(),
        config.url,
        "- No token found",
      );
    } else {
      console.log(
        "Request:",
        config.method?.toUpperCase(),
        config.url,
        "- Public endpoint",
      );
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

/**
 * Response interceptor: xử lý lỗi HTTP và tự động làm mới token khi hết hạn.
 *
 * Logic xử lý lỗi 401 (Unauthorized):
 * 1. Nếu chính request `/auth/refresh` bị 401 -> refresh token hết hạn -> logout ngay.
 * 2. Nếu đang có request khác đang refresh → enqueue request hiện tại để retry sau.
 * 3. Nếu không có refreshToken -> logout ngay.
 * 4. Trường hợp thông thường: gọi `/auth/refresh`, lưu token mới, retry request gốc.
 *    Đồng thời, resolve toàn bộ request trong failedQueue với token mới.
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean; // Đánh dấu request đã được retry một lần để tránh vòng lặp vô hạn
    };

    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Nếu chính request refresh bị 401 → refresh token hết hạn, logout ngay
        if (originalRequest.url?.includes("/auth/refresh")) {
          console.error("Refresh token expired, logging out");
          useAuthStore.getState().logout();
          queryClient.clear();
          return Promise.reject(error);
        }

        // Nếu đang refresh → enqueue request, chờ token mới
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          });
        }

        // Không có refreshToken → logout ngay
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          console.error("No refresh token available, logging out");
          useAuthStore.getState().logout();
          queryClient.clear();
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await axiosInstance.post("/auth/refresh", {
            refreshToken,
          });
          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;

          useAuthStore.getState().setToken(accessToken);
          useAuthStore.getState().setRefreshToken(newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);

          console.log(
            "Token refreshed successfully, retrying original request",
          );
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          useAuthStore.getState().logout();
          queryClient.clear();
          console.error("Token refresh failed, logging out");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      switch (status) {
        case 403:
          console.error("Forbidden - Không có quyền truy cập");
          break;
        case 404:
          console.error("Not Found - API endpoint không tồn tại");
          break;
        case 500:
          console.error("Internal Server Error");
          break;
        default:
          console.error("API Error:", status, error.response.data);
      }
    } else if (error.code === "ECONNABORTED") {
      // Request timeout - server không phản hồi trong thời gian cho phép
      console.error("Timeout Error - Request quá thời gian chờ");
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được response
      console.error("Network Error - Không thể kết nối đến server");
    } else {
      // Lỗi khác
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

/**
 * Helper object bọc axiosInstance để có type inference tốt hơn.
 * Sử dụng `api.get<T>()`, `api.post<T>()`, v.v. thay vì axiosInstance trực tiếp
 * để đảm bảo response được type đúng.
 */
export const api = {
  get: <T = any>(url: string, config?: any) =>
    axiosInstance.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: any) =>
    axiosInstance.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: any) =>
    axiosInstance.put<T>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: any) =>
    axiosInstance.patch<T>(url, data, config),

  delete: <T = any>(url: string, config?: any) =>
    axiosInstance.delete<T>(url, config),
};
