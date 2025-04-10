export const buildMacrosObject = (meal, calculatedMacros) => ({
    Calories: {
        total: Math.round(meal.totalCalories),
        per100g: Math.round(calculatedMacros.caloriesPer100g),
        unit: "kcal",
    },
    Protein: {
        total: Math.round(meal.totalProtein),
        per100g: Math.round(calculatedMacros.proteinPer100g),
        unit: "g",
    },
    Carbs: {
        total: Math.round(meal.totalCarbs),
        per100g: Math.round(calculatedMacros.carbsPer100g),
        unit: "g",
    },
    Fats: {
        total: Math.round(meal.totalFat),
        per100g: Math.round(calculatedMacros.fatsPer100g),
        unit: "g",
    },
});
