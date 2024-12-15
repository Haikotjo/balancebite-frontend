import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const ResetButton = ({ onReset }) => {
    return (
        <Tooltip title="Reset" arrow>
            <IconButton
                color="error"
                onClick={onReset}
                sx={{ width: 40, height: 40 }}
            >
                <DeleteOutlineRoundedIcon fontSize="large" />
            </IconButton>
        </Tooltip>
    );
};

ResetButton.propTypes = {
    onReset: PropTypes.func.isRequired,
};

export default ResetButton;
