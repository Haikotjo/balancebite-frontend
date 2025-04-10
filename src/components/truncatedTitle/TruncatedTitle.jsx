import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * TruncatedTitle component that truncates the meal title after two lines
 * and links to the meal details page when clicked.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.title - The meal title text.
 * @param {string | number} props.mealId - The ID of the meal for navigation.
 * @returns {JSX.Element} A meal title truncated to two lines, linking to its details page.
 */
const TruncatedTitle = ({ title, mealId, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/meal/${mealId}`);
        }
    };

    return (
        <Box>
            <Typography
                variant="h6"
                onClick={handleClick}
                sx={{
                    color: "primary.main", // Uses theme primary color
                    cursor: "pointer", // Makes it clickable
                    fontWeight: "bold", // Makes it stand out
                    display: "-webkit-box", // Required for line clamping
                    WebkitBoxOrient: "vertical", // Ensures vertical text layout
                    WebkitLineClamp: 2, // Limit text to 2 lines
                    overflow: "hidden", // Hide overflowing text
                    textOverflow: "ellipsis", // Adds "..." when truncated
                    maxWidth: "100%", // Ensures ellipsis works properly
                    "&:hover": {
                        color: "text.primary",
                        textDecoration: "underline",
                    },
                }}
                gutterBottom
            >
                {title}
            </Typography>
        </Box>
    );
};

// PropTypes validation for TruncatedTitle
TruncatedTitle.propTypes = {
    title: PropTypes.string.isRequired, // Ensures "title" is a required string
    mealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Ensures "mealId" is a required string or number
    onClick: PropTypes.func,
};

export default TruncatedTitle;
