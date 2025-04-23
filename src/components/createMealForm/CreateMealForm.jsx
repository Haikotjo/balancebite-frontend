import {Box, Button, Typography, Alert} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { createMealSchema } from "../../utils/valadition/validationSchemas.js";
import { createMealApi } from "../../services/apiService.js";
import { getAccessToken } from "../../utils/helpers/getAccessToken.js";
import { buildMealFormData } from "../../utils/helpers/buildMealFormData.js";
import { handleApiError } from "../../utils/helpers/handleApiError.js";
import { refreshMealsList } from "../../utils/helpers/refreshMealsList.js";
import { UserMealsContext } from "../../context/UserMealsContext";

import MealImageUploader from "./mealImageUploader/MealImageUploader.jsx";
import TextFieldCreateMeal from "../textFieldCreateMeal/TextFieldCreateMeal.jsx";
import CreateMealDropdowns from "../createMealDropdowns/MealDropdowns.jsx";
import CreateMealMealIngredients from "../createMealMealIngredients/CreateMealMealIngredients.jsx";
import CustomBox from "../layout/CustomBox.jsx";


/**
 * Component for creating a new meal.
 * Handles form input, image upload, and API submission.
 */
const CreateMealForm = () => {
    const [capturedImage, setCapturedImage] = useState(null); // Image taken from camera
    const [uploadedImage, setUploadedImage] = useState(null); // Image selected from file input
    const [imageUrl, setImageUrl] = useState("");             // Image URL (external)
    const [successMessage, setSuccessMessage] = useState("");
    const [cameraError] = useState(null);
    const navigate = useNavigate();
    const { fetchUserMealsData } = useContext(UserMealsContext);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(createMealSchema),
    });

    /**
     * Handles the form submission and sends data to the backend.
     * @param {Object} data - Form values.
     */
    const onSubmit = async (data) => {
        try {
            const token = getAccessToken();

            const mealData = {
                ...data,
                mealTypes: (data.mealTypes || []).map((type) => type.value || type),
                cuisines: (data.cuisines || []).map((cuisine) => cuisine.value || cuisine),
                diets: (data.diets || []).map((diet) => diet.value || diet),
            };

            const formData = await buildMealFormData(mealData, capturedImage, uploadedImage, imageUrl);
            const response = await createMealApi(formData, token);

            setSuccessMessage(`Meal created: ${response.name || "Unknown meal"}`);
            await refreshMealsList(fetchUserMealsData);
            navigate(`/meal/${response.id}`);
        } catch (error) {
            console.error("[Meal Creation Error]", error);
            handleApiError(error);
        }
    };

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full p-2 flex flex-col gap-2 my-4"
        >
            <Typography variant="h4" align="left">
                Upload Your Meal
            </Typography>

            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {cameraError && <Alert severity="error">{cameraError}</Alert>}

            {/* Input for meal name */}
            <TextFieldCreateMeal
                label="Meal Name"
                register={register}
                name="name"
                error={errors.name}
                helperText={errors.name?.message}
            />

            {/* Dynamic list of ingredients */}
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

            {/* Text area for meal description */}
            <TextFieldCreateMeal
                label="Meal Description"
                register={register}
                name="mealDescription"
                error={errors.mealDescription}
                helperText={errors.mealDescription?.message}
                multiline
                rows={4}
            />

            {/* Select dropdowns for meal type, cuisine, and diet */}
            <CreateMealDropdowns control={control} errors={errors} />

            {/* Image uploader/capture/url handler */}
            <MealImageUploader
                onImageChange={(image, type) => {
                    if (type === "captured") setCapturedImage(image);
                    else if (type === "uploaded") setUploadedImage(image);
                    else if (type === "url") setImageUrl(image);
                }}
                errors={errors}
                register={register}
            />

            {/* Submit button */}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    fontSize: "0.9rem",
                    padding: "10px 16px",
                    color: "text.light",
                    fontWeight: "bold",
                    marginBottom: "20px",
                }}
            >
                Upload Meal
            </Button>
        </CustomBox>
    );
};

export default CreateMealForm;
