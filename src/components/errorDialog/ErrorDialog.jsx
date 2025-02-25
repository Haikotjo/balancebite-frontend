import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, Typography, Box, Link, useTheme } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ErrorDialog = ({ open, onClose, message, actionLink, actionLabel }) => {
    const theme = useTheme(); // Haal het thema op (light/dark)

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="error-dialog-title"
            aria-describedby="error-dialog-description"
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.7)", // Transparant afhankelijk van light/dark
                    color: theme.palette.text.primary, // Tekstkleur afhankelijk van modus
                    backdropFilter: "blur(5px)", // Zorg voor een mooi blur-effect
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", // Subtiele schaduw
                    borderRadius: "10px", // Maak de dialog een beetje rond
                },
            }}
        >
            <DialogTitle id="error-dialog-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ErrorOutlineIcon color="error" sx={{ fontSize: 24 }} />
                <Typography variant="subtitle1" component="span">
                    Action Required
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ textAlign: "center" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">
                        {message}
                    </Typography>
                    {actionLink && actionLabel && (
                        <Link href={actionLink} underline="hover" sx={{ color: theme.palette.primary.main }}>
                            {actionLabel}
                        </Link>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

ErrorDialog.propTypes = {
    open: PropTypes.bool.isRequired, // Of de dialog open is
    onClose: PropTypes.func.isRequired, // Functie om de dialog te sluiten
    message: PropTypes.string.isRequired, // De foutmelding
    actionLink: PropTypes.string, // Link naar een actie (optioneel)
    actionLabel: PropTypes.string, // Label voor de actieknop (optioneel)
};

export default ErrorDialog;
