import {useContext, useEffect, useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {UserMealsContext} from "../../../../context/UserMealsContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import SearchBar from "../../../../components/searchBar/SearchBar.jsx";
import {getAllMealNames} from "../../../../services/apiService.js";
import FilterSidebar from "../../../../components/filterSidebar/FilterSidebar.jsx";
import NutrientSortOptionsHorizontal from "../../components/nutrientSortOptions/NutrientSortOptionsHorizontal.jsx";
import ActiveFilters from "../../components/activeFilters/ActiveFilters.jsx";
import MealList from "../../components/mealList/MealList.jsx";
import CustomPagination from "../../../../components/customPagination/CustomPagination.jsx";
import ScrollToTopButton from "../../../../components/scrollToTopButton/ScrollToTopButton.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";
import CustomModal from "../../../../components/layout/CustomModal.jsx";
import MealDetailCard from "../../components/mealCardLarge/MealDetailCard.jsx";
import MealCard from "../../components/mealCard/MealCard.jsx";
import MealModal from "../../components/mealModal/MealModal.jsx";
import useIsSmallScreen from "../../../../hooks/useIsSmallScreen.js";

function MealPage() {
    const [sortBy, setSortBy] = useState(null);
    const [filters, setFilters] = useState({});
    const { page, setPage, totalPages, setActiveOption } = useContext(UserMealsContext);
    const [searchParams] = useSearchParams();
    const searchRef = useRef(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const isSmallScreen = useIsSmallScreen();

    const handleOpenModal = (meal) => {
        setSelectedMeal(meal);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMeal(null);
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


    useEffect(() => {
        const filterParam = searchParams.get("filter");
        if (filterParam) {
            // update context zodat MealList weet wat de bron is
            setActiveOption(filterParam);
        }
    }, [searchParams, setActiveOption]);


    return (
        <CustomBox className="flex flex-col items-center pt-4 gap-4 pb-20 sm:pb-0">



            {/* Filter Sidebar */}
            <FilterSidebar filters={filters} onFilter={handleFiltersChange} />

            {/* SubMenu */}
            <SubMenu  />

            {/* Nutrient Sort Options */}
            <NutrientSortOptionsHorizontal onSort={handleSort} />

            {/* Search Bar */}
            <CustomBox
                ref={searchRef}
                className="w-[300px] md:w-[350px] mt-2"
            >
                <SearchBar
                    onSearch={getAllMealNames}
                    onQuerySubmit={(query) => {
                        setSelectedMeal(null);
                        setFilters({ name: query });
                    }}
                    placeholder="Search for a meal..."
                />
            </CustomBox>

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
                onMealClick={isSmallScreen ? undefined : handleOpenModal}
            />

            {totalPages > 1 && (
                <CustomBox className="mt-2 mb-20 sm:mb-8">
                    <CustomPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </CustomBox>
            )}

            {/* Back to Top */}
            <ScrollToTopButton />
            {/* Modal met MealDetailCard */}
            <MealModal isOpen={showModal} onClose={handleCloseModal} meal={selectedMeal} />
        </CustomBox>
    );
}

export default MealPage;