import { useMemo, useState } from "react";
import PropTypes from "prop-types";

// Contexts
import { useModal } from "../../../../context/useModal.js";

// Layout Components
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

// Feature Components
import RecommendedNutritionDisplay from "../recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import ConsumedMealsToggle from "../consumedMealsToggle/ConsumedMealsToggle.jsx";
import MealModalById from "../../../meals/components/mealModalById/MealModalById.jsx";

// Helpers
import { getSortedConsumedMeals } from "../../utils/helpers/getSortedConsumedMeals.js";

const GoalProgressCard = ({ variant, data, description, chartData, baseChartData }) => {
    const { openModal } = useModal();
    const [showMeals, setShowMeals] = useState(false);

    const showConsumedMeals = ["today", "date"].includes(variant);

    const consumedMeals = useMemo(() => getSortedConsumedMeals(data), [data]);


    const openMealModal = (mealId) => {
        if (!mealId) return;
        openModal(<MealModalById mealId={mealId} />, "meal", { id: mealId });
    };

    if (variant === "today" || variant === "base") {
        console.log("Variant is:", variant, "Data:", data);
    }

    return (
        <CustomCard hasBorder>
            <RecommendedNutritionDisplay variant={variant} data={data} chartData={chartData} baseChartData={baseChartData}/>

            {showConsumedMeals && (
                <ConsumedMealsToggle
                    meals={consumedMeals}
                    isOpen={showMeals}
                    onToggle={() => setShowMeals((v) => !v)}
                    onOpenMeal={openMealModal}
                />
            )}

            {description && (
                <CustomTypography variant="xsmallCard" className="m-2" italic>
                    {description}
                </CustomTypography>
            )}
        </CustomCard>
    );
};

GoalProgressCard.propTypes = {
    variant: PropTypes.oneOf([
        "today",
        "base",
        "date",
        "week",
        "month",
        "weekAverage",
        "monthAverage",
    ]).isRequired,
    data: PropTypes.object,
    description: PropTypes.string,
    chartData: PropTypes.array,
    baseChartData: PropTypes.array,
};

export default GoalProgressCard;
