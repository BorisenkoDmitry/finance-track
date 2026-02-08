import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: "/api/",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    const auth = token ? `Bearer ${JSON.parse(token)} 2` : "";
    config.headers.Authorization = auth;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => response, // Успешный ответ — просто возвращаем
  (error) => {
    if (error.response?.status === 401) {
      // Обработка ошибки 401 Unauthorized
      console.warn("Unauthorized: токен недействителен или отсутствует");

      // Варианты действий:
      // 1. Очистить токен
      localStorage.removeItem("token");

      // 2. Перенаправить на страницу входа
      // window.location.href = "/auth/login";

      // 3. Показать уведомление пользователю
      if (window.location.pathname != "/auth/login") {
        toast.error("Требуется авторизация. Пожалуйста, войдите в систему.");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }

      // 4. Отклонить промис с конкретным сообщением
      return Promise.reject({
        ...error,
        message: "Требуется авторизация",
        isUnauthorized: true,
      });
    }

    // Для других ошибок — просто отклоняем
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
