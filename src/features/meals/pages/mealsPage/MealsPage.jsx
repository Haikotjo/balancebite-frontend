import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import SearchBar from "../../../../components/searchBar/SearchBar.jsx";
import { getAllMealNames, searchUsersApi } from "../../../../services/apiService.js";
import FilterSidebar from "../../../../components/filterSidebar/FilterSidebar.jsx";
import SortSidebar from "../../components/sortSidebar/SortSidebar.jsx";
import SidebarTriggerGroup from "../../../../components/sidebarTriggerGroup/SidebarTriggerGroup.jsx";
import SidebarButton from "../../../../components/sidebarTriggerGroup/SidebarButton.jsx";
import MealList from "../../components/mealList/MealList.jsx";
import ScrollToTopButton from "../../../../components/scrollToTopButton/ScrollToTopButton.jsx";
import MealsSubMenu from "../../components/subMenu/MealsSubMenu.jsx";
import ActiveFilterChips from "../../../diets/components/activeFilterChips/ActiveFilterChips.jsx";
import NutrientRangeSidebar from "../../components/nutrientRangeSidebar/NutrientRangeSidebar.jsx";
import StoreSidebar from "../../components/storeSidebar/StoreSidebar.jsx";
import { SlidersHorizontal, Gauge, Store, ArrowDownUp } from "lucide-react";
import usePinnedMeals from "../../hooks/usePinnedMeals.js";
import useInfiniteScroll from "../../hooks/useInfiniteScroll.js";
import useMealsUrlSync from "../../hooks/useMealsUrlSync.js";
import countNutrientFilters from "../../utils/countNutrientFilters.js";
import Spinner from "../../../../components/layout/Spinner.jsx";
import PageWrapper from "../../../../components/layout/PageWrapper.jsx";

