import PropTypes from "prop-types";
import { useState } from "react";
import CustomBox from "./CustomBox";
import CustomTypography from "./CustomTypography";

const CustomTooltip = ({ children, text, position = "top" }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <CustomBox
            className="relative flex justify-center items-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}

            {hovered && (
                <CustomBox
                    className={`absolute z-50 px-2 py-1 rounded bg-gray-800 dark:bg-gray-700
                      transition-opacity duration-200 whitespace-nowrap
                      ${position === "top" ? "bottom-full mb-1" : ""}
                      ${position === "bottom" ? "top-full mt-1" : ""}
                      ${position === "left" ? "right-full mr-1" : ""}
                      ${position === "right" ? "left-full ml-1" : ""}
          `}
                >
                    <CustomTypography
                        variant="xsmallCard"
                        className="text-white dark:text-white"
                    >
                        {text}
                    </CustomTypography>
                </CustomBox>
            )}
        </CustomBox>
    );
};

CustomTooltip.propTypes = {
    children: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
    position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};

export default CustomTooltip;
