import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const SectionHeader = ({ icon: Icon, title, theme }) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Icon sx={{ color: theme.palette.mode === "dark" ? theme.palette.text.primary : theme.palette.primary.main, fontSize: 32 }} />
            <Typography variant="h4">{title}</Typography>
        </Box>
    );
};

SectionHeader.propTypes = {
    icon: PropTypes.elementType.isRequired, // ✅ Icon moet een component zijn (bijv. BarChartRoundedIcon)
    title: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
};

export default SectionHeader;
