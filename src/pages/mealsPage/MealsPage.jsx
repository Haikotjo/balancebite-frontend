import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MealList from "../../components/mealList/MealList.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";
import { AuthContext } from "../../context/AuthContext";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function MealPage() {
    const { userId } = useParams();
    const [userName, setUserName] = useState(null);
    const [currentListEndpoint, setCurrentListEndpoint] = useState("http://localhost:8080/meals");
    const [currentCardEndpoint, setCurrentCardEndpoint] = useState("http://localhost:8080/meals");
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const submenuOptions = user ? ["All My Meals", "My Created Meals", "Suggested Meals"] : [];

    const handleSubMenuClick = (option) => {
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
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: 2 }}>
            <Typography variant="h3" gutterBottom>All Meals</Typography>
            {userId && userName && (
                <>
                    <Typography variant="body1" sx={{ fontStyle: "italic", marginBottom: 2 }}>{userName} created and added</Typography>
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
                            "&:hover": { color: "text.primary" },
                        }}
                    >
                        <ArrowBackIcon sx={{ fontSize: "1rem", marginRight: 0.5 }} />
                        Back to All Meals
                    </MuiLink>
                </>
            )}
            {submenuOptions.length > 0 && <SubMenu options={submenuOptions} onOptionClick={handleSubMenuClick} />}
            <MealList endpoint={currentListEndpoint} cardEndpoint={currentCardEndpoint} setCreatedByName={setUserName} />
        </Box>
    );
}

export default MealPage;
