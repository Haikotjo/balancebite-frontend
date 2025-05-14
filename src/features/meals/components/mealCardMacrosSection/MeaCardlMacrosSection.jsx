import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import {macroIconClasses, macroIcons} from "../../../../utils/helpers/macroIcons.js";
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
        <CustomBox className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {Object.entries(macros).map(([key, macro]) => {
                const Icon = macroIcons[key];
                const iconClass = macroIconClasses[key];

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
                                    : `${key}: ${macro.total}${macro.unit ? ` ${macro.unit}` : ""}`}
                            </CustomTypography>
                            <CustomTypography variant="xsmallCard">
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
