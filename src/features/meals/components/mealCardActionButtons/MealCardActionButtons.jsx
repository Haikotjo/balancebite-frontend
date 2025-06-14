// src/components/meal/MealCardActionButtons.jsx

import PropTypes from "prop-types";
import { useContext } from "react";
import EatButton from "../buttonEat/EatButton.jsx";
import ButtonOpenMeal from "../buttonOpenMeal/ButtonOpenMeal.jsx";
import {RecommendedNutritionContext} from "../../../../context/RecommendedNutritionContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import ButtonFavorite from "../buttonFavoriteMeal/FavoriteButtonMeal.jsx";

/**
 * Displays a horizontal group of meal-related action buttons.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.meal - The meal object for which actions apply.
 * @param {number} [props.iconSize=35] - Diameter of each button container.
 * @param {string} [props.viewMode="page"] - Controls visibility of open button.
 * @returns {JSX.Element}
 */
const MealCardActionButtons = ({ meal, iconSize = 35, viewMode = "page",  onMealClick }) => {
    const { refetchRecommendedNutrition } = useContext(RecommendedNutritionContext);

    const sharedClasses = `
        flex items-center justify-center text-white
        transition-transform duration-200 ease-in-out hover:scale-[1.2]
    `;

    return (
        <CustomBox className="flex flex-row items-center gap-2">
            <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                <ButtonFavorite meal={meal} />
            </CustomBox>

            <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                <EatButton
                    meal={meal}
                    refetchRecommendedNutrition={refetchRecommendedNutrition}
                />
            </CustomBox>

            {viewMode !== "page" && (
                <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                    <ButtonOpenMeal
                        mealId={meal.id}
                        onClick={onMealClick ? () => onMealClick(meal) : undefined}
                    />
                </CustomBox>
            )}

        </CustomBox>
    );
};

MealCardActionButtons.propTypes = {
    meal: PropTypes.object.isRequired,
    iconSize: PropTypes.number,
    viewMode: PropTypes.oneOf(["page", "list", "modal"]),
    onMealClick: PropTypes.func,
};

export default MealCardActionButtons;
