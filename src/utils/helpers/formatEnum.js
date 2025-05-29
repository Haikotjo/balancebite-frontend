/**
 * Formats an enum-like string by converting it to a readable format.
 *
 * - Converts the string to lowercase.
 * - Replaces underscores (_) with spaces.
 * - Capitalizes the first letter of each word.
 *
 * If input is not a string, it is converted to a string safely.
 *
 * @param {string} text - The enum string to be formatted (e.g., "LOW_CARB").
 * @returns {string} - The formatted string (e.g., "Low Carb").
 */
export const formatEnum = (text) => {
    if (typeof text !== "string") {
        text = String(text ?? ""); // handle null/undefined gracefully
    }

    return text
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};
