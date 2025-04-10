import { Box, Button, Typography, Alert } from "@mui/material";
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
import MealIngredients from "../createMealForm/mealIngredients/MealIngredients.jsx";
import MealImageUploader from "../createMealForm/mealImageUploader/MealImageUploader.jsx";
import CreateMealDropdowns from "../createMealDropdowns/MealDropdowns.jsx";

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
            navigate(`/meal/${responseData.id}`);
        } catch (error) {
            handleApiError(error);
        }
    };

    if (loading) {
        return <Typography align="center" sx={{ mt: 4 }}>Loading...</Typography>;
    }

    return (
        <Box
            sx={{
                width: "100%",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Typography variant="h4" align="left">
                Update Your Meal
            </Typography>

            {successMessage && <Alert severity="success">{successMessage}</Alert>}

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
                defaultValue={[{ foodItemId: "", quantity: 0 }]}
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
                Update Meal
            </Button>
        </Box>
    );
};

export default UpdateMealForm;
