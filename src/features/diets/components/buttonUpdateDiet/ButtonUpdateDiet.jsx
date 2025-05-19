import PropTypes from "prop-types";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";


/**
 * A small icon button that navigates to the diet update page.
 * Navigates to `/update-diet/:id`.
 *
 * @component
 * @param {Object} props
 * @param {string|number} props.dietId - ID of the diet to update.
 * @returns {JSX.Element}
 */
const ButtonUpdateDiet = ({ dietId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/update-diet/${dietId}`);
    };

    return (
        <CustomIconButton
            onClick={handleClick}
            icon={<Pencil size={20} color="white" />}
            size={35}
        />
    );
};

ButtonUpdateDiet.propTypes = {
    dietId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ButtonUpdateDiet;
