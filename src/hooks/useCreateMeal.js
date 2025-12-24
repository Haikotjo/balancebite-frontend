// useCreateMeal.js
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useFormMessages } from "./useFormMessages.jsx";
import { UserMealsContext } from "../context/UserMealsContext.jsx";
import { createMealApi } from "../services/apiService.js";
import { getReadableApiError } from "../utils/helpers/getReadableApiError.js";
import { buildMealFormData } from "../features/meals/utils/helpers/buildMealFormData.js";

export const useCreateMeal = ({ preview = false } = {}) => {
    const navigate = useNavigate();
    const { addMealToUserMeals, setMeals } = useContext(UserMealsContext);
    const { setError, setSuccess, clear, renderDialogs } = useFormMessages();

    /**
     * Sets imageFiles[] and primaryIndex in react-hook-form.
     * - files: Array<File>
     * - primaryIndex: number | null
     * Default behavior: if files exist and primaryIndex is null -> set primaryIndex = 0
     */
    const handleImagesChange = (files, primaryIndex, setValue) => {
        const safeFiles = Array.isArray(files) ? files.filter(Boolean) : [];

        // Default primary to first image if user did not pick one
        let safePrimaryIndex = primaryIndex ?? null;
        if (safeFiles.length > 0 && safePrimaryIndex == null) safePrimaryIndex = 0;

        // Clamp primaryIndex to valid range
        if (safePrimaryIndex != null) {
            if (safePrimaryIndex < 0) safePrimaryIndex = 0;
            if (safePrimaryIndex >= safeFiles.length) safePrimaryIndex = safeFiles.length - 1;
        }

        setValue("imageFiles", safeFiles, { shouldValidate: true, shouldDirty: true });
        setValue("primaryIndex", safePrimaryIndex, { shouldValidate: true, shouldDirty: true });
    };

    const onSubmit = async (data) => {
        clear();
        try {
            const mealData = {
                ...data,
                mealTypes: (data.mealTypes || []).map((t) => t.value || t),
                cuisines: (data.cuisines || []).map((c) => c.value || c),
                diets: (data.diets || []).map((d) => d.value || d),

                videoUrl: data.videoUrl?.trim(),
                sourceUrl: data.sourceUrl?.trim(),
            };

            const formData = await buildMealFormData(mealData);
            const response = await createMealApi(formData);

            if (preview) {
                return response;
            }

            addMealToUserMeals(response);
            setMeals((prev) => [response, ...prev]);
            setSuccess(`Meal created: ${response.name || "Unknown meal"}`);
            navigate(`/meal/${response.id}`);
            return response;
        } catch (error) {
            setError(getReadableApiError(error));
            throw error;
        }
    };

    return {
        onSubmit,
        handleImagesChange,
        renderDialogs,
    };
};
