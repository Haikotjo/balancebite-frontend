import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import { UserMealsContext } from "../../../context/UserMealsContext";
import useFavorites from "../../../hooks/useFavorites.jsx";
import ErrorDialog from "../../errorDialog/ErrorDialog.jsx";
import { useTheme } from "@mui/material";

const FavoriteButton = ({ meal }) => {
    const theme = useTheme();
    const { userMeals } = useContext(UserMealsContext);
    const { addMealToFavorites, removeMealFromFavorites } = useFavorites();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem("accessToken");

    const isFavorite = userMeals.some(userMeal => userMeal.id === meal.id);

    const handleToggleFavorite = async () => {
        if (!token) {
            setErrorMessage(
                <>
                    To use this function, please{" "}
                    <a href="/register" style={{ color: theme.palette.primary.main, textDecoration: "underline" }}>
                        register
                    </a>{" "}
                    or{" "}
                    <a href="/login" style={{ color: theme.palette.primary.main, textDecoration: "underline" }}>
                        login
                    </a>.
                </>
            );
            setDialogOpen(true);
            return;
        }

        try {
            if (isFavorite) {
                await removeMealFromFavorites(meal);
            } else {
                await addMealToFavorites(meal);
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    return (
        <>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3 }}>
                <IconButton onClick={handleToggleFavorite}>
                    {isFavorite ? (
                        <FavoriteIcon sx={{ fontSize: 25, color: "error.main", "&:hover": { color: "error.light" } }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ fontSize: 25, color: "error.main", "&:hover": { color: "error.light" } }} />
                    )}
                </IconButton>
            </motion.div>

            <ErrorDialog open={dialogOpen} onClose={() => setDialogOpen(false)} message={errorMessage} />
        </>
    );
};

FavoriteButton.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default FavoriteButton;
