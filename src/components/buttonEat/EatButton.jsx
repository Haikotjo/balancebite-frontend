import PropTypes from "prop-types";
import { Utensils } from "lucide-react";
import RecommendedNutritionDisplay from "../recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";
import { useConsumeMeal } from "../../hooks/useConsumeMeal.js";
import CustomIconButton from "../layout/CustomIconButton.jsx";
import CustomModal from "../layout/CustomModal.jsx"; // Zorg ervoor dat CustomModal geïmporteerd wordt
import { useState } from "react";
import LoginRegisterForm from "../navigation/loginRegisterForm/LoginRegisterForm.jsx";
import CustomButton from "../layout/CustomButton.jsx";

/**
 * EatButton allows a user to consume a meal.
 * - If not authenticated, shows login/register form.
 * - On success, displays a modal with updated nutrition.
 * - Uses custom hooks and components for logic and layout.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.meal - The meal object to consume.
 * @param {Function} props.refetchRecommendedNutrition - Callback to update nutrition display.
 * @returns {JSX.Element}
 */
const EatButton = ({ meal, refetchRecommendedNutrition }) => {
    const {
        handleConsumeMeal,
        isModalOpen,
        setModalOpen,
        isDialogOpen,
        setDialogOpen,
        errorMessage,
        isAuthenticated,
    } = useConsumeMeal({
        meal,
        refetchRecommendedNutrition,
    });

    const [showLoginForm, setShowLoginForm] = useState(false);

    /**
     * Triggers login/register form after closing dialog
     */
    const handleLoginRedirect = () => {
        setDialogOpen(false);
        setTimeout(() => {
            setShowLoginForm(true);
        }, 150);
    };

    return (
        <>
            {/* Main action button to consume the meal */}
            <CustomIconButton
                onClick={handleConsumeMeal}
                bgColor="bg-primary"
                icon={<Utensils size={20} color="white" />}
            />

            {/* Error handling modal */}
            <ErrorDialog
                open={isDialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setShowLoginForm(false);
                }}
                message={errorMessage}
                actionLabel={isAuthenticated ? "Go to Profile" : "Login or Register"}
                actionLink={isAuthenticated ? "/profile" : undefined}
                onAction={!isAuthenticated ? handleLoginRedirect : undefined}
            />

            {/* Show login/register form if needed */}
            {!isAuthenticated && showLoginForm && (
                <LoginRegisterForm
                    onClose={() => setShowLoginForm(false)}
                    onLogin={() => setShowLoginForm(false)}
                    onRegister={() => {}}
                    errorMessage={errorMessage}
                />
            )}

            {/* CustomModal for displaying updated nutrition data */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
            >
                <RecommendedNutritionDisplay />
                <CustomButton
                    onClick={() => setModalOpen(false)}
                    className="bg-primary text-white p-2 rounded mt-4"
                >
                    Close
                </CustomButton>
            </CustomModal>
        </>
    );
};

EatButton.propTypes = {
    meal: PropTypes.object.isRequired,
    refetchRecommendedNutrition: PropTypes.func.isRequired,
};

export default EatButton;
