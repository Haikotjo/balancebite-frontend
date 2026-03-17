export const buildMacrosObject = (meal, calculatedMacros) => {
    const servings = meal.servings && meal.servings > 0 ? meal.servings : 1;

    return {
        Calories: {
            total: Math.round(meal.totalCalories / servings),
            per100g: Math.round(calculatedMacros.caloriesPer100g),
            unit: "kcal",
        },
        Protein: {
            total: Math.round(meal.totalProtein / servings),
            per100g: Math.round(calculatedMacros.proteinPer100g),
            unit: "g",
        },
        Carbs: {
            total: Math.round(meal.totalCarbs / servings),
            per100g: Math.round(calculatedMacros.carbsPer100g),
            unit: "g",
        },
        Fats: {
            total: Math.round(meal.totalFat / servings),
            per100g: Math.round(calculatedMacros.fatsPer100g),
            unit: "g",
        },
        Sugars: {
            total: Math.round(meal.totalSugars / servings),
            per100g: Math.round(calculatedMacros.sugarsPer100g),
            unit: "g",
        },
        SaturatedFat: {
            total: Math.round(meal.totalSaturatedFat / servings),
            per100g: Math.round(calculatedMacros.saturatedFatPer100g),
            unit: "g",
        },
        UnsaturatedFat: {
            total: Math.round(meal.totalUnsaturatedFat / servings),
            per100g: Math.round(calculatedMacros.unsaturatedFatPer100g),
            unit: "g",
        },
    };
};