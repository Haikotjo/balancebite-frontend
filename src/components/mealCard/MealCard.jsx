import PropTypes from "prop-types";
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    Collapse, Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import useNutrients from "../../hooks/useNutrients.js";
import useExpand from "../../hooks/useExpand";
import NutrientList from "./nutrientList/NutrientList";
import IngredientList from "./ingredientList/IngredientList";
import { getImageSrc } from "../../utils/helpers/getImageSrc.js";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import MealCardActions from "./mealCardActions/MealCardActions.jsx";
import MealDetails from "./mealDetails/MealDetails.jsx";
import MealCardActionButtons from "./mealCardActionButtons/MealCardActionButtons.jsx";
import MealDetailsWithIcons from "./mealDetailsWithIcons/MealDetailsWithIcons.jsx";
import SectionTitle from "./sectionTitle/SectionTitle.jsx";

function MealCard({ meal, refreshList, onFilter }) { // ✅ onFilter toegevoegd
    const { expanded, toggleExpand } = useExpand();
    const { nutrients } = useNutrients(meal.id);
    const imageSrc = getImageSrc(meal);

    return (
        <Card sx={{
            minWidth: 300,
            maxWidth: 345,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }}>

            <MealDetails
                diet={meal.diet}
                mealType={meal.mealType}
                cuisine={meal.cuisine}
                nutrients={nutrients}
                onFilter={onFilter}
            />

            <Box sx={{ position: "relative" }}>
                <CardMedia
                    component="img"
                    image={imageSrc}
                    alt={meal.name}
                    sx={{
                        width: "100%",
                        aspectRatio: "16/9",
                    }}
                />

                <MealCardActionButtons meal={meal} />

            </Box>

            <MealDetailsWithIcons
                diet={meal.diet}
                mealType={meal.mealType}
                cuisine={meal.cuisine}
                nutrients={nutrients}
                onFilter={onFilter}
            />

            <CardContent sx={{ flexGrow: 1, paddingBottom: "10px !important" }}>

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
                        marginBottom: "8px",
                    }}
                >
                    {meal.mealDescription || "No description provided."}
                </Typography>

            </CardContent>

            <MealCardActions
                meal={meal}
                expanded={expanded}
                toggleExpand={toggleExpand}
                refreshList={refreshList}
            />

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <SectionTitle text="Ingredients:" />
                    <ErrorBoundary>
                        <IngredientList ingredients={meal.mealIngredients} />
                    </ErrorBoundary>

                    <SectionTitle text="Nutrients:" sx={{ marginTop: "16px" }} />
                    <ErrorBoundary>
                        <NutrientList nutrients={nutrients} />
                    </ErrorBoundary>
                </CardContent>
            </Collapse>


        </Card>
    );
}

MealCard.propTypes = {
    meal: PropTypes.object.isRequired,
    refreshList: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
};

export default MealCard;
