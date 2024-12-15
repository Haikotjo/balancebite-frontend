import axios from "axios";

export const Interceptor = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // Zorg dat deze waarde juist is
    headers: {
        "Content-Type": "application/json",
    },
});

// Voeg je tokens op in de localStorage of een andere veilige opslag
const REFRESH_ENDPOINT = `${import.meta.env.VITE_BASE_URL}/auth/refresh`;
let isRefreshing = false;
let failedQueue = [];

// Helper-functie om mislukte verzoeken in wachtrij te plaatsen
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

// Interceptor voor response errors
Interceptor.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("[DEBUG] Response error detected:", error);
        const originalRequest = error.config;

        // Check als het een token-verlopen fout is
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

                // Sla het nieuwe token op
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

// Interceptor om automatisch tokens toe te voegen aan uitgaande requests
Interceptor.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            console.log("[DEBUG] Adding Authorization header with token:", token);
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        // Verwijder expliciete Content-Type header voor FormData
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
