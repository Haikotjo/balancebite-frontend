import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import { macroIcons, macroIconClasses } from "../../utils/helpers/macroIcons.js";

/**
 * Compact macro display: only icons with their total values, aligned in one row.
 */
const MealCardMacrosCompact = ({ macros }) => {
    return (
        <CustomBox className="flex justify-between items-center w-full px-2 py-1">
            {Object.entries(macros).map(([key, macro]) => {
                const Icon = macroIcons[key];
                const iconClass = macroIconClasses[key];

                return (
                    <CustomBox key={key} className="flex items-center gap-1">
                        {Icon && <Icon size={24} className={iconClass} />}
                        <CustomTypography variant="xsmallCard">
                            {macro.total}
                        </CustomTypography>
                    </CustomBox>
                );
            })}
        </CustomBox>
    );
};

MealCardMacrosCompact.propTypes = {
    macros: PropTypes.object.isRequired,
};

export default MealCardMacrosCompact;
