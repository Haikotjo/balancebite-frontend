import PropTypes from "prop-types";

// Layout Components
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

// Feature Components
import NutritionProgressBar from "../nutritionProgressBar/NutritionProgressBar.jsx";

// Icons & Helpers
import { macroIconClasses, macroIcons } from "../../../../utils/helpers/macroIcons.js";

const NutritionTable = ({ sortedNutrients, useBaseRDI }) => {

    const getMacroKey = (name) => {
        if (name.includes("Energy")) return "Calories";
        if (name.includes("Protein")) return "Protein";
        if (name.includes("Carbohydrates")) return "Carbs";
        if (name.includes("lipid") || name.includes("fat")) return "Fats";
        return null;
    };

    return (
        <CustomBox className="flex flex-col gap-3 w-full mb-4">
            {sortedNutrients.map((nutrient) => {
                const isSubNutrient = [
                    "Saturated and Trans fats",
                    "Mono- and Polyunsaturated fats",
                ].includes(nutrient.name);

                const hasValue = typeof nutrient.value === "number";
                const remainingValue = hasValue ? Math.round(nutrient.value) : "N/A";

                const percentageStr = nutrient.percentageReached;
                const consumed = nutrient.actuallyConsumed ? Math.round(nutrient.actuallyConsumed) : 0;

                const numericConsumed = percentageStr ? parseFloat(percentageStr) : 0;
                const remainingPercentage = 100 - numericConsumed;

                const barColorPositive = "#38adb5";
                const barColorNegative = "#F43F5E";

                const macroKey = getMacroKey(nutrient.name);
                const IconComp = macroIcons[macroKey];
                const iconClass = macroIconClasses[macroKey];

                return (
                    <CustomBox key={nutrient.name} className="w-full">
                        <CustomBox className="flex justify-between items-center mx-4">
                            <CustomBox className="flex items-center">
                                {IconComp && (
                                    <IconComp className={`w-5 h-5 mr-2 ${iconClass}`} />
                                )}
                                <CustomTypography variant="small" weight="bold">
                                    {nutrient.name}
                                </CustomTypography>
                            </CustomBox>

                            <CustomBox className="flex flex-col items-end">
                                <CustomTypography
                                    variant="xsmallCard"
                                    weight="bold"
                                    style={{ color: remainingValue < 0 ? barColorNegative : barColorPositive }}
                                >
                                    {remainingValue < 0
                                        ? `${Math.abs(remainingValue)} over limit`
                                        : `${remainingValue} left`
                                    }
                                </CustomTypography>

                                {percentageStr && (
                                    <CustomTypography variant="xsmallCard" className="text-gray-500 italic">
                                        {consumed} consumed ({percentageStr})
                                    </CustomTypography>
                                )}
                            </CustomBox>
                        </CustomBox>

                        {!useBaseRDI && hasValue && (
                            <NutritionProgressBar
                                remainingValue={remainingValue}
                                remainingPercentage={remainingPercentage}
                            />
                        )}
                    </CustomBox>
                );
            })}
        </CustomBox>
    );
};

NutritionTable.propTypes = {
    sortedNutrients: PropTypes.array.isRequired,
    useBaseRDI: PropTypes.bool.isRequired,
};

export default NutritionTable;