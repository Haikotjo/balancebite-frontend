import React, { useEffect, useState } from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Grid2 } from "@mui/material";

function MealList() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch alle maaltijden van de API
        fetch("http://localhost:8080/meals")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch meals");
                }
                return response.json();
            })
            .then((data) => {
                setMeals(data);
                setError(null);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

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
