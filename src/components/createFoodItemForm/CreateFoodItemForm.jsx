import { Box, Button, Typography, Alert } from "@mui/material";
import FloatingLabelSelect from "../layout/CustomFloatingSelect.jsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import { foodItemSchema } from "../../utils/valadition/validationSchemas.js"
import TextFieldCreateMeal from "../layout/CustomTextField.jsx";
import {createFoodItemApi, getFoodSourcesApi} from "../../services/apiService";
import { getAccessToken } from "../../utils/helpers/getAccessToken";
import { handleApiError } from "../../utils/helpers/handleApiError";

const CreateFoodItemForm = () => {
    const [successMessage, setSuccessMessage] = useState("");
    const [foodSourceOptions, setFoodSourceOptions] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(foodItemSchema),
        defaultValues: {
            portionDescription: "Standard portion (100 gram)",
            gramWeight: 100,
            foodSource: "",
        },
        shouldUnregister: true,
    });

    const onSubmit = async (data) => {
        try {
            const token = getAccessToken();
            const formattedFoodSource = data.foodSource
                ? ` (${data.foodSource
                    .replaceAll("_", " ")
                    .toLowerCase()
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")})`
                : "";
            const fullName = `${data.name}${formattedFoodSource}`;

            const payload = {
                name: fullName,
                gramWeight: parseFloat(data.gramWeight),
                portionDescription: data.portionDescription,
                source: data.source,
                foodSource: data.foodSource || null,
                nutrients: [
                    { nutrientName: "Energy", value: parseFloat(data.calories), unitName: "kcal", nutrientId: 1008 },
                    { nutrientName: "Protein", value: parseFloat(data.protein), unitName: "g", nutrientId: 1003 },
                    { nutrientName: "Carbohydrates", value: parseFloat(data.carbohydrates), unitName: "g", nutrientId: 1005 },
                    { nutrientName: "Total lipid (fat)", value: parseFloat(data.fat), unitName: "g", nutrientId: 1004 },
                ],
            };

            const response = await createFoodItemApi(payload, token);
            setSuccessMessage(`Food item created: ${response.name || "Unknown"}`);
            reset({
                name: "",
                source: "",
                foodSource: "",
                portionDescription: "Standard portion (100 gram)",
                gramWeight: 100,
                calories: "",
                protein: "",
                carbohydrates: "",
                fat: "",
            });
        } catch (error) {
            console.error("[FoodItem Creation Error]", error);
            handleApiError(error);
        }
    };

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const sources = await getFoodSourcesApi();
                const mapped = sources.map(value => ({
                    value,
                    label: value
                        .replaceAll("_", " ")
                        .toLowerCase()
                        .replace(/^\w/, c => c.toUpperCase())
                }));
                setFoodSourceOptions(mapped);
            } catch (error) {
                console.error("Failed to load food sources", error);
            }
        };

        fetchSources();
    }, []);

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

            <TextFieldCreateMeal
                label="Name"
                register={register}
                name="name"
                error={errors.name}
                helperText={errors.name?.message}
            />

            <TextFieldCreateMeal
                label="Portion Description"
                placeholder="e.g. One slice (35g)"
                register={register}
                name="portionDescription"
                error={errors.portionDescription}
                helperText={errors.portionDescription?.message}
                onFocus={(e) => e.target.select()}
            />

            <TextFieldCreateMeal
                label="Portion Size (grams, used for '1 portion' in description)"
                placeholder="e.g. 100"
                register={register}
                name="gramWeight"
                error={errors.gramWeight}
                helperText={errors.gramWeight?.message}
                type="text"
                step="any"
                onFocus={(e) => e.target.select()}
            />

            <FloatingLabelSelect
                label="Select predefined food source (e.g. Albert Heijn)"
                isMulti={false}
                isSearchable={false}
                isClearable={false}
                options={foodSourceOptions}
                value={
                    watch("foodSource")
                        ? foodSourceOptions.find(opt => opt.value === watch("foodSource"))
                        : null
                }
                onChange={(val) => setValue("foodSource", val?.value || "")}
                containerStyle={{ marginTop: "4px", width: "100%", maxWidth: "none" }}
            />

            <TextFieldCreateMeal
                label="Source URL (product page)"
                register={register}
                name="source"
                error={errors.source}
                helperText={errors.source?.message}
            />

            <TextFieldCreateMeal
                label="Calories (kcal)"
                register={register}
                name="calories"
                error={errors.calories}
                helperText={errors.calories?.message}
                type="text"
                step="any"
            />

            <TextFieldCreateMeal
                label="Protein (g)"
                register={register}
                name="protein"
                error={errors.protein}
                helperText={errors.protein?.message}
                type="text"
                step="any"
            />

            <TextFieldCreateMeal
                label="Carbohydrates (g)"
                register={register}
                name="carbohydrates"
                error={errors.carbohydrates}
                helperText={errors.carbohydrates?.message}
                type="text"
                step="any"
            />

            <TextFieldCreateMeal
                label="Fat (g)"
                register={register}
                name="fat"
                error={errors.fat}
                helperText={errors.fat?.message}
                type="text"
                step="any"
            />


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
