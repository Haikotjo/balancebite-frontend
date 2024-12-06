import axios from "axios";

export const addMealToFavoritesApi = async (mealId, token) => {
    const baseUrl = "http://localhost:8080";
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
