import React, { useEffect, useState } from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Grid2 } from "@mui/material";
import { useParams} from "react-router-dom";

function MealList() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        // Kies de juiste endpoint op basis van userId
        const endpoint = userId
            ? `http://localhost:8080/users/${userId}/created-meals`
            : "http://localhost:8080/meals";

        console.log("Determined endpoint:", endpoint); // Log het gekozen endpoint

        fetch(endpoint)
            .then((response) => {
                console.log("Response status:", response.status); // Log de status van de response
                if (!response.ok) {
                    throw new Error(`Failed to fetch meals: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched meals data:", data); // Log de opgehaalde data
                setMeals(data);
                setError(null);
            })
            .catch((err) => {
                console.error("Fetch error:", err.message); // Log fouten bij het ophalen
                setError(err.message);
            })
            .finally(() => {
                console.log("Fetch completed"); // Log wanneer de fetch klaar is
                setLoading(false);
            });
    }, [userId]); // Voeg userId toe als dependency


    if (loading) return <div>Loading meals...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Grid2
            container
            sx={{
                justifyContent: "center",
                padding: 2,
            }}
            spacing={2}
        >
            {meals.map((meal) => (
                <Grid2 xs={12} sm={6} md={4} lg={3} key={meal.id}>
                    <MealCard mealId={meal.id} />
                </Grid2>
            ))}
        </Grid2>
    );
}

export default MealList;
