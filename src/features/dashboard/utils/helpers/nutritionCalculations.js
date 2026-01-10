// src/utils/helpers/nutritionCalculations.js

/**
 * Calculates the progress of nutrients based on remaining values (chartData)
 * and targets (baseChartData).
 */
export const calculateNutritionProgress = (chartData, baseChartData) => {
    if (!chartData || !baseChartData) return null;

    return baseChartData.map((target) => {
        // Find the 'remaining' value from chartData
        const current = chartData.find((c) => c.name === target.name);
        const remainingValue = current ? current.value : 0;

        // Calculate what has actually been consumed
        const consumedValue = target.value - remainingValue;

        // Calculate percentage (prevent division by zero)
        const percentageReached = target.value > 0
            ? ((consumedValue / target.value) * 100).toFixed(1)
            : 0;

        return {
            nutrient: target.name,
            goal: target.value,
            leftToEat: remainingValue,
            actuallyConsumed: consumedValue,
            percentageOfGoalMet: `${percentageReached}%`,
            status: remainingValue < 0 ? "Goal exceeded" : "Under goal"
        };
    });
};

/**
 * Determines the source data and RDI settings based on the display variant.
 */
export const getNutritionSourceConfig = (variant, recommendedNutrition, data) => {
    let useBaseRDI = false;
    let source = null;

    switch (variant) {
        case "today":
            useBaseRDI = false;
            source = recommendedNutrition;
            break;
        case "base":
            useBaseRDI = true;
            source = recommendedNutrition;
            break;
        case "date":
        case "week":
        case "month":
        case "weekAverage":
        case "monthAverage":
            useBaseRDI = false;
            source = data;
            break;
        default:
            useBaseRDI = false;
            source = recommendedNutrition;
    }

    return { useBaseRDI, source };
};

/**
 * Merges the sorted nutrients list with their calculated progress data (if available).
 */
export const mergeNutritionProgress = (sortedNutrients, nutritionCalculations) => {
    if (!sortedNutrients) return [];
    if (!nutritionCalculations) return sortedNutrients;

    return sortedNutrients.map((nutrient) => {

        const calc = nutritionCalculations.find((c) => c.nutrient === nutrient.name);

        if (calc) {
            return {
                ...nutrient,
                percentageReached: calc.percentageOfGoalMet,
                actuallyConsumed: calc.actuallyConsumed,
                status: calc.status
            };
        }

        return nutrient;
    });
};