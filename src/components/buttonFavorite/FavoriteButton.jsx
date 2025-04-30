import { useState } from "react";
import PropTypes from "prop-types";
import { Heart } from "lucide-react";
import { useToggleFavorite } from "../../hooks/useToggleFavorite.js";
import CustomIconButton from "../layout/CustomIconButton.jsx";
import RequireAuthUI from "../layout/RequireAuthUI.jsx";
import {useRequireAuthDialog} from "../../hooks/useRequireAuthDialog.js";

/**
 * FavoriteButton toggles a meal as favorite using a heart icon.
 * If not authenticated, opens a dialog with login/register prompt.
 */
const FavoriteButton = ({ meal }) => {
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
                bgColor="bg-error"
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
                onLoginRedirect={handleLoginRedirect} // ✅ juiste actie
            />
        </>
    );
};

FavoriteButton.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default FavoriteButton;
