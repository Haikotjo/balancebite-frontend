import PropTypes from "prop-types";
import { Maximize, Minimize } from "lucide-react";
import { useModal } from "../../../../context/useModal.js";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import DietModal from "../dietmodal/DietModal.jsx";

const ButtonOpenDiet = ({ diet, isPinned = false }) => {
    const { openModal, closeModal, modalType, modalData } = useModal();

    if (!diet?.id) return null;

    const isOpen = modalType === "diet" && modalData?.id === diet.id;

    const handleClick = () => {
        isOpen
            ? closeModal()
            : openModal(<DietModal diet={diet} isPinned={isPinned} />, "diet", { id: diet.id });
    };

    return (
        <CustomIconButton
            onClick={handleClick}
            icon={isOpen ? <Minimize size={20} color="white" /> : <Maximize size={20} color="white" />}
            size={35}
        />
    );
};

ButtonOpenDiet.propTypes = {
    diet: PropTypes.object.isRequired,
    isPinned: PropTypes.bool,
};

export default ButtonOpenDiet;
