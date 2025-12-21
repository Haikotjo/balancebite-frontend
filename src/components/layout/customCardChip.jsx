// src/components/layout/CustomCardChip.jsx

import PropTypes from "prop-types";
import clsx from "clsx";
import CustomBox from "./CustomBox.jsx";

/**
 * CustomCardChip — fully flexible.
 * Styling is defined at implementation level via `className` and `textClassName`.
 * Content is provided via `children`.
 */
const CustomCardChip = ({
                            children,
                            onClick,
                            className = "",
                            textClassName = "",
                        }) => {


    return (
        <CustomBox
            onClick={onClick}
            className={clsx(
                "rounded-full border cursor-pointer transition-colors duration-200",
                className
            )}
        >
            {textClassName ? (
                <CustomBox className={textClassName}>
                    {children}
                </CustomBox>
            ) : (
                children
            )}
        </CustomBox>
    );

};

CustomCardChip.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    textClassName: PropTypes.string,
};

export default CustomCardChip;
