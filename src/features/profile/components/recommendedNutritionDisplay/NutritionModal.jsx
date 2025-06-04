import { useEffect } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";


/**
 * NutritionModal — nette modal met standaardlayout:
 * - padding
 * - gescheiden content + action section
 * - mooi gecentreerd
 */
const NutritionModal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return ReactDOM.createPortal(
        <CustomBox
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleOverlayClick}
        >
            <CustomBox
                className="bg-white dark:bg-cardDark rounded-2xl shadow-2xl max-w-xl w-full mx-4 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Content bovenin */}
                <CustomBox className="mb-6">{children}</CustomBox>

                {/* Knop onderaan */}
                <CustomBox className="flex justify-end">
                    <CustomButton
                        onClick={onClose}
                        className="bg-primary text-white px-4 py-2 rounded"
                    >
                        Close
                    </CustomButton>
                </CustomBox>
            </CustomBox>
        </CustomBox>,
        document.body
    );
};

NutritionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default NutritionModal;
