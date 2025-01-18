import { Box, Button, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const UserButton = ({
                        isEditable,
                        onEdit,
                        onCancel,
                        onConfirm,
                        confirmDisabled = false,
                    }) => {
    const theme = useTheme();

    return isEditable ? (
        <Box sx={{ display: "flex", gap: 2 }}>
            <Button
                type="button"
                variant="outlined"
                color="error"
                onClick={onCancel}
                sx={{
                    color: theme.palette.mode === "light" ? theme.palette.error.main : theme.palette.text.light, // ✅ Light mode -> error color, Dark mode -> text.light
                }}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={onConfirm}
                disabled={confirmDisabled}
                sx={{ color: theme.palette.text.light }}
            >
                Confirm
            </Button>
        </Box>
    ) : (
        <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={onEdit}
            sx={{ color: theme.palette.text.light }}
        >
            Update Info
        </Button>
    );
};

UserButton.propTypes = {
    isEditable: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    confirmDisabled: PropTypes.bool,
};

export default UserButton;
