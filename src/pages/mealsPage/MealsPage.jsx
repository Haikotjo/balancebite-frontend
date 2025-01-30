import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MealList from "../../components/mealList/MealList.jsx";
import SubMenu from "../../components/mealList/submenu/SubMenu.jsx";
import { AuthContext } from "../../context/AuthContext";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import AnimatedBox from "../../components/home/animatedBox/AnimatedBox.jsx";
import './MealsPage.css';
import SearchBar from "../../components/searchBar/SearchBar.jsx";


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
    const { activeOption } = useContext(UserMealsContext);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                minHeight: "100vh",
                padding: 2,
            }}
        >
            {/* Animated Title */}
            <AnimatedBox animation="slideIn" direction="down" marginBottom={1}>
                <Typography
                    variant="h3"
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: "bold",
                        textAlign: "center",
                        margin: 0,
                    }}
                >
                    {activeOption}
                </Typography>
            </AnimatedBox>

            {/* Animated SubMenu */}
            <AnimatedBox animation="slideIn" direction="right" marginBottom={1} padding={0}>
                <SearchBar onSearch={setSearchQuery} />
            </AnimatedBox>

            {/* Animated SubMenu */}
            <AnimatedBox animation="slideIn" direction="left" marginBottom={0} padding={0}>
                <SubMenu />
            </AnimatedBox>

            {/* Meal List */}
            <Box
                key={activeOption}
                className="animated-slide-in-up"
            >
                <MealList setCreatedByName={setUserName} />
            </Box>
        </Box>
    );
}

export default MealPage;
