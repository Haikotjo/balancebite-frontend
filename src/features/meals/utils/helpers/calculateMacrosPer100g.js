export const calculateMacrosPer100g = (meal) => {
    if (!meal?.mealIngredients || meal.mealIngredients.length === 0) {
        return {
            caloriesPer100g: 0,
            proteinPer100g: 0,
            carbsPer100g: 0,
            fatsPer100g: 0,
            sugarsPer100g: 0,
            saturatedFatPer100g: 0,
            unsaturatedFatPer100g: 0,
            fiberPer100g: 0,
            sodiumPer100g: 0,
            totalWeight: 0
        };
    }

    const totalWeight = meal.mealIngredients.reduce((sum, ingredient) => sum + ingredient.quantity, 0);

    if (totalWeight === 0) {
        return {
            caloriesPer100g: 0,
            proteinPer100g: 0,
            carbsPer100g: 0,
            fatsPer100g: 0,
            sugarsPer100g: 0,
            saturatedFatPer100g: 0,
            unsaturatedFatPer100g: 0,
            fiberPer100g: 0,
            sodiumPer100g: 0,
            totalWeight: 0
        };
    }

    const calc = (val) => val ? Math.round((val / totalWeight) * 100) : 0;

    return {
        caloriesPer100g: calc(meal.totalCalories),
        proteinPer100g: calc(meal.totalProtein),
        carbsPer100g: calc(meal.totalCarbs),
        fatsPer100g: calc(meal.totalFat),
        sugarsPer100g: calc(meal.totalSugars),
        saturatedFatPer100g: calc(meal.totalSaturatedFat),
        unsaturatedFatPer100g: calc(meal.totalUnsaturatedFat),
        fiberPer100g: calc(meal.totalFiber),
        sodiumPer100g: calc(meal.totalSodium),
        totalWeight
    };
};
