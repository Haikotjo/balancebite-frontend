import PropTypes from "prop-types";
import {
    Card,
    CardContent,
    CardMedia,
    Collapse, Box,
} from "@mui/material";
import useNutrients from "../../hooks/useNutrients.js";
import useExpand from "../../hooks/useExpand";
import NutrientList from "./nutrientList/NutrientList";
import IngredientList from "./ingredientList/IngredientList";
import { getImageSrc } from "../../utils/helpers/getImageSrc.js";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import MealCardActions from "./mealCardActions/MealCardActions.jsx";
import MealCardActionButtons from "./mealCardActionButtons/MealCardActionButtons.jsx";
import MealDetailsWithIcons from "./mealDetailsWithIcons/MealDetailsWithIcons.jsx";
import SectionTitle from "./sectionTitle/SectionTitle.jsx";
import ExpandableDescription from "../expandableDescription/ExpandableDescription.jsx";
import TruncatedTitle from "../truncatedTitle/TruncatedTitle.jsx";
import MealInfoOverlay from "../mealInfoOverlay/MealInfoOverlay.jsx";
import MealTags from "../mealTags/MealTags.jsx";
import MealCardFooter from "../mealCardFooter/MealCardFooter.jsx";

function MealCard({ meal, onFilter, onTitleClick  }) {
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
        <Card sx={{ minWidth: 300, maxWidth: 345, position: "relative", display: "flex", flexDirection: "column", height: "100%", border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0px 0px 8px 2px rgba(0, 0, 0, 0.1)"
            , }}>

            <Box sx={{ position: "relative" }}>
                <CardMedia component="img" image={imageSrc} alt={meal.name} sx={{ width: "100%", aspectRatio: "16/9" }} />
                <MealInfoOverlay meal={meal} />
                <MealCardActionButtons meal={meal} />
            </Box>

            <MealDetailsWithIcons
                diet={meal.diets}
                mealType={meal.mealTypes}
                cuisine={meal.cuisines}
                nutrients={nutrients}
                onFilter={handleFilter}
            />

            <CardContent sx={{ flexGrow: 1, paddingBottom: "10px !important" }}>
                {/* Title */}
                <Box
                    onClick={() => onTitleClick?.(meal)}
                    sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                >
                    <TruncatedTitle title={meal.name} mealId={meal.id}  onClick={() => onTitleClick?.(meal)}/>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 2 }}>
                    <ExpandableDescription description={meal.mealDescription} />
                </Box>

                {/* Meal Tags */}
                <MealTags
                    cuisine={meal.cuisines}
                    diet={meal.diets}
                    mealType={meal.mealTypes}
                    size="small"
                    onFilter={onFilter}
                    onExpandRequest={() => onTitleClick?.(meal)}
                />

            </CardContent>

            <MealCardFooter onClick={() => onTitleClick?.(meal)} />

        </Card>
    );
}


MealCard.propTypes = {
    meal: PropTypes.object.isRequired,
    onFilter: PropTypes.func.isRequired,
    onTitleClick: PropTypes.func,
};

export default MealCard;
