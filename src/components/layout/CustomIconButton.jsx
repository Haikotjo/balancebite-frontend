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
 * @param disableScale
 * @param useMotion
 * @returns {JSX.Element}
 */
const CustomIconButton = ({
                              icon,
                              onClick,
                              bgColor = "bg-[rgba(0,0,0,0.5)]",
                              size = 35,
                              className = "",
                              disableScale = false,
                              useMotion = true,
                          }) => {
    const Wrapper = useMotion ? motion.div : "div";

    const wrapperProps = useMotion && !disableScale
        ? {
            whileTap: { scale: 0.9 },
            whileHover: { scale: 1.15 },
        }
        : {};

    return (
        <Wrapper {...wrapperProps} className="transition-transform duration-200 ease-in-out">
            <CustomBox
                onClick={onClick}
                className={`cursor-pointer ${bgColor} rounded-[40%] flex items-center justify-center ${className}`}
                style={{ width: size, height: size }}
            >
                {icon}
            </CustomBox>
        </Wrapper>
    );
};

CustomIconButton.propTypes = {
    icon: PropTypes.element.isRequired,
    onClick: PropTypes.func.isRequired,
    bgColor: PropTypes.string,
    size: PropTypes.number,
    className: PropTypes.string,
    disableScale: PropTypes.bool,
    useMotion: PropTypes.bool,
};

export default CustomIconButton;