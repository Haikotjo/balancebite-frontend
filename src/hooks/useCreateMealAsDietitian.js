import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { useFormMessages } from "./useFormMessages.jsx";
import { UserMealsContext } from "../context/UserMealsContext.jsx";
import { createMealAsDietitianApi } from "../services/apiService.js";
import { getReadableApiError } from "../utils/helpers/getReadableApiError.js";
import { buildMealFormData } from "../features/meals/utils/helpers/buildMealFormData.js";

/**
 * Hook for dietitians to create a private meal and optionally share it.
 * Uses VITE_DIETITIAN_CREATE_MEAL_ENDPOINT.
 */
export const useCreateMealAsDietitian = () => {
    const navigate = useNavigate();
    const { addMealToUserMeals, setMeals } = useContext(UserMealsContext);
    const { setError, setSuccess, clear, renderDialogs } = useFormMessages();

    const [capturedImage, setCapturedImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const handleImageChange = (image, type, setValue) => {
        if (type === "uploaded" || type === "captured") {
            setCapturedImage(image);
            setUploadedImage(type === "uploaded" ? image : null);
            setImageUrl("");
            setValue("imageFile", image);
            setValue("imageUrl", "");
        } else if (type === "url") {
            setCapturedImage(null);
            setUploadedImage(null);
            setImageUrl(image);
            setValue("imageUrl", image);
            setValue("imageFile", "");
        } else if (type === "reset") {
            setCapturedImage(null);
            setUploadedImage(null);
            setImageUrl("");
            setValue("imageFile", "");
            setValue("imageUrl", "");
        }
    };

    const onSubmit = async (data) => {
        clear();
        try {
            const mealData = {
                ...data,
                mealTypes: (data.mealTypes || []).map((t) => t.value || t),
                cuisines: (data.cuisines || []).map((c) => c.value || c),
                diets: (data.diets || []).map((d) => d.value || d),
            };

            const formData = await buildMealFormData(
                mealData,
                capturedImage,
                uploadedImage,
                imageUrl
            );

            // Voeg deling toe als die aanwezig is
            if (data.sharedUserIds) {
                data.sharedUserIds.forEach((id) => formData.append("sharedUserIds", id));
            }

            if (data.sharedEmails) {
                data.sharedEmails.forEach((email) =>
                    formData.append("sharedEmails", email.trim().toLowerCase())
                );
            }

            const response = await createMealAsDietitianApi(formData);

            addMealToUserMeals(response);
            setMeals((prev) => [response, ...prev]);

            setSuccess(`Meal created: ${response.name || "Unknown meal"}`);
            navigate(`/meal/${response.id}`);
        } catch (error) {
            setError(getReadableApiError(error));
        }
    };

    return {
        onSubmit,
        handleImageChange,
        imageUrl,
        renderDialogs,
    };
};
