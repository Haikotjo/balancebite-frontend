export const handleToggleFavorite = async ({
                                               isFavorite,
                                               meal,
                                               addMealToFavorites,
                                               removeMealFromFavorites,
                                               setIsFavorite,
                                               triggerAnimation
                                           }) => {
    const success = isFavorite
        ? await removeMealFromFavorites(meal)
        : await addMealToFavorites(meal);

    if (success) {
        setIsFavorite(!isFavorite);
        triggerAnimation(isFavorite ? 0.9 : 1.2);
    }
};
