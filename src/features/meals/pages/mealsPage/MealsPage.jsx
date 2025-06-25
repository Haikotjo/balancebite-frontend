import { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import SearchBar from "../../../../components/searchBar/SearchBar.jsx";
import { getAllMealNames, getStickyItems } from "../../../../services/apiService.js";
import FilterSidebar from "../../../../components/filterSidebar/FilterSidebar.jsx";
import NutrientSortOptionsHorizontal from "../../components/nutrientSortOptions/NutrientSortOptionsHorizontal.jsx";
import MealList from "../../components/mealList/MealList.jsx";
import CustomPagination from "../../../../components/customPagination/CustomPagination.jsx";
import ScrollToTopButton from "../../../../components/scrollToTopButton/ScrollToTopButton.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";
import fetchStickyItemDetails from "../../../../utils/helpers/fetchStickyItemDetails.js";
import MealFilterContent from "../../components/mealfiltercontent/MealFilterContent.jsx";
import ActiveFilterChips from "../../../diets/components/activeFilterChips/ActiveFilterChips.jsx";

function MealPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {
        filters,
        setFilters,
        page,
        setPage,
        totalPages,
        activeOption,
        setActiveOption,
    } = useContext(UserMealsContext);
    const [sortBy, setSortBy] = useState(null);
    const searchRef = useRef(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [pinnedMeals, setPinnedMeals] = useState([]);

    // Apply and clear filters from homepage redirect
    useEffect(() => {
        if (location.state?.filtersFromRedirect) {
            setFilters(location.state.filtersFromRedirect);
            setPage(1);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, setFilters, setPage, location.pathname]);

    const handleSort = (sortKey, sortOrder) => {
        setSortBy({ sortKey, sortOrder });
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    // Support URL query filters
    useEffect(() => {
        const urlFilters = {};
        ["mealTypes", "diets", "cuisines"].forEach((param) => {
            const value = searchParams.get(param);
            if (value) urlFilters[param] = value;
        });
        if (Object.keys(urlFilters).length) {
            setFilters(urlFilters);
        }
    }, [searchParams, setFilters]);

    // Reset page on filter or sort change
    useEffect(() => {
        setPage(1);
    }, [filters, sortBy, setPage]);

    // Active option from URL
    useEffect(() => {
        const option = searchParams.get("option");
        if (option) setActiveOption(option.replace("-", " "));
    }, [searchParams, setActiveOption]);

    // Load pinned meals
    useEffect(() => {
        const load = async () => {
            try {
                const sticky = await getStickyItems();
                const { meals } = await fetchStickyItemDetails(sticky);
                setPinnedMeals(meals.length ? [meals[0]] : []);
            } catch {
                setPinnedMeals([]);
            }
        };
        if (activeOption === "All Meals" && !Object.keys(filters).length && !sortBy) {
            load().catch(console.error);
        } else {
            setPinnedMeals([]);
        }
    }, [activeOption, filters, sortBy]);


    return (
        <CustomBox className="flex flex-col items-center pt-6 sm:pt-10 px-4 pb-24 sm:pb-10">
            <FilterSidebar filters={filters} onFilter={handleFiltersChange} />
            <SubMenu onSelect={setActiveOption} />
            <NutrientSortOptionsHorizontal onSort={handleSort} />
            <MealFilterContent filters={filters} setFilters={setFilters} />
            <CustomBox ref={searchRef} className="w-[300px] md:w-[350px] my-6">
                <SearchBar
                    onSearch={getAllMealNames}
                    onQuerySubmit={(q) => { setSelectedMeal(null); setFilters({ name: q }); }}
                    placeholder="Search for a meal..."
                />
            </CustomBox>
            {(Object.keys(filters).length > 0 || sortBy) && (
                <ActiveFilterChips
                    filters={filters}
                    setFilters={setFilters}
                    creatorIdFilter={filters.creatorId?.toString() ?? null}
                    setCreatorIdFilter={(val) =>
                        setFilters((prev) => {
                            const newFilters = { ...prev };
                            if (val) {
                                newFilters.creatorId = val;
                            } else {
                                delete newFilters.creatorId;
                            }
                            return newFilters;
                        })
                    }
                    creatorName={filters.creatorUserName ?? null}
                    sortKey={sortBy?.sortKey ?? null}
                    setSortKey={(key) => setSortBy((prev) => ({ ...prev, sortKey: key }))}
                    sortOrder={sortBy?.sortOrder ?? null}
                    setSortOrder={(order) => setSortBy((prev) => ({ ...prev, sortOrder: order }))}
                />

            )}

            <MealList
                sortBy={sortBy}
                filters={filters}
                selectedMeal={selectedMeal}
                onFiltersChange={handleFiltersChange}
                pinnedMeals={pinnedMeals}
            />
            {totalPages > 1 && (
                <CustomBox className="mt-2 mb-20 sm:mb-8">
                    <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </CustomBox>
            )}
            <ScrollToTopButton />
        </CustomBox>
    );
}

export default MealPage;
