// CustomMultiSelect.jsx
// Underlined textfield look (like CustomFloatingSelect) with the original multi-select behavior.
import { useRef, useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import PropTypes from "prop-types";
import CustomTypography from "./CustomTypography.jsx";
import clsx from "clsx";
import { createPortal } from "react-dom";

const CustomMultiSelect = ({
                               label,                   // shown as placeholder (like CustomFloatingSelect)
                               options,
                               value = [],
                               onChange,
                               placeholder = "Select...",
                               containerClassName = "",
                               className = ""
                           }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState(value);
    const [searchText, setSearchText] = useState(""); // simple inline filter like typing in visible input
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync internal state when parent value changes
    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    // Toggle option selection
    const toggleOption = (optionValue) => {
        const next = selectedValues.includes(optionValue)
            ? selectedValues.filter((v) => v !== optionValue)
            : [...selectedValues, optionValue];
        setSelectedValues(next);
        onChange(next);
    };

    // Clear all selections
    const clearAll = () => {
        setSelectedValues([]);
        onChange([]);
        setSearchText("");
    };

    // Filtered list (by the visible input text)
    const normalizedQuery = searchText.trim().toLowerCase();
    const filteredOptions = normalizedQuery
        ? options.filter((o) => o.label.toLowerCase().includes(normalizedQuery))
        : options;

    // Build preview text (like a text input's value)
    const previewText =
        selectedValues.length > 0
            ? options
                .filter((opt) => selectedValues.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
            : "";

    // Compute dropdown position (like your original)
    const rect = containerRef.current?.getBoundingClientRect();
    const dropdownStyle = rect
        ? {
            top: rect.bottom + window.scrollY,
            left: rect.left,                 // keeping your original behavior
            width: rect.width,
            position: "absolute",
            zIndex: 30
        }
        : {};

    return (
        <CustomBox ref={containerRef} className={clsx("relative w-full mt-4", containerClassName)}>
            <CustomBox className="relative w-full">
                {/* Underlined input, like CustomFloatingSelect (readOnly so we control text) */}
                <input
                    type="text"
                    value={previewText ? previewText : ""}            // show selected labels
                    onChange={() => { /* noop (readOnly UX) */ }}
                    onClick={() => setIsOpen((p) => !p)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={label || placeholder}                // placeholder-as-label
                    readOnly={false}                                   // allow typing to filter
                    onInput={(e) => {
                        setSearchText(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    className={clsx(
                        `
            w-full
            border-0
            border-b
            focus:border-b-2
            py-2 text-sm
            bg-transparent
            text-gray-900 dark:text-gray-100
            focus:outline-none
            focus:ring-0
            pr-8
          `,
                        // error styling parity can be added via a prop later if needed
                        "border-gray-400 dark:border-gray-600 focus:border-primary dark:focus:border-primary",
                        className
                    )}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                />

                {/* Right icon: clear when selected, otherwise chevron */}
                {selectedValues.length > 0 ? (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 p-1"
                        aria-label="Clear selection"
                        tabIndex={-1}
                    >
                        <X size={18} />
                    </button>
                ) : (
                    <ChevronDown
                        size={18}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 pointer-events-none"
                        aria-hidden="true"
                    />
                )}
            </CustomBox>

            {/* Dropdown (portal), styled like your lists, preserving original behavior */}
            {isOpen &&
                createPortal(
                    <CustomBox
                        className="mt-1 max-h-60 overflow-auto rounded bg-lightBackground dark:bg-darkBackground shadow-lg border border-gray-400 dark:border-gray-300"
                        style={dropdownStyle}
                        role="listbox"
                    >
                        {filteredOptions.length === 0 ? (
                            <CustomBox className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                No results
                            </CustomBox>
                        ) : (
                            filteredOptions.map((option) => {
                                const checked = selectedValues.includes(option.value);
                                return (
                                    <CustomBox
                                        key={option.value}
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // keep focus
                                            toggleOption(option.value);
                                        }}
                                        className={clsx(
                                            "cursor-pointer flex items-center px-4 py-2 text-sm hover:bg-primary/10 dark:hover:bg-gray-700"
                                        )}
                                        role="option"
                                        aria-selected={checked}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            readOnly
                                            className="mr-2 pointer-events-none"
                                        />
                                        <CustomTypography as="span">{option.label}</CustomTypography>
                                    </CustomBox>
                                );
                            })
                        )}
                    </CustomBox>,
                    document.body
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
    value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    containerClassName: PropTypes.string,
    className: PropTypes.string
};

export default CustomMultiSelect;
