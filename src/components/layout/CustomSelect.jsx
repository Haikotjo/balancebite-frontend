import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";

/**
 * CustomSwitchSelect – custom dropdown (styling OK) met "native switch" gedrag:
 * - Klik om te openen
 * - Klik optie -> value verandert maar dropdown blijft open
 * - Click outside -> sluit
 * API gelijk aan CustomSelect: value is string/number, onChange krijgt event-like {target:{name,value}}
 */
const CustomSelect = ({
                                label,
                                name,
                                value,
                                onChange,
                                error,
                                helperText,
                                disabled = false,
                                options = [],
                                className = "",
                            }) => {
    const wrapperRef = useRef(null);
    const [open, setOpen] = useState(false);

    const selected = useMemo(
        () => options.find((o) => String(o.value) === String(value)) ?? null,
        [options, value]
    );

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const emit = (nextValue) => {
        onChange?.({ target: { name, value: nextValue } });
    };

    return (
        <CustomBox ref={wrapperRef} className={`relative w-full mt-4 ${className}`}>
            {/* "Field" */}
            <CustomBox
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                onClick={() => !disabled && setOpen((v) => !v)}
                onKeyDown={(e) => {
                    if (disabled) return;
                    if (e.key === "Enter" || e.key === " ") setOpen((v) => !v);
                    if (e.key === "Escape") setOpen(false);
                }}
                className={`w-full border rounded px-3 h-12 flex items-center text-sm cursor-pointer bg-transparent text-black dark:text-white focus:outline-none focus:ring-0 
                ${error ? "border-error" : "border-primary"} 
                ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}

            >
                <CustomTypography className={`${selected ? "" : "text-gray-400 dark:text-gray-500"}`}>
                    {selected ? selected.label : `-- Select ${label} --`}
                </CustomTypography>

                {/* Pijltje */}
                <CustomTypography className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
          ▾
        </CustomTypography>

                {label && (
                    <CustomTypography
                        as="label"
                        htmlFor={name}
                        variant="xsmallCard"
                        className="absolute left-3 -top-2 px-1"
                        color="text-gray-600 dark:text-gray-400"
                    >
                        {label}
                    </CustomTypography>
                )}

            </CustomBox>

            {/* Dropdown */}
            {open && !disabled && (
                <CustomBox className="absolute left-0 w-full z-30 mt-1 max-h-60 overflow-y-auto border border-gray-400 dark:border-gray-600 rounded shadow bg-lightBackground dark:bg-darkBackground">
                    {options.map((option) => {
                        const active = String(option.value) === String(value);
                        return (
                            <CustomBox
                                key={option.value}
                                className={`px-3 py-2 text-sm cursor-pointer hover:bg-primary hover:text-white
                  ${active ? "bg-primary/10 dark:bg-primary/20" : ""}`}
                                onMouseDown={(e) => e.preventDefault()} // voorkomt focus-loss
                                onClick={() => {
                                    emit(option.value);
                                    // OPEN BLIJVEN: direct switchen zonder kruisje
                                    setOpen(false);
                                }}
                                role="option"
                                aria-selected={active}
                            >
                                {option.label}
                            </CustomBox>
                        );
                    })}
                </CustomBox>
            )}

            {/* Helper/error text */}
            {helperText && (
                <CustomTypography variant="small" color="text-error" className="text-xs mt-1">
                    {helperText}
                </CustomTypography>
            )}
        </CustomBox>
    );
};

CustomSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    className: PropTypes.string,
};

export default CustomSelect;
