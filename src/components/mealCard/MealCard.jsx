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
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import { useMeal } from "../../hooks/useMeals";

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

function MealCard({ mealId }) {
    const { meal, loading, error } = useMeal(mealId);
    const [expanded, setExpanded] = React.useState(false);
    const [showIngredients, setShowIngredients] = React.useState(false);
    const [nutrients, setNutrients] = useState([]);
    const [loadingNutrients, setLoadingNutrients] = useState(true);
    const [showMacronutrients, setShowMacronutrients] = React.useState(false);


    useEffect(() => {
        // Fetch macronutrients for the meal
        fetch(`http://localhost:8080/meals/nutrients/${mealId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch nutrients");
                }
                return response.json();
            })
            .then((data) => {
                setNutrients(Object.values(data)); // Converteer naar een array
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

    const handleAddMeal = () => {
        console.log(`Meal ${meal.name} added to your list!`);
    };

    const handleToggleIngredients = () => {
        setShowIngredients(!showIngredients);
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
                <Typography variant="h6" color="text.primary">{meal.name}</Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: "0.7rem",
                    }}
                >
                    Created By: {meal.createdBy?.userName}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: "0.8rem",
                    }}
                    onClick={handleToggleIngredients}
                >
                    Ingredients
                </Typography>
                {showIngredients && (
                    <ul>
                        {meal.mealIngredients.map((ingredient) => (
                            <li key={ingredient.id}>
                                {truncateTextAtComma(ingredient.foodItemName, 10)}{" "}
                                - {ingredient.quantity} gram
                            </li>
                        ))}
                    </ul>
                )}

                <Typography
                    variant="body2"
                    sx={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: "0.8rem",
                        marginBottom: "8px", // Optionele marges voor spacing
                    }}
                    onClick={() => setShowMacronutrients(!showMacronutrients)}
                >
                    Macronutrients
                </Typography>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {nutrients
                        .filter(
                            (nutrient) =>
                                nutrient.nutrientName === "Energy kcal" ||
                                nutrient.nutrientName === "Total lipid (fat) g" ||
                                nutrient.nutrientName === "Carbohydrates g" ||
                                nutrient.nutrientName === "Protein g"
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
                {showMacronutrients && (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {nutrients.map((nutrient) => {
                            if (
                                nutrient.nutrientName !== "Energy kcal" &&
                                nutrient.nutrientName !== "Total lipid (fat) g" &&
                                nutrient.nutrientName !== "Carbohydrates g" &&
                                nutrient.nutrientName !== "Protein g"
                            ) {
                                return (
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
                                );
                            }
                            return null; // Verberg de al weergegeven nutriënten
                        })}
                    </ul>
                )}


            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add meal" onClick={handleAddMeal}>
                    <AddIcon />
                </IconButton>
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
                    <Typography paragraph>Description:</Typography>
                    <Typography paragraph>
                        {meal.mealDescription || "No description provided."}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}

// Voeg PropTypes validatie toe
MealCard.propTypes = {
    mealId: PropTypes.number.isRequired, // Verplicht prop en moet een nummer zijn
};

export default MealCard;
