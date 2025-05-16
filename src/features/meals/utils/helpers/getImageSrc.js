

const placeholderImages = import.meta.glob("/src/assets/images/placeholder/*.webp", { eager: true });
const placeholders = Object.values(placeholderImages).map((img) => img.default);
/**
 * Returns a valid image source for a meal object.
 * Falls back to a placeholder if no valid image is present.
 *
 * @param {Object} meal - The meal object.
 * @returns {string} - Image source URL or data URI.
 */
export const getImageSrc = (meal) => {
    // 1. Base64-encoded image from backend
    if (meal?.image) {
        return `data:image/jpeg;base64,${meal.image}`;
    }

    // 2. Image URL (external or internal)
    const url = meal?.imageUrl?.trim();
    if (url) {
        if (url.startsWith("http") || url.startsWith("https")) {
            return url;
        }
        return `${import.meta.env.VITE_BASE_URL}/uploads/${url.replace("uploads/", "")}`;
    }

    // 3. Placeholder fallback
    if (placeholders.length > 0) {
        const index = Math.floor(Math.random() * placeholders.length);
        return placeholders[index];
    }

    // 4. Final fallback in case placeholders are missing
    console.warn("⚠️ No placeholder images found. Returning generic fallback.");
    return "/fallback.jpg"; // Zorg dat deze bestaat in /public
};
