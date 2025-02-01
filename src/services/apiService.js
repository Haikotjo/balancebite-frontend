import { Interceptor } from "./authInterceptor";
import { roundNutrientValues } from "../utils/helpers/roundNutrientValues";
import axios from "axios";

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

// API functies
export const registerUserApi = async (data) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_AUTH_REGISTER_ENDPOINT}`;
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Registration failed.");
        }

        return await response.json();
    } catch (error) {
        console.error("[API Error]:", error);
        throw error;
    }
};

export const addMealToFavoritesApi = async (mealId, token) => {
    const endpoint = `${import.meta.env.VITE_ADD_MEAL_ENDPOINT}/${mealId}`;
    try {
        const response = await Interceptor.patch(endpoint, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const removeMealFromFavoritesApi = async (mealId, token) => {
    const endpoint = `${import.meta.env.VITE_REMOVE_MEAL_ENDPOINT}/${mealId}`;
    try {
        const response = await Interceptor.delete(endpoint, {
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
        const response = await Interceptor.get(endpoint);
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
        const response = await Interceptor.get(endpoint, {
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
        const response = await Interceptor.get(endpoint);
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
        const response = await Interceptor.get(endpoint);
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const createMealApi = async (formData) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CREATE_MEAL_ENDPOINT}`;
    const token = localStorage.getItem("accessToken");

    if (!token) {
        throw new Error("No access token available.");
    }

    try {
        const response = await Interceptor.post(endpoint, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const getAllFoodItems = async () => {
    const response = await Interceptor.get(`${import.meta.env.VITE_BASE_URL}/fooditems`);
    return response.data;
};

export const searchFoodItemsByName = async (prefix) => {
    const response = await Interceptor.get(`${import.meta.env.VITE_BASE_URL}/fooditems/search-by-name?prefix=${prefix}`);
    return response.data;
};


//  FetchUserProfile API-functie
export const fetchUserProfile = async (token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}/users/profile`;

    try {
        const response = await Interceptor.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        logResponse(response);

        const data = response.data;

        if (Object.keys(data).length === 0) {
            console.warn("No user profile found.");
            return null; // Geen profieldata aanwezig
        }

        return data; // Retourneer de profieldata
    } catch (error) {
        logError(error);
        throw error; // Hergooi de fout om ermee om te gaan in de aanroepende code
    }
};

export const updateUserDetails = async (data) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}/users/details`; // Controleer deze URL
    try {
        const response = await Interceptor.put(endpoint, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const fetchRecommendedNutritionApi = async (token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_DAILY_RDI_ENDPOINT}`;

    try {
        const response = await Interceptor.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        logResponse(response);

        if (response && response.data) {
            return roundNutrientValues(response.data); // Rond nutrient-waarden af
        } else {
            console.warn("No data received for recommended nutrition.");
            return null;
        }
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const fetchBaseNutritionApi = async (token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_RDI_ENDPOINT}`;

    try {
        const response = await Interceptor.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        logResponse(response);

        if (response && response.data) {
            return roundNutrientValues(response.data); // Rond nutrient-waarden af
        } else {
            console.warn("No data received for BaseRDI.");
            return null;
        }
    } catch (error) {
        logError(error);
        throw error;
    }
};


export const consumeMealApi = async (mealId, token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CONSUME_MEAL_ENDPOINT}/${mealId}`;
    try {
        const response = await Interceptor.post(endpoint, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        logResponse(response);
        return response.data; // Retourneer de overgebleven dagelijkse intake
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const updateUserInfoApi = async (data) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_UPDATE_USER_INFO_ENDPOINT}`;

    try {
        const response = await Interceptor.patch(endpoint, data);

        // ✅ Forceer een nieuw access token met de refresh token
        await refreshAccessToken();

        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};


// ✅ Nieuwe functie om de refresh token flow te starten
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        console.error("[DEBUG] No refresh token found.");
        return;
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, { refreshToken });
        console.log("[DEBUG] New access token received:", response.data.accessToken);

        localStorage.setItem("accessToken", response.data.accessToken);
    } catch (error) {
        console.error("[DEBUG] Failed to refresh access token:", error);
    }
};


export const fetchSortedMeals = async (sortField, sortOrder = "desc") => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SORT_MEALS_ENDPOINT}?sortField=${sortField}&sortOrder=${sortOrder}`;

    try {
        const response = await Interceptor.get(endpoint);
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};
