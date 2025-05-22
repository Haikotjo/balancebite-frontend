import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import {macroIconClasses, macroIcons} from "../../../../utils/helpers/macroIcons.js";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const MacroSummary = ({
                          totalNutrients,
                          className = "",
                          compact = false,
                          showLabel = true,
                      }) => {
    if (!totalNutrients) return null;

    const fullLabels = {
        "Energy kcal": "Calories",
        "Protein g": "Protein",
        "Carbohydrates g": "Carbs",
        "Total lipid (fat) g": "Fats",
    };

    const shortLabels = {
        "Energy kcal": "Kcal",
        "Protein g": "Protein",
        "Carbohydrates g": "Carbs",
        "Total lipid (fat) g": "Fat",
    };

    const labels = compact ? shortLabels : fullLabels;

    return (
        <CustomBox className={`flex flex-wrap gap-4 items-center ${className}`}>
            {showLabel && (
                <CustomBox className={`flex items-center gap-2 mb-1 ${compact ? "w-full" : "w-full sm:w-auto"}`}>
                    <CustomTypography
                        variant={compact ? "xsmallCard" : "small"}
                        className="italic"
                    >
                        {compact ? "Summary:" : "Day summary:"}
                    </CustomTypography>
                </CustomBox>
            )}

            {Object.keys(labels).map((key) => {
                const nutrient = totalNutrients[key];
                if (!nutrient) return null;

                const label = labels[key];
                const Icon = macroIcons[label] || macroIcons[fullLabels[key]];
                const iconClass = macroIconClasses[fullLabels[key]];

                return (
                    <CustomBox key={nutrient.nutrientId || key} className="flex items-center gap-2">
                        {Icon && <Icon size={16} className={iconClass} />}
                        <CustomTypography variant="xsmallCard">
                            {label}: {Math.round(nutrient.value)}
                            {!compact && nutrient.unitName ? ` ${nutrient.unitName}` : ""}
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
    compact: PropTypes.bool,
    showLabel: PropTypes.bool,
};

export default MacroSummary;
