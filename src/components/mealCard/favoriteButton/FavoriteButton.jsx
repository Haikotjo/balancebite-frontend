import { useState } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import useFavorites from "../../../hooks/useFavorites";
import { handleToggleFavorite } from "./favoriteUtils";

const FavoriteButton = ({ isFavorite: initialFavorite, meal }) => {
    const { addMealToFavorites, removeMealFromFavorites, SnackbarComponent } = useFavorites();
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    const [animationKey, setAnimationKey] = useState(0);
    const [size, setSize] = useState(1);

    const triggerAnimation = (newSize) => {
        setSize(newSize);
        setAnimationKey((prevKey) => prevKey + 1);
    };

    return (
        <>
            <motion.div
                key={animationKey}
                animate={{ scale: [1, size, 1] }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <IconButton onClick={() => handleToggleFavorite({
                    isFavorite,
                    meal,
                    addMealToFavorites,
                    removeMealFromFavorites,
                    setIsFavorite,
                    triggerAnimation
                })}>
                    {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="error" />}
                </IconButton>
            </motion.div>

            {SnackbarComponent}
        </>
    );
};

FavoriteButton.propTypes = {
    isFavorite: PropTypes.bool.isRequired,
    meal: PropTypes.object.isRequired,
};

export default FavoriteButton;
