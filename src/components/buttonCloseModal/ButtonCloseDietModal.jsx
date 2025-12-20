import PropTypes from "prop-types";
import { ArrowBigLeft  } from "lucide-react";
import { useModal } from "../../context/useModal.js";
import CustomIconButton from "../layout/CustomIconButton.jsx";

const ButtonCloseDietModal = ({ iconSize = 20, size = 35 }) => {
    const { closeModal } = useModal();

    return (
        <CustomIconButton
            onClick={closeModal}
            icon={<ArrowBigLeft  size={iconSize} color="white" />}
            size={size}
        />
    );
};

ButtonCloseDietModal.propTypes = {
    iconSize: PropTypes.number,
    size: PropTypes.number,
};

export default ButtonCloseDietModal;
