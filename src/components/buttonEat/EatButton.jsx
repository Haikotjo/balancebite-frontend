import PropTypes from "prop-types";
import { Utensils } from "lucide-react";
import RecommendedNutritionDisplay from "../recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import { useConsumeMeal } from "../../hooks/useConsumeMeal.js";
import CustomIconButton from "../layout/CustomIconButton.jsx";
import { useRequireAuthDialog } from "../../hooks/useRequireAuthDialog.js";
import RequireAuthUI from "../layout/RequireAuthUI.jsx";
import NutritionModal from "../recommendedNutritionDisplay/NutritionModal.jsx";

const EatButton = ({ meal, refetchRecommendedNutrition }) => {
    const {
        handleConsumeMeal,
        isModalOpen,
        setModalOpen,
        errorMessage,
        isAuthenticated,
    } = useConsumeMeal({
        meal,
        refetchRecommendedNutrition,
    });

    const {
        dialogOpen,
        showLoginForm,
        triggerAuthDialog,
        handleLoginRedirect,
        reset,
        setShowLoginForm,
    } = useRequireAuthDialog();

    const handleClick = () => {
        if (!isAuthenticated) {
            triggerAuthDialog("You must be logged in to consume a meal.");
            return;
        }
        handleConsumeMeal();
    };

    return (
        <>
            {/* Main action button */}
            <CustomIconButton
                onClick={handleClick}
                bgColor="bg-primary"
                icon={<Utensils size={20} color="white" />}
            />

            {/* Reused auth UI */}
            <RequireAuthUI
                dialogOpen={dialogOpen}
                onClose={reset}
                message={errorMessage}
                showLoginForm={showLoginForm}
                onLoginClose={() => setShowLoginForm(false)}
                onLoginSuccess={() => setShowLoginForm(false)}
                onLoginRedirect={handleLoginRedirect}
            />

            {/* Success modal */}
            <NutritionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <RecommendedNutritionDisplay />
            </NutritionModal>
        </>
    );
};

EatButton.propTypes = {
    meal: PropTypes.object.isRequired,
    refetchRecommendedNutrition: PropTypes.func.isRequired,
};

export default EatButton;
