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
        // Options
        variant = "underline",           // "underline" | "outlined"
        maxLength,                       // number -> enables counter
        showRemaining = true,            // show counter when maxLength is set
        ...rest
    },
    ref
) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const InputComponent = multiline ? "textarea" : "input";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    // Controlled vs uncontrolled
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

    // Styles
    const baseFieldClasses = `
    w-full py-2 text-sm bg-transparent
    text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0
    ${multiline ? "resize-none" : ""}
  `;
    const underlineClasses = `
    border-0 border-b
    ${error
        ? "border-error focus:border-error"
        : "border-gray-400 dark:border-gray-600 focus:border-primary dark:focus:border-primary"}
    focus:border-b-2
    pr-12
  `;
    const outlinedClasses = `
    border rounded-md px-3
    ${error
        ? "border-error focus:border-error"
        : "border-gray-400 dark:border-gray-600 focus:border-primary dark:focus:border-primary"}
    focus:ring-2 focus:ring-primary/20
    pr-12
  `;

    return (
        <CustomBox className={`relative w-full mt-4 ${className}`}>
            <CustomBox className={`relative w-full ${variant === "outlined" ? "pt-2" : ""}`}>
                <InputComponent
                    id={name}
                    name={name}
                    ref={ref}
                    type={multiline ? undefined : inputType}
                    placeholder={label}
                    rows={multiline ? rows : undefined}
                    maxLength={maxLength}
                    {...rest}
                    onChange={handleChange}
                    className={`${baseFieldClasses} ${variant === "outlined" ? outlinedClasses : underlineClasses}`}
                    aria-invalid={!!error}
                    aria-describedby={helperText ? `${name}-helper` : undefined}
                />

                {/* Password toggle (non-multiline only) */}
                {isPassword && !multiline && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}

                {/* Border break background (masks the border behind the counter) */}
                {variant === "outlined" && typeof maxLength === "number" && showRemaining && (
                    <span
                        aria-hidden="true"
                        className="
              absolute top-1 right-1.5
              h-5 px-7
              bg-white dark:bg-gray-900
              rounded-sm
              pointer-events-none
              z-[1]
            "
                    />
                )}

                {/* Counter: entered / remaining */}
                {typeof maxLength === "number" && showRemaining && (
                    <span
                        className={`
              absolute ${variant === "outlined" ? "top-1.5 right-2" : "top-0 -translate-y-1/2 right-0"}
              text-[11px] leading-none px-1
              text-gray-500 dark:text-gray-400
              pointer-events-none
              z-10
            `}
                        aria-live="polite"
                    >
            {entered} / {remaining}
          </span>
                )}
            </CustomBox>

            {helperText && (
                <CustomTypography
                    id={`${name}-helper`}
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
