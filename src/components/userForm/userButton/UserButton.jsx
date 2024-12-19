import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";

const UserButton = ({
                        isEditable,
                        onEdit,
                        onCancel,
                        onConfirm,
                        confirmDisabled = false,
                    }) => {
    return isEditable ? (
        <Box sx={{ display: "flex", gap: 2 }}>
            <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={onCancel}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={onConfirm}
                disabled={confirmDisabled}
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
        >
            Change Info
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
