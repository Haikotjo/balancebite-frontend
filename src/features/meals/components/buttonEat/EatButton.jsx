import PropTypes from "prop-types";
import { Utensils } from "lucide-react";
import {useConsumeMeal} from "../../../../hooks/useConsumeMeal.js";
import {useRequireAuthDialog} from "../../../../hooks/useRequireAuthDialog.js";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import RequireAuthUI from "../../../../components/layout/RequireAuthUI.jsx";
import NutritionPieOverview from "../../../../components/nutritionPieOverview/NutritionPieOverview.jsx";
import CustomModal from "../../../../components/layout/CustomModal.jsx";

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
                bgColor="bg-primary/90"
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
            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
            >
                <NutritionPieOverview onClose={() => setModalOpen(false)} />
            </CustomModal>
        </>
    );
};

EatButton.propTypes = {
    meal: PropTypes.object.isRequired,
    refetchRecommendedNutrition: PropTypes.func.isRequired,
};

export default EatButton;
