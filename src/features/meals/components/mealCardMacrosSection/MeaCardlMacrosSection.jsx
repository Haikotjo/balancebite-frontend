import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { macroIconClasses, macroIcons } from "../../../../utils/helpers/macroIcons.js";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

/**
 * Displays a grid of macro nutrient values with icons and descriptions.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.macros - A macros object with keys like "Calories", "Protein", etc.
 * @returns {JSX.Element}
 */
const MealCardMacrosSection = ({ macros }) => {
    return (
        <CustomBox className="grid grid-cols-2 gap-4 mt-4">
            {Object.entries(macros).map(([key, macro]) => {
                const Icon = macroIcons[key];
                const iconClass = macroIconClasses[key];

                // Skip rendering sugars, saturated and unsaturated fat as separate items
                if (["Sugars", "SaturatedFat", "UnsaturatedFat"].includes(key)) return null;

                return (
                    <CustomBox key={key} className="flex items-start gap-1">
                        {/* Icon section */}
                        <CustomBox className="mt-[2px]">
                            {Icon && <Icon size={20} className={iconClass} />}
                        </CustomBox>

                        {/* Macro description */}
                        <CustomBox>
                            <CustomTypography variant="paragraphCard" bold>
                                {key === "Calories"
                                    ? `${key}: ${macro.total}`
                                    : `${key}: ${macro.total}${macro.unit && macro.unit !== "g" ? ` ${macro.unit}` : ""}`}
                            </CustomTypography>

                            {/* Inject subtotals for Fats */}
                            {key === "Fats" && (macros.SaturatedFat?.total > 0 || macros.UnsaturatedFat?.total > 0) && (
                                <CustomBox className="flex flex-col sm:flex-row sm:gap-4 mt-1">
                                    {macros.UnsaturatedFat?.total > 0 && (
                                        <CustomTypography variant="xsmallCard" font="body" italic>
                                            Healthy Fats:{" "}
                                            <CustomTypography as="span" variant="xsmallCard">
                                                {macros.UnsaturatedFat.total}
                                                {macros.UnsaturatedFat.unit && macros.UnsaturatedFat.unit !== "g" && ` ${macros.UnsaturatedFat.unit}`}
                                            </CustomTypography>
                                        </CustomTypography>
                                    )}
                                    {macros.SaturatedFat?.total > 0 && (
                                        <CustomTypography variant="xsmallCard" font="body" italic>
                                            Other Fats:{" "}
                                            <CustomTypography as="span" variant="xsmallCard">
                                                {macros.SaturatedFat.total}
                                                {macros.SaturatedFat.unit && macros.SaturatedFat.unit !== "g" && ` ${macros.SaturatedFat.unit}`}
                                            </CustomTypography>
                                        </CustomTypography>
                                    )}
                                </CustomBox>
                            )}


                            {/* Inject subtotals for Carbs */}
                            {key === "Carbs" && macros.Sugars?.total > 0 && (
                                <CustomBox className="flex mt-1">
                                    <CustomTypography variant="xsmallCard" font="body" italic>
                                        Sugars:{" "}
                                        <CustomTypography as="span" variant="xsmallCard">
                                            {macros.Sugars.total}
                                            {macros.Sugars.unit && macros.Sugars.unit !== "g" && ` ${macros.Sugars.unit}`}
                                        </CustomTypography>
                                    </CustomTypography>
                                </CustomBox>
                            )}

                            {/* Per 100g (altijd onderaan) */}
                            <CustomTypography variant="xsmallCard" className="mt-1" font="body" italic>
                                ({macro.per100g} per 100g)
                            </CustomTypography>
                        </CustomBox>
                    </CustomBox>
                );
            })}
        </CustomBox>
    );
};

MealCardMacrosSection.propTypes = {
    /** Object with macro nutrient info like Calories, Protein, etc. */
    macros: PropTypes.object.isRequired,
};

export default MealCardMacrosSection;
