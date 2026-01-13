import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";
import { Eye, EyeOff } from "lucide-react";

const CustomTextField = React.forwardRef(function CustomTextField(
    {
        label,
        name,
        error,
        helperText,
        type = "text",
        className = "",
        multiline = false,
        rows = 4,
        variant = "underline",
        maxLength,
        showRemaining = true,
        ...rest
    },
    ref
) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const InputComponent = multiline ? "textarea" : "input";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const isControlled = rest.value !== undefined;
    const [internalValue, setInternalValue] = useState(
        (rest.defaultValue ?? (isControlled ? rest.value : "")) || ""
    );

    useEffect(() => {
        if (isControlled) setInternalValue(rest.value ?? "");
    }, [isControlled, rest.value]);

    const handleChange = (e) => {
        if (!isControlled) setInternalValue(e.target.value);
        rest.onChange?.(e);
    };

    const currentValue = isControlled ? (rest.value ?? "") : internalValue;
    const entered = String(currentValue).length;
    const remaining = typeof maxLength === "number" ? Math.max(0, (maxLength ?? 0) - entered) : null;

    // FIX: Alleen padding rechts als er een oogje of een teller staat
    const hasRightElement = isPassword || (typeof maxLength === "number" && showRemaining);
    const paddingRight = hasRightElement ? "pr-12" : "pr-2";

    const baseFieldClasses = `
        w-full py-2 text-sm bg-transparent text-gray-900 dark:text-gray-100 
        focus:outline-none focus:ring-0 ${multiline ? "resize-none" : ""}
        ${type === 'number' ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''}
    `;

    const underlineClasses = `
        border-0 border-b ${paddingRight}
        ${error ? "border-error" : "border-gray-400 dark:border-gray-600 focus:border-primary"}
        focus:border-b-2
    `;

    const outlinedClasses = `
        border rounded-md px-3 ${paddingRight}
        ${error ? "border-error" : "border-gray-400 dark:border-gray-600 focus:border-primary"}
        focus:ring-2 focus:ring-primary/20
    `;

    return (
        <CustomBox className={`relative w-full mt-4 ${className}`}>
            <CustomBox className={`relative w-full ${variant === "outlined" ? "pt-2" : ""}`}>
                <CustomTypography
                    as="label"
                    htmlFor={name}
                    variant="xsmallCard"
                    className="absolute -top-3 left-1 text-gray-600 dark:text-gray-400"
                >
                    {label}
                </CustomTypography>

                <InputComponent
                    id={name}
                    name={name}
                    ref={ref}
                    type={multiline ? undefined : inputType}
                    rows={multiline ? rows : undefined}
                    maxLength={maxLength}
                    {...rest}
                    onChange={handleChange}
                    className={`${baseFieldClasses} ${variant === "outlined" ? outlinedClasses : underlineClasses}`}
                />

                {isPassword && !multiline && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}

                {typeof maxLength === "number" && showRemaining && (
                    <CustomTypography
                        as="span"
                        variant="xsmallCard"
                        className={`absolute ${variant === "outlined" ? "top-1.5 right-2" : "top-0 -translate-y-1/2 right-0"} text-[11px] text-gray-500`}
                    >
                        {entered} / {remaining}
                    </CustomTypography>
                )}
            </CustomBox>
        </CustomBox>
    );
});


CustomTextField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    multiline: PropTypes.bool,
    rows: PropTypes.number,
    variant: PropTypes.oneOf(["underline", "outlined"]),
    maxLength: PropTypes.number,
    showRemaining: PropTypes.bool,
};

export default CustomTextField;
