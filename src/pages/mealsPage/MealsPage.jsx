import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MealList from "../../components/mealList/MealList.jsx";
import SubMenu from "../../components/mealList/submenu/SubMenu.jsx";
import { AuthContext } from "../../context/AuthContext";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/**
 * The MealPage component displays a list of meals and a submenu for filtering options.
 * It dynamically updates the displayed list based on the user's context and selected filter.
 *
 * @component
 */
function MealPage() {
    const { userId } = useParams(); // Get user ID from route params
    const [userName, setUserName] = useState(null); // State for displaying creator's name
    const navigate = useNavigate(); // Hook for programmatic navigation
    const { user } = useContext(AuthContext); // Access authenticated user context

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
                    <Typography
                        variant="body1"
                        sx={{ fontStyle: "italic", marginBottom: 2 }}
                    >
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
                            "&:hover": { color: "text.primary" },
                        }}
                    >
                        <ArrowBackIcon sx={{ fontSize: "1rem", marginRight: 0.5 }} />
                        Back to All Meals
                    </MuiLink>
                </>
            )}
            {/* SubMenu now handles its own options */}
            <SubMenu />
            <MealList setCreatedByName={setUserName} />
        </Box>
    );
}

export default MealPage;
