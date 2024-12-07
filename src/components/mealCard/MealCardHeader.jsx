import PropTypes from "prop-types";
import { Typography, CardMedia } from "@mui/material";

function MealCardHeader({ meal, onCreatorClick }) {
    return (
        <>
            <CardMedia
                component="img"
                height="140"
                image={meal.imageUrl || "defaultImage.jpg"} // Gebruik een fallback voor imageSrc
                alt={meal.name}
            />
            <Typography variant="h6" color="text.primary">
                {meal.name}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.7rem" }}
            >
                Created By:{" "}
                <span
                    onClick={() => onCreatorClick(meal.createdBy?.userName)}  // Function call on click
                    style={{ textDecoration: "underline", color: "inherit", cursor: "pointer" }}
                >
                    {meal.createdBy?.userName}
                </span>
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "0.8rem",
                    marginTop: "8px",
                    marginBottom: "16px",
                }}
            >
                {meal.mealDescription || "No description provided."}
            </Typography>
        </>
    );
}

MealCardHeader.propTypes = {
    meal: PropTypes.object.isRequired,
    onCreatorClick: PropTypes.func.isRequired,  // Make sure it's required
};

export default MealCardHeader;
