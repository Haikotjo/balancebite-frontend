import { useState, useContext } from "react";
import MealList from "../../components/mealList/MealList.jsx";
import SubMenu from "../../components/mealList/submenu/SubMenu.jsx";
import { Box, Typography } from "@mui/material";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import "./MealsPage.css";
import SearchBar from "../../components/searchBar/SearchBar.jsx";
import NutrientSortOptions from "../../components/mealList/nutrientSortOptions/NutrientSortOptions.jsx";
import {useTheme} from "@mui/material/styles";

/**
 * The MealPage component displays a list of meals and a submenu for filtering options.
 * It dynamically updates the displayed list based on the user's context and selected filter.
 *
 * @component
 */
function MealPage() {
    const [setUserName] = useState(null); // State for displaying creator's name
    const { activeOption } = useContext(UserMealsContext);
    const [setSearchQuery] = useState("");
    const theme = useTheme();

    const [sortBy, setSortBy] = useState(null);

    const handleSort = (nutrient) => {
        setSortBy(nutrient);
        console.log(`Sorting by: ${nutrient}`); // Debugging log
    };

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
            {/* 🔥 Nutrient Sort Options - Altijd rechtsboven in beeld */}
            <Box
                sx={{
                    position: "fixed",
                    top: 100,
                    right: 20,
                    padding: 0,
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                    backgroundColor: theme.palette.primary.dark,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 1,
                        borderBottom: `1px solid rgba(255, 255, 255, 0.3)`,
                        color: theme.palette.text.light,
                    }}
                >
                    Sort
                </Typography>

                <NutrientSortOptions onSort={handleSort} />
            </Box>

            {/* Page Title */}
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

            {/* Search Bar */}
            <SearchBar onSearch={setSearchQuery} />

            {/* SubMenu */}
            <SubMenu />

            {/* Meal List */}
            <Box key={activeOption} className="animated-slide-in-up">
                <MealList setCreatedByName={setUserName} sortBy={sortBy} />
            </Box>
        </Box>
    );
}

export default MealPage;
