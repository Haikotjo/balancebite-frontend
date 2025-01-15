import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Snackbar, Alert } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { UserMealsContext } from "../../../context/UserMealsContext";

const FavoriteButton = ({ isFavorite, onAdd, onRemove, meal, refreshList }) => { // refreshList toegevoegd
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { removeMealFromUserMeals, addMealToUserMeals } = useContext(UserMealsContext);

    const handleToggleFavorite = async () => {
        if (isFavorite) {
            // Verwijderen
            await onRemove(); // Verwijder uit favorieten via API
            removeMealFromUserMeals(meal.id); // Verwijder direct uit context
            setSnackbarMessage(`${meal.name} removed from your meals!`);
            if (refreshList) refreshList(); // Ververs de lijst na verwijderen
        } else {
            // Toevoegen
            await onAdd(); // Voeg toe aan favorieten via API
            addMealToUserMeals(meal); // Voeg volledige maaltijd toe aan context
            setSnackbarMessage(`${meal.name} added to your meals!`);
        }
        setSnackbarOpen(true); // Open de snackbar
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <IconButton onClick={handleToggleFavorite}>
                {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="primary" />}
            </IconButton>

            {/* Snackbar Weergave */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Automatisch sluiten na 3 seconden
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

FavoriteButton.propTypes = {
    isFavorite: PropTypes.bool.isRequired, // Geeft aan of de maaltijd al favoriet is
    onAdd: PropTypes.func.isRequired, // Functie om de maaltijd toe te voegen aan favorieten
    onRemove: PropTypes.func.isRequired, // Functie om de maaltijd uit favorieten te verwijderen
    meal: PropTypes.object.isRequired, // De maaltijdinformatie voor de snackbar
    refreshList: PropTypes.func, // Optionele functie om de lijst te verversen
};

export default FavoriteButton;
