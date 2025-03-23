import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { Maximize2  } from "lucide-react";

/**
 * Footer component voor MealCard met "Ingredients and Nutrients" en een expand-icoon.
 * Klik opent de modal via onClick.
 */
const MealCardFooter = ({ onClick }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            onClick={onClick}
            sx={{ cursor: "pointer", px: 2, pb: 1, mt: 1 }}
        >
            <Typography
                variant="body2"
                sx={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "0.8rem",
                    color: "primary.main",
                    "&:hover": {
                        color: "primary.light",
                        textDecoration: "underline",
                    },
                }}
            >
                Ingredients and Nutrients
            </Typography>

            <Box
                sx={{
                    color: "primary.main",
                    "&:hover": {
                        color: "primary.light",
                    },
                }}
            >
                <Maximize2  size={18} />
            </Box>
        </Box>
    );
};

MealCardFooter.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default MealCardFooter;
