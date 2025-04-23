import PropTypes from "prop-types";

/**
 * A controlled floating-label text input field (e.g. for name, email, password).
 * Matches styling with FloatingLabelQuantityField.
 */
const CustomTextField = ({
                             label,
                             name,
                             register,
                             error,
                             type = "text",
                             className = "",
                             multiline = false,
                             rows = 4,
                             ...rest
                         }) => {
    const InputComponent = multiline ? "textarea" : "input";

    return (
        <div className={`relative w-full mt-4 ${className}`}>
            <InputComponent
                id={name}
                type={multiline ? undefined : type}
                placeholder=" "
                rows={multiline ? rows : undefined}
                {...register(name)}
                {...rest}
                className={`peer w-full border border-primary rounded px-3 pt-5 pb-2 text-sm dark:bg-gray-800 bg-white text-black dark:text-white focus:outline-none focus:border-success resize-none`}
            />
            <label
                htmlFor={name}
                className="absolute left-3 -top-2 bg-white dark:bg-gray-800 px-1 text-xs text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary transition-all duration-200"
            >
                {label}
            </label>
            {error && <p className="text-error text-xs mt-1">{error.message}</p>}
        </div>
    );
};


CustomTextField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    error: PropTypes.object,
    type: PropTypes.string,
    className: PropTypes.string,
    multiline: PropTypes.bool,
    rows: PropTypes.number,
};

export default CustomTextField;
