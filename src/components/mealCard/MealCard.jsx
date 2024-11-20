import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
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
import { useMeal } from "../../hooks/useMeals"; // Verwijst naar de hook

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
    const { meal, loading, error } = useMeal(mealId); // Haal data uit de hook
    const [expanded, setExpanded] = React.useState(false);
    const [showFullText, setShowFullText] = React.useState(false);

    if (loading) return <div>Loading meal...</div>;
    if (error) return <div>Error: {error}</div>;

    // Logica om de afbeelding te bepalen
    const imageSrc = meal.image
        ? `data:image/jpeg;base64,${meal.image}` // Base64-afbeelding
        : meal.imageUrl || "https://via.placeholder.com/150"; // Fallback URL

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleAddMeal = () => {
        console.log(`Meal ${meal.name} added to your list!`);
        // Voeg hier de logica toe voor het toevoegen van de maaltijd
    };

    const truncateTextAtComma = (text) => {
        if (!text) return "Unknown"; // Controleer op null of undefined
        const commaIndex = text.indexOf(",");
        return commaIndex !== -1 ? text.slice(0, commaIndex) : text; // Tot eerste komma of volledige tekst
    };


    const handleShowFullText = () => {
        setShowFullText(!showFullText);
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
                <Typography variant="h5">{meal.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    Created By: {meal.createdBy?.userName}
                </Typography>
                <Typography variant="body1">Ingredients:</Typography>
                <ul onClick={handleShowFullText} style={{ cursor: "pointer" }}>
                    {meal.mealIngredients.map((ingredient) => (
                        <li key={ingredient.id}>
                            {showFullText
                                ? ingredient.foodItemName
                                : truncateTextAtComma(ingredient.foodItemName, 10)}{" "}
                            - {ingredient.quantity} gram
                        </li>
                    ))}
                </ul>
                {!showFullText && (
                    <Typography variant="body2" color="text.secondary">
                        Click to view full ingredient names
                    </Typography>
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
