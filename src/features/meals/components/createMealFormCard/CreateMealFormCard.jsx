// CreateMealFormCard.jsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MealImageUploader from "./mealImageUploader/MealImageUploader.jsx";
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

/**
 * Card-style Create Meal form for desktop (≥ md), matching MealCard look.
 * Uses the same RHF + yup + useCreateMeal flow as CreateMealForm.
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
    const { onSubmit, handleImageChange, imageUrl, renderDialogs } = useCreateMeal();

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            // Mirror MealCard shell on desktop
            className="hidden md:flex max-w-4xl w-full mx-auto bg-cardLight dark:bg-cardDark rounded-xl shadow-md overflow-hidden border border-border"
        >
            {/* Left: image/media column */}
            <CustomBox className="lg:w-[50%] w-[48%] min-h-[320px] bg-base-200 flex items-center justify-center p-3">
                <MealImageUploader
                    imageUrl={imageUrl}
                    onImageChange={(image, type) => handleImageChange(image, type, setValue)}
                    errors={errors}
                    register={register}
                />
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
