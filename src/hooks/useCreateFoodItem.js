// hooks/useCreateFoodItem.js
import { useState, useEffect } from "react";
import {createFoodItemApi, getFoodSourcesApi, getMappedFoodSources} from "../services/apiService";
import { getAccessToken } from "../utils/helpers/getAccessToken";
import { handleApiError } from "../utils/helpers/handleApiError";

export const useCreateFoodItem = (reset) => {
    const [successMessage, setSuccessMessage] = useState("");
    const [foodSourceOptions, setFoodSourceOptions] = useState([]);

    const onSubmit = async (data) => {
        try {
            const token = getAccessToken();
            const formattedFoodSource = data.foodSource
                ? ` (${data.foodSource.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())})`
                : "";
            const fullName = `${data.name}${formattedFoodSource}`;

            const payload = {
                name: fullName,
                gramWeight: parseFloat(data.gramWeight),
                portionDescription: data.portionDescription,
                source: data.source,
                foodSource: data.foodSource || null,
                nutrients: [
                    { nutrientName: "Energy", value: parseFloat(data.calories), unitName: "kcal", nutrientId: 1008 },
                    { nutrientName: "Protein", value: parseFloat(data.protein), unitName: "g", nutrientId: 1003 },
                    { nutrientName: "Carbohydrates", value: parseFloat(data.carbohydrates), unitName: "g", nutrientId: 1005 },
                    { nutrientName: "Total lipid (fat)", value: parseFloat(data.fat), unitName: "g", nutrientId: 1004 },
                ],
            };

            const response = await createFoodItemApi(payload, token);
            setSuccessMessage(`Food item created: ${response.name || "Unknown"}`);
            reset?.();
        } catch (error) {
            console.error("[FoodItem Creation Error]", error);
            handleApiError(error);
        }
    };

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const mapped = await getMappedFoodSources();
                setFoodSourceOptions(mapped);
            } catch (error) {
                console.error("Failed to load food sources", error);
            }
        };
        fetchSources();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);


    return {
        onSubmit,
        foodSourceOptions,
        successMessage,
        setSuccessMessage,
    };

};


