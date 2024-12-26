export const roundNutrientValues = (data) => {
    if (!data || !Array.isArray(data.nutrients)) return data;

    const roundedNutrients = data.nutrients.map((nutrient) => ({
        ...nutrient,
        value:
            typeof nutrient.value === "number"
                ? Math.round(nutrient.value)
                : nutrient.value,
    }));

    return {
        ...data,
        nutrients: roundedNutrients,
    };
};
