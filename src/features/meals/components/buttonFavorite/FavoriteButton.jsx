import PropTypes from "prop-types";
import { Heart } from "lucide-react";
import {useToggleFavorite} from "../../../../hooks/useToggleFavorite.js";
import {useRequireAuthDialog} from "../../../../hooks/useRequireAuthDialog.js";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import RequireAuthUI from "../../../../components/layout/RequireAuthUI.jsx";

/**
 * FavoriteButton toggles a meal as favorite using a heart icon.
 * If not authenticated, opens a dialog with login/register prompt.
 */
const ButtonFavorite = ({ meal }) => {
    const {
        dialogOpen,
        errorMessage,
        showLoginForm,
        triggerAuthDialog,
        handleLoginRedirect,
        reset,
        setShowLoginForm,
    } = useRequireAuthDialog();

    const { toggleFavorite, alreadyFavorited } = useToggleFavorite(
        meal,
        () => triggerAuthDialog("You must be logged in to favorite meals.")
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
        </>
    );
};

ButtonFavorite.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default ButtonFavorite;
