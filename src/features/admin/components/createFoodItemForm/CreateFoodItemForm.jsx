import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { foodItemSchema } from "../../../../utils/valadition/validationSchemas.js";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import { useCreateFoodItem } from "../../../../hooks/useCreateFoodItem.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import { useFormMessages } from "../../../../hooks/useFormMessages.jsx";
import {getReadableApiError} from "../../../../utils/helpers/getReadableApiError.js";

const CreateFoodItemForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(foodItemSchema),
        defaultValues: {
            portionDescription: "Standard portion (100 gram)",
            gramWeight: 100,
            foodSource: "",
        },
        shouldUnregister: true,
    });

    const { setError, setSuccess, clear, renderDialogs } = useFormMessages();
    const { onSubmit: createFoodItem, foodSourceOptions,foodCategoryOptions } = useCreateFoodItem(reset);

    const onSubmit = async (data) => {
        clear();
        try {
            const res = await createFoodItem(data);
            setSuccess(`Food item created: ${res.name || "Unknown"}`);
        } catch (err) {
            setError(getReadableApiError(err));
        }
    };


    return (
        <CustomBox
            as="form"
            className="w-full mx-auto p-2 flex flex-col gap-2 mt-4 mb-12 sm:mb-4 scroll-smooth"
            onSubmit={handleSubmit(onSubmit)}
        >
            <CustomTypography as="h4" className="text-2xl font-bold text-left mt-6">
                Create Food Item
            </CustomTypography>

            {renderDialogs()}

            <CustomTextField
                label="Name"
                name="name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                placeholder="Enter the food item name"
            />

            <CustomTextField
                label="Portion Description"
                name="portionDescription"
                {...register("portionDescription")}
                error={!!errors.portionDescription}
                helperText={errors.portionDescription?.message}
                placeholder="e.g. One slice (35g)"
                onFocus={(e) => e.target.select()}
            />

            <CustomTextField
                label="Portion Size (grams)"
                name="gramWeight"
                {...register("gramWeight")}
                error={!!errors.gramWeight}
                helperText={errors.gramWeight?.message}
                placeholder="e.g. 100"
                type="text"
                step="any"
                onFocus={(e) => e.target.select()}
            />


            <CustomFloatingSelect
                label="Select source"
                options={foodSourceOptions}
                value={
                    watch("foodSource")
                        ? foodSourceOptions.find(opt => opt.value === watch("foodSource"))
                        : null
                }
                onChange={(val) => setValue("foodSource", val?.value || "")}
                placeholder="Select predefined food source"
            />

            <CustomTextField
                label="Source URL"
                name="source"
                {...register("source")}
                error={!!errors.source}
                helperText={errors.source?.message}
                placeholder="https://www.example.com/product"
            />

            <CustomFloatingSelect
                label="Select category"
                options={foodCategoryOptions}
                value={
                    watch("foodCategory")
                        ? foodCategoryOptions.find(opt => opt.value === watch("foodCategory"))
                        : null
                }
                onChange={(val) => setValue("foodCategory", val?.value || "")}
                placeholder="Select food category"
            />


            <CustomTextField
                label="Calories (kcal per 100g)"
                name="calories"
                {...register("calories")}
                error={!!errors.calories}
                helperText={errors.calories?.message}
                type="text"
                step="any"
                placeholder="e.g. 250"
            />

            <CustomTextField
                label="Protein (g per 100g)"
                name="protein"
                {...register("protein")}
                error={!!errors.protein}
                helperText={errors.protein?.message}
                type="text"
                step="any"
                placeholder="e.g. 20"
            />

            <CustomTextField
                label="Carbohydrates (g per 100g)"
                name="carbohydrates"
                {...register("carbohydrates")}
                error={!!errors.carbohydrates}
                helperText={errors.carbohydrates?.message}
                type="text"
                step="any"
                placeholder="e.g. 20"
            />

            <CustomTextField
                label="Sugars (g per 100g)"
                name="sugars"
                {...register("sugars")}
                error={!!errors.sugars}
                helperText={errors.sugars?.message}
                type="text"
                step="any"
                placeholder="e.g. 15"
            />

            <CustomTextField
                label="Fat (g per 100g)"
                name="fat"
                {...register("fat")}
                error={!!errors.fat}
                helperText={errors.fat?.message}
                type="text"
                step="any"
                placeholder="e.g. 10"
            />

            <CustomTextField
                label="Saturated Fat (g per 100g)"
                name="saturatedFat"
                {...register("saturatedFat")}
                error={!!errors.saturatedFat}
                helperText={errors.saturatedFat?.message}
                type="text"
                step="any"
                placeholder="e.g. 3"
            />

            <CustomTextField
                label="Unsaturated Fat (g per 100g)"
                name="unsaturatedFat"
                {...register("unsaturatedFat")}
                error={!!errors.unsaturatedFat}
                helperText={errors.unsaturatedFat?.message}
                type="text"
                step="any"
                placeholder="e.g. 4"
            />


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
