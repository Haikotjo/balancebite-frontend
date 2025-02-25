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

    const handleSort = (sortKey, sortOrder) => {
        setSortBy({ sortKey, sortOrder });
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

            {/* Nutrient Sort Options */}
            <NutrientSortOptions onSort={handleSort} />

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
