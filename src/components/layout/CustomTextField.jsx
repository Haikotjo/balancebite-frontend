import React, { useState } from "react";
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
        inputPaddingTop = "pt-5",
        ...rest
    },
    ref
) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const InputComponent = multiline ? "textarea" : "input";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <CustomBox className={`relative w-full mt-4 ${className}`}>
            <div className="relative w-full">
                <InputComponent
                    id={name}
                    name={name}
                    ref={ref}
                    type={multiline ? undefined : inputType}
                    placeholder=" "
                    rows={multiline ? rows : undefined}
                    {...rest}
                    className={`peer w-full border ${error ? "border-error" : "border-primary"} rounded px-3 ${inputPaddingTop} pb-2 text-sm bg-lightBackground dark:bg-darkBackground text-gray-900 dark:text-gray-100 focus:outline-none focus:border-success resize-none pr-10`}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            <label
                htmlFor={name}
                className="absolute left-3 -top-2 px-1 text-xs text-primary peer-focus:text-primary peer-focus:text-xs peer-focus:-top-2 transition-all duration-200 bg-lightBackground dark:bg-darkBackground"
            >
                {label}
            </label>

            {helperText && (
                <CustomTypography
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
    inputPaddingTop: PropTypes.string,
};

export default CustomTextField;
