import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createMealSchema } from "../../utils/valadition/validationSchemas.js";
import { buildMealFormData } from "../../utils/helpers/buildMealFormData.js";
import { handleApiError } from "../../utils/helpers/handleApiError.js";
import { updateMealApi } from "../../services/apiService.js";
import { refreshMealsList } from "../../utils/helpers/refreshMealsList.js";
import { UserMealsContext } from "../../context/UserMealsContext";
import { useMealFormData } from "../../hooks/useMealFormData.js";
import TextFieldCreateMeal from "../textFieldCreateMeal/TextFieldCreateMeal.jsx";
import MealImageUploader from "../createMealForm/mealImageUploader/MealImageUploader.jsx";
import CreateMealDropdowns from "../createMealDropdowns/MealDropdowns.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";
import CreateMealMealIngredients from "../createMealMealIngredients/CreateMealMealIngredients.jsx";
import CustomButton from "../layout/CustomButton.jsx";

/**
 * Form component for updating an existing meal.
 * Handles data population, form submission and image upload.
 */
const UpdateMealForm = () => {
    const { mealId } = useParams();
    const [successMessage, setSuccessMessage] = useState("");
    const [formImageFile, setFormImageFile] = useState(null);
    const navigate = useNavigate();
    const { fetchUserMealsData } = useContext(UserMealsContext);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(createMealSchema),
        defaultValues: {},
    });

    const { loading, imageUrl, setImageUrl } = useMealFormData(mealId, reset);

    /**
     * Handles form submission by preparing data and sending API request.
     * @param {Object} data - Form data submitted by user
     */
    const onSubmit = async (data) => {
        try {
            const mealDataToUpdate = {
                ...data,
                mealTypes: (data.mealTypes || []).map((type) => type.value || type),
                cuisines: (data.cuisines || []).map((cuisine) => cuisine.value || cuisine),
                diets: (data.diets || []).map((diet) => diet.value || diet),
            };

            const formData = await buildMealFormData(mealDataToUpdate, null, formImageFile, imageUrl);
            const responseData = await updateMealApi(mealId, formData);

            setSuccessMessage(`Meal updated: ${responseData.name || "Unknown meal"}`);
            await refreshMealsList(fetchUserMealsData);
            setTimeout(() => {
                navigate(`/meal/${responseData.id}`);
            }, 1500);
        } catch (error) {
            handleApiError(error);
        }
    };

    if (loading) {
        return (
            <CustomTypography as="p" className="text-center mt-4">
                Loading...
            </CustomTypography>
        );
    }

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full p-2 flex flex-col gap-2 my-4"
        >
            <CustomTypography as="h2" variant="h1" className="text-left">
            Update Your Meal
            </CustomTypography>

            {successMessage && (
                <ErrorDialog
                    open={!!successMessage}
                    onClose={() => setSuccessMessage("")}
                    message={successMessage}
                    type="success"
                />
            )}

            <TextFieldCreateMeal
                label="Meal Name"
                name="name"
                register={register}
                error={errors.name}
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

            <TextFieldCreateMeal
                label="Meal Description"
                register={register}
                name="mealDescription"
                error={errors.mealDescription}
                helperText={errors.mealDescription?.message}
                multiline
                rows={4}
            />

            <CreateMealDropdowns control={control} errors={errors} />

            <MealImageUploader
                imageUrl={imageUrl}
                onImageChange={(image, type) => {
                    if (type === "uploaded" || type === "captured") {
                        setFormImageFile(image);
                        setImageUrl("");
                    } else if (type === "url") {
                        setFormImageFile(null);
                        setImageUrl(image);
                    }
                }}
                errors={errors}
                register={register}
            />

            <CustomButton
                type="submit"
                className="bg-primary text-white font-bold px-4 py-2 mt-4 self-stretch"
            >
                Update Meal
            </CustomButton>
        </CustomBox>
    );
};

export default UpdateMealForm;
