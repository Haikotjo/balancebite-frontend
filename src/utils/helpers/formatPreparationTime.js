/**
 * Converts an ISO 8601 duration string (e.g. "PT1H30M") to a human-readable format.
 * Example: "PT1H30M" → "1 hour, 30 minutes"
 */
export const formatPreparationTime = (ptString) => {
    if (!ptString) return "";

    const match = ptString.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return "";

    const [, hours, minutes] = match;
    const parts = [];

    if (hours) parts.push(`${parseInt(hours)} ${parseInt(hours) === 1 ? "hour" : "hours"}`);
    if (minutes) parts.push(`${parseInt(minutes)} ${parseInt(minutes) === 1 ? "minute" : "minutes"}`);

    return parts.join(", ");
};
