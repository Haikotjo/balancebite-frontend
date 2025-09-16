// useCreateFoodItem.js
import { useEffect, useState } from "react";
import { createFoodItemApi, getMappedFoodSources } from "../services/apiService";
import { foodCategoryOptions } from "../utils/const/foodCategoryOptions.js";

// Convert a base64 data URL into a File
const dataUrlToFile = (dataUrl, filename = "image.jpg") => {
    const [hdr, b64] = dataUrl.split(",");
    const mime = (hdr.match(/:(.*?);/)?.[1]) || "image/jpeg";
    const bin = atob(b64);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return new File([u8], filename, { type: mime });
};

export const useCreateFoodItem = (reset) => {
    const [foodSourceOptions, setFoodSourceOptions] = useState([]);
    const [capturedImage, setCapturedImage] = useState(null);  // camera: base64 string
    const [uploadedImage, setUploadedImage] = useState(null);  // upload: File or base64
    const [imageUrl, setImageUrl] = useState("");              // direct URL

    // Same contract as meals’ hook
    const handleImageChange = (image, type, setValue) => {
        if (type === "uploaded" || type === "captured") {
            setCapturedImage(type === "captured" ? image : null);
            setUploadedImage(type === "uploaded" ? image : null);
            setImageUrl("");
            setValue?.("imageFile", image);
            setValue?.("imageUrl", "");
        } else if (type === "url") {
            setCapturedImage(null);
            setUploadedImage(null);
            setImageUrl(image);
            setValue?.("imageUrl", image);
            setValue?.("imageFile", "");
        } else if (type === "reset") {
            setCapturedImage(null);
            setUploadedImage(null);
            setImageUrl("");
            setValue?.("imageFile", "");
            setValue?.("imageUrl", "");
        }
    };

    const onSubmit = async (data) => {
        // naam + bron suffix
        const formattedFoodSource = data.foodSource
            ? ` (${data.foodSource.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())})`
            : "";
        const fullName = `${data.name}${formattedFoodSource}`;

        // JSON payload (exact 1 imagebron: URL óf file)
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
            imageUrl: imageUrl || null, // wordt op nul gezet als we een file meesturen
            image: null,                // geen base64 opslaan als we file uploaden
            nutrients: [
                { nutrientName: "Energy", value: data.calories ? parseFloat(data.calories) : null, unitName: "kcal", nutrientId: 1008 },
                { nutrientName: "Protein", value: data.protein ? parseFloat(data.protein) : null, unitName: "g", nutrientId: 1003 },
                { nutrientName: "Carbohydrates", value: data.carbohydrates ? parseFloat(data.carbohydrates) : null, unitName: "g", nutrientId: 1005 },
                { nutrientName: "Sugars, total", value: data.sugars ? parseFloat(data.sugars) : null, unitName: "g", nutrientId: 2000 },
                { nutrientName: "Total lipid (fat)", value: data.fat ? parseFloat(data.fat) : null, unitName: "g", nutrientId: 1004 },
                { nutrientName: "Fatty acids, total saturated", value: data.saturatedFat ? parseFloat(data.saturatedFat) : null, unitName: "g", nutrientId: 1258 },
                { nutrientName: "Fatty acids, total unsaturated", value: data.unsaturatedFat ? parseFloat(data.unsaturatedFat) : null, unitName: "g", nutrientId: 1999 },
            ],
        };

        // Bepaal fileToSend (upload File, upload base64, of camera base64)
        let fileToSend = null;
        if (uploadedImage instanceof File) {
            fileToSend = uploadedImage;
        } else if (typeof uploadedImage === "string" && uploadedImage.startsWith("data:")) {
            fileToSend = dataUrlToFile(uploadedImage, "upload.jpg");
        } else if (typeof capturedImage === "string" && capturedImage.startsWith("data:")) {
            fileToSend = dataUrlToFile(capturedImage, "camera.jpg");
        }

        if (fileToSend) {
            dto.imageUrl = null; // file heeft voorrang
            dto.image = null;
        }

        // FormData bouwen (exact dezelfde keys als meals, maar JSON key is foodItemInputDTO)
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

    return { onSubmit, handleImageChange, imageUrl, foodSourceOptions, foodCategoryOptions };
};
