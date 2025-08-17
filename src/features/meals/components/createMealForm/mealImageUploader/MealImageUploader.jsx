// MealImageUploader.jsx (controls-only; no internal preview)
// English code comments.

import { useState } from "react";
import PropTypes from "prop-types";
import Camera from "../../camera/Camera.jsx";
import AddImageUrlComponent from "./addImageUrlComponent/AddImageUrlComponent.jsx";
import UploadImageComponent from "./uploadImageComponent/UploadImageComponent.jsx";
import { Trash2 } from "lucide-react";
import CustomBox from "../../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../../components/layout/CustomTypography.jsx";
import CustomIconButton from "../../../../../components/layout/CustomIconButton.jsx";

const MealImageUploader = ({ register, errors, onImageChange, imageUrl: initialImageUrl }) => {
    // Keep minimal local state to control disabled logic
    const [capturedImage, setCapturedImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
    const [resetTrigger, setResetTrigger] = useState(false);

    // Clear all and notify parent
    const handleReset = () => {
        setCapturedImage(null);
        setUploadedImage(null);
        setImageUrl("");
        setResetTrigger(prev => !prev);
        onImageChange(null, "reset");
    };

    const isAnySet = !!capturedImage || !!uploadedImage || !!imageUrl;

    return (
        <CustomBox className="flex flex-col items-center gap-2">
            <CustomTypography variant="small" className="text-gray-500 font-normal italic">
                Add an Image
            </CustomTypography>

            {/* Action controls */}
            <CustomBox className="flex justify-center items-center gap-2">
                <Camera
                    disabled={isAnySet}
                    onCapture={(image) => {
                        setCapturedImage(image);
                        setUploadedImage(null);
                        setImageUrl("");
                        onImageChange(image, "captured");
                    }}
                />

                <UploadImageComponent
                    disabled={isAnySet}
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
                    disabled={isAnySet}
                    onUrlChange={(newUrl) => {
                        setImageUrl(newUrl);
                        setCapturedImage(null);
                        setUploadedImage(null);
                        onImageChange(newUrl, "url");
                    }}
                    value={imageUrl}
                    errors={errors}
                    onReset={resetTrigger}
                />
            </CustomBox>

            {/* Reset button (since preview moved to page) */}
            {isAnySet && (
                <CustomIconButton
                    icon={<Trash2 size={20} className="text-error" />}
                    onClick={handleReset}
                    bgColor="bg-transparent"
                    className="mt-1"
                    ariaLabel="Clear image"
                />
            )}

            {/* Optional: align error keys with your RHF fields */}
            {(errors.imageFile || errors.imageUrl) && (
                <CustomTypography className="text-error text-sm">
                    {errors.imageFile?.message || errors.imageUrl?.message}
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
