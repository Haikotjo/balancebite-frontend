import PropTypes from "prop-types";
import { ExternalLink } from "lucide-react";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

/**
 * Icon button to trigger meal-related actions (e.g. open modal).
 * Navigation is no longer handled here; use `onClick` to define behavior.
 *
 * This component is designed to work in both web and React Native
 * by using CustomIconButton as a wrapper.
 *
 * @component
 * @param {Function} props.onClick - Click handler to trigger modal or other custom logic.
 * @returns {JSX.Element}
 */
const ButtonOpenMeal = ({ onClick }) => {
    return (
        <CustomIconButton
            onClick={onClick}
            className="bg-[rgba(0,0,0,0.4)]"
            icon={<ExternalLink size={20} color="white" />}
            size={35}
        />
    );
};

ButtonOpenMeal.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default ButtonOpenMeal;
