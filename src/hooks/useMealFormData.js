import { useEffect, useState } from "react";
import { fetchMealById } from "../services/apiService";

export const useMealFormData = (mealId, reset) => {
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const loadMeal = async () => {
            try {
                const data = await fetchMealById(mealId);

                const mappedIngredients = data.mealIngredients?.map((ing) => ({
                    foodItemId: (ing.foodItemId || ing.id).toString(),
                    quantity: ing.quantity,
                })) ?? [{ foodItemId: "", quantity: 0 }];

                reset({
                    name: data.name,
                    mealDescription: data.mealDescription,
                    mealIngredients: mappedIngredients,
                    mealTypes: data.mealTypes,
                    cuisines: data.cuisines,
                    diets: data.diets,
                    preparationTime: data.preparationTime || "",
                });

                if (data.imageUrl) {
                    setImageUrl(data.imageUrl);
                }
            } catch {
                // Error wordt afgehandeld in handleApiError bij submit
            } finally {
                setLoading(false);
            }
        };
        loadMeal();
    }, [mealId, reset]);

    return { loading, imageUrl, setImageUrl };
}
