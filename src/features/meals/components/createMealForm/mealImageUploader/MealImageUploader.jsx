// MealImageUploader.jsx (controls with inline preview; link icon on same row; URL field below)
// English code comments.

import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import Camera from "../../camera/Camera.jsx";
import AddImageUrlComponent from "./addImageUrlComponent/AddImageUrlComponent.jsx";
import UploadImageComponent from "./uploadImageComponent/UploadImageComponent.jsx";
import { Trash2 } from "lucide-react";
import CustomBox from "../../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../../components/layout/CustomTypography.jsx";
import CustomIconButton from "../../../../../components/layout/CustomIconButton.jsx";

const MealImageUploader = ({ errors, onImageChange, imageUrl: initialImageUrl }) => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
    const [resetTrigger, setResetTrigger] = useState(false);

    const isAnySet = !!capturedImage || !!uploadedImage || !!(imageUrl && imageUrl.trim());

    const previewSrc = useMemo(() => {
        if (capturedImage) return capturedImage;
        if (uploadedImage) return uploadedImage;
        if (imageUrl && imageUrl.trim()) return imageUrl.trim();
        return null;
    }, [capturedImage, uploadedImage, imageUrl]);

    const handleReset = () => {
        setCapturedImage(null);
        setUploadedImage(null);
        setImageUrl("");
        setResetTrigger(prev => !prev); // trigger child reset
        onImageChange(null, "reset");
    };

    return (
        <CustomBox className="flex flex-col items-center gap-3 w-full my-8">
            {/*<CustomTypography variant="small" className="text-gray-500 font-normal italic">*/}
            {/*    Add an Image*/}
            {/*</CustomTypography>*/}

            {/* Action controls row: allow wrapping so URL input can sit on the next line */}
            <CustomBox className="flex flex-wrap justify-center items-start gap-6 w-full">
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
                    onUpload={(fileOrBase64) => {
                        setUploadedImage(fileOrBase64);
                        setCapturedImage(null);
                        setImageUrl("");
                        onImageChange(fileOrBase64, "uploaded");
                    }}
                    errors={errors}
                />

                {/* Link icon (inline) + its input rendered as full-width next line inside the same flex container */}
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

            {previewSrc && (
                <CustomBox className="w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mt-1 flex items-center justify-center">
                    <img src={previewSrc} alt="Selected" className="max-h-56 w-auto object-contain" />
                </CustomBox>
            )}

            {isAnySet && (
                <CustomIconButton
                    icon={<Trash2 size={20} className="text-error" />}
                    onClick={handleReset}
                    bgColor="bg-transparent"
                    className="mt-1"
                    ariaLabel="Clear image"
                />
            )}

            {(errors.imageFile || errors.imageUrl) && (
                <CustomTypography className="text-error text-sm text-center">
                    {errors.imageFile?.message || errors.imageUrl?.message}
                </CustomTypography>
            )}
        </CustomBox>
    );
};

MealImageUploader.propTypes = {
    errors: PropTypes.object.isRequired,
    onImageChange: PropTypes.func.isRequired,
    imageUrl: PropTypes.string,
};

export default MealImageUploader;
