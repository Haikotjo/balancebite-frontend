import axios from "axios";

const baseUrl = "http://localhost:8080";

// ---------------------- Login API ----------------------

export const loginApi = async (email, password) => {
    const response = await axios.post(`${baseUrl}/auth/login`, { email, password });
    return response.data; // Retourneer de login response (accessToken en refreshToken)
};

// ---------------------- Logout API ----------------------

export const logoutApi = async (token) => {
    return axios.post(
        `${baseUrl}/auth/logout`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Voor eventuele cookie-handling
        }
    );
};

// ---------------------- Meal APIs ----------------------

// Fetch all meals from the given endpoint
export const fetchMeals = async (endpoint) => {
    const response = await axios.get(endpoint, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data; // Return the fetched meals
};

// Fetch user-specific meals using the token
export const fetchUserMeals = async (token) => {
    if (!token) {
        console.log("No token found, skipping user meals fetch.");
        return []; // Return an empty array if no token is found
    }

    const response = await axios.get(`${baseUrl}/users/meals`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return Array.isArray(response.data) ? response.data : []; // Ensure it returns an array
};

// Add a meal to favorites
export const addMealToFavoritesApi = async (mealId, token) => {
    const endpoint = `${baseUrl}/users/add-meal/${mealId}`;

    try {
        const response = await axios.patch(endpoint, null, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Retourneer de succesvolle response data
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            const { status, data } = error.response;
            if (status === 409) {
                alert("This meal is already in your favorites!");
            }
            throw new Error(data?.error || `Request failed with status ${status}`);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error("No response received from server.");
        } else {
            // Something happened in setting up the request
            throw new Error(`Error in request setup: ${error.message}`);
        }
    }
};
