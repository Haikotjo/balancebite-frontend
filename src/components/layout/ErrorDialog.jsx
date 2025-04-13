'use client'

import PropTypes from "prop-types"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { CircleAlert } from "lucide-react"

/**
 * A minimal and stable error dialog using Headless UI.
 * Fully Tailwind-based and safe across all browsers and platforms.
 *
 * @component
 */

const ErrorDialog = ({ open, onClose, message, actionLink, actionLabel, onAction }) => {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-[1000]">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center px-4">
                <DialogPanel className="w-full max-w-md rounded-md bg-white dark:bg-darkBackground text-black dark:text-white p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                        <CircleAlert className="text-error shrink-0" size={24} />
                        <DialogTitle as="h2" className="text-lg font-semibold">
                            Action Required
                        </DialogTitle>
                    </div>

                    <p className="text-sm mb-4">{message}</p>

                    {actionLink && actionLabel && (
                        <a
                            href={actionLink}
                            target="_self"
                            rel="noopener noreferrer"
                            className="text-sm text-primary underline hover:text-primary/80 transition block mb-4"
                        >
                            {actionLabel}
                        </a>
                    )}

                    {!actionLink && actionLabel && (
                        <button
                            onClick={onAction}
                            className="text-sm text-primary underline hover:text-primary/80 transition block mb-4"
                        >
                            {actionLabel}
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full bg-error text-white py-2 rounded-md text-sm hover:bg-error/90 transition"
                    >
                        Close
                    </button>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

ErrorDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    actionLink: PropTypes.string,
    actionLabel: PropTypes.string,
    onAction: PropTypes.func, // ✅ nieuwe prop
};

export default ErrorDialog;
