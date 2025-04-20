import {useState, useEffect, useRef, useContext} from "react";
import { IconButton } from "@mui/material";
import SearchBar from "../../components/searchBar/SearchBar.jsx";
import SubMenu from "../../components/submenu/SubMenu.jsx";
import NutrientSortOptionsHorizontal from "../../components/nutrientSortOptions/NutrientSortOptionsHorizontal.jsx";
import ActiveFilters from "../../components/mealList/activeFilters/ActiveFilters.jsx";
import MealList from "../../components/mealList/MealList.jsx";
import ScrollToTopButton from "../../components/scrollToTopButton/ScrollToTopButton.jsx";
import FilterSidebar from "../../components/filterSidebar/FilterSidebar.jsx";
import { getAllMealNames } from "../../services/apiService.js";
import {useSearchParams} from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {UserMealsContext} from "../../context/UserMealsContext.jsx";
import CustomPagination from "../../components/customPagination/CustomPagination.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";

function MealPage() {
    const [sortBy, setSortBy] = useState(null);
    const [filters, setFilters] = useState({});
    const { page, setPage, totalPages } = useContext(UserMealsContext);
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
        const newFilters = {};
        if (searchParams.get("mealTypes")) newFilters.mealTypes = searchParams.get("mealTypes");
        if (searchParams.get("diets")) newFilters.diets = searchParams.get("diets");
        if (searchParams.get("cuisines")) newFilters.cuisines = searchParams.get("cuisines");

        if (Object.keys(newFilters).length > 0) {
            setFilters(newFilters);
        }
    }, [searchParams]);

    useEffect(() => {
        setPage(1);
    }, [filters, sortBy, setPage]);



    return (
        <CustomBox className="flex flex-col items-center p-4">

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
            <SubMenu  />

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
                onFiltersChange={handleFiltersChange}
            />

            {totalPages > 1 && (
                <CustomPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            )}


            {/* Back to Top */}
            <ScrollToTopButton />
        </CustomBox>
    );
}

export default MealPage;