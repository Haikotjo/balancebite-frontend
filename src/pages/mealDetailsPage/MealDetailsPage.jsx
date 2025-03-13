import { Container, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMealById } from "../../services/apiService.js";
import { useTheme } from "@mui/material/styles";
import MealCardLarge from "../../components/mealCardLarge/MealCardLarge";

const MealDetailsPage = () => {
    const { mealId } = useParams();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme(); // Access the theme to dynamically style components

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const data = await fetchMealById(mealId);
                console.log(data); // Log only the fetched meal object
                setMeal(data);
            } catch (error) {
                console.error("Failed to fetch meal details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeal();
    }, [mealId]);

    if (loading) {
        return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    }

    if (!meal) {
        return <Typography variant="h6" align="center" mt={4}>Meal not found</Typography>;
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <MealCardLarge meal={meal} />
        </Container>
    );
};

export default MealDetailsPage;
