import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import MacroSummary from "../macroSummary/MacroSummary.jsx";

const AverageNutrientSummary = ({ averages, dayCount, showDivider = true }) => {
    if (!averages) return null;

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
                className="mb-2"
                totalNutrients={{
                    "Energy kcal": { value: Math.round(averages.avgCalories) },
                    "Protein g": { value: Math.round(averages.avgProtein) },
                    "Total lipid (fat) g": { value: Math.round(averages.avgFat) },
                    "Carbohydrates g": { value: Math.round(averages.avgCarbs) },
                }}
            />

            {showDivider && <CustomDivider className="my-4" />}
        </CustomBox>
    );
};

AverageNutrientSummary.propTypes = {
    averages: PropTypes.shape({
        avgCalories: PropTypes.number,
        avgProtein: PropTypes.number,
        avgFat: PropTypes.number,
        avgCarbs: PropTypes.number,
    }),
    dayCount: PropTypes.number.isRequired,
    showDivider: PropTypes.bool,
};


export default AverageNutrientSummary;
