import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Validation schema using Yup
const schema = yup.object().shape({
    name: yup
        .string()
        .required("The name of the meal cannot be blank.")
        .max(100, "The name of the meal must not exceed 100 characters."),
    mealIngredients: yup
        .array()
        .of(
            yup.object().shape({
                foodItemId: yup
                    .number()
                    .required("Food Item ID is required.")
                    .positive("Food Item ID must be greater than zero."),
                quantity: yup
                    .number()
                    .nullable()
                    .typeError("Quantity must be a number.")
                    .min(0, "Quantity must be zero or greater."),
            })
        )
        .min(1, "The meal must contain at least one ingredient."),
    mealDescription: yup
        .string()
        .max(1000, "The meal description must not exceed 1000 characters."),
    image: yup
        .mixed()
        .test(
            "fileSize",
            "Image size must not exceed 500 KB.",
            (value) => !value || value.size <= 500000
        )
        .test(
            "fileType",
            "Unsupported file format. Please upload a valid image.",
            (value) =>
                !value ||
                ["image/jpeg", "image/png", "image/gif"].includes(value.type)
        ),
    imageUrl: yup
        .string()
        .url("Invalid URL format.")
        .max(500, "The image URL must not exceed 500 characters."),
});

const CreateMealForm = () => {
    const [useImageUpload, setUseImageUpload] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const isTokenExpired = (token) => {
        const decodedToken = jwtDecode(token);
        return decodedToken.exp * 1000 < Date.now();
    };

    const createMeal = async (data, headers) => {
        const url = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CREATE_MEAL_ENDPOINT}`;
        return axios.post(url, data, { headers });
    };

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                throw new Error("No access token available.");
            }

            if (isTokenExpired(token)) {
                throw new Error("Token has expired. Refreshing...");
            }

            const decodedToken = jwtDecode(token);
            console.log("Decoded token:", decodedToken);

            const formattedData = {
                name: data.name,
                mealDescription: data.mealDescription,
                mealIngredients: data.mealIngredients.map((ingredient) => ({
                    foodItemId: parseInt(ingredient.foodItemId, 10),
                    quantity: parseFloat(ingredient.quantity),
                })),
                image: data.image || null,
                imageUrl: data.imageUrl || null,
            };

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const response = await createMeal(formattedData, headers);

            setSuccessMessage("Meal created successfully!");
            console.log("Created Meal:", response.data);

            navigate(`/meals/${decodedToken.userId || null}`);
        } catch (error) {
            if (error.response) {
                console.error("API Error:", error.response.data);
                alert(`Error: ${error.response.data.error || "Something went wrong"}`);
            } else if (error.request) {
                console.error("Network Error:", error.request);
                alert("Network error. Please try again later.");
            } else {
                console.error("Error:", error.message);
                alert("An unexpected error occurred.");
            }
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
                                    mb: 1, // Add a small margin between ingredients
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
            </Box>

            <Button type="submit" variant="contained" color="primary">
                Create Meal
            </Button>
        </Box>
    );
};

export default CreateMealForm;