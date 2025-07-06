import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { macroIconClasses, macroIcons } from "../../../../utils/helpers/macroIcons.js";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const MacroSummary = ({
                          totalNutrients,
                          className = "",
                          showLabel = true,
                      }) => {
    if (!totalNutrients) return null;

    const labels = {
        "Energy kcal": "Calories",
        "Protein g": "Protein",
        "Carbohydrates g": "Carbs",
        "Total lipid (fat) g": "Fats",
        "Unsaturated fat g": "Healthy Fats",
        "Saturated fat g": "Other Fats",
        "Sugars g": "Sugars",
    };

    const topKeys = [
        "Energy kcal",
        "Protein g",
        "Total lipid (fat) g",
        "Carbohydrates g",
    ];

    const extraKeys = [
        "Unsaturated fat g",
        "Saturated fat g",
        "Sugars g",
    ];

    const renderNutrient = (key) => {
        const nutrient = totalNutrients[key];
        if (!nutrient) return null;

        const label = labels[key];
        const Icon = macroIcons[label];
        const iconClass = macroIconClasses[label];

        return (
            <CustomBox key={key} className="flex items-center gap-2">
                {Icon && <Icon size={16} className={iconClass} />}
                <CustomTypography variant="xsmallCard" font="body">
                    {label}: {Math.round(nutrient.value)}
                    {nutrient.unitName ? ` ${nutrient.unitName}` : ""}
                </CustomTypography>
            </CustomBox>
        );
    };

    return (
        <CustomBox className={`flex flex-wrap gap-x-4 items-center ${className}`}>
            {showLabel && (
                <CustomBox className="flex items-center mb-1 w-full sm:w-auto">
                    <CustomTypography
                        variant="xsmallCard"
                        font="body"
                        italic
                    >
                        Day summary:
                    </CustomTypography>
                </CustomBox>
            )}

            {topKeys.map(renderNutrient)}

            {extraKeys.some(key => totalNutrients[key]) && (
                <CustomBox className="w-full flex flex-wrap gap-x-8 mt-2">
                    {extraKeys.map(key => (
                        <CustomTypography key={key} variant="xsmallCard" font="body" italic>
                            {labels[key]}: {Math.round(totalNutrients[key]?.value ?? 0)}
                        </CustomTypography>
                    ))}
                </CustomBox>
            )}
        </CustomBox>
    );
};

MacroSummary.propTypes = {
    totalNutrients: PropTypes.object,
    diet: PropTypes.object,
    className: PropTypes.string,
    showLabel: PropTypes.bool,
};

export default MacroSummary;
