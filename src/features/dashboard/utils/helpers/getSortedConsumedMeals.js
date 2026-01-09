// src/features/dashboard/utils/helpers/consumedMealsHelpers.js

/**
 * Returns a sorted copy of consumed meals (newest first).
 *
 * @param {object} data
 * @returns {Array}
 */
export const getSortedConsumedMeals = (data) => {
    const meals = Array.isArray(data?.consumedMeals) ? data.consumedMeals : [];

    return meals
        .slice()
        .sort((a, b) =>
            String(b?.consumedTime ?? "").localeCompare(String(a?.consumedTime ?? ""))
        );
};
