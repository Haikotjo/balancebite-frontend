import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MealList from "../../components/mealList/MealList.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import { Box, Typography, Link as MuiLink } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function MealPage() {
    const { userId } = useParams();
    const [userName, setUserName] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Check if a user is logged in

    // Log the user to ensure the context works
    console.log("Logged in user:", user);

    // Submenu options for logged-in users
    const submenuOptions = user ? ["All My Meals", "My Created Meals", "Suggested Meals"] : [];

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
                        onClick={() => navigate("/meals")}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.9rem",
                            color: "text.secondary",
                            cursor: "pointer",
                            "&:hover": {
                                color: "text.primary",
                            },
                        }}
                    >
                        <ArrowBackIcon sx={{ fontSize: "1rem", marginRight: 0.5 }} />
                        Back to All Meals
                    </MuiLink>
                </>
            )}
            {/* Display SubMenu only if there are submenu options */}
            {submenuOptions.length > 0 && <SubMenu options={submenuOptions} />}
            <MealList setCreatedByName={setUserName} />
        </Box>
    );
}

export default MealPage;
