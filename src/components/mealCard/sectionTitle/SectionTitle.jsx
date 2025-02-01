import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SectionTitle = ({ text, sx = {} }) => {
    const theme = useTheme();

    return (
        <Typography
            variant="body2"
            sx={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "0.8rem",
                fontWeight: "bold",
                color: theme.palette.primary.main,
                marginBottom: "8px",
                ...sx,
            }}
        >
            {text}
        </Typography>
    );
};

SectionTitle.propTypes = {
    text: PropTypes.string.isRequired,
    sx: PropTypes.object,
};

export default SectionTitle;
