// CreateMealFormCard.jsx
import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CreateMealMealIngredients from "../createMealMealIngredients/CreateMealMealIngredients.jsx";
import CreateMealDropdowns from "../createMealDropdowns/MealDropdowns.jsx";

import { useCreateMeal } from "../../../../hooks/useCreateMeal.js";
import { mealSchema } from "../../../../utils/valadition/validationSchemas.js";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import MealImageUploader from "../createMealForm/mealImageUploader/MealImageUploader.jsx";

/**
 * Card-style Create Meal form for desktop (≥ md), matching MealCard look.
 * Uses the same RHF + yup + useCreateMeal flow as CreateMealForm.
 * Shows a live image preview (uploaded file OR typed URL) on the left.
 */
const CreateMealFormCard = () => {
    // Keep parity with existing flow
    const [cameraError] = useState(null);

    // React Hook Form with validation and defaults
    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(mealSchema),
        defaultValues: {
            name: "",
            mealDescription: "",
            mealIngredients: [{ foodItemId: "", quantity: 0 }],
            mealTypes: [],
            cuisines: [],
            diets: [],
            preparationTime: "",
            imageFile: "",
            imageUrl: "",
        },
    });

    // Derived state for enabling submit
    const mealIngredients = watch("mealIngredients") || [];
    const hasIngredient = mealIngredients.some(
        (ing) => ing.foodItemId && ing.foodItemId.toString().trim() !== ""
    );

    // Domain submit + image handling
    const { onSubmit, handleImageChange, imageUrl: hookImageUrl, renderDialogs } = useCreateMeal();

    // Watch current file/url in the form
    const fileValue = watch("imageFile");
    const urlValue = watch("imageUrl") || hookImageUrl || "";

    // Compute a safe preview source from file or url
    const previewSrc = useMemo(() => {
        // Handle File or FileList or empty
        const file = Array.isArray(fileValue) ? fileValue[0] : fileValue;
        if (file && typeof file === "object" && file instanceof File) {
            return URL.createObjectURL(file);
        }
        if (typeof urlValue === "string" && urlValue.trim() !== "") {
            return urlValue.trim();
        }
        return null;
    }, [fileValue, urlValue]);

    // Revoke object URL when it changes/unmounts (avoid memory leaks)
    useEffect(() => {
        const file = Array.isArray(fileValue) ? fileValue[0] : fileValue;
        let objUrl;
        if (file && file instanceof File) {
            objUrl = previewSrc;
        }
        return () => {
            if (objUrl) URL.revokeObjectURL(objUrl);
        };
    }, [fileValue, previewSrc]);

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            // Mirror MealCard shell on desktop
            className="hidden md:flex max-w-4xl w-full mx-auto bg-cardLight dark:bg-cardDark rounded-xl shadow-md overflow-hidden border border-border"
        >
            {/* Left: image/media column with live preview */}
            <CustomBox className="lg:w-[50%] w-[48%] min-h-[320px] relative">
                {previewSrc ? (
                    <CustomImage
                        src={previewSrc}
                        alt="Meal preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <CustomBox className="w-full h-full bg-base-200 flex items-center justify-center p-3">
                        <span className="text-sm text-muted-foreground">No image selected</span>
                    </CustomBox>
                )}

                {/* Uploader as an overlay (top-right) */}
                <CustomBox className="absolute top-2 right-2 bg-base-100/80 dark:bg-base-900/80 backdrop-blur rounded-md p-2">
                    <MealImageUploader
                        imageUrl={urlValue}
                        onImageChange={(image, type) => handleImageChange(image, type, setValue)}
                        errors={errors}
                        register={register}
                    />
                </CustomBox>
            </CustomBox>

            {/* Right: content column */}
            <CustomBox className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col">
                {/* Header */}
                <CustomTypography className="text-3xl font-bold text-primary mb-2">
                    Create Your Meal
                </CustomTypography>

                {cameraError && (
                    <ErrorDialog open onClose={() => {}} message={cameraError} type="error" />
                )}
                {renderDialogs()}

                <CustomDivider className="my-4" />

                {/* Name */}
                <CustomTextField
                    label="Meal Name"
                    name="name"
                    placeholder="Enter meal name"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

                {/* Description */}
                <CustomTextField
                    label="Meal Description"
                    name="mealDescription"
                    placeholder="Enter a description or preparation details"
                    {...register("mealDescription")}
                    error={!!errors.mealDescription}
                    helperText={errors.mealDescription?.message}
                    multiline
                    rows={6}
                    className="mt-3"
                />

                <CustomDivider className="my-4" />

                {/* Ingredients */}
                <Controller
                    name="mealIngredients"
                    control={control}
                    defaultValue={[{ foodItemId: "", quantity: 0 }]}
                    render={({ field: { onChange, value } }) => (
                        <>
                            <CreateMealMealIngredients
                                value={value}
                                onChange={onChange}
                                errors={errors.mealIngredients}
                            />
                            {errors.mealIngredients?.message && (
                                <p className="text-error text-sm mt-1">{errors.mealIngredients.message}</p>
                            )}
                        </>
                    )}
                />

                <CustomDivider className="my-4" />

                {/* Dropdowns (mealTypes, cuisines, diets, preparationTime) */}
                <CreateMealDropdowns control={control} errors={errors} />

                {/* Footer actions */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <CustomButton type="button" variant="ghost">
                        Cancel
                    </CustomButton>
                    <CustomButton
                        type="submit"
                        className="bg-primary text-white"
                        disabled={!(isValid && hasIngredient)}
                    >
                        Upload Meal
                    </CustomButton>
                </div>
            </CustomBox>
        </CustomBox>
    );
};

export default CreateMealFormCard;
