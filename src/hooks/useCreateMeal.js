import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { useFormMessages } from "./useFormMessages.jsx";
import { UserMealsContext } from "../context/UserMealsContext.jsx";
import { createMealApi } from "../services/apiService.js";
import { refreshMealsList } from "../utils/helpers/refreshMealsList.js";
import { getReadableApiError } from "../utils/helpers/getReadableApiError.js";
import {buildMealFormData} from "../features/meals/utils/helpers/buildMealFormData.js";

export const useCreateMeal = () => {
    const navigate = useNavigate();
    const { fetchUserMealsData, addMealToUserMeals, setMeals } = useContext(UserMealsContext);
    const { setError, setSuccess, clear, renderDialogs } = useFormMessages();

    // Alleen de state die we écht nodig hebben in de hook:
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
            // 1) Map form-data velden
            const mealData = {
                ...data,
                mealTypes: (data.mealTypes || []).map((t) => t.value || t),
                cuisines: (data.cuisines || []).map((c) => c.value || c),
                diets: (data.diets || []).map((d) => d.value || d),
            };

            // 2) Bouw FormData inclusief afbeelding
            const formData = await buildMealFormData(
                mealData,
                capturedImage,
                uploadedImage,
                imageUrl
            );

            // 3) API call
            const response = await createMealApi(formData);

            addMealToUserMeals(response);
            setMeals((prev) => [response, ...prev]);

            // 4) Success afhandelen
            setSuccess(`Meal created: ${response.name || "Unknown meal"}`);
            // await refreshMealsList(fetchUserMealsData);
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
