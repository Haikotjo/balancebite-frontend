import { useState } from "react";
import PropTypes from "prop-types";
import { Heart } from "lucide-react";
import ErrorDialog from "../layout/ErrorDialog.jsx";
import { useToggleFavorite } from "../../hooks/useToggleFavorite.js";
import CustomIconButton from "../layout/CustomIconButton.jsx";

/**
 * FavoriteButton toggles a meal as favorite using a heart icon.
 * It shows an error dialog if the user is not authenticated.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.meal - The meal object to be favorited or unfavorited.
 * @returns {JSX.Element} Rendered favorite toggle button.
 */
const FavoriteButton = ({ meal }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Hook to handle toggling favorite status
    const { toggleFavorite, alreadyFavorited } = useToggleFavorite(meal, () => {
        setErrorMessage("You must be logged in to favorite meals.");
        setDialogOpen(true);
    });

    return (
        <>
            {/* Custom animated icon button with heart icon */}
            <CustomIconButton
                onClick={toggleFavorite}
                bgColor="bg-error"
                icon={
                    <Heart
                        size={20}
                        color="white" // stroke color
                        fill={alreadyFavorited ? "white" : "none"} // filled if already favorited
                    />
                }
            />

            {/* Error dialog for unauthenticated access */}
            <ErrorDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                message={errorMessage}
            />
        </>
    );
};

FavoriteButton.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default FavoriteButton;
