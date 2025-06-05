import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import ErrorDialog from "../components/layout/ErrorDialog.jsx"; // gebruik je bestaande dialoog

const DialogContext = createContext();
export const useDialog = () => useContext(DialogContext);

export const DialogProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [dialogData, setDialogData] = useState({
        message: "",
        type: "error",
        actionLabel: null,
        onAction: null,
        children: null,
    });

    const showDialog = useCallback(
        ({ message, type = "error", actionLabel, onAction, children }) => {
            setDialogData({ message, type, actionLabel, onAction, children });
            setOpen(true);
        },
        []
    );

    const closeDialog = () => setOpen(false);

    return (
        <DialogContext.Provider value={{ showDialog }}>
            {children}
            <ErrorDialog
                open={open}
                onClose={closeDialog}
                message={dialogData.message}
                type={dialogData.type}
                actionLabel={dialogData.actionLabel}
                onAction={dialogData.onAction}
            >
                {dialogData.children}
            </ErrorDialog>
        </DialogContext.Provider>
    );
};

DialogProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
