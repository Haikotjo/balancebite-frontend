// MealImageUploader.jsx
// UI: 4 image slots (grid). Click a slot to choose: Take photo / Paste URL / Upload file.
// Output: calls onImagesChange(filesArray, primaryIndex).
//
// Notes:
// - Primary selection is explicit via the "star" button on a filled slot.
// - URL option tries to fetch the image and convert it to a File (can fail due to CORS).
// - Camera option converts the captured data URL to a File (no base64 storage).

import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import { Camera as CameraIcon, ImagePlus, Link2, Upload, X, Star, Trash2 } from "lucide-react";

import CustomBox from "../../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../../components/layout/CustomTypography.jsx";
import CustomIconButton from "../../../../../components/layout/CustomIconButton.jsx";
import CustomButton from "../../../../../components/layout/CustomButton.jsx";
import CustomTextField from "../../../../../components/layout/CustomTextField.jsx";

import Camera from "../../camera/Camera.jsx";
import {
    dataUrlToFile,
    MAX_SLOTS,
    urlToFile
} from "../../../utils/helpers/mealImageHelpers.js";
import {useMealImageSlots} from "../../../utils/hooks/useMealImageSlots.js";

const MealImageUploader = ({ errors, onImagesChange, initialImages = [] }) => {

    // chooser modal state
    const [chooserOpen, setChooserOpen] = useState(false);
    const [activeSlotIndex, setActiveSlotIndex] = useState(null);

    // url input inside chooser
    const [urlValue, setUrlValue] = useState("");
    const [urlError, setUrlError] = useState("");

    // file input ref for uploads
    const fileInputRef = useRef(null);

    const {
        slots,
        setSlots,
        setPrimaryIndex,
        effectivePrimaryIndex,
        setSlotFile,
        clearSlot,
        setPrimaryBySlot,
        emitChange,
    } = useMealImageSlots({ maxSlots: MAX_SLOTS, onImagesChange });



    const openChooser = (index) => {
        setActiveSlotIndex(index);
        setUrlValue("");
        setUrlError("");
        setChooserOpen(true);
    };

    const closeChooser = () => {
        setChooserOpen(false);
        setActiveSlotIndex(null);
        setUrlValue("");
        setUrlError("");
    };

    const triggerUpload = () => {
        if (!fileInputRef.current) return;
        fileInputRef.current.value = "";
        fileInputRef.current.click();
    };

    const onUploadSelected = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSlotFile(activeSlotIndex, file);
        closeChooser();
    };

    const onCapture = async (dataUrl) => {
        try {
            const file = await dataUrlToFile(dataUrl, `captured-${Date.now()}.jpg`);
            setSlotFile(activeSlotIndex, file);
            closeChooser();
        } catch {
            setUrlError("Failed to process captured image.");
        }
    };

    const onApplyUrl = async () => {
        setUrlError("");
        const url = (urlValue || "").trim();
        if (!url) {
            setUrlError("Please paste a valid image URL.");
            return;
        }

        try {
            const file = await urlToFile(url, `url-${Date.now()}.jpg`);
            setSlotFile(activeSlotIndex, file);
            closeChooser();
        } catch {
            setUrlError("Could not download this URL (often CORS). Upload the file instead.");
        }
    };

    const hasAny = slots.some((s) => !!s.file || !!s.previewUrl);

    useEffect(() => {
        // initialImages: [{id, imageUrl, orderIndex, primary}]
        const next = Array.from({ length: MAX_SLOTS }, () => ({ file: null, previewUrl: null, id: null }));

        const sorted = [...(initialImages || [])].sort((a,b) => a.orderIndex - b.orderIndex);

        sorted.slice(0, MAX_SLOTS).forEach((img, idx) => {
            next[idx] = { file: null, previewUrl: img.imageUrl, id: img.id };
        });

        setSlots(next);

        const p = sorted.find(i => i.primary)?.orderIndex ?? (sorted.length ? 0 : null);
        setPrimaryIndex(p);

        // IMPORTANT: existing images are not files, so emit empty files array but keep primary
        emitChange(next, p);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(initialImages)]);

    return (
        <CustomBox className="flex flex-col gap-3 w-full my-8">
            {/* Slots grid */}
            <CustomBox className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {slots.map((slot, i) => {
                    const isFilled = !!slot.file || !!slot.previewUrl;

                    const isPrimary = isFilled && i === effectivePrimaryIndex;


                    return (
                        <CustomBox
                            key={i}
                            className={[
                                "relative rounded-xl border-2 border-borderDark dark:border-borderLight",
                                "aspect-square overflow-hidden",
                                "bg-lightBackground dark:bg-darkBackground",
                                "flex items-center justify-center",
                                "cursor-pointer",
                                "transition-all",
                                "hover:scale-[1.01]",
                            ].join(" ")}
                            onClick={() => openChooser(i)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") openChooser(i);
                            }}
                        >
                            {!isFilled ? (
                                <CustomBox className="flex flex-col items-center justify-center gap-2 opacity-80">
                                    <ImagePlus size={34} className="text-primary" />
                                    <CustomTypography variant="small" className="text-center">
                                        Add image
                                    </CustomTypography>
                                </CustomBox>
                            ) : (
                                <>
                                    <img
                                        src={slot.previewUrl}
                                        alt={`Meal image ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Primary star */}
                                    <CustomBox className="absolute top-2 left-2" onClick={(e) => e.stopPropagation()}>
                                        <CustomIconButton
                                            icon={
                                                <Star
                                                    size={18}
                                                    className={isPrimary ? "text-yellow-400" : "text-white"}
                                                />
                                            }
                                            onClick={() => setPrimaryBySlot(i)}
                                            bgColor="bg-[rgba(0,0,0,0.45)]"
                                            ariaLabel="Set as primary"
                                        />
                                    </CustomBox>

                                    {/* Remove */}
                                    <CustomBox className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                                        <CustomIconButton
                                            icon={<Trash2 size={18} className="text-error" />}
                                            onClick={() => clearSlot(i)}
                                            bgColor="bg-[rgba(0,0,0,0.45)]"
                                            ariaLabel="Remove image"
                                        />
                                    </CustomBox>
                                </>
                            )}
                        </CustomBox>
                    );
                })}
            </CustomBox>

            {/* Clear all */}
            {hasAny && (
                <CustomBox className="flex justify-center">
                    <CustomIconButton
                        icon={<X size={20} className="text-error" />}
                        onClick={() => {
                            setSlots((prev) => {
                                prev.forEach((s) => {
                                    if (s.previewUrl && s.previewUrl.startsWith("blob:")) {
                                        try {
                                            URL.revokeObjectURL(s.previewUrl);
                                        } catch {
                                            // ignore
                                        }
                                    }
                                });

                                const next = Array.from(
                                    { length: MAX_SLOTS },
                                    () => ({ file: null, previewUrl: null })
                                );

                                setPrimaryIndex(null);
                                onImagesChange({
                                    imageFiles: [],
                                    replaceOrderIndexes: [],
                                    keepImageIds: [],
                                    primaryIndex: null,
                                });

                                return next;
                            });
                        }}
                        bgColor="bg-transparent"
                        ariaLabel="Clear all images"
                    />

                </CustomBox>
            )}

            {/* Errors */}
            {(errors?.imageFiles || errors?.primaryIndex) && (
                <CustomTypography className="text-error text-sm text-center">
                    {errors?.imageFiles?.message || errors?.primaryIndex?.message}
                </CustomTypography>
            )}

            {/* Hidden file input (single file per slot selection) */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onUploadSelected}
            />

            {/* Chooser modal */}
            {chooserOpen && (
                <CustomBox className="fixed inset-0 z-[2147483000] flex items-center justify-center">
                    {/* Backdrop */}
                    <CustomBox
                        className="absolute inset-0 bg-black/50"
                        onClick={closeChooser}
                        role="presentation"
                    />

                    {/* Modal */}
                    <CustomBox className="relative z-[2147483001] w-[92%] max-w-lg rounded-2xl bg-lightBackground dark:bg-darkBackground shadow-lg p-4 flex flex-col gap-4">
                        <CustomBox className="flex items-center justify-between">
                            <CustomTypography as="h4" variant="h4">
                                Add image
                            </CustomTypography>
                            <CustomIconButton
                                icon={<X size={18} />}
                                onClick={closeChooser}
                                bgColor="bg-transparent"
                                ariaLabel="Close"
                            />
                        </CustomBox>

                        {/* Actions */}
                        <CustomBox className="flex flex-col gap-3">
                            {/* Take photo */}
                            <CustomBox className="rounded-xl border border-borderDark dark:border-borderLight p-3">
                                <CustomBox className="flex items-center gap-2 mb-2">
                                    <CameraIcon size={18} className="text-primary" />
                                    <CustomTypography variant="bold">Take photo</CustomTypography>
                                </CustomBox>

                                {/* Reuse your existing Camera component (expects onCapture(dataUrl)) */}
                                <Camera
                                    disabled={false}
                                    onCapture={(img) => onCapture(img)}
                                />
                            </CustomBox>

                            {/* Paste URL */}
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
                                    onChange={(e) => setUrlValue(e.target.value)}
                                    error={!!urlError}
                                    helperText={urlError || "Will try to download and convert to a file."}
                                />

                                <CustomBox className="flex justify-end mt-2">
                                    <CustomButton type="button" variant="solid" color="primary" onClick={onApplyUrl}>
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
                            </CustomBox>
                        </CustomBox>

                        <CustomTypography variant="small" className="opacity-70">
                            Tip: mark a primary image using the star on a filled slot.
                        </CustomTypography>
                    </CustomBox>
                </CustomBox>
            )}
        </CustomBox>
    );
};

MealImageUploader.propTypes = {
    errors: PropTypes.object,
    onImagesChange: PropTypes.func.isRequired,
    initialImages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            imageUrl: PropTypes.string,
            orderIndex: PropTypes.number,
            primary: PropTypes.bool,
        })
    ),
};


export default MealImageUploader;
