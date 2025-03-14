import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";

/**
 * MealInfoOverlay component displays the "Created By" and "User Count" information
 * at the bottom of a meal card image, with responsive font sizes.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.meal - The meal object containing createdBy and userCount.
 * @returns {JSX.Element} An overlay with meal creator and user count.
 */
const MealInfoOverlay = ({ meal }) => {
    return (
        <Box
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "5px 10px",
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.8rem" },
                }}
            >
                {`Created By: ${meal.createdBy?.userName}`}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.8rem" },
                }}
            >
                {`Added by ${meal.userCount} user${meal.userCount === 1 ? "" : "s"}`}
            </Typography>
        </Box>
    );
};

// PropTypes validation
MealInfoOverlay.propTypes = {
    meal: PropTypes.shape({
        createdBy: PropTypes.shape({
            userName: PropTypes.string,
        }),
        userCount: PropTypes.number,
    }).isRequired,
};

export default MealInfoOverlay;
