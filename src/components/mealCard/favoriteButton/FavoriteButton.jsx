import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import { useContext } from "react";
import { UserMealsContext } from "../../../context/UserMealsContext";
import { removeMealFromFavoritesApi } from "../../../services/apiService";
import useFavorites from "../../../hooks/useFavorites.jsx";

const FavoriteButton = ({ meal }) => {
    const { userMeals } = useContext(UserMealsContext); // ✅ Alleen userMeals uit context
    const { addMealToFavorites, removeMealFromFavorites } = useFavorites();

    // 🔥 Fix: Direct de favoriet-status bepalen bij elke render
    const isFavorite = userMeals.some(userMeal => userMeal.id === meal.id);

    const handleToggleFavorite = async () => {
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
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3 }}>
            <IconButton onClick={handleToggleFavorite}>
                {isFavorite ? (
                    <FavoriteIcon sx={{ fontSize: 25, color: "error.main", "&:hover": { color: "error.light" } }} />
                ) : (
                    <FavoriteBorderIcon sx={{ fontSize: 25, color: "error.main", "&:hover": { color: "error.light" } }} />
                )}
            </IconButton>
        </motion.div>
    );
};

FavoriteButton.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default FavoriteButton;
