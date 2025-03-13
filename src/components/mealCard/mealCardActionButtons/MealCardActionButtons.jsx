import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useContext } from "react";
import { RecommendedNutritionContext } from "../../../context/RecommendedNutritionContext.jsx";
import EatButton from "../eatButton/EatButton";
import FavoriteButton from "../favoriteButton/FavoriteButton.jsx";
import OpenMealButton from "../../openMealButton/OpenMealButton.jsx";

const MealCardActionButtons = ({ meal, iconSize = 35, showOpenMealButton = true }) => {
    const { refetchRecommendedNutrition } = useContext(RecommendedNutritionContext);

    return (
        <Box
            sx={{
                position: "absolute",
                top: 15,
                right: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "40%",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.5)",
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                        transform: "scale(1.2)",
                    },
                }}
            >
                <FavoriteButton meal={meal} />
            </Box>

            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "40%",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.5)",
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                        transform: "scale(1.2)",
                    },
                }}
            >
                <EatButton meal={meal} refetchRecommendedNutrition={refetchRecommendedNutrition} />
            </Box>

            {showOpenMealButton && (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "40%",
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.5)",
                        width: `${iconSize}px`,
                        height: `${iconSize}px`,
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                            transform: "scale(1.2)",
                        },
                    }}
                >
                    <OpenMealButton mealId={meal.id} />
                </Box>
            )}
        </Box>
    );
};

MealCardActionButtons.propTypes = {
    meal: PropTypes.object.isRequired,
    iconSize: PropTypes.number,
    showOpenMealButton: PropTypes.bool,
};

export default MealCardActionButtons;
