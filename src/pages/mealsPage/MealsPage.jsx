import {useState, useEffect} from "react";
import MealList from "../../components/mealList/MealList.jsx";
import SubMenu from "../../components/mealList/submenu/SubMenu.jsx";
import { Box, Typography } from "@mui/material";
import "./MealsPage.css";
import SearchBar from "../../components/searchBar/SearchBar.jsx";
import NutrientSortOptions from "../../components/mealList/nutrientSortOptions/NutrientSortOptions.jsx";
import ActiveFilters from "../../components/mealList/activeFilters/ActiveFilters.jsx";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";

/**
 * The MealPage component displays a list of meals and a submenu for filtering options.
 * It dynamically updates the displayed list based on the user's context and selected filter.
 *
 * @component
 */
function MealPage() {
    const [setUserName] = useState(null); // State for displaying creator's name
    // const { activeOption } = useContext(UserMealsContext);
    const [setSearchQuery] = useState("");

    const [sortBy, setSortBy] = useState(null);
    const [filters, setFilters] = useState({});
    const { user } = useContext(AuthContext);
    const { userMeals } = useContext(UserMealsContext);

    const [activeOption, setActiveOption] = useState(
        user && userMeals.length > 0 ? "My Meals" : "All Meals"
    );


    const handleSort = (sortKey, sortOrder) => {
        setSortBy({ sortKey, sortOrder });
    };

    const handleFiltersChange = (newFilters) => {
        console.log("🎯 Received filters in MealPage:", newFilters);
        setFilters(newFilters);
    };

    const handleRemoveFilter = (category) => {
        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            delete updatedFilters[category];
            console.log("🗑️ Removed filter:", category, "Updated filters:", updatedFilters);
            return updatedFilters;
        });
    };

    useEffect(() => {
        if (user && userMeals.length > 0) {
            setActiveOption("My Meals");
        }
    }, [userMeals, user]);

    useEffect(() => {
        console.log("🔄 Updated activeOption in MealPage:", activeOption);
    }, [activeOption]);


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
            <SubMenu activeOption={activeOption} setActiveOption={setActiveOption} />

            {/* Active Filters - Only render if there are active filters */}
            {filters && Object.keys(filters).length > 0 && (
                <ActiveFilters filters={filters} onFilterClick={handleRemoveFilter} />
            )}

            {/* Meal List */}
            <Box key={activeOption} className="animated-slide-in-up">
                <MealList
                    setCreatedByName={setUserName}
                    sortBy={sortBy}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    activeOption={activeOption}
                    setActiveOption={setActiveOption}
                />
            </Box>
        </Box>
    );
}

export default MealPage;
