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
const CustomButton = React.forwardRef(
    (
        {
            as: Component = "button",
            children,
            onClick,
            className = "",
            type = "button",
            disabled = false,
            ...props
        },
        ref
    ) => (
        <Component
            ref={ref}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "text-sm px-2 py-1 rounded-md transition-all",
                "hover:bg-accent hover:text-white",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    )
);

CustomButton.displayName = "CustomButton";

CustomButton.propTypes = {
    as: PropTypes.elementType,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    disabled: PropTypes.bool,
};

export default CustomButton;
