import {useState, useEffect} from "react";
import MealList from "../../components/mealList/MealList.jsx";
import SubMenu from "../../components/mealList/submenu/SubMenu.jsx";
import {Box, IconButton, Typography} from "@mui/material";
import "./MealsPage.css";
import SearchBar from "../../components/searchBar/SearchBar.jsx";
import ActiveFilters from "../../components/mealList/activeFilters/ActiveFilters.jsx";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import {UserMealsContext} from "../../context/UserMealsContext.jsx";
import NutrientSortOptionsHorizontal
    from "../../components/mealList/nutrientSortOptions/NutrientSortOptionsHorizontal.jsx";
import ScrollToTopButton from "../../components/scrollToTopButton/ScrollToTopButton.jsx";
import FilterSidebar from "../../components/filterSidebar/FilterSidebar.jsx";
import SearchIcon from "@mui/icons-material/Search";
import { useRef } from "react";
import {getAllMealNames} from "../../services/apiService.js";
import {useSearchParams} from "react-router-dom";


/**
 * The MealPage component displays a list of meals and a submenu for filtering options.
 * It dynamically updates the displayed list based on the user's context and selected filter.
 *
 * @component
 */
function MealPage() {
    const [setUserName] = useState(null);
    const { userMeals } = useContext(UserMealsContext);
    const [setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState(null);
    const [filters, setFilters] = useState({});
    const { user } = useContext(AuthContext);
    const [activeOption, setActiveOption] = useState(user ? "My Meals" : "All Meals");
    const [searchParams] = useSearchParams();

    const searchRef = useRef(null);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

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
        if (user) {
            setActiveOption(userMeals.length > 0 ? "My Meals" : "All Meals");
        } else {
            setActiveOption("All Meals");
        }
    }, [user, userMeals]);

    useEffect(() => {
        console.log("🔄 Updated activeOption in MealPage:", activeOption);
    }, [activeOption]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchVisible(false);
            }
        };

        if (isSearchVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearchVisible]);

    /**
     * Fetches meals based on search query.
     * @param {string} query - The search query.
     * @returns {Promise<Array>} - List of meal results.
     */
    const handleSearch = async (query) => {
        if (!query) return [];
        return await getAllMealNames(); // Ophalen van meal-namen via API
    };

    /**
     * Handles when a user selects a meal from search results.
     * @param {Object} meal - The selected meal object.
     */
    const handleSelectMeal = (meal) => {
        setSelectedMeal(meal);
        console.log("🔍 Selected meal:", meal);
        // Hier kan je bijvoorbeeld een redirect doen naar de meal detail pagina
        // navigate(`/meals/${meal.id}`);
    };

    useEffect(() => {
        const newFilters = {};

        if (searchParams.get("cuisine")) {
            newFilters.cuisine = searchParams.get("cuisine");
        }
        if (searchParams.get("diet")) {
            newFilters.diet = searchParams.get("diet");
        }
        if (searchParams.get("mealType")) {
            newFilters.mealType = searchParams.get("mealType");
        }

        if (Object.keys(newFilters).length > 0) {
            console.log("🔄 Filters loaded from URL:", newFilters);
            setFilters(newFilters);
        }
    }, [searchParams]);

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

            {/* Page Title */}
            <Typography
                variant="h3"
                sx={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: "bold",
                    textAlign: "center",
                    margin: 0,
                    marginBottom: 4,
                }}
            >
                {activeOption}
            </Typography>

            {/* Search Bar Toggle */}
            {!isSearchVisible ? (
                <IconButton onClick={toggleSearch} sx={{ marginBottom: 2 }}>
                    <SearchIcon sx={{ fontSize: 30 }} />
                </IconButton>
            ) : (
                <div ref={searchRef}>
                    <SearchBar onSearch={handleSearch} onSelect={handleSelectMeal} placeholder="Search for a meal..." />
                </div>
            )}

            {/* Filter Sidebar - Floating Button */}
            <FilterSidebar filters={filters} onFilter={handleFiltersChange} />


            {/* SubMenu */}
            <SubMenu activeOption={activeOption} setActiveOption={setActiveOption} />

            {/* Nutrient Sort Options */}
            <NutrientSortOptionsHorizontal onSort={handleSort} />

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

            {/* "Back to Top" Button */}
            <ScrollToTopButton />
        </Box>
    );
}

export default MealPage;
