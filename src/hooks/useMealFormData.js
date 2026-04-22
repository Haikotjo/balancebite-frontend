import { useEffect, useState } from "react";
import { fetchMealById } from "../services/apiService";

export const useMealFormData = (mealId, reset) => {
    const [loading, setLoading] = useState(true);
    const [meal, setMeal]       = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const loadMeal = async () => {
            try {
                const data = await fetchMealById(mealId);

                // Ingredients mapping for your form fields
                const mappedIngredients =
                    data.mealIngredients?.map((ing) => ({
                        foodItemId:   String(ing.foodItemId),
                        quantity:     ing.quantity,
                        foodItemName: ing.foodItemName || ing.foodItem?.name || "",
                        foodItemData: ing.foodItem ?? null,
                        _key:         crypto.randomUUID(),
                    })) ?? [{ foodItemId: "", quantity: 0, _key: crypto.randomUUID() }];

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
                    servings: data.servings ?? null,

                    images,
                    primaryIndex,

                    keepImageIds: images.map((img) => img.id),
                    primaryImageId: images.find((img) => img.primary)?.id ?? null,

                    videoUrl: data.videoUrl ?? "",
                    sourceUrl: data.sourceUrl ?? "",
                    preparationVideoUrl: data.preparationVideoUrl ?? "",
                    mealPreparation: data.mealPreparation ?? "",
                });


                setImageUrl(images[0]?.imageUrl ?? "");
                setMeal(data);
            } catch (e) {
                console.error("Failed to load meal for form:", e);
            } finally {
                setLoading(false);
            }
        };

        loadMeal();
    }, [mealId, reset]);

    return { loading, imageUrl, setImageUrl, meal };
};
