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

// export const refreshAccessTokenApi = async (refreshToken) => {
//     const endpoint = import.meta.env.VITE_AUTH_REFRESH_ENDPOINT || "/auth/refresh";
//     const fullEndpoint = `${import.meta.env.VITE_BASE_URL}${endpoint}`;
//     try {
//         console.log("[API] Verstuur refresh-token call naar endpoint:", fullEndpoint);
//         console.log("[API] Refresh token meegegeven:", refreshToken);
//
//         const fetchResponse = await fetch(fullEndpoint, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ refreshToken }),
//         });
//
//         console.log("[API] Fetch response status:", fetchResponse.status);
//
//         if (!fetchResponse.ok) {
//             throw new Error(`[API] Fetch-call naar ${fullEndpoint} mislukt met status: ${fetchResponse.status}`);
//         }
//
//         const fetchData = await fetchResponse.json();
//         console.log("[API] Fetch response data:", fetchData);
//
//         const newToken = fetchData?.accessToken;
//         if (newToken) {
//             localStorage.setItem("accessToken", newToken);
//             console.log("[API] Nieuw access token opgeslagen in localStorage:", newToken);
//         } else {
//             console.error("[API] Geen nieuw access token ontvangen.");
//         }
//
//         return newToken;
//     } catch (fetchError) {
//         console.error("[API] Fetch-call mislukt:", fetchError.message);
//         throw fetchError;
//     }
// };

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
