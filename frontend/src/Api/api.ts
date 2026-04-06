import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (token) p.resolve(token);
    else p.reject(error);
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      } catch {
        localStorage.removeItem("token");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try refresh for auth endpoints
      if (
        originalRequest.url?.includes("auth/login") ||
        originalRequest.url?.includes("auth/refresh") ||
        originalRequest.url?.includes("auth/register")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        silentLogout();
        return Promise.reject(error);
      }

      try {
        let tokenValue: string;
        try {
          tokenValue = JSON.parse(refreshToken);
        } catch {
          tokenValue = refreshToken;
        }

        const res = await axios.post("/api/auth/refresh", {
          refreshToken: tokenValue,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data;
        localStorage.setItem("token", JSON.stringify(accessToken));
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", JSON.stringify(newRefreshToken));
        }

        isRefreshing = false;
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        processQueue(refreshErr, null);
        silentLogout();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

function silentLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  if (
    window.location.pathname !== "/auth/login" &&
    window.location.pathname !== "/"
  ) {
    window.location.href = "/auth/login";
  }
}

export default axiosInstance;
