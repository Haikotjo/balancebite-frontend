import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { useModal } from "../../../../context/useModal.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import DietCard from "../dietCard/DietCard.jsx";
import { useEffect, useRef } from "react";
import useModalHistoryBack from "../../../../hooks/useModalHistoryBack.js";
import DietCardActionButtons from "../dietCardActionButtons/DietCardActionButtons.jsx";
import { useDietFloatingActions } from "../../../../hooks/useFloatingActionBar.js";

const DietModal = ({ diet, isPinned = false }) => {
    const { closeModal } = useModal();
    const contentRef = useRef(null);

    // Refs to anchor + card
    const cardRef = useRef(null);
    const actionsAnchorRef = useRef(null);

    const isOpen = !!diet;

    const { requestClose } = useModalHistoryBack({
        isOpen,
        onRequestClose: () => closeModal(),
        stateKey: "diet_modal",
    });

    useEffect(() => {
        if (!isOpen) return; // Only listen when modal is open

        const onKeyDown = (e) => {
            if (e.key === "Escape") requestClose();
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, requestClose]);

    const { showFloatingActions, floatingStyle } = useDietFloatingActions({
        diet,
        contentRef,
        cardRef,
        actionsAnchorRef,
    });

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <CustomBox
            className="fixed inset-0 z-[2147483000] flex items-center justify-center"
            role="presentation"
        >
            {/* Backdrop */}
            <CustomBox
                as="div"
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={requestClose}
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
            >
                {/* Scroll container */}
                <CustomBox ref={contentRef} className="h-full overflow-y-auto lg:max-h-[85vh] relative">
                    {/* Floating actions bar (visually inside card) */}
                    {showFloatingActions && (
                        <CustomBox
                            className="fixed top-0 z-[2147483002] pointer-events-none"
                            style={{ left: floatingStyle.left, width: floatingStyle.width }}
                        >
                            <CustomBox
                                className="
                  mx-0
                  bg-cardLight/95 dark:bg-cardDark/95
                  backdrop-blur
                  border-b border-borderDark/30 dark:border-borderLight/30
                  shadow-md
                  pointer-events-auto
                  rounded-t-xl
                "
                            >
                                <CustomBox className="p-2 flex">
                                    <DietCardActionButtons diet={diet} viewMode="modal" />
                                </CustomBox>
                            </CustomBox>
                        </CustomBox>
                    )}

                    <DietCard
                        diet={diet}
                        isPinned={isPinned}
                        viewMode="modal"
                        cardRef={cardRef}
                        actionsAnchorRef={actionsAnchorRef}
                    />
                </CustomBox>
            </CustomBox>
        </CustomBox>,
        document.body
    );
};

DietModal.propTypes = {
    diet: PropTypes.object.isRequired,
    isPinned: PropTypes.bool,
};

export default DietModal;
