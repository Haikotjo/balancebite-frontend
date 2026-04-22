import { useEffect, useState } from "react";
import { createFoodItemApi, getMappedFoodSources } from "../services/apiService";
import { foodCategoryOptions } from "../utils/const/foodCategoryOptions.js";

export const useCreateFoodItem = (reset) => {
    const [foodSourceOptions, setFoodSourceOptions] = useState([]);

    const onSubmit = async (data) => {
        const formattedFoodSource = data.foodSource
            ? ` (${data.foodSource.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())})`
            : "";
        const fullName = `${data.name}${formattedFoodSource}`;

        const urlToSend = data.imageUrl?.trim() ? data.imageUrl.trim() : null;
        const fileToSend = data.imageFile instanceof File ? data.imageFile : null;

        const dto = {
            name: fullName,
            gramWeight: data.gramWeight ? parseFloat(data.gramWeight) : null,
            portionDescription: data.portionDescription || null,
            source: data.source || null,
            foodSource: data.foodSource || null,
            foodCategory: data.foodCategory || null,
            storeBrand: !!data.storeBrand,
            price: data.price ? parseFloat(data.price) : null,
            grams: data.grams ? parseFloat(data.grams) : null,
            imageUrl: fileToSend ? null : urlToSend,
            image: null,
            nutrients: [
                // Required — always have a value
                { nutrientName: "Energy",            value: Number(data.calories),      unitName: "kcal" },
                { nutrientName: "Protein",           value: Number(data.protein),       unitName: "g" },
                { nutrientName: "Carbohydrates",     value: Number(data.carbohydrates), unitName: "g" },
                { nutrientName: "Total lipid (fat)", value: Number(data.fat),           unitName: "g" },
                // Optional — sent as null when left empty
                { nutrientName: "Total Sugars",         value: data.sugars        !== "" && data.sugars        != null ? Number(data.sugars)        : null, unitName: "g" },
                { nutrientName: "Fiber, total dietary", value: data.fiber         !== "" && data.fiber         != null ? Number(data.fiber)         : null, unitName: "g" },
                { nutrientName: "Sodium",               value: data.sodium        !== "" && data.sodium        != null ? Number(data.sodium)        : null, unitName: "mg" },
                { nutrientName: "Saturated Fat",        value: data.saturatedFat  !== "" && data.saturatedFat  != null ? Number(data.saturatedFat)  : null, unitName: "g" },
                { nutrientName: "Unsaturated Fat",      value: data.unsaturatedFat !== "" && data.unsaturatedFat != null ? Number(data.unsaturatedFat) : null, unitName: "g" },
            ],
        };

        const fd = new FormData();
        fd.append("foodItemInputDTO", new Blob([JSON.stringify(dto)], { type: "application/json" }));
        if (fileToSend) fd.append("imageFile", fileToSend);

        const res = await createFoodItemApi(fd);
        reset?.();
        return res;
    };

    useEffect(() => {
        (async () => {
            try { setFoodSourceOptions(await getMappedFoodSources()); }
            catch (e) { console.error("Failed to load food sources", e); }
        })();
    }, []);

    return { onSubmit, foodSourceOptions, foodCategoryOptions };
};