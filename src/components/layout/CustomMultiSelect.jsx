import { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import PropTypes from "prop-types";
import CustomButton from "./CustomButton.jsx";
import clsx from "clsx";
import CustomTypography from "./CustomTypography.jsx";
import {createPortal} from "react-dom";

/**
 * CustomMultiSelect component – A reusable multiselect dropdown using only custom layout components.
 * Designed to be fully compatible with both web and React Native structure.
 *
 * @param {Object} props
 * @param {string} props.label – The label shown above the dropdown.
 * @param {Array<{ value: string|number, label: string }>} props.options – All available options to select from.
 * @param {Array<string|number>} [props.value=[]] – Currently selected values.
 * @param {function} props.onChange – Callback when selection changes.
 * @param {string} [props.placeholder="Select..."] – Placeholder text when nothing is selected.
 * @param {string} [props.containerClassName] – Extra class for the container.
 * @param {string} [props.className] – Extra class for the button.
 */
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update internal state if parent-controlled value changes
    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    // Add or remove selected value
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
                <label
                    className="absolute -top-2 left-3 px-1 text-[0.6rem] text-primary z-10 bg-lightBackground dark:bg-darkBackground">

                    {label}
                </label>
            )}

            {/* Trigger button */}
            <CustomButton
                onClick={() => setIsOpen((prev) => !prev)}
                className={clsx(
                    "w-full border rounded px-3 pt-5 pb-1 text-sm bg-lightBackground dark:bg-darkBackground border-primary focus:outline-none flex justify-between items-center",
                    className
                )}
            >
                {/* Selected text preview */}
                <CustomBox
                    className={clsx(
                        "truncate",
                        selectedValues.length === 0 && "text-gray-400 dark:text-gray-500 italic"
                    )}
                >
                    {selectedValues.length > 0
                        ? options
                            .filter((opt) => selectedValues.includes(opt.value))
                            .map((opt) => opt.label)
                            .join(", ")
                        : placeholder}
                </CustomBox>

                <ChevronDown className="h-4 w-4 text-gray-500" />
            </CustomButton>

            {/* Dropdown panel */}
            {isOpen &&
                createPortal(
                    <CustomBox
                        className="absolute z-30 mt-1 w-full max-h-60 overflow-auto rounded bg-lightBackground dark:bg-darkBackground shadow-lg border border-gray-400 dark:border-gray-300"
                        style={{
                            top: dropdownRef.current?.getBoundingClientRect().bottom + window.scrollY,
                            left: dropdownRef.current?.getBoundingClientRect().left,
                            width: dropdownRef.current?.offsetWidth,
                            position: "absolute"
                        }}
                    >
                        {options.map((option) => (
                            <CustomBox
                                key={option.value}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    toggleOption(option.value);
                                }}
                                className="cursor-pointer flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedValues.includes(option.value)}
                                    readOnly
                                    className="mr-2 pointer-events-none"
                                />
                                <CustomTypography as="span">{option.label}</CustomTypography>
                            </CustomBox>
                        ))}

                    </CustomBox>,
                    document.body
                )
            }

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
