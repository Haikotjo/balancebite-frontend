import { useEffect, useState } from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";

/**
 * MealList component to display a list of meals.
 * @param {String} endpoint - The API endpoint for fetching the list of meals.
 * @param {Function} setCreatedByName - Callback to set the creator's name (optional).
 */
function MealList({ endpoint, setCreatedByName }) {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            console.log(`Fetching meals from ${endpoint}`);
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
                const headers = { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) };

                const response = await fetch(endpoint, { headers });
                if (!response.ok) throw new Error(`Failed to fetch meals: ${response.statusText}`);
                const data = await response.json();

                setMeals(data);
                console.log(`Fetched ${data.length} meals:`, data.map((meal) => meal.id));

                if (data.length > 0 && setCreatedByName) {
                    setCreatedByName(data[0].createdBy?.userName || "Unknown User");
                }
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, [endpoint, setCreatedByName]);

    if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh"><CircularProgress /></Box>;
    if (error) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh"><Typography color="error">Error: {error}</Typography></Box>;
    if (meals.length === 0) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh"><Typography>No meals found.</Typography></Box>;

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
