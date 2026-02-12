import { useAuthStore } from "@/stores/auth-store";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ auth store
    const token = useAuthStore.getState().token;

    // Các endpoint không cần token
    const publicEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
    ];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint),
    );

    if (token) {
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

// Response interceptor - xử lý response và errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          console.error(
            "Unauthorized - Token expired or invalid, forcing logout",
          );

          const { logout } = useAuthStore.getState();
          logout();
          break;
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

// Export các helper functions
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
