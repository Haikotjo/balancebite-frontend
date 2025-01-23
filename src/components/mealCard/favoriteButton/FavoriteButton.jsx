import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { UserMealsContext } from "../../../context/UserMealsContext";
import { AuthContext } from "../../../context/AuthContext";
import SnackbarComponent from "../../snackbarComponent/SnackbarComponent.jsx"; // ✅ Jouw SnackbarComponent

const FavoriteButton = ({ isFavorite: initialFavorite, onAdd, onRemove, meal }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const { removeMealFromUserMeals, addMealToUserMeals } = useContext(UserMealsContext);
    const { user } = useContext(AuthContext);
    const [isFavorite, setIsFavorite] = useState(initialFavorite);

    const handleToggleFavorite = async () => {
        if (!user) {
            setSnackbarMessage("You need to login or register to add a meal.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }

        if (isFavorite) {
            await onRemove();
            removeMealFromUserMeals(meal.id);
            setSnackbarMessage(`${meal.name} removed from your meals!`);
            setSnackbarSeverity("error");
        } else {
            await onAdd();
            addMealToUserMeals(meal);
            setSnackbarMessage(`${meal.name} added to your meals!`);
            setSnackbarSeverity("success");
        }

        setIsFavorite(!isFavorite);
        setSnackbarOpen(true);
    };

    return (
        <>
            <IconButton onClick={handleToggleFavorite}>
                {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="error" />}
            </IconButton>

            {/* ✅ Gebruik hier jouw eigen SnackbarComponent */}
            <SnackbarComponent
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
        </>
    );
};

FavoriteButton.propTypes = {
    isFavorite: PropTypes.bool.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    meal: PropTypes.object.isRequired,
};

export default FavoriteButton;
