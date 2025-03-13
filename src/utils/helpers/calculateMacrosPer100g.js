export const calculateMacrosPer100g = (meal) => {
    if (!meal?.mealIngredients || meal.mealIngredients.length === 0) {
        return {
            caloriesPer100g: 0,
            proteinPer100g: 0,
            carbsPer100g: 0,
            fatsPer100g: 0,
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
            totalWeight: 0
        };
    }

    const caloriesPer100g = (meal.totalCalories / totalWeight) * 100;
    const proteinPer100g = (meal.totalProtein / totalWeight) * 100;
    const carbsPer100g = (meal.totalCarbs / totalWeight) * 100;
    const fatsPer100g = (meal.totalFat / totalWeight) * 100;

    return {
        caloriesPer100g: Math.round(caloriesPer100g),
        proteinPer100g: Math.round(proteinPer100g),
        carbsPer100g: Math.round(carbsPer100g),
        fatsPer100g: Math.round(fatsPer100g),
        totalWeight
    };
};
