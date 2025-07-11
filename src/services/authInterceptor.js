// src/services/authInterceptor.js
import axios from "axios";

// Create Axios instance
export const Interceptor = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const REFRESH_ENDPOINT = `${import.meta.env.VITE_BASE_URL}/auth/refresh`;
let isRefreshing = false;
let failedQueue = [];

/**
 * Retry queued requests with refreshed token
 */
const processQueue = (error, token = null) => {
    if (import.meta.env.DEV) {
        console.log("[DEBUG] Processing queue with token:", token, "and error:", error);
    }

    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

/**
 * Response interceptor to handle expired access tokens
 */
Interceptor.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (import.meta.env.DEV) {
            console.log("[DEBUG] Response error:", error);
            console.log("[DEBUG] URL:", error.config?.url);
            console.log("[DEBUG] Error data:", error.response?.data);
        }

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                if (import.meta.env.DEV) {
                    console.log("[DEBUG] Refresh already in progress. Queueing request.");
                }

                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return Interceptor(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("No refresh token available.");
                }

                if (import.meta.env.DEV) {
                    console.log("[DEBUG] Attempting refresh with token:", refreshToken);
                }

                const { data } = await axios.post(
                    REFRESH_ENDPOINT,
                    { refreshToken },
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );

                const newAccessToken = data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);
                Interceptor.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);

                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return Interceptor(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

/**
 * Request interceptor to add auth header and clean FormData headers
 */
Interceptor.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
            if (import.meta.env.DEV) {
                console.log("[DEBUG] Authorization header set");
            }
        }

        if (import.meta.env.DEV) {
            console.log("[DEBUG] Requesting:", config.baseURL + config.url);
        }

        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
            if (import.meta.env.DEV) {
                console.log("[DEBUG] FormData detected. Content-Type removed.");
            }
        }

        if (import.meta.env.DEV) {
            console.log("[API REQUEST PARAMS]", {
                url: config.baseURL + config.url,
                params: config.params,
                data: config.data,
                headers: config.headers,
            });
        }

        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
            if (import.meta.env.DEV) {
                console.log("[DEBUG] FormData detected. Content-Type removed.");
            }
        }

        return config;
    },
    (error) => {
        if (import.meta.env.DEV) {
            console.error("[DEBUG] Request error:", error);
        }
        return Promise.reject(error);
    }
);

export default Interceptor;
