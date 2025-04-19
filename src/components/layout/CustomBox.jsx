// src/components/layout/CustomBox.jsx
import PropTypes from "prop-types";
import clsx from "clsx";
import React from "react";

/**
 * Flexible container met box-border en optionele tag/ref.
 * @param {object} props
 * @param {React.ElementType} [as] – Het HTML‑element (div, section, View, …).
 * @param {string} [className]
 * @param {React.Ref} ref
 */
const CustomBox = React.forwardRef(({ as: Component = "div", className = "", children, ...props }, ref) => (
    <Component ref={ref} className={clsx("box-border", className)} {...props}>
        {children}
    </Component>
));

CustomBox.displayName = "CustomBox";

CustomBox.propTypes = {
    as: PropTypes.elementType,
    children: PropTypes.node,
    className: PropTypes.string,
};

export default CustomBox;
