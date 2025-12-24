// MealImageUploader.jsx
// UI: 4 image slots (grid). Click a slot to choose: Take photo / Paste URL / Upload file.
// Output: calls onImagesChange(filesArray, primaryIndex).
//
// Notes:
// - Primary selection is explicit via the "star" button on a filled slot.
// - URL option tries to fetch the image and convert it to a File (can fail due to CORS).
// - Camera option converts the captured data URL to a File (no base64 storage).

import PropTypes from "prop-types";
import { useMemo, useRef, useState } from "react";
import { Camera as CameraIcon, ImagePlus, Link2, Upload, X, Star, Trash2 } from "lucide-react";

import CustomBox from "../../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../../components/layout/CustomTypography.jsx";
import CustomIconButton from "../../../../../components/layout/CustomIconButton.jsx";
import CustomButton from "../../../../../components/layout/CustomButton.jsx";
import CustomTextField from "../../../../../components/layout/CustomTextField.jsx";

import Camera from "../../camera/Camera.jsx";

const MAX_SLOTS = 4;

const dataUrlToFile = async (dataUrl, filename = "captured-image.jpg") => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
};

const urlToFile = async (url, filename = "url-image.jpg") => {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`Failed to fetch image (${res.status})`);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
};

const MealImageUploader = ({ errors, onImagesChange }) => {
    // slots: { file: File|null, previewUrl: string|null }
    const [slots, setSlots] = useState(Array.from({ length: MAX_SLOTS }, () => ({ file: null, previewUrl: null })));
    const [primaryIndex, setPrimaryIndex] = useState(null);

    // chooser modal state
    const [chooserOpen, setChooserOpen] = useState(false);
    const [activeSlotIndex, setActiveSlotIndex] = useState(null);

    // url input inside chooser
    const [urlValue, setUrlValue] = useState("");
    const [urlError, setUrlError] = useState("");

    // file input ref for uploads
    const fileInputRef = useRef(null);

    const filesArray = useMemo(() => slots.map((s) => s.file).filter(Boolean), [slots]);

    const effectivePrimaryIndex = useMemo(() => {
        // If user never selected a primary but there is at least one image, default to first image.
        if (filesArray.length > 0 && primaryIndex == null) return 0;
        return primaryIndex;
    }, [filesArray.length, primaryIndex]);

    const emitChange = (nextSlots, nextPrimaryIndex) => {
        const nextFiles = nextSlots.map((s) => s.file).filter(Boolean);

        let p = nextPrimaryIndex ?? null;
        if (nextFiles.length > 0 && p == null) p = 0;
        if (p != null) {
            if (p < 0) p = 0;
            if (p >= nextFiles.length) p = nextFiles.length - 1;
        }

        onImagesChange(nextFiles, p);
    };

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

    const setSlotFile = (slotIndex, file) => {
        setSlots((prev) => {
            const next = [...prev];

            // Clean up old preview URL if needed
            const oldPreview = next[slotIndex]?.previewUrl;
            if (oldPreview && oldPreview.startsWith("blob:")) {
                try { URL.revokeObjectURL(oldPreview); } catch (e) { /* ignore */ }
            }

            const previewUrl = file ? URL.createObjectURL(file) : null;
            next[slotIndex] = { file, previewUrl };

            // If we add the first file and primary isn't set, default to 0 at emit time
            emitChange(next, primaryIndex);

            return next;
        });
    };

    const clearSlot = (slotIndex) => {
        setSlots((prev) => {
            const next = [...prev];

            const oldPreview = next[slotIndex]?.previewUrl;
            if (oldPreview && oldPreview.startsWith("blob:")) {
                try { URL.revokeObjectURL(oldPreview); } catch (e) { /* ignore */ }
            }

            next[slotIndex] = { file: null, previewUrl: null };

            // If the cleared slot was primary, reset primaryIndex
            let nextPrimary = primaryIndex;
            const nextFiles = next.map((s) => s.file).filter(Boolean);
            if (nextFiles.length === 0) nextPrimary = null;

            // If primary was explicitly set, keep it but clamp via emitChange
            emitChange(next, nextPrimary);

            return next;
        });
    };

    const setPrimaryBySlot = (slotIndex) => {
        // PrimaryIndex is based on the order of filesArray, not slot index.
        // We define primary as: "the first non-empty slot index ordering".
        const fileSlots = slots
            .map((s, i) => ({ ...s, slotIndex: i }))
            .filter((s) => !!s.file);

        const idxInFiles = fileSlots.findIndex((s) => s.slotIndex === slotIndex);
        if (idxInFiles === -1) return;

        setPrimaryIndex(idxInFiles);
        onImagesChange(fileSlots.map((s) => s.file), idxInFiles);
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
        } catch (e) {
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
        } catch (e) {
            // CORS is common here; keep the error simple.
            setUrlError("Could not download this URL (often CORS). Upload the file instead.");
        }
    };

    const hasAny = slots.some((s) => !!s.file);

    return (
        <CustomBox className="flex flex-col gap-3 w-full my-8">
            {/* Slots grid */}
            <CustomBox className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {slots.map((slot, i) => {
                    const isFilled = !!slot.file;
                    const isPrimary =
                        isFilled &&
                        (() => {
                            // Determine if this slot corresponds to the current primaryIndex in filesArray ordering
                            const fileSlots = slots
                                .map((s, idx) => ({ file: s.file, slotIndex: idx }))
                                .filter((x) => !!x.file);
                            const idxInFiles = fileSlots.findIndex((x) => x.slotIndex === i);
                            return idxInFiles !== -1 && idxInFiles === effectivePrimaryIndex;
                        })();

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
                            // Clear all slots
                            setSlots((prev) => {
                                prev.forEach((s) => {
                                    if (s.previewUrl && s.previewUrl.startsWith("blob:")) {
                                        try { URL.revokeObjectURL(s.previewUrl); } catch (e) { /* ignore */ }
                                    }
                                });
                                const next = Array.from({ length: MAX_SLOTS }, () => ({ file: null, previewUrl: null }));
                                setPrimaryIndex(null);
                                onImagesChange([], null);
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
    // onImagesChange(filesArray, primaryIndex)
    onImagesChange: PropTypes.func.isRequired,
};

export default MealImageUploader;
