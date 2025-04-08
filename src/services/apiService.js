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
        const token = localStorage.getItem("accessToken"); // Haal token op

        const headers = token
            ? { Authorization: `Bearer ${token}` }
            : {};

        const response = await Interceptor.get(endpoint, { headers });
        // logResponse(response);

        return response.data?.content ?? [];
    } catch (error) {
        logError(error);
        return [];
    }
};


export const fetchUserMeals = async (token) => {
    const endpoint = import.meta.env.VITE_USER_MEALS_ENDPOINT || "/users/meals";
    try {
        const response = await Interceptor.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const fetchMealById = async (mealId) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_MEAL_BY_ID_ENDPOINT}/${mealId}`;
    try {
        const response = await Interceptor.get(endpoint);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const fetchMealNutrientsById = async (mealId) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_MEAL_NUTRIENTS_ENDPOINT}/${mealId}`;
    try {
        const response = await Interceptor.get(endpoint);
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
        // logResponse(response);
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

export const getAllFoodItemNames = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_FOODITEM_NAMES_ENDPOINT}`);
    if (!response.ok) throw new Error("Failed to fetch food item names");
    return await response.json();
};

export const searchFoodItemsByName = async (prefix) => {
    const response = await Interceptor.get(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SEARCH_FOODITEMS_ENDPOINT}?prefix=${prefix}`);
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
        // logResponse(response);

        const data = response.data;

        if (Object.keys(data).length === 0) {
            console.warn("No user profile found.");
            return null;
        }

        return data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const updateUserDetails = async (data) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}/users/details`;
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
        // logResponse(response);

        if (response && response.data) {
            return roundNutrientValues(response.data);
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
        // logResponse(response);

        if (response && response.data) {
            return roundNutrientValues(response.data);
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
        // logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const updateUserInfoApi = async (data) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_UPDATE_USER_INFO_ENDPOINT}`;

    try {
        const response = await Interceptor.patch(endpoint, data);

        await refreshAccessToken();

        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};


const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        console.error("[DEBUG] No refresh token found.");
        return;
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, { refreshToken });
        // console.log("[DEBUG] New access token received:", response.data.accessToken);

        localStorage.setItem("accessToken", response.data.accessToken);
    } catch (error) {
        // console.error("[DEBUG] Failed to refresh access token:", error);
    }
};

export const fetchMealEnums = async () => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_MEAL_ENUMS_ENDPOINT}`;
    try {
        const response = await Interceptor.get(endpoint);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const getAllMealNames = async () => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_MEAL_NAMES_ENDPOINT}`;
    try {
        const response = await Interceptor.get(endpoint);
        return response.data;
    } catch (error) {
        logError(error);
        return [];
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

export const updateMealApi = async (mealId, formData) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_UPDATE_MEAL_ENDPOINT}/${mealId}`;
    const token = localStorage.getItem("accessToken");

    if (!token) {
        throw new Error("No access token available.");
    }

    try {
        const response = await Interceptor.patch(endpoint, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const createFoodItemApi = async (data) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CREATE_FOODITEM_ENDPOINT}`;
    const token = localStorage.getItem("accessToken");

    if (!token) {
        throw new Error("No access token available.");
    }

    try {
        const response = await Interceptor.post(endpoint, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const deleteFoodItemApi = async (id, token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_DELETE_FOODITEM_ENDPOINT}/${id}`;
    try {
        const response = await Interceptor.delete(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    } catch (error) {
        logError(error);
        throw error;
    }
};

// Fetch single food item by FDC ID
export const fetchFoodItemByFdcIdApi = async (fdcId, token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_FETCH_FOODITEM_BY_ID_ENDPOINT}/${fdcId}`;
    const response = await Interceptor.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Bulk fetch multiple food items by FDC IDs
export const fetchFoodItemsBulkApi = async (fdcIds) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_FETCH_FOODITEMS_BULK_ENDPOINT}`;
    const response = await Interceptor.post(endpoint, fdcIds, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const getAllUsersApi = async (token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_GET_ALL_USERS_ENDPOINT}`;
    try {
        const response = await Interceptor.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error("[API Error] Failed to fetch users:", error);
        throw error;
    }
};


export const promoteUserApi = async (data, token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_PROMOTE_USER_ENDPOINT}`;
    try {
        const response = await Interceptor.patch(endpoint, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (error) {
        console.error("[API Error] Failed to promote user:", error);
        throw error;
    }
};

export const deleteUserApi = async (data, token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_DELETE_USER_ENDPOINT}`;
    try {
        const response = await Interceptor.delete(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data,
        });
        return response;
    } catch (error) {
        console.error("[API Error] Failed to delete user:", error);
        throw error;
    }
};


export const createUserAsAdminApi = async (data, token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_CREATE_USER_ENDPOINT}`;
    try {
        const response = await Interceptor.post(endpoint, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (error) {
        console.error("[API Error] Failed to create user as admin:", error);
        throw error;
    }
};

export const getAllMealsApi = async (token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_GET_ALL_MEALS_ENDPOINT}`;
    try {
        const response = await Interceptor.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("[API Error] Failed to fetch all meals:", error);
        throw error;
    }
};

export const deleteMealApi = async (mealId, token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_DELETE_MEAL_ENDPOINT}/${mealId}`;
    try {
        const response = await Interceptor.delete(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error("[API Error] Failed to delete meal:", error);
        throw error;
    }
};

export const getFoodSourcesApi = async () => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_FOOD_SOURCES_ENDPOINT}`;
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch food sources");
        }

        return await response.json();
    } catch (error) {
        console.error("[API Error] Failed to fetch food sources:", error);
        throw error;
    }
};




