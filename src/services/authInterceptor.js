import { refreshAccessTokenApi } from "./apiService.js";
import { jwtDecode } from "jwt-decode";

let isRefreshing = false;
let subscribers = [];

export const setupAuthInterceptor = (apiClient) => {
    apiClient.interceptors.request.use(async (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const decoded = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp - currentTime < 60) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    const refreshToken = localStorage.getItem("refreshToken");
                    const newToken = await refreshAccessTokenApi(refreshToken);
                    localStorage.setItem("accessToken", newToken);

                    subscribers.forEach((callback) => callback(newToken));
                    subscribers = [];
                    isRefreshing = false;
                }

                return new Promise((resolve) => {
                    subscribers.push((newToken) => {
                        config.headers.Authorization = `Bearer ${newToken}`;
                        resolve(config);
                    });
                });
            }

            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};
