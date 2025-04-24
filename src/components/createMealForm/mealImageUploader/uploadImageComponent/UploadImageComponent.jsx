import PropTypes from "prop-types";
import { useState } from "react";
import { ImagePlus } from "lucide-react";
import CustomBox from "../../../layout/CustomBox.jsx";
import CustomIconButton from "../../../layout/CustomIconButton.jsx";
import CustomTypography from "../../../layout/CustomTypography.jsx";

/**
 * UploadImageComponent allows the user to select an image file
 * and returns its Base64 representation via the onUpload callback.
 *
 * @param {Object} props
 * @param {boolean} props.disabled - Whether the upload button is disabled
 * @param {function(string):void} props.onUpload - Callback receiving Base64 image string
 * @param {Object} props.errors - Validation errors object
 */
const UploadImageComponent = ({ disabled, onUpload, errors }) => {
    // Holds the name of the selected file (not displayed here but could be)
    const [setFileName] = useState("");

    /**
     * Reads the selected file as Base64 and triggers onUpload callback.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const base64String = event.target.result;
                onUpload(base64String);
                setFileName(file.name);
            };

            // Initiate file read
            reader.readAsDataURL(file);
        }
    };

    return (
        <CustomBox className="flex gap-1 items-center">
            {/* Label ties the hidden input to the button */}
            <label htmlFor="file-upload">
                <CustomIconButton
                    icon={<ImagePlus size={28} className="text-primary" />}
                    bgColor="bg-transparent"
                    className={disabled ? "opacity-50 pointer-events-none" : ""}
                    onClick={() => {}}
                    disableScale
                />
            </label>

            {/* Hidden file input triggered by the label above */}
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={disabled}
                onChange={handleFileChange}
            />

            {/* Display validation error if present */}
            {errors.imageFile && (
                <CustomTypography
                    as="span"
                    variant="small"
                    color="text-error"
                >
                    {errors.imageFile.message}
                </CustomTypography>
            )}
        </CustomBox>
    );
};

UploadImageComponent.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onUpload: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
};

export default UploadImageComponent;
