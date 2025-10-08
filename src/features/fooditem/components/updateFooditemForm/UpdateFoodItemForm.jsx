// src/features/ingredients/components/updateFoodItemForm/UpdateFoodItemForm.jsx
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import CustomCheckbox from "../../../../components/layout/CustomCheckbox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import MealImageUploader from "../../../meals/components/createMealForm/mealImageUploader/MealImageUploader.jsx";

import { foodItemSchema } from "../../../../utils/valadition/validationSchemas.js";
import { getReadableApiError } from "../../../../utils/helpers/getReadableApiError.js";
import { useFormMessages } from "../../../../hooks/useFormMessages.jsx";
import { getFoodItemById, updateFoodItemApi, getMappedFoodSources } from "../../../../services/apiService.js";
import { foodCategoryOptions } from "../../../../utils/const/foodCategoryOptions.js";

const pickNutrient = (nutrients, name) => {
    if (!Array.isArray(nutrients)) return "";
    const hit = nutrients.find((n) => n?.nutrientName === name);
    return hit?.value ?? "";
};

const buildNutrientsFromFields = (values) => {
    const entries = [
        { nutrientName: "Energy", value: values.calories, unitName: "kcal" },
        { nutrientName: "Protein", value: values.protein, unitName: "g" },
        { nutrientName: "Carbohydrates", value: values.carbohydrates, unitName: "g" },
        { nutrientName: "Total Sugars", value: values.sugars, unitName: "g" },
        { nutrientName: "Total lipid (fat)", value: values.fat, unitName: "g" },
        { nutrientName: "Saturated Fat", value: values.saturatedFat, unitName: "g" },
        { nutrientName: "Unsaturated Fat", value: values.unsaturatedFat, unitName: "g" },
    ];
    return entries
        .filter((e) => e.value !== "" && e.value !== null && e.value !== undefined)
        .map((e) => ({ nutrientName: e.nutrientName, unitName: e.unitName, value: Number(e.value) }));
};

