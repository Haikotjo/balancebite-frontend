import { useState } from "react";
import ErrorDialog from "../components/layout/ErrorDialog";

/**
 * Hook for handling form success and error messages.
 */
export function useFormMessages() {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const setError = (msg) => setErrorMessage(msg || "");
    const setSuccess = (msg) => setSuccessMessage(msg || "");
    const clear = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    /**
     * renderDialogs can optionally receive:
     *  - onSuccessClose → extra callback after closing the success dialog
     */
    const renderDialogs = ({ onSuccessClose } = {}) => (
        <>
            {errorMessage && (
                <ErrorDialog
                    open
                    onClose={() => setErrorMessage("")}
                    message={errorMessage}
                    type="error"
                />
            )}

            {successMessage && (
                <ErrorDialog
                    open
                    onClose={() => setSuccessMessage("")}
                    onCloseExtra={onSuccessClose}
                    message={successMessage}
                    type="success"
                />
            )}
        </>
    );

    return {
        setError,
        setSuccess,
        clear,
        renderDialogs,
    };
}
