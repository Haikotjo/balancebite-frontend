import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { addMealToFavoritesApi } from "../services/apiService.js"; // Importeer de servicefunctie

const useFavorites = () => {
    const { user, token } = useContext(AuthContext); // Haal gebruiker en token uit de context
    const navigate = useNavigate();

    const addMealToFavorites = async (mealId) => {
        if (!user) {
            console.warn("User is not logged in. Redirecting to login.");
            navigate("/login"); // Redirect naar login als er geen ingelogde gebruiker is
            return;
        }

        if (!token) {
            console.error("No access token found in context.");
            navigate("/login"); // Redirect naar login als de token ontbreekt
            return;
        }

        try {
            console.info(`Attempting to add meal with ID ${mealId} to favorites...`);
            const response = await addMealToFavoritesApi(mealId, token); // Gebruik de servicefunctie
            console.log("Meal added to favorites successfully:", response);
        } catch (error) {
            console.error("Error adding meal to favorites:", error.message, error);
        }
    };

    return { addMealToFavorites };
};

export default useFavorites;
