// src/features/meals/components/modal/MealModal.jsx
/**
 * MealModal
 * - In "preview" mode ONLY Confirm/Create and Cancel are allowed.
 */

import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { useEffect, useMemo } from "react";
import { useModal } from "../../../../context/useModal.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import MealCard from "../mealCard/MealCard.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const MealModal = ({ meal, isPinned = false, mode = "view", onCancel, onConfirm }) => {
    const { closeModal } = useModal();

    // Compute flags before any conditional returns so hooks always run
    const isPreview = useMemo(() => mode === "preview", [mode]);

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
        <CustomBox className="fixed inset-0 z-[100] flex items-center justify-center" data-mode={mode}>
            {/* Backdrop layer */}
            <CustomBox
                as="div"
                className="absolute inset-0 bg-black bg-opacity-70"
                onClick={isPreview ? undefined : closeModal} // disable backdrop close in preview
                aria-hidden={isPreview ? "true" : "false"}
            />

            {/* Modal surface */}
            <CustomBox
                as="div"
                className="relative z-10 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg bg-lightBackground dark:bg-darkBackground"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={isPreview ? "Meal preview (actions limited)" : "Meal view"}
            >
                {/* Preview header + top actions on small screens */}
                {isPreview && (
                    <CustomBox className="sticky top-0 z-10 p-3 sm:p-4 border-b border-divider bg-lightBackground/95 dark:bg-darkBackground/95 backdrop-blur">
                        <CustomTypography as="div" variant="small" bold className="uppercase opacity-80">
                            Preview
                        </CustomTypography>

                        <CustomBox className="mt-2 flex flex-col sm:flex-row gap-2 md:hidden">
                            <CustomButton
                                onClick={handleConfirm}
                                variant="solid"
                                color="primary"
                                className="flex-1 py-2"
                                aria-label="Create meal"
                            >
                                Confirm
                            </CustomButton>
                            <CustomButton
                                onClick={handleCancel}
                                variant="solid"
                                color="error"
                                className="flex-1 py-2"
                                aria-label="Cancel and delete meal"
                            >
                                Cancel
                            </CustomButton>
                        </CustomBox>
                    </CustomBox>
                )}

                {/* Main meal content (actions disabled in preview) */}
                <MealCard
                    meal={meal}
                    viewMode="modal"
                    isPinned={isPinned}
                    disableActions={isPreview}
                />

                {/* Bottom actions for md+ */}
                {isPreview && (
                    <CustomBox className="hidden md:flex w-full p-3 sm:p-4 border-t border-divider gap-2">
                        <CustomButton
                            onClick={handleConfirm}
                            variant="solid"
                            color="primary"
                            className="flex-1 py-2"
                            aria-label="Create meal"
                        >
                            Confirm
                        </CustomButton>
                        <CustomButton
                            onClick={handleCancel}
                            variant="solid"
                            color="error"
                            className="flex-1 py-2"
                            aria-label="Cancel and delete meal"
                        >
                            Cancel
                        </CustomButton>
                    </CustomBox>
                )}
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
