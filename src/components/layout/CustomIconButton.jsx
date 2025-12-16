// CustomIconButton.jsx
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { cloneElement, isValidElement } from "react";
import CustomBox from "../layout/CustomBox.jsx";

/** Reusable animated icon button with optional responsive sizing. */
const CustomIconButton = ({
                              icon,
                              onClick,
                              bgColor = "bg-[rgba(0,0,0,0.5)]",
                              size = 35,
                              sizeClassName = "",
                              iconSize,
                              className = "",
                              disableScale = false,
                              useMotion = true,
                          }) => {
    const Wrapper = useMotion ? motion.div : "div";
    const wrapperProps =
        useMotion && !disableScale
            ? { whileTap: { scale: 0.9 }, whileHover: { scale: 1.15 } }
            : {};

    const finalIcon =
        isValidElement(icon) && iconSize != null
            ? cloneElement(icon, { size: iconSize })
            : icon;

    return (
        <Wrapper {...wrapperProps} className="transition-transform duration-100 ease-in-out">
            <CustomBox
                onClick={onClick}
                className={`cursor-pointer ${bgColor} rounded-xl flex items-center justify-center ${sizeClassName} ${className}`}
                style={sizeClassName ? undefined : { width: size, height: size }} // ← belangrijk
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
    sizeClassName: PropTypes.string,
    iconSize: PropTypes.number,
    className: PropTypes.string,
    disableScale: PropTypes.bool,
    useMotion: PropTypes.bool,
};

export default CustomIconButton;
