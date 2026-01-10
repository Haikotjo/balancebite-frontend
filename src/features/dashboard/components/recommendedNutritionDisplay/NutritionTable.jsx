import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import {macroIconClasses, macroIcons} from "../../../../utils/helpers/macroIcons.js";


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
                            <CustomBox className="relative h-2 mt-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <CustomBox className="absolute left-1/2 top-0 h-full w-px bg-gray-400 z-10 opacity-50" />

                                {remainingValue > 0 && (
                                    <CustomBox
                                        className="absolute left-1/2 top-0 h-full rounded-r"
                                        style={{
                                            width: Math.min(remainingPercentage, 100) / 2 + "%",
                                            backgroundColor: barColorPositive,
                                            transition: "width 0.3s ease"
                                        }}
                                    />
                                )}

                                {remainingValue < 0 && (
                                    <CustomBox
                                        className="absolute right-1/2 top-0 h-full rounded-l"
                                        style={{
                                            width: Math.min(Math.abs(remainingPercentage), 100) / 2 + "%",
                                            backgroundColor: barColorNegative,
                                            transition: "width 0.3s ease"
                                        }}
                                    />
                                )}
                            </CustomBox>
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