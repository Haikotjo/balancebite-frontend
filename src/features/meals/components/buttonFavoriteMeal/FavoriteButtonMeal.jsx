import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

import { useToggleMealFavorite } from "../../utils/hooks/useToggleMealFavorite.js";
import { useRequireAuthDialog } from "../../../../hooks/useRequireAuthDialog.js";
import { forceUnlinkMealFromUserApi } from "../../../../services/apiService.js";
import { useNotification } from "../../../../context/NotificationContext.jsx";

import { AuthContext } from "../../../../context/AuthContext.jsx";
import { useModal } from "../../../../context/useModal.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";

import RequireAuthUI from "../../../../components/layout/RequireAuthUI.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";

const ButtonFavorite = ({ meal, onClose }) => {
    const navigate = useNavigate();
    const { showDialog } = useNotification();

    const { token } = useContext(AuthContext);
    const { closeModal } = useModal();
    const { removeMealFromUserMeals } = useContext(UserMealsContext);
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

    const handleForceUnlink = async () => {
        try {
            await forceUnlinkMealFromUserApi(meal.id, token);
            removeMealFromUserMeals(meal.id);
            setErrorDialogOpen(false);

            for (const diet of errorDiets) {
                try {
                    const updatedDiet = await getDietById(diet.id);
                    if (updatedDiet) replaceDietInDiets(diet.id, updatedDiet);
                } catch {
                    // diet update failure is non-critical
                }
            }

            if (onClose) onClose();
            else closeModal();
        } catch {
            // force unlink failure handled by error state
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
            showDialog({
                message: alreadyFavorited
                    ? `${meal.name} removed from your meals`
                    : `${meal.name} added to your meals`,
                type: "success",
            });
            if (onClose) onClose();
            else closeModal();
        }
    );

    return (
        <>
            <motion.button
                type="button"
                onClick={toggleFavorite}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-full w-full items-center justify-center rounded-xl bg-rose-500/80 transition-colors hover:bg-rose-500"
            >
                <Heart
                    size={18}
                    color="white"
                    fill={alreadyFavorited ? "white" : "none"}
                />
            </motion.button>

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
                    <div className="mt-4 space-y-3 rounded-xl border border-error/40 bg-error/5 p-4">
                        <div className="flex items-center gap-2 text-error">
                            <AlertTriangle size={16} className="shrink-0" />
                            <p className="text-sm font-semibold">
                                This meal is used in one or more diets
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            {errorDiets.map((diet) => (
                                <button
                                    key={diet.id}
                                    type="button"
                                    onClick={() => navigate(`/diet/${diet.id}`)}
                                    className="text-left text-sm text-primary underline underline-offset-2 hover:text-primary-emphasis"
                                >
                                    View: {diet.name}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleForceUnlink}
                            className="text-left text-sm font-semibold text-error underline underline-offset-2 hover:text-error/80"
                        >
                            Remove from all diets and my meals
                        </button>
                    </div>
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
