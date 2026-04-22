// src/services/authInterceptor.js
import axios from "axios";

// Create Axios instance
export const Interceptor = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
    timeout: 15000,
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
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
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
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
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
        }

        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default Interceptor;
