/**
 * Formats an enum-like string by converting it to a readable format.
 *
 * - Converts the string to lowercase.
 * - Replaces underscores (_) with spaces.
 * - Capitalizes the first letter of each word.
 *
 * @param {string} text - The enum string to be formatted (e.g., "LOW_CARB").
 * @returns {string} - The formatted string (e.g., "Low Carb").
 */
export const formatEnum = (text) => {
    return text
        .toLowerCase() // Convert to lowercase
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};
