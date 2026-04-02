import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";
import { useEffect, useRef, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "./CustomButton.jsx";
import CustomIconButton from "./CustomIconButton.jsx";

const CustomFloatingSelectNew = ({
                                     label,
                                     value,
                                     onChange,
                                     options = [],
                                     disabled = false,
                                     error,
                                     helperText,
                                     className = "",
                                     variant = "underline",
                                 }) => {
    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const wrapperRef = useRef(null);

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    useEffect(() => {
        if (value && value.label) {
            setInputValue(value.label);
        } else {
            setInputValue("");
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const borderClasses = variant === "outlined"
        ? `border-2 rounded-2xl px-4 ${error ? "border-error" : isFocused ? "border-primary ring-4 ring-primary/10" : "border-gray-200 dark:border-gray-700"}`
        : `border-b-2 rounded-t-xl px-2 ${error ? "border-error" : isFocused ? "border-primary bg-gray-50/50 dark:bg-gray-800/30" : "border-gray-300 dark:border-gray-600"}`;

    return (
        <CustomBox ref={wrapperRef} className={`relative w-full ${className}`}>
            <CustomBox className={`relative flex items-center h-12 transition-all duration-200 ${borderClasses}`}>

                {/* Floating Label */}
                <CustomTypography
                    as="label"
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
                        ${(isFocused || inputValue)
                        ? "-top-2.5 text-xs font-bold text-primary bg-white px-2"
                        : "top-3.5 text-sm text-gray-500"}`}
                >
                    {label}
                </CustomTypography>

                <input
                    id={label}
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                        setShowDropdown(true);
                    }}
                    disabled={disabled}
                    className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-sm text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
                    autoComplete="off"
                />

                {/* Icon Section */}
                <CustomBox className="flex items-center gap-1 pl-2">
                    {inputValue && !disabled && (
                        <CustomButton
                            variant="link"
                            onClick={() => {
                                onChange(null);
                                setInputValue("");
                            }}
                            className="p-1 !no-underline text-gray-400 hover:text-error transition-colors"
                            aria-label="Clear selection"
                        >
                            <X size={14} />
                        </CustomButton>
                    )}
                    <CustomIconButton
                        icon={
                            <ChevronDown
                                className={`transition-transform duration-300 ${showDropdown ? "rotate-180 text-primary" : ""}`}
                            />
                        }
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(!showDropdown);
                            setIsFocused(true);
                        }}
                        size={28}
                        iconSize={18}
                        bgColor="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                        className="rounded-full"
                    />
                </CustomBox>
            </CustomBox>

            <AnimatePresence>
                {showDropdown && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute left-0 w-full z-50 mt-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <CustomBox
                                    key={option.value}
                                    className={`px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors
                                        ${value?.value === option.value ? "bg-primary/10 text-primary font-semibold" : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                                    onClick={() => {
                                        onChange(option);
                                        setInputValue(option.label);
                                        setShowDropdown(false);
                                        setIsFocused(false);
                                    }}
                                >
                                    {option.label}
                                    {value?.value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </CustomBox>
                            ))
                        ) : (
                            <CustomBox className="px-4 py-6 text-center text-gray-400 italic text-sm">No Results</CustomBox>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {helperText && (
                <CustomTypography variant="small" className="text-xs mt-1.5 ml-2 text-error">
                    {helperText}
                </CustomTypography>
            )}
        </CustomBox>
    );
};

CustomFloatingSelectNew.propTypes = {
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
    variant: PropTypes.oneOf(["underline", "outlined"]),
};

export default CustomFloatingSelectNew;