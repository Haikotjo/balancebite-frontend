import PropTypes from "prop-types";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../context/useModal.js";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

/**
 * A small icon button that navigates to the diet update page.
 * Navigates to `/update-diet/:id`. Sluit modal als die open is.
 */
const ButtonUpdateDiet = ({ dietId }) => {
    const navigate = useNavigate();
    const { closeModal } = useModal();

    const handleClick = () => {
        closeModal();
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
