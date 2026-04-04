import { useState, useCallback } from "react";

export const useRequireAuthDialog = (defaultMessage = "You must be logged in to continue.") => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(defaultMessage);
    const [showLoginForm, setShowLoginForm] = useState(false);

    const triggerAuthDialog = useCallback((message) => {
        if (message) setErrorMessage(message);
        setDialogOpen(true);
    }, []);

    // Small delay lets the auth dialog finish its close animation before
    // the login form mounts, preventing a visual flash.
    const handleLoginRedirect = useCallback(() => {
        setDialogOpen(false);
        setTimeout(() => setShowLoginForm(true), 150);
    }, []);

    const reset = useCallback(() => {
        setDialogOpen(false);
        setShowLoginForm(false);
        setErrorMessage(defaultMessage);
    }, [defaultMessage]);

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
