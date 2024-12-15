export const getImageSrc = (meal) => {
    if (meal.image) {
        // Base64-encoded image
        return `data:image/jpeg;base64,${meal.image}`;
    }
    if (meal.imageUrl?.startsWith("http") || meal.imageUrl?.startsWith("https")) {
        // External URL
        return meal.imageUrl;
    }
    if (meal.imageUrl) {
        // Uploaded image from the backend
        return `${import.meta.env.VITE_BASE_URL}/uploads/${meal.imageUrl.replace('uploads/', '')}`;
    }
    // Fallback placeholder
    return "https://via.placeholder.com/150";
};
