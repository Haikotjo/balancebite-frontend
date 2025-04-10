import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useContext } from "react";
import { RecommendedNutritionContext } from "../../context/RecommendedNutritionContext.jsx";
import EatButton from "../eatButton/EatButton.jsx";
import FavoriteButton from "../favoriteButton/FavoriteButton.jsx";
import OpenMealButton from "../openMealButton/OpenMealButton.jsx";
import UpdateMealButton from "../updateMealButton/UpdateMealButton.jsx";
import PreparationTimeIcon from "../preparationTimeIcon/PreparationTimeIcon.jsx";

const MealCardActionButtons = ({
                                   meal,
                                   iconSize = 35,
                                   showOpenMealButton = true,
                                   showUpdateButton = true,
                                   layout = "column",
                               }) => {
    const { refetchRecommendedNutrition } = useContext(RecommendedNutritionContext);

    const commonBoxStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "40%",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.5)",
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
            transform: "scale(1.2)",
        },
    };

    return (
        <Box
            sx={{
                position: "absolute",
                top: 15,
                right: 10,
                display: "flex",
                flexDirection: layout === "horizontal" ? "row" : "column",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Box sx={commonBoxStyle}>
                <FavoriteButton meal={meal} />
            </Box>

            <Box sx={commonBoxStyle}>
                <EatButton meal={meal} refetchRecommendedNutrition={refetchRecommendedNutrition} />
            </Box>

            {showOpenMealButton && (
                <Box sx={commonBoxStyle}>
                    <OpenMealButton mealId={meal.id} />
                </Box>
            )}

            {showUpdateButton && (
                <Box sx={commonBoxStyle}>
                    <UpdateMealButton mealId={meal.id} />
                </Box>
            )}


        </Box>
    );
};

MealCardActionButtons.propTypes = {
    meal: PropTypes.object.isRequired,
    iconSize: PropTypes.number,
    showOpenMealButton: PropTypes.bool,
    showUpdateButton: PropTypes.bool,
    layout: PropTypes.oneOf(["horizontal", "vertical"]),
};

export default MealCardActionButtons;
