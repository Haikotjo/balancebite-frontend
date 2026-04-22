import normalizeUrl from "./normalizeUrl.js";

export const buildMealFormData = async (data) => {
    const formData = new FormData();

    const mealInputDTO = {
        name: data.name,
        mealDescription: data.mealDescription,
        servings: data.servings ?? null,
        mealIngredients: (data.mealIngredients || [])
            .filter(ing => ing.foodItemId && String(ing.foodItemId).trim() !== "")
            .map((ingredient) => ({
                foodItemId: parseInt(ingredient.foodItemId, 10),
                quantity: parseFloat(ingredient.quantity),
            })),

        keepImageIds: data.keepImageIds ?? [],
        replaceOrderIndexes: data.replaceOrderIndexes ?? [],
        primaryIndex: data.primaryIndex ?? null,
        primaryImageId: data.primaryImageId ?? null,

        mealTypes: data.mealTypes || null,
        cuisines: data.cuisines || null,
        diets: data.diets || null,
        preparationTime: data.preparationTime || null,

        videoUrl: normalizeUrl(data.videoUrl) ?? "",
        sourceUrl: normalizeUrl(data.sourceUrl) ?? "",
        preparationVideoUrl: normalizeUrl(data.preparationVideoUrl) ?? "",
        mealPreparation: data.mealPreparation || null,
    };


    formData.append("mealInputDTO", JSON.stringify(mealInputDTO));

    if (Array.isArray(data.imageFiles)) {
        data.imageFiles.forEach((file) => {
            if (file) {
                formData.append("imageFiles", file);
            }
        });
    }

    // Optional: attach a shared email address
    if (data.email && data.email.trim() !== "") {
        formData.append("sharedEmails", data.email.trim().toLowerCase());
    }

    // Optional: attach shared user IDs
    if (Array.isArray(data.sharedUserIds)) {
        data.sharedUserIds.forEach((id) => {
            if (id) formData.append("sharedUserIds", id);
        });
    }

    return formData;
};
