// components/MealCardMacrosSection/MealCardMacrosCompact.jsx
import PropTypes from "prop-types";
import {macroIconClasses, macroIcons} from "../../../utils/helpers/macroIcons.js";
import CustomBox from "../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";

/**
 * Compact macro display: icons with their total values, either in a row or column.
 */
const MealCardMacrosCompact = ({ macros, vertical = false }) => {
    return (
        <CustomBox
            className={`w-full px-2 py-1 ${vertical ? "flex flex-col gap-2" : "flex justify-between items-center"}`}
        >
            {Object.entries(macros).map(([key, macro]) => {
                const Icon = macroIcons[key];
                const iconClass = macroIconClasses[key];

                return (
                    <CustomBox key={key} className="flex items-center gap-1">
                        {Icon && <Icon size={20} className={iconClass} />}
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
    vertical: PropTypes.bool,
};

export default MealCardMacrosCompact;
