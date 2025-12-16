import { SlidersHorizontal } from "lucide-react";
import PropTypes from "prop-types";
import useSidebarState from "../../hooks/useSidebarState.js";
import useFetchMealEnums from "../../hooks/useFetchMealEnums.js";
import FilterSection from "./filterSection/FilterSection.jsx";
import useFilterSelection from "../../hooks/useFilterSelection.js";
import SidebarHeader from "./sidebarHeader/SidebarHeader.jsx";
import CustomDrawer from "../layout/CustomDrawer.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import Spinner from "../layout/Spinner.jsx";
import CustomButton from "../layout/CustomButton.jsx";

/**
 * FilterSidebar component - Displays a sidebar with filtering options for meals.
 * Users can filter by meal types, diets, and cuisines.
 *
 * The component fetches filter options dynamically and updates selections via a callback function.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Determines whether the sidebar should be initially open.
 * @param {Function} props.onFilter - Callback function triggered when filters are applied or removed.
 * @param {Object} props.filters - The currently applied filters.
 */
const FilterSidebar = ({ isOpen = false, onFilter, filters }) => {

    // Manage sidebar state (open/close)
    const { open, toggleSidebar } = useSidebarState(isOpen);

    // Fetch filterable options (diets types, cuisines, meal types)
    const { diets, cuisines, mealTypes, loading } = useFetchMealEnums(open);

    // Manage selected filters
    const { selectedFilters, handleFilterClick } = useFilterSelection(filters, onFilter);

    return (
        <>
            {/* Floating filter button to open the sidebar */}
            {!open && (
                <CustomButton
                    onClick={toggleSidebar}
                    variant="outline"
                    color="neutral"
                    className="
                    fixed top-[10%] right-0 z-[1500]
                    px-3 py-2
                    rounded-r-none rounded-tl-md rounded-bl-md
                    shadow-md origin-center
                    bg-lightBackground/50 dark:bg-darkBackground/50
                    border-borderDark dark:border-borderLight
                    transition-transform duration-150
                    hover:scale-110
                    flex items-center justify-center
                    "
                >
                    <SlidersHorizontal
                        className="
                        text-lightText dark:text-darkText
                        w-4 h-4
                        sm:w-6 sm:h-6
                        md:w-7 md:h-7
                        lg:w-8 lg:h-8
                        "
                    />
                </CustomButton>

            )}


            {/* Sidebar Drawer - Contains filter options */}
            <CustomDrawer
                open={open}
                onClose={toggleSidebar}
                width="w-[220px] sm:w-[300px] md:w-[400px] lg:w-[520px]"
                contentClassName="p-1 sm:p-2 md:p-3 lg:p-4 pb-5 border-l border-borderDark dark:border-borderLight"
            >


                {/* Sidebar Header with Close Button */}
                <SidebarHeader title="Filter" onClose={toggleSidebar} />

                {/* Loading Indicator */}
                {loading ? (
                    <Spinner className="self-center my-2" />
                ) : (
                    <CustomBox className="ml-2">
                        {/* Filter Sections */}
                        <FilterSection
                            title="Types"
                            items={mealTypes}
                            selectedFilters={selectedFilters}
                            category="mealTypes"
                            onFilterClick={handleFilterClick}
                        />

                        <FilterSection
                            title="Diets"
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
                    </CustomBox>
                )}

            </CustomDrawer>
        </>
    );
};

FilterSidebar.propTypes = {
    isOpen: PropTypes.bool,
    onFilter: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
};

export default FilterSidebar;
