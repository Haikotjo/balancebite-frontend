import { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import PropTypes from "prop-types";

const CustomMultiSelect = ({
                               label,
                               options,
                               value = [],
                               onChange,
                               placeholder = "Select...",
                               containerClassName = "",
                               className = ""
                           }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState(value);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    const toggleOption = (optionValue) => {
        const newValue = selectedValues.includes(optionValue)
            ? selectedValues.filter((val) => val !== optionValue)
            : [...selectedValues, optionValue];
        setSelectedValues(newValue);
        onChange(newValue);
    };

    return (
        <CustomBox ref={dropdownRef} className={`relative w-full mt-4 ${containerClassName}`}>
            {label && (
                <label className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-1 text-[0.6rem] text-primary z-10">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 border-primary focus:outline-none flex justify-between items-center ${className}`}
            >
                <span className="truncate">
                    {selectedValues.length > 0
                        ? options.filter(opt => selectedValues.includes(opt.value)).map(opt => opt.label).join(", ")
                        : placeholder}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded bg-white dark:bg-gray-800 shadow-lg border border-gray-300">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => toggleOption(option.value)}
                            className="cursor-pointer flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option.value)}
                                onChange={() => toggleOption(option.value)}
                                className="mr-2"
                            />
                            <span>{option.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </CustomBox>
    );
};

CustomMultiSelect.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            label: PropTypes.string
        })
    ).isRequired,
    value: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    containerClassName: PropTypes.string,
    className: PropTypes.string
};

export default CustomMultiSelect;
