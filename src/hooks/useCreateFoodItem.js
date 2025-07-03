import { useEffect, useState } from "react";
import { createFoodItemApi, getMappedFoodSources } from "../services/apiService";
import { getAccessToken } from "../utils/helpers/getAccessToken";
import {foodCategoryOptions} from "../utils/const/foodCategoryOptions.js";

export const useCreateFoodItem = (reset) => {
    const [foodSourceOptions, setFoodSourceOptions] = useState([]);

    const onSubmit = async (data) => {
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
            foodCategory: data.foodCategory || null,
            nutrients: [
                { nutrientName: "Energy", value: parseFloat(data.calories), unitName: "kcal", nutrientId: 1008 },
                { nutrientName: "Protein", value: parseFloat(data.protein), unitName: "g", nutrientId: 1003 },
                { nutrientName: "Carbohydrates", value: parseFloat(data.carbohydrates), unitName: "g", nutrientId: 1005 },
                { nutrientName: "Total lipid (fat)", value: parseFloat(data.fat), unitName: "g", nutrientId: 1004 },
                { nutrientName: "Fatty acids, total saturated", value: parseFloat(data.saturatedFat), unitName: "g", nutrientId: 1258 },
                { nutrientName: "Fatty acids, total unsaturated", value: parseFloat(data.unsaturatedFat), unitName: "g", nutrientId: 1999 },
            ],
        };

        console.log("Payload being sent:", payload);

        const response = await createFoodItemApi(payload, token);
        reset?.();
        return response;
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

    return {
        onSubmit,
        foodSourceOptions,
        foodCategoryOptions,
    };
};
