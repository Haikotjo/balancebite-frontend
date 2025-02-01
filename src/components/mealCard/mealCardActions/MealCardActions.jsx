import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMoreIconButton from "../expandMoreIconButton/ExpandMoreIconButton.jsx";
import {color} from "framer-motion";

const MealCardActions = ({ expanded, toggleExpand }) => {
    return (
        <Box display="flex" alignItems="center" width="100%">

            <Typography
                variant="body2"
                sx={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    color: "primary.main",
                    "&:hover": {
                        color: "text.light",
                        textDecoration: "underline",
                    },
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
                sx={{
                color: "primary.main",
                    "&:hover": {
                        color: "text.light",
                    },
                }}
            >
                <ExpandMoreIcon/>
            </ExpandMoreIconButton>
        </Box>
    );
};

MealCardActions.propTypes = {
    expanded: PropTypes.bool.isRequired,
    toggleExpand: PropTypes.func.isRequired,
};

export default MealCardActions;
