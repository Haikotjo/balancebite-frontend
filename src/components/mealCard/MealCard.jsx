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
import ExpandableDescription from "../expandableDescription/ExpandableDescription.jsx";
import TruncatedTitle from "../expandableTitle/ExpandableTitle.jsx";
import MealInfoOverlay from "../mealInfoOverlay/MealInfoOverlay.jsx";
import MealTags from "../mealTags/MealTags.jsx";

function MealCard({ meal, refreshList, onFilter }) {
    const { expanded, toggleExpand } = useExpand();
    const { nutrients } = useNutrients(meal.id);
    const imageSrc = getImageSrc(meal);

    const handleFilter = (category, value) => {

        if (onFilter) {
            onFilter(category, value);
        } else {
            console.warn("⚠️ onFilter function is undefined in MealCard!");
        }
    };

    return (
        <Card sx={{ minWidth: 300, maxWidth: 345, position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>

            <MealDetailsWithIcons
                diet={meal.diet}
                mealType={meal.mealType}
                cuisine={meal.cuisine}
                nutrients={nutrients}
                onFilter={handleFilter}
            />

            {/*<MealDetails*/}
            {/*    diet={meal.diet}*/}
            {/*    mealType={meal.mealType}*/}
            {/*    cuisine={meal.cuisine}*/}
            {/*    nutrients={nutrients}*/}
            {/*    onFilter={handleFilter}*/}
            {/*/>*/}

            <Box sx={{ position: "relative" }}>
                <CardMedia component="img" image={imageSrc} alt={meal.name} sx={{ width: "100%", aspectRatio: "16/9" }} />
                <MealInfoOverlay meal={meal} />
                <MealCardActionButtons meal={meal} />
            </Box>



            <CardContent sx={{ flexGrow: 1, paddingBottom: "10px !important" }}>
                {/* Title */}
                <TruncatedTitle title={meal.name} mealId={meal.id} />

                {/* Description */}
                <Box sx={{ mb: 2 }}>
                    <ExpandableDescription description={meal.mealDescription} />
                </Box>

                {/* Meal Tags */}
                <MealTags
                    cuisine={meal.cuisine}
                    diet={meal.diet}
                    mealType={meal.mealType}
                    size="small"
                    onFilter={onFilter}
                />

            </CardContent>

            <MealCardActions meal={meal} expanded={expanded} toggleExpand={toggleExpand} refreshList={refreshList} />

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <SectionTitle text="Ingredients:" />
                    <ErrorBoundary><IngredientList ingredients={meal.mealIngredients} /></ErrorBoundary>
                    <SectionTitle text="Nutrients:" sx={{ marginTop: "16px" }} />
                    <ErrorBoundary><NutrientList nutrients={nutrients} /></ErrorBoundary>
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
