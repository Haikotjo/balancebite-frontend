/**
 * Builds a cleaned user details object ready for submission.
 * Converts empty strings to null and ensures numbers are parsed correctly.
 *
 * @param {object} data - Raw form data.
 * @returns {object} Cleaned user details data.
 */
export const buildUserDetailsData = (data) => {
    return {
        gender: data.gender || null,
        activityLevel: data.activityLevel || null,
        goal: data.goal || null,
        height: data.height ? Number(data.height) : null,
        weight: data.weight ? Number(data.weight) : null,
        targetWeight: data.targetWeight ? Number(data.targetWeight) : null,
        age: data.age ? Number(data.age) : null,
    };
};