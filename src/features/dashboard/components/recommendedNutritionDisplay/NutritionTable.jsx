import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import {
    Flame,
    Dumbbell,
    ChartColumnIncreasing,
    Droplet,
} from "lucide-react";

const MAX_BAR_WIDTH = 80; // max px length of bar on either side

// Map backend nutrient names → icon + kleur
const NUTRIENT_ICON_CONFIG = {
    "Energy kcal": {
        icon: Flame,
        className: "text-error",
    },
    Protein: {
        icon: Dumbbell,
        className: "text-primary",
    },
    Carbohydrates: {
        icon: ChartColumnIncreasing,
        className: "text-success",
    },
    "Total lipid (fat)": {
        icon: Droplet,
        className: "text-secondary",
    },
};

const NutritionTable = ({ sortedNutrients, useBaseRDI }) => {
    return (
        <CustomBox className="flex flex-col gap-3 w-full mb-4">
            {sortedNutrients.map((nutrient) => {
                const isSubNutrient = [
                    "Saturated and Trans fats",
                    "Mono- and Polyunsaturated fats",
                ].includes(nutrient.name);

                const hasValue = typeof nutrient.value === "number";
                const value = hasValue ? Math.round(nutrient.value) : "N/A";

                // Bar logic
                const numericValue = hasValue ? value : 0;
                const barWidth = hasValue
                    ? Math.min(Math.abs(numericValue), MAX_BAR_WIDTH)
                    : 0;

                const barColor =
                    numericValue < 0 ? "#DD1155" : "#41D3BD"; // red / green

                const iconConfig = NUTRIENT_ICON_CONFIG[nutrient.name];
                const IconComp = iconConfig?.icon;

                return (
                    <CustomBox key={nutrient.name} className="w-full">
                        {/* Row + label */}
                        <CustomBox className="flex justify-between items-center mx-4">
                            <CustomBox className="flex items-center">
                                {IconComp && (
                                    <IconComp
                                        className={`w-4 h-4 mr-2 ${iconConfig.className}`}
                                    />
                                )}

                                <CustomTypography
                                    variant="small"
                                    className={isSubNutrient ? "pl-4 italic" : ""}
                                >
                                    {nutrient.name} :
                                </CustomTypography>
                            </CustomBox>

                            <CustomTypography
                                variant="small"
                                style={{
                                    color:
                                        !useBaseRDI && hasValue
                                            ? barColor
                                            : undefined,
                                }}
                            >
                                {value}
                            </CustomTypography>
                        </CustomBox>

                        {/* Bar visualization */}
                        {!useBaseRDI && hasValue && (
                            <CustomBox className="relative h-2 mt-1 mx-4">
                                {/* Zero center line */}
                                <CustomBox className="absolute left-1/2 top-0 h-full w-px bg-gray-400 opacity-40" />

                                {/* Positive (green) → right side */}
                                {numericValue > 0 && (
                                    <CustomBox
                                        className="absolute left-1/2 top-0 h-full rounded-r"
                                        style={{
                                            width: barWidth + "px",
                                            backgroundColor: barColor,
                                        }}
                                    />
                                )}

                                {/* Negative (red) → left side */}
                                {numericValue < 0 && (
                                    <CustomBox
                                        className="absolute right-1/2 top-0 h-full rounded-l"
                                        style={{
                                            width: barWidth + "px",
                                            backgroundColor: barColor,
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
