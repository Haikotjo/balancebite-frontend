// src/features/meals/components/modal/MealModal.jsx
/**
 * MealModal
 *
 * Preview rules:
 * - In "preview" mode ONLY Confirm/Create and Cancel are allowed.
 * - Backdrop click and ESC are disabled.
 * - Top action bar is ALWAYS shown (all breakpoints), sticky, very high z-index.
 * - A visual spacer separates the top bar from the card content (no borders).
 *
 * View rules:
 * - In "view" mode the backdrop click closes the modal and ESC works.
 */

import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import {useEffect, useMemo, useRef} from "react";
import { useModal } from "../../../../context/useModal.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import MealCard from "../mealCard/MealCard.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import ModalScrollToTopButton from "../../../../components/modalScrollToTopButton/ModalScrollToTopButton.jsx";

const MealModal = ({ meal, isPinned = false, mode = "view", onCancel, onConfirm }) => {
    const { closeModal } = useModal();

    // Compute flags before any conditional returns so hooks always run
    const isPreview = useMemo(() => mode === "preview", [mode]);

    const contentRef = useRef(null);

    // Block ESC in preview-mode; allow ESC in view-mode.
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                if (!isPreview) {
                    closeModal();
                } else {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isPreview, closeModal]);

    // If no meal, render nothing but AFTER hooks have executed (keeps hook order stable)
    if (!meal) return null;

    const handleCancel = async () => {
        if (onCancel) await onCancel(meal);
        closeModal();
    };

    const handleConfirm = async () => {
        if (onConfirm) await onConfirm(meal);
        closeModal();
    };

    return ReactDOM.createPortal(
        <CustomBox
            className="fixed inset-0 z-[2147483000] flex items-center justify-center"
            data-mode={mode}
            role="presentation"
        >
            {/* Backdrop layer (click disabled in preview) */}
            <CustomBox
                as="div"
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={isPreview ? undefined : closeModal}
                aria-hidden={isPreview ? "true" : "false"}
            />

            {/* Modal surface */}
            <CustomBox
                as="div"
                ref={contentRef}
                className=" relative z-[2147483001] w-[90%] max-w-4xl max-h-[70vh] sm:max-h-[70vh] md:max-h-[85vh] overflow-y-auto rounded-xl shadow-lg bg-lightBackground dark:bg-darkBackground "
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={isPreview ? 'Meal preview (actions limited)' : 'Meal view'}
            >
                {/* Always-on TOP action bar in preview (sticky, very high z-index) */}
                {isPreview && (
                    <>
                        <CustomBox
                            className="sticky top-0 z-[2147483002] p-3 sm:p-4 bg-lightBackground/90 dark:bg-darkBackground/90 backdrop-blur"
                            /* Sticky top bar with actions */
                        >
                            <CustomTypography as="div" variant="h1" font="sans" weight="bold" className="opacity-80 text-center w-full">
                                Meal Preview
                            </CustomTypography>

                            <CustomBox className="mt-2 flex flex-col sm:flex-row gap-2">
                                <CustomButton
                                    onClick={handleConfirm}
                                    variant="solid"
                                    color="primary"
                                    className="px-4 py-2 flex-1"
                                    aria-label="Create meal"
                                >
                                    <CustomTypography as="span" variant="h5" font="sans" weight="bold" color="text-white">
                                        Confirm
                                    </CustomTypography>
                                </CustomButton>

                                <CustomButton
                                    onClick={handleCancel}
                                    variant="outline"
                                    color="error"
                                    className="px-4 py-2 flex-1"
                                    aria-label="Cancel and delete meal"
                                >
                                    <CustomTypography as="span" variant="h5" font="sans" weight="bold" color="text-error">
                                        Cancel
                                    </CustomTypography>
                                </CustomButton>
                            </CustomBox>
                        </CustomBox>

                        {/* Visual separation between top bar and card content (no borders). */}
                        <CustomBox className="h-2" aria-hidden="true" />
                    </>
                )}

                {/* Main meal content (actions disabled in preview) */}
                <MealCard
                    meal={meal}
                    viewMode="modal"
                    isPinned={isPinned}
                    disableActions={isPreview}
                />

                {/* Bottom action bar removed: buttons are always at the top now */}
            </CustomBox>
            <ModalScrollToTopButton targetRef={contentRef} />
        </CustomBox>,
        document.body
    );
};

MealModal.propTypes = {
    /** Meal to display in the modal */
    meal: PropTypes.object.isRequired,
    /** Pass-through pinned styling to MealCard */
    isPinned: PropTypes.bool,
    /** "view" (no actions) | "preview" (top actions, restricted) */
    mode: PropTypes.oneOf(["view", "preview"]),
    /** Optional cancel handler (called before closing) */
    onCancel: PropTypes.func,
    /** Optional confirm handler (called before closing) */
    onConfirm: PropTypes.func,
};

export default MealModal;
