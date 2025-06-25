import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { useModal } from "../../../../context/useModal.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import DietCard from "../dietCard/DietCard.jsx";

const DietModal = ({ diet, isPinned = false }) => {
    const { closeModal } = useModal();
    if (!diet) return null;

    return ReactDOM.createPortal(
        <CustomBox className="fixed inset-0 z-[100] flex items-center justify-center">
            <CustomBox
                as="div"
                className="absolute inset-0 bg-black bg-opacity-70"
                onClick={closeModal}
            />

            <CustomBox
                as="div"
                className="relative z-10 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg bg-lightBackground dark:bg-darkBackground"
                onClick={(e) => e.stopPropagation()}
            >

                <DietCard diet={diet} isPinned={isPinned} viewMode="modal" />
            </CustomBox>
        </CustomBox>,
        document.body
    );
};

DietModal.propTypes = {
    diet: PropTypes.object.isRequired,
    isPinned: PropTypes.bool,
};

export default DietModal;
