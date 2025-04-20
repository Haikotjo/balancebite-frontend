import {useState, useEffect, useRef, useContext} from "react";
import SearchBar from "../../components/searchBar/SearchBar.jsx";
import SubMenu from "../../components/submenu/SubMenu.jsx";
import NutrientSortOptionsHorizontal from "../../components/nutrientSortOptions/NutrientSortOptionsHorizontal.jsx";
import ActiveFilters from "../../components/mealList/activeFilters/ActiveFilters.jsx";
import MealList from "../../components/mealList/MealList.jsx";
import ScrollToTopButton from "../../components/scrollToTopButton/ScrollToTopButton.jsx";
import FilterSidebar from "../../components/filterSidebar/FilterSidebar.jsx";
import { getAllMealNames, fetchMealById } from "../../services/apiService.js";
import {useSearchParams} from "react-router-dom";
import { Search } from "lucide-react";
import {UserMealsContext} from "../../context/UserMealsContext.jsx";
import CustomPagination from "../../components/customPagination/CustomPagination.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomIconButton from "../../components/layout/CustomIconButton.jsx";

function MealPage() {
    const [sortBy, setSortBy] = useState(null);
    const [filters, setFilters] = useState({});
    const { page, setPage, totalPages } = useContext(UserMealsContext);
    const [searchParams] = useSearchParams();
    const searchRef = useRef(null);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);


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
        <CustomBox className="flex flex-col items-center pt-4 gap-4">

            {/* Search Bar Toggle */}
            {!isSearchVisible ? (
                <CustomIconButton
                    onClick={toggleSearch}
                    icon={<Search size={30} className="text-primary" />}
                    bgColor="bg-transparent"
                    className="mb-4"
                />
            ) : (
                <CustomBox ref={searchRef}>
                    <SearchBar
                        onSearch={getAllMealNames}
                        onQuerySubmit={(query) => {
                            setSelectedMeal(null);
                            setFilters({ name: query });
                        }}
                        placeholder="Search for a meal..."
                    />
                </CustomBox>
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
                selectedMeal={selectedMeal}
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