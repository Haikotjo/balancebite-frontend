import { Box, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import PropTypes from "prop-types";

/**
 * SidebarHeader component - Renders a header for a sidebar with a title and a close button.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Callback function triggered when the close button is clicked
 * @param {string} props.title - The title displayed in the sidebar header
 */
const SidebarHeader = ({ onClose, title }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}
    >
        {/* Sidebar Title */}
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
            {title}
        </Typography>

        {/* Close Button */}
        <IconButton onClick={onClose} sx={{ color: "text.primary" }}>
            <Close />
        </IconButton>
    </Box>
);

SidebarHeader.propTypes = {
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default SidebarHeader;
