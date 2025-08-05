import { useContext, useEffect, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import SearchBar from "../../../../components/searchBar/SearchBar.jsx";
import {getAllMealNames, getStickyItems, searchUsersApi} from "../../../../services/apiService.js";
import FilterSidebar from "../../../../components/filterSidebar/FilterSidebar.jsx";
import NutrientSortOptionsHorizontal from "../../components/nutrientSortOptions/NutrientSortOptionsHorizontal.jsx";
import MealList from "../../components/mealList/MealList.jsx";
import CustomPagination from "../../../../components/customPagination/CustomPagination.jsx";
import ScrollToTopButton from "../../../../components/scrollToTopButton/ScrollToTopButton.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";
import fetchStickyItemDetails from "../../../../utils/helpers/fetchStickyItemDetails.js";
import MealFilterContent from "../../components/mealfiltercontent/MealFilterContent.jsx";
import ActiveFilterChips from "../../../diets/components/activeFilterChips/ActiveFilterChips.jsx";
import AccordionItem from "../../../diets/components/accordionItem/AccordionItem.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";

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
        meals,
        loading,
        error
    } = useContext(UserMealsContext);
    const [sortBy, setSortBy] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [pinnedMeals, setPinnedMeals] = useState([]);

    const filtersActive = Object.keys(filters).length > 0 || sortBy;

    const handleCombinedSearch = async (query) => {
        const [meals, users] = await Promise.all([
            getAllMealNames(query),
            searchUsersApi(query)
        ]);

        const mealOptions = meals.map(m => ({ type: "meal", ...m }));
        const userOptions = users.map(u => ({ type: "user", id: u.id, name: u.userName }));

        return [...mealOptions, ...userOptions];
    };


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
        <CustomBox className="flex flex-col items-center pt-6 sm:pt-10 px-4 pb-24 md:ml-16 lg:ml-28">
        <FilterSidebar filters={filters} onFilter={handleFiltersChange}/>
            <SubMenu onSelect={setActiveOption}/>
            <NutrientSortOptionsHorizontal onSort={handleSort}/>

            <CustomBox className="block md:hidden w-full">
                <AccordionItem title="Nutrient range filter">
                    <MealFilterContent filters={filters} setFilters={setFilters}/>
                </AccordionItem>
            </CustomBox>

            <CustomBox className="hidden md:block w-full">
                <MealFilterContent filters={filters} setFilters={setFilters}/>
            </CustomBox>

            <CustomBox className="w-[300px] md:w-[350px] my-6">
                <SearchBar
                    onSearch={handleCombinedSearch}
                    onQuerySubmit={(val) => {
                        setSelectedMeal(null);
                        if (typeof val === "string") {
                            setFilters({ name: val });
                        } else if (typeof val === "object" && val.creatorId) {
                            setFilters({ creatorId: val.creatorId, creatorUserName: val.creatorUserName });
                        }
                    }}
                    placeholder="Search for a meal or user..."
                />

            </CustomBox>
            {(Object.keys(filters).length > 0 || sortBy) && (
                <ActiveFilterChips
                    filters={filters}
                    setFilters={setFilters}
                    creatorIdFilter={filters.creatorId?.toString() ?? null}
                    setCreatorIdFilter={(val) =>
                        setFilters((prev) => {
                            const newFilters = {...prev};
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
                    setSortKey={(key) => setSortBy((prev) => ({...prev, sortKey: key}))}
                    sortOrder={sortBy?.sortOrder ?? null}
                    setSortOrder={(order) => setSortBy((prev) => ({...prev, sortOrder: order}))}
                />

            )}

            {loading ? (
                <Spinner className="mx-auto my-10" />
            ) : error ? (
                <CustomTypography
                    variant="paragraph"
                    color="text-red-600"
                    className="text-center mt-10"
                >
                    Error: {error}
                </CustomTypography>
            ) : meals.length === 0 ? (
                <CustomTypography
                    variant="paragraph"
                    italic
                    color="text-gray-500"
                    className="text-center mt-10"
                >
                    {filtersActive
                        ? "No meals found matching your filters."
                        : "No public meals available yet."}
                </CustomTypography>
            ) : (
                <MealList
                    sortBy={sortBy}
                    filters={filters}
                    selectedMeal={selectedMeal}
                    onFiltersChange={handleFiltersChange}
                    pinnedMeals={pinnedMeals}
                />
            )}


            {totalPages > 1 && (
                <CustomBox className="mt-2 mb-20 sm:mb-8">
                    <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
                </CustomBox>
            )}
            <ScrollToTopButton/>
        </CustomBox>
    );
}

export default MealPage;
