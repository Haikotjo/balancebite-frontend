// FoodItemImageUploader.jsx
// Single image uploader for FoodItem: Upload file OR paste URL.
// Emits: onChange({ imageFile: File|null, imageUrl: string|null })

import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import { Upload, Link2, Trash2 } from "lucide-react";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";

const FoodItemImageUploader = ({ errors, valueUrl = "", onChange }) => {
    const fileInputRef = useRef(null);

    const [previewUrl, setPreviewUrl] = useState(null);
    const [urlValue, setUrlValue] = useState(valueUrl || "");

    useEffect(() => {
        setUrlValue(valueUrl || "");
        if (!valueUrl) setPreviewUrl(null);
    }, [valueUrl]);

    const triggerUpload = () => {
        if (!fileInputRef.current) return;
        fileInputRef.current.value = "";
        fileInputRef.current.click();
    };

    const onUploadSelected = (e) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;

        // Create preview
        const blobUrl = URL.createObjectURL(file);
        setPreviewUrl(blobUrl);

        // File wins => clear URL
        setUrlValue("");
        onChange({ imageFile: file, imageUrl: null });
    };

    const applyUrl = () => {
        const v = (urlValue || "").trim();
        onChange({ imageFile: null, imageUrl: v ? v : null });
        setPreviewUrl(null); // URL preview is just the URL itself (shown below)
    };

    const clearAll = () => {
        if (previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setUrlValue("");
        onChange({ imageFile: null, imageUrl: null });
    };

    const effectiveUrl = (urlValue || "").trim();

    return (
        <CustomBox className="flex flex-col gap-3 w-full my-6">
            <CustomTypography variant="bold">Image</CustomTypography>

            {/* Preview */}
            {(previewUrl || effectiveUrl) && (
                <CustomBox className="relative rounded-xl border-2 border-borderDark dark:border-borderLight overflow-hidden">
                    <img
                        src={previewUrl || effectiveUrl}
                        alt="Food item"
                        className="w-full max-h-[260px] object-cover"
                    />

                    <CustomBox className="absolute top-2 right-2">
                        <CustomIconButton
                            icon={<Trash2 size={18} className="text-error" />}
                            onClick={clearAll}
                            bgColor="bg-[rgba(0,0,0,0.45)]"
                            ariaLabel="Remove image"
                        />
                    </CustomBox>
                </CustomBox>
            )}

            {/* URL */}
            <CustomBox className="rounded-xl border border-borderDark dark:border-borderLight p-3">
                <CustomBox className="flex items-center gap-2 mb-2">
                    <Link2 size={18} className="text-primary" />
                    <CustomTypography variant="bold">Paste image URL</CustomTypography>
                </CustomBox>

                <CustomTextField
                    label="Image URL"
                    name="imageUrl"
                    variant="outlined"
                    value={urlValue}
                    onChange={(e) => {
                        const next = e.target.value;
                        setUrlValue(next);

                        const v = next.trim();
                        onChange({ imageFile: null, imageUrl: v ? v : null });
                        setPreviewUrl(null);
                    }}
                    error={!!errors?.imageUrl}
                    helperText={errors?.imageUrl?.message || "Use a direct image link (https://...) or upload a file."}
                />

                <CustomBox className="flex justify-end mt-2">
                    <CustomButton type="button" variant="solid" color="primary" onClick={applyUrl}>
                        <CustomTypography as="span" variant="small" weight="bold" color="text-white">
                            Use URL
                        </CustomTypography>
                    </CustomButton>
                </CustomBox>
            </CustomBox>

            {/* Upload */}
            <CustomBox className="rounded-xl border border-borderDark dark:border-borderLight p-3">
                <CustomBox className="flex items-center gap-2 mb-2">
                    <Upload size={18} className="text-primary" />
                    <CustomTypography variant="bold">Upload file</CustomTypography>
                </CustomBox>

                <CustomBox className="flex justify-end">
                    <CustomButton type="button" variant="solid" color="primary" onClick={triggerUpload}>
                        <CustomTypography as="span" variant="small" weight="bold" color="text-white">
                            Choose file
                        </CustomTypography>
                    </CustomButton>
                </CustomBox>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onUploadSelected}
                />
            </CustomBox>

            {/* Optional form-level errors */}
            {errors?.imageFile && (
                <CustomTypography className="text-error text-sm text-center">
                    {errors.imageFile.message}
                </CustomTypography>
            )}
        </CustomBox>
    );
};

FoodItemImageUploader.propTypes = {
    errors: PropTypes.object,
    valueUrl: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default FoodItemImageUploader;
