/**
 * Converts an enum-like string to a user-friendly label.
 *
 * - For the keys "saveCount", "weeklySaveCount", and "monthlySaveCount", the sort order is ignored
 *   and replaced with fixed labels: "All Time", "This Week", "This Month".
 * - For other sortable keys, the sort order is preserved and formatted nicely, e.g.:
 *   "avg_protein (desc)" → "Avg Protein (Desc)".
 * - Strings without sort order are simply formatted, e.g.:
 *   "LOW_CARB" → "Low Carb".
 *
 * @param {string} text - The enum-like string (e.g., "saveCount (desc)", "LOW_CARB").
 * @returns {string} - The formatted user-friendly display string.
 */
export const formatEnum = (text) => {
    if (typeof text !== "string") {
        text = String(text ?? "");
    }

    const match = text.match(/^(.+?)\s*\((asc|desc)\)$/i);
    if (match) {
        const rawKey = match[1];
        const order = match[2];

        const labelMap = {
            saveCount: "All Time",
            weeklySaveCount: "This Week",
            monthlySaveCount: "This Month"
        };

        if (labelMap[rawKey]) {
            return labelMap[rawKey];
        }

        const formattedKey = rawKey
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

        return `${formattedKey} (${order.charAt(0).toUpperCase() + order.slice(1)})`;
    }

    return text
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};
