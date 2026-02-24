import PropTypes from "prop-types";
import { Heart, AlertTriangle } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useToggleMealFavorite } from "../../utils/hooks/useToggleMealFavorite.js";
import { useRequireAuthDialog } from "../../../../hooks/useRequireAuthDialog.js";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import RequireAuthUI from "../../../../components/layout/RequireAuthUI.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import { useNavigate } from "react-router-dom";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import { forceUnlinkMealFromUserApi } from "../../../../services/apiService.js";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { ModalContext } from "../../../../context/ModalContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import { useDialog } from "../../../../context/NotificationContext.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";

const ButtonFavorite = ({ meal, onClose }) => {
    const navigate = useNavigate();
    const { showDialog } = useDialog();

    // NOTE: also grab userMeals for debug checks
    const { removeMealFromUserMeals, userMeals } = useContext(UserMealsContext);

    const { token } = useContext(AuthContext);
    const { closeModal } = useContext(ModalContext);
    const { replaceDietInDiets, getDietById } = useContext(UserDietsContext);

    const {
        dialogOpen,
        errorMessage: authErrorMessage,
        showLoginForm,
        triggerAuthDialog,
        handleLoginRedirect,
        reset,
        setShowLoginForm,
    } = useRequireAuthDialog();

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorDiets, setErrorDiets] = useState([]);

    // --- DEBUG HELPERS ---
    const normalizeId = (v) => (v == null ? null : String(v));

    // Debug: does this meal exist in userMeals by id OR by originalMealId linkage?
    const debugMatch = useMemo(() => {
        const mealId = normalizeId(meal?.id);
        const mealOrig = normalizeId(meal?.originalMealId);

        const byId = (userMeals ?? []).find((m) => normalizeId(m.id) === mealId) || null;

        // User has a saved copy where copy.originalMealId === meal.id
        const copyOfMeal =
            (userMeals ?? []).find((m) => normalizeId(m.originalMealId) === mealId) || null;

        // If current meal is a copy, maybe the original is in userMeals by id
        const originalOfCopy =
            mealOrig != null
                ? (userMeals ?? []).find((m) => normalizeId(m.id) === mealOrig) || null
                : null;

        return {
            mealId,
            mealOriginalMealId: mealOrig,
            mealIsTemplate: meal?.isTemplate ?? null,
            userMealsCount: userMeals?.length ?? 0,
            matchById: byId ? { id: byId.id, originalMealId: byId.originalMealId ?? null, name: byId.name ?? null } : null,
            matchCopyOfMeal: copyOfMeal
                ? { id: copyOfMeal.id, originalMealId: copyOfMeal.originalMealId ?? null, name: copyOfMeal.name ?? null }
                : null,
            matchOriginalOfCopy: originalOfCopy
                ? { id: originalOfCopy.id, originalMealId: originalOfCopy.originalMealId ?? null, name: originalOfCopy.name ?? null }
                : null,
            userMealIdsSample: (userMeals ?? []).slice(0, 25).map((m) => ({
                id: m.id,
                originalMealId: m.originalMealId ?? null,
                isTemplate: m.isTemplate ?? null,
                name: m.name ?? null,
            })),
        };
    }, [meal, userMeals]);

    const handleForceUnlink = async () => {
        try {
            await forceUnlinkMealFromUserApi(meal.id, token);
            removeMealFromUserMeals(meal.id);
            setErrorDialogOpen(false);

            // Update related diets
            for (const diet of errorDiets) {
                try {
                    const updatedDiet = await getDietById(diet.id);
                    if (updatedDiet) {
                        replaceDietInDiets(diet.id, updatedDiet);
                    }
                } catch (e) {
                    console.warn(`⚠️ Could not update diet ${diet.id}`, e);
                }
            }

            if (onClose) {
                onClose();
            } else {
                closeModal();
            }
        } catch (e) {
            console.error("Force unlink failed", e);
        }
    };

    const { toggleFavorite, alreadyFavorited } = useToggleMealFavorite(
        meal,
        () => triggerAuthDialog("You must be logged in to favorite meals."),
        ({ message, diets }) => {
            setErrorMessage(message);
            setErrorDiets(diets || []);
            setErrorDialogOpen(true);
        },
        () => {
            const message = alreadyFavorited
                ? `${meal.name} removed from your meals`
                : `${meal.name} added to your meals`;
            showDialog({ message, type: "success" });
            if (onClose) {
                onClose();
            } else {
                closeModal();
            }
        }
    );

    // DEBUG: log every time inputs/state change
    useEffect(() => {
        console.log("❤️ [ButtonFavoriteDebug] RENDER", {
            ...debugMatch,
            alreadyFavorited,
        });
    }, [debugMatch, alreadyFavorited]);

    return (
        <>
            <CustomIconButton
                onClick={() => {
                    console.log("❤️ [ButtonFavoriteDebug] CLICK", {
                        ...debugMatch,
                        alreadyFavoritedBeforeClick: alreadyFavorited,
                    });
                    toggleFavorite();
                }}
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
                message={authErrorMessage}
                showLoginForm={showLoginForm}
                onLoginClose={() => setShowLoginForm(false)}
                onLoginSuccess={() => setShowLoginForm(false)}
                onLoginRedirect={handleLoginRedirect}
                startInRegisterMode={false}
            />

            <ErrorDialog
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
                type="error"
                message={errorMessage || "Something went wrong."}
            >
                {errorDiets.length > 0 && (
                    <CustomBox className="mt-4 space-y-2 border border-error rounded-lg p-4 ">
                        <CustomBox className="flex items-center gap-2 text-error font-medium">
                            <AlertTriangle size={18} />
                            <CustomTypography variant="h5">
                                This meal is used in one or more diets
                            </CustomTypography>
                        </CustomBox>

                        {errorDiets.map((diet) => (
                            <CustomButton
                                key={diet.id}
                                as="button"
                                onClick={() => navigate(`/diet/${diet.id}`)}
                                className="text-primary underline hover:text-blue-700 block text-left"
                            >
                                View: {diet.name}
                            </CustomButton>
                        ))}

                        <CustomButton
                            onClick={handleForceUnlink}
                            className="text-red-600 underline hover:text-red-800 block text-left font-semibold"
                        >
                            Remove from all diets and my meals.
                        </CustomButton>
                    </CustomBox>
                )}
            </ErrorDialog>
        </>
    );
};

ButtonFavorite.propTypes = {
    meal: PropTypes.object.isRequired,
    onClose: PropTypes.func,
};

export default ButtonFavorite;
