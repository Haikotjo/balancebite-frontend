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
    Sugars: {
        total: Math.round(meal.totalSugars),
        per100g: Math.round(calculatedMacros.sugarsPer100g),
        unit: "g",
    },
    SaturatedFat: {
        total: Math.round(meal.totalSaturatedFat),
        per100g: Math.round(calculatedMacros.saturatedFatPer100g),
        unit: "g",
    },
    UnsaturatedFat: {
        total: Math.round(meal.totalUnsaturatedFat),
        per100g: Math.round(calculatedMacros.unsaturatedFatPer100g),
        unit: "g",
    },
});
