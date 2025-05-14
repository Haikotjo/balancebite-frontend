
const placeholderImages = import.meta.glob("../../assets/images/placeholder/*.webp", { eager: true });

const placeholders = Object.values(placeholderImages).map((img) => img.default);

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

    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
};
