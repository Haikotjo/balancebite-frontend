import PropTypes from "prop-types";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";
import CustomTextField from "../../../layout/CustomTextField.jsx";
import CustomBox from "../../../layout/CustomBox.jsx";
import CustomIconButton from "../../../layout/CustomIconButton.jsx";

/**
 * AddImageUrlComponent allows users to manually enter an image URL.
 * It shows a toggleable input field when the link icon is clicked.
 *
 * @component
 * @param {boolean} disabled - Whether the component is disabled
 * @param {function} onUrlChange - Callback to handle URL value changes
 * @param {string} value - Current value of the image URL
 * @param {object} errors - Validation errors object
 * @param {boolean} onReset - Trigger to externally reset the input field
 */
const AddImageUrlComponent = ({ disabled, onUrlChange, value, errors, onReset }) => {
    const [showInput, setShowInput] = useState(false);

    // Handle input change and propagate it to the parent
    const handleChange = (e) => {
        const newValue = e.target.value;
        onUrlChange(newValue);
    };

    // Reset local state and notify parent
    const handleReset = () => {
        onUrlChange("");
        setShowInput(false);
    };

    // Trigger reset when onReset prop changes to true
    useEffect(() => {
        if (onReset === true) {
            handleReset();
        }
    }, [onReset]);

    return (
        <CustomBox className="flex flex-col items-center">
            {/* Toggle button for showing input */}
            <CustomIconButton
                icon={<Link size={34} className="text-primary" />}
                onClick={() => setShowInput(!showInput)}
                size={56}
                bgColor="bg-transparent"
                className={disabled ? "opacity-50 pointer-events-none" : ""}
            />

            {/* URL input field */}
            {showInput && (
                <CustomTextField
                    name="imageUrl"
                    label="Image URL"
                    value={value}
                    onChange={handleChange}
                    error={errors.imageUrl}
                    helperText={errors.imageUrl?.message}
                    className="w-full mt-2"
                />
            )}
        </CustomBox>
    );
};

AddImageUrlComponent.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onUrlChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    errors: PropTypes.object.isRequired,
    onReset: PropTypes.any,
};

export default AddImageUrlComponent;
