// MealImageChooserModal.jsx
import PropTypes from "prop-types";
import { X } from "lucide-react";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import CustomModal from "../../../../components/layout/CustomModal.jsx";

import TakePhotoSection from "../takePhotoSection/TakePhotoSection.jsx";
import PasteImageUrlSection from "../pasteImageUrlSection/PasteImageUrlSection.jsx";
import UploadImageSection from "../uploadImageSection/UploadImageSection.jsx";

/**
 * Meal image chooser modal.
 * Pure presentational component.
 */
const MealImageChooserModal = ({
                                   isOpen,
                                   onClose,

                                   onCapture,

                                   urlValue,
                                   onUrlChange,
                                   hasUrlError,
                                   onApplyUrl,

                                   onTriggerUpload,
                               }) => {
    if (!isOpen) return null;

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            zIndex="z-[2147483000]"
            contentClassName="w-[92%] max-w-lg rounded-2xl border-2 border-borderDark dark:border-borderLight bg-lightBackground dark:bg-darkBackground shadow-lg p-4 flex flex-col gap-4"
            historyKey="meal_image_chooser"
        >
            <CustomBox className="flex items-center justify-between">
                <CustomTypography as="h4" variant="h4">
                    Add image
                </CustomTypography>
                <CustomIconButton
                    icon={<X size={18} />}
                    onClick={onClose}
                    bgColor="bg-transparent"
                    ariaLabel="Close"
                    className="text-error"
                />
            </CustomBox>

            <CustomBox className="flex flex-col gap-3">
                <TakePhotoSection onCapture={onCapture} />

                <PasteImageUrlSection
                    urlValue={urlValue}
                    onUrlChange={onUrlChange}
                    hasError={hasUrlError}
                    onApply={onApplyUrl}
                />

                <UploadImageSection onUpload={onTriggerUpload} />
            </CustomBox>

            <CustomTypography variant="small" className="opacity-70">
                Tip: mark a primary image using the star on a filled slot.
            </CustomTypography>
        </CustomModal>
    );
};

MealImageChooserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,

    onCapture: PropTypes.func.isRequired,

    urlValue: PropTypes.string.isRequired,
    onUrlChange: PropTypes.func.isRequired,
    hasUrlError: PropTypes.bool.isRequired,
    onApplyUrl: PropTypes.func.isRequired,

    onTriggerUpload: PropTypes.func.isRequired,
};

export default MealImageChooserModal;
