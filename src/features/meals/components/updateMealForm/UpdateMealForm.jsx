import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {UserMealsContext} from "../../../../context/UserMealsContext.jsx";
import {useMealFormData} from "../../../../hooks/useMealFormData.js";
import {buildMealFormData} from "../../utils/helpers/buildMealFormData.js";
import {updateMealApi} from "../../../../services/apiService.js";
import {refreshMealsList} from "../../../../utils/helpers/refreshMealsList.js";
import {handleApiError} from "../../../../utils/helpers/handleApiError.js";
import CreateMealMealIngredients from "../createMealMealIngredients/CreateMealMealIngredients.jsx";
import CreateMealDropdowns from "../createMealDropdowns/MealDropdowns.jsx";
import MealImageUploader from "../createMealForm/mealImageUploader/MealImageUploader.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import {mealSchema} from "../../../../utils/valadition/validationSchemas.js";

export default function UpdateMealForm() {
    const { mealId } = useParams();
    const navigate = useNavigate();
    const { fetchUserMealsData } = useContext(UserMealsContext);
    const [successMessage, setSuccessMessage] = useState("");
    const [formImageFile, setFormImageFile] = useState(null);

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(mealSchema),
        defaultValues: {},
    });

    const { loading, imageUrl, setImageUrl } = useMealFormData(mealId, reset);

    // watch voor ingredienten
    const mealIngredients = watch("mealIngredients") || [];
    const hasIngredient = mealIngredients.some(
        (ing) => ing.foodItemId?.toString().trim() !== ""
    );

    const onSubmit = async (data) => {
        try {
            const mealDataToUpdate = {
                ...data,
                mealTypes: (data.mealTypes || []).map((t) => t.value || t),
                cuisines: (data.cuisines || []).map((c) => c.value || c),
                diets: (data.diets || []).map((d) => d.value || d),
            };
            const formData = await buildMealFormData(
                mealDataToUpdate,
                null,
                formImageFile,
                imageUrl
            );
            const responseData = await updateMealApi(mealId, formData);
            setSuccessMessage(`Meal updated: ${responseData.name}`);
            await refreshMealsList(fetchUserMealsData);
            setTimeout(() => navigate(`/meal/${responseData.id}`), 1500);
        } catch (err) {
            handleApiError(err);
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
            <CustomTypography as="h2" variant="h1">
                Update Your Meal
            </CustomTypography>

            {successMessage && (
                <ErrorDialog
                    open
                    onClose={() => setSuccessMessage("")}
                    message={successMessage}
                    type="success"
                />
            )}

            <CustomTextField
                label="Meal Name"
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
                onImageChange={(image, type) => {
                    if (type === "uploaded" || type === "captured") {
                        setFormImageFile(image);
                        setValue("imageFile", image);
                        setValue("imageUrl", "");
                    } else if (type === "url") {
                        setFormImageFile(null);
                        setImageUrl(image);
                        setValue("imageFile", "");
                        setValue("imageUrl", image);
                    } else {
                        setFormImageFile(null);
                        setImageUrl("");
                        setValue("imageFile", "");
                        setValue("imageUrl", "");
                    }
                }}
                errors={errors}
                register={register}
            />

            <CustomButton
                type="submit"
                className="bg-primary text-white font-bold px-4 py-2 mt-4 self-stretch disabled:opacity-50"
                disabled={!(isValid && hasIngredient)}
            >
                Update Meal
            </CustomButton>
        </CustomBox>
    );
}
