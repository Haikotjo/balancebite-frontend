// SlickMealCardActions — action bar for SlickMealCard
// Same functionality as MealCardActionButtons but styled for the image overlay

import PropTypes from "prop-types";
import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { RecommendedNutritionContext } from "../../../../context/RecommendedNutritionContext.jsx";

import EatButton from "../buttonEat/EatButton.jsx";
import ButtonFavorite from "../buttonFavoriteMeal/FavoriteButtonMeal.jsx";
import ButtonUpdateMeal from "../buttonUpdateMeal/ButtonUpdateMeal.jsx";
import ButtonOpenMeal from "../buttonOpenMeal/ButtonOpenMeal.jsx";
import SocialShareMenu from "../../../../components/socialShareMenu/SocialShareMenu.jsx";

const ICON_SIZE = 32;

export default function SlickMealCardActions({ meal, isPinned = false, onClose }) {
    const { user } = useContext(AuthContext);
    const { refetchRecommendedNutrition } = useContext(RecommendedNutritionContext);

    const isOwner = String(meal?.createdBy?.id) === String(user?.id);

    return (
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-black/30 px-3 py-1.5 backdrop-blur-md">
            {(!meal.isRestricted || isOwner) && (
                <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                    <ButtonFavorite meal={meal} onClose={onClose} />
                </div>
            )}

            <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                <EatButton meal={meal} refetchRecommendedNutrition={refetchRecommendedNutrition} />
            </div>

            {isOwner && (
                <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                    <ButtonUpdateMeal mealId={meal.id} />
                </div>
            )}

            <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                <ButtonOpenMeal meal={meal} isPinned={isPinned} />
            </div>

            <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                <SocialShareMenu
                    url={`${window.location.origin}/meal/${meal.id}`}
                    title={`Bekijk dit lekkere recept: ${meal.name}`}
                />
            </div>
        </div>
    );
}

SlickMealCardActions.propTypes = {
    meal: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string,
        isRestricted: PropTypes.bool,
        createdBy: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
    }).isRequired,
    isPinned: PropTypes.bool,
    onClose: PropTypes.func,
};
