import { Interceptor } from "./authInterceptor"; // Importeer de geconfigureerde Interceptor

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
    const token = localStorage.getItem("accessToken"); // Haal het token uit localStorage

    if (!token) {
        throw new Error("No access token available.");
    }

    try {
        const response = await Interceptor.post(endpoint, formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Alleen de Authorization-header
                // Geen expliciete Content-Type header toevoegen
            },
        });
        logResponse(response);
        return response.data;
    } catch (error) {
        logError(error);
        throw error;
    }
};
