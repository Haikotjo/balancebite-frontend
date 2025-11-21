// src/features/meals/components/createMealForm/CreateMealForm.jsx
// Create meal with preview modal.
// When submitted in preview mode:
// - We create the meal on the backend and receive MealDTO (with id)
// - Open a modal that shows the created meal
// - "Create" button: just closes the modal (meal remains)
// - "Cancel" button: calls cancelMealApi to hard-delete the meal, then closes the modal

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MealImageUploader from "./mealImageUploader/MealImageUploader.jsx";
import CreateMealMealIngredients from "../createMealMealIngredients/CreateMealMealIngredients.jsx";
import CreateMealDropdowns from "../createMealDropdowns/MealDropdowns.jsx";

import { useCreateMeal } from "../../../../hooks/useCreateMeal.js";
import { useModal } from "../../../../context/useModal.js";

import { cancelMealApi } from "../../../../services/apiService.js";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";

import { mealSchema } from "../../../../utils/valadition/validationSchemas.js";
import { Soup } from "lucide-react";
import MealModal from "../mealModal/MealModal.jsx";

const CreateMealForm = () => {
    const [cameraError] = useState(null);

    // Form setup
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
            videoUrl: "",
            sourceUrl:"",
            preparationVideoUrl: "",
            mealPreparation: "",
        },
    });

    const mealIngredients = watch("mealIngredients") || [];
    const hasIngredient = mealIngredients.some(
        (ing) => ing.foodItemId && ing.foodItemId.toString().trim() !== ""
    );

    // IMPORTANT:
    // useCreateMeal must support { preview: true } and return created MealDTO instead of navigating.
    const { onSubmit, handleImageChange, imageUrl, renderDialogs } = useCreateMeal({ preview: true });

    const { openModal } = useModal();
    const navigate = useNavigate();

    // Submit -> create -> open preview modal
    const submitAndPreview = async (values) => {
        // onSubmit returns created MealDTO when preview=true
        const createdMeal = await onSubmit(values);
        if (!createdMeal?.id) return;

        const token = localStorage.getItem("accessToken");

        openModal(
            <MealModal
                meal={createdMeal}
                mode="preview" // MealModal shows Create/Cancel buttons when mode="preview"
                onCancel={async (meal) => {
                    // Always hard-delete the previewed meal if user cancels
                    await cancelMealApi(meal.id, token);
                }}
                onConfirm={(meal) => {
                    navigate(`/meal/${meal.id}`);
                }}
            />
        );
    };

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(submitAndPreview)}
            className="w-full max-w-[720px] mx-auto self-center pb-16 px-2 flex flex-col gap-2 mb-4"
        >
            {/* Header */}
            <CustomBox className="flex flex-col items-center gap-3 mb-2">
                <Soup className="w-16 h-16 sm:w-24 sm:h-24 text-primary" />
                <CustomTypography as="h2" variant="h1" className="text-center">
                    Create Meal
                </CustomTypography>
            </CustomBox>

            {cameraError && (
                <ErrorDialog open onClose={() => {}} message={cameraError} type="error" />
            )}

            {renderDialogs()}

            {/* Name */}
            <CustomTextField
                label="Meal Name"
                name="name"
                placeholder="Meal name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
            />

            {/* Ingredients */}
            <Controller
                name="mealIngredients"
                control={control}
                defaultValue={[{ foodItemId: "", quantity: 0 }]}
                render={({ field: { onChange, value } }) => (
                    <>
                        <CreateMealMealIngredients value={value} onChange={onChange} errors={errors.mealIngredients} />
                        {errors.mealIngredients?.message && (
                            <CustomTypography
                                as="p"
                                variant="small"
                                className="text-error mt-1"
                            >
                                {errors.mealIngredients.message}
                            </CustomTypography>
                        )}
                    </>
                )}
            />

            {/* Description */}
            <CustomTextField
                label="Meal Description"
                name="mealDescription"
                placeholder="Enter a description and or short preparation details (optional)"
                {...register("mealDescription")}
                error={!!errors.mealDescription}
                helperText={errors.mealDescription?.message}
                multiline
                variant="outlined"
                rows={6}
                maxLength={1000}
            />

            <CustomTextField
                label="Preparation Video URL"
                name="preparationVideoUrl"
                placeholder="Link to a preparation video (e.g. YouTube) (optional)"
                {...register("preparationVideoUrl")}
                error={!!errors.preparationVideoUrl}
                helperText={errors.preparationVideoUrl?.message}
            />

            <CustomTextField
                label="Preparation (long text)"
                name="mealPreparation"
                placeholder="Step-by-step instructions… (optional)"
                {...register("mealPreparation")}
                error={!!errors.mealPreparation}
                helperText={errors.mealPreparation?.message}
                multiline
                variant="outlined"
                rows={8}
                maxLength={2000}
            />

            {/* Dropdowns (mealTypes, cuisines, diets, preparationTime) */}
            <CreateMealDropdowns control={control} errors={errors} />

            {/* Image uploader */}
            <MealImageUploader
                imageUrl={imageUrl}
                onImageChange={(image, type) => handleImageChange(image, type, setValue)}
                errors={errors}
            />

            <CustomTextField
                label="Video URL"
                name="videoUrl"
                placeholder="Link to a video of the meal (e.g. YouTube, Instagram, etc.) (optional)"
                {...register("videoUrl")}
                error={!!errors.videoUrl}
                helperText={errors.videoUrl?.message}
            />

            <CustomTextField
                label="Source URL"
                name="sourceUrl"
                placeholder="Original recipe source link (e.g. Allerhande, Foodies, personal blog) (optional)"
                {...register("sourceUrl")}
                error={!!errors.sourceUrl}
                helperText={errors.sourceUrl?.message}
            />

            {/* Submit */}
            <CustomButton
                type="submit"
                variant="solid"
                color="primary"
                className="px-4 py-2 mt-6 self-stretch"
                disabled={!(isValid && hasIngredient)}
            >
                <CustomTypography
                    as="span"
                    variant="h5"
                    font="sans"
                    weight="bold"
                    color="text-white"
                >
                    Preview meal
                </CustomTypography>
            </CustomButton>

        </CustomBox>
    );
};

export default CreateMealForm;
