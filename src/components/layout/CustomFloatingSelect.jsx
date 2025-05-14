import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * CustomFloatingSelect – A controlled floating-label select input field for { value, label } objects.
 */
const CustomFloatingSelect = ({
                                  label,
                                  value,
                                  onChange,
                                  options = [],
                                  disabled = false,
                                  error,
                                  helperText,
                                  className = "",
                              }) => {
    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    useEffect(() => {
        if (value && value.label) {
            setInputValue(value.label);
        } else {
            setInputValue("");
        }
    }, [value]);

    return (
        <CustomBox className={`relative w-full mt-4 ${className}`}>
            <input
                type="text"
                value={inputValue}
                onChange={e => {
                    setInputValue(e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={e => {
                    e.target.select();
                    setShowDropdown(true);
                }}
                placeholder={`Type to search ${label}`}
                disabled={disabled}
                className={`peer w-full border rounded px-3 pt-5 pb-1 text-sm dark:bg-gray-800 bg-white text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    error ? "border-error" : "border-primary"
                } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />

            {/* Clear-knop */}
            {value?.value && (
                <X
                    size={20}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                        onChange(null);
                        setInputValue("");
                    }}
                />
            )}

            {/* Verborgen native select voor formulier-compatibiliteit */}
            <select
                value={value ? value.value : ""}
                onChange={e => {
                    const selected = options.find(opt => opt.value === e.target.value);
                    onChange(selected || null);
                }}
                disabled={disabled}
                className="hidden"
            >
                <option value="" disabled>-- Select {label} --</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Dropdownlijst */}
            {showDropdown && filteredOptions.length > 0 && (
                <div className="absolute bg-white dark:bg-gray-800 w-full z-10 mt-1 max-h-60 overflow-y-auto border rounded shadow">
                    {filteredOptions.map(option => (
                        <div
                            key={option.value}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-primary hover:text-white"
                            onClick={() => {
                                onChange(option);
                                setInputValue(option.label);
                                setShowDropdown(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}

            {label && (
                <label className="absolute left-3 -top-2 bg-white dark:bg-gray-800 px-1 text-xs text-primary peer-focus:text-primary peer-focus:text-xs peer-focus:-top-2 transition-all duration-200">
                    {label}
                </label>
            )}

            {helperText && (
                <CustomTypography variant="small" color="text-error" className="text-xs mt-1">
                    {helperText}
                </CustomTypography>
            )}
        </CustomBox>
    );
};

CustomFloatingSelect.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    className: PropTypes.string,
};

export default CustomFloatingSelect;
