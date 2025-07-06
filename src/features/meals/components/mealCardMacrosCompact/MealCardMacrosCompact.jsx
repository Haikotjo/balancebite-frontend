// components/MealCardMacrosSection/MealCardMacrosCompact.jsx
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { macroIconClasses, macroIcons } from "../../../../utils/helpers/macroIcons.js";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

/**
 * Compact macro display: icons with their total values, either in a row or column.
 */
const MealCardMacrosCompact = ({ macros, vertical = false }) => {
    return (
        <CustomBox
            className={`w-full py-1 ${vertical ? "flex flex-col gap-2" : "flex flex-col"}`}
        >
            {/* Eerste rij met hoofdmacro's */}
            <CustomBox className={`w-full ${vertical ? "flex flex-col gap-2" : "flex justify-between items-center"}`}>
                {Object.entries(macros)
                    .filter(([key]) => ["Calories", "Protein", "Carbs", "Fats"].includes(key))
                    .map(([key, macro]) => {
                        const Icon = macroIcons[key];
                        const iconClass = macroIconClasses[key];

                        return (
                            <CustomBox key={key} className="flex items-center gap-1">
                                {Icon && <Icon size={20} className={iconClass} />}
                                <CustomTypography variant="xsmallCard" font="body">
                                    {macro.total}
                                </CustomTypography>
                            </CustomBox>
                        );
                    })}
            </CustomBox>

            {/* Tweede rij met extra info */}
            {(macros?.Sugars?.total > 0 || macros?.UnsaturatedFat?.total > 0 || macros?.SaturatedFat?.total > 0) && (
                <CustomBox className={`mt-2 ${vertical ? "flex flex-col " : "flex justify-between items-center flex-wrap gap-1"}`}>
                    {macros?.Sugars?.total > 0 && (
                        <CustomTypography variant="xsmallCard" font="body" italic>
                            Sugars: {macros.Sugars.total}
                        </CustomTypography>
                    )}
                    {macros?.UnsaturatedFat?.total > 0 && (
                        <CustomTypography variant="xsmallCard" font="body" italic>
                            Healthy Fats: {macros.UnsaturatedFat.total}
                        </CustomTypography>
                    )}
                    {macros?.SaturatedFat?.total > 0 && (
                        <CustomTypography variant="xsmallCard" font="body" italic>
                            Other Fats: {macros.SaturatedFat.total}
                        </CustomTypography>
                    )}
                </CustomBox>
            )}
        </CustomBox>
    );
};

MealCardMacrosCompact.propTypes = {
    macros: PropTypes.object.isRequired,
    vertical: PropTypes.bool,
};

export default MealCardMacrosCompact;
