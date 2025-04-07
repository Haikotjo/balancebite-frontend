import { useState, useEffect } from "react";
import { Box, Button, Alert } from "@mui/material";
import FloatingLabelSelect from "../floatingLabelSelect/FloatingLabelSelectIngredient.jsx";
import { getAccessToken } from "../../utils/helpers/getAccessToken.js";
import { handleApiError } from "../../utils/helpers/handleApiError.js";
import { getAllMealsApi, deleteMealApi } from "../../services/apiService.js";

const DeleteMealForm = () => {
    const [meals, setMeals] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const token = getAccessToken();
                const response = await getAllMealsApi(token);
                const enriched = response.map(meal => ({
                    value: meal.id,
                    label: `${meal.name} (Created by: ${meal.createdBy?.email || 'unknown'}, Added by: ${meal.adjustedBy?.email || 'unknown'}) - ${meal.userCount ?? 0} users`,
                    id: meal.id
                }));
                setMeals(enriched);
            } catch (error) {
                handleApiError(error);
            }
        };
        fetchMeals();
    }, []);

    const handleDelete = async () => {
        try {
            const token = getAccessToken();
            await deleteMealApi(selectedMeal.id, token);
            setSuccess(`Meal "${selectedMeal.label}" deleted.`);
            setSelectedMeal(null);
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <Box>
            <FloatingLabelSelect
                label="Select meal by name"
                isMulti={false}
                options={meals}
                value={selectedMeal}
                onChange={(val) => setSelectedMeal(val)}
            />

            <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                disabled={!selectedMeal}
                sx={{
                    mt: 2,
                    fontSize: "0.8rem",
                    color: "text.light",
                    fontWeight: "bold",
                    marginBottom: "20px",
                }}
            >
                Delete Meal
            </Button>

            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </Box>
    );
};

export default DeleteMealForm;
