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
            nutrients: [/* unchanged */],
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
