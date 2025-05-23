import PropTypes from "prop-types";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";
import MealCardMacrosSection from "../mealCardMacrosSection/MeaCardlMacrosSection.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import {macroIconClasses, macroIcons} from "../../../../utils/helpers/macroIcons.js";

/**
 * Toggleable nutrition section for meal cards.
 *
 * @param {Object} props
 * @param {Object} props.macros - Nutrition macros to display.
 * @param {boolean} props.show - Whether the section is expanded.
 * @param {Function} props.onToggle - Callback to toggle expanded state.
 * @param {"page"|"list"|"mobile"} props.viewMode - View mode to control layout behavior.
 * @returns {JSX.Element}
 */
const MealCardNutritionToggle = ({ macros, show, onToggle, viewMode }) => {
    const isAlwaysOpen = viewMode === "page";

    return (
        <CustomBox
            onClick={!isAlwaysOpen ? onToggle : undefined}
            className={clsx(
                "my-4 rounded-md p-3 transition-all duration-300",
                !isAlwaysOpen && "cursor-pointer",
                "bg-lightBackground dark:bg-darkBackground",
                "shadow-md border border-borderLight dark:border-borderDark"
            )}
        >
            {isAlwaysOpen || show ? (
                <>
                    <MealCardMacrosSection macros={macros} />
                    {!isAlwaysOpen && (
                        <CustomBox className="flex justify-center mt-4">
                            <ChevronUp size={18} />
                        </CustomBox>
                    )}
                </>
            ) : (
                <CustomBox className="flex justify-between items-center">
                    <CustomBox className="flex items-center gap-1">
                        {Object.entries(macroIcons).map(([key, Icon]) => (
                            <Icon key={key} size={16} className={macroIconClasses[key]} />
                        ))}
                        <span className="text-sm">Nutrition</span>
                    </CustomBox>
                    <ChevronDown size={18} />
                </CustomBox>
            )}
        </CustomBox>
    );
};

MealCardNutritionToggle.propTypes = {
    macros: PropTypes.object.isRequired,
    show: PropTypes.bool,
    onToggle: PropTypes.func,
    viewMode: PropTypes.oneOf(["page", "list", "mobile"]).isRequired,
};

export default MealCardNutritionToggle;
