// components/MealCardMacrosSection/MealCardMacrosCompact.jsx
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { macroIconClasses, macroIcons } from "../../../../utils/helpers/macroIcons.js";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

/**
 * Compact macro display: icons with their total values, either in a row or column.
 */
const MealCardMacrosCompact = ({
                                   macros,
                                   vertical = false,
                                   keys = ["Calories", "Protein", "Carbs", "Fats"], // new: selectable keys
                                   iconSize = 18,                                   // new: icon size for overlays
                                   textClassName = "",                              // new: typography color/extra classes
                                   className = "",                                  // new: wrapper classes
                                   rowClassName,
                                   itemClassName = "bg-black/55 backdrop-blur-sm rounded-md px-2 py-1",
                               }) => {
    const rowBase = vertical
        ? "flex flex-col gap-2"
        : "flex items-center justify-between gap-2";

    return (
        <CustomBox className={`w-full py-1 ${vertical ? "flex flex-col gap-2" : "flex flex-col"} ${className}`}>
            <CustomBox className={`w-full ${rowClassName || rowBase}`}>
                {keys.map((key) => {
                    const macro = macros?.[key];
                    if (!macro) return null;
                    const Icon = macroIcons[key];
                    const iconClass = macroIconClasses[key];

                    return (
                        <CustomBox key={key} className={`flex items-center gap-2 ${itemClassName}`}>
                            {Icon && <Icon size={iconSize} className={iconClass} />}
                            <CustomTypography variant="xsmallCard" weight="bold" className={textClassName}>
                                {macro.total}
                            </CustomTypography>
                        </CustomBox>
                    );
                })}
            </CustomBox>

            {/*/!* Tweede rij met extra info *!/*/}
            {/*{(macros?.Sugars?.total > 0 || macros?.UnsaturatedFat?.total > 0 || macros?.SaturatedFat?.total > 0) && (*/}
            {/*    <CustomBox className={`mt-2 ${vertical ? "flex flex-col " : "flex justify-between items-center flex-wrap gap-1"}`}>*/}
            {/*        {macros?.Sugars?.total > 0 && (*/}
            {/*            <CustomTypography variant="xsmallCard" font="body" italic>*/}
            {/*                Sugars: {macros.Sugars.total}*/}
            {/*            </CustomTypography>*/}
            {/*        )}*/}
            {/*        {macros?.UnsaturatedFat?.total > 0 && (*/}
            {/*            <CustomTypography variant="xsmallCard" font="body" italic>*/}
            {/*                Healthy Fats: {macros.UnsaturatedFat.total}*/}
            {/*            </CustomTypography>*/}
            {/*        )}*/}
            {/*        {macros?.SaturatedFat?.total > 0 && (*/}
            {/*            <CustomTypography variant="xsmallCard" font="body" italic>*/}
            {/*                Other Fats: {macros.SaturatedFat.total}*/}
            {/*            </CustomTypography>*/}
            {/*        )}*/}
            {/*    </CustomBox>*/}
            {/*)}*/}
        </CustomBox>
    );
};


MealCardMacrosCompact.propTypes = {
    macros: PropTypes.object.isRequired,
    vertical: PropTypes.bool,
    keys: PropTypes.arrayOf(PropTypes.string),
    iconSize: PropTypes.number,
    textClassName: PropTypes.string,
    className: PropTypes.string,
    rowClassName: PropTypes.string,
    itemClassName: PropTypes.string,
};

export default MealCardMacrosCompact;
