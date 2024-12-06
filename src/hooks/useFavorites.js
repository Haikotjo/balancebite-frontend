import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const useFavorites = () => {
    const { user } = useContext(AuthContext); // Haal de gebruiker uit de context
    const navigate = useNavigate();

    const addMealToFavorites = async (mealId) => {
        if (!user) {
            console.warn("User is not logged in. Redirecting to login.");
            navigate("/login"); // Redirect naar login als er geen ingelogde gebruiker is
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token found in localStorage.");
            navigate("/login"); // Redirect naar login als de token ontbreekt
            return;
        }

        const baseUrl = "http://localhost:8080"; // Base URL van de backend
        const endpoint = `${baseUrl}/users/add-meal/${mealId}`;

        try {
            console.info(`Attempting to add meal with ID ${mealId} to favorites...`);
            console.info("Endpoint:", endpoint);
            console.info("Using token:", token);

            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Gebruik de token
                },
            });

            const responseBody = await response.json().catch(() => {
                console.warn("Response body could not be parsed as JSON.");
                return null; // Voorkomt crash als de body leeg is
            });

            console.info("Server response:", response.status, responseBody);

            if (!response.ok) {
                console.error("Server returned an error:", responseBody?.error || "Unknown error");
                throw new Error(`Failed to add meal to favorites. Status: ${response.status}`);
            }

            console.log("Meal added to favorites successfully:", responseBody);
        } catch (error) {
            console.error("Error adding meal to favorites:", error.message, error);
        }
    };

    return { addMealToFavorites };
};

export default useFavorites;
