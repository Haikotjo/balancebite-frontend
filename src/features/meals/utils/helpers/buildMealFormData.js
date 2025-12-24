export const buildMealFormData = async (data) => {
    const formData = new FormData();

    const mealInputDTO = {
        name: data.name,
        mealDescription: data.mealDescription,
        mealIngredients: data.mealIngredients.map((ingredient) => ({
            foodItemId: parseInt(ingredient.foodItemId, 10),
            quantity: parseFloat(ingredient.quantity),
        })),
        primaryIndex: data.primaryIndex ?? null,
        mealTypes: data.mealTypes || null,
        cuisines: data.cuisines || null,
        diets: data.diets || null,
        preparationTime: data.preparationTime || null,

        videoUrl: data.videoUrl?.trim() || null,
        sourceUrl: data.sourceUrl?.trim() || null,
        preparationVideoUrl: data.preparationVideoUrl?.trim() || null,
        mealPreparation: data.mealPreparation || null,
    };

    console.log("MealInputDTO before adding files:", mealInputDTO);

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

    // Debug: inspect final FormData
    formData.forEach((value, key) => {
        console.log(`${key}:`, value);
    });

    return formData;
};
