// src/features/dashboard/components/consumedMealsToggle/ConsumedMealsToggle.jsx
import PropTypes from "prop-types";
import { ChevronDown, ChevronUp } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTypography, {Inline} from "../../../../components/layout/CustomTypography.jsx";
import { macroIcons, macroIconClasses } from "../../../../utils/helpers/macroIcons.js";

const ConsumedMealsToggle = ({ meals, isOpen, onToggle, onOpenMeal }) => {
    if (!Array.isArray(meals) || meals.length === 0) return null;

    return (
        <CustomBox className="px-3 pb-3">
            <CustomButton
                type="button"
                variant="default"
                onClick={onToggle}
                className="w-full flex items-center justify-between rounded-md px-2 py-2 hover:bg-accent/40"
                aria-expanded={isOpen}
            >
                <CustomTypography variant="small" italic className="underline">
                    {isOpen ? "Hide meals eaten" : "Show meals eaten"}{" "}
                    <Inline>
                        ({meals.length})
                    </Inline>
                </CustomTypography>


                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </CustomButton>

            {isOpen && (
                <ul className="mt-2 text-sm space-y-1 text-left">
                    {meals.map((m) => (
                        <li
                            key={m.id}
                            className="flex items-center justify-between gap-3 rounded-md px-2 py-1 hover:bg-accent/40"
                        >
                            <CustomBox className="min-w-0 flex-1">
                                <CustomButton
                                    variant="link"
                                    onClick={() => onOpenMeal?.(m.mealId)}
                                    className="min-w-0 w-full truncate text-left no-underline hover:underline"
                                    title={m.mealName}
                                >
                                    {m.mealName}
                                </CustomButton>

                                <CustomTypography
                                    variant="xsmallCard"
                                    className="opacity-70 tabular-nums flex items-center gap-3"
                                >
                                    <CustomBox className="flex items-center gap-1">
                                        <macroIcons.Calories
                                            size={16}
                                            className={macroIconClasses.Calories}
                                        />
                                        {Math.round(Number(m.totalCalories ?? 0))} kcal
                                    </CustomBox>

                                    <CustomBox className="flex items-center gap-1">
                                        <macroIcons.Protein
                                            size={16}
                                            className={macroIconClasses.Protein}
                                        />
                                        {Number(m.totalProtein ?? 0).toFixed(1)}g
                                    </CustomBox>

                                    <CustomBox className="flex items-center gap-1">
                                        <macroIcons.Carbs
                                            size={16}
                                            className={macroIconClasses.Carbs}
                                        />
                                        {Number(m.totalCarbs ?? 0).toFixed(1)}g
                                    </CustomBox>

                                    <CustomBox className="flex items-center gap-1">
                                        <macroIcons.Fats
                                            size={16}
                                            className={macroIconClasses.Fats}
                                        />
                                        {Number(m.totalFat ?? 0).toFixed(1)}g
                                    </CustomBox>
                                </CustomTypography>


                            </CustomBox>

                            <CustomTypography
                                variant="xsmallCard"
                                className="shrink-0 tabular-nums opacity-70"
                            >
                                {String(m.consumedTime).slice(0, 5)}
                            </CustomTypography>
                        </li>

                    ))}
                </ul>
            )}
        </CustomBox>
    );
};

ConsumedMealsToggle.propTypes = {
    meals: PropTypes.array,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onOpenMeal: PropTypes.func, // (mealId) => void
};

export default ConsumedMealsToggle;
