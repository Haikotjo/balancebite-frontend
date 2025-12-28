// MealImageUploader.jsx
import PropTypes from "prop-types";
import { useRef, useState} from "react";

import CustomBox from "../../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../../components/layout/CustomTypography.jsx";

import {
    dataUrlToFile,
    MAX_SLOTS,
    urlToFile
} from "../../../utils/helpers/mealImageHelpers.js";
import {useMealImageSlots} from "../../../utils/hooks/useMealImageSlots.js";
import MealImageChooserModal from "../../mealImageChooserModal/MealImageChooserModal.jsx";
import ClearAllImagesButton from "../../clearAllImagesButton/ClearAllImagesButton.jsx";
import {clearMealImageSlots} from "../../../utils/helpers/clearMealImageSlots.js";
import MealImageSlot from "../../mealImageSlot/MealImageSlot.jsx";

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
    } = useMealImageSlots({ maxSlots: MAX_SLOTS, onImagesChange, initialImages });


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

    const handleClearAll = () => {
        setSlots((prev) => {
            const next = clearMealImageSlots(prev, MAX_SLOTS);

            setPrimaryIndex(null);
            onImagesChange({
                imageFiles: [],
                replaceOrderIndexes: [],
                keepImageIds: [],
                primaryIndex: null,
            });

            return next;
        });
    };

    const hasAny = slots.some((s) => !!s.file || !!s.previewUrl);

    return (
        <CustomBox className="flex flex-col gap-3 w-full my-8">
            {/* Slots grid */}
            <CustomBox className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {slots.map((slot, i) => (
                    <MealImageSlot
                        key={i}
                        index={i}
                        slot={slot}
                        isPrimary={(!!slot.file || !!slot.previewUrl) && i === effectivePrimaryIndex}
                        onOpenChooser={() => openChooser(i)}
                        onSetPrimary={() => setPrimaryBySlot(i)}
                        onClear={() => clearSlot(i)}
                    />
                ))}

            </CustomBox>

            {/* Clear all */}
            {hasAny && <ClearAllImagesButton onClear={handleClearAll} />}


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
            <MealImageChooserModal
                isOpen={chooserOpen}
                onClose={closeChooser}
                onCapture={(img) => onCapture(img)}
                urlValue={urlValue}
                onUrlChange={(e) => setUrlValue(e.target.value)}
                hasUrlError={!!urlError}
                onApplyUrl={onApplyUrl}
                onTriggerUpload={triggerUpload}
            />

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
