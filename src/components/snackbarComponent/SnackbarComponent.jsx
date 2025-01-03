import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";
import { useTheme, useMediaQuery } from "@mui/material";

const SnackbarComponent = ({ open, onClose, message, severity }) => {
    const theme = useTheme();

    return (
        <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                sx={{
                    backgroundColor: theme.palette.error.main, // Donkerder oranje
                    color: "#fff", // Witte tekst
                    "& .MuiAlert-icon": { color: "#fff" }, // Witte kleur voor het gevarendriehoekje
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

SnackbarComponent.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(["error", "warning", "info", "success"]).isRequired,
};

export default SnackbarComponent;
