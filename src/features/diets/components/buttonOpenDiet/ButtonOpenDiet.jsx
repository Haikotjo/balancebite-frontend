import PropTypes from "prop-types";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

/**
 * Icon button to navigate to a diet's detail view.
 * If no onClick is provided, navigates to `/diet/:id`.
 *
 * @component
 * @param {Object} props
 * @param {string|number} props.dietId - ID of the diet to navigate to.
 * @param {Function} [props.onClick] - Optional custom click handler.
 * @returns {JSX.Element}
 */
const ButtonOpenDiet = ({ dietId, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/diet/${dietId}`);
        }
    };

    return (
        <CustomIconButton
            onClick={handleClick}
            icon={<ExternalLink size={20} color="white" />}
            size={35}
        />
    );
};

ButtonOpenDiet.propTypes = {
    dietId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClick: PropTypes.func,
};

export default ButtonOpenDiet;
