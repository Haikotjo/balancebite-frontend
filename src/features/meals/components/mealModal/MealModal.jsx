import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { useMemo, useRef, useCallback } from "react";
import { useModal } from "../../../../context/useModal.js";
import SlickMealCard from "../slickMealCard/SlickMealCard.jsx";
import ModalScrollToTopButton from "../../../../components/modalScrollToTopButton/ModalScrollToTopButton.jsx";
import usePreviewAutoCancel from "../../../../hooks/usePreviewAutoCancel.js";
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import { useMealFloatingActions } from "../../../../hooks/useFloatingActionBar.js";

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
        <div
            className="fixed inset-0 z-[2147483000] flex items-center justify-center"
            data-mode={mode}
            role="presentation"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={isPreview ? handleCancel : closeModal}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div
                className="relative z-[2147483001] w-full h-full rounded-none lg:w-[90%] lg:h-auto lg:max-w-4xl lg:rounded-2xl shadow-2xl bg-surface overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={isPreview ? "Meal preview (actions limited)" : "Meal view"}
            >
                {/* Preview banner */}
                {isPreview && (
                    <div className="sticky top-0 z-[2147483002] px-4 py-3 bg-surface/95 backdrop-blur-md border-b border-border/40">
                        <p className="text-center text-sm font-bold text-content/80 mb-2">Meal Preview</p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleConfirm}
                                aria-label="Create meal"
                                className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-emphasis"
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                aria-label="Cancel and delete meal"
                                className="flex-1 rounded-xl border border-error/50 bg-error/10 px-4 py-2 text-sm font-bold text-error transition-colors hover:bg-error/20"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Floating action bar */}
                {showFloatingActions && (
                    <div
                        className="fixed z-[2147483002] pointer-events-none"
                        style={{ left: floatingStyle.left, width: floatingStyle.width, top: floatingStyle.top }}
                    >
                        <div className="p-2 pointer-events-auto">
                            <MealCardActionButtons isFloating meal={meal} viewMode="modal" />
                        </div>
                    </div>
                )}

                {/* Scroll container */}
                <div
                    ref={contentRef}
                    data-scroll-container
                    className="h-full max-h-full lg:max-h-[85vh] overflow-y-auto relative"
                >
                    <SlickMealCard
                        meal={meal}
                        isPinned={isPinned}
                        viewMode="modal"
                        scrollContainerRef={contentRef}
                    />
                </div>

                <ModalScrollToTopButton targetRef={contentRef} />
            </div>
        </div>,
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
