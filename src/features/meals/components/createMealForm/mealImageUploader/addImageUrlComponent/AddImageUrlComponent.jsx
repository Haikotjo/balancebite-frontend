import PropTypes from "prop-types";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";
import CustomBox from "../../../../../../components/layout/CustomBox.jsx";
import CustomIconButton from "../../../../../../components/layout/CustomIconButton.jsx";
import CustomTextField from "../../../../../../components/layout/CustomTextField.jsx";

/**
 * Renders the link icon inline with other icons.
 * When open, renders a full-width input as a separate flex item on the next line.
 */
const AddImageUrlComponent = ({ disabled, onUrlChange, value, errors, onReset }) => {
    const [showInput, setShowInput] = useState(false);

    const handleChange = (e) => onUrlChange(e.target.value);

    const handleReset = () => {
        onUrlChange("");
        setShowInput(false);
    };

    useEffect(() => {
        if (onReset === true) handleReset();
    }, [onReset]);

    return (
        <>
            {/* Inline icon (first flex item) */}
            <CustomBox className="flex flex-col items-center">
                <CustomIconButton
                    icon={<Link size={40} className="text-primary" />}
                    onClick={() => setShowInput(!showInput)}
                    size={56}
                    bgColor="bg-transparent"
                    className={disabled ? "opacity-50 pointer-events-none" : ""}
                    disableScale
                />
            </CustomBox>

            {/* Full-width input on the next line (second flex item) */}
            {showInput && (
                <CustomBox className="basis-full w-full flex justify-center">
                    <CustomTextField
                        name="imageUrl"
                        label="Image URL"
                        value={value}
                        onChange={handleChange}
                        error={errors.imageUrl}
                        helperText={errors.imageUrl?.message}
                        className="w-full max-w-xl mt-2"
                    />
                </CustomBox>
            )}
        </>
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
