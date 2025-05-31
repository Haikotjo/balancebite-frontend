import PropTypes from "prop-types";
import React from "react";
import clsx from "clsx";

/**
 * Custom AppBar component.
 * Background color and layout fully customizable via Tailwind classes.
 * Positioning (fixed, sticky, etc.) is now controlled entirely via className.
 */
const CustomAppBar = React.forwardRef(({ children, className, bgColor = "bg-primary", ...props }, ref) => (
    <header
        ref={ref}
        className={clsx(
            bgColor,
            "w-full z-50 shadow-md",
            className
        )}
        {...props}
    >
        {children}
    </header>
));

CustomAppBar.displayName = "CustomAppBar";

CustomAppBar.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    bgColor: PropTypes.string,
};

export default CustomAppBar;
