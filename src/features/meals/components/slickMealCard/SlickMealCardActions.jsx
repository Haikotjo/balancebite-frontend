// SlickMealCardActions — action bar for SlickMealCard
// Same functionality as MealCardActionButtons but styled for the image overlay

import PropTypes from "prop-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { RecommendedNutritionContext } from "../../../../context/RecommendedNutritionContext.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";

import EatButton from "../buttonEat/EatButton.jsx";
import ButtonFavorite from "../buttonFavoriteMeal/FavoriteButtonMeal.jsx";
import ButtonUpdateMeal from "../buttonUpdateMeal/ButtonUpdateMeal.jsx";
import ButtonOpenMeal from "../buttonOpenMeal/ButtonOpenMeal.jsx";
import SocialShareMenu from "../../../../components/socialShareMenu/SocialShareMenu.jsx";

const ICON_SIZE = 32;

export default function SlickMealCardActions({ meal, isPinned = false, viewMode = "list", onClose }) {
    const { user } = useContext(AuthContext);
    const { refetchRecommendedNutrition } = useContext(RecommendedNutritionContext);
    const { userMeals } = useContext(UserMealsContext);
    const navigate = useNavigate();

    const isCreator = String(meal?.createdBy?.id) === String(user?.id);
    const isUserMeal = isCreator || userMeals.some(m => String(m.id) === String(meal.id));

    return (
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-black/30 px-3 py-1.5 backdrop-blur-md">
            {(!meal.isRestricted || isUserMeal) && (
                <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                    <ButtonFavorite meal={meal} onClose={onClose} />
                </div>
            )}

            <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                <EatButton meal={meal} refetchRecommendedNutrition={refetchRecommendedNutrition} />
            </div>

            {isUserMeal && (
                <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                    <ButtonUpdateMeal mealId={meal.id} />
                </div>
            )}

            {viewMode === "page" ? (
                <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors"
                        style={{ width: ICON_SIZE, height: ICON_SIZE }}
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                    <ButtonOpenMeal meal={meal} isPinned={isPinned} />
                </div>
            )}

            <div className="flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
                <SocialShareMenu
                    url={`${window.location.origin}/meal/${meal.id}`}
                    title={`Check out this recipe: ${meal.name}`}
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
    viewMode: PropTypes.oneOf(["list", "modal", "page"]),
    onClose: PropTypes.func,
};
