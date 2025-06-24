import PropTypes from "prop-types";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import {useModal} from "../../../../context/useModal.js";

/**
 * A small, animated icon button that navigates to the meal update page.
 *
 * Uses a custom animated button component for styling and interaction.
 * Designed to be portable and React Native friendly.
 *
 * @component
 * @param {Object} props
 * @param {string|number} props.mealId - ID of the meal to update.
 * @returns {JSX.Element}
 */
const ButtonUpdateMeal = ({ mealId }) => {
    const navigate = useNavigate();
    const { closeModal } = useModal();       // haal closeModal uit de hook

    const handleClick = () => {
        closeModal();                          // sluit de modal (no-op als je niet in een modal bent)
        navigate(`/update-meal/${mealId}`);    // navigeer daarna pas
    };

    return (
        <CustomIconButton
            onClick={handleClick}
            icon={<Pencil size={20} color="white" />}
            size={35}
        />
    );
};

ButtonUpdateMeal.propTypes = {
    mealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ButtonUpdateMeal;
