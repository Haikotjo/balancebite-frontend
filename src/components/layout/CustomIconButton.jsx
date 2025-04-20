import PropTypes from "prop-types";
import { motion } from "framer-motion";
import CustomBox from "../layout/CustomBox.jsx";

/**
 * Reusable animated icon button with customizable background color.
 *
 * @param {JSX.Element} icon - The icon element to display inside the button.
 * @param {Function} onClick - Callback when the button is clicked.
 * @param {string} [bgColor="bg-[rgba(0,0,0,0.5)]"] - Tailwind class for background color.
 * @param {number} [size=35] - Diameter of the button.
 * @param {string} [className] - Optional extra classes for outer styling.
 * @returns {JSX.Element}
 */
const CustomIconButton = ({
                              icon,
                              onClick,
                              bgColor = "bg-[rgba(0,0,0,0.5)]",
                              size = 35,
                              className = "",
                          }) => {
    return (
        <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.15 }}
            className="transition-transform duration-200 ease-in-out"
        >
            <CustomBox
                onClick={onClick}
                className={`cursor-pointer ${bgColor} rounded-[40%] shadow-md flex items-center justify-center text-white ${className}`}
                style={{ width: size, height: size }}
            >
                {icon}
            </CustomBox>
        </motion.div>
    );
};

CustomIconButton.propTypes = {
    icon: PropTypes.element.isRequired,
    onClick: PropTypes.func.isRequired,
    bgColor: PropTypes.string,
    size: PropTypes.number,
    className: PropTypes.string, // ✅ toegevoegd
};

export default CustomIconButton;
