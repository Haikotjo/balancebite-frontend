import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * CustomFloatingSelect – Underlined textfield look (like CustomTextField),
 * with searchable dropdown behavior preserved.
 *
 * Controlled component for { value, label } options.
 * - Typing filters options
 * - Click outside closes dropdown
 * - Clear icon resets selection
 * - Hidden <select> kept for form compatibility
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
    const wrapperRef = useRef(null);

    // Filter options by typed text
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Sync input with external value
    useEffect(() => {
        if (value && value.label) {
            setInputValue(value.label);
        } else {
            setInputValue("");
        }
    }, [value]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <CustomBox ref={wrapperRef} className={`relative w-full mt-4 ${className}`}>
            <CustomBox className="relative w-full">
                {/* Visible input: underlined style to match CustomTextField */}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={(e) => {
                        e.target.select();
                        setShowDropdown(true);
                    }}
                    placeholder={label}
                    disabled={disabled}
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
            pr-8
            ${disabled ? "cursor-not-allowed opacity-70" : ""}
          `}
                    aria-invalid={!!error}
                    aria-describedby={helperText ? `${label}-helper` : undefined}
                />

                {/* Clear icon */}
                {Boolean(value?.value || inputValue) && !disabled && (
                    <button
                        type="button"
                        onClick={() => {
                            onChange(null);
                            setInputValue("");
                            setShowDropdown(false);
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 p-1"
                        aria-label="Clear selection"
                        tabIndex={-1}
                    >
                        <X size={18} />
                    </button>
                )}
            </CustomBox>

            {/* Hidden native select to keep form semantics if needed */}
            <select
                value={value ? value.value : ""}
                onChange={(e) => {
                    const selected = options.find((opt) => String(opt.value) === e.target.value);
                    onChange(selected || null);
                }}
                disabled={disabled}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
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

            {/* Dropdown list */}
            {showDropdown && filteredOptions.length > 0 && !disabled && (
                <CustomBox className="absolute left-0 w-full z-30 mt-1 max-h-60 overflow-y-auto border border-gray-400 dark:border-gray-600 rounded shadow bg-lightBackground dark:bg-darkBackground">
                    {filteredOptions.map((option) => (
                        <CustomBox
                            key={option.value}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-primary hover:text-white"
                            onClick={() => {
                                onChange(option);
                                setInputValue(option.label);
                                setShowDropdown(false);
                            }}
                            role="option"
                            aria-selected={value?.value === option.value}
                        >
                            {option.label}
                        </CustomBox>
                    ))}
                </CustomBox>
            )}

            {/* Helper text (error style like CustomTextField) */}
            {helperText && (
                <CustomTypography
                    id={`${label}-helper`}
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
