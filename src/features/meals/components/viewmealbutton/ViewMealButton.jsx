import PropTypes from "prop-types";
import { SquareArrowOutUpRight } from "lucide-react";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

/**
 * ViewMealButton — opens the meal in a new browser tab/window.
 *
 * @param {Object} props
 * @param {string|number} props.mealId - ID of the meal to view.
 * @param {number} [props.iconSize=35] - Button dimensions.
 */
const ViewMealButton = ({ mealId, iconSize = 35 }) => {

    const handleClick = () => {
        window.open(`/meal/${mealId}`, "_blank", "noopener,noreferrer");
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
