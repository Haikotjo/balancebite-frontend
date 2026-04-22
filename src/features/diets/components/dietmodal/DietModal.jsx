import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { useEffect, useRef } from "react";
import { useModal } from "../../../../context/useModal.js";
import SlickDietCard from "../slickDietCard/SlickDietCard.jsx";
import ModalScrollToTopButton from "../../../../components/modalScrollToTopButton/ModalScrollToTopButton.jsx";
import useModalHistoryBack from "../../../../hooks/useModalHistoryBack.js";

const DietModal = ({ diet, isPinned = false }) => {
    const { closeModal } = useModal();
    const contentRef = useRef(null);
    const isOpen = !!diet;

    const { requestClose } = useModalHistoryBack({
        isOpen,
        onRequestClose: () => closeModal(),
        stateKey: "diet_modal",
    });

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => { if (e.key === "Escape") requestClose(); };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, requestClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-[2147483000] flex items-center justify-center"
            role="presentation"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={requestClose}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div
                className="relative z-[2147483001] w-full h-full rounded-none lg:w-[90%] lg:h-auto lg:max-w-4xl lg:rounded-2xl shadow-2xl bg-surface overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {/* Scroll container */}
                <div
                    ref={contentRef}
                    data-scroll-container
                    className="h-full max-h-full lg:max-h-[85vh] overflow-y-auto relative"
                >
                    <SlickDietCard
                        diet={diet}
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

DietModal.propTypes = {
    diet: PropTypes.object.isRequired,
    isPinned: PropTypes.bool,
};

export default DietModal;
