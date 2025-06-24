import PropTypes from "prop-types";
import { Check } from "lucide-react";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";

const CustomCheckbox = ({
                            checked,
                            onChange,
                            label = "",
                            id,
                            disabled = false,
                            className = "",
                            labelClassName = "",
                        }) => {
    const handleClick = (e) => {
        e.preventDefault();
        if (!disabled) onChange(e);
    };

    return (
        <label
            htmlFor={id}
            className={`flex items-center gap-2 cursor-pointer select-none ${labelClassName}`}
            onClick={handleClick}
        >
            {label && (
                <CustomTypography variant="small" as="span">
                    {label}
                </CustomTypography>
            )}
            <CustomBox
                id={id}
                className={`
                    w-5 h-5 border-2 rounded-sm flex items-center justify-center transition 
                    ${checked ? "bg-primary border-primary" : "border-primary bg-transparent"}
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                    ${className}
                `}
            >
                {checked && <Check className="w-4 h-4 text-white" />}
            </CustomBox>

        </label>
    );
};

CustomCheckbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    id: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
};

export default CustomCheckbox;
