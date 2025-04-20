// src/components/form/CustomAutocomplete.jsx
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";

/**
 * CustomAutocomplete — Tailwind-based autocomplete with keyboard navigation.
 * Works with objects or strings, arrow keys, Enter, Escape.
 *
 * @param {Array}  options           — lijst van opties.
 * @param {*}      value             — huidig value (object of string).
 * @param {Function} onInputChange   — callback bij elke wijziging in het inputveld.
 * @param {Function} onChange        — callback bij selectie (klik of Enter).
 * @param {Function} getOptionLabel  — haalt label uit een optie.
 * @param {boolean} freeSolo         — allow free text entry.
 * @param {Function} renderOption    — optionele custom renderer voor dropdown.
 * @param {string}  placeholder      — placeholder text.
 */
const CustomAutocomplete = ({
                                options = [],
                                value = null,
                                onInputChange = () => {},
                                onChange = () => {},
                                getOptionLabel = (opt) => (typeof opt === 'string' ? opt : ''),
                                freeSolo = false,
                                renderOption = null,
                                placeholder = '',
                            }) => {
    const [inputValue, setInputValue] = useState(
        value != null
            ? (typeof value === 'string' ? value : getOptionLabel(value))
            : ''
    );
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);

    // Sync external value
    useEffect(() => {
        if (value != null) {
            const label = typeof value === 'string' ? value : getOptionLabel(value);
            if (label !== inputValue) setInputValue(label);
        }
    }, [value, getOptionLabel]);

    // Click outside sluit dropdown
    useEffect(() => {
        const onClickOutside = e => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    // Filter opties
    useEffect(() => {
        const lower = inputValue.toLowerCase();
        const matches = options.filter(opt =>
            getOptionLabel(opt).toLowerCase().includes(lower)
        );
        setFilteredOptions(matches);
        setHighlightedIndex(-1);
    }, [inputValue, options, getOptionLabel]);

    const handleInput = e => {
        const val = e.target.value;
        setInputValue(val);
        onInputChange(val);
        setIsOpen(true);
    };

    const handleSelect = opt => {
        const label = getOptionLabel(opt);
        setInputValue(label);
        setIsOpen(false);
        setHighlightedIndex(-1);
        onChange(opt);
    };

    const handleKeyDown = e => {
        if (!isOpen && ['ArrowDown','ArrowUp'].includes(e.key)) {
            setIsOpen(true);
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(i => Math.min(i+1, filteredOptions.length-1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(i => Math.max(i-1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    handleSelect(filteredOptions[highlightedIndex]);
                } else if (freeSolo && inputValue.trim()) {
                    onChange(inputValue.trim());
                    setIsOpen(false);
                    setHighlightedIndex(-1);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
            default:
                break;
        }
    };

    return (
        <CustomBox ref={containerRef} className="relative w-full max-w-[550px]">
            <CustomBox className="flex items-center border-2 border-primary rounded-md px-3 py-2 bg-white dark:bg-gray-800">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none text-sm text-gray-900 dark:text-white"
                />
            </CustomBox>

            {isOpen && filteredOptions.length > 0 && (
                <CustomBox className="absolute left-0 right-0 bg-white dark:bg-gray-800 border-x-2 border-b-2 border-primary rounded-b-md mt-1 z-50 max-h-60 overflow-y-auto">
                    {filteredOptions.map((opt, idx) => (
                        <CustomBox
                            key={idx}
                            onClick={() => handleSelect(opt)}
                            className={`px-4 py-2 cursor-pointer transition-colors duration-100 ${
                                idx === highlightedIndex ? 'bg-gray-200 dark:bg-gray-700' : ''
                            }`}
                        >
                            {renderOption
                                ? renderOption(opt)
                                : <CustomTypography as="span">{getOptionLabel(opt)}</CustomTypography>
                            }
                        </CustomBox>
                    ))}
                </CustomBox>
            )}
        </CustomBox>
    );
};

CustomAutocomplete.propTypes = {
    options: PropTypes.array,
    value: PropTypes.any,
    onInputChange: PropTypes.func,
    onChange: PropTypes.func,
    getOptionLabel: PropTypes.func,
    freeSolo: PropTypes.bool,
    renderOption: PropTypes.func,
    placeholder: PropTypes.string,
};

export default CustomAutocomplete;
