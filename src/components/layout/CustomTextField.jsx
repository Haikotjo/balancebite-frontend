import PropTypes from "prop-types";

const CustomTextField = ({ label, name, register, error, type = "text", ...rest }) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={name} className="block mb-1 font-medium">
                    {label}
                </label>
            )}
            <input
                id={name}
                type={type}
                {...register(name)}
                {...rest}
                className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
};

CustomTextField.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    error: PropTypes.object,
    type: PropTypes.string,
};

export default CustomTextField;
