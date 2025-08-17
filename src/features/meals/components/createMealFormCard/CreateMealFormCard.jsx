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
 * RHF + yup + useCreateMeal. Live preview for file OR URL.
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
            imageFile: "", // will hold a File
            imageUrl: "",  // will hold a string
        },
    });

    // Submit + image handling from domain hook
    const { onSubmit, handleImageChange, imageUrl: hookImageUrl, renderDialogs } = useCreateMeal();

    // Track current image values in RHF
    const fileValue = watch("imageFile");
    const urlValue = (watch("imageUrl") || hookImageUrl || "").trim();

    // Normalize possible inputs (File or FileList)
    const fileCandidate = useMemo(() => {
        if (!fileValue) return null;
        if (fileValue instanceof File) return fileValue;
        if (Array.isArray(fileValue) && fileValue[0] instanceof File) return fileValue[0];
        // Some uploaders pass FileList
        if (typeof FileList !== "undefined" && fileValue instanceof FileList && fileValue.length > 0) {
            return fileValue[0];
        }
        return null;
    }, [fileValue]);

    // Compute preview from file (object URL) or URL string
    const previewSrc = useMemo(() => {
        if (fileCandidate) return URL.createObjectURL(fileCandidate);
        if (urlValue) return urlValue;
        return null;
    }, [fileCandidate, urlValue]);

    // Revoke object URL when it changes/unmounts
    useEffect(() => {
        if (!fileCandidate) return;
        const objUrl = URL.createObjectURL(fileCandidate);
        return () => URL.revokeObjectURL(objUrl);
    }, [fileCandidate]);

    // Derived state for enabling submit
    const mealIngredients = watch("mealIngredients") || [];
    const hasIngredient = mealIngredients.some(
        (ing) => ing?.foodItemId && String(ing.foodItemId).trim() !== ""
    );

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            className="hidden md:flex max-w-4xl w-full mx-auto bg-cardLight dark:bg-cardDark rounded-xl shadow-md overflow-hidden border border-border"
        >
            {/* Left: image/media column with live preview */}
            <CustomBox className="lg:w-[50%] w-[48%] min-h-[320px] relative">
                {previewSrc ? (
                    <CustomImage src={previewSrc} alt="Meal preview" className="w-full h-full object-cover" />
                ) : (
                    <CustomBox className="w-full h-full bg-base-200 flex items-center justify-center p-3">
                        <span className="text-sm text-muted-foreground">No image selected</span>
                    </CustomBox>
                )}

                {/* Hidden fields so RHF always tracks current values */}
                <input type="hidden" {...register("imageFile")} />
                <input type="hidden" {...register("imageUrl")} />

                {/* Uploader overlay (top-right) */}
                <CustomBox className="absolute top-2 right-2 bg-base-100/80 dark:bg-base-900/80 backdrop-blur rounded-md p-2">
                    <MealImageUploader
                        imageUrl={urlValue}
                        onImageChange={(image, type) => {
                            // Update app/domain state
                            handleImageChange(image, type, setValue);

                            // Ensure RHF state stays in sync for preview + validation
                            if (type === "file") {
                                // If uploader passed FileList, pick first File
                                const file =
                                    image instanceof FileList ? (image.length > 0 ? image[0] : "") : image;
                                setValue("imageFile", file || "", { shouldDirty: true, shouldValidate: true });
                                // Optionally clear URL to avoid ambiguity
                                setValue("imageUrl", "", { shouldDirty: true, shouldValidate: true });
                            } else if (type === "url") {
                                setValue("imageUrl", image || "", { shouldDirty: true, shouldValidate: true });
                                // Clear file if switching to URL
                                setValue("imageFile", "", { shouldDirty: true, shouldValidate: true });
                            }
                        }}
                        errors={errors}
                        register={register}
                    />
                </CustomBox>
            </CustomBox>

            {/* Right: content column */}
            <CustomBox className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col">
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
                            <CreateMealMealIngredients value={value} onChange={onChange} errors={errors.mealIngredients} />
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
                    <CustomButton type="submit" className="bg-primary text-white" disabled={!(isValid && hasIngredient)}>
                        Upload Meal
                    </CustomButton>
                </div>
            </CustomBox>
        </CustomBox>
    );
};

export default CreateMealFormCard;
