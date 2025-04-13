// src/components/layout/CustomCardChip.jsx

import PropTypes from "prop-types";
import clsx from "clsx";

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
    return (
        <div
            onClick={onClick}
            className={clsx(
                "rounded-full border cursor-pointer transition-colors duration-200",
                className
            )}
        >
            <div className={textClassName}>
                {children}
            </div>
        </div>
    );
};

CustomCardChip.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    textClassName: PropTypes.string,
};

export default CustomCardChip;
