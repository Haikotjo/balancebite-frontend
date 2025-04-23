import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";

/**
 * A controlled floating-label input field for quantities (e.g. in grams).
 * No dependency on MUI. Works well in dark mode.
 */
const FloatingLabelQuantityField = ({
                                        label,
                                        value,
                                        onChange,
                                        placeholder = "",
                                        className = "",
                                        ...rest
                                    }) => {
    return (
        <CustomBox className={`relative w-full mt-4 ${className}`}>
            <input
                id="quantity"
                type="number"
                value={value}
                onChange={onChange}
                placeholder={placeholder || " "}
                className="peer w-full border border-primary rounded px-3 p-2 pb-2 text-sm dark:bg-gray-800 bg-white text-black dark:text-white focus:outline-none focus:border-success"
                {...rest}
            />
            <label
                htmlFor="quantity"
                className="absolute left-3 -top-2 bg-white dark:bg-gray-800 px-1 text-xs text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary transition-all duration-200"
            >
                {label}
            </label>
        </CustomBox>
    );
};


FloatingLabelQuantityField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

export default FloatingLabelQuantityField;
