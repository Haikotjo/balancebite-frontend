import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { SquareArrowOutUpRight } from "lucide-react";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import { useContext } from "react";
import { ModalContext } from "../../../../context/ModalContext.jsx";

/**
 * ViewMealButton — navigates from a modal to the meal detail page and closes the modal.
 *
 * @param {Object} props
 * @param {string|number} props.mealId - ID of the meal to view.
 * @param {number} [props.iconSize=35] - Button dimensions.
 */
const ViewMealButton = ({ mealId, iconSize = 35 }) => {
    const navigate = useNavigate();
    const { closeModal } = useContext(ModalContext);

    const handleClick = () => {
        closeModal();               
        navigate(`/meal/${mealId}`);
    };

    return (
        <CustomIconButton
            onClick={handleClick}
            icon={<SquareArrowOutUpRight size={20} color="white" />}
            size={iconSize}
        />
    );
};

ViewMealButton.propTypes = {
    mealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    iconSize: PropTypes.number,
};

export default ViewMealButton;
