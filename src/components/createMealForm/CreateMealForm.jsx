import { useState, useContext } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Camera from "../camera/Camera.jsx";
import { createMealSchema } from "../../utils/valadition/validationSchemas.js";
import { createMealApi } from "../../services/apiService.js";
import { getAccessToken } from "../../utils/helpers/getAccessToken.js";
import { buildMealFormData } from "../../utils/helpers/buildMealFormData.js";
import { handleApiError } from "../../utils/helpers/handleApiError.js";
import { UserMealsContext } from "../../context/UserMealsContext"; // Import de UserMealsContext

const CreateMealForm = () => {
    const [useImageUpload, setUseImageUpload] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [cameraError, setCameraError] = useState(null);
    const navigate = useNavigate();

    const { fetchUserMealsData } = useContext(UserMealsContext); // Haal de functie op om de mealslist te verversen

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
            const formData = await buildMealFormData(data, capturedImage);

            // Stuur de API-aanroep
            const response = await createMealApi(formData, token);
            setSuccessMessage("Meal created successfully!");
            console.log("Created Meal:", response);

            // Ververs de meal-lijst
            await fetchUserMealsData();

            // Navigeer naar de meals pagina
            navigate(`/meals/${jwtDecode(token).userId || null}`);
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: "auto",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                "@media (max-width:600px)": {
                    padding: 1,
                },
            }}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Typography variant="h4" align="center">
                Create a New Meal
            </Typography>

            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {cameraError && <Alert severity="error">{cameraError}</Alert>}

            <TextField
                label="Meal Name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
            />

            <Controller
                name="mealIngredients"
                control={control}
                defaultValue={[{ foodItemId: "", quantity: 0 }]}
                render={({ field: { onChange, value } }) => (
                    <Box>
                        <Typography>Ingredients</Typography>
                        {value.map((ingredient, index) => (
                            <Box
                                key={index}
                                display="flex"
                                gap={2}
                                alignItems="center"
                                sx={{
                                    flexWrap: "wrap",
                                    mb: 1,
                                    "@media (max-width:600px)": {
                                        flexDirection: "column",
                                    },
                                }}
                            >
                                <TextField
                                    label="Food Item ID"
                                    value={ingredient.foodItemId}
                                    onChange={(e) => {
                                        const newIngredients = [...value];
                                        newIngredients[index].foodItemId = e.target.value;
                                        onChange(newIngredients);
                                    }}
                                    error={!!errors.mealIngredients?.[index]?.foodItemId}
                                    helperText={
                                        errors.mealIngredients?.[index]?.foodItemId?.message || ""
                                    }
                                    type="number"
                                    sx={{ flex: 2, minWidth: "60%" }}
                                />
                                <TextField
                                    label="Quantity (grams)"
                                    value={ingredient.quantity}
                                    onChange={(e) => {
                                        const newIngredients = [...value];
                                        newIngredients[index].quantity = Math.max(0, e.target.value);
                                        onChange(newIngredients);
                                    }}
                                    error={!!errors.mealIngredients?.[index]?.quantity}
                                    helperText={
                                        errors.mealIngredients?.[index]?.quantity?.message || ""
                                    }
                                    type="number"
                                    sx={{ flex: 1, minWidth: "20%" }}
                                />
                                <Button
                                    onClick={() => {
                                        const newIngredients = value.filter(
                                            (_, i) => i !== index
                                        );
                                        onChange(newIngredients);
                                    }}
                                >
                                    Remove
                                </Button>
                            </Box>
                        ))}
                        <Button
                            onClick={() =>
                                onChange([...value, { foodItemId: "", quantity: 0 }])
                            }
                            sx={{ marginTop: 1 }}
                        >
                            Add Ingredient
                        </Button>
                    </Box>
                )}
            />

            <TextField
                label="Meal Description"
                multiline
                rows={4}
                {...register("mealDescription")}
                error={!!errors.mealDescription}
                helperText={errors.mealDescription?.message}
                fullWidth
            />

            <Box>
                <Typography>Meal Image</Typography>
                <Button
                    variant="contained"
                    onClick={() => setUseImageUpload(!useImageUpload)}
                    sx={{ marginBottom: 2 }}
                >
                    {useImageUpload ? "Use Image URL" : "Upload Image"}
                </Button>
                {useImageUpload ? (
                    <>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            onChange={(e) => {
                                if (e.target.files.length > 0) {
                                    const file = e.target.files[0];
                                    console.log("Selected file:", file);
                                }
                            }}
                        />
                        {errors.image && (
                            <Typography color="error">
                                {errors.image.message}
                            </Typography>
                        )}
                    </>
                ) : (
                    <TextField
                        label="Image URL"
                        {...register("imageUrl")}
                        error={!!errors.imageUrl}
                        helperText={errors.imageUrl?.message}
                        fullWidth
                    />
                )}

                <Camera
                    onCapture={(image) => setCapturedImage(image)}
                />
                {capturedImage && (
                    <img
                        src={capturedImage}
                        alt="Captured"
                        style={{ maxWidth: "100%", marginTop: "10px" }}
                    />
                )}
            </Box>

            <Button type="submit" variant="contained" color="primary">
                Create Meal
            </Button>
        </Box>
    );
};

export default CreateMealForm;
