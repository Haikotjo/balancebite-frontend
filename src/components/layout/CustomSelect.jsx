import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";

/**
 * CustomSelect component.
 * Single-value select input, styled like CustomMultiSelect.
 *
 * @param {object} props
 * @returns {JSX.Element}
 */
const CustomSelect = ({
                          label,
                          name,
                          register,
                          value,
                          error,
                          helperText,
                          disabled = false,
                          options = [],
                          className = ""
                      }) => {
    return (
        <CustomBox className="relative w-full mt-4">
            {/* Floating label */}
            {label && (
                <label
                    htmlFor={name}
                    className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-1 text-[0.6rem] text-primary z-10"
                >
                    {label}
                </label>
            )}

            {/* Select input */}
            <select
                id={name}
                {...register(name)}
                defaultValue={value}
                disabled={disabled}
                className={`w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    error ? "border-red-500" : "border-primary"
                } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
            >
                <option value="" disabled>Select {label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Helper text */}
            {helperText && (
                <CustomTypography as="span" className="text-xs text-red-500 mt-1">
                    {helperText}
                </CustomTypography>
            )}
        </CustomBox>
    );
};

CustomSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    error: PropTypes.object,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired
        })
    ).isRequired,
    className: PropTypes.string
};

export default CustomSelect;
