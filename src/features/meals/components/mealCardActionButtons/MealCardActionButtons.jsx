import PropTypes from "prop-types";
import { useContext } from "react";
import EatButton from "../buttonEat/EatButton.jsx";
import ButtonOpenMeal from "../buttonOpenMeal/ButtonOpenMeal.jsx";
import { RecommendedNutritionContext } from "../../../../context/RecommendedNutritionContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import ButtonFavorite from "../buttonFavoriteMeal/FavoriteButtonMeal.jsx";
import ButtonUpdateMeal from "../buttonUpdateMeal/ButtonUpdateMeal.jsx";
import ViewMealButton from "../viewmealbutton/ViewMealButton.jsx";
import PrivacyToggles from "../../../../components/privacytoggles/PrivacyToggles.jsx";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import ButtonCloseDietModal from "../../../../components/buttonCloseModal/ButtonCloseDietModal.jsx";
import useIsSmallScreen from "../../../../hooks/useIsSmallScreen.js";
import SocialShareMenu from "../../../../components/socialShareMenu/SocialShareMenu.jsx";

/**
 * Displays a horizontal group of meal-related action buttons.
 */
const MealCardActionButtons = ({ meal, iconSize = 35, viewMode = "page", onClose, isPinned = false }) => {
    const { refetchRecommendedNutrition } = useContext(RecommendedNutritionContext);
    const { user } = useContext(AuthContext);
    const isSmallScreen = useIsSmallScreen();

    const isOwner = String(meal.createdBy?.id) === String(user?.id);

    const sharedClasses = `
        flex items-center justify-center text-white
        transition-transform duration-200 ease-in-out hover:scale-[1.2]
    `;

    return (
        <CustomBox className="flex flex-col w-fit">
            <CustomBox className="flex flex-row items-center p-1.5 rounded-2xl bg-black/5 backdrop-blur-xl border border-borderLight">
                <CustomBox className="flex flex-row items-center gap-4 mx-2">
                    {(!meal.isRestricted || isOwner) && (
                        <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                            <ButtonFavorite meal={meal} onClose={onClose} />
                        </CustomBox>
                    )}

                    <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                        <EatButton meal={meal} refetchRecommendedNutrition={refetchRecommendedNutrition} />
                    </CustomBox>

                    {viewMode === "modal" && (
                        <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                            <ViewMealButton mealId={meal.id} iconSize={iconSize} />
                        </CustomBox>
                    )}

                    {isOwner && (
                        <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                            <ButtonUpdateMeal mealId={meal.id} />
                        </CustomBox>
                    )}

                    {(viewMode === "list" || (viewMode !== "page" && !isSmallScreen)) && (
                        <CustomBox className={sharedClasses} style={{ width: iconSize, height: iconSize }}>
                            <ButtonOpenMeal meal={meal} isPinned={isPinned} />
                        </CustomBox>
                    )}

                    {viewMode === "modal"  && (
                        <CustomBox className="lg:hidden">
                            <ButtonCloseDietModal iconSize={20} size={35} />
                        </CustomBox>
                    )}
                    <SocialShareMenu
                        url={`${window.location.origin}/meals/${meal.id}`}
                        title={`Bekijk dit lekkere recept: ${meal.name}`}
                        sharedClasses={sharedClasses}
                        iconSize={iconSize}
                    />
                </CustomBox>


            </CustomBox>

            {viewMode === "page" && isOwner && (
                <CustomBox className="mt-2">
                    <PrivacyToggles
                        mealId={meal.id}
                        initialMealPrivate={!!meal.isPrivate}
                        initialMealRestricted={!!meal.isRestricted}
                    />
                </CustomBox>
            )}
        </CustomBox>
    );
};

MealCardActionButtons.propTypes = {
    meal: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        isPrivate: PropTypes.bool,
        isRestricted: PropTypes.bool,
        name: PropTypes.string,
        createdBy: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
    }).isRequired,
    iconSize: PropTypes.number,
    viewMode: PropTypes.oneOf(["page", "list", "modal"]),
    onClose: PropTypes.func,
    isPinned: PropTypes.bool,
    isFloating: PropTypes.bool,
};


export default MealCardActionButtons;
