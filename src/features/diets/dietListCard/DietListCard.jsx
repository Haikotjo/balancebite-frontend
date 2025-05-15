import PropTypes from "prop-types";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";
import CustomCard from "../../../components/layout/CustomCard.jsx";
import AccordionItem from "../components/accordionItem/AccordionItem.jsx";
import MacroSummary from "../components/macroSummary/MacroSummary.jsx";
import CustomBox from "../../../components/layout/CustomBox.jsx";
import MealAccordion from "../components/mealAccordion/MealAccordion.jsx";

const DietListCard = ({ diet }) => {
    console.log("DietListCard received diet:", diet);
    const dayCount = diet.dietDays?.length ?? 0;

    return (
        <CustomCard className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <CustomTypography variant="h3" className="mb-2">
                {diet.name}
            </CustomTypography>

            {diet.dietDescription && (
                <CustomTypography variant="paragraph" className="mb-4 italic">
                    {diet.dietDescription}
                </CustomTypography>
            )}

            <AccordionItem
                title={`${dayCount} ${dayCount === 1 ? "day" : "days"}`}
                headerClassName="hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                {diet.dietDays.map((day) => (
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
                ))}
            </AccordionItem>
        </CustomCard>
    );
};

DietListCard.propTypes = {
    diet: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        dietDescription: PropTypes.string,
        dietDays: PropTypes.arrayOf(
            PropTypes.shape({
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
            })
        ).isRequired,
    }).isRequired,
};

export default DietListCard;
