// MealCardJumpLinks.jsx
// Purpose: Renders the row of jump links for a MealCard.

import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import MealCardJumpLink from "../mealCardJumpLink/MealCardJumpLink.jsx";

const MealCardJumpLinks = ({
                               meal,
                               onJumpToPreparation,
                               onJumpToPreparationVideo,
                               onJumpToIngredients,
                               onJumpToNutrients,
                               onJumpToTags,
                           }) => {
    return (
        <CustomBox className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <MealCardJumpLink
                label="Preparation"
                onClick={meal?.mealPreparation ? onJumpToPreparation : null}
            />

            <MealCardJumpLink
                label="Preparation video"
                onClick={meal?.preparationVideoUrl ? onJumpToPreparationVideo : null}
            />

            <MealCardJumpLink label="Ingredients" onClick={onJumpToIngredients} />
            <MealCardJumpLink label="Nutrients" onClick={onJumpToNutrients} />
            <MealCardJumpLink label="Tags" onClick={onJumpToTags} />
        </CustomBox>
    );
};

MealCardJumpLinks.propTypes = {
    meal: PropTypes.object.isRequired,
    onJumpToPreparation: PropTypes.func,
    onJumpToPreparationVideo: PropTypes.func,
    onJumpToIngredients: PropTypes.func.isRequired,
    onJumpToNutrients: PropTypes.func.isRequired,
    onJumpToTags: PropTypes.func.isRequired,
};

export default MealCardJumpLinks;
