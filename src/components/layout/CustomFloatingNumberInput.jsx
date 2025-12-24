// CustomFloatingNumberInput.jsx
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";

/**
 * Number-like input with a fixed visual suffix (e.g., "(g)").
 * - Keeps onChange(e) signature intact: e.target.value is CLEAN numeric string.
 * - Visual suffix is NOT part of the value.
 * - Prevents wheel changing while focused.
 * - Mobile gets numeric keypad (inputMode="decimal").
 */
const CustomFloatingNumberInput = React.forwardRef(function CustomFloatingNumberInput(
    {
        label,
        name,
        value,
        onChange,
        onBlur,
        error,
        helperText,
        className = "",
        min,
        max,
        step,
        disabled = false,
        placeholder, // optional override; defaults to label
        suffix = "(g)", // fixed visual suffix (e.g., "g" or "gram")
        showSuffix = true,
        variant = "underline", // "underline" | "outlined"
        ...rest
    },
    ref
) {
    const localRef = useRef(null);

    // Prevent mouse wheel from changing value when focused
    useEffect(() => {
        const el = localRef.current;
        if (!el) return;
        const onWheel = (e) => {
            if (document.activeElement === el) e.preventDefault();
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    // Sanitize to a decimal number string (allows one dot)
    const sanitize = (raw) => {
        if (raw == null) return "";
        let s = String(raw).replace(/,/g, ".").replace(/[^0-9.]/g, "");
        const firstDot = s.indexOf(".");
        if (firstDot !== -1) {
            s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
        }
        return s;
    };

    const handleChange = (e) => {
        const clean = sanitize(e.target.value);
        onChange({ target: { value: clean, name } });
    };

    const baseFieldClasses = `
        w-full
        py-2 text-sm
        bg-transparent
        text-gray-900 dark:text-gray-100
        focus:outline-none focus:ring-0
        ${showSuffix ? "pr-8" : "pr-2"}
        ${disabled ? "cursor-not-allowed opacity-70" : ""}
    `;

    const underlineClasses = `
        border-0
        border-b
        ${error
        ? "border-error focus:border-error"
        : "border-gray-400 dark:border-gray-600 focus:border-primary dark:focus:border-primary"}
        focus:border-b-2
    `;

    const outlinedClasses = `
        border
        rounded-md
        px-3
        ${error
        ? "border-error focus:border-error"
        : "border-gray-400 dark:border-gray-600 focus:border-primary dark:focus:border-primary"}
        focus:ring-2 focus:ring-primary/20
    `;

    return (
        <CustomBox className={`relative w-full mt-4 ${className}`}>
            <CustomBox className={`relative w-full ${variant === "outlined" ? "pt-2" : ""}`}>
                {/* Floating label (matches CustomTextField) */}
                <CustomTypography
                    as="label"
                    htmlFor={name}
                    variant="xsmallCard"
                    className="absolute -top-3 left-1 text-gray-600 dark:text-gray-400"
                >
                    {label}
                </CustomTypography>

                <input
                    id={name}
                    name={name}
                    ref={(node) => {
                        localRef.current = node;
                        if (typeof ref === "function") ref(node);
                        else if (ref) ref.current = node;
                    }}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    placeholder={variant === "outlined" ? undefined : label}
                    value={value ?? ""}
                    onChange={handleChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    data-min={min}
                    data-max={max}
                    data-step={step}
                    {...rest}
                    className={`${baseFieldClasses} ${
                        variant === "outlined" ? outlinedClasses : underlineClasses
                    }`}
                    aria-invalid={!!error}
                    aria-describedby={helperText ? `${name || label}-helper` : undefined}
                />

                {/* Visual suffix (not in value) */}
                {showSuffix && (
                    <CustomBox
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400 select-none pointer-events-none"
                        aria-hidden="true"
                    >
                        {suffix}
                    </CustomBox>
                )}
            </CustomBox>

            {helperText && (
                <CustomTypography
                    id={`${name || label}-helper`}
                    variant="small"
                    color="text-error"
                    className="text-xs mt-1"
                >
                    {helperText}
                </CustomTypography>
            )}
        </CustomBox>
    );
});

CustomFloatingNumberInput.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired, // reads e.target.value (numeric string)
    onBlur: PropTypes.func,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    className: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    suffix: PropTypes.string,
    showSuffix: PropTypes.bool,
    variant: PropTypes.oneOf(["underline", "outlined"]),
};

export default CustomFloatingNumberInput;
