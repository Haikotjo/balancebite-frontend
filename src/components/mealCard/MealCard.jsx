import PropTypes from "prop-types";
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    CardActions,
    Collapse,
    IconButton,
    Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router-dom";
import useNutrients from "../../hooks/useNutrients.js";
import useExpand from "../../hooks/useExpand";
import NutrientList from "../nutrientList/NutrientList";
import IngredientList from "../ingredientList/IngredientList";
import ExpandMoreIconButton from "../styledComponents/expandMoreIconButton/ExpandMoreIconButton.jsx";
import { getImageSrc } from "../../utils/getImageSrc";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import useFavorites from "../../hooks/useFavorites";

function MealCard({ meal }) {
    const { expanded, toggleExpand } = useExpand();
    const { nutrients } = useNutrients(meal.id);
    const { isFavorite, addMealToFavorites } = useFavorites();
    const imageSrc = getImageSrc(meal);

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia component="img" height="140" image={imageSrc} alt={meal.name} />
            <CardContent>
                <Typography variant="h6" color="text.primary">{meal.name}</Typography>
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
                <NutrientList nutrients={nutrients} />
            </CardContent>
            <CardActions disableSpacing>
                <Box display="flex" alignItems="center" width="100%">
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            textDecoration: "underline",
                            "&:hover": { color: "primary.main" },
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
                    >
                        <ExpandMoreIcon />
                    </ExpandMoreIconButton>
                    <IconButton onClick={() => addMealToFavorites(meal.id)} sx={{ marginLeft: "auto" }}>
                        <FavoriteBorderIcon color={isFavorite ? "error" : "primary"} />
                    </IconButton>
                </Box>
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
                    <ErrorBoundary>
                        <IngredientList ingredients={meal.mealIngredients} />
                    </ErrorBoundary>
                </CardContent>
            </Collapse>
        </Card>
    );
}

MealCard.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default MealCard;