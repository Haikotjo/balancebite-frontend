import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correcte import

// Maak een axios instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // Basis-URL uit .env
    headers: {
        "Content-Type": "application/json",
    },
});

// Logging helpers
const logResponse = (response) => {
    console.log(`[API] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
};

const logError = (error) => {
    if (error.response) {
        console.error(`[API Error] ${error.response.status}: ${error.response.data?.error || error.message}`);
    } else if (error.request) {
        console.error(`[API Error] No response: ${error.message}`);
    } else {
        console.error(`[API Error] ${error.message}`);
    }
};

// Voeg een Axios-interceptor toe voor automatische tokenvernieuwing
let isRefreshing = false; // Zorgt ervoor dat de token slechts één keer wordt vernieuwd
let subscribers = []; // Houdt bij welke verzoeken wachten op een nieuwe token

// Voeg de request-interceptor toe
apiClient.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            console.warn("[API] Geen toegangstoken gevonden. Verzoek gaat door zonder autorisatie.");
            return config;
        }

        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp - currentTime < 60) {
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    console.log("[API] Token bijna verlopen. Start verversing.");
                    const refreshToken = localStorage.getItem("refreshToken");

                    if (!refreshToken) {
                        throw new Error("Geen refresh-token beschikbaar.");
                    }

                    const response = await refreshAccessTokenApi(refreshToken);
                    const newToken = response?.accessToken;

                    if (!newToken) {
                        throw new Error("Geen nieuw toegangstoken ontvangen.");
                    }

                    localStorage.setItem("accessToken", newToken);
                    console.log("[API] Nieuw token opgeslagen:", newToken);

                    subscribers.forEach((callback) => callback(newToken));
                    subscribers = [];
                } catch (error) {
                    console.error("[API] Tokenverversing mislukt:", error.message);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    throw error;
                } finally {
                    isRefreshing = false;
                }
            }

            return new Promise((resolve) => {
                subscribers.push((newToken) => {
                    config.headers.Authorization = `Bearer ${newToken}`;
                    console.log("Updated Authorization header:", config.headers.Authorization);
                    resolve(config);
                });
            });
        }

        config.headers.Authorization = `Bearer ${token}`;
        console.log("Authorization header:", config.headers.Authorization);
        return config;
    },
    (error) => Promise.reject(error)
);




// API functies
export const addMealToFavoritesApi = async (mealId, token) => {
    const endpoint = `${import.meta.env.VITE_ADD_MEAL_ENDPOINT}/${mealId}`;
    try {
        const response = await apiClient.patch(endpoint, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const fetchMeals = async (endpoint) => {
    try {
        const response = await apiClient.get(endpoint);
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const fetchUserMeals = async (token) => {
    const endpoint = import.meta.env.VITE_USER_MEALS_ENDPOINT || "/users/meals";
    try {
        const response = await apiClient.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
        });
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const fetchMealById = async (mealId) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}/meals/${mealId}`;
    try {
        const response = await apiClient.get(endpoint);
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const fetchMealNutrientsById = async (mealId) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}/meals/nutrients/${mealId}`;
    try {
        const response = await apiClient.get(endpoint);
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const loginApi = async (email, password) => {
    const endpoint = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || "/auth/login";
    try {
        const response = await apiClient.post(endpoint, { email, password });
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const logoutApi = async (token) => {
    const endpoint = import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT || "/auth/logout";
    try {
        const response = await apiClient.post(
            endpoint,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            }
        );
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const refreshAccessTokenApi = async (refreshToken) => {
    const endpoint = import.meta.env.VITE_AUTH_REFRESH_ENDPOINT || "/auth/refresh";
    try {
        const response = await apiClient.post(endpoint, { refreshToken });
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export default apiClient;
