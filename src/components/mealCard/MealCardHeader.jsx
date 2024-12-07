import PropTypes from "prop-types";
import { Typography, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";

function MealCardHeader({ meal, imageSrc }) {
    return (
        <>
            <CardMedia component="img" height="140" image={imageSrc} alt={meal.name} />
            <Typography variant="h6" color="text.primary">
                {meal.name}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.7rem" }}
            >
                Created By:{" "}
                <Link
                    to={`/users/created-meals/${meal.createdBy?.id}`}
                    style={{ textDecoration: "underline", color: "inherit" }}
                >
                    {meal.createdBy?.userName}
                </Link>
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
    imageSrc: PropTypes.string.isRequired,
};

export default MealCardHeader;
