// src/components/meal/MealCardActionButtons.jsx

import PropTypes from "prop-types";
import { useContext } from "react";
import { RecommendedNutritionContext } from "../../context/RecommendedNutritionContext.jsx";
import EatButton from "../buttonEat/EatButton.jsx";
import FavoriteButton from "../buttonFavorite/FavoriteButton.jsx";
import ButtonOpenMeal from "../buttonOpenMeal/ButtonOpenMeal.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import clsx from "clsx";
import ButtonUpdateMeal from "../buttonUpdateMeal/ButtonUpdateMeal.jsx";

/**
 * Displays a vertical or horizontal group of meal-related action buttons.
 * Styled consistently for visual clarity and ready for React Native adaptation.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.meal - The meal object for which actions apply.
 * @param {number} [props.iconSize=35] - Diameter of each button container.
 * @param {"horizontal"|"vertical"} [props.layout="column"] - Layout direction of buttons.

 * @returns {JSX.Element}
 */
const MealCardActionButtons = ({
                                   meal,
                                   iconSize = 35,
                                   variant = "overlay",
                                   viewMode = "page",
                               }) => {
    const {refetchRecommendedNutrition} = useContext(RecommendedNutritionContext);

    const sharedClasses = `
        bg-[rgba(0,0,0,0.5)] rounded-[40%]
        shadow-md flex items-center justify-center text-white
        transition-transform duration-200 ease-in-out hover:scale-[1.2]
    `;

    const isListItem = viewMode === "list";
    const isPage = viewMode === "page";
    const isMobile = viewMode === "mobile";


    return (
        <CustomBox
            className={clsx(
                variant === "overlay" && "absolute top-[15px] right-[10px]",
                "flex",
                variant === "inline" ? "flex-row" : "flex-col",
                "items-center gap-2"
            )}
        >
            <CustomBox
                className={`${sharedClasses}`}
                style={{width: iconSize, height: iconSize}}
            >
                <FavoriteButton meal={meal}/>
            </CustomBox>

            <CustomBox
                className={`${sharedClasses}`}
                style={{width: iconSize, height: iconSize}}
            >
                <EatButton meal={meal} refetchRecommendedNutrition={refetchRecommendedNutrition}/>
            </CustomBox>

            <CustomBox
                className={`${sharedClasses}`}
                style={{width: iconSize, height: iconSize}}
            >
                <ButtonOpenMeal mealId={meal.id}/>
            </CustomBox>

        </CustomBox>
    );
};

MealCardActionButtons.propTypes = {
    meal: PropTypes.object.isRequired,
    iconSize: PropTypes.number,
    showOpenMealButton: PropTypes.bool,
    showUpdateButton: PropTypes.bool,
    variant: PropTypes.oneOf(["overlay", "inline"]),
    isModal: PropTypes.bool,
    onOpenAsModal: PropTypes.func,
};

export default MealCardActionButtons;
