import PropTypes from "prop-types";
import AccordionItem from "../accordionItem/AccordionItem.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const MealAccordion = ({ meal }) => {
    return (
        <AccordionItem
            key={meal.id}
            title={
                <CustomTypography variant="paragraphCard">
                    {meal.name}
                </CustomTypography>
            }
            headerClassName="hover:bg-gray-50 dark:hover:bg-gray-900"
        >
            {/* Meal description */}
            <AccordionItem
                title={
                    <CustomTypography variant="small">
                        Description
                    </CustomTypography>
                }
                headerClassName="hover:bg-transparent"
            >
                <CustomTypography variant="small" className="italic">
                    {meal.mealDescription || "No description provided."}
                </CustomTypography>
            </AccordionItem>

            {/* Ingredients */}
            <AccordionItem
                title={
                    <CustomTypography variant="small" >
                        Ingredients
                    </CustomTypography>
                }
                headerClassName="hover:bg-transparent"
            >
                {meal.mealIngredients?.length > 0 ? (
                    meal.mealIngredients.map((ingredient, idx) => (
                        <CustomTypography
                            key={idx}
                            variant="xsmallCard"
                            className="mb-1"
                        >
                            {ingredient.foodItemName || "Unknown ingredient"} – {ingredient.quantity} g
                        </CustomTypography>
                    ))
                ) : (
                    <CustomTypography variant="xsmallCard">
                        No ingredients listed.
                    </CustomTypography>
                )}
            </AccordionItem>

            {/* Details */}
            <AccordionItem
                title={
                    <CustomTypography variant="small" >
                        Details
                    </CustomTypography>
                }
                headerClassName="hover:bg-transparent"
            >
                <CustomTypography variant="xsmallCard" className="mb-1">
                    Prep time: {meal.preparationTime?.replace("PT", "") || "N/A"}
                </CustomTypography>
                <CustomTypography variant="xsmallCard" className="mb-1">
                    Calories: {meal.totalCalories ?? "N/A"} kcal
                </CustomTypography>
                <CustomTypography variant="xsmallCard" className="mb-1">
                    Protein: {meal.totalProtein ?? "N/A"} g
                </CustomTypography>
                <CustomTypography variant="xsmallCard" className="mb-1">
                    Carbs: {meal.totalCarbs ?? "N/A"} g
                </CustomTypography>
                <CustomTypography variant="xsmallCard">
                    Fat: {meal.totalFat ?? "N/A"} g
                </CustomTypography>
            </AccordionItem>
        </AccordionItem>
    );
};

MealAccordion.propTypes = {
    meal: PropTypes.shape({
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
    }).isRequired,
};

export default MealAccordion;