const UpdateFoodItemForm = ({ foodItemId }) => {
    // Prefer explicit prop; fallback to route :id
    const { id: routeId } = useParams();
    const effectiveId = String(foodItemId ?? routeId ?? "");

    // Debug: tel renders + toon id
    const renderCount = useRef(0);
    renderCount.current += 1;
    console.debug("[UpdateFoodItemForm] render#", renderCount.current, { effectiveId });

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [foodSourceOptions, setFoodSourceOptions] = useState([]);

    const { setError, setSuccess, renderDialogs } = useFormMessages();

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(foodItemSchema),
        defaultValues: {
            name: "",
            portionDescription: "Standard portion (100 gram)",
            gramWeight: 100,
            source: "",
            foodSource: "",
            foodCategory: "",
            storeBrand: false,
            price: "",
            grams: "",
            imageFile: "",
            imageUrl: "",
            calories: "",
            protein: "",
            carbohydrates: "",
            sugars: "",
            fat: "",
            saturatedFat: "",
            unsaturatedFat: "",
        },
    });

    // Load sources once
    useEffect(() => {
        (async () => {
            try {
                const opts = await getMappedFoodSources();
                console.debug("[UpdateFoodItemForm] sources loaded", opts?.length ?? 0);
                setFoodSourceOptions(opts || []);
            } catch (e) {
                console.warn("[UpdateFoodItemForm] failed to load sources", e);
                setFoodSourceOptions([]);
            }
        })();
    }, []);

    // Fetch & prefill when we have an ID  (!!! geen setError in deps !!!)
    useEffect(() => {
        let isActive = true;

        const load = async () => {
            if (!effectiveId) {
                console.debug("[UpdateFoodItemForm] skip load: no effectiveId");
                return;
            }
            console.debug("[UpdateFoodItemForm] start load", { effectiveId });
            setLoading(true);
            try {
                const item = await getFoodItemById(effectiveId);
                if (!isActive) return;
                console.debug("[UpdateFoodItemForm] fetched item", item?.id);

                reset({
                    name: item?.name ?? "",
                    portionDescription: item?.portionDescription ?? "Standard portion (100 gram)",
                    gramWeight: item?.gramWeight ?? 100,
                    source: item?.source ?? "",
                    foodSource: item?.foodSource ?? "",
                    foodCategory: item?.foodCategory ?? "",
                    storeBrand: !!item?.storeBrand,
                    price: item?.price ?? "",
                    grams: item?.grams ?? "",
                    imageFile: "",
                    imageUrl: item?.imageUrl ?? "",
                    calories: pickNutrient(item?.nutrients, "Energy"),
                    protein: pickNutrient(item?.nutrients, "Protein"),
                    carbohydrates: pickNutrient(item?.nutrients, "Carbohydrates"),
                    sugars: pickNutrient(item?.nutrients, "Total Sugars"),
                    fat: pickNutrient(item?.nutrients, "Total lipid (fat)"),
                    saturatedFat: pickNutrient(item?.nutrients, "Saturated Fat"),
                    unsaturatedFat: pickNutrient(item?.nutrients, "Unsaturated Fat"),
                });

                setImageUrl(item?.imageUrl ?? "");
                setImageFile(null);
                console.debug("[UpdateFoodItemForm] form reset done");
            } catch (err) {
                console.error("[UpdateFoodItemForm] load error", err);
                setError(getReadableApiError(err) || "Failed to load food item.");
            } finally {
                if (isActive) setLoading(false);
                console.debug("[UpdateFoodItemForm] load finished");
            }
        };

        load();
        return () => {
            isActive = false;
        };
        // ONLY these deps → voorkomt loop
    }, [effectiveId, reset]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSubmit = async (values) => {
        try {
            console.debug("[UpdateFoodItemForm] submitting for", effectiveId, values);
            const dto = {
                name: values.name,
                fdcId: undefined,
                portionDescription: values.portionDescription,
                gramWeight: values.gramWeight !== "" ? Number(values.gramWeight) : null,
                source: values.source,
                foodSource: values.foodSource || "",
                foodCategory: values.foodCategory || "",
                storeBrand: !!values.storeBrand,
                price: values.price !== "" ? Number(values.price) : null,
                grams: values.grams !== "" ? Number(values.grams) : null,
                imageUrl: imageFile ? "" : (imageUrl || ""),
                nutrients: buildNutrientsFromFields(values),
            };

            const updated = await updateFoodItemApi(effectiveId, dto, imageFile);
            console.debug("[UpdateFoodItemForm] updated response", updated);
            setSuccess(`Food item updated: ${updated?.name ?? "Unknown"}`);
            setImageUrl(updated?.imageUrl ?? imageUrl);
            setImageFile(null);
        } catch (err) {
            console.error("[UpdateFoodItemForm] submit error", err);
            setError(getReadableApiError(err));
        }
    };

    if (!effectiveId) {
        return (
            <CustomTypography as="p" className="text-center mt-4">
                Select a food item first.
            </CustomTypography>
        );
    }

    if (loading) {
        return (
            <CustomTypography as="p" className="text-center mt-4">
                Loading...
            </CustomTypography>
        );
    }

    return (
        <CustomBox as="form" onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto p-2 flex flex-col gap-2 mt-4 mb-12 sm:mb-4">
            <CustomTypography as="h2" variant="h1">
                Update Food Item
            </CustomTypography>

            {renderDialogs()}

            <CustomTextField label="Name" {...register("name")} error={!!errors.name} helperText={errors.name?.message} placeholder="Enter the food item name" />
            <CustomTextField label="Portion Description" {...register("portionDescription")} error={!!errors.portionDescription} helperText={errors.portionDescription?.message} placeholder="e.g. One slice (35g)" onFocus={(e) => e.target.select()} />
            <CustomTextField label="Portion Size (grams)" {...register("gramWeight")} error={!!errors.gramWeight} helperText={errors.gramWeight?.message} placeholder="e.g. 100" type="text" step="any" onFocus={(e) => e.target.select()} />

            <CustomFloatingSelect
                label="Select source"
                options={foodSourceOptions}
                value={watch("foodSource") ? foodSourceOptions.find((opt) => opt.value === watch("foodSource")) : null}
                onChange={(val) => setValue("foodSource", val?.value || "")}
                placeholder="Select predefined food source"
            />

            <CustomTextField label="Source URL" {...register("source")} error={!!errors.source} helperText={errors.source?.message} placeholder="https://www.example.com/product" />

            <CustomFloatingSelect
                label="Select category"
                options={foodCategoryOptions}
                value={watch("foodCategory") ? foodCategoryOptions.find((opt) => opt.value === watch("foodCategory")) : null}
                onChange={(val) => setValue("foodCategory", val?.value || "")}
                placeholder="Select food category"
            />

            <CustomTextField label="Price (€)" {...register("price")} error={!!errors.price} helperText={errors.price?.message} type="text" step="any" placeholder="Price (€) e.g. 2.49" />
            <CustomTextField label="Package Grams" {...register("grams")} error={!!errors.grams} helperText={errors.grams?.message} type="text" step="any" placeholder="Package Grams e.g. 500" />

            <MealImageUploader
                errors={errors}
                imageUrl={imageUrl}
                onImageChange={(image, type) => {
                    if (type === "uploaded" || type === "captured") {
                        setImageFile(image);
                        setValue("imageFile", image);
                        setValue("imageUrl", "");
                        setImageUrl("");
                    } else if (type === "url") {
                        setImageFile(null);
                        setValue("imageFile", "");
                        setValue("imageUrl", image);
                        setImageUrl(image);
                    } else {
                        setImageFile(null);
                        setValue("imageFile", "");
                        setValue("imageUrl", "");
                        setImageUrl("");
                    }
                }}
            />

            <Controller
                name="storeBrand"
                control={control}
                defaultValue={false}
                render={({ field: { value, onChange } }) => (
                    <CustomCheckbox id="storeBrand" label="Storebrand" checked={!!value} onChange={() => onChange(!value)} />
                )}
            />

            <CustomTextField label="Calories (kcal per 100g)" {...register("calories")} error={!!errors.calories} helperText={errors.calories?.message} type="text" step="any" placeholder="Calories (kcal per 100g) e.g. 250" />
            <CustomTextField label="Protein (g per 100g)" {...register("protein")} error={!!errors.protein} helperText={errors.protein?.message} type="text" step="any" placeholder="Protein (g per 100g) e.g. 20" />
            <CustomTextField label="Carbohydrates (g per 100g)" {...register("carbohydrates")} error={!!errors.carbohydrates} helperText={errors.carbohydrates?.message} type="text" step="any" placeholder="Carbohydrates (g per 100g) e.g. 20" />
            <CustomTextField label="Sugars (g per 100g)" {...register("sugars")} error={!!errors.sugars} helperText={errors.sugars?.message} type="text" step="any" placeholder="Sugars (g per 100g) e.g. 15" />
            <CustomTextField label="Fat (g per 100g)" {...register("fat")} error={!!errors.fat} helperText={errors.fat?.message} type="text" step="any" placeholder="Fat (g per 100g) e.g. 10" />
            <CustomTextField label="Saturated Fat (g per 100g)" {...register("saturatedFat")} error={!!errors.saturatedFat} helperText={errors.saturatedFat?.message} type="text" step="any" placeholder="Saturated Fat (g per 100g) e.g. 3" />
            <CustomTextField label="Unsaturated Fat (g per 100g)" {...register("unsaturatedFat")} error={!!errors.unsaturatedFat} helperText={errors.unsaturatedFat?.message} type="text" step="any" placeholder="Unsaturated Fat (g per 100g) e.g. 4" />

            <CustomButton type="submit" className="text-sm px-4 py-2 text-white bg-primary rounded-md mb-5 mt-4 hover:bg-primary/90">
                Update Food Item
            </CustomButton>
        </CustomBox>
    );
};

UpdateFoodItemForm.propTypes = {
    foodItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default UpdateFoodItemForm;
