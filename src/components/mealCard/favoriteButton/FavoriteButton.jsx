import { useState } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import useFavorites from "../../../hooks/useFavorites";

const FavoriteButton = ({ isFavorite: initialFavorite, meal }) => {
    const { addMealToFavorites, removeMealFromFavorites, SnackbarComponent } = useFavorites();
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    const [animationKey, setAnimationKey] = useState(0);
    const [size, setSize] = useState(1);

    const handleToggleFavorite = async () => {
        const success = isFavorite
            ? await removeMealFromFavorites(meal)
            : await addMealToFavorites(meal);

        if (success) {
            setIsFavorite(!isFavorite);
            triggerAnimation(isFavorite ? 0.9 : 1.2);
        }
    };

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
                <IconButton onClick={handleToggleFavorite}>
                    {isFavorite ? (
                        <FavoriteIcon
                            sx={{
                                fontSize: 25,
                                color: "error.main",
                                transition: "color 0.2s ease-in-out",
                                "&:hover": {
                                    color: "error.light",
                                },
                            }}
                        />
                    ) : (
                        <FavoriteBorderIcon
                            sx={{
                                fontSize: 25,
                                color: "error.main",
                                transition: "color 0.2s ease-in-out",
                                "&:hover": {
                                    color: "error.light",
                                },
                            }}
                        />
                    )}
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
