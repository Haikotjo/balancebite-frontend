// src/components/layout/CustomAutocomplete.jsx
// English code comments.

import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";

/**
 * CustomAutocomplete — text-field styled like CustomTextField with bottom border.
 * - Keyboard nav: ArrowUp/Down, Enter, Escape.
 * - Optional freeSolo.
 * - Optional grouping via groupBy + renderGroup.
 * - Optional clickable endAdornment (e.g., a search icon button).
 */
const CustomAutocomplete = React.forwardRef(function CustomAutocomplete(
    {
        // TextField-like props
        label,
        name,
        error = false,
        helperText = "",
        className = "",
        disabled = false,
        placeholder = "",
        endAdornment = null, // ReactNode (icon)

        // Autocomplete props
        options = [],
        value = null,
        onInputChange = () => {},
        onChange = () => {},
        getOptionLabel = (opt) => (typeof opt === "string" ? opt : ""),
        freeSolo = false,
        renderOption = null,

        // grouping
        groupBy,
        renderGroup,

        classNames = {},
        ...rest
    },
    ref
) {
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Bridge external ref to input element
    useEffect(() => {
        if (!ref) return;
        if (typeof ref === "function") ref(inputRef.current);
        else ref.current = inputRef.current;
    }, [ref]);

    // Initial label from value
    const initialLabel =
        value != null ? (typeof value === "string" ? value : getOptionLabel(value)) : "";

    const [inputValue, setInputValue] = useState(initialLabel);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    // Sync inputValue when `value` changes externally
    useEffect(() => {
        if (value != null) {
            const labelText = typeof value === "string" ? value : getOptionLabel(value);
            if (labelText !== inputValue) setInputValue(labelText);
        } else if (inputValue !== "") {
            setInputValue("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, getOptionLabel]);

    // Close dropdown on outside click
    useEffect(() => {
        const onClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    // Filter options
    const filteredOptions = useMemo(() => {
        const lower = inputValue.toLowerCase();
        return options.filter((opt) => getOptionLabel(opt).toLowerCase().includes(lower));
    }, [inputValue, options, getOptionLabel]);

    // Input handlers
    const handleInput = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onInputChange(val);
        setIsOpen(true);
        setHighlightedIndex(-1);
    };

    const selectOption = (opt) => {
        const labelText = getOptionLabel(opt);
        setInputValue(labelText);
        setIsOpen(false);
        setHighlightedIndex(-1);
        onChange(opt);
    };

    const handleKeyDown = (e) => {
        if (disabled) return;
        if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            setIsOpen(true);
            return;
        }
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((i) => Math.max(i - 1, 0));
                break;
            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    selectOption(filteredOptions[highlightedIndex]);
                } else if (freeSolo && inputValue.trim()) {
                    onChange(inputValue.trim());
                    setIsOpen(false);
                    setHighlightedIndex(-1);
                }
                break;
            case "Escape":
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
            default:
                break;
        }
    };

    // Click on the trailing icon behaves like freeSolo Enter
    const handleSubmitClick = () => {
        if (disabled) return;
        if (freeSolo && inputValue.trim()) {
            onChange(inputValue.trim());
            setIsOpen(false);
            setHighlightedIndex(-1);
        }
    };

    // Render dropdown content
    const renderDropdownContent = () => {
        if (filteredOptions.length === 0) return null;

        if (groupBy && renderGroup) {
            const groupOrder = [];
            const seen = new Set();
            filteredOptions.forEach((opt) => {
                const key = groupBy(opt) ?? "";
                if (!seen.has(key)) {
                    seen.add(key);
                    groupOrder.push(key);
                }
            });

            return groupOrder.map((group, gi) => {
                const children = [];
                filteredOptions.forEach((opt, idx) => {
                    if ((groupBy(opt) ?? "") !== group) return;
                    children.push(
                        <CustomBox
                            key={`opt-${gi}-${idx}`}
                            onClick={() => selectOption(opt)}
                            className={
                                `${classNames.option ?? "px-3 py-2 cursor-pointer text-sm"} ` +
                                `${idx === highlightedIndex ? (classNames.highlight ?? "bg-gray-100 dark:bg-neutral-800") : ""} ` +
                                "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800"
                            }
                        >
                            {renderOption ? renderOption(opt) : getOptionLabel(opt)}
                        </CustomBox>
                    );
                });

                return renderGroup({ key: `group-${group}-${gi}`, group, children });
            });
        }

        return filteredOptions.map((opt, idx) => (
            <CustomBox
                key={`opt-${idx}`}
                onClick={() => selectOption(opt)}
                className={
                    `${classNames.option ?? "px-3 py-2 cursor-pointer text-sm"} ` +
                    `${idx === highlightedIndex ? (classNames.highlight ?? "bg-gray-100 dark:bg-neutral-800") : ""} ` +
                    "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800"
                }
            >
                {renderOption ? renderOption(opt) : getOptionLabel(opt)}
            </CustomBox>
        ));
    };

    const inputPaddingRight = endAdornment ? "pr-10" : "pr-8";

    return (
        <CustomBox ref={containerRef} className={`relative w-full mt-4 ${className}`}>
            {/* Input wrapper styled like CustomTextField */}
            <CustomBox className="relative w-full">
                <input
                    id={name}
                    name={name}
                    ref={inputRef}
                    type="text"
                    disabled={disabled}
                    value={inputValue}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder || label}
                    {...rest}
                    className={`
            w-full
            border-0
            border-b
            ${error
                        ? "border-error focus:border-error"
                        : "border-gray-400 dark:border-gray-600 focus:border-primary dark:focus:border-primary"}
            py-2 text-sm
            bg-transparent
            text-gray-900 dark:text-gray-100
            focus:outline-none
            focus:ring-0
            ${inputPaddingRight}
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
                />

                {/* Clickable end adornment */}
                {endAdornment && (
                    <button
                        type="button"
                        onClick={handleSubmitClick}
                        aria-label="submit search"
                        className="absolute right-0 top-1/2 -translate-y-1/2 pr-1 text-gray-500 dark:text-gray-300"
                    >
                        {endAdornment}
                    </button>
                )}
            </CustomBox>

            {/* Helper text */}
            {helperText && (
                <CustomTypography variant="small" color="text-error" className="text-xs mt-1">
                    {helperText}
                </CustomTypography>
            )}

            {/* Dropdown */}
            {isOpen && (
                <CustomBox
                    className={`
            absolute left-0 right-0
            mt-1 max-h-60 overflow-auto
            rounded-xl
            bg-white dark:bg-neutral-900
            shadow-lg z-50
          `}
                >
                    {renderDropdownContent()}
                </CustomBox>
            )}
        </CustomBox>
    );
});

CustomAutocomplete.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    endAdornment: PropTypes.node,

    options: PropTypes.array,
    value: PropTypes.any,
    onInputChange: PropTypes.func,
    onChange: PropTypes.func,
    getOptionLabel: PropTypes.func,
    freeSolo: PropTypes.bool,
    renderOption: PropTypes.func,
    groupBy: PropTypes.func,
    renderGroup: PropTypes.func,
    classNames: PropTypes.object,
};

export default CustomAutocomplete;
