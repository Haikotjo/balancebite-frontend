import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    CardActions,
    Collapse,
    IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { useMeal } from "../../hooks/useMeals";
import { Link } from "react-router-dom";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

function MealCard({ mealId, baseEndpoint, userMeals }) {
    // Filter mealId to ensure it exists in userMeals before fetching
    if (!userMeals.includes(mealId)) {
        return null; // Skip rendering if mealId is not in the user's meals
    }

    const { meal, loading, error } = useMeal(baseEndpoint, mealId);
    const [expanded, setExpanded] = useState(false);
    const [nutrients, setNutrients] = useState([]);
    const [loadingNutrients, setLoadingNutrients] = useState(true);

    useEffect(() => {
        const nutrientsEndpoint = `http://localhost:8080/meals/nutrients/${mealId}`;
        fetch(nutrientsEndpoint)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch nutrients");
                }
                return response.json();
            })
            .then((data) => {
                setNutrients(Object.values(data));
                setLoadingNutrients(false);
            })
            .catch((err) => {
                console.error(err.message);
                setLoadingNutrients(false);
            });
    }, [mealId]);

    if (loading) return <div>Loading meal...</div>;
    if (error) return <div>Error: {error}</div>;

    const imageSrc = meal.image
        ? `data:image/jpeg;base64,${meal.image}`
        : meal.imageUrl || "https://via.placeholder.com/150";

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const truncateTextAtComma = (text) => {
        if (!text) return "Unknown";
        const commaIndex = text.indexOf(",");
        return commaIndex !== -1 ? text.slice(0, commaIndex) : text;
    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                height="140"
                image={imageSrc}
                alt={meal.name}
            />
            <CardContent>
                <Typography variant="h6" color="text.primary">
                    {meal.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: "0.7rem",
                    }}
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
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {nutrients
                        .filter(
                            (nutrient) =>
                                ["Energy kcal", "Total lipid (fat) g", "Carbohydrates g", "Protein g"].includes(
                                    nutrient.nutrientName
                                )
                        )
                        .map((nutrient) => (
                            <li
                                key={nutrient.nutrientId}
                                style={{
                                    fontFamily: "'Quicksand', sans-serif",
                                    fontSize: "0.8rem",
                                }}
                            >
                                {nutrient.nutrientName}:{" "}
                                {nutrient.value ? nutrient.value.toFixed(1) : "N/A"}{" "}
                                {nutrient.unitName}
                            </li>
                        ))}
                </ul>
            </CardContent>
            <CardActions disableSpacing>
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        textDecoration: "underline",
                        "&:hover": {
                            color: "primary.main",
                        },
                    }}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    Ingredients and Nutrients
                </Typography>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: "0.8rem",
                            marginBottom: "8px",
                        }}
                    >
                        Ingredients:
                    </Typography>
                    <ul>
                        {meal.mealIngredients.map((ingredient) => (
                            <li
                                key={ingredient.id}
                                style={{
                                    fontFamily: "'Quicksand', sans-serif",
                                    fontSize: "0.8rem",
                                }}
                            >
                                {truncateTextAtComma(ingredient.foodItemName, 10)} -{" "}
                                {ingredient.quantity} grams
                            </li>
                        ))}
                    </ul>
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: "0.8rem",
                            marginTop: "8px",
                        }}
                    >
                        Other Nutrients:
                    </Typography>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {nutrients
                            .filter(
                                (nutrient) =>
                                    !["Energy kcal", "Total lipid (fat) g", "Carbohydrates g", "Protein g"].includes(
                                        nutrient.nutrientName
                                    )
                            )
                            .map((nutrient) => (
                                <li
                                    key={nutrient.nutrientId}
                                    style={{
                                        fontFamily: "'Quicksand', sans-serif",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    {nutrient.nutrientName}:{" "}
                                    {nutrient.value ? nutrient.value.toFixed(1) : "N/A"}{" "}
                                    {nutrient.unitName}
                                </li>
                            ))}
                    </ul>
                </CardContent>
            </Collapse>
        </Card>
    );
}

MealCard.propTypes = {
    mealId: PropTypes.number.isRequired,
    baseEndpoint: PropTypes.string,
    userMeals: PropTypes.array.isRequired, // Required prop for filtering
};

export default MealCard;
