export const addMealToFavoritesApi = async (mealId, token) => {
    const baseUrl = "http://localhost:8080";
    const endpoint = `${baseUrl}/users/add-meal/${mealId}`;

    try {
        console.info(`Calling API to add meal with ID ${mealId}...`);
        console.info("Endpoint:", endpoint);
        console.info("Using token:", token);

        const response = await fetch(endpoint, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const responseBody = await response.json();
            console.error("API responded with error:", responseBody?.error || "Unknown error");
            throw new Error(responseBody?.error || `Request failed with status ${response.status}`);
        }

        const responseBody = await response.json();
        console.info("API response received successfully:", responseBody);
        return responseBody; // Geef de succesvolle reactie terug
    } catch (error) {
        console.error("API Error:", error.message, error);
        throw error;
    }
};
