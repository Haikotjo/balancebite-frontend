import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomGrid from "../layout/CustomGrid.jsx";
import PropTypes from "prop-types";
import MealDetailCard from "../mealCardLarge/MealDetailCard.jsx";

const StaticMealList = ({ meals }) => {
    if (!meals || meals.length === 0) {
        return (
            <CustomBox className="flex justify-center items-center min-h-[20vh]">
                <CustomTypography as="p" variant="paragraph">
                    No meals found.
                </CustomTypography>
            </CustomBox>
        );
    }

    return (
        <CustomBox className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
            {meals.map((meal) => (
                <MealDetailCard key={meal.id} meal={meal} viewMode="list" />
            ))}
        </CustomBox>
    );
};

StaticMealList.propTypes = {
    meals: PropTypes.array.isRequired,
};

export default StaticMealList;