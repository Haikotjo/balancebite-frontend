import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomGrid from "../layout/CustomGrid.jsx";
import PropTypes from "prop-types";
import MealDetailCard from "../mealCardLarge/MealDetailCard.jsx";
import HorizontalScrollSection from "../horizontalScrollSection/HorizontalScrollSection.jsx";
import MealCardCompact from "../MealCardCompact/MealCardCompact.jsx";

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
        <HorizontalScrollSection
            title="Meals"
            items={meals}
            renderItem={(meal) => (
                <CustomBox className="w-full max-w-[300px]">
                    <MealCardCompact meal={meal} />
                </CustomBox>
            )}
        />
    );
};

StaticMealList.propTypes = {
    meals: PropTypes.array.isRequired,
};

export default StaticMealList;