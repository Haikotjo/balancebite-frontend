import React, { useEffect, useState } from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

/**
 * MealList component to display a list of meals.
 * Fetches meals from a specified endpoint and displays them using MealCard components.
 *
 * @param {Function} setCreatedByName - Callback to set the name of the user who created the meals.
 * @param {String} endpoint - The endpoint to fetch meals from. Defaults to all meals.
 * @param {String} cardEndpoint - The endpoint to fetch individual meal details from.
 */
function MealList({ endpoint = "http://localhost:8080/meals", cardEndpoint = "http://localhost:8080/meals", setCreatedByName }) {
    const [meals, setMeals] = useState([]); // State to store the list of meals
    const [loading, setLoading] = useState(true); // State to handle the loading status
    const [error, setError] = useState(null); // State to handle errors
    const { userId } = useParams(); // Get the userId from the URL (if applicable)

    useEffect(() => {
        console.log("Fetching meals from endpoint:", endpoint); // Log the endpoint being used

        const fetchMeals = async () => {
            try {
                setLoading(true);

                // Retrieve the access token from localStorage
                const token = localStorage.getItem("accessToken");

                // Setup headers
                const headers = {
                    "Content-Type": "application/json",
                };
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                    console.log("Using Authorization header for request.");
                } else {
                    console.log("No token found, proceeding without Authorization header.");
                }

                const response = await fetch(endpoint, { headers });

                if (!response.ok) {
                    throw new Error(`Failed to fetch meals: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Fetched meals successfully:", data); // Log the fetched meals
                setMeals(data);

                // If meals are found, set the name of the user who created the meals
                if (data.length > 0 && setCreatedByName) {
                    setCreatedByName(data[0].createdBy?.userName || "Unknown User");
                }
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error("Error fetching meals:", err.message); // Log any errors
                setError(err.message);
            } finally {
                setLoading(false); // Ensure loading state is updated
            }
        };

        fetchMeals();
    }, [endpoint, userId, setCreatedByName]); // Add dependencies to re-fetch when these change

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    if (meals.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography>No meals found.</Typography>
            </Box>
        );
    }

    return (
        <Box
            display="grid"
            gridTemplateColumns={{
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
            }}
            gap={2}
            padding={2}
        >
            {meals.map((meal) => (
                <MealCard key={meal.id} mealId={meal.id} baseEndpoint={cardEndpoint} />
            ))}
        </Box>
    );
}

export default MealList;
