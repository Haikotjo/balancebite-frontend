import PropTypes from "prop-types";
import { Flame, ChartColumnIncreasing, Dumbbell, Droplet } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";

const iconClassMap = {
    Calories: "text-error",
    Protein: "text-primary",
    Carbs: "text-success",
    Fats: "text-secondary",
};

const iconMap = {
    Calories: Flame,
    Protein: Dumbbell,
    Carbs: ChartColumnIncreasing,
    Fats: Droplet,
};

const MealCardMacrosSection = ({ macros }) => {
    return (
        <CustomBox className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {Object.entries(macros).map(([key, macro]) => {
                const Icon = iconMap[key];
                const iconClass = iconClassMap[key];

                return (
                    <CustomBox key={key} className="flex items-start gap-1">
                        <CustomBox className="mt-[2px]">
                            {Icon && <Icon size={20} className={iconClass} />}
                        </CustomBox>
                        <CustomBox>
                            <CustomTypography variant="paragraph" bold className="md:text-sm">
                                {key === "Calories"
                                    ? `${key}: ${macro.total}`
                                    : `${key}: ${macro.total} ${macro.unit}`}
                            </CustomTypography>
                            <CustomTypography variant="small">
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
    macros: PropTypes.object.isRequired,
};

export default MealCardMacrosSection;
