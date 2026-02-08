import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: "/api/",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem("token");
    let token: string | null = raw;
    if (raw) {
      try {
        // token may be stored as JSON string (e.g. "\"abc\"") or plain string ("abc")
        const parsed = JSON.parse(raw) as unknown;
        token = typeof parsed === "string" ? parsed : raw;
      } catch {
        token = raw;
      }
    }
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
