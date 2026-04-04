import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { CircleAlert, CheckCircle, X } from "lucide-react";
import { Dialog, DialogPanel, DialogTitle } from "./dialog/Dialog.jsx";

const ErrorDialog = React.forwardRef(
    ({ open, onClose, onCloseExtra, message, actionLabel, onAction, type = "error", children }, ref) => {
        const isSuccess = type === "success";

        const handleClose = () => {
            onClose();
            if (onCloseExtra) onCloseExtra();
        };

        return (
            <Dialog open={open} onClose={handleClose} ref={ref} className="relative z-[1000]">

                {/* Backdrop */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            aria-hidden="true"
                        />
                    )}
                </AnimatePresence>

                {/* Panel container */}
                <div className="fixed inset-0 flex items-center justify-center px-4">
                    <AnimatePresence>
                        {open && (
                            <DialogPanel as="div">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 12 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="w-full max-w-md overflow-hidden rounded-2xl border border-content/10 bg-surface shadow-2xl"
                                >
                                    {/* Header */}
                                    <div className={`flex items-center justify-between px-5 py-4 ${isSuccess ? "bg-success/10" : "bg-error/10"}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isSuccess ? "bg-success/20" : "bg-error/20"}`}>
                                                {isSuccess
                                                    ? <CheckCircle size={20} className="text-success" />
                                                    : <CircleAlert size={20} className="text-error" />
                                                }
                                            </div>
                                            <DialogTitle as="h2" className="text-base font-semibold text-content">
                                                {isSuccess ? "Success" : "Action Required"}
                                            </DialogTitle>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-content/40 transition-colors hover:bg-content/10 hover:text-content"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="px-5 py-4 space-y-1">
                                        <p className="text-sm leading-relaxed text-content/70">
                                            {message}
                                        </p>
                                        {children && (
                                            <div className="pt-1">
                                                {children}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer — primary action first, close as ghost */}
                                    <div className="flex flex-col gap-2 border-t border-border px-5 py-4">
                                        {actionLabel && onAction && (
                                            <button
                                                type="button"
                                                onClick={onAction}
                                                className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg bg-primary hover:bg-primary-emphasis hover:shadow-primary/25"
                                            >
                                                {actionLabel}
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="w-full rounded-xl border border-border bg-surface-sunken py-2.5 text-sm font-medium text-content/60 transition-colors hover:bg-content/10 hover:text-content"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </motion.div>
                            </DialogPanel>
                        )}
                    </AnimatePresence>
                </div>
            </Dialog>
        );
    }
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
