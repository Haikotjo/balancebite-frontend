import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import MealImageUploader from "./mealImageUploader/MealImageUploader.jsx";
import CreateMealMealIngredients from "../createMealMealIngredients/CreateMealMealIngredients.jsx";
import CreateMealDropdowns from "../createMealDropdowns/MealDropdowns.jsx";
import {useCreateMeal} from "../../../../hooks/useCreateMeal.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import {mealSchema} from "../../../../utils/valadition/validationSchemas.js";

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
        resolver: yupResolver(mealSchema ),
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
            className="w-full pb-16 px-2 flex flex-col gap-2 mb-4"
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
                placeholder="Enter meal name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
            />

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
                            <p className="text-error text-sm mt-1">
                                {errors.mealIngredients.message}
                            </p>
                        )}
                    </>
                )}
            />


            <CustomTextField
                label="Meal Description"
                name="mealDescription"
                placeholder="Enter a description or preparation details"
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
