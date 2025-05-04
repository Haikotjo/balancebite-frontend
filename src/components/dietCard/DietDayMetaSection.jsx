import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import { macroIcons, macroIconClasses } from "../../utils/helpers/macroIcons.js";
import MyResponsivePie from "../myResponsivePie/MyResponsivePie.jsx";


const DietDayMetaSection = ({ day }) => {
    const totalNutrients = day.totalNutrients || {};

    const fat = Math.round(totalNutrients["Total lipid (fat) g"]?.value || 0);
    const protein = Math.round(totalNutrients["Protein g"]?.value || 0);
    const carbs = Math.round(totalNutrients["Carbohydrates g"]?.value || 0);

    const macroData = [
        { id: "fat", label: "Fat", value: fat },
        { id: "protein", label: "Protein", value: protein },
        { id: "carbs", label: "Carbs", value: carbs },
    ];

    const mealNames = day.meals?.map((m) => m.name).join(", ") || "No meals";

    return (
        <CustomBox className="mb-4 p-4 rounded-xl border border-border bg-muted dark:bg-mutedDark">
            <CustomTypography className="text-lg font-semibold mb-2">
                {day.dayLabel || `Day ${day.id}`}
            </CustomTypography>

            <CustomTypography variant="smallCard" className="mb-2 text-muted">
                Meals: {mealNames}
            </CustomTypography>

            <CustomBox className="flex flex-wrap gap-4">
                {[ "Total lipid (fat) g", "Carbohydrates g", "Protein g" ].map((key) => {
                    const nutrient = totalNutrients[key];
                    if (!nutrient) return null;

                    const Icon = macroIcons[nutrient.nutrientName];
                    const iconClass = macroIconClasses[nutrient.nutrientName];

                    return (
                        <CustomBox key={nutrient.nutrientId} className="flex items-center gap-2">
                            {Icon && <Icon size={20} className={iconClass} />}
                            <CustomTypography variant="xsmallCard">
                                {nutrient.nutrientName}: {Math.round(nutrient.value)} {nutrient.unitName}
                            </CustomTypography>
                        </CustomBox>
                    );
                })}
            </CustomBox>
        </CustomBox>
    );
};

DietDayMetaSection.propTypes = {
    day: PropTypes.object.isRequired,
};

export default DietDayMetaSection;
