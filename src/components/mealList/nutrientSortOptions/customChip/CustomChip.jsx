import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";

/**
 * CustomChip component: A manually styled alternative to MUI Chip.
 * Ensures icons are always centered properly and dynamically resizes.
 */
const CustomChip = ({ icon, label, selected, onClick, iconMargin = 0 }) => {
    const theme = useTheme();
    const extraWidth = icon ? (iconMargin * 2) : 0;

    return (
        <Box
            onClick={onClick}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 40 + extraWidth,
                height: "35px",
                paddingX: label ? "12px" : "0px",
                borderRadius: "20px",
                border: `2px solid ${theme.palette.primary.main}`,
                backgroundColor: selected ? theme.palette.primary.main : "transparent",
                color: selected ? theme.palette.text.light : theme.palette.primary.main,
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                "&:hover": {
                    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.primary.light,
                },
            }}
        >
            <Box sx={{ marginX: `${iconMargin}px`, display: "flex", alignItems: "center" }}>
                {icon}
            </Box>
            {label && <Box sx={{ marginLeft: icon ? "8px" : "0" }}>{label}</Box>}
        </Box>
    );
};

CustomChip.propTypes = {
    icon: PropTypes.element,
    label: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    iconMargin: PropTypes.number,
};

export default CustomChip;
