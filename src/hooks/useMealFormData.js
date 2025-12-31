import { useEffect, useState } from "react";
import { fetchMealById } from "../services/apiService";

export const useMealFormData = (mealId, reset) => {
    const [loading, setLoading] = useState(true);

    // Legacy state (can stay, but no longer leading for multi-images)
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const loadMeal = async () => {
            try {
                const data = await fetchMealById(mealId);
                console.log("Fetched meal data:", data);

                // Ingredients mapping for your form fields
                const mappedIngredients =
                    data.mealIngredients?.map((ing) => ({
                        foodItemId: String(ing.foodItemId),
                        quantity: ing.quantity,
                    })) ?? [{ foodItemId: "", quantity: 0 }];

                // ✅ Multi-image mapping (THIS is what your uploader needs)
                const images = (data.images ?? [])
                    .slice()
                    .sort((a, b) => a.orderIndex - b.orderIndex);

                const primaryIndex =
                    images.find((i) => i.primary)?.orderIndex ??
                    (images.length ? 0 : null);

                // ✅ Reset form values INCLUDING images + primaryIndex
                reset({
                    name: data.name ?? "",
                    mealDescription: data.mealDescription ?? "",
                    mealIngredients: mappedIngredients,
                    mealTypes: data.mealTypes ?? [],
                    cuisines: data.cuisines ?? [],
                    diets: data.diets ?? [],
                    preparationTime: data.preparationTime || "",

                    images,
                    primaryIndex,

                    keepImageIds: images.map((img) => img.id),
                    primaryImageId: images.find((img) => img.primary)?.id ?? null,

                    videoUrl: data.videoUrl ?? "",
                    sourceUrl: data.sourceUrl ?? "",
                    preparationVideoUrl: data.preparationVideoUrl ?? "",
                    mealPreparation: data.mealPreparation ?? "",
                });


                // Legacy: set to first image url if you still show it somewhere
                setImageUrl(images[0]?.imageUrl ?? "");
            } catch (e) {
                console.error("Failed to load meal for form:", e);
            } finally {
                setLoading(false);
            }
        };

        loadMeal();
    }, [mealId, reset]);

    return { loading, imageUrl, setImageUrl };
};
