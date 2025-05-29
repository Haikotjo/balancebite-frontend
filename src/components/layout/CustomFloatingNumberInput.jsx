import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";

/**
 * A controlled floating-label input field for quantities (e.g. in grams).
 */
const CustomFloatingNumberInput = ({
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
                className="peer w-full border border-primary rounded px-3 p-5 pb-1 text-sm bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] text-[var(--text-light)] dark:text-[var(--text-dark)] focus:outline-none focus:border-success"
                {...rest}
            />
            <label
                htmlFor="quantity"
                className="absolute left-3 -top-2 px-1 text-xs text-primary bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] peer-focus:text-primary peer-focus:text-xs peer-focus:-top-2 transition-all duration-200"
            >
                {label}
            </label>
        </CustomBox>
    );
};


CustomFloatingNumberInput.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

export default CustomFloatingNumberInput;
