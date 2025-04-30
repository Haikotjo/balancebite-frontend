import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";

const NutritionTable = ({ sortedNutrients, useBaseRDI }) => {
    return (
        <CustomBox className="flex flex-col gap-2 w-full">
            {sortedNutrients.map((nutrient) => {
                const isSubNutrient = [
                    "Saturated and Trans fats",
                    "Mono- and Polyunsaturated fats",
                ].includes(nutrient.name);

                let textColor;
                if (!useBaseRDI && nutrient.value < 0) {
                    textColor = "text-error";
                } else if (!useBaseRDI) {
                    textColor = "text-success";
                } else {
                    textColor = "";
                }


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
                            className={`text-right ${textColor}`}
                        >
                            {nutrient.value ?? "N/A"}
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
