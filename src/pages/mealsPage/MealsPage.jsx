import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MealList from "../../components/mealList/MealList.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import { Box, Typography, Link as MuiLink } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/**
 * MealPage component displays a list of meals and a submenu for navigation.
 */
function MealPage() {
    const { userId } = useParams(); // Get the userId from the URL params
    const [userName, setUserName] = useState(null); // State to store the username
    const [currentListEndpoint, setCurrentListEndpoint] = useState("http://localhost:8080/meals"); // State for the selected endpoint
    const [currentCardEndpoint, setCurrentCardEndpoint] = useState("http://localhost:8080/meals");
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Access logged-in user context

    // Log the user to ensure the context is working
    console.log("Logged-in user:", user);

    // Submenu options for logged-in users
    const submenuOptions = user ? ["All My Meals", "My Created Meals", "Suggested Meals"] : [];

    /**
     * Handle submenu option clicks and update the current endpoint.
     * @param {string} option - The selected submenu option.
     */
    const handleSubMenuClick = (option) => {
        console.log("Submenu option clicked:", option);

        switch (option) {
            case "All My Meals":
                setCurrentListEndpoint("http://localhost:8080/users/meals");
                setCurrentCardEndpoint("http://localhost:8080/users/meal");
                break;
            case "My Created Meals":
                setCurrentListEndpoint("http://localhost:8080/users/created-meals");
                setCurrentCardEndpoint("http://localhost:8080/users/meal");
                break;
            case "Suggested Meals":
                setCurrentListEndpoint("http://localhost:8080/meals/suggestions");
                setCurrentCardEndpoint("http://localhost:8080/meals");
                break;
            default:
                setCurrentListEndpoint("http://localhost:8080/meals");
                setCurrentCardEndpoint("http://localhost:8080/meals");
                break;
        }
    };

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
            {submenuOptions.length > 0 && (
                <SubMenu
                    options={submenuOptions}
                    onOptionClick={handleSubMenuClick} // Pass the handler to SubMenu
                />
            )}
            {/* Pass the selected endpoint to MealList */}
            <MealList endpoint={currentListEndpoint} setCreatedByName={setUserName} cardEndpoint={currentCardEndpoint} />
        </Box>
    );
}

export default MealPage;
