export const transformToNumber = (value, originalValue) => {
    if (typeof originalValue === "string") {
        const cleaned = originalValue.trim().replace(",", ".");
        return cleaned === "" ? null : Number(cleaned);
    }
    return value;
};
