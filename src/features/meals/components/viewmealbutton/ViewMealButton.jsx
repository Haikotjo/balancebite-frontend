import PropTypes from "prop-types";
import { SquareArrowOutUpRight } from "lucide-react";
import { motion } from "framer-motion";

const ViewMealButton = ({ mealId }) => {
    const handleClick = () => {
        window.open(`/meal/${mealId}`, "_blank", "noopener,noreferrer");
    };

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-full w-full items-center justify-center rounded-xl bg-black/50 transition-colors hover:bg-black/70"
        >
            <SquareArrowOutUpRight size={18} color="white" />
        </motion.button>
    );
};

ViewMealButton.propTypes = {
    mealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ViewMealButton;
