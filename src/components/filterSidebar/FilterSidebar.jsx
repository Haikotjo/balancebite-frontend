import PropTypes from "prop-types";
import clsx from "clsx";
import { useRef, useEffect } from "react";
import useFetchMealEnums from "../../hooks/useFetchMealEnums.js";
import FilterSection from "./filterSection/FilterSection.jsx";
import useFilterSelection from "../../hooks/useFilterSelection.js";
import SidebarHeader from "./sidebarHeader/SidebarHeader.jsx";
import Spinner from "../layout/Spinner.jsx";

const SIDEBAR_KEYS = ["mealTypes", "diets", "cuisines"];

const FilterSidebar = ({ open, onToggle, onFilter, filters }) => {
    const { diets, cuisines, mealTypes, loading } = useFetchMealEnums(open);
    const { selectedFilters, setSelectedFilters, handleFilterClick } = useFilterSelection(filters, onFilter);
    const drawerRef = useRef(null);

    const activeCount = Object.keys(selectedFilters).filter((k) => SIDEBAR_KEYS.includes(k)).length;

    useEffect(() => {
        const handler = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                onToggle();
            }
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, onToggle]);

    const handleClearAll = () => {
        const stripped = Object.fromEntries(
            Object.entries(selectedFilters).filter(([k]) => !SIDEBAR_KEYS.includes(k))
        );
        setSelectedFilters(stripped);
        onFilter(stripped);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 z-[1400] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300",
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                )}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={clsx(
                    "fixed right-0 top-0 z-[1500] h-full w-[300px] sm:w-[360px] transform transition-transform duration-300 ease-in-out",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex h-full flex-col overflow-hidden rounded-l-2xl border-l border-border bg-surface shadow-2xl">
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
                </div>
            </div>
        </>
    );
};

FilterSidebar.propTypes = {
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
};

export default FilterSidebar;