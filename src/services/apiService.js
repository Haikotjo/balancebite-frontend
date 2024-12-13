import axios from "axios";
import { setupAuthInterceptor } from "./authInterceptor"; // Importeer de interceptor

// Maak een axios instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // Basis-URL uit .env
    headers: {
        "Content-Type": "application/json",
    },
});

// Koppel de interceptor
setupAuthInterceptor(apiClient);

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

export const registerUserApi = async (formData) => {
    const endpoint = import.meta.env.VITE_AUTH_REGISTER_ENDPOINT || "/auth/register";
    try {
        const response = await apiClient.post(endpoint, formData);
        console.log("[API] Registration successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("[API Error] Registration failed:", error.response?.data?.error || error.message);
        throw error;
    }
};


export const refreshAccessTokenApi = async (refreshToken) => {
    const endpoint = import.meta.env.VITE_AUTH_REFRESH_ENDPOINT || "/auth/refresh";
    const fullEndpoint = `${import.meta.env.VITE_BASE_URL}${endpoint}`;
    try {
        console.log("[API] Verstuur refresh-token call naar endpoint:", fullEndpoint);
        console.log("[API] Refresh token meegegeven:", refreshToken);

        // Gebruik fetch voor tokenverversing
        const fetchResponse = await fetch(fullEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
        console.log("[API] Fetch response status:", fetchResponse.status);

        if (!fetchResponse.ok) {
            throw new Error(`[API] Fetch-call naar ${fullEndpoint} mislukt met status: ${fetchResponse.status}`);
        }

        const fetchData = await fetchResponse.json();
        console.log("[API] Fetch response data:", fetchData);

        return fetchData; // Gebruik fetch-resultaat
    } catch (fetchError) {
        console.error("[API] Fetch-call mislukt:", fetchError.message);
        throw fetchError; // Throw om consistent gedrag te behouden
    }
};


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

export default apiClient;
