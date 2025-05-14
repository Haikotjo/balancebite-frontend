/**
 * Shuffles the elements of an array randomly.
 *
 * @param {Array} array - The array to shuffle.
 * @returns {Array} A new shuffled array.
 */
export const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

/**
 * Builds a list of tag objects from the given meal category values (cuisines, diets, mealTypes).
 * Each tag is enriched with its display color and category.
 *
 * - If `expanded` or `forceExpand` is true: all tags are returned in random order.
 * - Otherwise: only the first tag of each category is returned (also shuffled).
 *
 * @param {Object} params - The parameters object.
 * @param {string[]|string} params.cuisines - Cuisines associated with the meal.
 * @param {string[]|string} params.diets - Diet types associated with the meal.
 * @param {string[]|string} params.mealTypes - Meal types associated with the meal.
 * @param {boolean} params.expanded - Whether the full list should be shown.
 * @param {boolean} params.forceExpand - Forces full list display regardless of `expanded`.
 * @returns {Array} An array of tag objects: { value, color, category }
 */
export const buildMealTags = ({ cuisines, diets, mealTypes, expanded, forceExpand }) => {
    const toArray = (val) => Array.isArray(val) ? val : [val];

    const allTags = [
        ...toArray(cuisines).filter(Boolean).map(value => ({ value, color: "primary", category: "cuisines" })),
        ...toArray(diets).filter(Boolean).map(value => ({ value, color: "secondary", category: "diets" })),
        ...toArray(mealTypes).filter(Boolean).map(value => ({ value, color: "success", category: "mealTypes" })),
    ];

    const limitedTags = [
        ...toArray(cuisines).filter(Boolean).slice(0, 1).map(value => ({ value, color: "primary", category: "cuisines" })),
        ...toArray(diets).filter(Boolean).slice(0, 1).map(value => ({ value, color: "secondary", category: "diets" })),
        ...toArray(mealTypes).filter(Boolean).slice(0, 1).map(value => ({ value, color: "success", category: "mealTypes" })),
    ];

    return {
        shuffledTags: shuffleArray((expanded || forceExpand) ? allTags : limitedTags),
        totalTagCount: allTags.length,
    };
};

