import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const NutritionTable = ({ sortedNutrients, useBaseRDI }) => {
    return (
        <CustomBox className="flex flex-col gap-2 w-full">
            {sortedNutrients.map((nutrient) => {
                const isSubNutrient = [
                    "Saturated and Trans fats",
                    "Mono- and Polyunsaturated fats",
                ].includes(nutrient.name);

                const hasValue = typeof nutrient.value === "number";
                const value = hasValue ? Math.round(nutrient.value) : "N/A";

                return (
                    <CustomBox
                        key={nutrient.id}
                        className="flex justify-between items-center w-full"
                    >
                        <CustomTypography
                            variant="small"
                            className={isSubNutrient ? "pl-4 italic" : ""}
                        >
                            {nutrient.name}
                        </CustomTypography>

                        <CustomTypography
                            variant="small"
                            style={{
                                color: !useBaseRDI && hasValue
                                    ? value < 0
                                        ? "#DD1155"
                                        : "#41D3BD"
                                    : undefined
                            }}
                        >
                            {value}
                        </CustomTypography>

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
