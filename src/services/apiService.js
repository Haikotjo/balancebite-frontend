import { Interceptor } from "./authInterceptor";
import { roundNutrientValues } from "../utils/helpers/roundNutrientValues";

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


export const addMealToFavoritesApi = async (mealId, token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADD_MEAL_ENDPOINT}/${mealId}`;
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
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_REMOVE_MEAL_ENDPOINT}/${mealId}`;
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

export const fetchMeals = async (path) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${path}`;
    try {
        const token = localStorage.getItem("accessToken");

        const headers = token
            ? { Authorization: `Bearer ${token}` }
            : {};

        const response = await Interceptor.get(endpoint, { headers });

        return response.data;
    } catch (error) {
        logError(error);
        return { content: [], totalPages: 1 };
    }
};


export const fetchUserMeals = async (token) => {
    const endpoint = import.meta.env.VITE_USER_MEALS_ENDPOINT;
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
    const endpoint = `${import.meta.env.VITE_MEAL_BY_ID_ENDPOINT}/${mealId}`;
    try {
        const response = await Interceptor.get(endpoint);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const fetchMealNutrientsById = async (mealId) => {
    const endpoint = `${import.meta.env.VITE_MEAL_NUTRIENTS_ENDPOINT}/${mealId}`;

    try {
        const response = await Interceptor.get(endpoint);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const createMealApi = async (formData) => {
    const endpoint = import.meta.env.VITE_CREATE_MEAL_ENDPOINT;

    const response = await Interceptor.post(endpoint, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getAllFoodItems = async () => {
    const response = await Interceptor.get("/fooditems");
    return response.data;
};

export const getAllFoodItemNames = async () => {
    const endpoint = import.meta.env.VITE_FOODITEM_NAMES_ENDPOINT;
    const response = await Interceptor.get(endpoint);
    return response.data;
};

export const searchFoodItemsByName = async (prefix) => {
    const endpoint = `${import.meta.env.VITE_SEARCH_FOODITEMS_ENDPOINT}?prefix=${prefix}`;
    const response = await Interceptor.get(endpoint);
    return response.data;
};

export const fetchUserProfile = async (token) => {
    const endpoint = import.meta.env.VITE_USER_PROFILE_ENDPOINT; // bijvoorbeeld: "/users/profile"

    try {
        const response = await Interceptor.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

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
    const endpoint = import.meta.env.VITE_UPDATE_USER_DETAILS_ENDPOINT;
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
    const endpoint = import.meta.env.VITE_DAILY_RDI_ENDPOINT;

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

export const fetchBaseNutritionApi = async () => {
    const endpoint = import.meta.env.VITE_BASE_RDI_ENDPOINT;

    try {
        const response = await Interceptor.get(endpoint);

        if (response?.data) {
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

export const consumeMealApi = async (mealId) => {
    const endpoint = `${import.meta.env.VITE_CONSUME_MEAL_ENDPOINT}/${mealId}`;
    try {
        const response = await Interceptor.post(endpoint);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const updateUserInfoApi = async (data) => {
    const endpoint = import.meta.env.VITE_UPDATE_USER_INFO_ENDPOINT;

    try {
        const response = await Interceptor.patch(endpoint, data);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const fetchMealEnums = async () => {
    const endpoint = import.meta.env.VITE_MEAL_ENUMS_ENDPOINT;
    try {
        const response = await Interceptor.get(endpoint);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};

export const getAllMealNames = async () => {
    const endpoint = import.meta.env.VITE_MEAL_NAMES_ENDPOINT;
    try {
        const response = await Interceptor.get(endpoint);
        return response.data;
    } catch (error) {
        logError(error);
        return [];
    }
};

export const fetchSortedMeals = async (sortField, sortOrder = "desc") => {
    const endpoint = `${import.meta.env.VITE_SORT_MEALS_ENDPOINT}?sortField=${sortField}&sortOrder=${sortOrder}`;

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
    const endpoint = `${import.meta.env.VITE_UPDATE_MEAL_ENDPOINT}/${mealId}`;
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
    const endpoint = import.meta.env.VITE_CREATE_FOODITEM_ENDPOINT;
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
    const endpoint = `${import.meta.env.VITE_DELETE_FOODITEM_ENDPOINT}/${id}`;
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
    const endpoint = `${import.meta.env.VITE_FETCH_FOODITEM_BY_ID_ENDPOINT}/${fdcId}`;
    const response = await Interceptor.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Bulk fetch multiple food items by FDC IDs
export const fetchFoodItemsBulkApi = async (fdcIds) => {
    const endpoint = import.meta.env.VITE_FETCH_FOODITEMS_BULK_ENDPOINT;
    const response = await Interceptor.post(endpoint, fdcIds, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};


export const getAllUsersApi = async (token) => {
    const endpoint = import.meta.env.VITE_GET_ALL_USERS_ENDPOINT;
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
    const endpoint = import.meta.env.VITE_PROMOTE_USER_ENDPOINT;
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
    const endpoint = import.meta.env.VITE_DELETE_USER_ENDPOINT;
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
    const endpoint = import.meta.env.VITE_ADMIN_CREATE_USER_ENDPOINT;
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
    const endpoint = import.meta.env.VITE_GET_ALL_MEALS_ENDPOINT;
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
    const endpoint = `${import.meta.env.VITE_DELETE_MEAL_ENDPOINT}/${mealId}`;
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

export const getMappedFoodSources = async () => {
    const sources = await getFoodSourcesApi();
    return sources.map(value => ({
        value,
        label: value
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/^\w/, c => c.toUpperCase()),
    }));
};


export const getFoodSourcesApi = async () => {
    const endpoint = import.meta.env.VITE_FOOD_SOURCES_ENDPOINT;
    try {
        const response = await Interceptor.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("[API Error] Failed to fetch food sources:", error);
        throw error;
    }
};


// ========== DIEETPLANNEN (USER) ==========

export const createDietPlanApi = async (data) => {
    const endpoint = import.meta.env.VITE_CREATE_DIETPLAN_ENDPOINT;
    const token = localStorage.getItem("accessToken");
    const response = await Interceptor.post(endpoint, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const addDietPlanToUserApi = async (dietPlanId) => {
    const endpoint = `${import.meta.env.VITE_ADD_DIETPLAN_TO_USER_ENDPOINT}/${dietPlanId}`;
    const token = localStorage.getItem("accessToken");
    const response = await Interceptor.patch(endpoint, null, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateDietPlanApi = async (dietPlanId, data) => {
    const endpoint = `${import.meta.env.VITE_UPDATE_DIETPLAN_ENDPOINT}/${dietPlanId}`;
    const token = localStorage.getItem("accessToken");
    const response = await Interceptor.put(endpoint, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const removeDietFromUserApi = async (dietPlanId, token) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_REMOVE_DIET_ENDPOINT}/${dietPlanId}`;
    try {
        const response = await Interceptor.delete(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
        });
        logResponse(response);
        return response.data;
    } catch (error) {
        const errData = error?.response?.data;
        console.error("❌ Backend responded with error:", errData);

        throw {
            ...error,
            response: {
                ...error.response,
                data: errData,
            }
        };
    }

};

