import PropTypes from "prop-types";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useModal } from "../../../../context/useModal.js";

const ButtonUpdateMeal = ({ mealId }) => {
    const navigate = useNavigate();
    const { closeModal } = useModal();

    const handleClick = () => {
        closeModal();
        navigate(`/update-meal/${mealId}`);
    };

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-full w-full items-center justify-center rounded-xl bg-black/50 transition-colors hover:bg-black/70"
        >
            <Pencil size={18} color="white" />
        </motion.button>
    );
};

ButtonUpdateMeal.propTypes = {
    mealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ButtonUpdateMeal;
