import PropTypes from "prop-types";
import React from "react";
import clsx from "clsx";

/**
 * Custom AppBar component.
 * with support for logo, menu items, and responsive behavior.
 */
const CustomAppBar = React.forwardRef(({ children, className, position = "sticky", bgColor = "bg-primary", ...props }, ref) => (
    <header
        ref={ref}
        className={clsx(
            bgColor, // Use the dynamic background color here
            position === "sticky"
                ? "sticky top-0"
                : position === "fixed"
                    ? "fixed bottom-0 top-auto"
                    : position === "relative"
                        ? "relative"
                        : "",
            "w-full z-50",
            "shadow-md",
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
    position: PropTypes.oneOf(["sticky", "relative", "fixed"]),
    bgColor: PropTypes.string,
};

export default CustomAppBar;
