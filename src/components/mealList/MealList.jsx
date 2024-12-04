import React, { useEffect, useState } from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Grid2 } from "@mui/material";
import { useParams } from "react-router-dom";

function MealList({ setCreatedByName }) {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        // Kies de juiste endpoint op basis van userId
        const endpoint = "http://localhost:8080/meals";


        fetch(endpoint)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch meals: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setMeals(data);
                setError(null);

                // Als er meals zijn, haal de naam van de gebruiker op
                if (data.length > 0 && setCreatedByName) {
                    setCreatedByName(data[0].createdBy?.userName || "Unknown User");
                }
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId, setCreatedByName]); // Voeg userId en setCreatedByName toe als dependencies

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
