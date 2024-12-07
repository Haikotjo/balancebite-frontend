import PropTypes from "prop-types";
import { Box, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIconButton from "../styledComponents/expandMoreIconButton/ExpandMoreIconButton.jsx";

function MealCardActions({ expanded, toggleExpand, handleAddToFavorites, isDuplicate }) {
    return (
        <Box display="flex" alignItems="center" width="100%">
            <Typography
                variant="body2"
                sx={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    "&:hover": { color: "primary.main" },
                }}
                onClick={toggleExpand}
                aria-expanded={expanded}
                aria-label="show more"
            >
                Ingredients and Nutrients
            </Typography>
            <ExpandMoreIconButton
                expand={expanded}
                onClick={toggleExpand}
                aria-expanded={expanded}
                aria-label="show more"
            >
                <ExpandMoreIcon />
            </ExpandMoreIconButton>
            <IconButton
                onClick={handleAddToFavorites}
                sx={{ marginLeft: "auto" }}
                disabled={isDuplicate}
            >
                {isDuplicate ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="primary" />}
            </IconButton>
        </Box>
    );
}

MealCardActions.propTypes = {
    expanded: PropTypes.bool.isRequired,
    toggleExpand: PropTypes.func.isRequired,
    handleAddToFavorites: PropTypes.func.isRequired,
    isDuplicate: PropTypes.bool.isRequired,
};

export default MealCardActions;