function MealsPage() {
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
        error,
        setSortBy: setContextSortBy,
    } = useContext(UserMealsContext);

    const [sortBy, setSortBy] = useState(null);

    const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
    const [sortSidebarOpen, setSortSidebarOpen] = useState(false);
    const [nutrientSidebarOpen, setNutrientSidebarOpen] = useState(false);
    const [storeSidebarOpen, setStoreSidebarOpen] = useState(false);

    const pinnedMeals = usePinnedMeals(activeOption, filters, sortBy);

    const filtersActive = useMemo(() => Object.keys(filters).length > 0 || !!sortBy, [filters, sortBy]);
    const sidebarFilterCount = useMemo(
        () => Object.keys(filters).filter((k) => ["mealTypes", "diets", "cuisines"].includes(k)).length,
        [filters]
    );
    const nutrientFilterCount = useMemo(() => countNutrientFilters(filters), [filters]);

    const handleSort = useCallback((sortKey, sortOrder) => {
        const newSort = sortKey ? { sortKey, sortOrder } : null;
        setSortBy(newSort);
        setContextSortBy(newSort);
    }, [setContextSortBy]);

    const [allMealNames, setAllMealNames] = useState([]);
    useEffect(() => {
        getAllMealNames().then(results =>
            setAllMealNames(results.map(m => ({ type: "meal", ...m })))
        ).catch(() => {});
    }, []);

    const handleCombinedSearch = useCallback(async (query) => {
        const lower = query.toLowerCase();
        const mealResults = allMealNames.filter(m => m.name?.toLowerCase().includes(lower));
        const users = await searchUsersApi(query);
        return [
            ...mealResults,
            ...users.map(u => ({ type: "user", id: u.id, name: u.userName })),
        ];
    }, [allMealNames]);

    useMealsUrlSync({ setFilters, setPage, setActiveOption, setFilterSidebarOpen, setSortSidebarOpen });

    // Reset to page 1 when filters or sort change so infinite scroll starts fresh
    useEffect(() => {
        setPage(1);
    }, [filters, sortBy, setPage]);

    const sentinelRef = useInfiniteScroll({
        loading,
        page,
        totalPages,
        onLoadMore: () => setPage(p => p + 1),
    });

    return (
        <PageWrapper className="flex flex-col items-center">
            <FilterSidebar
                open={filterSidebarOpen}
                onToggle={() => setFilterSidebarOpen((p) => !p)}
                filters={filters}
                onFilter={setFilters}
            />
            <SortSidebar
                open={sortSidebarOpen}
                onToggle={() => setSortSidebarOpen((p) => !p)}
                onSort={handleSort}
                sortBy={sortBy}
            />
            <NutrientRangeSidebar
                open={nutrientSidebarOpen}
                onToggle={() => setNutrientSidebarOpen((p) => !p)}
                filters={filters}
                setFilters={setFilters}
            />
            <StoreSidebar
                open={storeSidebarOpen}
                onToggle={() => setStoreSidebarOpen((p) => !p)}
                filters={filters}
                setFilters={setFilters}
            />
            <SidebarTriggerGroup
                filterOpen={filterSidebarOpen}
                onFilterToggle={() => setFilterSidebarOpen((p) => !p)}
                filterCount={sidebarFilterCount}
                nutrientOpen={nutrientSidebarOpen}
                onNutrientToggle={() => setNutrientSidebarOpen((p) => !p)}
                nutrientCount={nutrientFilterCount}
                storeOpen={storeSidebarOpen}
                onStoreToggle={() => setStoreSidebarOpen((p) => !p)}
                storeActive={!!filters.foodSource}
                sortOpen={sortSidebarOpen}
                onSortToggle={() => setSortSidebarOpen((p) => !p)}
                sortActive={!!sortBy}
            />

            <MealsSubMenu onSelect={setActiveOption} />

            <div className="hidden md:flex flex-wrap justify-center gap-2 mb-4">
                <SidebarButton icon={SlidersHorizontal} label="Filters" badge={sidebarFilterCount} onClick={() => setFilterSidebarOpen(true)} />
                <SidebarButton icon={Gauge} label="Nutrients" badge={nutrientFilterCount} onClick={() => setNutrientSidebarOpen(true)} />
                <SidebarButton icon={Store} label="Store" badge={filters.foodSource ? 1 : 0} onClick={() => setStoreSidebarOpen(true)} />
                <SidebarButton icon={ArrowDownUp} label="Sort" badge={sortBy ? 1 : 0} onClick={() => setSortSidebarOpen(true)} />
            </div>

            <SearchBar
                onSearch={handleCombinedSearch}
                onQuerySubmit={(val) => {
                    if (typeof val === "string") {
                        setFilters({ name: val });
                    } else if (typeof val === "object" && val.creatorId) {
                        setFilters({ creatorId: val.creatorId, creatorUserName: val.creatorUserName });
                    }
                }}
                placeholder="Search for a meal or user..."
                placeholderCompact="Search meals..."
            />

            {filtersActive && (
                <ActiveFilterChips
                    filters={filters}
                    setFilters={setFilters}
                    creatorIdFilter={filters.creatorId?.toString() ?? null}
                    setCreatorIdFilter={(val) =>
                        setFilters((prev) => {
                            const updated = { ...prev };
                            if (val) updated.creatorId = val;
                            else delete updated.creatorId;
                            return updated;
                        })
                    }
                    creatorName={filters.creatorUserName ?? null}
                    sortKey={sortBy?.sortKey ?? null}
                    setSortKey={(key) => handleSort(key, sortBy?.sortOrder ?? "asc")}
                    sortOrder={sortBy?.sortOrder ?? "asc"}
                    setSortOrder={(order) => handleSort(sortBy?.sortKey ?? null, order)}
                />
            )}

            {loading && page === 1 ? (
                <Spinner className="mx-auto my-10" />
            ) : error ? (
                <p className="text-center mt-10 text-sm text-error">Error: {error}</p>
            ) : meals.length === 0 ? (
                <p className="text-center mt-10 text-sm italic text-content-muted">
                    {filtersActive ? "No meals found matching your filters." : "No public meals available yet."}
                </p>
            ) : (
                <>
                    <p className="text-xs italic text-content-muted ml-2">* Macros are shown per serving</p>
                    <MealList
                        sortBy={sortBy}
                        filters={filters}
                        selectedMeal={null}
                        onFiltersChange={setFilters}
                        pinnedMeals={pinnedMeals}
                    />
                </>
            )}

            <div ref={sentinelRef} className="h-10" />
            {loading && page > 1 && <Spinner className="mx-auto my-6" />}
            <ScrollToTopButton />
        </PageWrapper>
    );
}

export default MealsPage;
