import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";

/**
 * CustomSelect – A controlled floating-label select input field.
 */
const CustomSelect = ({
                          label,
                          name,
                          register,
                          value,
                          onChange,
                          error,
                          helperText,
                          disabled = false,
                          options = [],
                          className = "",
                      }) => {
    return (
        <CustomBox className={`relative w-full mt-4 ${className}`}>
            {/* Select input */}
            <select
                id={name}
                name={name}
                {...(register
                    ? register(name)
                    : {
                        value,
                        onChange,
                    })}

                disabled={disabled}
                className={`peer w-full border rounded px-3 pt-5 pb-1 text-sm dark:bg-gray-800 bg-white text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    error ? "border-error" : "border-primary"
                } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
                <option value="" disabled>
                    -- Select {label} --
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Floating label */}
            {label && (
                <label
                    htmlFor={name}
                    className="absolute left-3 -top-2 bg-white dark:bg-gray-800 px-1 text-xs text-primary peer-focus:text-primary peer-focus:text-xs peer-focus:-top-2 transition-all duration-200"
                >
                    {label}
                </label>
            )}

            {/* Helper/error text */}
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

CustomSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    register: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    className: PropTypes.string,
};

export default CustomSelect;
