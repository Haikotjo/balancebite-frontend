// src/components/createMealForm/CreateMealForm.jsx
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createMealSchema } from "../../utils/valadition/validationSchemas.js";
import { createMealApi } from "../../services/apiService.js";
import { getAccessToken } from "../../utils/helpers/getAccessToken.js";
import { buildMealFormData } from "../../utils/helpers/buildMealFormData.js";
import { handleApiError } from "../../utils/helpers/handleApiError.js";
import { refreshMealsList } from "../../utils/helpers/refreshMealsList.js";
import { UserMealsContext } from "../../context/UserMealsContext";

import CustomTextField from "../layout/CustomTextField.jsx";
import CreateMealMealIngredients from "../createMealMealIngredients/CreateMealMealIngredients.jsx";
import CreateMealDropdowns from "../createMealDropdowns/MealDropdowns.jsx";
import MealImageUploader from "../createMealForm/mealImageUploader/MealImageUploader.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";
import CustomButton from "../layout/CustomButton.jsx";

/**
 * Component for creating a new meal.
 * Structure and styling mirror UpdateMealForm exactly.
 */
const CreateMealForm = () => {
    const navigate = useNavigate();
    const { fetchUserMealsData } = useContext(UserMealsContext);

    const [successMessage, setSuccessMessage] = useState("");
    const [capturedImage, setCapturedImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [cameraError] = useState(null);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
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
            imageUrl: ""
        },
    });

    const onSubmit = async (data) => {
        try {
            const token = getAccessToken();

            const mealData = {
                ...data,
                mealTypes: (data.mealTypes || []).map((t) => t.value || t),
                cuisines: (data.cuisines || []).map((c) => c.value || c),
                diets: (data.diets || []).map((d) => d.value || d),
            };

            const formData = await buildMealFormData(
                mealData,
                capturedImage,
                uploadedImage,
                imageUrl
            );
            const response = await createMealApi(formData, token);

            setSuccessMessage(`Meal created: ${response.name || "Unknown meal"}`);
            await refreshMealsList(fetchUserMealsData);
            navigate(`/meal/${response.id}`);
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full p-2 flex flex-col gap-2 my-4"
        >
            <CustomTypography as="h2" variant="h1" className="text-left">
                Create Your Meal
            </CustomTypography>

            {successMessage && (
                <ErrorDialog
                    open={!!successMessage}
                    onClose={() => setSuccessMessage("")}
                    message={successMessage}
                    type="success"
                />
            )}
            {cameraError && (
                <ErrorDialog
                    open={!!cameraError}
                    onClose={() => {}}
                    message={cameraError}
                    type="error"
                />
            )}

            <CustomTextField
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

            <CustomTextField
                label="Meal Description"
                name="mealDescription"
                register={register}
                error={errors.mealDescription}
                helperText={errors.mealDescription?.message}
                multiline
                rows={6}
            />

            <CreateMealDropdowns control={control} errors={errors} />

            <MealImageUploader
                imageUrl={imageUrl}
                onImageChange={(image, type) => {
                    if (type === "uploaded" || type === "captured") {
                        setCapturedImage(image);
                        setUploadedImage(type === "uploaded" ? image : null);
                        setImageUrl("");
                        setValue("imageFile", image);
                        setValue("imageUrl", "");
                    } else if (type === "url") {
                        setCapturedImage(null);
                        setUploadedImage(null);
                        setImageUrl(image);
                        setValue("imageUrl", image);
                        setValue("imageFile", "");
                    } else if (type === "reset") {
                        // reset na delete
                        setCapturedImage(null);
                        setUploadedImage(null);
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
                className="bg-primary text-white font-bold px-4 py-2 mt-4 self-stretch"
            >
                Upload Meal
            </CustomButton>
        </CustomBox>
    );
};

export default CreateMealForm;
