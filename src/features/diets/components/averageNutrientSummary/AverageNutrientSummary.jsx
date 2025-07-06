import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import MacroSummary from "../macroSummary/MacroSummary.jsx";

const AverageNutrientSummary = ({ diet, dayCount, showDivider = true }) => {
    // Don't render if any required value is missing
    if (
        !diet ||
        diet.avgCalories == null ||
        diet.avgProtein == null ||
        diet.avgFat == null ||
        diet.avgCarbs == null ||
        diet.avgSaturatedFat == null ||
        diet.avgUnsaturatedFat == null ||
        diet.avgSugars == null
    ) return null;

    return (
        <CustomBox>
            <CustomTypography variant="small" className="mb-1 italic">
                ({dayCount}-day diet)
            </CustomTypography>

            <CustomTypography variant="small" className="mb-2 italic">
                Average daily intake:
            </CustomTypography>

            <MacroSummary
                showLabel={false}
                showDayBreakdown ={false}
                className="mb-2"
                diet={diet}
                totalNutrients={{
                    "Energy kcal": { value: Math.round(diet.avgCalories) },
                    "Protein g": { value: Math.round(diet.avgProtein) },
                    "Total lipid (fat) g": { value: Math.round(diet.avgFat) },
                    "Carbohydrates g": { value: Math.round(diet.avgCarbs) },
                    "Saturated fat g": { value: Math.round(diet.avgSaturatedFat) },
                    "Unsaturated fat g": { value: Math.round(diet.avgUnsaturatedFat) },
                    "Sugars g": { value: Math.round(diet.avgSugars) },
                }}
            />

            {showDivider && <CustomDivider className="my-4" />}
        </CustomBox>
    );
};

AverageNutrientSummary.propTypes = {
    diet: PropTypes.shape({
        avgCalories: PropTypes.number,
        avgProtein: PropTypes.number,
        avgFat: PropTypes.number,
        avgCarbs: PropTypes.number,
        avgSaturatedFat: PropTypes.number,
        avgUnsaturatedFat: PropTypes.number,
        avgSugars: PropTypes.number,
    }).isRequired,
    dayCount: PropTypes.number.isRequired,
    showDivider: PropTypes.bool,
};

export default AverageNutrientSummary;
