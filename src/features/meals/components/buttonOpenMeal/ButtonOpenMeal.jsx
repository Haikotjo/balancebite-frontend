import PropTypes from "prop-types";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

/**
 * A small, animated icon button that navigates to a meal's detail view.
 * Can be customized with an optional onClick handler.
 *
 * Designed for easy adaptation to React Native by using CustomIconButton
 * instead of browser-specific components.
 *
 * @component
 * @param {Object} props
 * @param {string|number} props.mealId - ID of the meal to navigate to.
 * @param {Function} [props.onClick] - Optional click handler; if not provided, navigates to `/meal/:id`.
 * @returns {JSX.Element}
 */
const ButtonOpenMeal = ({ mealId, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick !== undefined) {
            console.log("➡️ onClick aanwezig, uitvoeren");
            onClick();
        } else {
            console.log("➡️ Geen onClick, navigeren naar meal page");
            navigate(`/meal/${mealId}`);
        }
    };


    return (
        <CustomIconButton
            onClick={handleClick}
            className="bg-[rgba(0,0,0,0.4)]"
            icon={<ExternalLink size={20} color="white" />}
            size={35}
        />
    );
};

ButtonOpenMeal.propTypes = {
    mealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClick: PropTypes.func,
};

export default ButtonOpenMeal;
