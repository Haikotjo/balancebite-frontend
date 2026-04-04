import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomModal = ({
    isOpen,
    onClose,
    children,
    zIndex = "z-50",
    contentClassName = "",
    disableBackClose = false,
}) => {
    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Escape key handler
    useEffect(() => {
        if (!isOpen || disableBackClose) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, disableBackClose, onClose]);

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="modal-backdrop"
                    className={`fixed inset-0 flex items-end justify-center sm:items-center px-0 sm:px-4 ${zIndex}`}
                    onClick={() => { if (!disableBackClose) onClose(); }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Blurred backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

                    {/* Panel */}
                    <motion.div
                        key="modal-panel"
                        onClick={(e) => e.stopPropagation()}
                        className={`
                            relative w-full sm:max-w-lg
                            max-h-[92dvh] sm:max-h-[90dvh]
                            overflow-y-auto overscroll-contain
                            rounded-t-[28px] sm:rounded-[28px]
                            border border-content/10
                            bg-surface shadow-2xl
                            ${contentClassName}
                        `}
                        initial={{ opacity: 0, y: 48, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 32, scale: 0.97 }}
                        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {/* Drag handle — mobile only */}
                        <div className="sticky top-0 flex justify-center pt-3 pb-1 sm:hidden">
                            <div className="h-1 w-10 rounded-full bg-content/20" />
                        </div>

                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

CustomModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
    zIndex: PropTypes.string,
    contentClassName: PropTypes.string,
    disableBackClose: PropTypes.bool,
};

export default CustomModal;
