import { Box, Button, Typography, Alert } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { createMealSchema } from "../../utils/valadition/validationSchemas.js";
import { createMealApi } from "../../services/apiService.js";
import { getAccessToken } from "../../utils/helpers/getAccessToken.js";
import { buildMealFormData } from "../../utils/helpers/buildMealFormData.js";
import { handleApiError } from "../../utils/helpers/handleApiError.js";
import { UserMealsContext } from "../../context/UserMealsContext";
import { refreshMealsList } from "../../utils/helpers/refreshMealsList.js";
import MealImageUploader from "./mealImageUploader/MealImageUploader.jsx";
import MealIngredients from "./mealIngredients/MealIngredients.jsx";
import TextFieldCreateMeal from "../textFieldCreateMeal/TextFieldCreateMeal.jsx";
import MealDropdowns from "./MealDropdowns.jsx";
import {useContext, useState} from "react";

const CreateMealForm = () => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
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

    const onSubmit = async (data) => {
        try {
            const token = getAccessToken();
            // Gebruik de userId eventueel nog voor andere doeleinden, maar voor navigatie gebruiken we het meal id.
            const userId = jwtDecode(token).sub || null;
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
            // Navigeer naar de pagina van de maaltijd op basis van het id uit de respons
            navigate(`/meal/${response.id}`);
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                // Breedte wordt bepaald door de wrapper (PageWrapper) die een maxWidth van 600px heeft.
                margin: "auto",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Typography variant="h4" align="left">
                Upload Your Meal
            </Typography>

            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {cameraError && <Alert severity="error">{cameraError}</Alert>}

            <TextFieldCreateMeal
                label="Meal Name"
                register={register}
                name="name"
                error={errors.name}
                helperText={errors.name?.message}
            />

            <Controller
                name="mealIngredients"
                control={control}
                defaultValue={[{ foodItemId: "", quantity: 0 }, { foodItemId: "", quantity: 0 }]}
                render={({ field: { onChange, value } }) => (
                    <MealIngredients
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

            <MealDropdowns control={control} errors={errors} />

            <MealImageUploader
                onImageChange={(image, type) => {
                    if (type === "captured") setCapturedImage(image);
                    else if (type === "uploaded") setUploadedImage(image);
                    else if (type === "url") setImageUrl(image);
                }}
                errors={errors}
                register={register}
            />

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
        </Box>
    );
};

export default CreateMealForm;
