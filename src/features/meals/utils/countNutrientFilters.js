const NUTRIENT_DEFAULTS = { calories: 2000, protein: 150, carbs: 150, fat: 100 };

/**
 * Returns the number of nutrient range filters that deviate from their default values.
 */
export default function countNutrientFilters(filters) {
    return Object.entries(NUTRIENT_DEFAULTS).filter(([key, max]) => {
        const cap = key.charAt(0).toUpperCase() + key.slice(1);
        return (filters[`min${cap}`] ?? 0) > 0 || (filters[`max${cap}`] ?? max) < max;
    }).length;
}
