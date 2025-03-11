import { Box, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import PropTypes from "prop-types";

const SidebarHeader = ({ onClose, title }) => (
    <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        // marginBottom: 0,
    }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
            {title}
        </Typography>
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
