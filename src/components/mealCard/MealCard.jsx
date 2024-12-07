import { useState } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Collapse, CardActions } from "@mui/material";
import useNutrients from "./hooks/useNutrients.js";
import useExpand from "./hooks/useExpand.js";
import { getImageSrc } from "../../utils/getImageSrc";
import useFavorites from "./hooks/useFavorites.jsx";
import MealCardHeader from "./MealCardHeader";
import MealCardActions from "./MealCardActions";
import IngredientsSection from "./IngredientsSection";
import NutrientList from "./nutrientList/NutrientList";

function MealCard({ meal, isDuplicate: initialDuplicate }) {
    const { expanded, toggleExpand } = useExpand();
    const { nutrients } = useNutrients(meal.id);
    const { addMealToFavorites, SnackbarComponent } = useFavorites();
    const imageSrc = getImageSrc(meal);

    const [isDuplicate, setIsDuplicate] = useState(initialDuplicate);

    const handleAddToFavorites = async () => {
        const success = await addMealToFavorites(meal.id);
        if (success) {
            setIsDuplicate(true);
        }
    };

    return (
        <>
            <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                    <MealCardHeader meal={meal} imageSrc={imageSrc} />
                    <NutrientList nutrients={nutrients} />
                </CardContent>
                <CardActions disableSpacing>
                    <MealCardActions
                        expanded={expanded}
                        toggleExpand={toggleExpand}
                        handleAddToFavorites={handleAddToFavorites}
                        isDuplicate={isDuplicate}
                    />
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <IngredientsSection ingredients={meal.mealIngredients} />
                    </CardContent>
                </Collapse>
            </Card>
            {SnackbarComponent}
        </>
    );
}

MealCard.propTypes = {
    meal: PropTypes.object.isRequired,
    isDuplicate: PropTypes.bool.isRequired,
};

export default MealCard;
