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

// Voeg een maaltijd toe aan favorieten
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

// Haal maaltijden op
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

// Haal de maaltijden van een gebruiker op
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

// Login API
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

// Logout API
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

// Refresh Access Token API
export const refreshAccessTokenApi = async (refreshToken) => {
    const endpoint = import.meta.env.VITE_AUTH_REFRESH_ENDPOINT || "/auth/refresh";
    try {
        const response = await apiClient.post(endpoint, { refreshToken });
        logResponse(response);
        return response.data; // Verwacht: { accessToken: "new-token" }
    } catch (error) {
        logError(error);
        throw error;
    }
};

// Voeg een Axios-interceptor toe voor automatische tokenvernieuwing
apiClient.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem("accessToken");

        if (token) {
            const decoded = jwtDecode(token); // Correct gebruik van jwtDecode
            const currentTime = Math.floor(Date.now() / 1000);

            // Controleer of token bijna verloopt (binnen 1 minuut)
            if (decoded.exp - currentTime < 60) {
                console.log("[API] Access token is about to expire. Attempting to refresh.");
                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    const response = await refreshAccessTokenApi(refreshToken);
                    token = response.accessToken;

                    // Update token in localStorage
                    localStorage.setItem("accessToken", token);
                } catch (error) {
                    console.error("[API] Failed to refresh access token. Logging out...");
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    throw error;
                }
            }

            // Voeg (vernieuwd) token toe aan headers
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
