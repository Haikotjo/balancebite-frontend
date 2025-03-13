import PropTypes from "prop-types";
import { Chip, useTheme } from "@mui/material";

const CustomChip = ({ label, color, onClick }) => {
    const theme = useTheme();

    return (
        <Chip
            label={label}
            onClick={onClick}
            sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette[color].main,
                border: `1px solid ${theme.palette[color].main}`,
                boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: theme.palette[color].main,
                    color: theme.palette.background.paper,
                    boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.3)"
                }
            }}
        />
    );
};

CustomChip.propTypes = {
    label: PropTypes.string.isRequired,
    color: PropTypes.oneOf(["primary", "secondary", "success"]).isRequired,
    onClick: PropTypes.func
};

CustomChip.defaultProps = {
    onClick: () => console.log("Clicked chip")
};

export default CustomChip;
