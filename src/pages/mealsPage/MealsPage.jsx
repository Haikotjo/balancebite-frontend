import React from "react";
import MealList from "../../components/mealList/MealList.jsx";
import { Box, Typography } from "@mui/material";

function MealPage() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column", // Zorgt dat de items onder elkaar staan
                justifyContent: "center", // Centreer verticaal
                alignItems: "center", // Centreer horizontaal
                minHeight: "100vh", // Volledige hoogte van de viewport
                padding: 2, // Optionele padding voor wat ruimte
            }}
        >
            <Typography variant="h3" gutterBottom>
                All Meals
            </Typography>
            <MealList />
        </Box>
    );
}

export default MealPage;
