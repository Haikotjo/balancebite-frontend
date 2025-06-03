import PropTypes from "prop-types";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useToggleMealFavorite } from "../../utils/hooks/useToggleMealFavorite.js";
import { useRequireAuthDialog } from "../../../../hooks/useRequireAuthDialog.js";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import RequireAuthUI from "../../../../components/layout/RequireAuthUI.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import { useNavigate } from "react-router-dom";

const ButtonFavorite = ({ meal }) => {
    const navigate = useNavigate();

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
    const [errorDiets, setErrorDiets] = useState([]); // array van { id, name }

    const { toggleFavorite, alreadyFavorited } = useToggleMealFavorite(
        meal,
        () => triggerAuthDialog("You must be logged in to favorite meals."),
        ({ message, diets }) => {
            console.log("⚠️ diets:", diets);
            setErrorMessage(message);
            setErrorDiets(diets || []);
            setErrorDialogOpen(true);
        },
        (successMessage) => {
            console.log("✅", successMessage);
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
                message={errorMessage}
                type="error"
            >
                {errorDiets.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {errorDiets.map((diet) => (
                            <button
                                key={diet.id}
                                onClick={() => navigate(`/diet/${diet.id}`)}
                                className="text-blue-500 underline hover:text-blue-700 block text-left"
                            >
                                View: {diet.name}
                            </button>
                        ))}
                    </div>
                )}
            </ErrorDialog>

        </>
    );
};

ButtonFavorite.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default ButtonFavorite;