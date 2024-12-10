import { useEffect, useState, useContext } from "react";
import { fetchMeals } from "../../services/apiService.js";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { UserMealsContext } from "../../context/UserMealsContext";

function MealList({ endpoint, setCreatedByName }) {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userMeals } = useContext(UserMealsContext); // Haal userMeals uit context

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const mealsData = await fetchMeals(endpoint);
                setMeals(mealsData);

                if (mealsData.length > 0 && setCreatedByName) {
                    const createdBy = mealsData[0]?.createdBy?.userName || "Unknown User";
                    setCreatedByName(createdBy);
                }

                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData().catch((err) => console.error("Unhandled error in fetchData:", err));
    }, [endpoint, setCreatedByName]);

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    if (error)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    if (meals.length === 0)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography>No meals found.</Typography>
            </Box>
        );

    return (
        <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={2}
            padding={2}
        >
            {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
            ))}
        </Box>
    );
}

MealList.propTypes = {
    endpoint: PropTypes.string.isRequired,
    setCreatedByName: PropTypes.func,
};

export default MealList;
