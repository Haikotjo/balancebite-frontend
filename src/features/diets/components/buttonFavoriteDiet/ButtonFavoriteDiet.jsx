import PropTypes from "prop-types";
import { Heart } from "lucide-react";
import {useToggleDietFavorite} from "../../utils/hooks/useToggleDietFavorite.js";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import RequireAuthUI from "../../../../components/layout/RequireAuthUI.jsx";
import {useRequireAuthDialog} from "../../../../hooks/useRequireAuthDialog.js";


/**
 * ButtonFavoriteDiet toggles a diet as favorite using a heart icon.
 * If not authenticated, opens a dialog with login/register prompt.
 */
const ButtonFavoriteDiet = ({ diet }) => {
    const {
        dialogOpen,
        errorMessage,
        showLoginForm,
        triggerAuthDialog,
        handleLoginRedirect,
        reset,
        setShowLoginForm,
    } = useRequireAuthDialog();

    const { toggleFavorite, alreadyFavorited } = useToggleDietFavorite(
        diet,
        () => triggerAuthDialog("You must be logged in to favorite diets.")
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

ButtonFavoriteDiet.propTypes = {
    diet: PropTypes.object.isRequired,
};

export default ButtonFavoriteDiet;
