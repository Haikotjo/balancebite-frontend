import { Box, Button, Typography, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { foodItemSchema } from "../../utils/valadition/validationSchemas.js"
import TextFieldCreateMeal from "../textFieldCreateMeal/TextFieldCreateMeal";
import { createFoodItemApi } from "../../services/apiService";
import { getAccessToken } from "../../utils/helpers/getAccessToken";
import { handleApiError } from "../../utils/helpers/handleApiError";

const CreateFoodItemForm = () => {
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(foodItemSchema),
        defaultValues: {
            portionDescription: "Standard portion (100 gram)",
            gramWeight: 100,
        },
    });

    const onSubmit = async (data) => {
        try {
            const token = getAccessToken();

            const payload = {
                name: data.name,
                gramWeight: parseFloat(data.gramWeight),
                portionDescription: data.portionDescription,
                source: data.source,
                nutrients: [
                    { nutrientName: "Energy", value: parseFloat(data.calories), unitName: "kcal", nutrientId: 1008 },
                    { nutrientName: "Protein", value: parseFloat(data.protein), unitName: "g", nutrientId: 1003 },
                    { nutrientName: "Carbohydrates", value: parseFloat(data.carbohydrates), unitName: "g", nutrientId: 1005 },
                    { nutrientName: "Total lipid (fat)", value: parseFloat(data.fat), unitName: "g", nutrientId: 1004 },
                ],
            };

            const response = await createFoodItemApi(payload, token);
            setSuccessMessage(`Food item created: ${response.name || "Unknown"}`);
        } catch (error) {
            console.error("[FoodItem Creation Error]", error);
            handleApiError(error);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
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
                Create Food Item
            </Typography>

            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <TextFieldCreateMeal label="Name" register={register} name="name" error={errors.name} helperText={errors.name?.message} />
            <TextFieldCreateMeal label="Portion Description" register={register} name="portionDescription" error={errors.portionDescription} helperText={errors.portionDescription?.message} />
            <TextFieldCreateMeal label="Gram Weight" register={register} name="gramWeight" error={errors.gramWeight} helperText={errors.gramWeight?.message} type="number" />
            <TextFieldCreateMeal label="Source (e.g. Albert Heijn)" register={register} name="source" error={errors.source} helperText={errors.source?.message} />

            <TextFieldCreateMeal label="Calories (kcal)" register={register} name="calories" error={errors.calories} helperText={errors.calories?.message} type="number" />
            <TextFieldCreateMeal label="Protein (g)" register={register} name="protein" error={errors.protein} helperText={errors.protein?.message} type="number" />
            <TextFieldCreateMeal label="Carbohydrates (g)" register={register} name="carbohydrates" error={errors.carbohydrates} helperText={errors.carbohydrates?.message} type="number" />
            <TextFieldCreateMeal label="Fat (g)" register={register} name="fat" error={errors.fat} helperText={errors.fat?.message} type="number" />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    fontSize: "0.8rem",
                    padding: "10px 16px",
                    color: "text.light",
                    fontWeight: "bold",
                    marginBottom: "20px",
                }}
            >
                Create Food Item
            </Button>
        </Box>
    );
};

export default CreateFoodItemForm;
