import { useNavigate } from "react-router-dom";
import {useContext, useState} from "react";
import { useFormMessages } from "../../../../hooks/useFormMessages.jsx";
import { createDietPlanApi } from "../../../../services/apiService.js";
import { getReadableApiError } from "../../../../utils/helpers/getReadableApiError.js";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";
import {UserMealsContext} from "../../../../context/UserMealsContext.jsx";

export function useCreateDiet(onSuccess, append, remove) {
    const navigate = useNavigate();
    const { setError, setSuccess, clear, renderDialogs } = useFormMessages();
    const { fetchUserDietsData } = useContext(UserDietsContext);
    const { addMealToUserMeals } = useContext(UserMealsContext);


    const [days, setDays] = useState([
        { mealIds: [""] }
    ]);
    const [loading, setLoading] = useState(false);

    const handleChangeMealId = (dayIndex, mealIndex, value, remove) => {
        setDays(prev =>
            prev.map((d, i) => {
                if (i !== dayIndex) return d;
                const mealIds = [...d.mealIds];
                mealIds[mealIndex] = value;
                return { ...d, mealIds };
            })
        );
    };

    const addMealId = (dayIndex) => {
        setDays(prev => {
            const copy = [...prev];
            const mealIds = copy[dayIndex].mealIds;
            const allFilled = mealIds.every(id => id.trim() !== "");
            if (allFilled) {
                copy[dayIndex].mealIds.push("");
            }
            return copy;
        });
    };

    const removeMeal = (dayIndex, mealIndex) => {
        setDays(prev => {
            const copy = [...prev];
            copy[dayIndex].mealIds.splice(mealIndex, 1);
            return copy;
        });
    };

    const addDay = () => {
        setDays(prev => [...prev, { mealIds: [""] }]);
        append({ dayLabel: "", dietDayDescription: "" });
    };


    const removeDay = (index) => {
        setDays(prev => prev.filter((_, i) => i !== index));
        remove(index);
    };

    const onSubmit = async (formData) => {
        clear();
        setLoading(true);

        const payload = {
            name: formData.name,
            dietDescription: formData.dietDescription,
            dietDays: formData.dietDays.map((day, index) => {
                const mealIds = days[index].mealIds.filter(id => id.trim() !== "");
                return {
                    dayLabel: day.dayLabel,
                    dietDayDescription: day.dietDayDescription,
                    mealIds
                };
            })
        };

        // 👇 DIT BLIJFT STAAN om te checken wat er gebeurt
        console.log("[onSubmit] Payload dat naar backend gaat:", JSON.stringify(payload, null, 2));

        const isValid = payload.dietDays.every(day => day.mealIds.length >= 2);
        if (!isValid) {
            setError("Each day must have at least 2 meals.");
            setLoading(false);
            return;
        }

        try {
            const newDiet = await createDietPlanApi({ ...payload, diets: [] });
            setSuccess(`Diet created: ${newDiet.name || "Unknown diet"}`);
            await fetchUserDietsData();

            newDiet.dietDays?.forEach(day => {
                day.meals?.forEach(meal => {
                    if (meal && meal.id) {
                        addMealToUserMeals(meal);
                    }
                });
            });
            onSuccess?.(newDiet);
            navigate(`/diet/${newDiet.id}`);
        } catch (err) {
            console.error("❌ Backend error bij createDietPlanApi:", err);
            setError(getReadableApiError(err));
            setLoading(false);
        }
    };

    return {
        days,
        loading,
        renderDialogs,
        handleChangeMealId,
        addDay,
        removeDay,
        addMealId,
        removeMeal,
        onSubmit,
    };
}
