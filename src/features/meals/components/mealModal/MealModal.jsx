// src/features/meals/components/modal/MealModal.jsx
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { useEffect, useMemo, useRef } from "react";
import { useModal } from "../../../../context/useModal.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import MealCard from "../mealCard/MealCard.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import ModalScrollToTopButton from "../../../../components/modalScrollToTopButton/ModalScrollToTopButton.jsx";

const MealModal = ({ meal, isPinned = false, mode = "view", onCancel, onConfirm }) => {
    const { closeModal } = useModal();

    const isPreview = useMemo(() => mode === "preview", [mode]);
    const contentRef = useRef(null);

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
            {/* Backdrop */}
            <CustomBox
                as="div"
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={isPreview ? undefined : closeModal}
                aria-hidden={isPreview ? "true" : "false"}
            />

            <CustomBox
                as="div"
                className="relative z-[2147483001] w-[90%] max-w-4xl rounded-xl shadow-lg bg-lightBackground dark:bg-darkBackground"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={isPreview ? "Meal preview (actions limited)" : "Meal view"}
            >
                {/* Scroll-container met ref */}
                <CustomBox
                    ref={contentRef}
                    className="max-h-[70vh] sm:max-h-[70vh] md:max-h-[85vh] overflow-y-auto"
                >
                    {isPreview && (
                        <>
                            <CustomBox className="sticky top-0 z-[2147483002] p-3 sm:p-4 bg-lightBackground/90 dark:bg-darkBackground/90 backdrop-blur">
                                <CustomTypography
                                    as="div"
                                    variant="h1"
                                    font="sans"
                                    weight="bold"
                                    className="opacity-80 text-center w-full"
                                >
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
                                        <CustomTypography
                                            as="span"
                                            variant="h5"
                                            font="sans"
                                            weight="bold"
                                            color="text-white"
                                        >
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
                                        <CustomTypography
                                            as="span"
                                            variant="h5"
                                            font="sans"
                                            weight="bold"
                                            color="text-error"
                                        >
                                            Cancel
                                        </CustomTypography>
                                    </CustomButton>
                                </CustomBox>
                            </CustomBox>

                            <CustomBox className="h-2" aria-hidden="true" />
                        </>
                    )}

                    <MealCard
                        meal={meal}
                        viewMode="modal"
                        isPinned={isPinned}
                        disableActions={isPreview}
                    />
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
