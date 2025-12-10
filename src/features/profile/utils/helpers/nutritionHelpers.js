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
