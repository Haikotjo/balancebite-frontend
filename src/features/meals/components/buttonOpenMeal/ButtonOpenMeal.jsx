import PropTypes from "prop-types";
import { Maximize, Minimize } from "lucide-react";
import { motion } from "framer-motion";
import { useModal } from "../../../../context/useModal.js";
import MealModal from "../mealModal/MealModal.jsx";

const ButtonOpenMeal = ({ meal, isPinned = false }) => {
    const { openModal, closeModal, modalType, modalData } = useModal();
    if (!meal?.id) return null;

    const isOpen = modalType === "meal" && modalData?.id === meal.id;

    const handleClick = () => {
        isOpen
            ? closeModal()
            : openModal(<MealModal meal={meal} isPinned={isPinned} />, "meal", { id: meal.id });
    };

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-full w-full items-center justify-center rounded-xl bg-black/50 transition-colors hover:bg-black/70"
        >
            {isOpen
                ? <Minimize size={18} color="white" />
                : <Maximize size={18} color="white" />
            }
        </motion.button>
    );
};

ButtonOpenMeal.propTypes = {
    meal: PropTypes.object.isRequired,
    isPinned: PropTypes.bool,
};

export default ButtonOpenMeal;