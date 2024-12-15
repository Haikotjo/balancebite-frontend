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
import Camera from "../camera/Camera.jsx";

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
    image: yup.mixed(),
    imageUrl: yup
        .string()
        .url("Invalid URL format.")
        .max(500, "The image URL must not exceed 500 characters."),
});

const CreateMealForm = () => {
    const [useImageUpload, setUseImageUpload] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [cameraError, setCameraError] = useState(null);
    const navigate = useNavigate();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const createMeal = async (formData) => {
        const url = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CREATE_MEAL_ENDPOINT}`;
        return axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
    };

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                throw new Error("No access token available.");
            }

            const formData = new FormData();

            // Append mealInputDTO as a JSON string
            const mealInputDTO = {
                name: data.name,
                mealDescription: data.mealDescription,
                mealIngredients: data.mealIngredients.map((ingredient) => ({
                    foodItemId: parseInt(ingredient.foodItemId, 10),
                    quantity: parseFloat(ingredient.quantity),
                })),
                imageUrl: data.imageUrl || null,
            };
            formData.append("mealInputDTO", JSON.stringify(mealInputDTO));

            // Append image file if available
            if (capturedImage) {
                const blob = await fetch(capturedImage).then((res) => res.blob());
                formData.append("imageFile", blob, "captured-image.jpg");
            } else if (data.image && data.image[0]) {
                formData.append("imageFile", data.image[0]);
            }

            // Send the request
            const response = await createMeal(formData);

            setSuccessMessage("Meal created successfully!");
            console.log("Created Meal:", response.data);

            navigate(`/meals/${jwtDecode(token).userId || null}`);
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
