import PropTypes from "prop-types";
import useFetchMealEnums from "../../hooks/useFetchMealEnums.js";
import FilterSection from "./filterSection/FilterSection.jsx";
import useFilterSelection from "../../hooks/useFilterSelection.js";
import SidebarHeader from "./sidebarHeader/SidebarHeader.jsx";
import Spinner from "../layout/Spinner.jsx";
import SidebarShell from "../sidebarShell/SidebarShell.jsx";

const SIDEBAR_KEYS = ["mealTypes", "diets", "cuisines"];

const FilterSidebar = ({ open, onToggle, onFilter, filters }) => {
    const { diets, cuisines, mealTypes, loading } = useFetchMealEnums(open);
    const { selectedFilters, setSelectedFilters, handleFilterClick } = useFilterSelection(filters, onFilter);

    const activeCount = Object.keys(selectedFilters).filter((k) => SIDEBAR_KEYS.includes(k)).length;

    const handleClearAll = () => {
        const stripped = Object.fromEntries(
            Object.entries(selectedFilters).filter(([k]) => !SIDEBAR_KEYS.includes(k))
        );
        setSelectedFilters(stripped);
        onFilter(stripped);
    };

    return (
        <SidebarShell open={open} onToggle={onToggle}>
            <div className="px-5 pt-5">
                <SidebarHeader onClose={onToggle} activeCount={activeCount} />
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-2">
                {loading ? (
                    <Spinner className="mx-auto my-8" />
                ) : (
                    <>
                        <FilterSection
                            title="Meal Type"
                            items={mealTypes}
                            selectedFilters={selectedFilters}
                            category="mealTypes"
                            onFilterClick={handleFilterClick}
                        />
                        <FilterSection
                            title="Diet"
                            items={diets}
                            selectedFilters={selectedFilters}
                            category="diets"
                            onFilterClick={handleFilterClick}
                        />
                        <FilterSection
                            title="Cuisine"
                            items={cuisines}
                            selectedFilters={selectedFilters}
                            category="cuisines"
                            onFilterClick={handleFilterClick}
                        />
                    </>
                )}
            </div>

            {activeCount > 0 && (
                <div className="border-t border-border px-5 py-4">
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="w-full rounded-xl border border-error/40 py-2 text-sm font-medium text-error transition-colors hover:bg-error/10"
                    >
                        Clear {activeCount} filter{activeCount !== 1 ? "s" : ""}
                    </button>
                </div>
            )}
        </SidebarShell>
    );
};

FilterSidebar.propTypes = {
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
};

export default FilterSidebar;