import { useState } from "react";

export const useRequireAuthDialog = (defaultMessage = "You must be logged in to continue.") => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(defaultMessage);
    const [showLoginForm, setShowLoginForm] = useState(false);

    const triggerAuthDialog = (message) => {
        if (message) setErrorMessage(message);
        setDialogOpen(true);
    };

    const handleLoginRedirect = () => {
        setDialogOpen(false);
        setTimeout(() => setShowLoginForm(true), 150);
    };

    const reset = () => {
        setDialogOpen(false);
        setShowLoginForm(false);
    };

    return {
        dialogOpen,
        errorMessage,
        showLoginForm,
        triggerAuthDialog,
        handleLoginRedirect,
        reset,
        setShowLoginForm,
    };
};
