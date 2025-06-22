import PropTypes from "prop-types";
import { Heart, AlertTriangle } from "lucide-react";
import { useContext, useState } from "react";
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

const ButtonFavorite = ({ meal, onClose }) => {
    const navigate = useNavigate();
    const { showDialog } = useDialog();
    const { removeMealFromUserMeals } = useContext(UserMealsContext);
    const { token } = useContext(AuthContext);
    const { closeModal } = useContext(ModalContext);

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
