import axios from "axios";

export const addMealToFavoritesApi = async (mealId, token) => {
    const baseUrl = import.meta.env.VITE_BASE_URL; // Basis URL voor de API
    const addMealEndpoint = import.meta.env.VITE_ADD_MEAL_ENDPOINT;
    const endpoint = `${baseUrl}${addMealEndpoint}/${mealId}`;

    try {
        const response = await axios.patch(endpoint, null, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Voeg de token toe in de Authorization header
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
            // Zorg ervoor dat de foutmelding een geldige template string is
            throw new Error(data?.error || `Request failed with status ${status}`);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error("No response received from server.");
        } else {
            // Something happened in setting up the request
            // Gebruik backticks voor de foutmelding
            throw new Error(`Error in request setup: ${error.message}`);
        }
    }
};
