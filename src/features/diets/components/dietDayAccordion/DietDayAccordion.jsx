import PropTypes from "prop-types";
import AccordionItem from "../accordionItem/AccordionItem.jsx";
import MacroSummary from "../macroSummary/MacroSummary.jsx";
import MealAccordion from "../mealAccordion/MealAccordion.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

const DietDayAccordion = ({ day }) => {
    return (
        <AccordionItem
            key={day.id}
            title={
                <CustomTypography variant="paragraphCard">
                    {day.dayLabel}
                </CustomTypography>
            }
            headerClassName="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
            {/* Day description */}
            <AccordionItem
                title={
                    <CustomTypography variant="small">
                        Description
                    </CustomTypography>
                }
                defaultOpen
                headerClassName="hover:bg-transparent"
            >
                <CustomTypography variant="paragraph" className="italic">
                    {day.dietDayDescription || "No description provided."}
                </CustomTypography>
            </AccordionItem>

            {/* MacroSummary onderaan dag */}
            <CustomBox className="my-4">
                <CustomTypography variant="small" className="mb-2">
                    Daily macros:
                </CustomTypography>
                <MacroSummary totalNutrients={day.totalNutrients} />
            </CustomBox>

            {/* Meals */}
            {day.meals?.map((meal) => (
                <MealAccordion key={meal.id} meal={meal} />
            ))}
        </AccordionItem>
    );
};

DietDayAccordion.propTypes = {
    day: PropTypes.shape({
        id: PropTypes.number.isRequired,
        dayLabel: PropTypes.string.isRequired,
        dietDayDescription: PropTypes.string,
        totalNutrients: PropTypes.object,
        meals: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                mealDescription: PropTypes.string,
                preparationTime: PropTypes.string,
                totalCalories: PropTypes.number,
                totalProtein: PropTypes.number,
                totalCarbs: PropTypes.number,
                totalFat: PropTypes.number,
                mealIngredients: PropTypes.arrayOf(
                    PropTypes.shape({
                        foodItemName: PropTypes.string,
                        quantity: PropTypes.number,
                    })
                ),
            })
        ),
    }).isRequired,
};

export default DietDayAccordion;
