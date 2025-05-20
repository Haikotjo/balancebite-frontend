import { useNavigate } from "react-router-dom";
import {useContext, useState} from "react";
import { useFormMessages } from "./useFormMessages.jsx";
import { createDietPlanApi } from "../services/apiService.js";
import { getReadableApiError } from "../utils/helpers/getReadableApiError.js";
import {UserDietsContext} from "../context/UserDietContext.jsx";

export function useCreateDiet(onSuccess) {
    const navigate = useNavigate();
    const { setError, setSuccess, clear, renderDialogs } = useFormMessages();
    const { fetchUserDietsData } = useContext(UserDietsContext);

    const [days, setDays] = useState([
        { mealIds: [""] }
    ]);
    const [loading, setLoading] = useState(false);

    const handleChangeMealId = (dayIndex, mealIndex, value) => {
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

    const addDay = () => setDays(prev => [...prev, { mealIds: [""] }]);

    const removeDay = () => setDays(prev => prev.slice(0, -1));

    const onSubmit = async (formData) => {
        const { name, dietDescription } = formData;
        clear();
        setLoading(true);
        const payload = {
            name,
            dietDescription,
            dietDays: formData.dietDays.map((day, index) => ({
                dayLabel: day.dayLabel,
                dietDayDescription: day.dietDayDescription,
                mealIds: days[index].mealIds.filter(id => id.trim() !== ""),
            }))
        };

        try {
            const newDiet = await createDietPlanApi({ ...payload, diets: [] });
            setSuccess(`Diet created: ${newDiet.name || "Unknown diet"}`);
            await fetchUserDietsData(); // ⬅️ Voeg dit toe
            onSuccess?.(newDiet);
            navigate(`/diet/${newDiet.id}`);
        } catch (err) {
            setError(getReadableApiError(err));
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
