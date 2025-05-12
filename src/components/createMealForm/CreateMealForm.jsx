import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { createMealSchema } from "../../utils/valadition/validationSchemas.js";

import MealImageUploader from "../createMealForm/mealImageUploader/MealImageUploader.jsx";
import CreateMealDropdowns from "../createMealDropdowns/MealDropdowns.jsx";
import CreateMealMealIngredients from "../createMealMealIngredients/CreateMealMealIngredients.jsx";
import CustomTextField from "../layout/CustomTextField.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";
import CustomButton from "../layout/CustomButton.jsx";
import { useCreateMeal } from "../../hooks/useCreateMeal.js";

/**
 * Component for creating a new meal.
 * Structure and styling mirror UpdateMealForm exactly.
 */
const CreateMealForm = () => {
    const [cameraError] = useState(null);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(createMealSchema),
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

    const mealIngredients = watch("mealIngredients") || [];
    const hasIngredient = mealIngredients.some(
        (ing) => ing.foodItemId && ing.foodItemId.toString().trim() !== ""
    );

    // Haal alleen op wat we nodig hebben uit de hook
    const { onSubmit, handleImageChange, imageUrl, renderDialogs } = useCreateMeal();

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full p-2 flex flex-col gap-2 my-4"
        >
            <CustomTypography as="h2" variant="h1" className="text-left">
                Create Your Meal
            </CustomTypography>

            {cameraError && (
                <ErrorDialog
                    open
                    onClose={() => {}}
                    message={cameraError}
                    type="error"
                />
            )}

            {renderDialogs()}

            <CustomTextField
                label="Meal Name"
                name="name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
            />

            <Controller
                name="mealIngredients"
                control={control}
                defaultValue={[{ foodItemId: "", quantity: 0 }]}
                render={({ field: { onChange, value } }) => (
                    <CreateMealMealIngredients
                        value={value}
                        onChange={onChange}
                        errors={errors.mealIngredients}
                    />
                )}
            />

            <CustomTextField
                label="Meal Description"
                name="mealDescription"
                {...register("mealDescription")}
                error={!!errors.mealDescription}
                helperText={errors.mealDescription?.message}
                multiline
                rows={6}
            />

            <CreateMealDropdowns control={control} errors={errors} />

            <MealImageUploader
                imageUrl={imageUrl}
                onImageChange={(image, type) => handleImageChange(image, type, setValue)}
                errors={errors}
                register={register}
            />

            <CustomButton
                type="submit"
                className="bg-primary text-white font-bold px-4 py-2 mt-4 self-stretch"
                disabled={!(isValid && hasIngredient)}
            >
                Upload Meal
            </CustomButton>
        </CustomBox>
    );
};

export default CreateMealForm;
