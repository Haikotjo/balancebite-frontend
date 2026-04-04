import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import ErrorDialog from "../components/layout/ErrorDialog.jsx";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
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

    const closeDialog = useCallback(() => setOpen(false), []);

    return (
        <NotificationContext.Provider value={{ showDialog }}>
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
        </NotificationContext.Provider>
    );
};

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
