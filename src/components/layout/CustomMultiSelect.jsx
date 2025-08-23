// src/components/layout/CustomMultiSelect.jsx
// Underlined textfield look (like CustomFloatingSelect) with stable multi-select behavior.
// Fixes:
// 1) First click flicker by not toggling onClick (always open instead).
// 2) Closing after each selection by treating the portal dropdown as "inside" and
//    stopping outside-click propagation.

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
    const [searchText, setSearchText] = useState(""); // simple inline filter by typed text
    const containerRef = useRef(null);
    const dropdownRef = useRef(null); // <-- portal dropdown ref

    // Close on pointerdown outside (treat portal as inside)
    useEffect(() => {
        const handlePointerDownOutside = (e) => {
            const inContainer = containerRef.current?.contains(e.target);
            const inDropdown = dropdownRef.current?.contains(e.target);
            if (!inContainer && !inDropdown) {
                setIsOpen(false);
            }
        };
        document.addEventListener("pointerdown", handlePointerDownOutside);
        return () => document.removeEventListener("pointerdown", handlePointerDownOutside);
    }, []);

    // Sync internal state when parent value changes
    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    // Toggle option selection (keep menu open)
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

    // Filtering
    const normalizedQuery = searchText.trim().toLowerCase();
    const filteredOptions = normalizedQuery
        ? options.filter((o) => o.label.toLowerCase().includes(normalizedQuery))
        : options;

    // Preview text (comma-joined labels)
    const previewText =
        selectedValues.length > 0
            ? options
                .filter((opt) => selectedValues.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
            : "";

    // Compute dropdown position (relative to input; rendered in portal)
    const rect = containerRef.current?.getBoundingClientRect();
    const dropdownStyle = rect
        ? {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            position: "absolute",
            zIndex: 30
        }
        : {};

    return (
        <CustomBox ref={containerRef} className={clsx("relative w-full mt-4", containerClassName)}>
            <CustomBox className="relative w-full">
                {/* Underlined input. We allow typing to filter but display selected labels. */}
                <input
                    type="text"
                    value={previewText}                     // show selected labels
                    onChange={() => { /* noop: value driven by selection */ }}
                    onClick={() => setIsOpen(true)}         // FIX 1: do not toggle; always open
                    onFocus={() => setIsOpen(true)}         // ensure open on focus
                    placeholder={label || placeholder}
                    readOnly={false}                        // allow typing for filter
                    onInput={(e) => {
                        setSearchText(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    className={clsx(
                        `
              w-full
              border-0 border-b focus:border-b-2
              py-2 text-sm
              bg-transparent
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-0
              pr-8
            `,
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

            {/* Dropdown (portal) */}
            {isOpen &&
                createPortal(
                    <CustomBox
                        ref={dropdownRef}
                        // FIX 2: clicks inside dropdown must not bubble to the document outside-listener
                        onPointerDown={(e) => e.stopPropagation()}
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
                                            // Keep focus; prevent native blur/close. Then toggle.
                                            e.preventDefault();
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
