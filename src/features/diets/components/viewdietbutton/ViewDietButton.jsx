// ViewDietButton.jsx
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { SquareArrowOutUpRight } from "lucide-react";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import { useContext } from "react";
import { ModalContext } from "../../../../context/ModalContext.jsx";

const ViewDietButton = ({ dietId, iconSize = 35 }) => {
    const navigate = useNavigate();
    const { closeModal } = useContext(ModalContext);

    const handleClick = () => {
        closeModal();
        navigate(`/diet/${dietId}`);
    };

    return (
        <CustomIconButton
            onClick={handleClick}
            icon={<SquareArrowOutUpRight size={20} color="white" />}
            size={iconSize}
        />
    );
};

ViewDietButton.propTypes = {
    dietId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    iconSize: PropTypes.number,
};

export default ViewDietButton;
