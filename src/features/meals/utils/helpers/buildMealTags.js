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
 * Always returns the full list of tags in random order.
 *
 * @param {Object} params
 * @param {string[]|string} params.cuisines
 * @param {string[]|string} params.diets
 * @param {string[]|string} params.mealTypes
 * @returns {Object} { shuffledTags, totalTagCount }
 */
export const buildMealTags = ({ cuisines, diets, mealTypes }) => {
    const toArray = (val) => Array.isArray(val) ? val : [val];

    const allTags = [
        ...toArray(cuisines).filter(Boolean).map(value => ({
            value,
            color: "primary",
            category: "cuisines",
        })),
        ...toArray(diets).filter(Boolean).map(value => ({
            value,
            color: "secondary",
            category: "diets",
        })),
        ...toArray(mealTypes).filter(Boolean).map(value => ({
            value,
            color: "success",
            category: "mealTypes",
        })),
    ];

    return {
        shuffledTags: shuffleArray(allTags),
        totalTagCount: allTags.length,
    };
};
