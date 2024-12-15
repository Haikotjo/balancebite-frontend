export const buildMealFormData = async (data, capturedImage) => {
    const formData = new FormData();

    const mealInputDTO = {
        name: data.name,
        mealDescription: data.mealDescription,
        mealIngredients: data.mealIngredients.map((ingredient) => ({
            foodItemId: parseInt(ingredient.foodItemId, 10),
            quantity: parseFloat(ingredient.quantity),
        })),
        imageUrl: data.imageUrl || null,
    };
    formData.append("mealInputDTO", JSON.stringify(mealInputDTO));

    if (capturedImage) {
        const blob = await fetch(capturedImage).then((res) => res.blob());
        formData.append("imageFile", blob, "captured-image.jpg");
    } else if (data.image && data.image[0]) {
        formData.append("imageFile", data.image[0]);
    }

    return formData;
};
