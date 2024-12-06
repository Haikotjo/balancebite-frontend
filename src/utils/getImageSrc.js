export const getImageSrc = (meal) => {
    if (meal.image) {
        return `data:image/jpeg;base64,${meal.image}`;
    }
    return meal.imageUrl || "https://via.placeholder.com/150";
};
