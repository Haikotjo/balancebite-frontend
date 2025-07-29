export const buildMealFormData = async (data, capturedImage, uploadedImage, imageUrl) => {
    const formData = new FormData();

    const mealInputDTO = {
        name: data.name,
        mealDescription: data.mealDescription,
        mealIngredients: data.mealIngredients.map((ingredient) => ({
            foodItemId: parseInt(ingredient.foodItemId, 10),
            quantity: parseFloat(ingredient.quantity),
        })),
        imageUrl: !capturedImage && !uploadedImage ? (imageUrl || data.imageUrl || null) : null,
        mealTypes: data.mealTypes || null,
        cuisines: data.cuisines || null,
        diets: data.diets || null,
        preparationTime: data.preparationTime || null,
    };

    formData.append("mealInputDTO", JSON.stringify(mealInputDTO));

    console.log("MealInputDTO before adding files:", mealInputDTO);

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
    } else {
        console.log("No image provided.");
    }

    // Eén optioneel e-mailadres meesturen
    if (data.email && data.email.trim() !== "") {
        formData.append("sharedEmails", data.email.trim().toLowerCase());
    }

    // sharedUserIds eventueel behouden (optioneel)
    if (Array.isArray(data.sharedUserIds)) {
        data.sharedUserIds.forEach((id) => {
            if (id) formData.append("sharedUserIds", id);
        });
    }

    formData.forEach((value, key) => {
        console.log(`${key}:`, value);
    });

    return formData;
};
