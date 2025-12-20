// CustomModal.jsx
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import CustomBox from "./CustomBox.jsx";
import clsx from "clsx";
import useModalHistoryBack from "../../hooks/useModalHistoryBack.js";

const CustomModal = ({
                         isOpen,
                         onClose,
                         children,
                         zIndex = "z-50",
                         contentClassName = "",
                         disableBackClose = false,
                         historyKey = "bb_modal",
                     }) => {
    // Central back/forward/back-swipe handling
    const { requestClose } = useModalHistoryBack({
        isOpen,
        onRequestClose: onClose,
        disabled: disableBackClose,
        stateKey: historyKey,
    });

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                if (disableBackClose) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
                requestClose("escape");
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, disableBackClose, requestClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !disableBackClose) {
            requestClose("backdrop");
        }
    };

    return ReactDOM.createPortal(
        <CustomBox
            className={clsx(
                "fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center",
                zIndex,
                "px-2 sm:px-4"
            )}
            onClick={handleOverlayClick}
        >
            <CustomBox
                className={clsx(
                    "w-[90%] max-w-sm max-h-[90vh] overflow-y-auto",
                    contentClassName
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </CustomBox>
        </CustomBox>,
        document.body
    );
};

CustomModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
    zIndex: PropTypes.string,
    contentClassName: PropTypes.string,

    // Optional behavior controls
    disableBackClose: PropTypes.bool,
    historyKey: PropTypes.string,
};

export default CustomModal;
