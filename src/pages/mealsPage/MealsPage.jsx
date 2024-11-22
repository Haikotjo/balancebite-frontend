import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MealList from "../../components/mealList/MealList.jsx";
import { Box, Typography } from "@mui/material";

function MealPage() {
    const { userId } = useParams();
    const [userName, setUserName] = useState(null); // Voor de naam van de gebruiker

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                padding: 2,
            }}
        >
            <Typography variant="h3" gutterBottom>
                All Meals
            </Typography>
            {userId && userName && (
                <Typography variant="body1" sx={{ fontStyle: "italic", marginBottom: 2 }}>
                    {userName} created and added
                </Typography>
            )}
            <MealList setCreatedByName={setUserName} />
        </Box>
    );
}

export default MealPage;
