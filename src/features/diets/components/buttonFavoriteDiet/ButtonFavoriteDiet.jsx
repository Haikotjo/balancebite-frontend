import PropTypes from "prop-types";
import { Heart, AlertTriangle } from "lucide-react";
import {useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useToggleDietFavorite } from "../../utils/hooks/useToggleDietFavorite.js";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import RequireAuthUI from "../../../../components/layout/RequireAuthUI.jsx";
import { useRequireAuthDialog } from "../../../../hooks/useRequireAuthDialog.js";
import { useDialog } from "../../../../context/NotificationContext.jsx";
import { useModal } from "../../../../context/useModal.js";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import {UserMealsContext} from "../../../../context/UserMealsContext.jsx";
import {fetchMealById} from "../../../../services/apiService.js";

const ButtonFavoriteDiet = ({ diet }) => {
    const navigate = useNavigate();
    const { showDialog } = useDialog();
    const { closeModal } = useModal();
    const { replaceMealInMeals } = useContext(UserMealsContext);

    const {
        dialogOpen,
        errorMessage,
        showLoginForm,
        triggerAuthDialog,
        handleLoginRedirect,
        reset,
        setShowLoginForm,
    } = useRequireAuthDialog();

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [relatedMeals, setRelatedMeals] = useState([]);

    const { toggleFavorite, alreadyFavorited } = useToggleDietFavorite(
        diet,
        () => triggerAuthDialog("You must be logged in to favorite diets."),
        ({ message, meals }) => {
            setErrorMsg(message);
            setRelatedMeals(meals || []);
            setErrorDialogOpen(true);
        },
        () => {
            const nowFavorited = !alreadyFavorited;
            const msg = nowFavorited
                ? `${diet.name} added to your diets`
                : `${diet.name} removed from your diets`;

            showDialog({ message: msg, type: "success" });

            // 🔄 Haal de meals opnieuw op en vervang ze in de context
            if (nowFavorited && diet.meals?.length > 0) {
                diet.meals.forEach(async (mealRef) => {
                    try {
                        const updatedMeal = await fetchMealById(mealRef.id);
                        if (updatedMeal) {
                            replaceMealInMeals(mealRef.id, updatedMeal);
                        }
                    } catch (err) {
                        console.warn(`❌ Failed to update meal ${mealRef.id}`, err);
                    }
                });
            }

            closeModal();
        }
    );

    return (
        <>
            <CustomIconButton
                onClick={toggleFavorite}
                bgColor="bg-error/80"
                icon={
                    <Heart
                        size={20}
                        color="white"
                        fill={alreadyFavorited ? "white" : "none"}
                    />
                }
            />

            <RequireAuthUI
                dialogOpen={dialogOpen}
                onClose={reset}
                message={errorMessage}
                showLoginForm={showLoginForm}
                onLoginClose={() => setShowLoginForm(false)}
                onLoginSuccess={() => setShowLoginForm(false)}
                onLoginRedirect={handleLoginRedirect}
            />

            <ErrorDialog
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
                type="error"
                message={errorMsg || "Something went wrong."}
            >
                {relatedMeals.length > 0 && (
                    <CustomBox className="mt-4 space-y-2 border border-error rounded-lg p-4">
                        <CustomBox className="flex items-center gap-2 text-error font-medium">
                            <AlertTriangle size={18} />
                            <CustomTypography variant="h5">
                                This diet is used with one or more meals
                            </CustomTypography>
                        </CustomBox>

                        {relatedMeals.map((meal) => (
                            <CustomButton
                                key={meal.id}
                                as="button"
                                onClick={() => navigate(`/meal/${meal.id}`)}
                                className="text-primary underline hover:text-blue-700 block text-left"
                            >
                                View: {meal.name}
                            </CustomButton>
                        ))}
                    </CustomBox>
                )}
            </ErrorDialog>
        </>
    );
};

ButtonFavoriteDiet.propTypes = {
    diet: PropTypes.object.isRequired,
};

export default ButtonFavoriteDiet;
