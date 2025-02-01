import { createContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    const showSnackbar = useCallback((message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

SnackbarProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
