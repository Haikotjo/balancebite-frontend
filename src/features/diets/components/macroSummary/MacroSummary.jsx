import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import {macroIconClasses, macroIcons} from "../../../../utils/helpers/macroIcons.js";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const nutrientLabels = {
    "Energy kcal": "Calories",
    "Total lipid (fat) g": "Fats",
    "Carbohydrates g": "Carbs",
    "Protein g": "Protein",
};

const MacroSummary = ({ totalNutrients, className = "" }) => {
    if (!totalNutrients) return null;

    return (
        <CustomBox className={`flex flex-wrap gap-4 ${className}`}>
            {Object.keys(nutrientLabels).map((key) => {
                const nutrient = totalNutrients[key];
                if (!nutrient) return null;

                const label = nutrientLabels[key];
                const Icon = macroIcons[label];
                const iconClass = macroIconClasses[label];

                return (
                    <CustomBox key={nutrient.nutrientId || key} className="flex items-center gap-2">
                        {Icon && <Icon size={16} className={iconClass} />}
                        <CustomTypography variant="xsmallCard">
                            {label}: {Math.round(nutrient.value)} {nutrient.unitName}
                        </CustomTypography>
                    </CustomBox>
                );
            })}
        </CustomBox>
    );
};

MacroSummary.propTypes = {
    totalNutrients: PropTypes.object,
    className: PropTypes.string,
};

export default MacroSummary;
