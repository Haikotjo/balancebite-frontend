// src/components/form/CustomAutocomplete.jsx
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import CustomBox from "./CustomBox.jsx";

/**
 * CustomAutocomplete — logische autocomplete met keyboard support.
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
                                classNames = {},
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

    useEffect(() => {
        if (value != null) {
            const label = typeof value === 'string' ? value : getOptionLabel(value);
            if (label !== inputValue) setInputValue(label);
        }
    }, [value, getOptionLabel]);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    useEffect(() => {
        const lower = inputValue.toLowerCase();
        const matches = options.filter((opt) =>
            getOptionLabel(opt).toLowerCase().includes(lower)
        );
        setFilteredOptions(matches);
        setHighlightedIndex(-1);
    }, [inputValue, options, getOptionLabel]);

    const handleInput = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onInputChange(val);
        setIsOpen(true);
    };

    const handleSelect = (opt) => {
        const label = getOptionLabel(opt);
        setInputValue(label);
        setIsOpen(false);
        setHighlightedIndex(-1);
        onChange(opt);
    };

    const handleKeyDown = (e) => {
        if (!isOpen && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
            setIsOpen(true);
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((i) => Math.max(i - 1, 0));
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
        <CustomBox ref={containerRef} className={classNames.container}>
            <CustomBox className={classNames.inputWrapper}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={classNames.input}
                />
            </CustomBox>

            {isOpen && filteredOptions.length > 0 && (
                <CustomBox className={classNames.dropdown}>
                    {filteredOptions.map((opt, idx) => (
                        <CustomBox
                            key={idx}
                            onClick={() => handleSelect(opt)}
                            className={`${classNames.option} ${
                                idx === highlightedIndex ? classNames.highlight : ''
                            }`}
                        >
                            {renderOption
                                ? renderOption(opt)
                                : getOptionLabel(opt)}
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
    classNames: PropTypes.object,
};

export default CustomAutocomplete;
