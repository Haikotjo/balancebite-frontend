
export const buildMealFormData = async (data, capturedImage, uploadedImage, imageUrl) => {
    const formData = new FormData();

    const mealInputDTO = {
        name: data.name,
        mealDescription: data.mealDescription,
        mealIngredients: data.mealIngredients.map((ingredient) => ({
            foodItemId: parseInt(ingredient.foodItemId, 10),
            quantity: parseFloat(ingredient.quantity),
        })),
        imageUrl: imageUrl || null,
    };

    console.log("MealInputDTO before adding files:", mealInputDTO);
    formData.append("mealInputDTO", JSON.stringify(mealInputDTO));

    if (capturedImage) {
        console.log("Processing Captured Image...");
        const blob = await fetch(capturedImage).then((res) => res.blob());
        formData.append("imageFile", blob, "captured-image.jpg");
        console.log("Captured image added to formData.");
    } else if (uploadedImage) {
        console.log("Processing Uploaded Image...");
        const blob = await fetch(uploadedImage).then((res) => res.blob());
        formData.append("imageFile", blob, "uploaded-image.jpg");
    } else if (data.image && data.image[0]) {
        console.log("Processing File Input Image...");
        formData.append("imageFile", data.image[0]);
    } else if (data.imageUrl) {
        console.log("Image URL detected:", data.imageUrl);
        formData.set("mealInputDTO", JSON.stringify({
            ...mealInputDTO,
            imageUrl: data.imageUrl,
        }));
    } else {
        console.log("No image provided.");
    }

    formData.forEach((value, key) => {
        console.log(`${key}:`, value);
    });

    return formData;
};
