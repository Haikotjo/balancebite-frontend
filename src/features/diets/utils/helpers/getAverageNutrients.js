// utils/dietHelpers.js

export const getAverageNutrients = (dietDays) => {
    if (!Array.isArray(dietDays) || dietDays.length === 0) return null;

    const totals = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
    };

    dietDays.forEach((day) => {
        const nutrients = day.totalNutrients || {};

        totals.calories += nutrients["Energy kcal"]?.value || 0;
        totals.protein += nutrients["Protein g"]?.value || 0;
        totals.fat += nutrients["Total lipid (fat) g"]?.value || 0;
        totals.carbs += nutrients["Carbohydrates g"]?.value || 0;
    });

    const count = dietDays.length;

    return {
        avgCalories: +(totals.calories / count).toFixed(1),
        avgProtein: +(totals.protein / count).toFixed(1),
        avgFat: +(totals.fat / count).toFixed(1),
        avgCarbs: +(totals.carbs / count).toFixed(1),
    };
};
