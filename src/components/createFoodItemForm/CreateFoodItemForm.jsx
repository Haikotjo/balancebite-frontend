import CustomFloatingSelect from "../layout/CustomFloatingSelect.jsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { foodItemSchema } from "../../utils/valadition/validationSchemas.js"
import CustomTextField from "../layout/CustomTextField.jsx";
import { useCreateFoodItem } from "../../hooks/useCreateFoodItem.js";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomButton from "../layout/CustomButton.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";

const CreateFoodItemForm = () => {

    // Initialize the form using react-hook-form with validation via yup
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(foodItemSchema), // Validation schema
        defaultValues: {
            portionDescription: "Standard portion (100 gram)",
            gramWeight: 100,
            foodSource: "",
        },
        shouldUnregister: true, // Unregister fields when they are removed from the form
    });

    // Retrieve onSubmit handler, foodSourceOptions, successMessage and setSuccessMessage from the hook
    const { onSubmit, foodSourceOptions, successMessage, setSuccessMessage } = useCreateFoodItem(reset);

    return (
        <CustomBox
            as="form"
            className="w-full mx-auto p-2 flex flex-col gap-2 mt-4 mb-12 sm:mb-4 scroll-smooth"
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* CustomTypography is used to display the heading */}
            <CustomTypography as="h4" className="text-2xl font-bold text-left mt-6">
                Create Food Item
            </CustomTypography>

            {/* ErrorDialog will show a success message when the form is submitted */}
            <ErrorDialog
                open={!!successMessage} // Shows the dialog if a success message exists
                onClose={() => setSuccessMessage("")} // Close dialog and reset success message
                message={successMessage}
                type="success"
            />

            {/* Custom input fields with validation errors */}
            <CustomTextField
                label="Name"
                register={register}
                name="name"
                error={errors.name}
                helperText={errors.name?.message}
                placeholder="Enter the food item name"
            />

            <CustomTextField
                label="Portion Description"
                placeholder="e.g. One slice (35g)"
                register={register}
                name="portionDescription"
                error={errors.portionDescription}
                helperText={errors.portionDescription?.message}
                onFocus={(e) => e.target.select()} // Auto select the text when the input is focused
            />

            <CustomTextField
                label="Portion Size (grams, used for '1 portion' in description)"
                placeholder="e.g. 100"
                register={register}
                name="gramWeight"
                error={errors.gramWeight}
                helperText={errors.gramWeight?.message}
                type="text"
                step="any"
                onFocus={(e) => e.target.select()} // Auto select the text when the input is focused
            />

            {/* Custom select dropdown for predefined food sources */}
            <CustomFloatingSelect
                label="Select source"
                options={foodSourceOptions} // Options for the dropdown
                value={
                    watch("foodSource") // Watch the form value for foodSource
                        ? foodSourceOptions.find(opt => opt.value === watch("foodSource"))
                        : null
                }
                onChange={(val) => setValue("foodSource", val?.value || "")} // Set the value on change
                placeholder="Select predefined food source (e.g. Albert Heijn"
            />

            <CustomTextField
                label="Source URL (product page)"
                register={register}
                name="source"
                error={errors.source}
                helperText={errors.source?.message}
                placeholder="https://www.example.com/product"
            />

            <CustomTextField
                label="Calories (kcal per 100g)"
                register={register}
                name="calories"
                error={errors.calories}
                helperText={errors.calories?.message}
                type="text"
                step="any"
                placeholder="e.g. 250 (per 100g)"
            />

            <CustomTextField
                label="Protein (g per 100g)"
                register={register}
                name="protein"
                error={errors.protein}
                helperText={errors.protein?.message}
                type="text"
                step="any"
                placeholder="e.g. 20 (per 100g)"
            />

            <CustomTextField
                label="Carbohydrates (g per 100g)"
                register={register}
                name="carbohydrates"
                error={errors.carbohydrates}
                helperText={errors.carbohydrates?.message}
                type="text"
                step="any"
                placeholder="e.g. 20 (per 100g)"
            />

            <CustomTextField
                label="Fat (g per 100g)"
                register={register}
                name="fat"
                error={errors.fat}
                helperText={errors.fat?.message}
                type="text"
                step="any"
                placeholder="e.g. 10 (per 100g)"
            />

            {/* CustomButton used to submit the form */}
            <CustomButton
                type="submit"
                className="text-sm px-4 py-2 text-white bg-primary rounded-md mb-5 mt-4 hover:bg-primary/90"
            >
                Create Food Item
            </CustomButton>
        </CustomBox>
    );
};

export default CreateFoodItemForm;
