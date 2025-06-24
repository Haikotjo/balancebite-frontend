import PropTypes from "prop-types";
import { useContext } from "react";
import EatButton from "../buttonEat/EatButton.jsx";
import ButtonOpenMeal from "../buttonOpenMeal/ButtonOpenMeal.jsx";
import { RecommendedNutritionContext } from "../../../../context/RecommendedNutritionContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import ButtonFavorite from "../buttonFavoriteMeal/FavoriteButtonMeal.jsx";
import ButtonUpdateMeal from "../buttonUpdateMeal/ButtonUpdateMeal.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import ViewMealButton from "../viewmealbutton/ViewMealButton.jsx";
import PrivacyToggles from "../../../../components/privacytoggles/PrivacyToggles.jsx";
import {AuthContext} from "../../../../context/AuthContext.jsx";

/**
 * Displays a horizontal group of meal-related action buttons.
 */
const MealCardActionButtons = ({ meal, iconSize = 35, viewMode = "page", onClose }) => {
    const { refetchRecommendedNutrition } = useContext(RecommendedNutritionContext);
    const { userMeals } = useContext(UserMealsContext);
    const isUserMeal = userMeals.some((m) => m.id === meal.id);
    const { user } = useContext(AuthContext);
    const isCreatedByUser = String(meal.createdBy?.id) === String(user?.id);


    const sharedClasses = `
        flex items-center justify-center text-white
        transition-transform duration-200 ease-in-out hover:scale-[1.2]
    `;

    return (
        <CustomBox className="flex flex-row items-center justify-between w-full">
            <CustomBox className="flex flex-row items-center gap-2">
                <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                    <ButtonFavorite meal={meal} onClose={onClose} />
                </CustomBox>

                <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                    <EatButton
                        meal={meal}
                        refetchRecommendedNutrition={refetchRecommendedNutrition}
                    />
                </CustomBox>

                {viewMode === "modal" && (
                    <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                        <ViewMealButton mealId={meal.id} iconSize={iconSize} />
                    </CustomBox>
                )}

                {isUserMeal && (
                    <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                        <ButtonUpdateMeal mealId={meal.id} />
                    </CustomBox>
                )}

                {viewMode !== "page" && (
                    <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                        <ButtonOpenMeal meal={meal} />
                    </CustomBox>
                )}
            </CustomBox>

            {viewMode === "page" && isCreatedByUser && (
                <CustomBox className="ml-auto">
                    <PrivacyToggles
                        mealId={meal.id}
                        initialMealPrivate={!!meal.isPrivate}
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
    onClose: PropTypes.func,
};

export default MealCardActionButtons;
