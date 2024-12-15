import { useState, useContext } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
} from "@mui/material";
import * as Yup from "yup";
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
import {refreshMealsList} from "../../utils/helpers/refreshMealsList.js";
import MealImageUploader from "./mealImageUploader/MealImageUploader.jsx"; // Import de UserMealsContext
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import IconButton from "@mui/material/IconButton";

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
            const userId = jwtDecode(token).sub || null;
            const formData = await buildMealFormData(data, capturedImage, uploadedImage, imageUrl);
            const response = await createMealApi(formData, token);
            setSuccessMessage(`Meal created: ${response.name || "Unknown meal"}`);

            await refreshMealsList(fetchUserMealsData);

            navigate(`/meals/${userId}`);
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
            <Typography variant="h4" align="left">
                Upload Meal
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
                defaultValue={[{ foodItemId: "", quantity: 0 },
                    { foodItemId: "", quantity: 0 }]}
                render={({ field: { onChange, value } }) => (
                    <Box>
                        <Typography sx={{ fontWeight: 'bold'}}>
                            Ingredients
                        </Typography>

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
                                        newIngredients[index].foodItemId = Math.max(0, e.target.value); // Voorkom minder dan 0
                                        onChange(newIngredients);
                                    }}
                                    error={!!errors.mealIngredients?.[index]?.foodItemId}
                                    helperText={
                                        errors.mealIngredients?.[index]?.foodItemId?.message || ""
                                    }
                                    type="number"
                                    inputProps={{ min: 0 }} // HTML-validatie
                                    sx={{ flex: 2, minWidth: "60%" , marginTop: 1 }}
                                />
                                <TextField
                                    label="Quantity (grams)"
                                    value={ingredient.quantity}
                                    onChange={(e) => {
                                        const newIngredients = [...value];
                                        newIngredients[index].quantity = Math.max(0, e.target.value); // Voorkom minder dan 0
                                        onChange(newIngredients);
                                    }}
                                    error={!!errors.mealIngredients?.[index]?.quantity}
                                    helperText={
                                        errors.mealIngredients?.[index]?.quantity?.message || ""
                                    }
                                    type="number"
                                    inputProps={{ min: 0 }} // HTML-validatie
                                    sx={{ flex: 1, minWidth: "20%" }}
                                />


                                <IconButton
                                    onClick={() => {
                                        if (value.length > 2) {
                                            const newIngredients = value.filter((_, i) => i !== index);
                                            onChange(newIngredients);
                                        }
                                    }}
                                    aria-label="remove ingredient"
                                    disabled={value.length <= 2} // Disable als er 2 of minder velden zijn
                                    color={value.length > 2 ? "error" : "default"} // Rood als actief, grijs als disabled
                                >
                                    <RemoveCircleOutlineRoundedIcon />
                                </IconButton>


                                {errors.mealIngredients && (
                                    <Typography color="error" sx={{ marginTop: 1 }}>
                                        {errors.mealIngredients.message}
                                    </Typography>
                                )}

                            </Box>
                        ))}
                        <IconButton
                            onClick={() => onChange([...value, { foodItemId: '', quantity: 0 }])}
                            aria-label="add ingredient"
                            color="primary"
                            sx={{ marginTop: 1 }}
                        >
                            <AddCircleOutlineRoundedIcon />
                        </IconButton>

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

            <MealImageUploader
                onImageChange={(image, type) => {
                    if (type === "captured") setCapturedImage(image);
                    else if (type === "uploaded") setUploadedImage(image);
                    else if (type === "url") setImageUrl(image);
                }}
                errors={errors}
                register={register}
            />

            <Button type="submit" variant="contained" color="primary">
                Create Meal
            </Button>
        </Box>
    );
};

export default CreateMealForm;
