import React from "react";
import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";

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
    const InputComponent = multiline ? "textarea" : "input";

    return (
        <CustomBox className={`relative w-full mt-4 ${className}`}>
            <InputComponent
                id={name}
                name={name}
                ref={ref} // ✅ ref via forwardRef
                type={multiline ? undefined : type}
                placeholder=" "
                rows={multiline ? rows : undefined}
                {...rest}
                className={`peer w-full border ${error ? "border-error" : "border-primary"} rounded px-3 ${inputPaddingTop} pb-2 text-sm bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] text-[var(--text-light)] dark:text-[var(--text-dark)] focus:outline-none focus:border-success resize-none`}
            />
            <label
                htmlFor={name}
                className="absolute left-3 -top-2 px-1 text-xs text-primary peer-focus:text-primary peer-focus:text-xs peer-focus:-top-2 transition-all duration-200 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]"
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
