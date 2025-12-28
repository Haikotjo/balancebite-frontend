// clearMealImageSlots.js
/**
 * Clears slot previews safely (revokes blob URLs) and returns fresh empty slots.
 * Pure helper: no React, no side-effects outside the provided slots.
 */
export const clearMealImageSlots = (prevSlots, maxSlots) => {
    prevSlots.forEach((s) => {
        if (s.previewUrl && s.previewUrl.startsWith("blob:")) {
            try {
                URL.revokeObjectURL(s.previewUrl);
            } catch {
                // ignore
            }
        }
    });

    return Array.from({ length: maxSlots }, () => ({ file: null, previewUrl: null }));
};
