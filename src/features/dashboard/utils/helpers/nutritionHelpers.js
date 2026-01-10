export const getSortedNutritionData = (useBaseRDI, baseNutrition, recommendedNutrition) => {
    const nutritionData = useBaseRDI ? baseNutrition : recommendedNutrition;

    if (!nutritionData) {
        return {
            sortedNutrients: null,
            message: useBaseRDI ? "No Base RDI available" : "Update Body Metrics to get your recommended nutrition",
        };
    }

    const nutrientOrder = [
        "Energy kcal",
        "Protein",
        "Carbohydrates",
        "Total lipid (fat)",
        "Saturated and Trans fats",
        "Mono- and Polyunsaturated fats",
    ];

    const sortedNutrients = nutritionData.nutrients?.sort((a, b) => {
        return nutrientOrder.indexOf(a.name) - nutrientOrder.indexOf(b.name);
    });

    return { sortedNutrients, message: null, createdAt: nutritionData.createdAtFormatted };
};

/**
 * Filters nutrition data to extract only Energy and Macros for charts.
 * @param {Object} nutrition - The nutrition object containing a nutrients array.
 * @returns {Array} Array of objects with name and value.
 */
export const buildChartData = (nutrition) => {
    const nutrients = nutrition?.nutrients ?? [];

    return nutrients
        .filter((n) =>
            ["Energy kcal", "Protein", "Carbohydrates", "Total lipid (fat)"].includes(n.name)
        )
        .map((n) => ({
            name: n.name,
            value: n.value ?? 0,
        }));
};