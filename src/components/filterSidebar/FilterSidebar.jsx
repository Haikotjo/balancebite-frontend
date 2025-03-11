import { Box, Drawer, IconButton, useMediaQuery, CircularProgress } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import "./FilterSidebar.css";
import useSidebarState from "./hooks/useSidebarState.js";
import useFetchMealEnums from "./hooks/useFetchMealEnums.js";
import FilterSection from "./filterSection/FilterSection.jsx";
import useFilterSelection from "./hooks/useFilterSelection.js";
import SidebarHeader from "./sidebarHeader/SidebarHeader.jsx";

/**
 * FilterSidebar component - Displays a sidebar with filtering options for meals.
 * Users can filter by meal type, diet, and cuisine.
 *
 * The component fetches filter options dynamically and updates selections via a callback function.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Determines whether the sidebar should be initially open.
 * @param {Function} props.onFilter - Callback function triggered when filters are applied or removed.
 * @param {Object} props.filters - The currently applied filters.
 */
const FilterSidebar = ({ isOpen, onFilter, filters }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // Manage sidebar state (open/close)
    const { open, toggleSidebar } = useSidebarState(isOpen);

    // Fetch filterable options (diet types, cuisines, meal types)
    const { diets, cuisines, mealTypes, loading } = useFetchMealEnums(open);

    // Manage selected filters
    const { selectedFilters, handleFilterClick } = useFilterSelection(filters, onFilter);

    return (
        <>
            {/* Floating filter button to open the sidebar */}
            {!open && (
                <IconButton
                    onClick={toggleSidebar}
                    sx={{
                        position: "fixed",
                        top: "30%",
                        right: 0,
                        zIndex: 1500,
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        borderTopRightRadius: "4px",
                        borderBottomRightRadius: "4px",
                        padding: isSmallScreen ? "6px" : "10px",
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }}
                >
                    <FilterList sx={{ fontSize: { xs: 25, sm: 30 }, mr: "4px", ml: "2px" }} />
                </IconButton>
            )}

            {/* Sidebar Drawer - Contains filter options */}
            <Drawer anchor="right" open={open} onClose={toggleSidebar}>
                <Box
                    sx={{
                        width: { xs: 220, sm: 300, md: 400, lg: 520 },
                        height: "100vh",
                        padding: { xs: 1, sm: 2, md: 3, lg: 4 },
                        backgroundColor: theme.palette.background.default,
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 1500,
                        overflowY: "auto",
                        "WebkitOverflowScrolling": "touch",
                        paddingBottom: "20px",
                    }}
                >

                    {/* Sidebar Header with Close Button */}
                    <SidebarHeader title="Filters" onClose={toggleSidebar} />

                    {/* Loading Indicator */}
                    {loading ? (
                        <CircularProgress sx={{ alignSelf: "center", marginY: 2 }} />
                    ) : (
                        <>
                            {/* Filter Sections */}
                            <FilterSection
                                title="Type"
                                items={mealTypes}
                                selectedFilters={selectedFilters}
                                category="mealType"
                                onFilterClick={handleFilterClick}
                            />

                            <FilterSection
                                title="Diet"
                                items={diets}
                                selectedFilters={selectedFilters}
                                category="diet"
                                onFilterClick={handleFilterClick}
                            />

                            <FilterSection
                                title="Cuisine"
                                items={cuisines}
                                selectedFilters={selectedFilters}
                                category="cuisine"
                                onFilterClick={handleFilterClick}
                            />
                        </>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

FilterSidebar.propTypes = {
    isOpen: PropTypes.bool,
    onFilter: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
};

export default FilterSidebar;
