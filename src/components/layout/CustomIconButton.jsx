// CustomIconButton.jsx
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { cloneElement, isValidElement } from "react";
import CustomBox from "../layout/CustomBox.jsx";

/** Reusable animated icon button with dynamic size. */
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
    const wrapperProps = useMotion && !disableScale ? { whileTap:{scale:0.9}, whileHover:{scale:1.15} } : {};

    // If the passed icon has no explicit size, scale it to ~60% of button size
    const finalIcon = isValidElement(icon) && icon.props.size == null
        ? cloneElement(icon, { size: Math.round(size * 0.6) })
        : icon;

    return (
        <Wrapper {...wrapperProps} className="transition-transform duration-100 ease-in-out">
            <CustomBox
                onClick={onClick}
                className={`cursor-pointer ${bgColor} rounded-xl flex items-center justify-center ${className}`}
                style={{ width: size, height: size }} // <-- uses size prop
            >
                {finalIcon}
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
