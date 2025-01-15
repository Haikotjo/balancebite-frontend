import PropTypes from "prop-types";
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    Collapse,
} from "@mui/material";
import { Link } from "react-router-dom";
import useNutrients from "../../hooks/useNutrients.js";
import useExpand from "../../hooks/useExpand";
import NutrientList from "./nutrientList/NutrientList";
import IngredientList from "./ingredientList/IngredientList";
import { getImageSrc } from "../../utils/getImageSrc";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import MealCardActions from "./mealCardActions/MealCardActions.jsx";
import useFavorites from "../../hooks/useFavorites.jsx";

function MealCard({ meal, refreshList }) { // Voeg refreshList toe aan de props
    const { expanded, toggleExpand } = useExpand();
    const { nutrients } = useNutrients(meal.id);
    const { SnackbarComponent } = useFavorites();
    const imageSrc = getImageSrc(meal);

    return (
        <>
            <Card sx={{ minWidth: 300, maxWidth: 345 }}>
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
                        sx={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.7rem" }}
                    >
                        Created By: {" "}
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
                    <NutrientList nutrients={nutrients} />
                </CardContent>
                <MealCardActions
                    meal={meal}
                    expanded={expanded}
                    toggleExpand={toggleExpand}
                    refreshList={refreshList} // Geef refreshList door
                />
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
                        <ErrorBoundary>
                            <IngredientList ingredients={meal.mealIngredients} />
                        </ErrorBoundary>
                    </CardContent>
                </Collapse>
            </Card>
            {SnackbarComponent}
        </>
    );
}

MealCard.propTypes = {
    meal: PropTypes.object.isRequired,
    refreshList: PropTypes.func.isRequired, // Voeg prop validatie toe
};

export default MealCard;
