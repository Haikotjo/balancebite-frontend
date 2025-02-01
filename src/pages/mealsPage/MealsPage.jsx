import { useState, useContext } from "react";
import MealList from "../../components/mealList/MealList.jsx";
import SubMenu from "../../components/mealList/submenu/SubMenu.jsx";
import { Box, Typography } from "@mui/material";
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
    const [ setUserName] = useState(null); // State for displaying creator's name
    const { activeOption } = useContext(UserMealsContext);
    const [ setSearchQuery] = useState("");

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
