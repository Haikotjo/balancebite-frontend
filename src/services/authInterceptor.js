import axios from "axios";

// Create an Axios instance with default configuration
export const Interceptor = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Refresh token endpoint
const REFRESH_ENDPOINT = `${import.meta.env.VITE_BASE_URL}/auth/refresh`;
let isRefreshing = false;
let failedQueue = [];

/**
 * Processes the queue of failed requests during token refresh.
 * If a new token is received, it retries the queued requests with the updated token.
 *
 * @param {Error|null} error - Error encountered during refresh (if any).
 * @param {string|null} token - New access token (if available).
 */
const processQueue = (error, token = null) => {
    console.log("[DEBUG] Processing queue with token:", token, "and error:", error);
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
 * Axios response interceptor to handle authentication errors.
 * If a request fails due to a 401 (Unauthorized) error, it attempts to refresh the token and retry the request.
 */
Interceptor.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("[DEBUG] Response error detected:", error);
        console.log("[DEBUG] Failed request URL:", error.config?.url);
        console.log("[DEBUG] Error response data:", error.response?.data);

        const originalRequest = error.config;

        // Check if the error is due to an expired token
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                console.log("[DEBUG] Token refresh in progress. Adding request to queue.");
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        console.log("[DEBUG] Retrying original request with new token:", token);
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return Interceptor(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log("[DEBUG] Attempting to refresh token...");
                const refreshToken = localStorage.getItem("refreshToken");
                console.log("[DEBUG] Using refresh token:", refreshToken);

                if (!refreshToken) {
                    console.error("[DEBUG] No refresh token found in localStorage.");
                    throw new Error("No refresh token available.");
                }

                const { data } = await axios.post(REFRESH_ENDPOINT, { refreshToken }, {
                    headers: { "Content-Type": "application/json" },
                });
                console.log("[DEBUG] Token refreshed successfully. New access token:", data.accessToken);

                // Store the new access token
                localStorage.setItem("accessToken", data.accessToken);
                Interceptor.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
                processQueue(null, data.accessToken);

                return Interceptor(originalRequest);
            } catch (err) {
                console.error("[DEBUG] Failed to refresh token:", err);
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

/**
 * Axios request interceptor to automatically attach the access token to requests.
 * Also removes the "Content-Type" header when sending FormData.
 */
Interceptor.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            console.log("[DEBUG] Adding Authorization header with token:", token);
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        // Remove explicit Content-Type header for FormData requests
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
            console.log("[DEBUG] FormData detected. Content-Type header removed.");
        }

        return config;
    },
    (error) => {
        console.error("[DEBUG] Error in request interceptor:", error);
        return Promise.reject(error);
    }
);

export default Interceptor;
