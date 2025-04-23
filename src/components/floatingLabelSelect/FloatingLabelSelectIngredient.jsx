import PropTypes from "prop-types";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";

/**
 * CustomFloatingSelect using Headless UI and Tailwind.
 * Supports single or multi-select via external logic (not isMulti prop).
 */
const CustomFloatingSelect = ({
                                  label,
                                  options,
                                  value,
                                  onChange,
                                  placeholder = "Select...",
                                  containerClassName = "",
                                  className = "",
                              }) => {
    return (
        <CustomBox className={`relative w-full mt-4 ${containerClassName}`}>
            {label && (
                <label className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-1 text-[0.6rem] text-primary z-10">
                    {label}
                </label>
            )}

            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button
                        className={`w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
                    >
                        <span>{value?.label || placeholder}</span>
                        <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white dark:bg-gray-800 shadow-lg border border-gray-300 z-20">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option.value}
                                value={option}
                                className={({ active, selected }) =>
                                    `cursor-pointer select-none px-4 py-2 text-sm ${
                                        active
                                            ? "bg-blue-100 dark:bg-gray-700 text-primary"
                                            : selected
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-900 dark:text-gray-100"
                                    }`
                                }
                            >
                                {option.label}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </CustomBox>
    );
};

CustomFloatingSelect.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            label: PropTypes.string,
        })
    ).isRequired,
    value: PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    containerClassName: PropTypes.string,
    className: PropTypes.string,
};

export default CustomFloatingSelect;
