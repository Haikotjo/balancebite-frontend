import {useState, useEffect, useRef, useContext} from "react";
import { Box, IconButton, Typography } from "@mui/material";
import SearchBar from "../../components/searchBar/SearchBar.jsx";
import SubMenu from "../../components/submenu/SubMenu.jsx";
import NutrientSortOptionsHorizontal from "../../components/mealList/nutrientSortOptions/NutrientSortOptionsHorizontal.jsx";
import ActiveFilters from "../../components/mealList/activeFilters/ActiveFilters.jsx";
import MealList from "../../components/mealList/MealList.jsx";
import ScrollToTopButton from "../../components/scrollToTopButton/ScrollToTopButton.jsx";
import FilterSidebar from "../../components/filterSidebar/FilterSidebar.jsx";
import { getAllMealNames } from "../../services/apiService.js";
import { useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {UserMealsContext} from "../../context/UserMealsContext.jsx";

function MealPage() {
    const [sortBy, setSortBy] = useState(null);
    const [filters, setFilters] = useState({});
    const { currentListEndpoint } = useContext(UserMealsContext);
    const [searchParams] = useSearchParams();
    const { updateEndpoint } = useContext(UserMealsContext);

    const searchRef = useRef(null);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const getActiveOptionFromEndpoint = () => {
        if (currentListEndpoint.includes("/users/meals")) return "My Meals";
        if (currentListEndpoint.includes("/users/created-meals")) return "Created Meals";
        return "All Meals";
    };

    const [activeOption, setActiveOption] = useState(() => getActiveOptionFromEndpoint());

    useEffect(() => {
        const detectedOption = getActiveOptionFromEndpoint();
        if (activeOption !== detectedOption) {
            console.log("🔄 Updating activeOption in MealPage:", detectedOption);
            setActiveOption(detectedOption);
        }
    }, [currentListEndpoint]);

    useEffect(() => {
        let baseUrl = activeOption === "My Meals"
            ? `${import.meta.env.VITE_BASE_URL}/users/meals?page=0&size=10`
            : activeOption === "Created Meals"
                ? `${import.meta.env.VITE_BASE_URL}/users/created-meals?page=0&size=10`
                : `${import.meta.env.VITE_BASE_URL}/meals?page=0&size=10`;

        updateEndpoint(baseUrl);
    }, [activeOption]);

    const toggleSearch = () => {
        setIsSearchVisible((prev) => !prev);
    };

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
        console.log("🔄 Updated activeOption in MealPage:", activeOption);
    }, [activeOption]);

    useEffect(() => {
        const newFilters = {};
        if (searchParams.get("cuisine")) newFilters.cuisine = searchParams.get("cuisine");
        if (searchParams.get("diet")) newFilters.diet = searchParams.get("diet");
        if (searchParams.get("mealType")) newFilters.mealType = searchParams.get("mealType");

        if (Object.keys(newFilters).length > 0) {
            console.log("🔄 Filters loaded from URL:", newFilters);
            setFilters(newFilters);
        }
    }, [searchParams]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" padding={2}>

            {/* Page Title */}
            <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 4 }}>
                {activeOption}
            </Typography>

            {/* Search Bar Toggle */}
            {!isSearchVisible ? (
                <IconButton onClick={toggleSearch} sx={{ marginBottom: 2 }}>
                    <SearchIcon sx={{ fontSize: 30 }} />
                </IconButton>
            ) : (
                <div ref={searchRef}>
                    <SearchBar onSearch={getAllMealNames} placeholder="Search for a meal..." />
                </div>
            )}

            {/* Filter Sidebar */}
            <FilterSidebar filters={filters} onFilter={handleFiltersChange} />

            {/* SubMenu */}
            <SubMenu activeOption={activeOption} onOptionSelect={setActiveOption} />

            {/* Nutrient Sort Options */}
            <NutrientSortOptionsHorizontal onSort={handleSort} />

            {/* Active Filters */}
            {filters && Object.keys(filters).length > 0 && (
                <ActiveFilters filters={filters} onFilterClick={handleRemoveFilter} />
            )}

            {/* Meal List */}
            <MealList
                sortBy={sortBy}
                filters={filters}
                activeOption={activeOption}
                setActiveOption={setActiveOption}
                onFiltersChange={handleFiltersChange}
            />

            {/* Back to Top */}
            <ScrollToTopButton />
        </Box>
    );
}

export default MealPage;