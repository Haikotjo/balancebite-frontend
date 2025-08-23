import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

/**
 * CustomButton – a general-purpose, theme-aware button.
 *
 * ✅ Backwards compatible:
 *    - `variant="default"` and `variant="link"` behave exactly as before.
 * ✅ Extendable styling:
 *    - Optional `variant="solid" | "outline"` combined with `color="primary" | "error" | "neutral"`.
 *
 * Usage examples:
 *  - Default (legacy):      <CustomButton>Save</CustomButton>
 *  - Link (legacy):         <CustomButton variant="link">Learn more</CustomButton>
 *  - Primary solid:         <CustomButton variant="solid" color="primary">Create</CustomButton>
 *  - Error solid:           <CustomButton variant="solid" color="error">Delete</CustomButton>
 *  - Primary outline:       <CustomButton variant="outline" color="primary">Edit</CustomButton>
 *
 * Props:
 * - as        : Render element (e.g., "button", "a")
 * - children  : Button content
 * - onClick   : Click handler
 * - className : Extra Tailwind classes
 * - type      : Button type (button | submit | reset)
 * - disabled  : Disabled state
 * - variant   : "default" | "link" | "solid" | "outline"
 * - color     : "primary" | "error" | "neutral" (used for "solid"/"outline" only)
 */
const CustomButton = React.forwardRef(function CustomButton(
    {
        as: Component = "button",
        children,
        onClick,
        className = "",
        type = "button",
        disabled = false,
        variant = "default",     // Back-compat default
        color = "primary",       // Only applies to "solid"/"outline"
        ...props
    },
    ref
) {
    // Base, shared button styles
    const base =
        "text-sm rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    // --- Backwards-compatible branches (NO visual change to existing usage) ---
    if (variant === "link") {
        return (
            <Component
                ref={ref}
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={clsx(
                    base,
                    "p-0 underline text-primary hover:text-primary/60",
                    className
                )}
                {...props}
            >
                {children}
            </Component>
        );
    }

    if (variant === "default") {
        return (
            <Component
                ref={ref}
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={clsx(base, "px-2 py-1 hover:bg-accent", className)}
                {...props}
            >
                {children}
            </Component>
        );
    }

    // --- Extended palette (opt-in only) ---
    // Tailwind tokens are expected to exist in your design system:
    //  - bg-primary, text-white, border-error, etc.
    const PALETTE = {
        primary: {
            solid: "bg-primary text-white hover:bg-primary/80",
            outline: "border border-primary text-primary hover:bg-primary/10",
        },
        error: {
            solid: "bg-error text-white hover:bg-error/80",
            outline: "border border-error text-error hover:bg-error/10",
        },
        neutral: {
            solid: "bg-foreground text-white hover:bg-foreground/80",
            outline:
                "border border-divider text-lightText dark:text-darkText hover:bg-accent/40",
        },
    };

    // Fallback to primary palette if an unknown color is passed
    const palette = PALETTE[color] || PALETTE.primary;

    // Determine the visual style for the selected variant
    const look =
        variant === "solid"
            ? palette.solid
            : variant === "outline"
                ? palette.outline
                : "px-2 py-1 hover:bg-accent"; // Defensive fallback; should not be hit for new variants

    return (
        <Component
            ref={ref}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(base, "px-2 py-1", look, className)}
            {...props}
        >
            {children}
        </Component>
    );
});

CustomButton.displayName = "CustomButton";

CustomButton.propTypes = {
    /** Render element (e.g., "button", "a") */
    as: PropTypes.elementType,
    /** Button content */
    children: PropTypes.node.isRequired,
    /** Click handler */
    onClick: PropTypes.func,
    /** Extra Tailwind classes */
    className: PropTypes.string,
    /** Button type */
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    /** Disabled state */
    disabled: PropTypes.bool,
    /** Visual variant (default/link remain legacy-safe) */
    variant: PropTypes.oneOf(["default", "link", "solid", "outline"]),
    /** Color palette for solid/outline variants */
    color: PropTypes.oneOf(["primary", "error", "neutral"]),
};

export default CustomButton;
