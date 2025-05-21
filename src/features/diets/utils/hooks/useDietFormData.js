import { useEffect, useState } from "react";
import { getUserDietPlanByIdApi } from "../../../../services/apiService";

export const useDietFormData = (dietId, reset) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [diet, setDiet] = useState(null);

    useEffect(() => {
        const loadDiet = async () => {
            try {
                const data = await getUserDietPlanByIdApi(dietId);
                setDiet(data);

                reset({
                    name: data.name || "",
                    dietDescription: data.dietDescription || "",
                    diets: data.diets || [],
                    dietDays: (data.dietDays || []).map(day => ({
                        dayLabel: day.dayLabel || "",
                        dietDayDescription: day.dietDayDescription || "",
                        mealIds: (day.meals || []).map(meal => meal.id.toString()),
                    })),
                });
            } catch (err) {
                console.error("Failed to fetch diet:", err);
                setError("Failed to fetch diet.");
            } finally {
                setLoading(false);
            }
        };

        if (dietId) {
            loadDiet();
        }
    }, [dietId, reset]);

    return { loading, diet, error };
};
