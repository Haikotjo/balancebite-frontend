import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import {useMemo, useRef, useCallback} from "react";
import { useModal } from "../../../../context/useModal.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import MealCard from "../mealCard/MealCard.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import ModalScrollToTopButton from "../../../../components/modalScrollToTopButton/ModalScrollToTopButton.jsx";
import usePreviewAutoCancel from "../../../../hooks/usePreviewAutoCancel.js";
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import  {useMealFloatingActions} from "../../../../hooks/useFloatingActionBar.js";

const MealModal = ({ meal, isPinned = false, mode = "view", onCancel, onConfirm }) => {
    const { closeModal } = useModal();
    const isPreview = useMemo(() => mode === "preview", [mode]);
    const contentRef = useRef(null);
    const cardRef = useRef(null);
    const actionsAnchorRef = useRef(null);

    const { markConfirmed, markCancelled } = usePreviewAutoCancel({
        meal,
        isPreview,
        onCancel,
    });

    const handleCancel = useCallback(async () => {
        markCancelled();

        try {
            if (onCancel) await onCancel(meal);
        } catch (err) {
            console.error("Cancel cleanup failed:", err);
        } finally {
            closeModal();
        }
    }, [markCancelled, onCancel, meal, closeModal]);

    const handleConfirm = useCallback(async () => {
        markConfirmed();
        closeModal();

        try {
            if (onConfirm) await onConfirm(meal);
        } catch (err) {
            console.error("Confirm failed:", err);
        }
    }, [markConfirmed, closeModal, onConfirm, meal]);

    const { showFloatingActions, floatingStyle } = useMealFloatingActions({
        meal,
        isPreview,
        contentRef,
        cardRef,
        actionsAnchorRef,
    });


    if (!meal) return null;

    return ReactDOM.createPortal(
        <CustomBox className="fixed inset-0 z-[2147483000] flex items-center justify-center" data-mode={mode} role="presentation">
            <CustomBox
                as="div"
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={isPreview ? handleCancel : closeModal}
                aria-hidden={isPreview ? "true" : "false"}
            />

            <CustomBox
                as="div"
                className="
                          relative z-[2147483001]
                          w-full h-full rounded-none
                          lg:w-[90%] lg:h-auto lg:max-w-4xl lg:rounded-xl
                          shadow-lg bg-lightBackground dark:bg-darkBackground
                          "
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={isPreview ? "Meal preview (actions limited)" : "Meal view"}
            >

                <CustomBox ref={contentRef} className="h-full max-h-full lg:max-h-[85vh] overflow-y-auto relative">
                    {isPreview && (
                        <>
                            <CustomBox className="sticky top-0 z-[2147483002] p-3 sm:p-4 bg-lightBackground/90 dark:bg-darkBackground/90 backdrop-blur">
                                <CustomTypography as="div" variant="h1" font="sans" weight="bold" className="opacity-80 text-center w-full">
                                    Meal Preview
                                </CustomTypography>

                                <CustomBox className="mt-2 flex flex-col sm:flex-row gap-2">
                                    <CustomButton onClick={handleConfirm} variant="solid" color="primary" className="px-4 py-2 flex-1" aria-label="Create meal">
                                        <CustomTypography as="span" variant="h5" font="sans" weight="bold" color="text-white">
                                            Confirm
                                        </CustomTypography>
                                    </CustomButton>

                                    <CustomButton onClick={handleCancel} variant="outline" color="error" className="px-4 py-2 flex-1" aria-label="Cancel and delete meal">
                                        <CustomTypography as="span" variant="h5" font="sans" weight="bold" color="text-error">
                                            Cancel
                                        </CustomTypography>
                                    </CustomButton>
                                </CustomBox>
                            </CustomBox>

                            <CustomBox className="h-2" aria-hidden="true" />
                        </>
                    )}
                    {showFloatingActions && (
                        <CustomBox
                            className="fixed z-[2147483002] pointer-events-none"
                            style={{ left: floatingStyle.left, width: floatingStyle.width, top: floatingStyle.top }}
                        >

                                <CustomBox className="p-2 pointer-events-auto">
                                    <MealCardActionButtons isFloating meal={meal} viewMode="modal" />
                                </CustomBox>

                        </CustomBox>
                    )}

                    <MealCard meal={meal} viewMode="modal" isPinned={isPinned} disableActions={isPreview} cardRef={cardRef}
                              actionsAnchorRef={actionsAnchorRef} />
                </CustomBox>

                <ModalScrollToTopButton targetRef={contentRef} />
            </CustomBox>
        </CustomBox>,
        document.body
    );
};

MealModal.propTypes = {
    meal: PropTypes.object.isRequired,
    isPinned: PropTypes.bool,
    mode: PropTypes.oneOf(["view", "preview"]),
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
};

export default MealModal;
