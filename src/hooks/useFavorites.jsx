import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { addMealToFavoritesApi } from "../services/apiService.js";
import SnackbarComponent from "../components/snackbarComponent/SnackbarComponent.jsx";

const useFavorites = () => {
    const { user, token } = useContext(AuthContext);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const addMealToFavorites = async (mealId) => {
        if (!user) {
            console.warn("User is not logged in.");
            setSnackbarOpen(true);
            return false; // Geef aan dat de actie niet succesvol was
        }

        if (!token) {
            console.error("No access token found in context.");
            setSnackbarOpen(true);
            return false; // Geef aan dat de actie niet succesvol was
        }

        try {
            console.info(`Attempting to add meal with ID ${mealId} to favorites...`);
            const response = await addMealToFavoritesApi(mealId, token);
            console.log("Meal added to favorites successfully:", response);
            return true; // Geef aan dat de actie succesvol was
        } catch (error) {
            console.error("Error adding meal to favorites:", error.message, error);
            return false; // Geef aan dat de actie niet succesvol was
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return {
        addMealToFavorites,
        SnackbarComponent: (
            <SnackbarComponent
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                message="Register or login to use this function."
                severity="warning"
            />
        ),
    };
};

export default useFavorites;
