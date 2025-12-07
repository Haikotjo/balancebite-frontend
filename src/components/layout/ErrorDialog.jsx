import React from "react";
import PropTypes from "prop-types";
import { CircleAlert, CheckCircle } from "lucide-react";
import CustomBox from "./CustomBox.jsx";
import CustomButton from "./CustomButton.jsx";
import { Dialog, DialogPanel, DialogTitle } from "./dialog/Dialog.jsx";

const ErrorDialog = React.forwardRef(
    (
        { open, onClose, onCloseExtra, message, actionLabel, onAction, type = "error", children },
        ref
    ) => (
        <Dialog open={open} onClose={onClose} ref={ref} className="relative z-[1000]">
            {/* backdrop */}
            <CustomBox
                as="div"
                className="fixed inset-0 bg-black/50"
                aria-hidden="true"
            />

            {/* panel container */}
            <CustomBox as="div" className="fixed inset-0 flex items-center justify-center px-4">
                <DialogPanel
                    as={CustomBox}
                    className="bg-cardLight dark:bg-cardAccentDark rounded px-4 py-3 shadow-lg w-full max-w-md"
                >
                    {/* header */}
                    <CustomBox className="flex items-center gap-2 mb-4">
                        {type === "success" ? (
                            <CheckCircle size={24} className="text-success shrink-0" />
                        ) : (
                            <CircleAlert size={24} className="text-error shrink-0" />
                        )}
                        <DialogTitle as="h2" className="text-lg font-semibold text-lightText dark:text-darkText">
                            {type === "success" ? "Success" : "Action Required"}
                        </DialogTitle>
                    </CustomBox>

                    {/* message */}
                    <CustomBox className="text-sm mb-4 text-lightText dark:text-darkText">
                        {message}
                        {children}
                    </CustomBox>

                    {/* actie-knop */}
                    {actionLabel && onAction && (
                        <CustomButton
                            onClick={onAction}
                            className="block mb-4 text-sm underline text-primary hover:text-primary/80"
                        >
                            {actionLabel}
                        </CustomButton>
                    )}

                    {/* sluitknop */}
                    <CustomButton
                        onClick={() => {
                            onClose();            // close the dialog itself
                            if (onCloseExtra) {   // optional extra close handler
                                onCloseExtra();   // e.g. close outer modal
                            }
                        }}
                        className={`w-full py-2 rounded-md text-sm text-white transition ${
                            type === "success"
                                ? "bg-success hover:bg-success/90"
                                : "bg-error hover:bg-error/90"
                        }`}
                    >
                        Close
                    </CustomButton>
                </DialogPanel>
            </CustomBox>
        </Dialog>
    )
);

ErrorDialog.displayName = "ErrorDialog";

ErrorDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    actionLabel: PropTypes.string,
    onAction: PropTypes.func,
    type: PropTypes.oneOf(["error", "success"]),
    children: PropTypes.node,
    onCloseExtra: PropTypes.func,
};

export default ErrorDialog;
