import { useState } from "react";
import PropTypes from "prop-types";
import Camera from "../../camera/Camera.jsx";
import AddImageUrlComponent from "./addImageUrlComponent/AddImageUrlComponent.jsx";
import UploadImageComponent from "./uploadImageComponent/UploadImageComponent.jsx";
import { Trash2 } from "lucide-react";
import CustomBox from "../../layout/CustomBox.jsx";
import CustomTypography from "../../layout/CustomTypography.jsx";
import CustomIconButton from "../../layout/CustomIconButton.jsx";

/**
 * MealImageUploader allows users to upload a meal image by:
 * - Taking a photo using the camera
 * - Uploading a file
 * - Providing a direct image URL
 *
 * Only one image type is active at a time. A preview is shown if any image is selected.
 *
 * @component
 * @param {function} register - React Hook Form register function
 * @param {object} errors - Validation errors
 * @param {function} onImageChange - Callback with (image, type)
 * @param {string} imageUrl - Optional initial image URL (for editing)
 */
const MealImageUploader = ({ register, errors, onImageChange, imageUrl: initialImageUrl }) => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
    const [resetTrigger, setResetTrigger] = useState(false);

    // Clears all image sources and resets preview
    const handleReset = () => {
        setCapturedImage(null);
        setUploadedImage(null);
        setImageUrl("");
        setResetTrigger(prev => !prev);
        onImageChange("", "");
    };

    return (
        <CustomBox className="flex flex-col items-center gap-2">
            <CustomTypography
                variant="paragraph"
                className="text-gray-500 font-normal italic"
            >
                Upload Image
            </CustomTypography>

            {/* Buttons for capture, upload, or URL entry */}
            <CustomBox className="flex justify-center items-center gap-2">
                <Camera
                    disabled={!!capturedImage || !!uploadedImage || !!imageUrl}
                    onCapture={(image) => {
                        setCapturedImage(image);
                        setUploadedImage(null);
                        setImageUrl("");
                        onImageChange(image, "captured");
                    }}
                />

                <UploadImageComponent
                    disabled={!!capturedImage || !!uploadedImage || !!imageUrl}
                    onUpload={(file) => {
                        setUploadedImage(file);
                        setCapturedImage(null);
                        setImageUrl("");
                        onImageChange(file, "uploaded");
                    }}
                    register={register}
                    errors={errors}
                />

                <AddImageUrlComponent
                    disabled={!!capturedImage || !!uploadedImage || !!imageUrl}
                    onUrlChange={(newUrl) => {
                        setImageUrl(newUrl);
                        setCapturedImage(null);
                        setUploadedImage(null);
                        onImageChange(newUrl, "url");
                    }}
                    register={register}
                    errors={errors}
                    onReset={resetTrigger}
                />
            </CustomBox>

            {/* Image preview with delete button */}
            {(capturedImage || uploadedImage || imageUrl) && (
                <CustomBox className="mt-2 flex flex-col items-center justify-center text-center">
                    <CustomTypography
                        variant="small"
                        className="text-gray-500 italic mb-1"
                    >
                        Image Preview
                    </CustomTypography>

                    <img
                        src={capturedImage || uploadedImage || imageUrl}
                        alt="Preview"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "200px",
                            borderRadius: "8px",
                            objectFit: "cover",
                        }}
                    />
                    <CustomIconButton
                        icon={<Trash2 size={24} className="text-error" />}
                        onClick={handleReset}
                        bgColor="bg-transparent"
                        className="mt-2"
                    />
                </CustomBox>
            )}

            {/* Error message */}
            {errors.image && (
                <CustomTypography className="text-error text-sm">
                    {errors.image.message}
                </CustomTypography>
            )}
        </CustomBox>
    );
};

MealImageUploader.propTypes = {
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    onImageChange: PropTypes.func.isRequired,
    imageUrl: PropTypes.string,
};

export default MealImageUploader;
