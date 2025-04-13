// src/components/mealModal/MealDetailModal.jsx

import PropTypes from "prop-types";
import MealDetailCard from "../mealCardLarge/MealDetailCard.jsx";
import CustomModal from "../layout/CustomModal.jsx";

const MealDetailModal = ({ open, onClose, meal }) => {
    return (
        <CustomModal isOpen={open} onClose={onClose}>
            <MealDetailCard meal={meal} isModal onClose={onClose} />
        </CustomModal>
    );
};

MealDetailModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    meal: PropTypes.object.isRequired,
};

export default MealDetailModal;
