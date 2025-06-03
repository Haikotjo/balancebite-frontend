import PropTypes from "prop-types";

const CustomCheckbox = ({
                            checked,
                            onChange,
                            label = "",
                            id,
                            name,
                            disabled = false,
                            className = "",
                            labelClassName = "",
                        }) => {
    return (
        <label
            htmlFor={id}
            className={`flex items-center cursor-pointer gap-2 select-none ${labelClassName}`}
        >
            <input
                id={id}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="sr-only peer"
            />
            <div
                className={`w-5 h-5 border-2 rounded-sm border-primary 
          peer-checked:bg-primary peer-checked:border-primary 
          flex items-center justify-center transition 
          ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
            >
                {checked && (
                    <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )}
            </div>
            {label && <span className="text-sm">{label}</span>}
        </label>
    );
};

CustomCheckbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
};

export default CustomCheckbox;
