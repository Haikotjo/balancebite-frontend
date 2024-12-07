import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";

const SnackbarComponent = ({ open, onClose, message, severity }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                sx={{
                    backgroundColor: "#f57c00", // Donkerder oranje
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