export const getAllUserDietPlansApi = async (page = 0, size = 12) => {
    const endpoint = `${import.meta.env.VITE_GET_ALL_USER_DIETPLANS_ENDPOINT}?page=${page}&size=${size}`;
    const token = localStorage.getItem("accessToken");
    const response = await Interceptor.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getCreatedDietPlansApi = async (page = 0, size = 12) => {
    const endpoint = `${import.meta.env.VITE_GET_CREATED_DIETPLANS_ENDPOINT}?page=${page}&size=${size}`;
    const token = localStorage.getItem("accessToken");
    const response = await Interceptor.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};


export const getUserDietPlanByIdApi = async (dietPlanId) => {
    const endpoint = `${import.meta.env.VITE_GET_DIETPLAN_BY_ID_ENDPOINT}/${dietPlanId}`;
    const token = localStorage.getItem("accessToken");
    const response = await Interceptor.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchDiets = async (path) => {
    const endpoint = `${import.meta.env.VITE_BASE_URL}${path}`;
    try {
        const token = localStorage.getItem("accessToken");

        const headers = token
            ? { Authorization: `Bearer ${token}` }
            : {};

        const response = await Interceptor.get(endpoint, { headers });
        return response.data;
    } catch (error) {
        logError(error);
        return { content: [], totalPages: 1 };
    }
};


export const addMealToDietDayApi = async (dietPlanId, dayIndex, mealId) => {
    const endpoint = `${import.meta.env.VITE_ADD_MEAL_TO_DIETDAY_ENDPOINT}/${dietPlanId}/days/${dayIndex}/meals/${mealId}`;
    const token = localStorage.getItem("accessToken");
    const response = await Interceptor.post(endpoint, null, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const removeMealFromDietDayApi = async (dietPlanId, dayIndex, mealId) => {
    const endpoint = `${import.meta.env.VITE_REMOVE_MEAL_FROM_DIETDAY_ENDPOINT}/${dietPlanId}/days/${dayIndex}/meals/${mealId}`;
    const token = localStorage.getItem("accessToken");
    const response = await Interceptor.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const removeDietDayApi = async (dietPlanId, dayIndex) => {
    const endpoint = `${import.meta.env.VITE_REMOVE_DIETDAY_ENDPOINT}/${dietPlanId}/days/${dayIndex}`;
    const token = localStorage.getItem("accessToken");
    const response = await Interceptor.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// ========== DIEETPLANNEN (PUBLIEK) ==========

export const getAllPublicDietPlansApi = async (params) => {
    const endpoint = import.meta.env.VITE_GET_ALL_PUBLIC_DIETPLANS_ENDPOINT;
    // geef bijv. params = { page: 0, size: 20, sortBy: 'name', sortOrder: 'asc', diets: [...] }
    const response = await Interceptor.get(endpoint, { params });
    // response.data = { content: […], totalPages: X, totalElements: Y, … }
    return response.data.content;     // <-- alleen de array teruggeven
};

export const getPublicDietPlanByIdApi = async (dietPlanId) => {
    const endpoint = `${import.meta.env.VITE_GET_PUBLIC_DIETPLAN_BY_ID_ENDPOINT}/${dietPlanId}`;
    const response = await Interceptor.get(endpoint);
    return response.data;
};



