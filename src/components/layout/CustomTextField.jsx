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
            <CustomBox className="relative w-full">
                <InputComponent
                    id={name}
                    name={name}
                    ref={ref}
                    type={multiline ? undefined : inputType}
                    placeholder={label}
                    rows={multiline ? rows : undefined}
                    {...rest}
                    className={`
                        w-full
                        border-0
                        border-b
                         ${error
                        ? "border-error focus:border-error"
                        : "border-gray-400 dark:border-gray-600 focus:border-primary dark:focus:border-primary"}
                         focus:border-b-2
                        py-2 text-sm
                        bg-transparent
                        text-gray-900 dark:text-gray-100
                        focus:outline-none
                        focus:ring-0
                        resize-none
                        pr-8
                    `}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </CustomBox>

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
};

export default CustomTextField;
