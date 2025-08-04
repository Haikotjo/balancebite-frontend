// src/components/layout/CustomCardChip.jsx

import PropTypes from "prop-types";
import clsx from "clsx";
import CustomBox from "./CustomBox.jsx";

/**
 * CustomCardChip — volledig flexibel.
 * Styling bepaal je bij implementatie via `className` en `textClassName`.
 * Inhoud via `children`.
 */
const CustomCardChip = ({
                            children,
                            onClick,
                            className = "",
                            textClassName = "",
                        }) => {

    console.log("CustomCardChip received children:", children);

    return (
        <CustomBox
            onClick={onClick}
            className={clsx(
                "rounded-full border cursor-pointer transition-colors duration-200",
                className
            )}
        >
            <CustomBox className={textClassName}>
                {children}
            </CustomBox>
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
