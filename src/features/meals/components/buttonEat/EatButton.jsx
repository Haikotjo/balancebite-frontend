import PropTypes from "prop-types";
import { Utensils } from "lucide-react";
import { motion } from "framer-motion";

import { useConsumeMeal } from "../../../../hooks/useConsumeMeal.js";
import { useRequireAuthDialog } from "../../../../hooks/useRequireAuthDialog.js";

import CustomModal from "../../../../components/layout/CustomModal.jsx";
import RequireAuthUI from "../../../../components/layout/RequireAuthUI.jsx";
import NutritionPieOverview from "../../../../components/nutritionPieOverview/NutritionPieOverview.jsx";

const EatButton = ({ meal, refetchRecommendedNutrition }) => {
    const {
        handleConsumeMeal,
        isModalOpen,
        setModalOpen,
        isAuthenticated,
    } = useConsumeMeal({
        meal,
        refetchRecommendedNutrition,
    });

    const {
        dialogOpen,
        errorMessage,
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
            <motion.button
                type="button"
                onClick={handleClick}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-full w-full items-center justify-center rounded-xl bg-primary/80 transition-colors hover:bg-primary"
            >
                <Utensils size={18} color="white" />
            </motion.button>

            <RequireAuthUI
                dialogOpen={dialogOpen}
                onClose={reset}
                message={errorMessage}
                showLoginForm={showLoginForm}
                onLoginClose={() => setShowLoginForm(false)}
                onLoginSuccess={() => setShowLoginForm(false)}
                onLoginRedirect={handleLoginRedirect}
            />

            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                contentClassName="max-w-sm md:max-w-2xl lg:max-w-3xl"
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
