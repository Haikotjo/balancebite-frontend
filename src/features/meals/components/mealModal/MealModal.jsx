// src/features/meals/components/modal/MealModal.jsx
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Minimize2 } from "lucide-react"
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import MealCard from "../mealCard/MealCard.jsx";

const MealModal = ({ isOpen, onClose, meal }) => {
    if (!isOpen || !meal) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <CustomBox
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center px-4"
            onClick={handleOverlayClick}
        >
            <CustomBox
                className="relative bg-lightBackground dark:bg-darkBackground w-full max-w-4xl rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-14 left-3 z-50 text-white bg-[rgba(0,0,0,0.4)] rounded-xl p-1 shadow-md transition transform hover:scale-110"
                    aria-label="Close"
                >
                    <Minimize2 className="w-6 h-6 sm:w-7 sm:h-7"/>
                </button>


                {/* Meal content */}
                <MealCard meal={meal} viewMode="page"/>
            </CustomBox>
        </CustomBox>,
        document.body
    );
};

MealModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    meal: PropTypes.object,
};

export default MealModal;
