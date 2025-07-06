// src/components/layout/CustomButton.jsx
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

/**
 * General-purpose button met Tailwind styling en toekomst‑proof API.
 *
 * @param {object} props
 * @param {React.ElementType} [as] – Het element om te renderen (button, a, TouchableOpacity, …).
 * @param {React.ReactNode} children – Inhoud van de knop.
 * @param {Function} onClick – Callback bij click/tap.
 * @param {string} [className] – Extra Tailwind‑classes.
 * @param {string} [type] – Button‑type (button, submit, reset).
 * @param {boolean} [disabled] – Uitschakel‑state.
 * @returns {JSX.Element}
 */
const CustomButton = React.forwardRef(function CustomButton(
    { as: Component = "button", children, onClick, className = "", type = "button", disabled = false, variant = "default", ...props },
    ref
) {
    return (
        <Component
            ref={ref}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "text-sm rounded-md transition-all",
                variant === "link"
                    ? "p-0 underline text-primary hover:text-primary/60"
                    : "px-2 py-1 hover:bg-accent",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
});


CustomButton.propTypes = {
    as: PropTypes.elementType,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    disabled: PropTypes.bool,
    variant: PropTypes.oneOf(["default", "link"]),
};


export default CustomButton;
