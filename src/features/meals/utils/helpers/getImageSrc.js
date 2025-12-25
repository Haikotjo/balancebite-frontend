const placeholderImages = import.meta.glob("/src/assets/images/placeholder/*.webp", { eager: true });
const placeholders = Object.values(placeholderImages).map((img) => img.default);

/**
 * Returns a valid image src for a meal.
 * Supports multiple images and primary selection.
 *
 * @param {Object} meal
 * @param {Object} opts
 * @param {boolean} [opts.primaryOnly=true]   If true, prefer primary image (if available).
 * @param {boolean} [opts.excludePrimary=false] If true, return a non-primary image (if available).
 * @param {number}  [opts.index=0]            Fallback index for URL arrays.
 * @returns {string}
 */

// Usage examples:
//
// getImageSrc(meal)
// → Returns the primary image if available, otherwise the first available image.
//
// getImageSrc(meal, { excludePrimary: true })
// → Returns a non-primary image if available (useful for galleries or secondary views).
//
// getImageSrc(meal, { primaryOnly: false })
// → Returns the first available image, ignoring primary preference.

export const getImageSrc = (meal, opts = {}) => {
    const { primaryOnly = true, excludePrimary = false, index = 0 } = opts;

    const images = Array.isArray(meal?.images) ? meal.images : [];

    if (images.length > 0) {
        const sorted = [...images].sort((a, b) => (a?.orderIndex ?? 0) - (b?.orderIndex ?? 0));

        if (excludePrimary) {
            const nonPrimary = sorted.find((img) => !img?.primary && img?.imageUrl?.trim());
            if (nonPrimary) return nonPrimary.imageUrl.trim();
        }

        if (primaryOnly) {
            const primary = sorted.find((img) => img?.primary && img?.imageUrl?.trim());
            if (primary) return primary.imageUrl.trim();
        }

        const fallback = sorted.find((img) => img?.imageUrl?.trim());
        if (fallback) return fallback.imageUrl.trim();
    }

    const imageUrls = Array.isArray(meal?.imageUrls) ? meal.imageUrls : [];
    if (imageUrls.length > 0) {
        const url = (imageUrls[index] ?? imageUrls[0] ?? "").trim();
        if (url) return url;
    }

    if (placeholders.length > 0) {
        return placeholders[Math.floor(Math.random() * placeholders.length)];
    }

    return "/fallback.jpg";
};

