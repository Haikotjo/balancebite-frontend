import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MealList from "../../components/mealList/MealList.jsx";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function MealPage() {
    const { userId } = useParams();
    const [userName, setUserName] = useState(null); // Voor de naam van de gebruiker
    const navigate = useNavigate(); // Gebruik de navigate functie om terug te navigeren

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
                <>
                    <Typography variant="body1" sx={{ fontStyle: "italic", marginBottom: 2 }}>
                        {userName} created and added
                    </Typography>
                    <MuiLink
                        component="button"
                        underline="hover"
                        onClick={() => navigate("/meals")} // Navigeer naar de lijst met alle maaltijden
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.9rem", // Kleinere tekst
                            color: "text.secondary",
                            cursor: "pointer",
                            "&:hover": {
                                color: "text.primary", // Kleur veranderen bij hover
                            },
                        }}
                    >
                        <ArrowBackIcon sx={{ fontSize: "1rem", marginRight: 0.5 }} /> {/* Klein pijltje */}
                        Back to All Meals
                    </MuiLink>
                </>
            )}
            <MealList setCreatedByName={setUserName} />
        </Box>
    );
}

export default MealPage;
