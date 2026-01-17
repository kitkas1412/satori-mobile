import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Cấu hình base URL - có thể thay đổi theo môi trường
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.example.com";

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - thêm token vào header
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: Lấy token từ storage (AsyncStorage, SecureStore, etc.)
    // const token = await getStoredToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log("Request:", config.method?.toUpperCase(), config.url);
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
      // Server đã response nhưng có lỗi status code
      const status = error.response.status;

      switch (status) {
        case 401:
          console.error("Unauthorized - Token hết hạn hoặc không hợp lệ");
          // TODO: Xử lý logout hoặc refresh token
          // await handleLogout();
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
