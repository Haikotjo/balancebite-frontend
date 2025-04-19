// src/components/meal/MealCardActionButtons.jsx

import PropTypes from "prop-types";
import { useContext } from "react";
import { RecommendedNutritionContext } from "../../context/RecommendedNutritionContext.jsx";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import EatButton from "../buttonEat/EatButton.jsx";
import FavoriteButton from "../buttonFavorite/FavoriteButton.jsx";
import ButtonOpenMeal from "../buttonOpenMeal/ButtonOpenMeal.jsx";
import ButtonUpdateMeal from "../buttonUpdateMeal/ButtonUpdateMeal.jsx";
import CustomBox from "../layout/CustomBox.jsx";

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
const MealCardActionButtons = ({ meal, iconSize = 35, viewMode = "page" }) => {
    const { refetchRecommendedNutrition } = useContext(RecommendedNutritionContext);
    const { userMeals } = useContext(UserMealsContext);

    const isUserMeal = userMeals.some((userMeal) =>
        String(userMeal.id) === String(meal.id)
    );

    const sharedClasses = `
        bg-[rgba(0,0,0,0.5)] rounded-[40%]
        shadow-md flex items-center justify-center text-white
        transition-transform duration-200 ease-in-out hover:scale-[1.2]
    `;

    return (
        <CustomBox className="flex flex-row items-center gap-2">
            <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                <FavoriteButton meal={meal} />
            </CustomBox>

            <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                <EatButton
                    meal={meal}
                    refetchRecommendedNutrition={refetchRecommendedNutrition}
                />
            </CustomBox>

            {viewMode !== "page" && (
                <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                    <ButtonOpenMeal mealId={meal.id} />
                </CustomBox>
            )}

            {isUserMeal && (
                <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                    <ButtonUpdateMeal mealId={meal.id} />
                </CustomBox>
            )}
        </CustomBox>
    );
};

MealCardActionButtons.propTypes = {
    meal: PropTypes.object.isRequired,
    iconSize: PropTypes.number,
    viewMode: PropTypes.oneOf(["page", "list", "modal"]),
};

export default MealCardActionButtons;
