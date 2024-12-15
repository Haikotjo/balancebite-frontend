import { IconButton } from "@mui/material";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import PropTypes from "prop-types";

const RemoveFoodItemButton = ({ value, index, onRemove }) => (
    <IconButton
        onClick={() => onRemove(index)}
        aria-label="remove ingredient"
        disabled={value.length <= 2}
        color={value.length > 2 ? "error" : "default"}
    >
        <RemoveCircleOutlineRoundedIcon />
    </IconButton>
);

RemoveFoodItemButton.propTypes = {
    value: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default RemoveFoodItemButton;
