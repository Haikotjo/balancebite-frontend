import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useContext } from "react";
import { RecommendedNutritionContext } from "../../../context/RecommendedNutritionContext.jsx";
import EatButton from "../eatButton/EatButton";
import FavoriteButton from "../favoriteButton/FavoriteButton.jsx";

const MealCardActionButtons = ({ meal }) => {
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
                    backgroundColor: "rgba(255,255,255)",
                    borderRadius: "40%",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.5)",
                    width: "35px",
                    height: "35px",
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
                    backgroundColor: "rgba(255,255,255)",
                    borderRadius: "40%",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.5)",
                    width: "35px",
                    height: "35px",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                        transform: "scale(1.2)",
                    },
                }}
            >
                <EatButton meal={meal} refetchRecommendedNutrition={refetchRecommendedNutrition} />
            </Box>
        </Box>
    );
};

MealCardActionButtons.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default MealCardActionButtons;
