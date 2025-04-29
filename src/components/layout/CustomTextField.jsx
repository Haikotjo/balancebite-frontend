import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";

/**
 * A controlled floating-label text input field.
 */
const CustomTextField = ({
                             label,
                             name,
                             register,
                             error,
                             helperText, // <-- nieuwe prop
                             type = "text",
                             className = "",
                             multiline = false,
                             rows = 4,
                             inputPaddingTop = "pt-5",
                             ...rest
                         }) => {
    const InputComponent = multiline ? "textarea" : "input";

    return (
        <CustomBox className={`relative w-full mt-4 ${className}`}>
            <InputComponent
                id={name}
                type={multiline ? undefined : type}
                placeholder=" "
                rows={multiline ? rows : undefined}
                {...(register ? register(name) : {})}
                {...rest}
                className={`peer w-full border ${error ? "border-error" : "border-primary"} rounded px-3 ${inputPaddingTop} pb-2 text-sm dark:bg-gray-800 bg-white text-black dark:text-white focus:outline-none focus:border-success resize-none`}
            />
            <label
                htmlFor={name}
                className="absolute left-3 -top-2 bg-white dark:bg-gray-800 px-1 text-xs text-primary peer-focus:text-primary peer-focus:text-xs peer-focus:-top-2 transition-all duration-200"
            >
                {label}
            </label>

            {/* Helper/error text onder veld */}
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
};

CustomTextField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    register: PropTypes.func,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    multiline: PropTypes.bool,
    rows: PropTypes.number,
    inputPaddingTop: PropTypes.string,
};

export default CustomTextField;
